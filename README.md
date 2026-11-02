# Data Analyst Learning Platform (Full-Stack) 🚀
### Production-Grade, Zero-to-Job-Ready Data Analytics Career Platform

A complete, responsive, full-stack learning platform for people wanting to transition from zero experience into job-ready Data Analysts.

Built with a native **Node.js + SQLite (`node:sqlite`)** backend, private user authentication (PBKDF2 hashing, session tokens, email verification), an interactive bilingual AI Tutor (English & Hinglish), live SQL/Excel/Python practice runners, a 17-course curriculum covering technical and career skills, portfolio project builders, and a **Two Friends Learning Together (Study Squad)** feature with real-time peer chat and WebRTC audio/video calls.

---

## 🌟 Key Architecture & Features

### 1. Configurable Branding
- Name and title dynamically configured via the `APP_NAME` environment variable (defaults to `Data Analyst Learning Platform`).
- Configurable logos, navigation badges, and email notifications.

### 2. User Accounts & Privacy (Zero Fake Users)
- **Public Welcome Experience**: Clean landing page with direct Sign Up and Sign In buttons.
- **No Pre-seeded Demo Accounts**: The database starts completely clean; users register their own real, private accounts.
- **Security**: Passwords hashed using PBKDF2 with unique cryptographic salt. Secure bearer session tokens. Server-side route authorization.
- **Email Verification & Password Reset**: Token-based verification flow with preview links in development and standard SMTP support for production.
- **Strict Privacy**: Profiles, notes, study schedules, and detailed quiz answers remain 100% private by default.

### 3. Video + Reading Learning Modes & Interactive Video Player
- **Switchable Anytime**: Toggle seamlessly between **📖 Read Mode** and **🎬 Video Mode** on every course lesson with progress continuously preserved.
- **Interactive Educational Video Player**:
  - Full player controls (Play, Pause, timeline scrubber, elapsed/total time counters).
  - Multi-speed playback options: `0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`.
  - Executive lesson summary cards.
  - **Interactive Timestamped Transcript**: Click any cue timestamp (e.g. `02:45`) to immediately seek the player/scrubber to that point and highlight the cue.
  - **Planned Video Production Scripts & Storyboards**: Original scene-by-scene storyboards detailing visual directions and audio narration clearly labeled for transparency.
- **Rich Reading Mode**: In-depth technical explanations, key terms reference grids, formula sheets, common pitfalls with fixes, and official documentation citations.

### 4. Small Modules, End-of-Lesson Tests & Targeted Revision
- **Ordered Modules**: Bite-sized lessons moving progressively from absolute beginner to senior data analyst.
- **End-of-Lesson Tests**: Interactive 3-question assessment after *every single lesson* (MCQs, syntax interpretation, practical scenario).
- **Instant Evaluation & Scoring**: Immediate score percentage feedback and detailed explanations for each question.
- **Targeted Revision Checkpoint**: If a learner scores below 70%, the platform provides an automated revision banner recommending exact concepts to review and offers a 1-click prompt to the AI Tutor for clarification.
- **Progress Persistence**: Automatically updates user course completion and awards +40 XP upon passing.

### 5. Comprehensive Interview Preparation Suite
Prepare learners for the full spectrum of entry-level to senior Data Analyst interviews:
- **Categorized Question Vault**:
  - **Technical Screen**: SQL execution order, window functions, Pandas aggregations, Excel XLOOKUP/INDEX-MATCH, and probability distributions.
  - **Business Case Studies & Sales Scenarios**: Investigating revenue drops, calculating CAC/LTV, and framing hypotheses.
  - **Portfolio Project Defense**: Explaining architectural choices, trade-offs, and data cleaning decisions.
  - **Behavioral STAR Method**: Situation, Task, Action, and Result structured answers with impact quantification.
  - **High-Signal Reverse Questions**: Strategic questions to ask the hiring manager and team.
- **Mock Interview Simulator**: 3 structured rounds (Round 1: Screening & Fundamentals, Round 2: Core Technical & BI, Round 3: Senior Case & Architecture).
- **AI-Assisted Rubric Evaluation**: Instant grading on a 1-10 scale with feedback, self-evaluation checklists, detailed bilingual model answers, common candidate traps, and a clear disclaimer:
  > *ℹ️ AI-Assisted Evaluation (Simulated Interview Rubric) — verify with industry benchmarks and standard interview rubrics.*

### 6. Multi-Attempt Recency-Weighted Weak-Area Analytics
- **Recency-Weighted Algorithm**: Topic retention is evaluated using a transparent exponential moving average where the most recent attempt carries 50% weight, with older attempts discounted.
- **3-Zone Categorization**:
  - 🟢 **Strong (≥80%)**: Concepts mastered with high confidence and accuracy across multiple attempts.
  - 🟡 **Improving (60-79%)**: Topics progressing steadily, recommended for periodic review.
  - 🔴 **Needs Practice (<60%)**: Priority revision required before technical screenings.
- **Targeted Revision Launcher**: Direct 1-click links to lessons and practice questions matching weak topics.
- **Strict Privacy**: Your skill gap report and test outcomes are strictly private to your account.

### 7. Editable Study Timetable & Rescheduler
- **Personalized 7-Day Timetable**: Automatically generated based on available study hours.
- **Custom Study Tasks**: Add, edit, or delete custom tasks (e.g. revision notes, portfolio milestones).
- **Plan Rebalancing**: Modify weekly hours (5h, 10h, 15h, 20h) and rebalance the timetable with confirmation dialogs.
- **Bulk Shift Rescheduler**: Calmly shift pending incomplete tasks forward by 1, 2, 7, or 14 days without feeling overwhelmed.

### 8. Two Friends Learning Together (Study Squad) & Score Privacy
- **Private Groups**: Create a study group and generate a secure invite code (e.g., `JOIN-ABCD`) or link.
- **Separate Accounts & Progress**: Both friends keep distinct accounts, personal study plans, and XP.
- **Side-by-Side Progress Comparison**: Supportive, non-shaming comparison of curriculum %, lessons completed, streaks, and study hours.
- **Granular Score Privacy**: Detailed test scores and quiz percentages are kept **100% Private** by default. Users can explicitly opt-in to share scores in Squad Settings.
- **Supportive Peer Badges**: "Consistency Keeper 🔥", "Curriculum Climber 🧗", and "Dedicated Learner ⏳".
- **Milestone Reactions**: Celebrate friend milestones with instant cheer reactions (🔥, 👏, 🚀, ❤️, 💡).
- **Safety, Reporting & Blocking**: Block abusive users or file misconduct reports directly from the squad dashboard. Blocked users are strictly prevented by the server backend from sending squad chat messages or WebRTC signals.
- **Partner Chat & Video Calling**:
  - Private study partner chat with timestamps, unread indicators, and 1-click links to lessons and projects.
  - Built-in WebRTC audio/video call room with mic mute, camera toggle, and connection diagnostic indicators.

### 9. Complete 18-Course Data Analyst Curriculum
A prerequisite-based learning pathway with syllabi, lessons, formula sheets, pitfalls, worked examples, and official documentation citations:
0. **Computer & Environment Setup: Windows PowerShell, macOS zsh, Python, VS Code & DBeaver**
1. **Data Analysis Foundations & The Analyst Role**
2. **Basic Statistics & Probability for Analysts**
3. **Excel: Zero to Advanced for Data Analysts**
4. **SQL: Zero to Advanced for Relational Databases**
5. **Python for Data Analysis: Pandas, NumPy & Wrangling**
6. **Data Cleaning, Preparation & Quality Assurance**
7. **Data Visualization & Storytelling for Stakeholders**
8. **Power BI & Tableau for Business Intelligence**
9. **Business Analysis, Discovery & Requirements Gathering**
10. **Jira, Azure DevOps Basics & BPMN Process Mapping**
11. **Technical Communication & Presenting Findings to Executives**
12. **Soft Skills: Problem Solving, Critical Thinking & Stakeholder Alignment**
13. **Portfolio Project Planning, Architecture & Recruiter Presentations**
14. **GitHub & Version Control: Repositories, Commits & Professional READMEs**
15. **Responsible AI, Prompt Engineering & Verifying AI Output**
16. **Resume Engineering, LinkedIn Optimization, Networking & Job Search**
17. **Technical, Business Case & Behavioral Interview Preparation**

### 4. Practice Question Bank & Weak Areas Review
- Curated bank of real-world multiple-choice and open coding/query challenges covering every course and topic.
- Dynamic filtering by subject, difficulty (Beginner, Intermediate, Advanced), and search keywords.
- Collapsible pedagogical hints, detailed model solutions, explanations, and grading rubrics.
- "Weak Areas to Review" tab that isolates topics where a learner previously missed questions or scored low.

### 5. Two Friends Learning Together (Study Squad) & Safety Controls
- **Private Groups**: Create a study group and generate a secure invite code (e.g., `JOIN-ABCD`) or link.
- **Separate Accounts & Progress**: Both friends keep distinct accounts, personal study plans, and XP.
- **Shared Accountability Dashboard**: View shared weekly study hour targets, completed lessons, and project milestones.
- **Milestone Reactions**: Celebrate friend milestones with instant cheer reactions (🔥, 👏, 🚀, ❤️, 💡).
- **Granular Privacy Controls**: Detailed notes, quiz answers, and personal profile data remain strictly private by default. Learners can toggle sharing of lesson counts, milestone completions, and study hours.
- **Safety, Reporting & Blocking**: Block abusive users or file misconduct reports directly from the squad dashboard. Blocked users are strictly prevented by the server backend from sending squad chat messages or WebRTC signals.
- **Partner Chat & Video Calling**:
  - Private study partner chat with timestamps, unread indicators, and 1-click links to lessons and projects.
  - Built-in WebRTC audio/video call room with mic mute, camera toggle, and connection diagnostic indicators.

### 6. Administrator Console & Quality Controls
- **No Public Admin Button**: Admin accounts are provisioned via `ADMIN_EMAIL` environment variable or the secure CLI command `node make-admin.js <email>`.
- **Management Console (`#admin`)**:
  - User management: search users, suspend accounts to prevent access, or delete users with confirmation.
  - Security audit logs: minimal, privacy-preserving audit logs documenting registrations, logins, and moderation events.
  - Content feedback queue: real-time learner error reports (typos, outdated instructions, broken commands) with status tracking.
  - User conduct reports: review reports filed by learners and suspend offenders.
- **Learner Privacy Principle**: In accordance with strict zero-knowledge safeguards, personal lesson notes and private study squad chats are NEVER visible to administrators.
- **Continuous Content Verification**: Technical instructions verify against official docs with access dates. In-lesson "🚩 Report Error" button allows immediate feedback.

### 7. GDPR & CCPA Data Portability & Right to Erasure
- **Data Export**: One-click download of all user data (profile, progress, private notes, and submissions) as machine-readable JSON.
- **Account Erasure**: Permanent self-service deletion cascading across all personal data, schedules, and squad memberships.

### 8. Bilingual AI Tutor & Career Coach
- **English & Hinglish**: Seamlessly explain complex concepts in simple English or Hindi/Hinglish.
- **Pedagogical Analogies**: Relatable examples (Kirana store ledger for SQL JOINs; cricket batting averages for Mean vs. Median).
- **Progressive Hints**: Encourages critical thinking by offering hints before revealing answers.
- **Line-by-Line Code Review**: Analyzes student SQL, Excel formulas, and Python code with actionable feedback.
- **Hybrid AI Provider**: Connects to Google Gemini 1.5 Pro when `GEMINI_API_KEY` is present, or falls back transparently to the built-in local pedagogical rule engine with clear status labeling.

### 9. Interactive Practice Sandboxes
- **Live SQL Sandbox**: Direct query runner against real relational tables (`orders`, `customers`, `products`, `employee_churn`) with execution timing and data tables.
- **Excel Formula Simulator**: Test `=XLOOKUP(...)`, `=SUMIFS(...)`, `=INDEX/MATCH` against simulated spreadsheets.
- **Python Pandas EDA Console**: Run grouped aggregations and summary statistics.

### 10. Guided Portfolio Projects
5 real-world case studies with downloadable sample CSVs, milestones, rubrics, and recruiter-ready README templates:
- **E-Commerce Executive Sales & Margin Diagnostic Dashboard (Excel + Power BI)**
- **Customer Lifetime Value & Retention Funnel SQL Engine (SQL)**
- **Exploratory Data Analysis (EDA) on App Churn with Python (Pandas/Seaborn)**
- **End-to-End Messy Data Cleaning & Quality Assurance Case Study**
- **Healthcare Patient Triage Process Mapping & Bottleneck Analysis (BPMN 2.0)**

---

## 💻 Tech Stack

- **Runtime**: Node.js (v22.5.0+ or v24.0.0+)
- **Database**: SQLite using Node's native `node:sqlite` (`DatabaseSync`)
- **Frontend**: Accessible Vanilla HTML5, CSS3 with Custom Properties, Client-Side Hash Router
- **Security**: PBKDF2 password hashing with salt, HTTP session tokens, rate limiting
- **Real-Time**: WebRTC P2P audio/video + signaling server

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js v22.5.0+ or v24.0.0+ installed. On Antigravity environments, `agy-node` is pre-configured.

### 2. Configuration
Copy the environment template:
```bash
cp .env.example .env
```

Edit `.env` to configure your custom branding, port, or optional Gemini API key:
```env
PORT=3000
APP_NAME=Your Platform Name
GEMINI_API_KEY=your-gemini-api-key-optional
```

### 3. Database Initialization
Seed the database with all 17 courses and sample sandbox datasets:
```bash
node database.js
# Or on Antigravity:
agy-node database.js
```

### 4. Start Server
```bash
node server.js
# Or on Antigravity:
agy-node server.js
```

Open **http://localhost:3000** in your web browser.

---

## 👥 First-Time User Walkthrough

1. Navigate to `http://localhost:3000` (Welcome Page).
2. Click **Get Started Free** or **Sign Up**.
3. Register with your name, email, and password.
4. Activate your account using the verification link displayed on screen or printed to the server log.
5. Complete the 2-minute onboarding questionnaire to personalize your study timetable and target hours.
6. Under **Study Together > Study Squad**, create a group and invite your friend with your unique code.
7. Explore the **Course Catalog (17 Courses)**, open a lesson, and ask the AI Tutor for a Hindi or English explanation.

---

## 📖 Deployment Documentation

For comprehensive instructions on deploying to **Render, Railway, Fly.io, or Ubuntu VPS**, configuring custom domains, SSL, SMTP, and TURN relay servers, please see [`SETUP_AND_DEPLOYMENT.md`](./SETUP_AND_DEPLOYMENT.md).

---

## 📄 License
MIT License.
