// database.js - SQLite Database Initialization & Data Layer using Node 24 node:sqlite
const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const crypto = require('crypto');
const { coursesData, sampleLessonsData, quizzesData, interviewQuestionsData, guidedProjectsData, questionsData } = require('./seed_data');
const { lessonVideosAndTests } = require('./lesson_videos_and_tests_data');
const { comprehensiveInterviewQuestions } = require('./comprehensive_interview_data');
const { customers, products, orders, employee_churn } = require('./sample_datasets');

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, 'analystpath.db');
let db = null;

function hashPassword(password, salt = null) {
  const actualSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, actualSalt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt: actualSalt };
}

function verifyPassword(password, storedHash, salt) {
  if (!storedHash || !salt) return false;
  // Backward compatibility with legacy salt if salt is old default
  if (salt === 'analystpath_salt_2026') {
    const legacyCheck = crypto.pbkdf2Sync(password, salt, 1000, 32, 'sha256').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(legacyCheck), Buffer.from(storedHash));
  }
  const check = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(check), Buffer.from(storedHash));
}

function getDb() {
  if (db) return db;
  db = new DatabaseSync(DB_PATH);
  initSchema(db);
  seedInitialData(db);
  return db;
}

function initSchema(database) {
  database.exec(`
    -- Users table with verification, password reset, and privacy defaults
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT,
      password_hash TEXT NOT NULL,
      salt TEXT NOT NULL,
      role TEXT DEFAULT 'learner', -- 'learner' or 'admin'
      status TEXT DEFAULT 'active', -- 'active', 'suspended', 'deleted'
      is_verified INTEGER DEFAULT 0,
      verification_token TEXT,
      reset_token TEXT,
      reset_token_expires TEXT,
      current_level TEXT DEFAULT 'Beginner',
      target_role TEXT DEFAULT 'Junior Data Analyst',
      preferred_language TEXT DEFAULT 'hinglish',
      hours_per_week INTEGER DEFAULT 10,
      target_date TEXT,
      xp INTEGER DEFAULT 0,
      streak_days INTEGER DEFAULT 0,
      last_active TEXT DEFAULT CURRENT_TIMESTAMP,
      last_login_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Secure sessions table (persisted across restarts)
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Study Groups table
    CREATE TABLE IF NOT EXISTS study_groups (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_by TEXT NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Study Group Memberships with granular privacy/sharing flags
    CREATE TABLE IF NOT EXISTS study_group_members (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      role TEXT DEFAULT 'member', -- 'admin' or 'member'
      share_progress INTEGER DEFAULT 1,
      share_milestones INTEGER DEFAULT 1,
      share_hours INTEGER DEFAULT 1,
      joined_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(group_id, user_id),
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Group Invitations
    CREATE TABLE IF NOT EXISTS group_invitations (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      invite_code TEXT UNIQUE NOT NULL,
      created_by TEXT NOT NULL,
      expires_at TEXT,
      max_uses INTEGER DEFAULT 10,
      uses INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );

    -- Shared Group Milestones
    CREATE TABLE IF NOT EXISTS group_milestones (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      achieved_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Milestone Reactions / High-Fives
    CREATE TABLE IF NOT EXISTS group_reactions (
      id TEXT PRIMARY KEY,
      milestone_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      reaction_type TEXT NOT NULL, -- 'celebrate', 'fire', 'star', 'rocket', 'clap'
      message TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (milestone_id) REFERENCES group_milestones(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Shared Weekly Group Goals
    CREATE TABLE IF NOT EXISTS group_shared_goals (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      created_by TEXT NOT NULL,
      goal_text TEXT NOT NULL,
      target_date TEXT,
      is_completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Partner Chat Messages
    CREATE TABLE IF NOT EXISTS chat_messages (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      sender_id TEXT NOT NULL,
      message TEXT NOT NULL,
      lesson_link TEXT,
      is_read INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- WebRTC Video/Voice Call Sessions
    CREATE TABLE IF NOT EXISTS call_sessions (
      id TEXT PRIMARY KEY,
      group_id TEXT NOT NULL,
      caller_id TEXT NOT NULL,
      status TEXT DEFAULT 'active', -- 'active', 'ended'
      started_at TEXT DEFAULT CURRENT_TIMESTAMP,
      ended_at TEXT,
      FOREIGN KEY (group_id) REFERENCES study_groups(id) ON DELETE CASCADE,
      FOREIGN KEY (caller_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Private User Lesson Notes
    CREATE TABLE IF NOT EXISTS user_notes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      note_text TEXT NOT NULL,
      is_shared INTEGER DEFAULT 0,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, lesson_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Courses table
    CREATE TABLE IF NOT EXISTS courses (
      id TEXT PRIMARY KEY,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      title_hi TEXT NOT NULL,
      domain TEXT NOT NULL,
      level TEXT NOT NULL,
      icon TEXT NOT NULL,
      estimated_hours INTEGER NOT NULL,
      order_idx INTEGER NOT NULL,
      prerequisites TEXT,
      description TEXT,
      description_hi TEXT,
      learning_objectives TEXT,
      final_project_teaser TEXT
    );

    -- Lessons table
    CREATE TABLE IF NOT EXISTS lessons (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      title_hi TEXT NOT NULL,
      slug TEXT NOT NULL,
      estimated_minutes INTEGER DEFAULT 25,
      order_idx INTEGER NOT NULL,
      content_en TEXT,
      content_hi TEXT,
      key_terms TEXT,
      formula_sheet TEXT,
      worked_examples TEXT,
      common_mistakes TEXT,
      external_resources TEXT,
      practice_exercise TEXT,
      video_url TEXT,
      video_duration TEXT,
      video_summary TEXT,
      video_script TEXT,
      video_transcript TEXT,
      lesson_test TEXT,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Lesson progress (tracks both reading & video modes + end-of-lesson test)
    CREATE TABLE IF NOT EXISTS lesson_progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      lesson_id TEXT NOT NULL,
      course_id TEXT NOT NULL,
      status TEXT DEFAULT 'not_started', -- 'in_progress', 'completed'
      mode_studied TEXT DEFAULT 'reading', -- 'reading', 'video', 'both'
      test_score INTEGER DEFAULT 0,
      test_passed INTEGER DEFAULT 0,
      test_attempts INTEGER DEFAULT 0,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
    );

    -- Quizzes
    CREATE TABLE IF NOT EXISTS quizzes (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      title TEXT NOT NULL,
      title_hi TEXT NOT NULL,
      pass_score INTEGER DEFAULT 75,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- Quiz Questions
    CREATE TABLE IF NOT EXISTS quiz_questions (
      id TEXT PRIMARY KEY,
      quiz_id TEXT NOT NULL,
      question_en TEXT NOT NULL,
      question_hi TEXT NOT NULL,
      options TEXT NOT NULL, -- JSON array
      correct_answer TEXT NOT NULL,
      explanation_en TEXT,
      explanation_hi TEXT,
      topic_tag TEXT,
      FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    -- Quiz Attempts
    CREATE TABLE IF NOT EXISTS quiz_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      quiz_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      max_score INTEGER NOT NULL,
      percentage REAL NOT NULL,
      weak_topics TEXT, -- JSON array
      completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Study Schedule
    CREATE TABLE IF NOT EXISTS study_schedule (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      date_str TEXT NOT NULL,
      day_name TEXT NOT NULL,
      task_title TEXT NOT NULL,
      task_title_hi TEXT NOT NULL,
      course_id TEXT,
      duration_minutes INTEGER DEFAULT 45,
      is_completed INTEGER DEFAULT 0,
      is_rescheduled INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Guided Projects
    CREATE TABLE IF NOT EXISTS guided_projects (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      title_hi TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      difficulty TEXT NOT NULL,
      estimated_hours INTEGER NOT NULL,
      skills TEXT NOT NULL, -- JSON array
      scenario_en TEXT NOT NULL,
      scenario_hi TEXT NOT NULL,
      dataset_name TEXT,
      steps TEXT NOT NULL, -- JSON array
      rubric TEXT NOT NULL, -- JSON array
      portfolio_template TEXT NOT NULL
    );

    -- User Guided Projects Progress
    CREATE TABLE IF NOT EXISTS user_projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      project_id TEXT NOT NULL,
      status TEXT DEFAULT 'in_progress', -- 'in_progress', 'submitted', 'evaluated'
      submission_notes TEXT,
      started_at TEXT DEFAULT CURRENT_TIMESTAMP,
      completed_at TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (project_id) REFERENCES guided_projects(id) ON DELETE CASCADE
    );

    -- Interview Questions
    CREATE TABLE IF NOT EXISTS interview_questions (
      id TEXT PRIMARY KEY,
      category TEXT NOT NULL,
      difficulty TEXT NOT NULL,
      question_en TEXT NOT NULL,
      question_hi TEXT NOT NULL,
      model_answer_en TEXT NOT NULL,
      model_answer_hi TEXT NOT NULL,
      key_points TEXT NOT NULL -- JSON array
    );

    -- Interview Attempts
    CREATE TABLE IF NOT EXISTS interview_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      user_answer TEXT NOT NULL,
      score INTEGER,
      feedback_en TEXT,
      feedback_hi TEXT,
      completed_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- PRACTICE DATASETS (Tables available for direct SQL practice runner)
    CREATE TABLE IF NOT EXISTS customers (
      customer_id INTEGER PRIMARY KEY,
      full_name TEXT,
      email TEXT,
      city TEXT,
      state TEXT,
      segment TEXT,
      signup_date TEXT
    );

    CREATE TABLE IF NOT EXISTS products (
      product_id INTEGER PRIMARY KEY,
      product_name TEXT,
      category TEXT,
      sub_category TEXT,
      unit_cost REAL,
      unit_price REAL,
      stock_qty INTEGER
    );

    CREATE TABLE IF NOT EXISTS orders (
      order_id INTEGER PRIMARY KEY,
      customer_id INTEGER,
      product_id INTEGER,
      order_date TEXT,
      quantity INTEGER,
      discount_pct REAL,
      total_amount REAL,
      payment_status TEXT,
      shipping_region TEXT,
      FOREIGN KEY (customer_id) REFERENCES customers(customer_id),
      FOREIGN KEY (product_id) REFERENCES products(product_id)
    );

    CREATE TABLE IF NOT EXISTS employee_churn (
      emp_id TEXT PRIMARY KEY,
      department TEXT,
      tenure_months INTEGER,
      satisfaction_score REAL,
      last_evaluation REAL,
      monthly_salary REAL,
      left_company INTEGER
    );

    -- Minimal Security & Operational Audit Log
    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      event_type TEXT NOT NULL, -- 'registration', 'sign_in', 'sign_out', 'verification', 'password_reset', 'account_suspended', 'account_activated', 'account_deleted'
      user_id TEXT,
      ip_address TEXT,
      details TEXT, -- minimal sanitized info: never passwords, tokens, or credentials
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    -- Content Feedback & Error Correction Requests
    CREATE TABLE IF NOT EXISTS content_feedback (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      content_type TEXT NOT NULL, -- 'lesson', 'question', 'quiz', 'project'
      content_id TEXT NOT NULL,
      content_title TEXT,
      error_category TEXT NOT NULL, -- 'typo', 'code_bug', 'outdated_link', 'explanation_unclear', 'other'
      description TEXT NOT NULL,
      suggested_fix TEXT,
      status TEXT DEFAULT 'open', -- 'open', 'reviewed', 'corrected', 'dismissed'
      admin_notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );

    -- User Block List (Backend Enforced)
    CREATE TABLE IF NOT EXISTS user_blocks (
      id TEXT PRIMARY KEY,
      blocker_id TEXT NOT NULL,
      blocked_id TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(blocker_id, blocked_id),
      FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- User Conduct Reports
    CREATE TABLE IF NOT EXISTS user_reports (
      id TEXT PRIMARY KEY,
      reporter_id TEXT NOT NULL,
      reported_user_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      details TEXT,
      status TEXT DEFAULT 'pending', -- 'pending', 'resolved', 'dismissed'
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (reporter_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (reported_user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Comprehensive Practice & Interview Question Bank
    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      course_id TEXT NOT NULL,
      topic TEXT NOT NULL,
      difficulty TEXT NOT NULL, -- 'Beginner', 'Intermediate', 'Advanced'
      question_type TEXT NOT NULL, -- 'mcq', 'short_answer', 'code_task', 'scenario'
      title TEXT NOT NULL,
      title_hi TEXT,
      prompt_en TEXT NOT NULL,
      prompt_hi TEXT,
      code_snippet TEXT,
      options TEXT, -- JSON array for MCQs
      hint_en TEXT,
      hint_hi TEXT,
      solution_en TEXT NOT NULL,
      solution_hi TEXT,
      explanation_en TEXT NOT NULL,
      explanation_hi TEXT,
      rubric TEXT, -- JSON array of scoring criteria
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
    );

    -- User Question Practice Attempts (Tracks weak topics)
    CREATE TABLE IF NOT EXISTS question_attempts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      user_response TEXT,
      is_correct INTEGER,
      score REAL,
      notes TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
    );
  `);

  // Migrations for existing database files:
  try {
    const userCols = database.prepare("PRAGMA table_info(users)").all().map(c => c.name);
    if (!userCols.includes('salt')) database.exec("ALTER TABLE users ADD COLUMN salt TEXT DEFAULT ''");
    if (!userCols.includes('role')) database.exec("ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'learner'");
    if (!userCols.includes('status')) database.exec("ALTER TABLE users ADD COLUMN status TEXT DEFAULT 'active'");
    if (!userCols.includes('phone')) database.exec("ALTER TABLE users ADD COLUMN phone TEXT");
    if (!userCols.includes('last_login_at')) database.exec("ALTER TABLE users ADD COLUMN last_login_at TEXT");
    if (!userCols.includes('is_verified')) database.exec("ALTER TABLE users ADD COLUMN is_verified INTEGER DEFAULT 0");
    if (!userCols.includes('verification_token')) database.exec("ALTER TABLE users ADD COLUMN verification_token TEXT");
    if (!userCols.includes('reset_token')) database.exec("ALTER TABLE users ADD COLUMN reset_token TEXT");
    if (!userCols.includes('reset_token_expires')) database.exec("ALTER TABLE users ADD COLUMN reset_token_expires TEXT");

    const groupCols = database.prepare("PRAGMA table_info(study_groups)").all().map(c => c.name);
    if (!groupCols.includes('description')) database.exec("ALTER TABLE study_groups ADD COLUMN description TEXT");
    if (!groupCols.includes('invite_code')) database.exec("ALTER TABLE study_groups ADD COLUMN invite_code TEXT");
    if (!groupCols.includes('created_by')) database.exec("ALTER TABLE study_groups ADD COLUMN created_by TEXT");

    const memberCols = database.prepare("PRAGMA table_info(study_group_members)").all().map(c => c.name);
    if (!memberCols.includes('share_progress')) database.exec("ALTER TABLE study_group_members ADD COLUMN share_progress INTEGER DEFAULT 1");
    if (!memberCols.includes('share_milestones')) database.exec("ALTER TABLE study_group_members ADD COLUMN share_milestones INTEGER DEFAULT 1");
    if (!memberCols.includes('share_hours')) database.exec("ALTER TABLE study_group_members ADD COLUMN share_hours INTEGER DEFAULT 1");
    if (!memberCols.includes('share_scores')) database.exec("ALTER TABLE study_group_members ADD COLUMN share_scores INTEGER DEFAULT 0");

    const chatCols = database.prepare("PRAGMA table_info(chat_messages)").all().map(c => c.name);
    if (!chatCols.includes('lesson_link')) database.exec("ALTER TABLE chat_messages ADD COLUMN lesson_link TEXT");
    if (!chatCols.includes('is_read')) database.exec("ALTER TABLE chat_messages ADD COLUMN is_read INTEGER DEFAULT 0");

    const lessonCols = database.prepare("PRAGMA table_info(lessons)").all().map(c => c.name);
    if (!lessonCols.includes('video_url')) database.exec("ALTER TABLE lessons ADD COLUMN video_url TEXT");
    if (!lessonCols.includes('video_duration')) database.exec("ALTER TABLE lessons ADD COLUMN video_duration TEXT");
    if (!lessonCols.includes('video_summary')) database.exec("ALTER TABLE lessons ADD COLUMN video_summary TEXT");
    if (!lessonCols.includes('video_script')) database.exec("ALTER TABLE lessons ADD COLUMN video_script TEXT");
    if (!lessonCols.includes('video_transcript')) database.exec("ALTER TABLE lessons ADD COLUMN video_transcript TEXT");
    if (!lessonCols.includes('lesson_test')) database.exec("ALTER TABLE lessons ADD COLUMN lesson_test TEXT");

    const progCols = database.prepare("PRAGMA table_info(lesson_progress)").all().map(c => c.name);
    if (!progCols.includes('mode_studied')) database.exec("ALTER TABLE lesson_progress ADD COLUMN mode_studied TEXT DEFAULT 'reading'");
    if (!progCols.includes('test_score')) database.exec("ALTER TABLE lesson_progress ADD COLUMN test_score INTEGER DEFAULT 0");
    if (!progCols.includes('test_passed')) database.exec("ALTER TABLE lesson_progress ADD COLUMN test_passed INTEGER DEFAULT 0");
    if (!progCols.includes('test_attempts')) database.exec("ALTER TABLE lesson_progress ADD COLUMN test_attempts INTEGER DEFAULT 0");

    const schedCols = database.prepare("PRAGMA table_info(study_schedule)").all().map(c => c.name);
    if (!schedCols.includes('task_type')) database.exec("ALTER TABLE study_schedule ADD COLUMN task_type TEXT DEFAULT 'lesson'");
    if (!schedCols.includes('notes')) database.exec("ALTER TABLE study_schedule ADD COLUMN notes TEXT");

    const intQCols = database.prepare("PRAGMA table_info(interview_questions)").all().map(c => c.name);
    if (!intQCols.includes('sub_category')) database.exec("ALTER TABLE interview_questions ADD COLUMN sub_category TEXT");
    if (!intQCols.includes('stage')) database.exec("ALTER TABLE interview_questions ADD COLUMN stage TEXT");
    if (!intQCols.includes('role_type')) database.exec("ALTER TABLE interview_questions ADD COLUMN role_type TEXT");
    if (!intQCols.includes('skill_assessed')) database.exec("ALTER TABLE interview_questions ADD COLUMN skill_assessed TEXT");
    if (!intQCols.includes('answer_structure')) database.exec("ALTER TABLE interview_questions ADD COLUMN answer_structure TEXT");
    if (!intQCols.includes('common_pitfalls')) database.exec("ALTER TABLE interview_questions ADD COLUMN common_pitfalls TEXT");
    if (!intQCols.includes('detailed_explanation')) database.exec("ALTER TABLE interview_questions ADD COLUMN detailed_explanation TEXT");
  } catch (err) {
    console.warn('[Migration Warning]', err.message);
  }
}

function logAuditEvent(database, eventType, userId = null, ipAddress = null, details = null) {
  try {
    const id = 'aud_' + crypto.randomBytes(8).toString('hex');
    database.prepare(`
      INSERT INTO audit_logs (id, event_type, user_id, ip_address, details)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, eventType, userId, ipAddress, details);
  } catch (err) {
    console.warn('[Audit Log Warning]', err.message);
  }
}

function checkInitialAdmin(database) {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && adminEmail.trim()) {
    try {
      const email = adminEmail.trim();
      const user = database.prepare("SELECT id, role FROM users WHERE email = ? COLLATE NOCASE").get(email);
      if (user && user.role !== 'admin') {
        database.prepare("UPDATE users SET role = 'admin' WHERE id = ?").run(user.id);
        console.log(`[Admin] Granted admin role to configured ADMIN_EMAIL: ${email}`);
        logAuditEvent(database, 'account_elevated', user.id, '127.0.0.1', 'Configured via ADMIN_EMAIL');
      }
    } catch (e) {
      console.warn('[Check Admin Warning]', e.message);
    }
  }
}

function getLessonVideoAndTestData(l) {
  if (lessonVideosAndTests[l.id]) {
    return lessonVideosAndTests[l.id];
  }

  // Synthesize clean educational script, storyboard, transcript, and test for any lesson
  const estMins = l.estimated_minutes || 20;
  const durationSec = Math.round(estMins * 0.7 * 60);
  const durMin = Math.floor(durationSec / 60);
  const durRemSec = durationSec % 60;
  const durationStr = `${durMin < 10 ? '0' : ''}${durMin}:${durRemSec < 10 ? '0' : ''}${durRemSec}`;

  const cleanSummary = l.content_en 
    ? l.content_en.split('\n').filter(p => p.trim() && !p.startsWith('#'))[0]?.slice(0, 220) || `Comprehensive interactive walkthrough for ${l.title}.`
    : `Comprehensive interactive walkthrough for ${l.title}.`;

  const script = `### SCENE 1: Concepts & Core Foundations (00:00 - ${Math.floor(durMin * 0.3)}:00)
**Visual:** Instructor walkthrough on screen with title: "${l.title}". Highlighting architectural diagrams and core terminology.
**Presenter (Audio):** "Welcome to this session on ${l.title}. In professional data analytics, understanding the principles behind this topic ensures you make accurate, reproducible business decisions. Let's break down the foundational concepts step by step."

### SCENE 2: Hands-On Live Walkthrough & Syntax Demo (${Math.floor(durMin * 0.3)}:00 - ${Math.floor(durMin * 0.75)}:00)
**Visual:** Live terminal and IDE demonstration displaying code snippets, query executions, and data transformation steps.
**Presenter (Audio):** "Observe how we structure the syntax here. Notice what happens when we modify our parameters. Always verify your intermediate outputs before proceeding to final summaries."

### SCENE 3: Production Best Practices & Common Pitfalls (${Math.floor(durMin * 0.75)}:00 - ${durationStr})
**Visual:** Split comparison showing incorrect approach vs optimized production approach. Summary bullet points.
**Presenter (Audio):** "Before wrapping up, watch out for the common edge cases discussed in our notes. Test your knowledge in the end-of-lesson test below!"`;

  const transcript = [
    { time: "00:00", seconds: 0, title: "Overview & Objectives", text: `Welcome to ${l.title}. We review key goals and industry context.` },
    { time: "03:00", seconds: 180, title: "Step-by-Step Hands-On", text: `Walking through practical implementation and syntax mechanics in detail.` },
    { time: "08:00", seconds: 480, title: "Handling Edge Cases", text: `Inspecting potential pitfalls and learning how to avoid common errors.` },
    { time: "12:00", seconds: 720, title: "Key Takeaways & Checkpoint", text: `Wrapping up the lesson with core takeaways and preparation for the test.` }
  ];

  const test = [
    {
      id: `lt_${l.id}_01`,
      question: `What is the primary objective of understanding ${l.title} in professional data workflows?`,
      question_hi: `डेटा एनालिटिक्स में ${l.title_hi || l.title} को समझने का मुख्य उद्देश्य क्या है?`,
      type: "multiple_choice",
      options: [
        "To perform structured, reproducible, and verifiable analysis",
        "To replace the need for relational databases entirely",
        "To avoid documenting business assumptions",
        "To bypass security credentials and access permissions"
      ],
      correct_index: 0,
      topic: l.title,
      explanation: `Mastering ${l.title} allows data analysts to build clean, reproducible, and reliable analytical workflows that stakeholders can trust.`
    },
    {
      id: `lt_${l.id}_02`,
      question: `When applying ${l.title}, which best practice should an analyst follow to prevent data errors?`,
      question_hi: `${l.title_hi || l.title} लागू करते समय गलतियों से बचने के लिए क्या सावधानी बरतनी चाहिए?`,
      type: "multiple_choice",
      options: [
        "Run queries and transformations on live production without validation",
        "Inspect intermediate outputs and validate assumptions against the raw data schema",
        "Assume missing values are always exactly zero",
        "Delete rows that do not match subjective expectations"
      ],
      correct_index: 1,
      topic: `${l.title} Best Practices`,
      explanation: "Always validate intermediate outputs, schema types, and edge cases to ensure data integrity."
    },
    {
      id: `lt_${l.id}_03`,
      question: `Which metric or validation check confirms that your implementation of ${l.title} succeeded?`,
      question_hi: `${l.title_hi || l.title} का कार्यान्वयन सही हुआ है, यह जांचने का सबसे विश्वसनीय तरीका क्या है?`,
      type: "multiple_choice",
      options: [
        "The code runs without terminal errors and outputs verified expected rows or metrics",
        "The file size increases by exactly 10%",
        "The database disconnects immediately",
        "All string columns are converted to lowercase automatically"
      ],
      correct_index: 0,
      topic: `${l.title} Verification`,
      explanation: "Verification requires checking both that execution succeeds without exceptions and that calculated numbers match expected ground truth."
    }
  ];

  return {
    video_duration: durationStr,
    video_url: null,
    video_summary: cleanSummary,
    video_script: script,
    video_transcript: transcript,
    lesson_test: test
  };
}

function seedInitialData(database) {
  // Sync courses: clean obsolete courses and populate the 17 comprehensive curriculum courses
  const validIds = coursesData.map(c => `'${c.id}'`).join(',');
  database.exec(`DELETE FROM courses WHERE id NOT IN (${validIds})`);
  console.log(`[Database] Seeding/Updating ${coursesData.length} comprehensive curriculum courses...`);
  const insertCourse = database.prepare(`
    INSERT OR REPLACE INTO courses (id, slug, title, title_hi, domain, level, icon, estimated_hours, order_idx, prerequisites, description, description_hi, learning_objectives, final_project_teaser)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    for (const c of coursesData) {
      insertCourse.run(
        c.id,
        c.slug,
        c.title,
        c.title_hi,
        c.domain,
        c.level,
        c.icon,
        c.estimated_hours,
        c.order_idx,
        c.prerequisites,
        c.description,
        c.description_hi,
        JSON.stringify(c.learning_objectives),
        c.final_project_teaser
      );
    }

  // Sync lessons with Video Mode, Scripts, Transcripts, and End-of-Lesson Tests
  console.log(`[Database] Seeding/Updating ${sampleLessonsData.length} lessons with Video Mode & Tests...`);
  const insertLesson = database.prepare(`
    INSERT OR REPLACE INTO lessons (
      id, course_id, title, title_hi, slug, estimated_minutes, order_idx,
      content_en, content_hi, key_terms, formula_sheet, worked_examples,
      common_mistakes, external_resources, practice_exercise,
      video_url, video_duration, video_summary, video_script, video_transcript, lesson_test
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  for (const l of sampleLessonsData) {
    const v = getLessonVideoAndTestData(l);
    insertLesson.run(
      l.id,
      l.course_id,
      l.title,
      l.title_hi,
      l.slug,
      l.estimated_minutes,
      l.order_idx,
      l.content_en,
      l.content_hi,
      JSON.stringify(l.key_terms || []),
      JSON.stringify(l.formula_sheet || []),
      JSON.stringify(l.worked_examples || []),
      JSON.stringify(l.common_mistakes || []),
      JSON.stringify(l.external_resources || []),
      JSON.stringify(l.practice_exercise || null),
      v.video_url || null,
      v.video_duration || '15:00',
      v.video_summary || '',
      v.video_script || '',
      JSON.stringify(v.video_transcript || []),
      JSON.stringify(v.lesson_test || [])
    );
  }

  // Sync Quizzes
  const checkQuiz = database.prepare("SELECT COUNT(*) AS count FROM quizzes").get();
  if (checkQuiz.count < quizzesData.length) {
    console.log("[Database] Seeding quizzes...");
    const insertQuiz = database.prepare(`
      INSERT OR REPLACE INTO quizzes (id, course_id, title, title_hi, pass_score)
      VALUES (?, ?, ?, ?, ?)
    `);
    const insertQ = database.prepare(`
      INSERT OR REPLACE INTO quiz_questions (id, quiz_id, question_en, question_hi, options, correct_answer, explanation_en, explanation_hi, topic_tag)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const q of quizzesData) {
      insertQuiz.run(q.id, q.course_id, q.title, q.title_hi, q.pass_score);
      for (const question of q.questions) {
        insertQ.run(
          question.id,
          q.id,
          question.question_en,
          question.question_hi,
          JSON.stringify(question.options),
          question.correct_answer,
          question.explanation_en,
          question.explanation_hi,
          question.topic_tag
        );
      }
    }
  }

  // Sync Guided Projects
  const checkProj = database.prepare("SELECT COUNT(*) AS count FROM guided_projects").get();
  if (checkProj.count < guidedProjectsData.length) {
    console.log("[Database] Seeding guided portfolio projects...");
    const insertProj = database.prepare(`
      INSERT OR REPLACE INTO guided_projects (id, title, title_hi, slug, difficulty, estimated_hours, skills, scenario_en, scenario_hi, dataset_name, steps, rubric, portfolio_template)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const p of guidedProjectsData) {
      insertProj.run(
        p.id,
        p.title,
        p.title_hi,
        p.slug,
        p.difficulty,
        p.estimated_hours,
        JSON.stringify(p.skills),
        p.scenario_en,
        p.scenario_hi,
        p.dataset_name,
        JSON.stringify(p.steps),
        JSON.stringify(p.rubric),
        p.portfolio_template
      );
    }
  }

  // Sync Interview Questions & Comprehensive Question Bank
  console.log("[Database] Seeding Comprehensive Interview Question Vault...");
  const insertInt = database.prepare(`
    INSERT OR REPLACE INTO interview_questions (
      id, category, sub_category, stage, role_type, skill_assessed, difficulty,
      question_en, question_hi, answer_structure, model_answer_en, model_answer_hi,
      common_pitfalls, detailed_explanation, key_points
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  if (Array.isArray(comprehensiveInterviewQuestions)) {
    for (const item of comprehensiveInterviewQuestions) {
      insertInt.run(
        item.id,
        item.category,
        item.sub_category || 'Technical',
        item.stage || 'Technical Screen',
        item.role_type || 'Junior Data Analyst',
        item.skill_assessed || item.category,
        item.difficulty,
        item.question_en,
        item.question_hi,
        JSON.stringify(item.answer_structure || []),
        item.model_answer_en,
        item.model_answer_hi,
        JSON.stringify(item.common_pitfalls || []),
        item.detailed_explanation || '',
        JSON.stringify(item.key_points || [])
      );
    }
  }

  for (const item of interviewQuestionsData) {
    insertInt.run(
      item.id,
      item.category,
      'Core Fundamentals',
      'Initial Screening',
      'Entry-Level Analyst',
      item.category,
      item.difficulty,
      item.question_en,
      item.question_hi,
      JSON.stringify(["Clarify business requirements", "Explain reasoning & formula/code logic", "State solution and business impact"]),
      item.model_answer_en,
      item.model_answer_hi,
      JSON.stringify([]),
      '',
      JSON.stringify(item.key_points || [])
    );
  }

  // Seed Practice Tables (customers, products, orders, employee_churn)
  const checkCust = database.prepare("SELECT COUNT(*) AS count FROM customers").get();
  if (checkCust.count === 0) {
    console.log("[Database] Seeding practice dataset tables...");
    const insCust = database.prepare("INSERT INTO customers VALUES (?, ?, ?, ?, ?, ?, ?)");
    for (const c of customers) {
      insCust.run(c.customer_id, c.full_name, c.email, c.city, c.state, c.segment, c.signup_date);
    }

    const insProd = database.prepare("INSERT INTO products VALUES (?, ?, ?, ?, ?, ?, ?)");
    for (const p of products) {
      insProd.run(p.product_id, p.product_name, p.category, p.sub_category, p.unit_cost, p.unit_price, p.stock_qty);
    }

    const insOrder = database.prepare("INSERT INTO orders VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    for (const o of orders) {
      insOrder.run(o.order_id, o.customer_id, o.product_id, o.order_date, o.quantity, o.discount_pct, o.total_amount, o.payment_status, o.shipping_region);
    }

    const insChurn = database.prepare("INSERT INTO employee_churn VALUES (?, ?, ?, ?, ?, ?, ?)");
    for (const ec of employee_churn) {
      insChurn.run(ec.emp_id, ec.department, ec.tenure_months, ec.satisfaction_score, ec.last_evaluation, ec.monthly_salary, ec.left_company);
    }
  }

  // Sync Questions Bank
  if (questionsData && questionsData.length > 0) {
    const checkQues = database.prepare("SELECT COUNT(*) AS count FROM questions").get();
    if (checkQues.count < questionsData.length) {
      console.log(`[Database] Seeding ${questionsData.length} practice & interview questions...`);
      const insertQues = database.prepare(`
        INSERT OR REPLACE INTO questions (id, course_id, topic, difficulty, question_type, title, title_hi, prompt_en, prompt_hi, code_snippet, options, hint_en, hint_hi, solution_en, solution_hi, explanation_en, explanation_hi, rubric)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const q of questionsData) {
        insertQues.run(
          q.id,
          q.course_id,
          q.topic,
          q.difficulty,
          q.question_type,
          q.title,
          q.title_hi || null,
          q.prompt_en,
          q.prompt_hi || null,
          q.code_snippet || null,
          q.options ? JSON.stringify(q.options) : null,
          q.hint_en || null,
          q.hint_hi || null,
          q.solution_en,
          q.solution_hi || null,
          q.explanation_en,
          q.explanation_hi || null,
          q.rubric ? JSON.stringify(q.rubric) : null
        );
      }
    }
  }

  // IMPORTANT: No fake or demo users are pre-seeded!
  // Any legacy demo user is purged to adhere strictly to:
  // "Do not prefill a demo account or display fake people as real users."
  database.prepare("DELETE FROM lesson_progress WHERE user_id = 'usr_demo_01'").run();
  database.prepare("DELETE FROM quiz_attempts WHERE user_id = 'usr_demo_01'").run();
  database.prepare("DELETE FROM study_schedule WHERE user_id = 'usr_demo_01'").run();
  database.prepare("DELETE FROM users WHERE email = 'learner@analystpath.ai' OR id = 'usr_demo_01'").run();

  // Check initial admin configuration
  checkInitialAdmin(database);
}

function generateScheduleForUser(database, userId, hoursPerWeek = 10) {
  // Preserve user custom study tasks; only regenerate system lesson tasks
  database.prepare("DELETE FROM study_schedule WHERE user_id = ? AND (task_type = 'lesson' OR task_type IS NULL)").run(userId);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const tasks = [
    { title: "SQL Basics: Master SELECT & WHERE filtering", title_hi: "एसक्यूएल बेसिक्स: SELECT और WHERE से डेटा छांटना", course_id: "sql", dur: 45 },
    { title: "Practice: Solve 3 SQL filtering exercises", title_hi: "प्रैक्टिस: 3 एसक्यूएल फिल्टरिंग सवाल हल करें", course_id: "sql", dur: 30 },
    { title: "Excel Lookups: Practice XLOOKUP & INDEX/MATCH", title_hi: "एक्सेल: XLOOKUP और फॉर्मूले का अभ्यास", course_id: "excel", dur: 60 },
    { title: "Statistics: Mean vs Median in skewed distributions", title_hi: "स्टैटिस्टिक्स: Mean vs Median का अंतर समझें", course_id: "statistics", dur: 45 },
    { title: "SQL Joins: Master INNER and LEFT JOINs", title_hi: "एसक्यूएल जॉइन्स: दो टेबल्स को आपस में जोड़ना", course_id: "sql", dur: 60 },
    { title: "Portfolio: Start E-Commerce Sales & Margin Brief", title_hi: "पोर्टफोलियो प्रोजेक्ट: ई-कॉमर्स सेल्स केस स्टडी शुरू करें", course_id: "foundations", dur: 90 },
    { title: "Weekly Review: Partner check-in & mock interview", title_hi: "वीकली रिवीजन: पार्टनर चेक-इन और मॉक इंटरव्यू", course_id: "interview-prep", dur: 45 }
  ];

  const now = new Date();
  const insertTask = database.prepare(`
    INSERT INTO study_schedule (id, user_id, date_str, day_name, task_title, task_title_hi, course_id, duration_minutes, is_completed, is_rescheduled)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0, 0)
  `);

  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayName = days[d.getDay() === 0 ? 6 : d.getDay() - 1];
    const task = tasks[i % tasks.length];
    const taskId = `sched_${userId}_${i}_${Date.now()}`;
    insertTask.run(taskId, userId, dateStr, dayName, task.title, task.title_hi || null, task.course_id, task.dur);
  }
}

if (require.main === module) {
  getDb();
}

module.exports = {
  getDb,
  hashPassword,
  verifyPassword,
  generateScheduleForUser,
  logAuditEvent,
  checkInitialAdmin
};
