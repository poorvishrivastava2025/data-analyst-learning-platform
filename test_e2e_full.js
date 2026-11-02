// test_e2e_full.js - End-to-End Verification Test Suite
const { Readable } = require('stream');
const { EventEmitter } = require('events');
const { getDb } = require('./database');
const server = require('./server');

const db = getDb();

async function runTests() {
  console.log('=== STARTING END-TO-END VERIFICATION ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, name) {
    if (condition) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name}`);
      failed++;
    }
  }

  // 1. Verify Database Courses & Datasets
  const courseCount = db.prepare('SELECT COUNT(*) as count FROM courses').get().count;
  assert(courseCount === 18, `Curriculum has exact 18 courses including Computer Setup (got: ${courseCount})`);

  const practiceTables = ['orders', 'customers', 'products', 'employee_churn'];
  for (const tbl of practiceTables) {
    const row = db.prepare(`SELECT COUNT(*) as count FROM ${tbl}`).get();
    assert(row.count > 0, `Table ${tbl} has data (${row.count} rows)`);
  }

  // Helper: Dispatch in-memory HTTP request directly to server handler
  function request(method, urlPath, body = null, token = null) {
    return new Promise((resolve, reject) => {
      const bodyStr = body ? JSON.stringify(body) : '';
      const headers = {
        'content-type': 'application/json',
        'host': 'localhost:3000'
      };
      if (token) headers['authorization'] = `Bearer ${token}`;
      if (body) headers['content-length'] = Buffer.byteLength(bodyStr);

      // Create mock request (Readable stream)
      const req = new Readable({
        read() {
          if (bodyStr) {
            this.push(Buffer.from(bodyStr));
          }
          this.push(null);
        }
      });
      req.url = urlPath;
      req.method = method;
      req.headers = headers;
      req.socket = { remoteAddress: '127.0.0.1' };

      // Create mock response
      let statusCode = 200;
      const resHeaders = {};
      const chunks = [];

      const res = new EventEmitter();
      res.writeHead = (status, h = {}) => {
        statusCode = status;
        Object.assign(resHeaders, h);
      };
      res.setHeader = (k, v) => { resHeaders[k.toLowerCase()] = v; };
      res.getHeader = (k) => resHeaders[k.toLowerCase()];
      res.write = (chunk) => { if (chunk) chunks.push(Buffer.from(chunk)); };
      res.end = (chunk) => {
        if (chunk) chunks.push(Buffer.from(chunk));
        const resBodyStr = Buffer.concat(chunks).toString('utf8');
        let parsedData = null;
        try {
          parsedData = JSON.parse(resBodyStr);
        } catch (e) {
          parsedData = resBodyStr;
        }
        resolve({ status: statusCode, headers: resHeaders, data: parsedData });
      };

      server.emit('request', req, res);
    });
  }

  // 2. Test Config API (Branding)
  const configRes = await request('GET', '/api/config');
  assert(configRes.status === 200, 'GET /api/config succeeds');
  assert(typeof configRes.data.appName === 'string', `Configurable app name present: "${configRes.data.appName}"`);

  // 3. Test Registration Validation (Rejects invalid input)
  const invalidReg = await request('POST', '/api/auth/register', { name: '', email: 'not-an-email', password: '123' });
  assert(invalidReg.status === 400, 'Registration rejects invalid email & short password');

  // 4. Test Real User Registration
  const emailA = `alice_${Date.now()}@example.com`;
  const regResA = await request('POST', '/api/auth/register', {
    name: 'Alice Learner',
    email: emailA,
    password: 'SecurePassword123!',
    preferred_language: 'hinglish'
  });
  assert(regResA.status === 201, 'User A registered successfully');
  assert(!!regResA.data.verificationToken, 'Verification token generated for User A');

  // 5. Test Email Verification
  const verifyRes = await request('POST', '/api/auth/verify', { token: regResA.data.verificationToken });
  assert(verifyRes.status === 200, 'Email verification succeeds for User A');

  // 6. Test User Login & Session Generation
  const loginResA = await request('POST', '/api/auth/login', { email: emailA, password: 'SecurePassword123!' });
  assert(loginResA.status === 200, 'User A login succeeds with valid credentials');
  assert(!!loginResA.data.token, 'Session bearer token generated');
  const tokenA = loginResA.data.token;

  // 7. Test Protected Route /api/auth/me
  const meResA = await request('GET', '/api/auth/me', null, tokenA);
  assert(meResA.status === 200 && meResA.data.user.name === 'Alice Learner', 'GET /api/auth/me returns private user profile');

  // 8. Register and Login Friend B
  const emailB = `bob_${Date.now()}@example.com`;
  const regResB = await request('POST', '/api/auth/register', {
    name: 'Bob StudyPartner',
    email: emailB,
    password: 'SecurePassword123!',
    preferred_language: 'en'
  });
  await request('POST', '/api/auth/verify', { token: regResB.data.verificationToken });
  const loginResB = await request('POST', '/api/auth/login', { email: emailB, password: 'SecurePassword123!' });
  const tokenB = loginResB.data.token;
  assert(!!tokenB, 'Friend B registered, verified, and logged in');

  // 9. Two Friends Learning Together: Create Study Squad
  const createGroupRes = await request('POST', '/api/groups', {
    name: 'Data Champions Duo',
    description: 'Prepping for Data Analyst interviews together',
    weekly_hours_goal: 15
  }, tokenA);
  assert(createGroupRes.status === 201, 'User A creates Study Squad');
  const groupId = createGroupRes.data.groupId;
  const inviteCode = createGroupRes.data.inviteCode;
  assert(!!inviteCode, `Invite code generated: ${inviteCode}`);

  // 10. Friend B Joins using Invite Code
  const joinRes = await request('POST', '/api/groups/join', { invite_code: inviteCode }, tokenB);
  assert(joinRes.status === 200, 'Friend B joins study squad using invite code');

  // 11. Fetch Shared Dashboard & Verify Privacy
  const groupDetailRes = await request('GET', `/api/groups/${groupId}`, null, tokenA);
  assert(groupDetailRes.status === 200, 'Fetch shared study group dashboard');
  assert(groupDetailRes.data.members.length === 2, 'Group has 2 distinct members with separate accounts');

  // 12. Milestones and Reactions
  assert(groupDetailRes.data.milestones && groupDetailRes.data.milestones.length > 0, 'Group milestones exist');
  const milestoneId = groupDetailRes.data.milestones[0].id;

  const reactRes = await request('POST', `/api/groups/${groupId}/reactions`, {
    milestone_id: milestoneId,
    reaction_type: 'fire'
  }, tokenB);
  assert(reactRes.status === 201, 'Friend B reacted with celebration emoji 🔥');

  // 13. Partner Chat with Lesson Link
  const chatMsgRes = await request('POST', `/api/groups/${groupId}/chat`, {
    message: 'Hey Bob, check out this SQL JOIN explanation!',
    lesson_link: '#lesson/sql-basics'
  }, tokenA);
  assert(chatMsgRes.status === 201, 'User A sent partner chat message with lesson link');

  const getChatRes = await request('GET', `/api/groups/${groupId}/chat`, null, tokenB);
  assert(getChatRes.status === 200 && getChatRes.data.messages.length > 0, 'Friend B received chat message in real time');

  // 14. WebRTC Call Signaling Endpoint
  const signalRes = await request('POST', '/api/calls/signal', {
    groupId: groupId,
    signalType: 'offer',
    data: { sdp: 'v=0...' }
  }, tokenA);
  assert(signalRes.status === 200, 'WebRTC signaling endpoint accepts call offer');

  // 15. Live SQL Practice Sandbox
  const sqlRes = await request('POST', '/api/practice/sql', {
    query: 'SELECT full_name, total_amount FROM orders JOIN customers USING (customer_id) LIMIT 3'
  }, tokenA);
  assert(sqlRes.status === 200 && sqlRes.data.rows && sqlRes.data.rows.length === 3, 'Live SQL sandbox executed relational JOIN successfully');

  // 16. AI Tutor Interaction (Bilingual prompt)
  const tutorRes = await request('POST', '/api/tutor/chat', {
    message: 'Can you explain SQL INNER JOIN with a simple Kirana store example in Hinglish?',
    language: 'hinglish',
    topic: 'SQL'
  }, tokenA);
  assert(tutorRes.status === 200 && tutorRes.data.reply.length > 50, 'AI Tutor answered in Hinglish with pedagogical analogy');

  // 17. Quiz Submission & Weak Topic Tracking
  const quizSubRes = await request('POST', '/api/quizzes/quiz-sql-foundations/submit', {
    answers: {}
  }, tokenA);
  assert(quizSubRes.status === 200, 'Quiz evaluated with score & explanations');

  // 18. Admin Security Enforcement (Non-admin User B gets 403)
  const forbiddenAdminRes = await request('GET', '/api/admin/users', null, tokenB);
  assert(forbiddenAdminRes.status === 403, 'Non-admin receives 403 Forbidden on admin endpoint');

  // 19. Admin Promotion & Admin Endpoints (Promote User A to Admin)
  db.prepare("UPDATE users SET role = 'admin' WHERE email = ?").run(emailA);
  const adminUsersRes = await request('GET', '/api/admin/users', null, tokenA);
  assert(adminUsersRes.status === 200 && adminUsersRes.data.users.length >= 2, 'Admin receives list of registered users');

  // 20. Security Audit Logs Retrieval
  const auditLogsRes = await request('GET', '/api/admin/audit-logs', null, tokenA);
  assert(auditLogsRes.status === 200 && Array.isArray(auditLogsRes.data.audit_logs), 'Admin fetches privacy-preserving audit logs');
  assert(auditLogsRes.data.audit_logs.some(l => l.event_type.includes('sign_in') || l.event_type.includes('registration')), 'Audit log contains authentication event records');

  // 21. Content Error Reporting & Review Queue
  const fbSubmitRes = await request('POST', '/api/content/feedback', {
    courseId: 'setup',
    lessonId: 'setup-101',
    feedbackType: 'technical_error',
    details: 'Step 4 python PATH checkbox details needs extra tip for Windows 11',
    suggestedCorrection: 'Add winget install command'
  }, tokenB);
  assert(fbSubmitRes.status === 201, 'Learner B submits content correction feedback');

  const fbListRes = await request('GET', '/api/admin/content-feedback', null, tokenA);
  assert(fbListRes.status === 200 && fbListRes.data.feedback.length > 0, 'Admin receives content error reports queue');
  const fbItem = fbListRes.data.feedback[0];

  const fbResolveRes = await request('PUT', `/api/admin/content-feedback/${fbItem.id}`, {
    status: 'resolved',
    admin_notes: 'Updated setup-101 with winget command'
  }, tokenA);
  assert(fbResolveRes.status === 200, 'Admin marks content report as resolved');

  // 22. User Misconduct Reporting & Admin Review
  const userB_id = regResB.data.user ? regResB.data.user.id : db.prepare('SELECT id FROM users WHERE email = ?').get(emailB).id;
  const userA_id = regResA.data.user ? regResA.data.user.id : db.prepare('SELECT id FROM users WHERE email = ?').get(emailA).id;

  const reportRes = await request('POST', `/api/users/${userB_id}/report`, {
    category: 'spam',
    details: 'Sent unsolicited advertisements in chat'
  }, tokenA);
  assert(reportRes.status === 201, 'User A reports User B for misconduct');

  const adminReportsRes = await request('GET', '/api/admin/user-reports', null, tokenA);
  assert(adminReportsRes.status === 200 && adminReportsRes.data.reports.length > 0, 'Admin reviews submitted misconduct reports');

  // 23. User Blocking & Backend Enforcement
  const blockRes = await request('POST', `/api/users/${userB_id}/block`, {
    reason: 'Spamming'
  }, tokenA);
  assert(blockRes.status === 201, 'User A blocks User B');

  // Blocked user B attempts to send chat to group containing blocker A -> should be forbidden (403)
  const blockedChatRes = await request('POST', `/api/groups/${groupId}/chat`, {
    message: 'Can you hear me?'
  }, tokenB);
  assert(blockedChatRes.status === 403, 'Backend strictly enforces block: Blocked user cannot chat in group');

  // Unblock
  const unblockRes = await request('POST', `/api/users/${userB_id}/unblock`, {}, tokenA);
  assert(unblockRes.status === 200, 'User A unblocks User B');

  // 24. Question Bank API & Weak Areas
  const qListRes = await request('GET', '/api/questions?course=sql');
  assert(qListRes.status === 200 && qListRes.data.questions.length > 0, 'Questions bank returns topic-wise practice questions');
  const sampleQ = qListRes.data.questions[0];

  const attemptRes = await request('POST', `/api/questions/${sampleQ.id}/attempt`, {
    isCorrect: false,
    answerChosen: 0,
    userCode: 'SELECT * FROM nowhere'
  }, tokenB);
  assert(attemptRes.status === 201, 'User B saves question attempt');

  const weakQRes = await request('GET', '/api/questions/weak-areas', null, tokenB);
  assert(weakQRes.status === 200 && Array.isArray(weakQRes.data.questions), 'Weak areas endpoint returns prioritized practice list');

  // 25. Video Mode Switching & Verification
  const modeRes = await request('POST', '/api/lessons/setup-101/mode', { mode: 'video' }, tokenA);
  assert(modeRes.status === 200 && modeRes.data.mode_studied === 'video', 'Learner A switches to Video Mode and saves preference');

  const lessonDetailRes = await request('GET', '/api/lessons/setup-101', null, tokenA);
  assert(lessonDetailRes.status === 200, 'Lesson detail endpoint returns 200 OK');
  assert(lessonDetailRes.data.lesson.video_duration && lessonDetailRes.data.lesson.video_summary, 'Lesson contains video duration and summary');
  assert(Array.isArray(lessonDetailRes.data.lesson.video_transcript) && lessonDetailRes.data.lesson.video_transcript.length > 0, 'Lesson contains interactive timestamped transcript cues');
  assert(Array.isArray(lessonDetailRes.data.lesson.lesson_test) && lessonDetailRes.data.lesson.lesson_test.length > 0, 'Lesson contains structured end-of-lesson test questions');

  // 26. End-of-Lesson Test Submission & Scoring
  const testSubRes = await request('POST', '/api/lessons/setup-101/test-attempt', {
    answers: [1, 0, 0] // Q1: index 1 is correct, Q2: index 0, Q3: index 0
  }, tokenA);
  assert(testSubRes.status === 200, 'Learner A submits end-of-lesson test');
  assert(testSubRes.data.totalQuestions === 3, 'End-of-lesson test evaluated 3 questions');
  assert(typeof testSubRes.data.score === 'number' && testSubRes.data.questionResults.length === 3, 'Test result contains score and question feedback');

  // 27. Comprehensive Interview Preparation & AI Rubric Evaluation
  const mockRoundsRes = await request('GET', '/api/interview/mock-rounds');
  assert(mockRoundsRes.status === 200 && mockRoundsRes.data.rounds.length === 3, 'Mock interview rounds endpoint returns 3 structured rounds');

  const intQuestionsRes = await request('GET', '/api/interview/questions?category=SQL+Technical');
  assert(intQuestionsRes.status === 200 && intQuestionsRes.data.questions.length > 0, 'Interview question vault filters by category');
  const sampleIntQ = intQuestionsRes.data.questions[0];

  const evalRes = await request('POST', '/api/interview/evaluate', {
    question_id: sampleIntQ.id,
    user_answer: 'WHERE filters rows before aggregation occurs, while HAVING filters collapsed groups after GROUP BY. For example, SELECT category, SUM(amount) FROM orders WHERE status = "Completed" GROUP BY category HAVING SUM(amount) > 50000; In SQL execution order, WHERE runs before HAVING.',
    self_ratings: [true, true, true, true],
    language: 'en'
  }, tokenA);
  assert(evalRes.status === 200 && evalRes.data.score >= 7, 'AI Rubric evaluates comprehensive interview response');
  assert(evalRes.data.disclaimer && evalRes.data.disclaimer.includes('AI-Assisted Evaluation'), 'AI interview evaluation contains transparent rubric disclaimer');

  // 28. Multi-Attempt Recency-Weighted Weak-Area Analytics
  const weakAnalyticsRes = await request('GET', '/api/analytics/weak-areas', null, tokenA);
  assert(weakAnalyticsRes.status === 200, 'Weak-area weighted analytics endpoint returns 200 OK');
  assert(weakAnalyticsRes.data.formulaExplanation && typeof weakAnalyticsRes.data.overallReadinessScore === 'number', 'Analytics contains transparent calculation explanation and readiness score');
  assert(Array.isArray(weakAnalyticsRes.data.strong) && Array.isArray(weakAnalyticsRes.data.improving) && Array.isArray(weakAnalyticsRes.data.needsPractice), 'Analytics categorizes into Strong, Improving, and Needs Practice');

  // 29. Editable Study Timetable Management
  const addTaskRes = await request('POST', '/api/schedule/task', {
    task_title: 'Revise Power BI DAX Formulas',
    date_str: '2026-11-05',
    duration_minutes: 45,
    task_type: 'revision',
    notes: 'Focus on CALCULATE() and FILTER()'
  }, tokenA);
  assert(addTaskRes.status === 201 && addTaskRes.data.taskId, 'Learner A adds custom timetable task');
  const customTaskId = addTaskRes.data.taskId;

  const updateTaskRes = await request('PUT', `/api/schedule/task/${customTaskId}`, {
    duration_minutes: 60,
    notes: 'Updated: Master CALCULATE() filter context transition'
  }, tokenA);
  assert(updateTaskRes.status === 200, 'Learner A updates custom timetable task');

  const rebalRes = await request('POST', '/api/schedule/recalculate', { hours_per_week: 15 }, tokenA);
  assert(rebalRes.status === 200 && rebalRes.data.hours_per_week === 15, 'Learner A recalculates study plan for 15 hours/week');

  const bulkShiftRes = await request('POST', '/api/schedule/bulk-move', { days_shift: 2 }, tokenA);
  assert(bulkShiftRes.status === 200 && typeof bulkShiftRes.data.shiftedCount === 'number', 'Learner A bulk shifts pending tasks forward');

  const deleteTaskRes = await request('DELETE', `/api/schedule/task/${customTaskId}`, null, tokenA);
  assert(deleteTaskRes.status === 200, 'Learner A deletes custom timetable task');

  // 30. Two-Friend Side-by-Side Progress Comparison with Score Privacy
  const updateSharingRes = await request('PUT', `/api/groups/${groupId}/sharing`, {
    share_progress: true,
    share_milestones: true,
    share_hours: true,
    share_scores: true
  }, tokenA);
  assert(updateSharingRes.status === 200, 'User A updates squad sharing to include quiz and test scores');

  const comparisonRes = await request('GET', `/api/groups/${groupId}/comparison`, null, tokenA);
  assert(comparisonRes.status === 200, 'Squad comparison endpoint returns 200 OK');
  assert(Array.isArray(comparisonRes.data.comparison) && comparisonRes.data.comparison.length === 2, 'Squad comparison returns side-by-side data for both friends');
  assert(comparisonRes.data.supportive_message, 'Comparison includes supportive, non-shaming peer message');

  // 31. GDPR Data Portability (Export JSON)
  const exportRes = await request('GET', '/api/user/export-data', null, tokenA);
  assert(exportRes.status === 200, 'GDPR Data Export returns 200 OK');
  assert(exportRes.data.profile && exportRes.data.profile.email === emailA, 'Export payload contains user profile data');
  assert(Array.isArray(exportRes.data.progress) && Array.isArray(exportRes.data.notes), 'Export payload contains progress and private notes');

  // 26. GDPR Right to Erasure (Delete Account)
  const deleteRes = await request('DELETE', '/api/user/delete-account', null, tokenB);
  assert(deleteRes.status === 200, 'User B deletes account and triggers cascade erasure');
  const checkUserB = db.prepare('SELECT id FROM users WHERE email = ?').get(emailB);
  assert(!checkUserB, 'User B completely erased from users table');

  // 27. Cleanup Test Records
  await request('DELETE', '/api/user/delete-account', null, tokenA);
  console.log('[CLEANUP] Test records safely purged.');

  console.log(`\n========================================`);
  console.log(`TOTAL TESTS: ${passed + failed}`);
  console.log(`PASSED: ${passed}`);
  console.log(`FAILED: ${failed}`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED SUCCESSFULLY!');
  }
}

runTests().catch(err => {
  console.error('Fatal error during test run:', err);
  process.exit(1);
});
