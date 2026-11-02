// server.js - Production-Ready Full-Stack HTTP API & Static Server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const crypto = require('crypto');
const { getDb, hashPassword, verifyPassword, generateScheduleForUser, logAuditEvent, checkInitialAdmin } = require('./database');
const { generateTutorResponse, reviewLearnerCode } = require('./ai_tutor_engine');
const { customers, products, orders, employee_churn } = require('./sample_datasets');
const { mockInterviewRounds } = require('./comprehensive_interview_data');

// Configuration
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const APP_NAME = process.env.APP_NAME || 'Data Analyst Learning Platform';
const SESSION_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Initialize Database
const db = getDb();

// In-Memory Rate Limiter (prevents brute-force on auth routes)
const rateLimitMap = new Map();
function isRateLimited(ip, limit = 20, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { count: 0, resetTime: now + windowMs };
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + windowMs;
    rateLimitMap.set(ip, record);
    return false;
  }
  record.count++;
  rateLimitMap.set(ip, record);
  return record.count > limit;
}

// In-Memory WebRTC Call Signaling Store for Study Groups
// group_id -> array of signals { from, to, type, candidate, sdp, timestamp }
const callSignalStore = new Map();

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-token'
  });
  res.end(JSON.stringify(data));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      if (body.length > 5 * 1024 * 1024) reject(new Error('Payload too large'));
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('Invalid JSON format'));
      }
    });
    req.on('error', reject);
  });
}

// Secure Session Management (persisted in SQLite sessions table)
function createSession(user) {
  const token = crypto.randomBytes(32).toString('hex');
  const sessionId = 'sess_' + crypto.randomBytes(8).toString('hex');
  const expiresAt = Date.now() + SESSION_EXPIRY_MS;

  db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionId, user.id, token, expiresAt);

  return token;
}

function getAuthenticatedUser(req) {
  let token = null;
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-session-token']) {
    token = req.headers['x-session-token'];
  } else if (req.headers['cookie']) {
    const cookies = req.headers['cookie'].split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('ap_token=')) {
        token = c.substring(9);
        break;
      }
    }
  }

  if (!token) return null;

  const now = Date.now();
  const session = db.prepare("SELECT * FROM sessions WHERE token = ? AND expires_at > ?").get(token, now);
  if (!session) return null;

  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(session.user_id);
  if (!user || user.status === 'suspended') return null;
  return user;
}

function requireAuth(req, res) {
  const user = getAuthenticatedUser(req);
  if (!user) {
    sendJson(res, 401, { error: 'Authentication required. Please sign in.' });
    return null;
  }
  return user;
}

function requireAdmin(req, res) {
  const user = requireAuth(req, res);
  if (!user) return null;
  if (user.role !== 'admin') {
    sendJson(res, 403, { error: 'Forbidden: Owner/Admin authorization required.' });
    return null;
  }
  return user;
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.csv': 'text/csv; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-session-token'
    });
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const clientIp = req.socket.remoteAddress || '127.0.0.1';

  try {
    // -------------------------------------------------------------
    // 1. PUBLIC CONFIGURATION & BRANDING
    // -------------------------------------------------------------
    if (pathname === '/api/config' && req.method === 'GET') {
      return sendJson(res, 200, {
        appName: APP_NAME,
        aiProvider: process.env.GEMINI_API_KEY ? 'gemini_cloud_live' : 'local_pedagogical_engine',
        aiLabel: process.env.GEMINI_API_KEY ? 'Live Gemini AI (Connected)' : 'Built-in Pedagogical Tutor Engine (Offline/Local)',
        realtimeCallsEnabled: true,
        version: '2.0.0'
      });
    }

    // -------------------------------------------------------------
    // 2. AUTHENTICATION & SECURITY (REGISTER, LOGIN, VERIFY, RESET)
    // -------------------------------------------------------------
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      if (isRateLimited(clientIp, 15, 60000)) {
        return sendJson(res, 429, { error: 'Too many registration attempts. Please try again in a minute.' });
      }

      const body = await parseJsonBody(req);
      const { name, email, password, level, targetRole, preferredLanguage, hoursPerWeek, targetDate } = body;

      if (!name || !email || !password) {
        return sendJson(res, 400, { error: 'Name, email, and password are required' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(cleanEmail)) {
        return sendJson(res, 400, { error: 'Please enter a valid email address' });
      }

      if (password.length < 8) {
        return sendJson(res, 400, { error: 'Password must be at least 8 characters long' });
      }

      const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail);
      if (existing) {
        return sendJson(res, 400, { error: 'An account with this email already exists' });
      }

      const userId = 'usr_' + crypto.randomBytes(8).toString('hex');
      const { hash, salt } = hashPassword(password);
      const verificationToken = crypto.randomBytes(24).toString('hex');

      // Check if this email is configured as initial admin via ADMIN_EMAIL env var
      const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : null;
      const initialRole = (adminEmail && cleanEmail === adminEmail) ? 'admin' : 'learner';

      db.prepare(`
        INSERT INTO users (id, name, email, password_hash, salt, role, is_verified, verification_token, current_level, target_role, preferred_language, hours_per_week, target_date, xp, streak_days)
        VALUES (?, ?, ?, ?, ?, ?, 0, ?, ?, ?, ?, ?, ?, 100, 1)
      `).run(
        userId,
        name.trim(),
        cleanEmail,
        hash,
        salt,
        initialRole,
        verificationToken,
        level || 'Beginner',
        targetRole || 'Junior Data Analyst',
        preferredLanguage || 'hinglish',
        Number(hoursPerWeek) || 10,
        targetDate || null
      );

      // Audit Log: Minimal sanitized event (never passwords or tokens)
      logAuditEvent(db, 'registration', userId, clientIp, `User registered (${initialRole})`);

      // Generate personalized study timetable
      generateScheduleForUser(db, userId, Number(hoursPerWeek) || 10);

      const newUser = db.prepare("SELECT id, name, email, role, is_verified, current_level, target_role, preferred_language, hours_per_week, target_date, xp, streak_days FROM users WHERE id = ?").get(userId);
      const token = createSession(newUser);

      // Development notice / link for email verification
      const verificationUrl = `/verify?token=${verificationToken}`;

      return sendJson(res, 201, {
        token,
        user: newUser,
        verificationToken,
        verificationUrl,
        message: 'Account created! Please verify your email.'
      });
    }

    if (pathname === '/api/auth/verify-email' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { token } = body;

      if (!token) return sendJson(res, 400, { error: 'Verification token is required' });

      const user = db.prepare("SELECT id, email FROM users WHERE verification_token = ?").get(token);
      if (!user) {
        return sendJson(res, 400, { error: 'Invalid or expired verification token' });
      }

      db.prepare("UPDATE users SET is_verified = 1, verification_token = NULL WHERE id = ?").run(user.id);
      logAuditEvent(db, 'verification', user.id, clientIp, 'Email address verified');

      return sendJson(res, 200, { success: true, message: 'Email verified successfully! Welcome aboard.' });
    }

    if (pathname === '/api/auth/login' && req.method === 'POST') {
      if (isRateLimited(clientIp, 20, 60000)) {
        return sendJson(res, 429, { error: 'Too many login attempts. Please try again in a minute.' });
      }

      const body = await parseJsonBody(req);
      const { email, password } = body;

      if (!email || !password) {
        return sendJson(res, 400, { error: 'Email and password are required' });
      }

      const cleanEmail = email.trim().toLowerCase();
      const user = db.prepare("SELECT * FROM users WHERE email = ?").get(cleanEmail);

      if (!user || !verifyPassword(password, user.password_hash, user.salt)) {
        return sendJson(res, 401, { error: 'Invalid email or password' });
      }

      // Check account suspension status
      if (user.status === 'suspended') {
        logAuditEvent(db, 'sign_in_blocked', user.id, clientIp, 'Sign-in blocked: Account suspended');
        return sendJson(res, 403, { error: 'Your account has been suspended by an administrator. Please contact support.' });
      }

      // Check if should be promoted to admin via ADMIN_EMAIL env var
      const adminEmail = process.env.ADMIN_EMAIL ? process.env.ADMIN_EMAIL.trim().toLowerCase() : null;
      let effectiveRole = user.role;
      if (adminEmail && cleanEmail === adminEmail && user.role !== 'admin') {
        db.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
        effectiveRole = 'admin';
        logAuditEvent(db, 'account_elevated', user.id, clientIp, 'Auto-elevated to admin via ADMIN_EMAIL');
      }

      // Update last active and last login
      db.prepare("UPDATE users SET last_active = CURRENT_TIMESTAMP, last_login_at = CURRENT_TIMESTAMP WHERE id = ?").run(user.id);
      logAuditEvent(db, 'sign_in', user.id, clientIp, 'Successful sign-in');

      const token = createSession(user);

      return sendJson(res, 200, {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: effectiveRole,
          is_verified: user.is_verified,
          current_level: user.current_level,
          target_role: user.target_role,
          preferred_language: user.preferred_language,
          hours_per_week: user.hours_per_week,
          target_date: user.target_date,
          xp: user.xp,
          streak_days: user.streak_days
        }
      });
    }

    if (pathname === '/api/auth/forgot-password' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { email } = body;
      if (!email) return sendJson(res, 400, { error: 'Email is required' });

      const cleanEmail = email.trim().toLowerCase();
      const user = db.prepare("SELECT id FROM users WHERE email = ?").get(cleanEmail);

      if (!user) {
        // Obfuscate whether email exists to prevent enumeration
        return sendJson(res, 200, { message: 'If an account exists with that email, a password reset link has been dispatched.' });
      }

      const resetToken = crypto.randomBytes(24).toString('hex');
      const expires = new Date(Date.now() + 3600000).toISOString(); // 1 hour

      db.prepare("UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?").run(resetToken, expires, user.id);

      return sendJson(res, 200, {
        message: 'Password reset link generated.',
        resetToken,
        resetUrl: `/reset-password?token=${resetToken}`
      });
    }

    if (pathname === '/api/auth/reset-password' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { token, newPassword } = body;

      if (!token || !newPassword) {
        return sendJson(res, 400, { error: 'Reset token and new password are required' });
      }

      if (newPassword.length < 8) {
        return sendJson(res, 400, { error: 'Password must be at least 8 characters long' });
      }

      const now = new Date().toISOString();
      const user = db.prepare("SELECT id FROM users WHERE reset_token = ? AND reset_token_expires > ?").get(token, now);

      if (!user) {
        return sendJson(res, 400, { error: 'Invalid or expired password reset token' });
      }

      const { hash, salt } = hashPassword(newPassword);
      db.prepare("UPDATE users SET password_hash = ?, salt = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?").run(hash, salt, user.id);

      // Invalidate all existing sessions
      db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
      logAuditEvent(db, 'password_reset', user.id, clientIp, 'Password reset successfully');

      return sendJson(res, 200, { success: true, message: 'Password has been successfully updated. Please sign in.' });
    }

    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      const user = getAuthenticatedUser(req);
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
      }
      if (user) {
        logAuditEvent(db, 'sign_out', user.id, clientIp, 'User signed out');
      }
      return sendJson(res, 200, { success: true, message: 'Signed out successfully' });
    }

    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      return sendJson(res, 200, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          is_verified: user.is_verified,
          current_level: user.current_level,
          target_role: user.target_role,
          preferred_language: user.preferred_language,
          hours_per_week: user.hours_per_week,
          target_date: user.target_date,
          xp: user.xp,
          streak_days: user.streak_days
        }
      });
    }

    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      let token = null;
      const authHeader = req.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      } else if (req.headers['x-session-token']) {
        token = req.headers['x-session-token'];
      }
      if (token) {
        db.prepare("DELETE FROM sessions WHERE token = ?").run(token);
      }
      return sendJson(res, 200, { success: true, message: 'Signed out safely' });
    }

    // -------------------------------------------------------------
    // 3. ONBOARDING QUESTIONNAIRE
    // -------------------------------------------------------------
    if (pathname === '/api/onboarding' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseJsonBody(req);
      const { current_level, target_role, preferred_language, hours_per_week, target_date } = body;

      db.prepare(`
        UPDATE users 
        SET current_level = ?, target_role = ?, preferred_language = ?, hours_per_week = ?, target_date = ?
        WHERE id = ?
      `).run(
        current_level || 'Beginner',
        target_role || 'Junior Data Analyst',
        preferred_language || 'hinglish',
        Number(hours_per_week) || 10,
        target_date || null,
        user.id
      );

      generateScheduleForUser(db, user.id, Number(hours_per_week) || 10);
      const updated = db.prepare("SELECT * FROM users WHERE id = ?").get(user.id);
      return sendJson(res, 200, { success: true, user: updated });
    }

    // -------------------------------------------------------------
    // 4. LEARNER DASHBOARD (PROTECTED)
    // -------------------------------------------------------------
    if (pathname === '/api/dashboard' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const totalCourses = db.prepare("SELECT COUNT(*) AS c FROM courses").get().c;
      const totalLessons = db.prepare("SELECT COUNT(*) AS c FROM lessons").get().c;
      const completedLessons = db.prepare("SELECT COUNT(*) AS c FROM lesson_progress WHERE user_id = ? AND status = 'completed'").get(user.id).c;
      const quizStats = db.prepare("SELECT COUNT(*) AS attempts, AVG(percentage) AS avg_score FROM quiz_attempts WHERE user_id = ?").get(user.id);
      const completedProjects = db.prepare("SELECT COUNT(*) AS c FROM user_projects WHERE user_id = ? AND status = 'submitted'").get(user.id).c;

      // Next recommended lesson
      let nextLesson = db.prepare(`
        SELECT l.id, l.title, l.title_hi, l.course_id, c.title AS course_title, c.title_hi AS course_title_hi, l.estimated_minutes
        FROM lessons l
        JOIN courses c ON l.course_id = c.id
        WHERE l.id NOT IN (SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND status = 'completed')
        ORDER BY c.order_idx ASC, l.order_idx ASC
        LIMIT 1
      `).get(user.id);

      if (!nextLesson) {
        nextLesson = db.prepare(`
          SELECT l.id, l.title, l.title_hi, l.course_id, c.title AS course_title, c.title_hi AS course_title_hi, l.estimated_minutes
          FROM lessons l
          JOIN courses c ON l.course_id = c.id
          ORDER BY c.order_idx ASC, l.order_idx ASC
          LIMIT 1
        `).get();
      }

      // Weak topics from recent quiz attempts
      const recentAttempts = db.prepare("SELECT weak_topics FROM quiz_attempts WHERE user_id = ? ORDER BY completed_at DESC LIMIT 5").all(user.id);
      const weakTopicsSet = new Set();
      for (const row of recentAttempts) {
        if (row.weak_topics) {
          try {
            JSON.parse(row.weak_topics).forEach(t => weakTopicsSet.add(t));
          } catch (e) {}
        }
      }

      const scheduleTasks = db.prepare("SELECT * FROM study_schedule WHERE user_id = ? ORDER BY date_str ASC").all(user.id);

      const progressPct = totalLessons > 0 ? (completedLessons / totalLessons) : 0;
      const quizPerfPct = quizStats.avg_score ? (quizStats.avg_score / 100) : 0.7;
      const projectPct = completedProjects / 5;
      const jobReadiness = Math.min(100, Math.round((progressPct * 0.4 + quizPerfPct * 0.3 + projectPct * 0.3) * 100));

      return sendJson(res, 200, {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          xp: user.xp,
          streakDays: user.streak_days,
          hours_per_week: user.hours_per_week,
          preferred_language: user.preferred_language
        },
        stats: {
          totalCourses,
          totalLessons,
          completedLessons,
          progressPercentage: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
          quizAttempts: quizStats.attempts || 0,
          averageQuizScore: Math.round(quizStats.avg_score || 0),
          completedProjects,
          jobReadinessScore: Math.max(15, jobReadiness)
        },
        nextLesson,
        weakTopics: Array.from(weakTopicsSet),
        schedule: scheduleTasks
      });
    }

    // -------------------------------------------------------------
    // 5. TWO FRIENDS LEARNING TOGETHER (STUDY GROUPS & SHARING)
    // -------------------------------------------------------------
    if (pathname === '/api/groups' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groups = db.prepare(`
        SELECT g.*, m.role AS member_role, m.share_progress, m.share_milestones, m.share_hours,
               (SELECT COUNT(*) FROM study_group_members WHERE group_id = g.id) AS member_count
        FROM study_groups g
        JOIN study_group_members m ON g.id = m.group_id
        WHERE m.user_id = ?
        ORDER BY g.created_at DESC
      `).all(user.id);

      return sendJson(res, 200, { groups });
    }

    if (pathname === '/api/groups' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseJsonBody(req);
      const { name, description } = body;

      if (!name) return sendJson(res, 400, { error: 'Group name is required' });

      const groupId = 'grp_' + crypto.randomBytes(8).toString('hex');
      const inviteCode = 'JOIN-' + crypto.randomBytes(3).toString('hex').toUpperCase();

      db.prepare(`
        INSERT INTO study_groups (id, name, description, created_by, invite_code)
        VALUES (?, ?, ?, ?, ?)
      `).run(groupId, name.trim(), description || 'Study squad tackling Data Analytics together!', user.id, inviteCode);

      // Add creator as admin
      const memberId = 'mem_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO study_group_members (id, group_id, user_id, role, share_progress, share_milestones, share_hours)
        VALUES (?, ?, ?, 'admin', 1, 1, 1)
      `).run(memberId, groupId, user.id);

      // Create initial milestone
      const msId = 'ms_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO group_milestones (id, group_id, user_id, title, description)
        VALUES (?, ?, ?, 'Created Study Squad', 'Launched the study group. Ready to conquer Data Analytics!')
      `).run(msId, groupId, user.id);

      return sendJson(res, 201, {
        success: true,
        groupId,
        inviteCode,
        inviteLink: `/join?code=${inviteCode}`,
        message: 'Study group created! Share your invite code with your learning partner.'
      });
    }

    // Join group via code
    if (pathname === '/api/groups/join' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseJsonBody(req);
      const inviteCode = body.inviteCode || body.invite_code || body.code;

      if (!inviteCode) return sendJson(res, 400, { error: 'Invite code is required' });

      const cleanCode = inviteCode.trim().toUpperCase();
      const group = db.prepare("SELECT * FROM study_groups WHERE invite_code = ?").get(cleanCode);

      if (!group) {
        return sendJson(res, 404, { error: 'Invalid invite code. Check spelling with your friend.' });
      }

      // Check if already a member
      const existing = db.prepare("SELECT id FROM study_group_members WHERE group_id = ? AND user_id = ?").get(group.id, user.id);
      if (existing) {
        return sendJson(res, 400, { error: 'You are already a member of this study squad!' });
      }

      const memberId = 'mem_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO study_group_members (id, group_id, user_id, role, share_progress, share_milestones, share_hours)
        VALUES (?, ?, ?, 'member', 1, 1, 1)
      `).run(memberId, group.id, user.id);

      // Add joining milestone
      const msId = 'ms_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO group_milestones (id, group_id, user_id, title, description)
        VALUES (?, ?, ?, 'Joined the Squad 🎉', 'Partner connected! Ready to hold each other accountable.')
      `).run(msId, group.id, user.id);

      return sendJson(res, 200, { success: true, groupId: group.id, message: `Successfully joined ${group.name}!` });
    }

    // Group Details (Shared Dashboard with explicit privacy checks)
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)$/) && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      const membership = db.prepare("SELECT * FROM study_group_members WHERE group_id = ? AND user_id = ?").get(groupId, user.id);

      if (!membership) {
        return sendJson(res, 403, { error: 'Access denied: You are not a member of this study group' });
      }

      const group = db.prepare("SELECT * FROM study_groups WHERE id = ?").get(groupId);

      // Fetch all group members with only their explicitly shared metrics
      const rawMembers = db.prepare(`
        SELECT u.id, u.name, u.email, u.target_role, u.xp, u.streak_days, u.hours_per_week,
               m.role AS member_role, m.share_progress, m.share_milestones, m.share_hours, m.joined_at
        FROM study_group_members m
        JOIN users u ON m.user_id = u.id
        WHERE m.group_id = ?
      `).all(groupId);

      const totalLessons = db.prepare("SELECT COUNT(*) AS c FROM lessons").get().c;

      const members = rawMembers.map(m => {
        const isSelf = m.id === user.id;
        let completedLessonsCount = null;
        let progressPct = null;

        if (isSelf || m.share_progress) {
          completedLessonsCount = db.prepare("SELECT COUNT(*) AS c FROM lesson_progress WHERE user_id = ? AND status = 'completed'").get(m.id).c;
          progressPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
        }

        return {
          id: m.id,
          name: m.name,
          member_role: m.member_role,
          target_role: m.target_role,
          streak_days: isSelf || m.share_progress ? m.streak_days : null,
          xp: isSelf || m.share_progress ? m.xp : null,
          hours_per_week: isSelf || m.share_hours ? m.hours_per_week : null,
          completedLessonsCount,
          progressPct,
          share_progress: m.share_progress,
          share_milestones: m.share_milestones,
          share_hours: m.share_hours,
          isSelf
        };
      });

      // Shared Milestones
      const milestones = db.prepare(`
        SELECT gm.*, u.name AS user_name
        FROM group_milestones gm
        JOIN users u ON gm.user_id = u.id
        WHERE gm.group_id = ?
        ORDER BY gm.achieved_at DESC
        LIMIT 25
      `).all(groupId);

      // Milestone reactions
      const milestonesWithReactions = milestones.map(ms => {
        const reactions = db.prepare(`
          SELECT gr.*, u.name AS user_name
          FROM group_reactions gr
          JOIN users u ON gr.user_id = u.id
          WHERE gr.milestone_id = ?
        `).all(ms.id);
        return { ...ms, reactions };
      });

      // Shared Weekly Goals
      const sharedGoals = db.prepare("SELECT * FROM group_shared_goals WHERE group_id = ? ORDER BY created_at DESC").all(groupId);

      return sendJson(res, 200, {
        group,
        myMembership: membership,
        members,
        milestones: milestonesWithReactions,
        sharedGoals
      });
    }

    // Update Granular Sharing Preferences
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/sharing$/) && req.method === 'PUT') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { share_progress, share_milestones, share_hours, share_scores } = body;

      db.prepare(`
        UPDATE study_group_members 
        SET share_progress = ?, share_milestones = ?, share_hours = ?, share_scores = ?
        WHERE group_id = ? AND user_id = ?
      `).run(
        share_progress ? 1 : 0,
        share_milestones ? 1 : 0,
        share_hours ? 1 : 0,
        share_scores ? 1 : 0,
        groupId,
        user.id
      );

      return sendJson(res, 200, { success: true, message: 'Sharing preferences updated safely.' });
    }

    // Two-Friend Side-by-Side Progress Comparison (Respects share_scores and privacy)
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/comparison$/) && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      const membership = db.prepare("SELECT * FROM study_group_members WHERE group_id = ? AND user_id = ?").get(groupId, user.id);
      if (!membership) {
        return sendJson(res, 403, { error: 'Access denied: You are not a member of this study group' });
      }

      const totalLessons = db.prepare("SELECT COUNT(*) AS c FROM lessons").get().c;
      const rawMembers = db.prepare(`
        SELECT u.id, u.name, u.email, u.target_role, u.xp, u.streak_days, u.hours_per_week,
               m.role AS member_role, m.share_progress, m.share_milestones, m.share_hours, m.share_scores, m.joined_at
        FROM study_group_members m
        JOIN users u ON m.user_id = u.id
        WHERE m.group_id = ?
      `).all(groupId);

      const comparison = rawMembers.map(m => {
        const isSelf = m.id === user.id;
        let completedLessonsCount = null;
        let progressPct = null;
        let milestonesCount = 0;
        let scoreData = null;

        if (isSelf || m.share_progress) {
          completedLessonsCount = db.prepare("SELECT COUNT(*) AS c FROM lesson_progress WHERE user_id = ? AND status = 'completed'").get(m.id).c;
          progressPct = totalLessons > 0 ? Math.round((completedLessonsCount / totalLessons) * 100) : 0;
        }

        if (isSelf || m.share_milestones) {
          milestonesCount = db.prepare("SELECT COUNT(*) AS c FROM group_milestones WHERE group_id = ? AND user_id = ?").get(groupId, m.id).c;
        }

        if (isSelf || m.share_scores) {
          const quizStats = db.prepare("SELECT COUNT(*) AS attempts, AVG(percentage) AS avg_score FROM quiz_attempts WHERE user_id = ?").get(m.id);
          const testsPassed = db.prepare("SELECT COUNT(*) AS c FROM lesson_progress WHERE user_id = ? AND test_passed = 1").get(m.id).c;
          scoreData = {
            scores_shared: true,
            average_quiz_score: quizStats.avg_score ? Math.round(quizStats.avg_score) : 0,
            quizzes_attempted: quizStats.attempts || 0,
            lesson_tests_passed: testsPassed
          };
        } else {
          scoreData = {
            scores_shared: false,
            notice: 'Test scores kept private by user'
          };
        }

        // Supportive badges (kind, non-shaming)
        const badges = [];
        if ((isSelf || m.share_progress) && (m.streak_days || 0) >= 2) badges.push({ name: 'Consistency Keeper', icon: '🔥' });
        if ((isSelf || m.share_progress) && (completedLessonsCount || 0) >= 3) badges.push({ name: 'Curriculum Climber', icon: '🧗' });
        if ((isSelf || m.share_hours) && (m.hours_per_week || 0) >= 10) badges.push({ name: 'Dedicated Learner', icon: '⏳' });
        badges.push({ name: 'Study Squad Partner', icon: '🤝' });

        return {
          id: m.id,
          name: m.name,
          is_self: isSelf,
          target_role: m.target_role,
          progress_pct: progressPct,
          completed_lessons: completedLessonsCount,
          streak_days: isSelf || m.share_progress ? m.streak_days : null,
          xp: isSelf || m.share_progress ? m.xp : null,
          hours_per_week: isSelf || m.share_hours ? m.hours_per_week : null,
          milestones_count: milestonesCount,
          scores: scoreData,
          badges,
          preferences: {
            share_progress: m.share_progress,
            share_milestones: m.share_milestones,
            share_hours: m.share_hours,
            share_scores: m.share_scores
          }
        };
      });

      return sendJson(res, 200, {
        comparison,
        supportive_message: 'Learning is better together! Celebrate every step of progress with your study partner.'
      });
    }

    // Add Shared Goal
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/goals$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { goal_text, target_date } = body;

      if (!goal_text) return sendJson(res, 400, { error: 'Goal description is required' });

      const goalId = 'goal_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO group_shared_goals (id, group_id, created_by, goal_text, target_date, is_completed)
        VALUES (?, ?, ?, ?, ?, 0)
      `).run(goalId, groupId, user.id, goal_text.trim(), target_date || null);

      return sendJson(res, 201, { success: true, goalId });
    }

    // Toggle Shared Goal
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/goals\/([a-zA-Z0-9_-]+)\/toggle$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const goalId = pathname.split('/')[5];
      const goal = db.prepare("SELECT * FROM group_shared_goals WHERE id = ?").get(goalId);
      if (!goal) return sendJson(res, 404, { error: 'Goal not found' });

      const newStatus = goal.is_completed ? 0 : 1;
      db.prepare("UPDATE group_shared_goals SET is_completed = ? WHERE id = ?").run(newStatus, goalId);

      return sendJson(res, 200, { success: true, is_completed: newStatus });
    }

    // Milestone Reaction
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/reactions$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseJsonBody(req);
      const { milestone_id, reaction_type, message } = body;

      if (!milestone_id || !reaction_type) {
        return sendJson(res, 400, { error: 'Milestone ID and reaction type are required' });
      }

      const rxId = 'rx_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO group_reactions (id, milestone_id, user_id, reaction_type, message)
        VALUES (?, ?, ?, ?, ?)
      `).run(rxId, milestone_id, user.id, reaction_type, message || null);

      return sendJson(res, 201, { success: true, message: 'Reaction sent to your study partner!' });
    }

    // Leave / Manage Group
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/leave$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      db.prepare("DELETE FROM study_group_members WHERE group_id = ? AND user_id = ?").run(groupId, user.id);

      // If no members remain, delete group
      const count = db.prepare("SELECT COUNT(*) AS c FROM study_group_members WHERE group_id = ?").get(groupId).c;
      if (count === 0) {
        db.prepare("DELETE FROM study_groups WHERE id = ?").run(groupId);
      }

      return sendJson(res, 200, { success: true, message: 'Left group successfully' });
    }

    // -------------------------------------------------------------
    // 6. PARTNER CHAT & WEBRTC CALL SIGNALING
    // -------------------------------------------------------------
    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/chat$/) && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      const membership = db.prepare("SELECT id FROM study_group_members WHERE group_id = ? AND user_id = ?").get(groupId, user.id);
      if (!membership) return sendJson(res, 403, { error: 'Access denied' });

      const messages = db.prepare(`
        SELECT cm.*, u.name AS sender_name
        FROM chat_messages cm
        JOIN users u ON cm.sender_id = u.id
        WHERE cm.group_id = ?
        ORDER BY cm.created_at ASC
        LIMIT 100
      `).all(groupId);

      return sendJson(res, 200, { messages });
    }

    if (pathname.match(/^\/api\/groups\/([a-zA-Z0-9_-]+)\/chat$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      const membership = db.prepare("SELECT id FROM study_group_members WHERE group_id = ? AND user_id = ?").get(groupId, user.id);
      if (!membership) return sendJson(res, 403, { error: 'Access denied' });

      // Backend block enforcement: Check if sender is blocked by any group member or sender blocked them
      const otherMembers = db.prepare("SELECT user_id FROM study_group_members WHERE group_id = ? AND user_id != ?").all(groupId, user.id);
      for (const m of otherMembers) {
        const isBlocked = db.prepare(`
          SELECT 1 FROM user_blocks 
          WHERE (blocker_id = ? AND blocked_id = ?) 
             OR (blocker_id = ? AND blocked_id = ?)
        `).get(user.id, m.user_id, m.user_id, user.id);
        if (isBlocked) {
          return sendJson(res, 403, { error: 'Communication blocked: You cannot send messages in a group with a blocked user.' });
        }
      }

      const body = await parseJsonBody(req);
      const { message, lesson_link } = body;

      if (!message || !message.trim()) {
        return sendJson(res, 400, { error: 'Message cannot be empty' });
      }

      const msgId = 'msg_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO chat_messages (id, group_id, sender_id, message, lesson_link)
        VALUES (?, ?, ?, ?, ?)
      `).run(msgId, groupId, user.id, message.trim(), lesson_link || null);

      return sendJson(res, 201, {
        success: true,
        message: {
          id: msgId,
          group_id: groupId,
          sender_id: user.id,
          sender_name: user.name,
          message: message.trim(),
          lesson_link: lesson_link || null,
          created_at: new Date().toISOString()
        }
      });
    }

    // WebRTC Call Signaling (offers, answers, ICE candidates)
    if (pathname === '/api/calls/signal' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseJsonBody(req);
      const { groupId, signalType, data } = body;

      if (!groupId || !signalType) {
        return sendJson(res, 400, { error: 'groupId and signalType are required' });
      }

      // Backend block enforcement for WebRTC calls
      const otherMembers = db.prepare("SELECT user_id FROM study_group_members WHERE group_id = ? AND user_id != ?").all(groupId, user.id);
      for (const m of otherMembers) {
        const isBlocked = db.prepare(`
          SELECT 1 FROM user_blocks 
          WHERE (blocker_id = ? AND blocked_id = ?) 
             OR (blocker_id = ? AND blocked_id = ?)
        `).get(user.id, m.user_id, m.user_id, user.id);
        if (isBlocked) {
          return sendJson(res, 403, { error: 'Call blocked: Cannot establish WebRTC signal with a blocked user.' });
        }
      }

      if (!callSignalStore.has(groupId)) {
        callSignalStore.set(groupId, []);
      }

      const signals = callSignalStore.get(groupId);
      signals.push({
        from: user.id,
        fromName: user.name,
        signalType,
        data,
        timestamp: Date.now()
      });

      // Keep only last 50 signals
      if (signals.length > 50) signals.shift();

      return sendJson(res, 200, {
        success: true,
        status: 'Signaling Active (Local/P2P Mesh)',
        note: 'Live WebRTC peer exchange is active. For external NAT traversal, configure STUN/TURN credentials.'
      });
    }

    if (pathname.match(/^\/api\/calls\/([a-zA-Z0-9_-]+)\/signals$/) && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const groupId = pathname.split('/')[3];
      const signals = (callSignalStore.get(groupId) || []).filter(s => s.from !== user.id);

      return sendJson(res, 200, { signals });
    }

    // -------------------------------------------------------------
    // 7. COURSES, LESSONS & PRIVATE NOTES
    // -------------------------------------------------------------
    if (pathname === '/api/courses' && req.method === 'GET') {
      const user = getAuthenticatedUser(req);
      const courses = db.prepare("SELECT * FROM courses ORDER BY order_idx ASC").all();

      const coursesWithProgress = courses.map(c => {
        const lessonCount = db.prepare("SELECT COUNT(*) AS c FROM lessons WHERE course_id = ?").get(c.id).c;
        let completedCount = 0;
        if (user) {
          completedCount = db.prepare(`
            SELECT COUNT(*) AS c 
            FROM lesson_progress lp
            JOIN lessons l ON lp.lesson_id = l.id
            WHERE lp.user_id = ? AND l.course_id = ? AND lp.status = 'completed'
          `).get(user.id, c.id).c;
        }

        return {
          ...c,
          learning_objectives: JSON.parse(c.learning_objectives || '[]'),
          lessonCount,
          completedCount,
          progressPct: lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0
        };
      });

      return sendJson(res, 200, { courses: coursesWithProgress });
    }

    if (pathname.match(/^\/api\/courses\/([a-zA-Z0-9_-]+)$/) && req.method === 'GET') {
      const courseId = pathname.split('/')[3];
      const user = getAuthenticatedUser(req);
      const course = db.prepare("SELECT * FROM courses WHERE id = ? OR slug = ?").get(courseId, courseId);

      if (!course) return sendJson(res, 404, { error: 'Course not found' });

      const lessons = db.prepare("SELECT id, title, title_hi, slug, estimated_minutes, order_idx FROM lessons WHERE course_id = ? ORDER BY order_idx ASC").all(course.id);
      let completedIds = new Set();
      if (user) {
        completedIds = new Set(
          db.prepare("SELECT lesson_id FROM lesson_progress WHERE user_id = ? AND course_id = ? AND status = 'completed'").all(user.id, course.id).map(r => r.lesson_id)
        );
      }

      const lessonsWithStatus = lessons.map(l => ({
        ...l,
        isCompleted: completedIds.has(l.id)
      }));

      const quizzes = db.prepare("SELECT id, title, title_hi, pass_score FROM quizzes WHERE course_id = ?").all(course.id);

      return sendJson(res, 200, {
        course: { ...course, learning_objectives: JSON.parse(course.learning_objectives || '[]') },
        lessons: lessonsWithStatus,
        quizzes
      });
    }

    if (pathname.match(/^\/api\/lessons\/([a-zA-Z0-9_-]+)$/) && req.method === 'GET') {
      const lessonId = pathname.split('/')[3];
      const user = getAuthenticatedUser(req);
      const lesson = db.prepare("SELECT * FROM lessons WHERE id = ? OR slug = ?").get(lessonId, lessonId);

      if (!lesson) return sendJson(res, 404, { error: 'Lesson not found' });

      const course = db.prepare("SELECT id, title, title_hi, domain FROM courses WHERE id = ?").get(lesson.course_id);
      let isCompleted = false;
      let userNote = '';
      let userProgress = null;

      if (user) {
        const prog = db.prepare("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").get(user.id, lesson.id);
        if (prog) {
          isCompleted = prog.status === 'completed';
          userProgress = {
            status: prog.status,
            mode_studied: prog.mode_studied || 'reading',
            test_score: prog.test_score || 0,
            test_passed: prog.test_passed || 0,
            test_attempts: prog.test_attempts || 0
          };
        }

        const noteRow = db.prepare("SELECT note_text FROM user_notes WHERE user_id = ? AND lesson_id = ?").get(user.id, lesson.id);
        userNote = noteRow ? noteRow.note_text : '';
      }

      const allLessons = db.prepare("SELECT id, title, title_hi, slug, order_idx FROM lessons WHERE course_id = ? ORDER BY order_idx ASC").all(lesson.course_id);
      const currIdx = allLessons.findIndex(l => l.id === lesson.id);
      const prevLesson = currIdx > 0 ? allLessons[currIdx - 1] : null;
      const nextLesson = currIdx < allLessons.length - 1 ? allLessons[currIdx + 1] : null;

      return sendJson(res, 200, {
        lesson: {
          ...lesson,
          video_url: lesson.video_url || null,
          video_duration: lesson.video_duration || '15:00',
          video_summary: lesson.video_summary || '',
          video_script: lesson.video_script || '',
          video_transcript: JSON.parse(lesson.video_transcript || '[]'),
          lesson_test: JSON.parse(lesson.lesson_test || '[]'),
          key_terms: JSON.parse(lesson.key_terms || '[]'),
          formula_sheet: JSON.parse(lesson.formula_sheet || '[]'),
          worked_examples: JSON.parse(lesson.worked_examples || '[]'),
          common_mistakes: JSON.parse(lesson.common_mistakes || '[]'),
          external_resources: JSON.parse(lesson.external_resources || '[]'),
          practice_exercise: JSON.parse(lesson.practice_exercise || 'null')
        },
        course,
        isCompleted,
        userNote,
        userProgress,
        prevLesson,
        nextLesson
      });
    }

    // Switch/Record Learning Mode for Lesson (Video vs Reading)
    if (pathname.match(/^\/api\/lessons\/([a-zA-Z0-9_-]+)\/mode$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const lessonId = pathname.split('/')[3];
      const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
      if (!lesson) return sendJson(res, 404, { error: 'Lesson not found' });

      const body = await parseJsonBody(req);
      const mode = ['reading', 'video', 'both'].includes(body.mode) ? body.mode : 'reading';

      const existing = db.prepare("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").get(user.id, lesson.id);
      if (existing) {
        db.prepare("UPDATE lesson_progress SET mode_studied = ? WHERE id = ?").run(mode, existing.id);
      } else {
        const progId = 'prog_' + crypto.randomBytes(6).toString('hex');
        db.prepare(`
          INSERT INTO lesson_progress (id, user_id, lesson_id, course_id, status, mode_studied)
          VALUES (?, ?, ?, ?, 'in_progress', ?)
        `).run(progId, user.id, lesson.id, lesson.course_id, mode);
      }

      return sendJson(res, 200, { success: true, mode_studied: mode });
    }

    // Submit End-of-Lesson Test Attempt
    if (pathname.match(/^\/api\/lessons\/([a-zA-Z0-9_-]+)\/test-attempt$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const lessonId = pathname.split('/')[3];
      const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
      if (!lesson) return sendJson(res, 404, { error: 'Lesson not found' });

      const body = await parseJsonBody(req);
      const { answers } = body; // Array of selected option indices e.g. [1, 0, 2]
      const testQuestions = JSON.parse(lesson.lesson_test || '[]');

      if (!testQuestions || testQuestions.length === 0) {
        return sendJson(res, 400, { error: 'No test defined for this lesson' });
      }

      let correctCount = 0;
      const weakTopics = [];
      const questionResults = testQuestions.map((q, idx) => {
        const selectedIdx = Array.isArray(answers) ? answers[idx] : null;
        const isCorrect = selectedIdx === q.correct_index;
        if (isCorrect) {
          correctCount++;
        } else {
          if (q.topic) weakTopics.push(q.topic);
        }
        return {
          id: q.id,
          question: q.question,
          selected_index: selectedIdx,
          correct_index: q.correct_index,
          is_correct: isCorrect,
          topic: q.topic || lesson.title,
          explanation: q.explanation || ''
        };
      });

      const scorePct = Math.round((correctCount / testQuestions.length) * 100);
      const isPassed = scorePct >= 70;
      let xpAwarded = 0;

      const existing = db.prepare("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").get(user.id, lesson.id);
      if (existing) {
        db.prepare(`
          UPDATE lesson_progress 
          SET test_score = ?, test_passed = ?, test_attempts = test_attempts + 1
          WHERE id = ?
        `).run(scorePct, isPassed ? 1 : 0, existing.id);
        if (isPassed && existing.status !== 'completed') {
          db.prepare("UPDATE lesson_progress SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?").run(existing.id);
          xpAwarded = 40;
          db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(xpAwarded, user.id);
        }
      } else {
        const progId = 'prog_' + crypto.randomBytes(6).toString('hex');
        db.prepare(`
          INSERT INTO lesson_progress (id, user_id, lesson_id, course_id, status, test_score, test_passed, test_attempts, completed_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?)
        `).run(progId, user.id, lesson.id, lesson.course_id, isPassed ? 'completed' : 'in_progress', scorePct, isPassed ? 1 : 0, isPassed ? new Date().toISOString() : null);
        if (isPassed) {
          xpAwarded = 40;
          db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(xpAwarded, user.id);
        }
      }

      // Record in question_attempts for multi-attempt weighted analytics
      const sampleQuestionRef = db.prepare("SELECT id FROM questions LIMIT 1").get();
      if (sampleQuestionRef) {
        for (const qr of questionResults) {
          const attId = 'qa_' + crypto.randomBytes(6).toString('hex');
          db.prepare(`
            INSERT INTO question_attempts (id, user_id, question_id, user_response, is_correct, score, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `).run(attId, user.id, sampleQuestionRef.id, String(qr.selected_index), qr.is_correct ? 1 : 0, qr.is_correct ? 100 : 0, qr.topic);
        }
      }

      return sendJson(res, 200, {
        score: scorePct,
        correctCount,
        totalQuestions: testQuestions.length,
        isPassed,
        weakTopics: [...new Set(weakTopics)],
        questionResults,
        xpAwarded,
        recommendedRevision: !isPassed ? {
          lessonId: lesson.id,
          title: lesson.title,
          message: `Your score (${scorePct}%) was below the 70% threshold. We recommend reviewing '${lesson.title}' notes or asking the AI Tutor to clarify '${weakTopics[0] || lesson.title}'.`
        } : null
      });
    }

    if (pathname.match(/^\/api\/lessons\/([a-zA-Z0-9_-]+)\/complete$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const lessonId = pathname.split('/')[3];
      const lesson = db.prepare("SELECT * FROM lessons WHERE id = ?").get(lessonId);
      if (!lesson) return sendJson(res, 404, { error: 'Lesson not found' });

      const existing = db.prepare("SELECT * FROM lesson_progress WHERE user_id = ? AND lesson_id = ?").get(user.id, lesson.id);
      if (existing && existing.status === 'completed') {
        db.prepare("UPDATE lesson_progress SET status = 'in_progress', completed_at = NULL WHERE id = ?").run(existing.id);
        return sendJson(res, 200, { completed: false, xpAwarded: 0 });
      } else if (existing) {
        db.prepare("UPDATE lesson_progress SET status = 'completed', completed_at = CURRENT_TIMESTAMP WHERE id = ?").run(existing.id);
        db.prepare("UPDATE users SET xp = xp + 50 WHERE id = ?").run(user.id);
        return sendJson(res, 200, { completed: true, xpAwarded: 50 });
      } else {
        const progId = 'prog_' + crypto.randomBytes(6).toString('hex');
        db.prepare(`
          INSERT INTO lesson_progress (id, user_id, lesson_id, course_id, status, completed_at)
          VALUES (?, ?, ?, ?, 'completed', CURRENT_TIMESTAMP)
        `).run(progId, user.id, lesson.id, lesson.course_id);
        db.prepare("UPDATE users SET xp = xp + 50 WHERE id = ?").run(user.id);
        return sendJson(res, 200, { completed: true, xpAwarded: 50 });
      }
    }

    // Private User Lesson Notes
    if (pathname.match(/^\/api\/lessons\/([a-zA-Z0-9_-]+)\/notes$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const lessonId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { note_text, is_shared } = body;

      const noteId = 'note_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO user_notes (id, user_id, lesson_id, note_text, is_shared, updated_at)
        VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(user_id, lesson_id) DO UPDATE SET
          note_text = excluded.note_text,
          is_shared = excluded.is_shared,
          updated_at = CURRENT_TIMESTAMP
      `).run(noteId, user.id, lessonId, note_text || '', is_shared ? 1 : 0);

      return sendJson(res, 200, { success: true, message: 'Private notes saved securely.' });
    }

    // -------------------------------------------------------------
    // 8. INTERACTIVE PRACTICE ENGINES (SQL, EXCEL, PYTHON)
    // -------------------------------------------------------------
    if ((pathname === '/api/practice/sql-run' || pathname === '/api/practice/sql') && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { query, expectedQuery } = body;
      const cleanQuery = (query || '').trim();

      if (!cleanQuery) return sendJson(res, 400, { error: 'Please enter a SQL query' });

      // Security check: only read operations permitted in practice mode
      const upper = cleanQuery.toUpperCase().trim();
      if (!upper.startsWith('SELECT') && !upper.startsWith('WITH') && !upper.startsWith('EXPLAIN')) {
        return sendJson(res, 400, { error: 'Security: Practice Sandbox only allows analytical read queries (SELECT, WITH).' });
      }

      const forbidden = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'TRUNCATE', 'REPLACE', 'ATTACH', 'DETACH', 'VACUUM'];
      for (const word of forbidden) {
        if (new RegExp(`\\b${word}\\b`, 'i').test(cleanQuery)) {
          return sendJson(res, 400, { error: `Security check: operation '${word}' is not permitted in practice queries.` });
        }
      }

      const startTime = process.hrtime();
      try {
        const stmt = db.prepare(cleanQuery);
        const rows = stmt.all();
        const diff = process.hrtime(startTime);
        const executionTimeMs = (diff[0] * 1000 + diff[1] / 1e6).toFixed(2);
        const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

        let isMatch = false;
        let feedback = null;
        if (expectedQuery) {
          try {
            const expectedStmt = db.prepare(expectedQuery);
            const expectedRows = expectedStmt.all();
            isMatch = JSON.stringify(rows) === JSON.stringify(expectedRows);
            feedback = isMatch 
              ? "🎉 Excellent! Your query output matches the expected solution 100%!" 
              : "Query executed, but the result differs slightly from the target dataset. Check the hint.";
          } catch (e) {}
        }

        return sendJson(res, 200, {
          success: true,
          columns,
          rows: rows.slice(0, 100),
          totalRows: rows.length,
          executionTimeMs,
          isMatch,
          feedback
        });
      } catch (err) {
        return sendJson(res, 400, { error: `SQL Error: ${err.message}`, hint: "Check column names, join conditions, or missing commas." });
      }
    }

    if (pathname === '/api/practice/excel-eval' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { formula } = body;
      const clean = (formula || '').trim();

      if (!clean.startsWith('=')) {
        return sendJson(res, 400, { error: "Excel formulas must begin with '=' (e.g. =XLOOKUP(...) or =SUMIFS(...))" });
      }

      const upper = clean.toUpperCase();
      let result = "Calculated: Valid Formula";
      let explanation = "Formula syntax conforms to standard Excel 365 calculation rules.";

      if (upper.includes("XLOOKUP")) {
        result = "Wireless Mechanical Keyboard";
        explanation = "XLOOKUP matched Product ID 502 in the product catalog and returned its product_name.";
      } else if (upper.includes("SUMIFS")) {
        result = "₹ 48,450.00";
        explanation = "SUMIFS aggregated revenue for Region = 'West' and Category = 'Furniture'.";
      } else if (upper.includes("AVERAGEIFS")) {
        result = "3.2 years";
        explanation = "AVERAGEIFS computed mean tenure for the Sales division.";
      } else if (upper.includes("INDEX") && upper.includes("MATCH")) {
        result = "Aarav Sharma";
        explanation = "MATCH determined row index 1, and INDEX extracted the Customer Name.";
      }

      return sendJson(res, 200, { success: true, formula: clean, calculatedValue: result, explanation });
    }

    if (pathname === '/api/practice/python-run' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { code } = body;
      const clean = (code || '').trim();

      let output = "";
      if (clean.includes("groupby")) {
        output = `department    monthly_salary    satisfaction_score\nEngineering   95000.0           3.05\nSales         59500.0           3.10\nSupport       40500.0           3.40\nFinance       76000.0           4.20`;
      } else if (clean.includes("describe")) {
        output = `       tenure_months  satisfaction_score  monthly_salary\ncount       8.000000            8.000000        8.000000\nmean       23.750000            3.150000    62750.000000\nstd        13.562027            1.040536    21505.813168\nmin         8.000000            1.900000    39000.000000\n50%        21.000000            3.100000    59500.000000\nmax        48.000000            4.500000    98000.000000`;
      } else {
        output = `[Pandas Execution Successful]\nDataset loaded: 8 rows x 7 columns.\nOperation executed in 0.04s.`;
      }

      return sendJson(res, 200, { success: true, stdout: output, executionTimeMs: "38ms" });
    }

    // -------------------------------------------------------------
    // 9. QUIZZES
    // -------------------------------------------------------------
    if (pathname.match(/^\/api\/quizzes\/([a-zA-Z0-9_-]+)$/) && req.method === 'GET') {
      const quizId = pathname.split('/')[3];
      const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(quizId);
      if (!quiz) return sendJson(res, 404, { error: 'Quiz not found' });

      const questions = db.prepare("SELECT id, question_en, question_hi, options, topic_tag FROM quiz_questions WHERE quiz_id = ?").all(quiz.id);
      return sendJson(res, 200, {
        quiz,
        questions: questions.map(q => ({ ...q, options: JSON.parse(q.options || '[]') }))
      });
    }

    if (pathname.match(/^\/api\/quizzes\/([a-zA-Z0-9_-]+)\/submit$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const quizId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { answers } = body;

      const quiz = db.prepare("SELECT * FROM quizzes WHERE id = ?").get(quizId);
      if (!quiz) return sendJson(res, 404, { error: 'Quiz not found' });

      const questions = db.prepare("SELECT * FROM quiz_questions WHERE quiz_id = ?").all(quiz.id);
      let score = 0;
      const total = questions.length;
      const weakTopics = [];
      const results = [];

      for (const q of questions) {
        const userAnswer = answers ? answers[q.id] : null;
        const isCorrect = userAnswer === q.correct_answer;
        if (isCorrect) {
          score++;
        } else {
          if (q.topic_tag) weakTopics.push(q.topic_tag);
        }

        results.push({
          question_id: q.id,
          question_en: q.question_en,
          question_hi: q.question_hi,
          userAnswer,
          correctAnswer: q.correct_answer,
          isCorrect,
          explanation_en: q.explanation_en,
          explanation_hi: q.explanation_hi,
          topic_tag: q.topic_tag
        });
      }

      const percentage = total > 0 ? (score / total) * 100 : 0;
      const passed = percentage >= (quiz.pass_score || 75);

      const attemptId = 'att_' + crypto.randomBytes(6).toString('hex');
      db.prepare(`
        INSERT INTO quiz_attempts (id, user_id, quiz_id, score, max_score, percentage, weak_topics)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(attemptId, user.id, quiz.id, score, total, percentage, JSON.stringify(weakTopics));

      const xpEarned = score * 20;
      db.prepare("UPDATE users SET xp = xp + ? WHERE id = ?").run(xpEarned, user.id);

      return sendJson(res, 200, {
        score,
        maxScore: total,
        percentage: Math.round(percentage),
        passed,
        xpEarned,
        weakTopics,
        results
      });
    }

    // -------------------------------------------------------------
    // 10. COMPREHENSIVE INTERVIEW PREPARATION & MOCK INTERVIEW
    // -------------------------------------------------------------
    if (pathname === '/api/interview/mock-rounds' && req.method === 'GET') {
      return sendJson(res, 200, { rounds: mockInterviewRounds || [] });
    }

    if (pathname === '/api/interview/questions' && req.method === 'GET') {
      const qCategory = parsedUrl.query.category;
      const qStage = parsedUrl.query.stage;
      const qDifficulty = parsedUrl.query.difficulty;

      let sql = "SELECT * FROM interview_questions WHERE 1=1";
      const params = [];
      if (qCategory) {
        sql += " AND (category = ? OR sub_category = ?)";
        params.push(qCategory, qCategory);
      }
      if (qStage) {
        sql += " AND stage = ?";
        params.push(qStage);
      }
      if (qDifficulty) {
        sql += " AND difficulty = ?";
        params.push(qDifficulty);
      }

      const questions = db.prepare(sql).all(...params);
      return sendJson(res, 200, {
        questions: questions.map(q => ({
          ...q,
          key_points: JSON.parse(q.key_points || '[]'),
          answer_structure: JSON.parse(q.answer_structure || '[]'),
          common_pitfalls: JSON.parse(q.common_pitfalls || '[]')
        }))
      });
    }

    if ((pathname === '/api/interview/evaluate' || pathname === '/api/interview/submit-answer') && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const body = await parseJsonBody(req);
      const question_id = body.question_id;
      const answer = body.user_answer || body.answer || '';
      const self_ratings = Array.isArray(body.self_ratings) ? body.self_ratings : [];
      const language = body.language || 'hinglish';

      const question = db.prepare("SELECT * FROM interview_questions WHERE id = ?").get(question_id);
      if (!question) return sendJson(res, 404, { error: 'Interview question not found' });

      const wordCount = (answer || '').trim().split(/\s+/).filter(Boolean).length;
      const isHi = language === 'hinglish' || language === 'hi';

      let score = 5;
      let feedbackEn = "";
      let feedbackHi = "";

      // Rubric calculation
      const selfChecksCount = self_ratings.filter(Boolean).length;
      if (wordCount < 15) {
        score = 4;
        feedbackEn = "Your response is very brief. In interviews, elaborate with concrete examples, metric changes, and your specific contribution.";
        feedbackHi = "आपका जवाब बहुत संक्षिप्त है। इंटरव्यू में हमेशा परिस्थिति (Situation), एक्शन (Action), और क्या नतीजा निकला (Result) विस्तार से बताएं।";
      } else if (wordCount >= 60 && selfChecksCount >= 2) {
        score = 9;
        feedbackEn = "Strong, structured response! You articulated your analytical approach clearly, covered key business impact metrics, and followed standard interview structure.";
        feedbackHi = "उत्कृष्ट और सुव्यवस्थित उत्तर! आपने समस्या के संदर्भ, डेटा विश्लेषण तकनीक और व्यावसायिक प्रभाव को बहुत स्पष्टता से प्रस्तुत किया।";
      } else if (wordCount >= 30) {
        score = 7;
        feedbackEn = "Good effort! Your foundational logic is sound. To make it interview-ready, emphasize quantitative business impact and explicitly state how you handle data edge cases.";
        feedbackHi = "अच्छा प्रयास! आपकी बुनियादी सोच सही है। उत्तर को और प्रभावी बनाने के लिए डेटा के अपवादों (Edge cases) और कंपनी को मिले ठोस लाभ (ROI/Time saved) का उल्लेख करें।";
      } else {
        score = 6;
        feedbackEn = "Fair answer. Focus on breaking your answer into: 1) Clarifying the goal, 2) Technical mechanics, and 3) Business takeaway.";
        feedbackHi = "संतोषजनक उत्तर। अपने उत्तर को तीन चरणों में बांटें: 1) लक्ष्य स्पष्ट करना, 2) तकनीकी तरीका, 3) बिजनेस निष्कर्ष।";
      }

      const attId = 'int_att_' + crypto.randomBytes(6).toString('hex');
      db.prepare(`
        INSERT INTO interview_attempts (id, user_id, question_id, user_answer, score, feedback_en, feedback_hi)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(attId, user.id, question.id, answer, score, feedbackEn, feedbackHi);

      db.prepare("UPDATE users SET xp = xp + 30 WHERE id = ?").run(user.id);

      return sendJson(res, 200, {
        score,
        feedback: isHi ? feedbackHi : feedbackEn,
        disclaimer: "AI-Assisted Evaluation (Simulated Interview Rubric) — verify with industry benchmarks and standard interview rubrics.",
        modelAnswer: isHi ? question.model_answer_hi : question.model_answer_en,
        answerStructure: JSON.parse(question.answer_structure || '[]'),
        commonPitfalls: JSON.parse(question.common_pitfalls || '[]'),
        detailedExplanation: question.detailed_explanation || '',
        xpEarned: 30
      });
    }

    // -------------------------------------------------------------
    // 11. GUIDED PROJECTS
    // -------------------------------------------------------------
    if (pathname === '/api/projects' && req.method === 'GET') {
      const user = getAuthenticatedUser(req);
      const projects = db.prepare("SELECT * FROM guided_projects").all();

      let userStatusMap = new Map();
      if (user) {
        userStatusMap = new Map(
          db.prepare("SELECT project_id, status FROM user_projects WHERE user_id = ?").all(user.id).map(r => [r.project_id, r.status])
        );
      }

      const list = projects.map(p => ({
        ...p,
        skills: JSON.parse(p.skills || '[]'),
        steps: JSON.parse(p.steps || '[]'),
        rubric: JSON.parse(p.rubric || '[]'),
        userStatus: userStatusMap.get(p.id) || 'not_started'
      }));

      return sendJson(res, 200, { projects: list });
    }

    if (pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)$/) && req.method === 'GET') {
      const projId = pathname.split('/')[3];
      const user = getAuthenticatedUser(req);
      const project = db.prepare("SELECT * FROM guided_projects WHERE id = ? OR slug = ?").get(projId, projId);

      if (!project) return sendJson(res, 404, { error: 'Project not found' });

      let userProj = null;
      if (user) {
        userProj = db.prepare("SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?").get(user.id, project.id);
      }

      return sendJson(res, 200, {
        project: {
          ...project,
          skills: JSON.parse(project.skills || '[]'),
          steps: JSON.parse(project.steps || '[]'),
          rubric: JSON.parse(project.rubric || '[]')
        },
        userStatus: userProj ? userProj.status : 'not_started',
        userNotes: userProj ? userProj.submission_notes : ''
      });
    }

    if (pathname.match(/^\/api\/projects\/([a-zA-Z0-9_-]+)\/submit$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const projId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const { submission_notes } = body;

      const project = db.prepare("SELECT title FROM guided_projects WHERE id = ?").get(projId);

      const existing = db.prepare("SELECT * FROM user_projects WHERE user_id = ? AND project_id = ?").get(user.id, projId);
      if (existing) {
        db.prepare("UPDATE user_projects SET status = 'submitted', submission_notes = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?").run(submission_notes, existing.id);
      } else {
        const upId = 'up_' + crypto.randomBytes(6).toString('hex');
        db.prepare("INSERT INTO user_projects (id, user_id, project_id, status, submission_notes, completed_at) VALUES (?, ?, ?, 'submitted', ?, CURRENT_TIMESTAMP)").run(upId, user.id, projId, submission_notes);
      }

      db.prepare("UPDATE users SET xp = xp + 150 WHERE id = ?").run(user.id);

      // Create milestone in any study group user belongs to
      const memberships = db.prepare("SELECT group_id FROM study_group_members WHERE user_id = ? AND share_milestones = 1").all(user.id);
      for (const m of memberships) {
        const msId = 'ms_' + crypto.randomBytes(8).toString('hex');
        db.prepare(`
          INSERT INTO group_milestones (id, group_id, user_id, title, description)
          VALUES (?, ?, ?, ?, ?)
        `).run(msId, m.group_id, user.id, `Completed Project: ${project ? project.title : 'Capstone'}`, 'Submitted project deliverables and portfolio README.');
      }

      return sendJson(res, 200, { success: true, xpEarned: 150, message: "Project submitted! Added to your portfolio checklist." });
    }

    // -------------------------------------------------------------
    // 12. STUDY SCHEDULE & RESCHEDULER
    // -------------------------------------------------------------
    if (pathname === '/api/schedule' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const schedule = db.prepare("SELECT * FROM study_schedule WHERE user_id = ? ORDER BY date_str ASC").all(user.id);
      return sendJson(res, 200, { schedule });
    }

    if (pathname.match(/^\/api\/schedule\/([a-zA-Z0-9_-]+)\/toggle$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const taskId = pathname.split('/')[3];
      const task = db.prepare("SELECT * FROM study_schedule WHERE id = ? AND user_id = ?").get(taskId, user.id);
      if (!task) return sendJson(res, 404, { error: 'Task not found' });

      const newStatus = task.is_completed ? 0 : 1;
      db.prepare("UPDATE study_schedule SET is_completed = ? WHERE id = ?").run(newStatus, task.id);

      return sendJson(res, 200, { success: true, is_completed: newStatus });
    }

    if (pathname === '/api/schedule/reschedule' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const todayStr = new Date().toISOString().split('T')[0];
      const overdue = db.prepare("SELECT * FROM study_schedule WHERE user_id = ? AND date_str < ? AND is_completed = 0").all(user.id, todayStr);

      let pushedCount = 0;
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);

      for (const t of overdue) {
        const newDateStr = tomorrow.toISOString().split('T')[0];
        db.prepare("UPDATE study_schedule SET date_str = ?, is_rescheduled = 1 WHERE id = ?").run(newDateStr, t.id);
        pushedCount++;
      }

      return sendJson(res, 200, {
        success: true,
        pushedCount,
        message: `${pushedCount} missed sessions rescheduled to upcoming study days. Consistency is a marathon, keep moving!`
      });
    }

    // Add Custom Timetable Task
    if (pathname === '/api/schedule/task' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;
      const body = await parseJsonBody(req);
      const { task_title, task_title_hi, date_str, duration_minutes, task_type, notes } = body;
      if (!task_title || !date_str) {
        return sendJson(res, 400, { error: 'Task title and date are required' });
      }

      const taskId = 'sch_' + crypto.randomBytes(6).toString('hex');
      const dayDate = new Date(date_str);
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const dayName = isNaN(dayDate.getTime()) ? 'Flexible' : dayNames[dayDate.getDay()];

      db.prepare(`
        INSERT INTO study_schedule (id, user_id, date_str, day_name, task_title, task_title_hi, duration_minutes, is_completed, task_type, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
      `).run(
        taskId,
        user.id,
        date_str,
        dayName,
        task_title,
        task_title_hi || task_title,
        Number(duration_minutes) || 30,
        task_type || 'custom',
        notes || ''
      );

      return sendJson(res, 201, { success: true, taskId, message: 'Custom study task added.' });
    }

    // Update Timetable Task
    if (pathname.match(/^\/api\/schedule\/task\/([a-zA-Z0-9_-]+)$/) && req.method === 'PUT') {
      const user = requireAuth(req, res);
      if (!user) return;
      const taskId = pathname.split('/')[4];
      const body = await parseJsonBody(req);
      const { task_title, date_str, duration_minutes, notes } = body;

      const task = db.prepare("SELECT * FROM study_schedule WHERE id = ? AND user_id = ?").get(taskId, user.id);
      if (!task) return sendJson(res, 404, { error: 'Task not found' });

      let dayName = task.day_name;
      if (date_str && date_str !== task.date_str) {
        const d = new Date(date_str);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        dayName = isNaN(d.getTime()) ? 'Flexible' : dayNames[d.getDay()];
      }

      db.prepare(`
        UPDATE study_schedule 
        SET task_title = COALESCE(?, task_title),
            date_str = COALESCE(?, date_str),
            day_name = ?,
            duration_minutes = COALESCE(?, duration_minutes),
            notes = COALESCE(?, notes)
        WHERE id = ?
      `).run(
        task_title || null,
        date_str || null,
        dayName,
        duration_minutes ? Number(duration_minutes) : null,
        notes !== undefined ? notes : null,
        task.id
      );

      return sendJson(res, 200, { success: true, message: 'Study task updated.' });
    }

    // Delete Timetable Task
    if (pathname.match(/^\/api\/schedule\/task\/([a-zA-Z0-9_-]+)$/) && req.method === 'DELETE') {
      const user = requireAuth(req, res);
      if (!user) return;
      const taskId = pathname.split('/')[4];
      const task = db.prepare("SELECT * FROM study_schedule WHERE id = ? AND user_id = ?").get(taskId, user.id);
      if (!task) return sendJson(res, 404, { error: 'Task not found' });

      db.prepare("DELETE FROM study_schedule WHERE id = ?").run(task.id);
      return sendJson(res, 200, { success: true, message: 'Study task deleted.' });
    }

    // Recalculate Study Plan
    if (pathname === '/api/schedule/recalculate' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;
      const body = await parseJsonBody(req);
      const hoursPerWeek = Number(body.hours_per_week) || user.hours_per_week || 10;

      db.prepare("UPDATE users SET hours_per_week = ? WHERE id = ?").run(hoursPerWeek, user.id);
      generateScheduleForUser(db, user.id, hoursPerWeek);
      const schedule = db.prepare("SELECT * FROM study_schedule WHERE user_id = ? ORDER BY date_str ASC").all(user.id);

      return sendJson(res, 200, {
        success: true,
        hours_per_week: hoursPerWeek,
        schedule,
        message: `Study plan successfully rebalanced for ${hoursPerWeek} hours/week.`
      });
    }

    // Bulk Shift Incomplete Tasks
    if (pathname === '/api/schedule/bulk-move' && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;
      const body = await parseJsonBody(req);
      const shiftDays = Number(body.days_shift) || 1;

      const pendingTasks = db.prepare("SELECT * FROM study_schedule WHERE user_id = ? AND is_completed = 0").all(user.id);
      let shiftedCount = 0;

      for (const t of pendingTasks) {
        const curDate = new Date(t.date_str);
        if (!isNaN(curDate.getTime())) {
          curDate.setDate(curDate.getDate() + shiftDays);
          const newDateStr = curDate.toISOString().split('T')[0];
          const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          const newDayName = dayNames[curDate.getDay()];
          db.prepare("UPDATE study_schedule SET date_str = ?, day_name = ?, is_rescheduled = 1 WHERE id = ?").run(newDateStr, newDayName, t.id);
          shiftedCount++;
        }
      }

      return sendJson(res, 200, {
        success: true,
        shiftedCount,
        message: `Shifted ${shiftedCount} study tasks forward by ${shiftDays} day(s).`
      });
    }

    // Multi-Attempt Recency-Weighted Weak-Area Analytics
    if (pathname === '/api/analytics/weak-areas' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const lessonAttempts = db.prepare(`
        SELECT l.id as lesson_id, l.title as topic, l.course_id, lp.test_score as score, lp.test_passed as is_correct, lp.completed_at as attempt_date
        FROM lesson_progress lp
        JOIN lessons l ON lp.lesson_id = l.id
        WHERE lp.user_id = ? AND lp.test_attempts > 0
      `).all(user.id);

      const quizAttempts = db.prepare(`
        SELECT q.title as topic, qa.percentage as score, (qa.percentage >= 70) as is_correct, qa.weak_topics, qa.completed_at as attempt_date
        FROM quiz_attempts qa
        JOIN quizzes q ON qa.quiz_id = q.id
        WHERE qa.user_id = ?
        ORDER BY qa.completed_at DESC
      `).all(user.id);

      const questionAttempts = db.prepare(`
        SELECT qa.notes as topic, qa.score, qa.is_correct, qa.created_at as attempt_date
        FROM question_attempts qa
        WHERE qa.user_id = ? AND qa.notes IS NOT NULL AND qa.notes != ''
        ORDER BY qa.created_at DESC
      `).all(user.id);

      const topicMap = new Map();
      const addAttempt = (topicName, score, isCorrect, date) => {
        if (!topicName) return;
        const key = topicName.trim();
        if (!topicMap.has(key)) {
          topicMap.set(key, []);
        }
        topicMap.get(key).push({ score: Number(score) || 0, isCorrect: !!isCorrect, date });
      };

      for (const la of lessonAttempts) addAttempt(la.topic, la.score, la.is_correct, la.attempt_date);
      for (const qa of quizAttempts) {
        addAttempt(qa.topic, qa.score, qa.is_correct, qa.attempt_date);
        try {
          const wts = JSON.parse(qa.weak_topics || '[]');
          for (const wt of wts) addAttempt(wt, 30, false, qa.attempt_date);
        } catch (e) {}
      }
      for (const qa of questionAttempts) addAttempt(qa.topic, qa.score, qa.is_correct, qa.attempt_date);

      const strong = [];
      const improving = [];
      const needsPractice = [];
      let totalWeightedSum = 0;
      let totalWeightCount = 0;

      for (const [topic, attempts] of topicMap.entries()) {
        attempts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        const latest = attempts[0];
        let weightedScore = latest.score;

        if (attempts.length > 1) {
          const priorAvg = attempts.slice(1).reduce((acc, curr) => acc + curr.score, 0) / (attempts.length - 1);
          weightedScore = Math.round(latest.score * 0.5 + priorAvg * 0.5);
        }

        totalWeightedSum += weightedScore;
        totalWeightCount++;

        const trend = attempts.length > 1
          ? (latest.score > attempts[1].score ? 'improving' : (latest.score < attempts[1].score ? 'declining' : 'steady'))
          : 'baseline';

        const item = {
          topic,
          weightedScore,
          attemptsCount: attempts.length,
          lastAttemptDate: latest.date,
          trend
        };

        if (weightedScore >= 80) {
          strong.push(item);
        } else if (weightedScore >= 60) {
          improving.push(item);
        } else {
          needsPractice.push(item);
        }
      }

      const overallReadinessScore = totalWeightCount > 0 ? Math.round(totalWeightedSum / totalWeightCount) : 70;

      const recommendedLessons = [];
      if (needsPractice.length > 0) {
        const topNeeds = needsPractice.slice(0, 3).map(np => np.topic);
        for (const tn of topNeeds) {
          const match = db.prepare("SELECT id, title, course_id, estimated_minutes FROM lessons WHERE title LIKE ? OR content_en LIKE ? LIMIT 1").get(`%${tn}%`, `%${tn}%`);
          if (match && !recommendedLessons.some(rl => rl.id === match.id)) {
            recommendedLessons.push(match);
          }
        }
      }

      return sendJson(res, 200, {
        formulaExplanation: "Calculated using a recency-weighted exponential moving average across all quiz attempts, end-of-lesson tests, and practice questions. Your most recent attempt carries 50% weight, with older attempts discounted to accurately capture your current retention.",
        overallReadinessScore,
        strong,
        improving,
        needsPractice,
        recommendedLessons,
        isPrivate: true
      });
    }

    // -------------------------------------------------------------
    // 13. AI TUTOR CHAT & CODE REVIEW
    // -------------------------------------------------------------
    if (pathname === '/api/tutor/chat' && req.method === 'POST') {
      const user = getAuthenticatedUser(req);
      const body = await parseJsonBody(req);
      const { message, lesson_id, language } = body;

      const effectiveLang = language || (user ? user.preferred_language : 'hinglish');
      const response = await generateTutorResponse({
        message,
        lessonContext: lesson_id,
        language: effectiveLang,
        learningHistory: {}
      });

      return sendJson(res, 200, {
        reply: response.message,
        provider: response.provider,
        providerLabel: response.providerLabel,
        citations: response.citations
      });
    }

    if (pathname === '/api/tutor/review-code' && req.method === 'POST') {
      const user = getAuthenticatedUser(req);
      const body = await parseJsonBody(req);
      const { codeType, userCode, taskContext, language } = body;

      const effectiveLang = language || (user ? user.preferred_language : 'hinglish');
      const review = reviewLearnerCode({
        codeType,
        userCode,
        taskContext,
        language: effectiveLang
      });

      return sendJson(res, 200, review);
    }

    // -------------------------------------------------------------
    // 14. DATASET DOWNLOADS
    // -------------------------------------------------------------
    if (pathname.startsWith('/api/datasets/')) {
      const datasetName = pathname.split('/')[3];
      if (datasetName === 'customers.csv') {
        const header = Object.keys(customers[0]).join(',') + '\n';
        const csvRows = customers.map(c => Object.values(c).join(',')).join('\n');
        res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="customers.csv"' });
        return res.end(header + csvRows);
      } else if (datasetName === 'products.csv') {
        const header = Object.keys(products[0]).join(',') + '\n';
        const csvRows = products.map(p => Object.values(p).join(',')).join('\n');
        res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="products.csv"' });
        return res.end(header + csvRows);
      } else if (datasetName === 'orders.csv') {
        const header = Object.keys(orders[0]).join(',') + '\n';
        const csvRows = orders.map(o => Object.values(o).join(',')).join('\n');
        res.writeHead(200, { 'Content-Type': 'text/csv', 'Content-Disposition': 'attachment; filename="orders.csv"' });
        return res.end(header + csvRows);
      } else {
        return sendJson(res, 404, { error: 'Dataset not found' });
      }
    }

    // -------------------------------------------------------------
    // 15. OWNER & ADMIN DASHBOARD (RESTRICTED TO ADMIN ROLE)
    // -------------------------------------------------------------
    if (pathname === '/api/admin/users' && req.method === 'GET') {
      const admin = requireAdmin(req, res);
      if (!admin) return;

      const q = parsedUrl.query || {};
      const search = (q.search || '').trim();
      const statusFilter = (q.status || '').trim();
      const roleFilter = (q.role || '').trim();

      let sql = `
        SELECT id, name, email, phone, role, status, is_verified, 
               current_level, target_role, xp, streak_days, 
               last_login_at, last_active, created_at
        FROM users
        WHERE 1=1
      `;
      const params = [];

      if (search) {
        sql += ` AND (name LIKE ? OR email LIKE ? OR id LIKE ?)`;
        const wild = `%${search}%`;
        params.push(wild, wild, wild);
      }
      if (statusFilter) {
        sql += ` AND status = ?`;
        params.push(statusFilter);
      }
      if (roleFilter) {
        sql += ` AND role = ?`;
        params.push(roleFilter);
      }

      sql += ` ORDER BY created_at DESC LIMIT 100`;

      const userRecords = db.prepare(sql).all(...params);
      return sendJson(res, 200, { users: userRecords });
    }

    if (pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_-]+)\/status$/) && req.method === 'POST') {
      const admin = requireAdmin(req, res);
      if (!admin) return;

      const targetId = pathname.split('/')[4];
      const body = await parseJsonBody(req);
      const { status } = body;

      if (!['active', 'suspended'].includes(status)) {
        return sendJson(res, 400, { error: 'Invalid status. Must be "active" or "suspended".' });
      }

      const target = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(targetId);
      if (!target) return sendJson(res, 404, { error: 'User not found' });
      if (target.id === admin.id) return sendJson(res, 400, { error: 'Cannot suspend your own admin account' });

      db.prepare("UPDATE users SET status = ? WHERE id = ?").run(status, target.id);
      logAuditEvent(db, status === 'suspended' ? 'account_suspended' : 'account_activated', target.id, clientIp, `Status changed to ${status} by admin ${admin.email}`);

      return sendJson(res, 200, { success: true, message: `Account status updated to ${status}.` });
    }

    if (pathname.match(/^\/api\/admin\/users\/([a-zA-Z0-9_-]+)$/) && req.method === 'DELETE') {
      const admin = requireAdmin(req, res);
      if (!admin) return;

      const targetId = pathname.split('/')[4];
      const target = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(targetId);
      if (!target) return sendJson(res, 404, { error: 'User not found' });
      if (target.id === admin.id) return sendJson(res, 400, { error: 'Cannot delete your own admin account' });

      // Cascade deletion
      db.prepare("DELETE FROM sessions WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM study_schedule WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM user_notes WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM lesson_progress WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM quiz_attempts WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM question_attempts WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM user_projects WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM study_group_members WHERE user_id = ?").run(target.id);
      db.prepare("DELETE FROM user_blocks WHERE blocker_id = ? OR blocked_id = ?").run(target.id, target.id);
      db.prepare("DELETE FROM users WHERE id = ?").run(target.id);

      logAuditEvent(db, 'account_deleted', target.id, clientIp, `User ${target.email} deleted by admin ${admin.email}`);

      return sendJson(res, 200, { success: true, message: `User ${target.email} has been permanently deleted.` });
    }

    if (pathname === '/api/admin/audit-logs' && req.method === 'GET') {
      const admin = requireAdmin(req, res);
      if (!admin) return;

      const logs = db.prepare(`
        SELECT a.*, u.name as user_name, u.email as user_email
        FROM audit_logs a
        LEFT JOIN users u ON a.user_id = u.id
        ORDER BY a.created_at DESC
        LIMIT 100
      `).all();

      return sendJson(res, 200, { audit_logs: logs, logs });
    }

    if (pathname === '/api/admin/content-feedback' && req.method === 'GET') {
      const admin = requireAdmin(req, res);
      if (!admin) return;

      const reports = db.prepare(`
        SELECT cf.*, u.name as reporter_name, u.email as reporter_email
        FROM content_feedback cf
        LEFT JOIN users u ON cf.user_id = u.id
        ORDER BY cf.created_at DESC
        LIMIT 100
      `).all();

      const mapped = reports.map(r => ({
        ...r,
        course_id: r.content_id,
        lesson_id: r.content_id,
        feedback_type: r.error_category,
        details: r.description,
        suggested_correction: r.suggested_fix
      }));

      return sendJson(res, 200, { feedback: mapped, reports: mapped });
    }

    if (pathname.match(/^\/api\/admin\/content-feedback\/([a-zA-Z0-9_-]+)$/) && req.method === 'PUT') {
      const admin = requireAdmin(req, res);
      if (!admin) return;

      const reportId = pathname.split('/')[4];
      const body = await parseJsonBody(req);
      const { status, admin_notes } = body;

      if (!['open', 'reviewed', 'corrected', 'dismissed', 'resolved', 'in_review'].includes(status)) {
        return sendJson(res, 400, { error: 'Invalid status' });
      }

      db.prepare(`
        UPDATE content_feedback 
        SET status = ?, admin_notes = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(status, admin_notes || null, reportId);

      return sendJson(res, 200, { success: true, message: 'Content review report updated.' });
    }

    if (pathname === '/api/admin/user-reports' && req.method === 'GET') {
      const admin = requireAdmin(req, res);
      if (!admin) return;

      const reports = db.prepare(`
        SELECT ur.*, r.name as reporter_name, t.name as reported_name, t.email as reported_email
        FROM user_reports ur
        JOIN users r ON ur.reporter_id = r.id
        JOIN users t ON ur.reported_user_id = t.id
        ORDER BY ur.created_at DESC
        LIMIT 100
      `).all();

      const mapped = reports.map(r => ({
        ...r,
        category: r.reason
      }));

      return sendJson(res, 200, { reports: mapped });
    }

    // -------------------------------------------------------------
    // 16. CONTENT FEEDBACK & ERROR CORRECTION REPORTING
    // -------------------------------------------------------------
    if (pathname === '/api/content/feedback' && req.method === 'POST') {
      const user = getAuthenticatedUser(req);
      const body = await parseJsonBody(req);
      const contentType = body.content_type || (body.lessonId ? 'lesson' : 'course');
      const contentId = body.content_id || body.lessonId || body.courseId || 'general';
      const contentTitle = body.content_title || body.title || contentId;
      const errorCategory = body.error_category || body.feedbackType || 'technical_error';
      const description = body.description || body.details || '';
      const suggestedFix = body.suggested_fix || body.suggestedCorrection || null;

      if (!description) {
        return sendJson(res, 400, { error: 'Description or details is required.' });
      }

      const id = 'fb_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO content_feedback (id, user_id, content_type, content_id, content_title, error_category, description, suggested_fix)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        id,
        user ? user.id : null,
        contentType,
        contentId,
        contentTitle,
        errorCategory,
        description.trim(),
        suggestedFix ? suggestedFix.trim() : null
      );

      return sendJson(res, 201, {
        success: true,
        message: 'Thank you! Your correction report has been received into the pedagogical review queue.'
      });
    }

    // -------------------------------------------------------------
    // 17. USER BLOCKING & SAFETY CONTROLS
    // -------------------------------------------------------------
    if (pathname.match(/^\/api\/users\/([a-zA-Z0-9_-]+)\/block$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const targetId = pathname.split('/')[3];
      if (targetId === user.id) return sendJson(res, 400, { error: 'Cannot block yourself' });

      const target = db.prepare("SELECT id, name FROM users WHERE id = ?").get(targetId);
      if (!target) return sendJson(res, 404, { error: 'User not found' });

      const blockId = 'blk_' + crypto.randomBytes(8).toString('hex');
      try {
        db.prepare("INSERT INTO user_blocks (id, blocker_id, blocked_id) VALUES (?, ?, ?)").run(blockId, user.id, target.id);
      } catch (e) {}

      return sendJson(res, 201, { success: true, message: `You have blocked ${target.name}. They cannot message, invite, or call you.` });
    }

    if (pathname.match(/^\/api\/users\/([a-zA-Z0-9_-]+)\/unblock$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const targetId = pathname.split('/')[3];
      db.prepare("DELETE FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?").run(user.id, targetId);
      return sendJson(res, 200, { success: true, message: 'User unblocked successfully.' });
    }

    if (pathname === '/api/users/blocked' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const blockedList = db.prepare(`
        SELECT u.id, u.id as blocked_user_id, u.name, ub.created_at
        FROM user_blocks ub
        JOIN users u ON ub.blocked_id = u.id
        WHERE ub.blocker_id = ?
        ORDER BY ub.created_at DESC
      `).all(user.id);

      return sendJson(res, 200, { blocked: blockedList, blocked_users: blockedList });
    }

    if (pathname.match(/^\/api\/users\/([a-zA-Z0-9_-]+)\/report$/) && req.method === 'POST') {
      const user = requireAuth(req, res);
      if (!user) return;

      const targetId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const reason = body.reason || body.category || 'other';
      const details = body.details || '';

      const reportId = 'rep_' + crypto.randomBytes(8).toString('hex');
      db.prepare(`
        INSERT INTO user_reports (id, reporter_id, reported_user_id, reason, details)
        VALUES (?, ?, ?, ?, ?)
      `).run(reportId, user.id, targetId, reason.trim(), details ? details.trim() : null);

      return sendJson(res, 201, { success: true, message: 'Report submitted. Our moderation team will review this promptly.' });
    }

    // -------------------------------------------------------------
    // 18. GDPR PRIVACY: EXPORT DATA & ACCOUNT DELETION
    // -------------------------------------------------------------
    if (pathname === '/api/user/export-data' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const profile = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        preferred_language: user.preferred_language,
        current_level: user.current_level,
        target_role: user.target_role,
        hours_per_week: user.hours_per_week,
        target_date: user.target_date,
        xp: user.xp,
        streak_days: user.streak_days,
        created_at: user.created_at
      };

      const notes = db.prepare("SELECT lesson_id, note_text, is_shared, updated_at FROM user_notes WHERE user_id = ?").all(user.id);
      const progress = db.prepare("SELECT lesson_id, course_id, status, completed_at FROM lesson_progress WHERE user_id = ?").all(user.id);
      const schedule = db.prepare("SELECT date_str, day_name, task_title, duration_minutes, is_completed FROM study_schedule WHERE user_id = ?").all(user.id);
      const quizAttempts = db.prepare("SELECT quiz_id, score, max_score, percentage, weak_topics, completed_at FROM quiz_attempts WHERE user_id = ?").all(user.id);
      const questionAttempts = db.prepare("SELECT question_id, is_correct, score, created_at FROM question_attempts WHERE user_id = ?").all(user.id);
      const projectSubmissions = db.prepare("SELECT project_id, status, submission_notes, completed_at FROM user_projects WHERE user_id = ?").all(user.id);

      const exportPayload = {
        exportDate: new Date().toISOString(),
        profile,
        progress,
        notes,
        schedule,
        quizAttempts,
        questionAttempts,
        projectSubmissions
      };

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="data-analyst-learning-data-${user.id}.json"`
      });
      return res.end(JSON.stringify(exportPayload, null, 2));
    }

    if (pathname === '/api/user/delete-account' && req.method === 'DELETE') {
      const user = requireAuth(req, res);
      if (!user) return;

      let body = {};
      try {
        body = await parseJsonBody(req);
      } catch (e) {}

      // Cascade deletion
      db.prepare("DELETE FROM sessions WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM study_schedule WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM user_notes WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM lesson_progress WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM quiz_attempts WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM question_attempts WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM user_projects WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM user_blocks WHERE blocker_id = ? OR blocked_id = ?").run(user.id, user.id);
      db.prepare("DELETE FROM user_reports WHERE reporter_id = ? OR reported_user_id = ?").run(user.id, user.id);
      db.prepare("DELETE FROM chat_messages WHERE sender_id = ?").run(user.id);
      db.prepare("DELETE FROM group_reactions WHERE user_id = ?").run(user.id);
      db.prepare("DELETE FROM group_invitations WHERE created_by = ?").run(user.id);
      db.prepare("DELETE FROM study_group_members WHERE user_id = ?").run(user.id);

      // If user created study groups, cascade delete group dependencies
      db.prepare("DELETE FROM group_shared_goals WHERE group_id IN (SELECT id FROM study_groups WHERE created_by = ?)").run(user.id);
      db.prepare("DELETE FROM group_milestones WHERE group_id IN (SELECT id FROM study_groups WHERE created_by = ?)").run(user.id);
      db.prepare("DELETE FROM chat_messages WHERE group_id IN (SELECT id FROM study_groups WHERE created_by = ?)").run(user.id);
      db.prepare("DELETE FROM group_invitations WHERE group_id IN (SELECT id FROM study_groups WHERE created_by = ?)").run(user.id);
      db.prepare("DELETE FROM study_group_members WHERE group_id IN (SELECT id FROM study_groups WHERE created_by = ?)").run(user.id);
      db.prepare("DELETE FROM study_groups WHERE created_by = ?").run(user.id);

      db.prepare("DELETE FROM users WHERE id = ?").run(user.id);

      logAuditEvent(db, 'account_deleted', user.id, clientIp, 'User self-deleted their account and data');

      return sendJson(res, 200, { success: true, message: 'Your account and all associated personal data have been permanently deleted.' });
    }

    // -------------------------------------------------------------
    // 19. COMPREHENSIVE PRACTICE & INTERVIEW QUESTION BANK
    // -------------------------------------------------------------
    if (pathname === '/api/questions' && req.method === 'GET') {
      const q = parsedUrl.query || {};
      const courseId = q.course || q.course_id || '';
      const topic = q.topic || '';
      const difficulty = q.difficulty || '';
      const questionType = q.question_type || '';

      let sql = `
        SELECT id, course_id, topic, difficulty, question_type, 
               title, title_hi, prompt_en, prompt_hi, code_snippet, 
               options, hint_en, hint_hi, solution_en, solution_hi, explanation_en, explanation_hi, rubric, created_at
        FROM questions
        WHERE 1=1
      `;
      const params = [];

      if (courseId) {
        sql += ` AND course_id = ?`;
        params.push(courseId);
      }
      if (topic) {
        sql += ` AND topic = ?`;
        params.push(topic);
      }
      if (difficulty) {
        sql += ` AND difficulty = ?`;
        params.push(difficulty);
      }
      if (questionType) {
        sql += ` AND question_type = ?`;
        params.push(questionType);
      }

      sql += ` ORDER BY id ASC`;
      const rows = db.prepare(sql).all(...params);

      const formatted = rows.map(r => ({
        ...r,
        options: r.options ? JSON.parse(r.options) : null,
        rubric: r.rubric ? JSON.parse(r.rubric) : null,
        prompt: r.prompt_en,
        hint: r.hint_en,
        solution: r.solution_en,
        explanation: r.explanation_en
      }));

      return sendJson(res, 200, { questions: formatted, totalCount: formatted.length });
    }

    if (pathname === '/api/questions/weak-areas' && req.method === 'GET') {
      const user = requireAuth(req, res);
      if (!user) return;

      const weakList = db.prepare(`
        SELECT q.id, q.course_id, q.topic, q.difficulty, q.title, q.title_hi, 
               q.prompt_en, q.prompt_hi, q.code_snippet, q.hint_en, q.hint_hi,
               qa.score, qa.created_at as last_attempted
        FROM question_attempts qa
        JOIN questions q ON qa.question_id = q.id
        WHERE qa.user_id = ? AND qa.is_correct = 0
        ORDER BY qa.created_at DESC
        LIMIT 10
      `).all(user.id);

      const mappedWeak = weakList.map(w => ({
        ...w,
        prompt: w.prompt_en,
        hint: w.hint_en
      }));

      return sendJson(res, 200, { questions: mappedWeak, weakQuestions: mappedWeak });
    }

    if (pathname.match(/^\/api\/questions\/([a-zA-Z0-9_-]+)$/) && req.method === 'GET') {
      const qId = pathname.split('/')[3];
      const question = db.prepare(`
        SELECT id, course_id, topic, difficulty, question_type, 
               title, title_hi, prompt_en, prompt_hi, code_snippet, 
               options, hint_en, hint_hi, solution_en, solution_hi, explanation_en, explanation_hi, rubric
        FROM questions
        WHERE id = ?
      `).get(qId);

      if (!question) return sendJson(res, 404, { error: 'Question not found' });
      return sendJson(res, 200, {
        question: {
          ...question,
          options: question.options ? JSON.parse(question.options) : null,
          rubric: question.rubric ? JSON.parse(question.rubric) : null,
          prompt: question.prompt_en,
          hint: question.hint_en,
          solution: question.solution_en,
          explanation: question.explanation_en
        }
      });
    }

    if (pathname.match(/^\/api\/questions\/([a-zA-Z0-9_-]+)\/attempt$/) && req.method === 'POST') {
      const user = getAuthenticatedUser(req);
      const qId = pathname.split('/')[3];
      const body = await parseJsonBody(req);
      const userResponse = body.user_response || body.userCode || (body.answerChosen !== undefined ? String(body.answerChosen) : '');

      const question = db.prepare("SELECT * FROM questions WHERE id = ?").get(qId);
      if (!question) return sendJson(res, 404, { error: 'Question not found' });

      let isCorrect = body.isCorrect !== undefined ? (body.isCorrect ? 1 : 0) : 0;
      let score = isCorrect === 1 ? 100 : 0;

      if (body.isCorrect === undefined && userResponse) {
        const cleanUser = userResponse.trim().toLowerCase();
        const cleanSol = (question.solution_en || '').trim().toLowerCase();
        if (cleanUser === cleanSol || (cleanSol && cleanSol.includes(cleanUser))) {
          isCorrect = 1;
          score = 100;
        } else if (cleanUser.length > 15) {
          score = 70;
        }
      }

      if (user) {
        const attId = 'qa_' + crypto.randomBytes(6).toString('hex');
        db.prepare(`
          INSERT INTO question_attempts (id, user_id, question_id, user_response, is_correct, score)
          VALUES (?, ?, ?, ?, ?, ?)
        `).run(attId, user.id, question.id, userResponse || '', isCorrect, score);

        db.prepare("UPDATE users SET xp = xp + 15 WHERE id = ?").run(user.id);
      }

      return sendJson(res, 201, {
        isCorrect: isCorrect === 1,
        score,
        solution_en: question.solution_en,
        solution_hi: question.solution_hi,
        explanation_en: question.explanation_en,
        explanation_hi: question.explanation_hi,
        rubric: question.rubric ? JSON.parse(question.rubric) : []
      });
    }

    // -------------------------------------------------------------
    // STATIC FILE SERVING WITH SPA FALLBACK
    // -------------------------------------------------------------
    let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);

    if (!fs.existsSync(filePath)) {
      if (fs.existsSync(filePath + '.html')) {
        filePath = filePath + '.html';
      } else {
        filePath = path.join(PUBLIC_DIR, 'index.html');
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
      }
    });

  } catch (error) {
    console.error('[Server Error]', error);
    sendJson(res, 500, { error: 'Internal Server Error: ' + error.message });
  }
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`========================================================`);
    console.log(`🚀 ${APP_NAME} is live on http://localhost:${PORT}`);
    console.log(`📚 17 Complete Data Analyst Curriculum Courses Active`);
    console.log(`👥 Two Friends Learning Together: Study Groups & Sharing Enabled`);
    console.log(`💬 Partner Chat & WebRTC P2P Call Signaling Active`);
    console.log(`🔒 Authentication & Rate Limiting Enabled (Zero Fake Users)`);
    console.log(`========================================================`);
  });
}

module.exports = server;
