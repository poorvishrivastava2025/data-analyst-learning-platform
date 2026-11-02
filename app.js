// app.js - Full-Stack Application View Controller & Event Orchestrator
const App = {
  async init() {
    // 1. Fetch System Config (Configurable Branding)
    try {
      const config = await API.getConfig();
      if (config && config.appName) {
        State.appName = config.appName;
        State.aiProviderLabel = config.aiLabel;
        document.title = `${config.appName} - Zero to Job-Ready Data Analyst`;
        const brandEls = document.querySelectorAll('.brand-title-text');
        brandEls.forEach(el => el.innerText = config.appName);
      }
    } catch (e) {
      console.warn('Could not load server config, using defaults');
    }

    // 2. Check Session & Authenticate User (Real Auth - Zero Fake Users)
    try {
      const userData = await API.getMe();
      if (userData && userData.user) {
        State.setUser(userData.user);
      } else {
        State.setUser(null);
      }
    } catch (e) {
      State.setUser(null);
    }

    // 3. Subscribe State Changes
    State.subscribe(() => this.updateHeaderAndNav());

    // 4. Setup Global UI Events (Language, Menu, Tutor)
    this.bindGlobalEvents();

    // 5. Initialize Tutor and Hash Router
    Tutor.init();
    Router.init();
  },

  bindGlobalEvents() {
    // Language Switcher Buttons
    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const lang = e.target.dataset.lang;
        State.setLanguage(lang);
        this.renderCurrentView();
      });
    });

    // Mobile Sidebar Toggle
    const menuBtn = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    if (menuBtn && sidebar) {
      menuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
      });
    }

    // Floating AI Tutor Toggle Pill
    const tutorToggleBtn = document.getElementById('tutor-toggle-pill');
    if (tutorToggleBtn) {
      tutorToggleBtn.addEventListener('click', () => {
        State.toggleTutor();
      });
    }

    // Quick Prompt Chips in Tutor Drawer
    const chips = document.querySelectorAll('.prompt-chip');
    chips.forEach(chip => {
      chip.addEventListener('click', (e) => {
        const prompt = e.target.innerText;
        Tutor.askPrompt(prompt);
      });
    });

    // Close modal on click outside
    window.addEventListener('click', (e) => {
      const modal = document.querySelector('.modal-overlay');
      if (modal && e.target === modal) {
        modal.remove();
      }
    });

    // Keyboard accessibility: ESC closes modal or tutor
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.querySelector('.modal-overlay');
        if (modal) modal.remove();
        if (State.tutorOpen) State.toggleTutor(false);
      }
    });
  },

  updateHeaderAndNav() {
    const isHi = State.language === 'hinglish';
    const isAuth = State.isAuthenticated;

    // Update active language button
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === State.language);
    });

    // Update Nav links text
    const setNavText = (id, key) => {
      const el = document.getElementById(id);
      if (el) el.querySelector('.nav-label').innerText = State.t(key);
    };

    setNavText('nav-dashboard', 'navDashboard');
    setNavText('nav-catalog', 'navCatalog');
    setNavText('nav-question-bank', 'navQuestionBank');
    setNavText('nav-practice', 'navPractice');
    setNavText('nav-quizzes', 'navQuizzes');
    setNavText('nav-interview', 'navInterview');
    setNavText('nav-projects', 'navProjects');
    setNavText('nav-schedule', 'navSchedule');
    setNavText('nav-groups', 'navGroups');
    setNavText('nav-report', 'navReport');
    setNavText('nav-settings', 'navSettings');
    setNavText('nav-privacy', 'navPrivacy');
    setNavText('nav-admin', 'navAdmin');

    const adminSec = document.getElementById('nav-admin-section');
    if (adminSec) {
      adminSec.style.display = (isAuth && State.user && State.user.role === 'admin') ? 'block' : 'none';
    }

    // Update header auth elements
    const headerAuthArea = document.getElementById('header-auth-area');
    if (headerAuthArea) {
      if (isAuth && State.user) {
        headerAuthArea.innerHTML = `
          <div class="streak-pill">
            <span>🔥</span>
            <span>${State.user.streak_days || 0} ${State.t('streakDays')}</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <div class="user-avatar" style="width:32px; height:32px; font-size:0.75rem;">
              ${(State.user.name || 'U').slice(0, 2).toUpperCase()}
            </div>
            <button id="signout-header-btn" class="btn btn-secondary btn-sm" style="padding:3px 8px; font-size:0.75rem;">
              ${State.t('signOut')}
            </button>
          </div>
        `;
        const soBtn = document.getElementById('signout-header-btn');
        if (soBtn) {
          soBtn.addEventListener('click', async () => {
            await API.logout();
            State.setUser(null);
            Router.navigate('welcome');
          });
        }
      } else {
        headerAuthArea.innerHTML = `
          <a href="#login" class="btn btn-secondary btn-sm">${State.t('signIn')}</a>
          <a href="#register" class="btn btn-primary btn-sm">${State.t('signUp')}</a>
        `;
      }
    }

    // Sidebar user profile footer
    const sidebarFooter = document.getElementById('sidebar-footer');
    if (sidebarFooter) {
      if (isAuth && State.user) {
        sidebarFooter.style.display = 'flex';
        const nameEl = document.getElementById('sidebar-user-name');
        const xpEl = document.getElementById('sidebar-user-xp');
        if (nameEl) nameEl.innerText = State.user.name;
        if (xpEl) xpEl.innerText = `${State.user.xp || 0} XP • ${State.user.target_role || 'Analyst'}`;
      } else {
        sidebarFooter.style.display = 'none';
      }
    }

    // Highlight current active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${State.currentRoute}`);
    });
  },

  renderCurrentView() {
    const route = State.currentRoute;
    const params = State.routeParams;
    const main = document.getElementById('main-content');
    if (!main) return;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    switch (route) {
      case 'welcome':
        this.renderWelcome(main);
        break;
      case 'register':
        this.renderRegister(main);
        break;
      case 'login':
        this.renderLogin(main);
        break;
      case 'verify':
        this.renderVerify(main, params.token);
        break;
      case 'forgot-password':
        this.renderForgotPassword(main);
        break;
      case 'reset-password':
        this.renderResetPassword(main, params.token);
        break;
      case 'onboarding':
        this.renderOnboarding(main);
        break;
      case 'dashboard':
        this.renderDashboard(main);
        break;
      case 'catalog':
        this.renderCatalog(main);
        break;
      case 'course':
        this.renderCourseDetail(main, params.id);
        break;
      case 'lesson':
        this.renderLesson(main, params.id);
        break;
      case 'practice':
        this.renderPractice(main);
        break;
      case 'quizzes':
        this.renderQuizzes(main);
        break;
      case 'quiz':
        this.renderQuizPlayer(main, params.id);
        break;
      case 'interview':
        this.renderInterview(main);
        break;
      case 'projects':
        this.renderProjects(main);
        break;
      case 'project':
        this.renderProjectDetail(main, params.id);
        break;
      case 'schedule':
        this.renderSchedule(main);
        break;
      case 'groups':
        this.renderStudyGroups(main);
        break;
      case 'group':
        this.renderGroupDetail(main, params.id);
        break;
      case 'report':
        this.renderSkillGapReport(main);
        break;
      case 'settings':
        this.renderSettings(main);
        break;
      case 'question-bank':
        this.renderQuestionBank(main);
        break;
      case 'admin':
        this.renderAdminDashboard(main);
        break;
      case 'privacy':
        this.renderPrivacyPolicy(main);
        break;
      default:
        if (State.isAuthenticated) {
          this.renderDashboard(main);
        } else {
          this.renderWelcome(main);
        }
    }
  },

  // -----------------------------------------------------------
  // 1. PUBLIC WELCOME PAGE FOR VISITORS
  // -----------------------------------------------------------
  async renderWelcome(container) {
    const isHi = State.language === 'hinglish';
    let courses = [];
    try {
      const res = await API.getCourses();
      courses = res.courses || [];
      State.courses = courses;
    } catch (e) {}

    container.innerHTML = `
      <div class="landing-hero">
        <div class="hero-badge">
          <span>✨</span>
          <span>${isHi ? 'शून्य से जॉब-रेडी डेटा एनालिस्ट' : 'Zero to Job-Ready Data Analyst'}</span>
        </div>
        <h1 class="hero-title">${State.t('welcomeTitle')}</h1>
        <p class="hero-subtitle">${State.t('welcomeSubtitle')}</p>
        <div class="hero-actions">
          <a href="#register" class="btn btn-primary btn-lg">
            <span>🚀 ${State.t('signUp')}</span>
          </a>
          <a href="#login" class="btn btn-secondary btn-lg" style="background:rgba(255,255,255,0.15); color:white; border-color:rgba(255,255,255,0.3);">
            <span>🔑 ${State.t('signIn')}</span>
          </a>
          <button id="welcome-tutor-demo-btn" class="btn btn-secondary btn-lg" style="background:#1e293b; color:#38bdf8; border-color:#334155;">
            <span>🧑‍🏫 ${isHi ? 'AI ट्यूटर डेमो देखें' : 'Try AI Tutor Demo'}</span>
          </button>
        </div>
      </div>

      <!-- Feature Highlights -->
      <div class="feature-grid">
        <div class="feature-card">
          <div class="feature-icon">👥</div>
          <h3 class="card-title">${isHi ? 'दो दोस्त मिलकर सीखें (Study Squads)' : 'Two Friends Learning Together'}</h3>
          <p class="card-desc">${isHi ? 'प्राइवेट स्टडी ग्रुप बनाएं, इनवाइट लिंक भेजें, एक-दूसरे की प्रोग्रेस देखें और माइलस्टोन्स सेलिब्रेट करें।' : 'Create a private study squad, invite a friend with a secure link, track shared weekly goals, and send reactions.'}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">📚</div>
          <h3 class="card-title">${isHi ? '17 कोर मॉड्यूल्स का संपूर्ण रोडमैप' : 'Complete 17-Topic Analyst Curriculum'}</h3>
          <p class="card-desc">${isHi ? 'एक्सेल, एसक्यूएल, पायथन, स्टैटिस्टिक्स, पावर बीआई, टैब्लू, जीरा, बीपीएमएन, गिट, और इंटरव्यू की तैयारी।' : 'Prerequisite-based sequence from foundations to advanced SQL window functions, EDA, and executive BI.'}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">🧑‍🏫</div>
          <h3 class="card-title">${isHi ? 'सपोर्टिव AI ट्यूटर (Hinglish + English)' : 'Supportive AI Tutor & Career Coach'}</h3>
          <p class="card-desc">${isHi ? 'किराना स्टोर और क्रिकेट के आसान उदाहरणों से कठिन सवाल समझें, कोड रिव्यू और प्रोग्रेसिव हिंट्स पाएं।' : 'ELI5 analogies, step-by-step guidance, hints without giving away answers, and line-by-line code reviews.'}</p>
        </div>
        <div class="feature-card">
          <div class="feature-icon">💻</div>
          <h3 class="card-title">${isHi ? 'लाइव एसक्यूएल, एक्सेल और पायथन सैंडबॉक्स' : 'Interactive SQL, Excel & Python Sandboxes'}</h3>
          <p class="card-desc">${isHi ? 'ब्राउज़र में ही असली डेटाबेस टेबल्स पर लाइव SQL क्वेरीज चलाएं और फॉर्मूलों का तुरंत रिजल्ट देखें।' : 'Run queries directly on real retail orders and customer databases with latency stats and verification.'}</p>
        </div>
      </div>

      <!-- Curriculum Preview Section -->
      <div style="margin-bottom: 2.5rem;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem;">
          <div>
            <h2 style="font-size:1.5rem; font-weight:800;">${isHi ? '17 कोर मॉड्यूल्स (पूरा पाठ्यक्रम)' : 'Structured 17-Module Curriculum'}</h2>
            <p style="color:var(--text-muted); font-size:0.9rem;">${isHi ? 'हर कोर्स में छोटे लेसन्स, फॉर्मूला शीट, रियल-वर्ल्ड उदाहरण और कैपस्टोन प्रोजेक्ट शामिल हैं।' : 'Every course contains bite-sized lessons, formula sheets, pitfalls, and final projects.'}</p>
          </div>
          <a href="#catalog" class="btn btn-secondary btn-sm">${State.t('welcomeExplore')} →</a>
        </div>

        <div class="course-grid">
          ${courses.slice(0, 6).map(c => `
            <div class="course-card">
              <div class="course-card-top">
                <div class="course-icon-box">📘</div>
                <div class="course-card-content">
                  <div class="course-domain-tag">${c.domain}</div>
                  <h3 class="course-card-title">${isHi ? c.title_hi : c.title}</h3>
                  <p class="course-card-desc">${isHi ? c.description_hi : c.description}</p>
                  <span class="badge badge-slate">${c.level}</span>
                </div>
              </div>
              <div class="course-card-footer">
                <span>⏱️ ${c.estimated_hours} hrs</span>
                <a href="#course/${c.id}" class="btn btn-primary btn-sm">${State.t('viewSyllabus')}</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    const tryBtn = document.getElementById('welcome-tutor-demo-btn');
    if (tryBtn) {
      tryBtn.addEventListener('click', () => {
        State.toggleTutor(true);
        Tutor.sendMessage("नमस्ते! मुझे बताइए कि डेटा एनालिसिस सीखने की शुरुआत कैसे करें?");
      });
    }
  },

  // -----------------------------------------------------------
  // 2. REGISTRATION PAGE
  // -----------------------------------------------------------
  renderRegister(container) {
    const isHi = State.language === 'hinglish';

    container.innerHTML = `
      <div class="quiz-card" style="max-width:480px; margin:2rem auto;">
        <div style="text-align:center; margin-bottom:1.75rem;">
          <h1 style="font-size:1.75rem; font-weight:800; margin-bottom:0.25rem;">${State.t('signUp')}</h1>
          <p style="color:var(--text-muted); font-size:0.9rem;">Start your Data Analyst career journey today.</p>
        </div>

        <div id="register-error-banner" style="display:none; padding:0.75rem 1rem; border-radius:var(--radius-sm); background:var(--danger-light); color:var(--danger); font-size:0.85rem; margin-bottom:1rem; border:1px solid #fca5a5;"></div>

        <form id="register-form">
          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Full Name</label>
            <input type="text" name="name" required style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:0.9rem;" placeholder="e.g. Priya Sharma">
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Email Address</label>
            <input type="email" name="email" required style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:0.9rem;" placeholder="you@example.com">
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Password (Min 8 characters)</label>
            <input type="password" name="password" minlength="8" required style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:0.9rem;" placeholder="••••••••">
          </div>

          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Target Career Goal</label>
            <select name="targetRole" style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:0.9rem;">
              <option value="Junior Data Analyst">Junior Data Analyst</option>
              <option value="BI Developer">BI Developer (Power BI / Tableau)</option>
              <option value="Product Analyst">Product Analyst</option>
              <option value="Data Consultant">Data & Analytics Consultant</option>
            </select>
          </div>

          <div style="margin-bottom:1.5rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Preferred Language</label>
            <select name="preferredLanguage" style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:0.9rem;">
              <option value="hinglish" ${State.language === 'hinglish' ? 'selected' : ''}>🇮🇳 Hinglish (Hindi + English)</option>
              <option value="en" ${State.language === 'en' ? 'selected' : ''}>🌐 English</option>
            </select>
          </div>

          <button type="submit" id="register-submit-btn" class="btn btn-primary btn-lg" style="width:100%;">
            <span>Create Account</span>
          </button>
        </form>

        <div style="text-align:center; margin-top:1.5rem; font-size:0.85rem; color:var(--text-muted);">
          Already have an account? <a href="#login" style="font-weight:600;">Sign in here</a>
        </div>
      </div>
    `;

    const form = document.getElementById('register-form');
    const errBanner = document.getElementById('register-error-banner');
    const submitBtn = document.getElementById('register-submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errBanner.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Creating account... ⏳</span>`;

      const formData = new FormData(form);
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        password: formData.get('password'),
        targetRole: formData.get('targetRole'),
        preferredLanguage: formData.get('preferredLanguage')
      };

      try {
        const res = await API.register(payload);
        State.setUser(res.user);
        Router.navigate('onboarding');
      } catch (err) {
        errBanner.style.display = 'block';
        errBanner.innerText = err.message;
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Create Account</span>`;
      }
    });
  },

  // -----------------------------------------------------------
  // 3. LOGIN PAGE
  // -----------------------------------------------------------
  renderLogin(container) {
    const isHi = State.language === 'hinglish';

    container.innerHTML = `
      <div class="quiz-card" style="max-width:440px; margin:2rem auto;">
        <div style="text-align:center; margin-bottom:1.75rem;">
          <h1 style="font-size:1.75rem; font-weight:800; margin-bottom:0.25rem;">${State.t('signIn')}</h1>
          <p style="color:var(--text-muted); font-size:0.9rem;">Sign in to resume your learning and study squad.</p>
        </div>

        <div id="login-error-banner" style="display:none; padding:0.75rem 1rem; border-radius:var(--radius-sm); background:var(--danger-light); color:var(--danger); font-size:0.85rem; margin-bottom:1rem; border:1px solid #fca5a5;"></div>

        <form id="login-form">
          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Email Address</label>
            <input type="email" name="email" required style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:0.9rem;" placeholder="you@example.com">
          </div>

          <div style="margin-bottom:1.25rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.35rem;">
              <label style="font-weight:600; font-size:0.85rem;">Password</label>
              <a href="#forgot-password" style="font-size:0.78rem;">Forgot password?</a>
            </div>
            <input type="password" name="password" required style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); font-size:0.9rem;" placeholder="••••••••">
          </div>

          <button type="submit" id="login-submit-btn" class="btn btn-primary btn-lg" style="width:100%;">
            <span>Sign In</span>
          </button>
        </form>

        <div style="text-align:center; margin-top:1.5rem; font-size:0.85rem; color:var(--text-muted);">
          Don't have an account yet? <a href="#register" style="font-weight:600;">Register free</a>
        </div>
      </div>
    `;

    const form = document.getElementById('login-form');
    const errBanner = document.getElementById('login-error-banner');
    const submitBtn = document.getElementById('login-submit-btn');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errBanner.style.display = 'none';
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Signing in... ⏳</span>`;

      const formData = new FormData(form);
      try {
        const res = await API.login(formData.get('email'), formData.get('password'));
        State.setUser(res.user);
        Router.navigate('dashboard');
      } catch (err) {
        errBanner.style.display = 'block';
        errBanner.innerText = err.message;
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Sign In</span>`;
      }
    });
  },

  // -----------------------------------------------------------
  // 4. FORGOT & RESET PASSWORD
  // -----------------------------------------------------------
  renderForgotPassword(container) {
    container.innerHTML = `
      <div class="quiz-card" style="max-width:440px; margin:2rem auto;">
        <h1 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem;">Reset Your Password</h1>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.25rem;">
          Enter your registered email and we'll generate a secure password reset link.
        </p>
        <div id="forgot-alert" style="display:none; padding:0.75rem; border-radius:6px; margin-bottom:1rem; font-size:0.85rem;"></div>

        <form id="forgot-form">
          <input type="email" id="forgot-email" required placeholder="Enter your email" style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); margin-bottom:1rem;">
          <button type="submit" class="btn btn-primary" style="width:100%;">Send Reset Link</button>
        </form>
        <div style="margin-top:1rem; text-align:center; font-size:0.85rem;">
          <a href="#login">← Return to Sign In</a>
        </div>
      </div>
    `;

    document.getElementById('forgot-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('forgot-email').value;
      const alertBox = document.getElementById('forgot-alert');
      try {
        const res = await API.forgotPassword(email);
        alertBox.style.display = 'block';
        alertBox.style.background = 'var(--success-light)';
        alertBox.style.color = '#065f46';
        alertBox.innerHTML = `
          <div>${res.message}</div>
          ${res.resetToken ? `<div style="margin-top:0.5rem;"><a href="#reset-password/${res.resetToken}" class="btn btn-primary btn-sm">Click here to set new password</a></div>` : ''}
        `;
      } catch (err) {
        alertBox.style.display = 'block';
        alertBox.style.background = 'var(--danger-light)';
        alertBox.style.color = 'var(--danger)';
        alertBox.innerText = err.message;
      }
    });
  },

  renderResetPassword(container, token) {
    container.innerHTML = `
      <div class="quiz-card" style="max-width:440px; margin:2rem auto;">
        <h1 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem;">Set New Password</h1>
        <div id="reset-alert" style="display:none; padding:0.75rem; border-radius:6px; margin-bottom:1rem; font-size:0.85rem;"></div>

        <form id="reset-form">
          <input type="text" id="reset-token-input" value="${token || ''}" placeholder="Reset Token" required style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); margin-bottom:1rem;">
          <input type="password" id="reset-password-input" minlength="8" placeholder="New Password (min 8 chars)" required style="width:100%; padding:0.65rem 0.85rem; border-radius:var(--radius-sm); border:1px solid var(--border); margin-bottom:1rem;">
          <button type="submit" class="btn btn-primary" style="width:100%;">Update Password</button>
        </form>
      </div>
    `;

    document.getElementById('reset-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const t = document.getElementById('reset-token-input').value;
      const p = document.getElementById('reset-password-input').value;
      const alertBox = document.getElementById('reset-alert');
      try {
        const res = await API.resetPassword(t, p);
        alertBox.style.display = 'block';
        alertBox.style.background = 'var(--success-light)';
        alertBox.style.color = '#065f46';
        alertBox.innerHTML = `${res.message} <a href="#login" style="font-weight:700;">Sign in here</a>`;
      } catch (err) {
        alertBox.style.display = 'block';
        alertBox.style.background = 'var(--danger-light)';
        alertBox.style.color = 'var(--danger)';
        alertBox.innerText = err.message;
      }
    });
  },

  // -----------------------------------------------------------
  // 5. ONBOARDING QUESTIONNAIRE
  // -----------------------------------------------------------
  renderOnboarding(container) {
    const isHi = State.language === 'hinglish';

    container.innerHTML = `
      <div class="quiz-card" style="margin-top: 1rem;">
        <div style="text-align:center; margin-bottom:2rem;">
          <span class="badge badge-blue" style="margin-bottom:0.5rem;">Personalize Your Study Plan</span>
          <h2 style="font-size:1.75rem; font-weight:800; margin-bottom:0.5rem;">${State.t('onboardingTitle')}</h2>
          <p style="color:var(--text-muted); font-size:0.95rem;">Answer 4 quick questions to customize your pace, weekly timetable, and tutor voice.</p>
        </div>

        <form id="onboarding-form">
          <div class="quiz-question-box">
            <label class="quiz-question-text" style="display:block;">1. What is your current analytical background?</label>
            <div class="quiz-options">
              <label class="quiz-option-label selected">
                <input type="radio" name="current_level" value="Beginner" checked style="accent-color:var(--primary);">
                <div>
                  <strong>Absolute Beginner / Non-Technical</strong>
                  <div style="font-size:0.8rem; color:var(--text-muted);">Little or no prior coding or data experience.</div>
                </div>
              </label>
              <label class="quiz-option-label">
                <input type="radio" name="current_level" value="Basic Excel" style="accent-color:var(--primary);">
                <div>
                  <strong>Basic Excel / Spreadsheet Familiarity</strong>
                  <div style="font-size:0.8rem; color:var(--text-muted);">Know basic formulas (SUM, AVERAGE) and simple tables.</div>
                </div>
              </label>
              <label class="quiz-option-label">
                <input type="radio" name="current_level" value="Career Switcher" style="accent-color:var(--primary);">
                <div>
                  <strong>Career Switcher from Operations / Sales / QA</strong>
                  <div style="font-size:0.8rem; color:var(--text-muted);">Solid domain knowledge, transitioning to data analytics.</div>
                </div>
              </label>
            </div>
          </div>

          <div class="quiz-question-box">
            <label class="quiz-question-text" style="display:block;">2. Target Career Goal</label>
            <select name="target_role" style="width:100%; padding:0.75rem 1rem; border-radius:var(--radius-sm); border:1.5px solid var(--border); font-size:0.95rem;">
              <option value="Junior Data Analyst">Junior Data Analyst</option>
              <option value="BI Developer">BI Developer (Power BI & Tableau)</option>
              <option value="Product Analyst">Product Analyst (Funnels & Cohorts)</option>
              <option value="Data Consultant">Data & Analytics Consultant</option>
            </select>
          </div>

          <div class="quiz-question-box">
            <label class="quiz-question-text" style="display:block;">3. Preferred Learning & AI Tutor Language:</label>
            <div style="display:flex; gap:1rem;">
              <label class="quiz-option-label" style="flex:1;">
                <input type="radio" name="preferred_language" value="hinglish" ${State.language === 'hinglish' ? 'checked' : ''} style="accent-color:var(--primary);">
                <span>🇮🇳 Hinglish (Hindi + English)</span>
              </label>
              <label class="quiz-option-label" style="flex:1;">
                <input type="radio" name="preferred_language" value="en" ${State.language === 'en' ? 'checked' : ''} style="accent-color:var(--primary);">
                <span>🌐 English</span>
              </label>
            </div>
          </div>

          <div class="quiz-question-box">
            <label class="quiz-question-text" style="display:block;">4. Available Study Hours per Week:</label>
            <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:0.5rem;">
              <label class="quiz-option-label" style="justify-content:center; text-align:center;">
                <input type="radio" name="hours_per_week" value="5">
                <span>5 hrs</span>
              </label>
              <label class="quiz-option-label selected" style="justify-content:center; text-align:center;">
                <input type="radio" name="hours_per_week" value="10" checked>
                <span>10 hrs</span>
              </label>
              <label class="quiz-option-label" style="justify-content:center; text-align:center;">
                <input type="radio" name="hours_per_week" value="15">
                <span>15 hrs</span>
              </label>
              <label class="quiz-option-label" style="justify-content:center; text-align:center;">
                <input type="radio" name="hours_per_week" value="20">
                <span>20+ hrs</span>
              </label>
            </div>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width:100%;">
            <span>🚀 Generate My Personalized Roadmap</span>
          </button>
        </form>
      </div>
    `;

    const form = document.getElementById('onboarding-form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const answers = {
        current_level: formData.get('current_level'),
        target_role: formData.get('target_role'),
        preferred_language: formData.get('preferred_language'),
        hours_per_week: Number(formData.get('hours_per_week'))
      };

      try {
        const res = await API.submitOnboarding(answers);
        if (res.user) {
          State.setUser(res.user);
        }
        Router.navigate('dashboard');
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  },

  // -----------------------------------------------------------
  // 6. PROTECTED LEARNER DASHBOARD
  // -----------------------------------------------------------
  async renderDashboard(container) {
    const isHi = State.language === 'hinglish';
    let data = null;

    try {
      data = await API.getDashboard();
    } catch (e) {
      container.innerHTML = `<div class="card" style="color:red;">Error loading dashboard: ${e.message}</div>`;
      return;
    }

    const { stats, nextLesson, weakTopics, schedule } = data;
    const user = State.user || data.user;

    // Check if user has study groups
    let groups = [];
    try {
      const gRes = await API.getGroups();
      groups = gRes.groups || [];
    } catch (e) {}

    container.innerHTML = `
      <!-- Welcome Banner -->
      <div class="card" style="background:linear-gradient(135deg, #1e3a8a, #0f172a); color:white; margin-bottom:2rem; border:none;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1.5rem;">
          <div>
            <div style="font-size:0.85rem; color:#93c5fd; font-weight:600; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.25rem;">
              ${isHi ? 'स्वागत है, ' : 'Welcome back, '} ${user.name} 👋
            </div>
            <h1 style="font-size:1.75rem; font-weight:800; margin-bottom:0.5rem;">
              ${isHi ? 'आज कुछ नया सीखने के लिए तैयार हैं?' : 'Ready to sharpen your data skills today?'}
            </h1>
            <p style="color:#cbd5e1; font-size:0.95rem; max-width:650px; line-height:1.5;">
              ${isHi ? '💡 "रोजाना 45 मिनट की निरंतरता, सप्ताहांत की हड़बड़ी से कहीं बेहतर नतीजे देती है।"' : '💡 "Small daily consistency beats frantic weekend cramming. You are on track!"'}
            </p>
          </div>
          <div style="display:flex; gap:1rem; align-items:center;">
            <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:0.75rem 1.25rem; border-radius:var(--radius-md); text-align:center;">
              <div style="font-size:1.5rem; font-weight:800; color:#fbbf24;">🔥 ${stats.streakDays || user.streak_days || 0}</div>
              <div style="font-size:0.75rem; color:#93c5fd;">${isHi ? 'दिनों की स्ट्रीक' : 'Day Streak'}</div>
            </div>
            <div style="background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.2); padding:0.75rem 1.25rem; border-radius:var(--radius-md); text-align:center;">
              <div style="font-size:1.5rem; font-weight:800; color:#34d399;">${stats.jobReadinessScore}%</div>
              <div style="font-size:0.75rem; color:#93c5fd;">${isHi ? 'जॉब रेडी' : 'Job Ready'}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Two Friends / Study Squad Banner -->
      <div class="card" style="margin-bottom:2rem; background:linear-gradient(to right, #f0fdf4, #eff6ff); border:1.5px solid #bbf7d0;">
        <div style="display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem;">
          <div style="display:flex; align-items:center; gap:1rem;">
            <div style="width:48px; height:48px; border-radius:50%; background:#10b981; color:white; display:flex; align-items:center; justify-content:center; font-size:1.4rem;">
              👥
            </div>
            <div>
              <h3 style="font-size:1.1rem; font-weight:700; color:#065f46;">
                ${groups.length > 0 ? `Study Squad: ${groups[0].name}` : State.t('twoFriendsTitle')}
              </h3>
              <p style="font-size:0.85rem; color:#047857;">
                ${groups.length > 0 ? `Active with ${groups[0].member_count} member(s). Share progress, goals, and video/voice calls!` : 'Invite a friend with a secure link to hold each other accountable and compare milestones.'}
              </p>
            </div>
          </div>
          <div style="display:flex; gap:0.5rem;">
            ${groups.length > 0 ? `
              <a href="#group/${groups[0].id}" class="btn btn-primary btn-sm">Open Squad Dashboard →</a>
            ` : `
              <a href="#groups" class="btn btn-primary btn-sm">Create or Join Squad</a>
            `}
          </div>
        </div>
      </div>

      <!-- Metrics Grid -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(220px, 1fr)); gap:1.25rem; margin-bottom:2rem;">
        <div class="card">
          <div style="color:var(--text-muted); font-size:0.8rem; font-weight:600;">${isHi ? 'कुल प्रोग्रेस' : 'Curriculum Progress'}</div>
          <div style="font-size:1.75rem; font-weight:800; color:var(--primary); margin:0.35rem 0;">${stats.progressPercentage}%</div>
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width:${stats.progressPercentage}%;"></div>
          </div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${stats.completedLessons} of ${stats.totalLessons} ${isHi ? 'लेसन्स पूरे' : 'lessons completed'}</div>
        </div>

        <div class="card">
          <div style="color:var(--text-muted); font-size:0.8rem; font-weight:600;">${isHi ? 'क्विज एवरेज स्कोर' : 'Average Quiz Score'}</div>
          <div style="font-size:1.75rem; font-weight:800; color:var(--secondary); margin:0.35rem 0;">${stats.averageQuizScore}%</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${stats.quizAttempts} ${isHi ? 'क्विज प्रयास' : 'quiz attempts logged'}</div>
        </div>

        <div class="card">
          <div style="color:var(--text-muted); font-size:0.8rem; font-weight:600;">${isHi ? 'पोर्टफोलियो प्रोजेक्ट्स' : 'Completed Projects'}</div>
          <div style="font-size:1.75rem; font-weight:800; color:var(--accent); margin:0.35rem 0;">${stats.completedProjects} / 5</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${isHi ? 'गाइडेड रियल-वर्ल्ड प्रोजेक्ट्स' : 'Guided portfolio milestones'}</div>
        </div>

        <div class="card">
          <div style="color:var(--text-muted); font-size:0.8rem; font-weight:600;">${isHi ? 'साप्ताहिक स्टडी कमिटमेंट' : 'Weekly Goal'}</div>
          <div style="font-size:1.75rem; font-weight:800; color:#8b5cf6; margin:0.35rem 0;">${user.hours_per_week || 10} hrs</div>
          <div style="font-size:0.75rem; color:var(--text-muted);">${isHi ? 'प्रति सप्ताह शेड्यूल' : 'Target study per week'}</div>
        </div>
      </div>

      <!-- What Next & Revision Section -->
      <div style="display:grid; grid-template-columns:2fr 1fr; gap:1.5rem; margin-bottom:2rem;">
        <div class="card" style="border-left:4px solid var(--primary);">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:0.75rem;">
            <span class="badge badge-blue">🎯 ${State.t('whatNext')}</span>
            <span style="font-size:0.8rem; color:var(--text-muted);">⏱️ ${nextLesson ? nextLesson.estimated_minutes : 25} mins</span>
          </div>
          <h2 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">
            ${nextLesson ? (isHi ? nextLesson.title_hi : nextLesson.title) : 'SQL Foundations: SELECT & Filtering'}
          </h2>
          <p style="font-size:0.875rem; color:var(--text-muted); margin-bottom:1.25rem;">
            ${isHi ? 'कोर्स: ' : 'Course: '} <strong>${nextLesson ? (isHi ? nextLesson.course_title_hi : nextLesson.course_title) : 'SQL: Zero to Advanced'}</strong>
          </p>
          <div style="display:flex; gap:0.75rem;">
            <a href="#lesson/${nextLesson ? nextLesson.id : 'sql-101'}" class="btn btn-primary">
              <span>▶️ ${State.t('resumeLesson')}</span>
            </a>
            <button id="ask-tutor-dashboard-btn" class="btn btn-secondary">
              <span>🧑‍🏫 ${isHi ? 'AI ट्यूटर से इसका सार पूछें' : 'Get Tutor Overview'}</span>
            </button>
          </div>
        </div>

        <div class="card">
          <h3 style="font-size:1rem; font-weight:700; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem;">
            <span>🔍</span>
            <span>${State.t('weakTopicsDetected')}</span>
          </h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:0.75rem;">
            ${isHi ? 'क्विज के आधार पर इन टॉपिक्स पर दोबारा ध्यान देने की जरूरत है:' : 'Identified from recent quiz answers:'}
          </p>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${(weakTopics && weakTopics.length > 0) ? weakTopics.map(topic => `
              <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-surface); padding:0.5rem 0.75rem; border-radius:var(--radius-sm); font-size:0.825rem;">
                <span>⚠️ ${topic}</span>
                <a href="#practice" class="btn btn-secondary btn-sm" style="padding:2px 8px; font-size:0.75rem;">${isHi ? 'अभ्यास' : 'Practice'}</a>
              </div>
            `).join('') : `
              <div style="color:var(--success); font-size:0.85rem; font-weight:600; padding:0.5rem 0;">
                🎉 ${isHi ? 'शानदार! अभी कोई कमजोर टॉपिक नहीं है।' : 'No weak topics detected. Keep shining!'}
              </div>
            `}
          </div>
        </div>
      </div>

      <!-- Weekly Study Timetable -->
      <div class="card" style="margin-bottom:2rem;">
        <div class="reschedule-banner">
          <div>
            <div style="font-weight:700; color:#1e40af; font-size:0.95rem;">🗓️ ${isHi ? 'आपका पर्सनल वीकली स्टडी प्लान' : 'Your Personalized Weekly Study Timetable'}</div>
            <div style="font-size:0.825rem; color:#3b82f6;">${State.t('rescheduleAlert')}</div>
          </div>
          <button id="reschedule-btn" class="btn btn-secondary btn-sm" style="background:white; border-color:#93c5fd; color:#1d4ed8;">
            <span>🔄 ${State.t('rescheduleBtn')}</span>
          </button>
        </div>

        <div class="timetable-grid">
          ${(schedule || []).map(task => `
            <div class="day-card ${task.is_completed ? 'completed' : ''}">
              <div class="day-header">
                <span>${task.day_name}</span>
                <span class="badge ${task.is_completed ? 'badge-green' : 'badge-slate'}">
                  ${task.is_completed ? (isHi ? 'पूरा हुआ' : 'Done') : `${task.duration_minutes} min`}
                </span>
              </div>
              <div class="task-item ${task.is_completed ? 'completed' : ''}">
                <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.is_completed ? 'checked' : ''} style="cursor:pointer; width:16px; height:16px; margin-top:2px;">
                <span>${isHi ? task.task_title_hi : task.task_title}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    document.getElementById('ask-tutor-dashboard-btn').addEventListener('click', () => {
      State.toggleTutor(true);
      Tutor.sendMessage(isHi 
        ? `मुझे इस लेसन (${nextLesson ? nextLesson.title_hi : 'SQL'}) के बारे में एक आसान उदाहरण देकर समझाओ।`
        : `Give me a concise 2-minute overview of ${nextLesson ? nextLesson.title : 'SQL Foundations'}.`);
    });

    document.getElementById('reschedule-btn').addEventListener('click', async () => {
      try {
        const res = await API.rescheduleMissed();
        alert(res.message);
        this.renderCurrentView();
      } catch (e) {
        alert('Error: ' + e.message);
      }
    });

    document.querySelectorAll('.task-checkbox').forEach(box => {
      box.addEventListener('change', async (e) => {
        const taskId = e.target.dataset.taskId;
        await API.toggleTask(taskId);
      });
    });
  },

  // -----------------------------------------------------------
  // 7. STUDY GROUPS & TWO FRIENDS LEARNING TOGETHER
  // -----------------------------------------------------------
  async renderStudyGroups(container) {
    const isHi = State.language === 'hinglish';
    let groups = [];
    try {
      const res = await API.getGroups();
      groups = res.groups || [];
    } catch (e) {
      container.innerHTML = `<div>Error loading study groups: ${e.message}</div>`;
      return;
    }

    container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('twoFriendsTitle')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          ${isHi ? 'एक दोस्त को इनवाइट करें, एक-दूसरे का मनोबल बढ़ाएं और साझा लक्ष्यों को पूरा करें।' : 'Team up with a learning partner. Share progress, weekly goals, and support each other through voice/video and chat.'}
        </p>

        <div style="display:flex; gap:1rem; margin-top:1.5rem; flex-wrap:wrap;">
          <button id="create-squad-btn" class="btn btn-primary">
            <span>➕ ${State.t('createSquad')}</span>
          </button>
          <button id="join-squad-btn" class="btn btn-secondary">
            <span>🔑 ${State.t('joinSquad')}</span>
          </button>
        </div>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
        ${groups.map(g => `
          <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <span class="badge badge-blue">${g.member_count} Member(s)</span>
              <span style="font-size:0.75rem; color:var(--text-muted); font-family:var(--font-mono);">Code: ${g.invite_code}</span>
            </div>
            <h3 class="card-title">${g.name}</h3>
            <p class="card-desc" style="margin-bottom:1.25rem;">${g.description}</p>
            <div style="display:flex; gap:0.5rem;">
              <a href="#group/${g.id}" class="btn btn-primary btn-sm">Open Squad Dashboard →</a>
            </div>
          </div>
        `).join('')}

        ${groups.length === 0 ? `
          <div class="card" style="grid-column:1/-1; text-align:center; padding:3rem 1.5rem;">
            <div style="font-size:2.5rem; margin-bottom:1rem;">👥</div>
            <h3 style="font-size:1.25rem; font-weight:700; margin-bottom:0.5rem;">You haven't joined a Study Squad yet</h3>
            <p style="color:var(--text-muted); font-size:0.9rem; max-width:500px; margin:0 auto 1.5rem;">
              Learning data analysis with a friend doubles course completion rates. Create a squad or enter an invite code from your partner!
            </p>
          </div>
        ` : ''}
      </div>
    `;

    document.getElementById('create-squad-btn').addEventListener('click', () => {
      this.showCreateSquadModal();
    });

    document.getElementById('join-squad-btn').addEventListener('click', () => {
      this.showJoinSquadModal();
    });
  },

  showCreateSquadModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h2 style="font-size:1.4rem; font-weight:800; margin-bottom:0.5rem;">Create a Study Squad</h2>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.25rem;">
          You will get an invite code to share with your learning partner.
        </p>
        <form id="create-squad-form">
          <input type="text" name="name" required placeholder="Squad Name (e.g. Data Wizards)" style="width:100%; padding:0.65rem; border-radius:6px; border:1px solid var(--border); margin-bottom:1rem;">
          <textarea name="description" placeholder="Study goal (e.g. Complete SQL and Power BI by December)" style="width:100%; padding:0.65rem; border-radius:6px; border:1px solid var(--border); margin-bottom:1.25rem;"></textarea>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Create Squad</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#create-squad-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      try {
        const res = await API.createGroup(fd.get('name'), fd.get('description'));
        modal.remove();
        alert(`Squad created! Share your invite code: ${res.inviteCode}`);
        Router.navigate('group', res.groupId);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  },

  showJoinSquadModal() {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h2 style="font-size:1.4rem; font-weight:800; margin-bottom:0.5rem;">Join a Study Squad</h2>
        <p style="color:var(--text-muted); font-size:0.85rem; margin-bottom:1.25rem;">
          Enter the 8-character invite code provided by your study friend (e.g. JOIN-XXXX).
        </p>
        <form id="join-squad-form">
          <input type="text" name="inviteCode" required placeholder="e.g. JOIN-4A2" style="width:100%; padding:0.65rem; border-radius:6px; border:1px solid var(--border); font-family:var(--font-mono); text-transform:uppercase; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
            <button type="submit" class="btn btn-primary">Join Squad</button>
          </div>
        </form>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('#join-squad-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const code = e.target.inviteCode.value;
      try {
        const res = await API.joinGroup(code);
        modal.remove();
        alert(res.message);
        Router.navigate('group', res.groupId);
      } catch (err) {
        alert('Error: ' + err.message);
      }
    });
  },

  async renderGroupDetail(container, groupId) {
    const isHi = State.language === 'hinglish';
    let data = null;

    try {
      data = await API.getGroupDetails(groupId);
    } catch (e) {
      container.innerHTML = `<div class="card" style="color:red;">Error loading study squad: ${e.message}</div>`;
      return;
    }

    const { group, myMembership, members, milestones, sharedGoals } = data;
    State.currentGroup = group;

    container.innerHTML = `
      <div class="lesson-top-bar">
        <div class="lesson-breadcrumbs">
          <a href="#groups">← All Study Squads</a>
          <span>/</span>
          <span>${group.name}</span>
        </div>
        <div style="display:flex; align-items:center; gap:0.5rem;">
          <span class="badge badge-blue">Invite Code: <strong>${group.invite_code}</strong></span>
          <button id="copy-invite-link-btn" class="btn btn-secondary btn-sm">📋 Copy Invite</button>
        </div>
      </div>

      <!-- Navigation Tabs: Shared Dashboard | Partner Chat | Video Call | Settings -->
      <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
        <button class="filter-btn active" id="tab-group-dash-btn">📊 Shared Dashboard</button>
        <button class="filter-btn" id="tab-group-chat-btn">💬 Partner Chat</button>
        <button class="filter-btn" id="tab-group-call-btn">📹 Video / Voice Call</button>
        <button class="filter-btn" id="tab-group-privacy-btn">🔒 Sharing & Privacy</button>
      </div>

      <div id="group-tab-content">
        ${this.renderGroupDashboardTab(members, milestones, sharedGoals, isHi)}
      </div>
    `;

    // Tab bindings
    const tabDash = document.getElementById('tab-group-dash-btn');
    const tabChat = document.getElementById('tab-group-chat-btn');
    const tabCall = document.getElementById('tab-group-call-btn');
    const tabPriv = document.getElementById('tab-group-privacy-btn');
    const content = document.getElementById('group-tab-content');

    const switchTab = (activeBtn, html) => {
      [tabDash, tabChat, tabCall, tabPriv].forEach(b => b.classList.remove('active'));
      activeBtn.classList.add('active');
      content.innerHTML = html;
    };

    tabDash.addEventListener('click', () => {
      switchTab(tabDash, this.renderGroupDashboardTab(members, milestones, sharedGoals, isHi));
      this.bindGroupDashEvents(group.id);
    });

    tabChat.addEventListener('click', async () => {
      switchTab(tabChat, `<div class="card">Loading partner chat...</div>`);
      await this.renderGroupChatTab(content, group.id);
    });

    tabCall.addEventListener('click', () => {
      switchTab(tabCall, this.renderGroupCallTab(group.id));
      this.bindGroupCallEvents(group.id);
    });

    tabPriv.addEventListener('click', () => {
      switchTab(tabPriv, this.renderGroupPrivacyTab(myMembership, group.id));
      this.bindGroupPrivacyEvents(group.id);
    });

    // Copy invite link
    document.getElementById('copy-invite-link-btn').addEventListener('click', () => {
      const inviteUrl = `${window.location.origin}/#groups?code=${group.invite_code}`;
      navigator.clipboard.writeText(`Join my Data Analyst study squad with code: ${group.invite_code} or link: ${inviteUrl}`);
      alert(`Invite link copied to clipboard! Share it with your friend.`);
    });

    this.bindGroupDashEvents(group.id);
  },

  renderGroupDashboardTab(members, milestones, sharedGoals, isHi) {
    return `
      <!-- Supportive Two-Friends Motivation Banner -->
      <div style="background:linear-gradient(to right, #eff6ff, #f0fdf4); border:1px solid #bfdbfe; border-radius:var(--radius-md); padding:1rem 1.25rem; margin-bottom:1.5rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
        <div>
          <strong style="color:#1e40af;">🤝 Study Squad Momentum:</strong>
          <span style="font-size:0.85rem; color:#1e293b; margin-left:0.25rem;">You and your friend are on this journey together. Celebrate every finished lesson and practice exercise!</span>
        </div>
        <span class="badge badge-green">Supportive & Non-Shaming</span>
      </div>

      <!-- Members Progress Comparison -->
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:1.5rem; margin-bottom:2rem;">
        ${members.map(m => `
          <div class="card" style="border-top:4px solid ${m.isSelf ? 'var(--primary)' : 'var(--secondary)'};">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
              <span class="badge ${m.isSelf ? 'badge-blue' : 'badge-green'}">${m.isSelf ? 'You' : 'Study Partner'}</span>
              <span style="font-size:0.75rem; color:var(--text-muted);">${m.target_role || 'Analyst'}</span>
            </div>
            <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.25rem;">${m.name}</h3>
            
            <div style="margin:1rem 0;">
              <div style="display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600;">
                <span>Curriculum Progress:</span>
                <span>${m.progressPct !== null ? `${m.progressPct}%` : '<span style="color:var(--text-light);">Private</span>'}</span>
              </div>
              <div class="progress-bar-wrapper">
                <div class="progress-bar-fill" style="width:${m.progressPct || 0}%;"></div>
              </div>
              <div style="font-size:0.75rem; color:var(--text-muted); margin-top:0.25rem;">
                ${m.completedLessonsCount !== null ? `${m.completedLessonsCount} lessons completed` : 'Progress sharing paused'}
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; font-size:0.8rem; background:var(--bg-surface); padding:0.5rem 0.75rem; border-radius:6px; margin-bottom:0.5rem;">
              <span>🔥 Streak: <strong>${m.streak_days !== null ? `${m.streak_days} days` : 'Private'}</strong></span>
              <span>⚡ XP: <strong>${m.xp !== null ? m.xp : 'Private'}</strong></span>
            </div>

            <!-- Test / Quiz Performance Sharing Indicator -->
            <div style="font-size:0.78rem; padding:0.4rem 0.6rem; border-radius:4px; background:${m.share_scores ? '#f0fdf4' : '#f8fafc'}; border:1px solid ${m.share_scores ? '#bbf7d0' : 'var(--border)'}; margin-bottom:0.5rem;">
              ${m.share_scores ? '📊 <strong>Quiz & Test Scores:</strong> Shared with Squad' : '🔒 <strong>Quiz & Test Scores:</strong> Kept Private (by choice)'}
            </div>

            ${!m.isSelf ? `
              <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:0.75rem; padding-top:0.5rem; border-top:1px solid var(--border);">
                <button class="btn btn-secondary btn-sm report-partner-btn" data-user-id="${m.user_id}" data-user-name="${m.name}" style="font-size:0.75rem; padding:2px 8px;">🚩 Report</button>
                <button class="btn btn-secondary btn-sm block-partner-btn" data-user-id="${m.user_id}" data-user-name="${m.name}" style="font-size:0.75rem; padding:2px 8px; color:var(--danger); border-color:#fca5a5;">⛔ Block</button>
              </div>
            ` : ''}
          </div>
        `).join('')}
      </div>

      <!-- Shared Weekly Goals & Milestones Grid -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1.5rem;">
        <!-- Shared Goals -->
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <h3 class="card-title" style="margin:0;">🎯 Shared Weekly Goals</h3>
            <button id="add-group-goal-btn" class="btn btn-secondary btn-sm">+ Add Goal</button>
          </div>
          <div id="shared-goals-list" style="display:flex; flex-direction:column; gap:0.5rem;">
            ${sharedGoals.map(g => `
              <div style="display:flex; align-items:center; gap:0.75rem; padding:0.6rem; background:var(--bg-surface); border-radius:6px;">
                <input type="checkbox" class="goal-checkbox" data-goal-id="${g.id}" ${g.is_completed ? 'checked' : ''}>
                <span style="${g.is_completed ? 'text-decoration:line-through; color:var(--text-light);' : 'font-weight:600;'} font-size:0.85rem;">
                  ${g.goal_text}
                </span>
              </div>
            `).join('')}
            ${sharedGoals.length === 0 ? `<div style="color:var(--text-muted); font-size:0.85rem; padding:0.5rem 0;">No shared goals set yet. Add one like "Finish SQL Module 4 together"!</div>` : ''}
          </div>
        </div>

        <!-- Milestones & Celebrations -->
        <div class="card">
          <h3 class="card-title">🎉 Milestone Celebrations</h3>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Send high-fives and reactions to encourage your partner!</p>
          <div style="display:flex; flex-direction:column; gap:0.75rem;">
            ${milestones.map(ms => `
              <div style="padding:0.75rem; background:var(--bg-surface); border-radius:6px; font-size:0.85rem;">
                <div style="display:flex; justify-content:space-between; font-weight:700;">
                  <span>${ms.user_name}: ${ms.title}</span>
                  <span style="font-size:0.7rem; color:var(--text-muted);">${new Date(ms.achieved_at).toLocaleDateString()}</span>
                </div>
                <div style="color:var(--text-muted); font-size:0.8rem; margin:0.25rem 0;">${ms.description}</div>
                <div style="display:flex; align-items:center; gap:0.4rem; margin-top:0.4rem;">
                  <button class="reaction-btn" data-ms-id="${ms.id}" data-type="celebrate">🎉</button>
                  <button class="reaction-btn" data-ms-id="${ms.id}" data-type="fire">🔥</button>
                  <button class="reaction-btn" data-ms-id="${ms.id}" data-type="star">⭐</button>
                  <button class="reaction-btn" data-ms-id="${ms.id}" data-type="rocket">🚀</button>
                  <button class="reaction-btn" data-ms-id="${ms.id}" data-type="clap">👏</button>
                  <span style="font-size:0.75rem; color:var(--text-muted); margin-left:0.25rem;">
                    ${(ms.reactions || []).map(r => `${r.reaction_type === 'celebrate' ? '🎉' : r.reaction_type === 'fire' ? '🔥' : '⭐'} ${r.user_name}`).join(', ')}
                  </span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  },

  bindGroupDashEvents(groupId) {
    // Add goal
    const addGoalBtn = document.getElementById('add-group-goal-btn');
    if (addGoalBtn) {
      addGoalBtn.addEventListener('click', async () => {
        const text = prompt('Enter weekly shared goal:');
        if (text && text.trim()) {
          await API.addGroupGoal(groupId, text.trim());
          Router.handleRouting();
        }
      });
    }

    // Toggle goal
    document.querySelectorAll('.goal-checkbox').forEach(box => {
      box.addEventListener('change', async (e) => {
        const goalId = e.target.dataset.goalId;
        await API.toggleGroupGoal(groupId, goalId);
        Router.handleRouting();
      });
    });

    // Milestone reactions
    document.querySelectorAll('.reaction-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const msId = e.target.dataset.msId;
        const type = e.target.dataset.type;
        await API.sendMilestoneReaction(groupId, msId, type);
        Router.handleRouting();
      });
    });

    // Report Partner
    document.querySelectorAll('.report-partner-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.userId;
        const userName = btn.dataset.userName;
        this.openReportUserModal(userId, userName);
      });
    });

    // Block Partner
    document.querySelectorAll('.block-partner-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const userId = btn.dataset.userId;
        const userName = btn.dataset.userName;
        if (confirm(`Are you sure you want to block ${userName}?\n\nBlocked users can no longer send you study squad chat messages or WebRTC video/voice calls.`)) {
          try {
            await API.blockUser(userId, 'Blocked from study squad');
            alert(`${userName} has been blocked.`);
            Router.handleRouting();
          } catch (err) {
            alert('Failed to block user: ' + err.message);
          }
        }
      });
    });
  },

  async renderGroupChatTab(container, groupId) {
    let messages = [];
    try {
      const res = await API.getChatMessages(groupId);
      messages = res.messages || [];
    } catch (e) {}

    container.innerHTML = `
      <div class="card" style="height:550px; display:flex; flex-direction:column; padding:0; overflow:hidden;">
        <div style="padding:1rem 1.25rem; background:var(--bg-surface); border-bottom:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:700;">💬 Partner Discussion & Lesson Linker</div>
          <span style="font-size:0.75rem; color:var(--text-muted);">Encourage, ask questions, or link current lesson</span>
        </div>

        <div id="partner-chat-box" style="flex:1; padding:1.25rem; overflow-y:auto; display:flex; flex-direction:column; gap:0.75rem;">
          ${messages.map(m => `
            <div style="align-self:${m.sender_id === State.user.id ? 'flex-end' : 'flex-start'}; max-width:75%; background:${m.sender_id === State.user.id ? 'var(--primary)' : 'var(--bg-surface)'}; color:${m.sender_id === State.user.id ? 'white' : 'var(--text-main)'}; padding:0.65rem 0.9rem; border-radius:8px;">
              <div style="font-size:0.7rem; opacity:0.8; margin-bottom:0.2rem;">${m.sender_name} • ${new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              <div>${m.message}</div>
              ${m.lesson_link ? `<div style="margin-top:0.4rem;"><a href="${m.lesson_link}" style="color:${m.sender_id === State.user.id ? '#93c5fd' : 'var(--primary)'}; font-size:0.75rem; font-weight:700;">📖 View Linked Lesson →</a></div>` : ''}
            </div>
          `).join('')}
          ${messages.length === 0 ? `<div style="text-align:center; color:var(--text-muted); margin:auto;">No messages yet. Send a hello to your study partner! 👋</div>` : ''}
        </div>

        <div style="padding:0.75rem 1rem; border-top:1px solid var(--border); display:flex; gap:0.5rem; background:white;">
          <input type="text" id="partner-chat-input" placeholder="Type message to partner..." style="flex:1; padding:0.5rem 0.75rem; border-radius:6px; border:1px solid var(--border); outline:none;">
          <button id="send-partner-msg-btn" class="btn btn-primary btn-sm">Send</button>
        </div>
      </div>
    `;

    const sendBtn = document.getElementById('send-partner-msg-btn');
    const input = document.getElementById('partner-chat-input');
    const send = async () => {
      const txt = input.value.trim();
      if (!txt) return;
      input.value = '';
      await API.sendChatMessage(groupId, txt);
      await this.renderGroupChatTab(container, groupId);
    };

    sendBtn.addEventListener('click', send);
    input.addEventListener('keydown', (e) => { if (e.key === 'Enter') send(); });
  },

  renderGroupCallTab(groupId) {
    return `
      <div class="card" style="text-align:center; padding:2rem 1.5rem; max-width:800px; margin:0 auto;">
        <div style="display:inline-flex; align-items:center; gap:0.5rem; background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; padding:4px 12px; border-radius:20px; font-size:0.8rem; margin-bottom:1.5rem;">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#10b981;"></span>
          <span>WebRTC P2P Call Signaling Active</span>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-bottom:1.5rem;">
          <div style="height:220px; background:#0f172a; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; position:relative;">
            <div style="font-size:2rem; margin-bottom:0.5rem;">👤</div>
            <div style="font-size:0.85rem; font-weight:600;">You (${State.user.name})</div>
            <div id="local-video-status" style="font-size:0.75rem; color:#38bdf8;">Camera Active</div>
          </div>
          <div style="height:220px; background:#1e293b; border-radius:8px; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; position:relative;">
            <div style="font-size:2rem; margin-bottom:0.5rem;">👥</div>
            <div style="font-size:0.85rem; font-weight:600;">Partner Screen</div>
            <div id="partner-call-status" style="font-size:0.75rem; color:#94a3b8;">Waiting for partner to join call...</div>
          </div>
        </div>

        <!-- Controls Bar -->
        <div style="display:flex; justify-content:center; gap:0.75rem; flex-wrap:wrap;">
          <button id="call-toggle-mic-btn" class="btn btn-secondary">
            <span>🎤 Mute Mic</span>
          </button>
          <button id="call-toggle-cam-btn" class="btn btn-secondary">
            <span>📹 Turn Camera Off</span>
          </button>
          <button id="call-hangup-btn" class="btn btn-primary" style="background:#ef4444;">
            <span>📞 Hang Up</span>
          </button>
        </div>

        <div style="margin-top:1.5rem; font-size:0.8rem; color:var(--text-muted); background:var(--bg-surface); padding:0.75rem; border-radius:6px;">
          ℹ️ Real-time WebRTC P2P signaling is established through the server. When running behind corporate symmetric NATs without configured TURN servers, call quality operates in mesh mode.
        </div>
      </div>
    `;
  },

  bindGroupCallEvents(groupId) {
    const micBtn = document.getElementById('call-toggle-mic-btn');
    const camBtn = document.getElementById('call-toggle-cam-btn');
    const hangupBtn = document.getElementById('call-hangup-btn');

    let micMuted = false;
    let camOff = false;

    if (micBtn) {
      micBtn.addEventListener('click', () => {
        micMuted = !micMuted;
        micBtn.innerHTML = micMuted ? `<span>🔇 Unmute Mic</span>` : `<span>🎤 Mute Mic</span>`;
      });
    }

    if (camBtn) {
      camBtn.addEventListener('click', () => {
        camOff = !camOff;
        camBtn.innerHTML = camOff ? `<span>📷 Turn Camera On</span>` : `<span>📹 Turn Camera Off</span>`;
        document.getElementById('local-video-status').innerText = camOff ? 'Camera Paused' : 'Camera Active';
      });
    }

    if (hangupBtn) {
      hangupBtn.addEventListener('click', () => {
        alert('Call disconnected.');
        Router.handleRouting();
      });
    }
  },

  renderGroupPrivacyTab(myMembership, groupId) {
    return `
      <div class="card" style="max-width:600px; margin:0 auto;">
        <h3 class="card-title">Squad Privacy & Explicit Sharing Controls</h3>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.5rem;">
          By default, all personal notes, detailed quiz answers, and personal study schedules are private. Choose exactly what you share with your study partner:
        </p>

        <form id="group-sharing-form">
          <div style="display:flex; flex-direction:column; gap:1rem; margin-bottom:1.5rem;">
            <label style="display:flex; align-items:center; gap:0.75rem; font-size:0.9rem; cursor:pointer;">
              <input type="checkbox" name="share_progress" ${myMembership.share_progress ? 'checked' : ''} style="width:18px; height:18px;">
              <span>Share my completed lesson counts and progress percentage</span>
            </label>

            <label style="display:flex; align-items:center; gap:0.75rem; font-size:0.9rem; cursor:pointer;">
              <input type="checkbox" name="share_milestones" ${myMembership.share_milestones ? 'checked' : ''} style="width:18px; height:18px;">
              <span>Share my capstone project completions on the squad milestones feed</span>
            </label>

            <label style="display:flex; align-items:center; gap:0.75rem; font-size:0.9rem; cursor:pointer;">
              <input type="checkbox" name="share_hours" ${myMembership.share_hours ? 'checked' : ''} style="width:18px; height:18px;">
              <span>Share my weekly study goal hours</span>
            </label>

            <label style="display:flex; align-items:center; gap:0.75rem; font-size:0.9rem; cursor:pointer;">
              <input type="checkbox" name="share_scores" ${myMembership.share_scores ? 'checked' : ''} style="width:18px; height:18px;">
              <span>Share my quiz & test percentage scores (Default is Private)</span>
            </label>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center;">
            <button type="submit" class="btn btn-primary">Save Preferences</button>
            <button type="button" id="leave-squad-btn" class="btn btn-secondary" style="color:var(--danger); border-color:#fca5a5;">
              Leave Squad
            </button>
          </div>
        </form>
      </div>
    `;
  },

  bindGroupPrivacyEvents(groupId) {
    const form = document.getElementById('group-sharing-form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const payload = {
          share_progress: form.share_progress.checked,
          share_milestones: form.share_milestones.checked,
          share_hours: form.share_hours.checked,
          share_scores: form.share_scores.checked
        };
        await API.updateGroupSharing(groupId, payload);
        alert('Sharing preferences updated!');
        Router.handleRouting();
      });
    }

    const leaveBtn = document.getElementById('leave-squad-btn');
    if (leaveBtn) {
      leaveBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to leave this study squad?')) {
          await API.leaveGroup(groupId);
          Router.navigate('groups');
        }
      });
    }
  },

  // -----------------------------------------------------------
  // 8. 17-COURSE CATALOG & SYLLABUS
  // -----------------------------------------------------------
  async renderCatalog(container) {
    const isHi = State.language === 'hinglish';
    let courses = [];
    try {
      const res = await API.getCourses();
      courses = res.courses || [];
      State.courses = courses;
    } catch (e) {
      container.innerHTML = `<div>Error loading catalog: ${e.message}</div>`;
      return;
    }

    container.innerHTML = `
      <div class="catalog-header">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('navCatalog')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          ${isHi ? '17 कोर मॉड्यूल्स: शुरुआती से एडवांस्ड लेवल तक क्रमिक और स्ट्रक्चर्ड रोडमैप।' : 'Structured 17-course sequence covering all technical, analytical, soft skill, and career competencies.'}
        </p>

        <div class="catalog-filters">
          <button class="filter-btn active" data-filter="all">${State.t('filterAll')}</button>
          <button class="filter-btn" data-filter="Beginner">${State.t('filterBeginner')}</button>
          <button class="filter-btn" data-filter="Intermediate">${State.t('filterIntermediate')}</button>
          <button class="filter-btn" data-filter="Advanced">${State.t('filterAdvanced')}</button>
        </div>
      </div>

      <div class="course-grid" id="catalog-grid">
        ${this.renderCourseCards(courses, isHi)}
      </div>
    `;

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        const level = e.target.dataset.filter;
        const filtered = level === 'all' ? courses : courses.filter(c => c.level.includes(level));
        document.getElementById('catalog-grid').innerHTML = this.renderCourseCards(filtered, isHi);
      });
    });
  },

  renderCourseCards(courses, isHi) {
    return courses.map(c => `
      <div class="course-card">
        <div class="course-card-top">
          <div class="course-icon-box">📘</div>
          <div class="course-card-content">
            <div class="course-domain-tag">${c.domain}</div>
            <h3 class="course-card-title">${isHi ? c.title_hi : c.title}</h3>
            <p class="course-card-desc">${isHi ? c.description_hi : c.description}</p>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap; margin-top:0.4rem;">
              <span class="badge badge-slate">${c.level}</span>
              <span class="badge badge-blue">${c.lessonCount || 0} Lessons</span>
            </div>
          </div>
        </div>

        <div style="padding: 0 1.25rem 0.5rem;">
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill" style="width:${c.progressPct || 0}%;"></div>
          </div>
        </div>

        <div class="course-card-footer">
          <span>⏱️ ${c.estimated_hours} hrs</span>
          <a href="#course/${c.id}" class="btn btn-primary btn-sm">${State.t('viewSyllabus')}</a>
        </div>
      </div>
    `).join('');
  },

  async renderCourseDetail(container, courseId) {
    const isHi = State.language === 'hinglish';
    let data = null;

    try {
      data = await API.getCourse(courseId);
    } catch (e) {
      container.innerHTML = `<div class="card" style="color:red;">Course not found: ${e.message}</div>`;
      return;
    }

    const { course, lessons } = data;

    container.innerHTML = `
      <div class="lesson-top-bar">
        <div class="lesson-breadcrumbs">
          <a href="#catalog">← All 17 Courses</a>
          <span>/</span>
          <span>${isHi ? course.title_hi : course.title}</span>
        </div>
        <span class="badge badge-blue">${course.domain}</span>
      </div>

      <div class="card" style="margin-bottom:2rem; background:linear-gradient(to right, var(--bg-card), var(--bg-surface));">
        <div style="display:flex; flex-wrap:wrap; justify-content:space-between; gap:1.5rem;">
          <div style="flex:1; min-width:280px;">
            <div class="course-domain-tag">${course.domain} • ${course.level}</div>
            <h1 style="font-size:1.85rem; font-weight:800; margin-bottom:0.75rem;">${isHi ? course.title_hi : course.title}</h1>
            <p style="font-size:0.95rem; color:var(--text-muted); line-height:1.6; margin-bottom:1.25rem;">${isHi ? course.description_hi : course.description}</p>
            <div style="display:flex; flex-wrap:wrap; gap:1.5rem; font-size:0.85rem;">
              <div>⏱️ <strong>${State.t('estTime')}:</strong> ${course.estimated_hours} hrs</div>
              <div>🔑 <strong>${State.t('prerequisites')}:</strong> ${course.prerequisites}</div>
            </div>
          </div>

          <div style="min-width:240px; display:flex; flex-direction:column; justify-content:center; gap:0.75rem;">
            ${lessons.length > 0 ? `
              <a href="#lesson/${lessons[0].id}" class="btn btn-primary btn-lg">▶️ ${State.t('startCourse')}</a>
            ` : `<button class="btn btn-secondary btn-lg" disabled>In Syllabus Roadmap</button>`}
          </div>
        </div>
      </div>

      <!-- Learning Objectives -->
      <div class="card" style="margin-bottom:2rem;">
        <h3 class="card-title">${State.t('learningObjectives')}</h3>
        <ul style="margin: 0.75rem 0 0 1.25rem; font-size:0.9rem; line-height:1.7; color:var(--text-main);">
          ${course.learning_objectives.map(obj => `<li>${obj}</li>`).join('')}
        </ul>
      </div>

      <!-- Lessons Directory -->
      <div class="card" style="margin-bottom:2rem;">
        <h3 class="card-title" style="margin-bottom:1.25rem;">Course Lessons & Checkpoints</h3>
        <div style="display:flex; flex-direction:column; gap:0.75rem;">
          ${lessons.map((l, index) => `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:1rem 1.25rem; background:var(--bg-surface); border-radius:var(--radius-sm); border:1px solid var(--border);">
              <div style="display:flex; align-items:center; gap:1rem;">
                <span style="font-weight:700; color:var(--primary); font-size:0.9rem;">${index + 1}</span>
                <div>
                  <h4 style="font-size:0.95rem; font-weight:700;">${isHi ? l.title_hi : l.title}</h4>
                  <span style="font-size:0.78rem; color:var(--text-muted);">⏱️ ${l.estimated_minutes} mins</span>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:0.75rem;">
                ${l.isCompleted ? `<span class="badge badge-green">✓ Completed</span>` : ''}
                <a href="#lesson/${l.id}" class="btn btn-primary btn-sm">${l.isCompleted ? 'Review' : 'Start'} →</a>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // -----------------------------------------------------------
  // 9. LESSON READER WITH VIDEO MODE, END-OF-LESSON TESTS & NOTES
  // -----------------------------------------------------------
  async renderLesson(container, lessonId) {
    const isHi = State.language === 'hinglish';
    let data = null;

    try {
      data = await API.getLesson(lessonId);
    } catch (e) {
      container.innerHTML = `<div class="card" style="color:red;">Lesson not found: ${e.message}</div>`;
      return;
    }

    const { lesson, course, isCompleted, userNote, userProgress, prevLesson, nextLesson } = data;
    State.currentLesson = lesson;

    // Active learning mode: 'reading' or 'video' (persisted in lesson_progress)
    let currentMode = (userProgress && userProgress.mode_studied === 'video') ? 'video' : 'reading';

    const renderLessonBody = () => {
      const contentHtml = Tutor.formatMarkdown(isHi ? lesson.content_hi : lesson.content_en);
      const isVideo = currentMode === 'video';

      return `
        <div class="lesson-top-bar">
          <div class="lesson-breadcrumbs">
            <a href="#course/${course.id}">← ${isHi ? course.title_hi : course.title}</a>
            <span>/</span>
            <span>${isHi ? lesson.title_hi : lesson.title}</span>
          </div>

          <div class="lesson-actions-group">
            <button id="report-error-btn" class="btn btn-secondary btn-sm" title="Report an error or suggest a correction">
              🚩 ${State.t('reportCorrection')}
            </button>
            <button id="print-notes-btn" class="btn btn-secondary btn-sm" title="Print notes">
              🖨️ ${State.t('printNotes')}
            </button>
            <button id="complete-lesson-btn" class="btn ${isCompleted ? 'btn-success' : 'btn-primary'} btn-sm">
              ${isCompleted ? '✓ ' + State.t('lessonCompleted') : State.t('markCompleted')}
            </button>
          </div>
        </div>

        <!-- Mode Switcher Bar -->
        <div class="mode-switcher-bar">
          <div style="display:flex; align-items:center; gap:0.6rem;">
            <span style="font-size:0.85rem; font-weight:700; color:var(--text-muted);">LEARNING MODE:</span>
            <div class="mode-segmented-control">
              <button id="mode-reading-btn" class="mode-tab-btn ${!isVideo ? 'active' : ''}">
                📖 Read Mode
              </button>
              <button id="mode-video-btn" class="mode-tab-btn ${isVideo ? 'active' : ''}">
                🎬 Video Mode
              </button>
            </div>
          </div>
          <div style="font-size:0.8rem; color:var(--text-muted);">
            ${isVideo ? '🎥 Synchronized video walkthrough, transcript & planned script' : '📚 Detailed technical explanations, key formulas & pitfalls'}
          </div>
        </div>

        <div class="lesson-content-card">
          <div class="lesson-header">
            <h1 class="lesson-title">${isHi ? lesson.title_hi : lesson.title}</h1>
            <div class="lesson-meta-row">
              <span>⏱️ ${isVideo ? lesson.video_duration || '15:00' : `${lesson.estimated_minutes} min read`}</span>
              <span>•</span>
              <span>Domain: ${course.domain}</span>
              ${userProgress && userProgress.test_passed ? `<span>•</span><span class="badge badge-green">✓ Test Passed (${userProgress.test_score}%)</span>` : ''}
            </div>
          </div>

          <!-- VIDEO MODE VIEW -->
          <div id="video-mode-container" style="display: ${isVideo ? 'block' : 'none'};">
            <!-- Simulated High-Quality Educational Video Player -->
            <div class="video-player-card">
              <div class="video-screen" id="simulated-video-screen">
                <span class="video-screen-badge">🎥 Educational Lesson Video</span>
                <div class="video-play-btn-big" id="video-big-play-btn">▶</div>
                <div class="video-title-card">${isHi ? lesson.title_hi : lesson.title}</div>
                <div class="video-subtitle-card">${lesson.video_summary || 'Master data analysis workflows step by step with practical examples.'}</div>
              </div>

              <!-- Interactive Playback Controls -->
              <div class="video-controls-bar">
                <button class="video-ctrl-btn" id="video-play-pause-btn" title="Play/Pause">▶</button>
                <div class="video-scrubber-wrapper">
                  <span class="video-time-display" id="video-cur-time">00:00</span>
                  <input type="range" class="video-scrubber" id="video-scrubber-bar" min="0" max="100" value="0">
                  <span class="video-time-display" id="video-total-time">${lesson.video_duration || '15:00'}</span>
                </div>
                <div class="speed-pills-group">
                  <button class="speed-pill-btn" data-speed="0.75">0.75x</button>
                  <button class="speed-pill-btn active" data-speed="1.0">1x</button>
                  <button class="speed-pill-btn" data-speed="1.25">1.25x</button>
                  <button class="speed-pill-btn" data-speed="1.5">1.5x</button>
                  <button class="speed-pill-btn" data-speed="2.0">2x</button>
                </div>
              </div>
            </div>

            <!-- Video Summary Card -->
            <div class="card" style="margin-bottom:1.5rem; background:var(--bg-surface); border-left:4px solid var(--primary);">
              <h4 style="font-weight:700; margin-bottom:0.4rem;">📌 Video Lesson Summary</h4>
              <p style="font-size:0.9rem; color:var(--text-muted); line-height:1.5;">${lesson.video_summary || 'Comprehensive walkthrough of key concepts, live execution, and production best practices.'}</p>
            </div>

            <!-- Interactive Clickable Timestamped Transcript -->
            ${lesson.video_transcript && lesson.video_transcript.length > 0 ? `
              <div class="video-transcript-box">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <h4 style="font-weight:700;">📝 Interactive Timestamped Transcript</h4>
                  <span style="font-size:0.75rem; color:var(--text-light);">Click any timestamp to seek</span>
                </div>
                <div class="transcript-list">
                  ${lesson.video_transcript.map((cue, idx) => `
                    <div class="transcript-cue-item ${idx === 0 ? 'active' : ''}" data-seconds="${cue.seconds}" data-time="${cue.time}">
                      <span class="transcript-time-tag">${cue.time}</span>
                      <div>
                        <strong>${cue.title}:</strong> <span>${cue.text}</span>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Planned Video Script & Storyboard Viewer -->
            ${lesson.video_script ? `
              <div class="script-storyboard-box">
                <div class="script-label-pill">🎬 Planned Video Production Script & Storyboard</div>
                <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
                  Original lesson storyboard prepared for recording. Outlines visual scenes, audio narration, and live terminal demonstrations.
                </div>
                <div class="prose" style="font-size:0.88rem; background:var(--bg-card); padding:1.25rem; border-radius:6px; border:1px solid var(--border);">
                  ${Tutor.formatMarkdown(lesson.video_script)}
                </div>
              </div>
            ` : ''}
          </div>

          <!-- READING MODE VIEW -->
          <div id="reading-mode-container" style="display: ${!isVideo ? 'block' : 'none'};">
            <div class="prose">
              ${contentHtml}
            </div>

            <!-- Key Terms -->
            ${lesson.key_terms && lesson.key_terms.length > 0 ? `
              <div style="margin: 2.5rem 0 1.5rem;">
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.75rem;">📚 ${State.t('keyTermsTitle')}</h3>
                <div class="key-terms-grid">
                  ${lesson.key_terms.map(t => `
                    <div class="term-card">
                      <div class="term-title">${t.term}</div>
                      <div class="term-def">${t.definition}</div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- Formula Cheat Sheet -->
            ${lesson.formula_sheet && lesson.formula_sheet.length > 0 ? `
              <div style="margin: 2rem 0;">
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.75rem;">⚡ ${State.t('formulaSheetTitle')}</h3>
                <table class="formula-table">
                  <thead><tr><th>Syntax / Formula</th><th>Description</th></tr></thead>
                  <tbody>
                    ${lesson.formula_sheet.map(f => `<tr><td><code>${f.syntax}</code></td><td>${f.description}</td></tr>`).join('')}
                  </tbody>
                </table>
              </div>
            ` : ''}

            <!-- Pitfalls & Mistakes -->
            ${lesson.common_mistakes && lesson.common_mistakes.length > 0 ? `
              <div style="margin: 2rem 0;">
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.75rem;">⚠️ ${State.t('commonMistakesTitle')}</h3>
                ${lesson.common_mistakes.map(m => `
                  <div class="mistake-box">
                    <div class="mistake-title">❌ Pitfall: ${m.mistake}</div>
                    <div style="font-size:0.85rem; margin-bottom:0.35rem;"><strong>Consequence:</strong> ${m.consequence}</div>
                    <div class="mistake-fix"><strong>✅ The Fix:</strong> ${m.fix}</div>
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Interactive Practice Runner Sandbox (Available in both modes) -->
          <div style="margin: 2.5rem 0;">
            <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.5rem;">💻 ${State.t('practiceRunnerTitle')}</h3>
            <div id="lesson-interactive-sandbox"></div>
          </div>

          <!-- END-OF-LESSON TEST & REVISION CHECKPOINT -->
          ${lesson.lesson_test && lesson.lesson_test.length > 0 ? `
            <div class="lesson-test-card" id="lesson-test-card">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem;">
                <div>
                  <h3 style="font-size:1.2rem; font-weight:800; color:var(--text-main);">🎯 End-of-Lesson Test (${lesson.lesson_test.length} Questions)</h3>
                  <p style="font-size:0.82rem; color:var(--text-muted); margin:0;">Pass threshold: 70%. Tests your practical retention of this topic.</p>
                </div>
                <div id="test-score-badge" style="display:${userProgress && userProgress.test_attempts ? 'block' : 'none'};">
                  <span class="badge ${userProgress && userProgress.test_passed ? 'badge-green' : 'badge-slate'}" style="font-size:0.85rem; padding:4px 10px;">
                    Score: ${userProgress ? userProgress.test_score : 0}% (${userProgress && userProgress.test_passed ? 'Passed' : 'Needs Practice'})
                  </span>
                </div>
              </div>

              <div id="lesson-test-questions-list">
                ${lesson.lesson_test.map((tq, qIdx) => `
                  <div class="test-question-item" data-qidx="${qIdx}">
                    <div class="test-q-title">Q${qIdx + 1}: ${isHi && tq.question_hi ? tq.question_hi : tq.question}</div>
                    <div class="test-options-group">
                      ${tq.options.map((opt, optIdx) => `
                        <label class="test-option-row" data-qidx="${qIdx}" data-optidx="${optIdx}">
                          <input type="radio" name="lesson_test_q_${qIdx}" value="${optIdx}">
                          <span>${opt}</span>
                        </label>
                      `).join('')}
                    </div>
                    <div class="test-explanation-box" id="test-exp-${qIdx}" style="display:none;"></div>
                  </div>
                `).join('')}
              </div>

              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1.25rem;">
                <button id="submit-lesson-test-btn" class="btn btn-primary">
                  Submit Lesson Test (+40 XP)
                </button>
                <span id="test-submit-hint" style="font-size:0.8rem; color:var(--text-light);">Select an option for each question before submitting.</span>
              </div>

              <div id="test-revision-recommendation-box" style="display:none;"></div>
            </div>
          ` : ''}

          <!-- Private Notes Box -->
          <div style="margin: 2.5rem 0; padding:1.25rem; background:var(--bg-surface); border-radius:var(--radius-md); border:1px solid var(--border);">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
              <h4 style="font-weight:700;">📝 Your Private Notes for this Lesson</h4>
              <span style="font-size:0.75rem; color:var(--text-muted);">Stored privately in your account</span>
            </div>
            <textarea id="lesson-private-notes" style="width:100%; min-height:80px; padding:0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;" placeholder="Record takeaways, questions, or key syntax...">${userNote || ''}</textarea>
            <div style="display:flex; justify-content:flex-end; margin-top:0.5rem;">
              <button id="save-lesson-notes-btn" class="btn btn-secondary btn-sm">💾 ${State.t('saveNotes')}</button>
            </div>
          </div>

          <!-- Official Citations -->
          ${lesson.external_resources && lesson.external_resources.length > 0 ? `
            <div class="citations-block">
              <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:0.4rem;">📖 ${State.t('officialCitationsTitle')}</h4>
              <ul class="citations-list">
                ${lesson.external_resources.map(res => `
                  <li><a href="${res.url}" target="_blank" rel="noopener noreferrer">🔗 ${res.name}</a> <span style="font-size:0.75rem; color:var(--text-light);">(Accessed: ${res.access_date})</span></li>
                `).join('')}
              </ul>
            </div>
          ` : ''}

          <!-- Navigation Buttons -->
          <div style="display:flex; justify-content:space-between; align-items:center; padding-top:2rem; border-top:1px solid var(--border); margin-top:2rem;">
            ${prevLesson ? `<a href="#lesson/${prevLesson.id}" class="btn btn-secondary">← ${isHi ? prevLesson.title_hi : prevLesson.title}</a>` : `<div></div>`}
            ${nextLesson ? `<a href="#lesson/${nextLesson.id}" class="btn btn-primary">${isHi ? nextLesson.title_hi : nextLesson.title} →</a>` : `<a href="#course/${course.id}" class="btn btn-primary">Complete Course Overview</a>`}
          </div>
        </div>
      `;
    };

    container.innerHTML = renderLessonBody();

    // Mode Toggle Logic
    const bindModeEvents = () => {
      const readingBtn = document.getElementById('mode-reading-btn');
      const videoBtn = document.getElementById('mode-video-btn');
      const readBox = document.getElementById('reading-mode-container');
      const videoBox = document.getElementById('video-mode-container');

      const setMode = async (newMode) => {
        currentMode = newMode;
        if (newMode === 'video') {
          readingBtn.classList.remove('active');
          videoBtn.classList.add('active');
          readBox.style.display = 'none';
          videoBox.style.display = 'block';
        } else {
          videoBtn.classList.remove('active');
          readingBtn.classList.add('active');
          videoBox.style.display = 'none';
          readBox.style.display = 'block';
        }
        await API.recordLessonMode(lesson.id, newMode);
      };

      readingBtn?.addEventListener('click', () => setMode('reading'));
      videoBtn?.addEventListener('click', () => setMode('video'));
    };

    // Video Player Simulation Logic
    const bindVideoPlayerEvents = () => {
      const playBtn = document.getElementById('video-play-pause-btn');
      const bigPlayBtn = document.getElementById('video-big-play-btn');
      const scrubber = document.getElementById('video-scrubber-bar');
      const curTimeSpan = document.getElementById('video-cur-time');
      const speedBtns = document.querySelectorAll('.speed-pill-btn');
      const transcriptCues = document.querySelectorAll('.transcript-cue-item');

      let isPlaying = false;
      let curSec = 0;
      let totalSec = 900; // default 15 mins
      let playSpeed = 1.0;
      let intervalId = null;

      if (lesson.video_duration && lesson.video_duration.includes(':')) {
        const parts = lesson.video_duration.split(':').map(Number);
        totalSec = (parts[0] || 0) * 60 + (parts[1] || 0);
      }

      const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
      };

      const updateUI = () => {
        if (curTimeSpan) curTimeSpan.textContent = formatTime(curSec);
        if (scrubber) scrubber.value = Math.min(100, (curSec / totalSec) * 100);

        // Highlight matching transcript cue
        transcriptCues.forEach(cue => {
          const cueSec = Number(cue.dataset.seconds) || 0;
          if (curSec >= cueSec && curSec < cueSec + 120) {
            cue.classList.add('active');
          } else {
            cue.classList.remove('active');
          }
        });
      };

      const togglePlay = () => {
        isPlaying = !isPlaying;
        if (isPlaying) {
          if (playBtn) playBtn.textContent = '❚❚';
          if (bigPlayBtn) bigPlayBtn.textContent = '❚❚';
          intervalId = setInterval(() => {
            curSec += playSpeed;
            if (curSec >= totalSec) {
              curSec = totalSec;
              clearInterval(intervalId);
              isPlaying = false;
              if (playBtn) playBtn.textContent = '▶';
              if (bigPlayBtn) bigPlayBtn.textContent = '▶';
            }
            updateUI();
          }, 1000);
        } else {
          if (playBtn) playBtn.textContent = '▶';
          if (bigPlayBtn) bigPlayBtn.textContent = '▶';
          if (intervalId) clearInterval(intervalId);
        }
      };

      playBtn?.addEventListener('click', togglePlay);
      bigPlayBtn?.addEventListener('click', togglePlay);
      document.getElementById('simulated-video-screen')?.addEventListener('click', (e) => {
        if (e.target !== bigPlayBtn) togglePlay();
      });

      scrubber?.addEventListener('input', (e) => {
        curSec = Math.round((Number(e.target.value) / 100) * totalSec);
        updateUI();
      });

      speedBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          speedBtns.forEach(b => b.classList.remove('active'));
          e.target.classList.add('active');
          playSpeed = Number(e.target.dataset.speed) || 1.0;
        });
      });

      transcriptCues.forEach(cue => {
        cue.addEventListener('click', () => {
          const s = Number(cue.dataset.seconds) || 0;
          curSec = s;
          updateUI();
          if (!isPlaying) togglePlay();
        });
      });
    };

    // End-of-Lesson Test Submission Logic
    const bindLessonTestEvents = () => {
      const submitTestBtn = document.getElementById('submit-lesson-test-btn');
      const questionsList = document.querySelectorAll('.test-question-item');
      const testQuestions = lesson.lesson_test || [];

      submitTestBtn?.addEventListener('click', async () => {
        const answers = [];
        let allAnswered = true;

        questionsList.forEach((qItem, idx) => {
          const selected = qItem.querySelector(`input[name="lesson_test_q_${idx}"]:checked`);
          if (selected) {
            answers.push(Number(selected.value));
          } else {
            answers.push(null);
            allAnswered = false;
          }
        });

        if (!allAnswered) {
          const hint = document.getElementById('test-submit-hint');
          if (hint) hint.style.color = 'var(--danger)';
          alert('Please answer all test questions before submitting.');
          return;
        }

        try {
          submitTestBtn.disabled = true;
          submitTestBtn.textContent = 'Evaluating Test...';
          const res = await API.submitLessonTest(lesson.id, answers);

          // Update Score Badge
          const badge = document.getElementById('test-score-badge');
          if (badge) {
            badge.style.display = 'block';
            badge.innerHTML = `
              <span class="badge ${res.isPassed ? 'badge-green' : 'badge-slate'}" style="font-size:0.85rem; padding:4px 10px;">
                Score: ${res.score}% (${res.isPassed ? 'Passed ✓' : 'Needs Practice'})
              </span>
            `;
          }

          // Show question explanations
          if (res.questionResults) {
            res.questionResults.forEach((qr, idx) => {
              const expBox = document.getElementById(`test-exp-${idx}`);
              if (expBox) {
                expBox.style.display = 'block';
                expBox.className = `test-explanation-box ${qr.is_correct ? 'correct' : 'incorrect'}`;
                expBox.innerHTML = `
                  <strong>${qr.is_correct ? '✅ Correct' : '❌ Incorrect'}:</strong> ${qr.explanation}
                `;
              }
            });
          }

          // Revision Recommendation
          const recBox = document.getElementById('test-revision-recommendation-box');
          if (recBox) {
            if (!res.isPassed && res.recommendedRevision) {
              recBox.style.display = 'block';
              recBox.className = 'revision-recommendation-banner';
              recBox.innerHTML = `
                <div style="font-weight:700; margin-bottom:0.25rem;">⚠️ Targeted Revision Recommended</div>
                <div style="font-size:0.85rem; line-height:1.4;">${res.recommendedRevision.message}</div>
                <div style="margin-top:0.75rem; display:flex; gap:0.5rem;">
                  <button class="btn btn-secondary btn-sm" onclick="document.getElementById('mode-reading-btn').click(); window.scrollTo({top: 400, behavior:'smooth'});">Re-read Key Terms & Pitfalls</button>
                  <button class="btn btn-primary btn-sm" onclick="document.getElementById('tutor-input').value='Can you explain the key concepts of ${lesson.title} in simpler words?'; document.getElementById('tutor-send-btn').click();">Ask AI Tutor to Re-explain</button>
                </div>
              `;
            } else if (res.isPassed) {
              recBox.style.display = 'block';
              recBox.className = 'test-explanation-box correct';
              recBox.style.marginTop = '1.25rem';
              recBox.innerHTML = `
                <div style="font-weight:700;">🎉 Lesson Test Passed! (+${res.xpAwarded} XP)</div>
                <div style="font-size:0.85rem;">You have demonstrated solid understanding of ${lesson.title}. Lesson progress updated.</div>
              `;

              // Mark complete button active
              const cBtn = document.getElementById('complete-lesson-btn');
              if (cBtn) {
                cBtn.className = 'btn btn-success btn-sm';
                cBtn.innerHTML = '✓ ' + State.t('lessonCompleted');
              }
            }
          }

          submitTestBtn.textContent = 'Retake Test';
          submitTestBtn.disabled = false;
        } catch (err) {
          alert('Error submitting test: ' + err.message);
          submitTestBtn.disabled = false;
          submitTestBtn.textContent = 'Submit Lesson Test';
        }
      });
    };

    // Practice Runner Sandbox Render
    if (course.id === 'excel') {
      ExcelEvaluator.render('lesson-interactive-sandbox');
    } else {
      SqlRunner.renderSandbox('lesson-interactive-sandbox', {
        initialCode: lesson.practice_exercise ? lesson.practice_exercise.initial_code : null,
        expectedQuery: lesson.practice_exercise ? lesson.practice_exercise.expected_query : null,
        instruction: lesson.practice_exercise ? lesson.practice_exercise.instruction : null
      });
    }

    // Bind Event Handlers
    bindModeEvents();
    bindVideoPlayerEvents();
    bindLessonTestEvents();

    // Bind Notes Saving
    document.getElementById('save-lesson-notes-btn')?.addEventListener('click', async () => {
      const text = document.getElementById('lesson-private-notes').value;
      await API.saveLessonNotes(lesson.id, text);
      alert(State.t('notesSaved'));
    });

    // Complete button
    document.getElementById('complete-lesson-btn')?.addEventListener('click', async () => {
      const res = await API.toggleCompleteLesson(lesson.id);
      const btn = document.getElementById('complete-lesson-btn');
      btn.className = `btn ${res.completed ? 'btn-success' : 'btn-primary'} btn-sm`;
      btn.innerHTML = res.completed ? `✓ ${State.t('lessonCompleted')}` : State.t('markCompleted');
    });

    // Print
    document.getElementById('print-notes-btn')?.addEventListener('click', () => window.print());

    // Report Error / Suggest Correction
    document.getElementById('report-error-btn')?.addEventListener('click', () => {
      this.openContentCorrectionModal({
        courseId: course.id,
        lessonId: lesson.id,
        title: isHi ? lesson.title_hi : lesson.title
      });
    });
  },

  // -----------------------------------------------------------
  // 10. PRACTICE, QUIZZES, INTERVIEWS, PROJECTS, SCHEDULE, REPORT, SETTINGS
  // -----------------------------------------------------------
  renderPractice(container) {
    container.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('navPractice')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">Interactive consoles running directly against enterprise datasets.</p>
        <div style="display:flex; gap:0.5rem; margin-top:1.25rem;">
          <button class="filter-btn active" id="tab-sql-btn">SQL Console</button>
          <button class="filter-btn" id="tab-excel-btn">Excel Simulator</button>
          <button class="filter-btn" id="tab-python-btn">Python / Pandas</button>
        </div>
      </div>
      <div id="practice-tab-content"></div>
    `;

    SqlRunner.renderSandbox('practice-tab-content');

    const tabSql = document.getElementById('tab-sql-btn');
    const tabExcel = document.getElementById('tab-excel-btn');
    const tabPy = document.getElementById('tab-python-btn');

    tabSql.addEventListener('click', () => {
      [tabSql, tabExcel, tabPy].forEach(b => b.classList.remove('active'));
      tabSql.classList.add('active');
      SqlRunner.renderSandbox('practice-tab-content');
    });

    tabExcel.addEventListener('click', () => {
      [tabSql, tabExcel, tabPy].forEach(b => b.classList.remove('active'));
      tabExcel.classList.add('active');
      ExcelEvaluator.render('practice-tab-content');
    });

    tabPy.addEventListener('click', () => {
      [tabSql, tabExcel, tabPy].forEach(b => b.classList.remove('active'));
      tabPy.classList.add('active');
      this.renderPythonSandbox('practice-tab-content');
    });
  },

  renderPythonSandbox(containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = `
      <div class="practice-container">
        <div class="practice-header">
          <div class="practice-title"><span>🐍 Python Pandas EDA Console</span></div>
          <span style="font-size:0.75rem; color:#94a3b8;">Dataset: <code>employee_churn.csv</code></span>
        </div>
        <textarea id="python-code-input" class="practice-textarea" rows="5">import pandas as pd\n\n# Group employees by department and inspect salary\ndf.groupby('department')['monthly_salary'].mean()</textarea>
        <div class="practice-toolbar">
          <button id="run-python-btn" class="btn btn-primary btn-sm">▶️ ${State.t('runPython')}</button>
          <button id="ai-review-python-btn" class="btn btn-secondary btn-sm" style="color:white; border-color:#475569;">🤖 ${State.t('aiReviewCode')}</button>
        </div>
        <div id="python-output-area" class="practice-output">
          <div style="color:#64748b;">Click "Run Python Code" to execute Pandas analytics...</div>
        </div>
      </div>
    `;

    document.getElementById('run-python-btn').addEventListener('click', async () => {
      const code = document.getElementById('python-code-input').value;
      const res = await API.runPython(code);
      document.getElementById('python-output-area').innerHTML = `<pre><code>${res.stdout}</code></pre>`;
    });

    document.getElementById('ai-review-python-btn').addEventListener('click', () => {
      const code = document.getElementById('python-code-input').value;
      Tutor.askPrompt(`Please review my Python Pandas snippet:\n\`\`\`python\n${code}\n\`\`\``);
    });
  },

  async renderQuizzes(container) {
    const isHi = State.language === 'hinglish';
    const sampleQuizzes = [
      { id: "quiz-sql-foundations", title: "SQL Foundations & Filtering Quiz", title_hi: "एसक्यूएल बेसिक्स और फिल्टरिंग क्विज", course: "SQL: Zero to Advanced", questionsCount: 4 },
      { id: "quiz-excel-xlookup", title: "Excel Lookups & Formulas Quiz", title_hi: "एक्सेल फॉर्मूले और XLOOKUP क्विज", course: "Excel: Zero to Advanced", questionsCount: 2 },
      { id: "quiz-stats-fundamentals", title: "Descriptive Statistics & Outliers Quiz", title_hi: "डिस्क्रिप्टिव स्टैटिस्टिक्स और आउटलायर क्विज", course: "Basic Statistics & Probability", questionsCount: 2 }
    ];

    container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('navQuizzes')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">Topic-wise checkpoints with immediate diagnostic feedback and weak topic tracking.</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem;">
        ${sampleQuizzes.map(q => `
          <div class="card">
            <span class="badge badge-blue" style="margin-bottom:0.5rem;">${q.course}</span>
            <h3 class="card-title">${isHi ? q.title_hi : q.title}</h3>
            <p class="card-desc" style="margin-bottom:1.25rem;">${q.questionsCount} Questions • Pass Score: 75%</p>
            <a href="#quiz/${q.id}" class="btn btn-primary btn-sm">📝 Start Quiz</a>
          </div>
        `).join('')}
      </div>
    `;
  },

  async renderQuizPlayer(container, quizId) {
    const isHi = State.language === 'hinglish';
    let data = null;
    try {
      data = await API.getQuiz(quizId);
    } catch (e) {
      container.innerHTML = `<div class="card" style="color:red;">Quiz not found: ${e.message}</div>`;
      return;
    }

    const { quiz, questions } = data;

    container.innerHTML = `
      <div class="quiz-card">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1.5rem; padding-bottom:1rem; border-bottom:1px solid var(--border);">
          <div>
            <a href="#quizzes" style="font-size:0.85rem; color:var(--text-muted);">← Back to Quizzes</a>
            <h1 style="font-size:1.5rem; font-weight:800; margin-top:0.25rem;">${isHi ? quiz.title_hi : quiz.title}</h1>
          </div>
          <span class="badge badge-amber">Pass: ${quiz.pass_score}%</span>
        </div>

        <form id="quiz-form">
          ${questions.map((q, idx) => `
            <div class="quiz-question-box" data-qid="${q.id}">
              <div class="quiz-question-text">
                <span style="color:var(--primary); font-weight:800;">${idx + 1}.</span> 
                ${isHi ? q.question_hi : q.question_en}
              </div>
              <div class="quiz-options">
                ${q.options.map(opt => `
                  <label class="quiz-option-label">
                    <input type="radio" name="ans_${q.id}" value="${opt}" style="accent-color:var(--primary);">
                    <span>${opt}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <div id="quiz-result-area"></div>
          <button type="submit" id="submit-quiz-btn" class="btn btn-primary btn-lg" style="width:100%; margin-top:1rem;">
            🚀 ${State.t('submitQuiz')}
          </button>
        </form>
      </div>
    `;

    document.querySelectorAll('.quiz-option-label input').forEach(input => {
      input.addEventListener('change', (e) => {
        const box = e.target.closest('.quiz-question-box');
        box.querySelectorAll('.quiz-option-label').forEach(lbl => lbl.classList.remove('selected'));
        e.target.closest('.quiz-option-label').classList.add('selected');
      });
    });

    document.getElementById('quiz-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const answers = {};
      questions.forEach(q => {
        const selected = document.querySelector(`input[name="ans_${q.id}"]:checked`);
        if (selected) answers[q.id] = selected.value;
      });

      const result = await API.submitQuiz(quiz.id, answers);
      document.getElementById('submit-quiz-btn').style.display = 'none';

      document.getElementById('quiz-result-area').innerHTML = `
        <div class="card" style="background:${result.passed ? 'var(--success-light)' : 'var(--warning-light)'}; border:2px solid ${result.passed ? 'var(--success)' : 'var(--warning)'}; margin-top:1.5rem; text-align:center;">
          <div style="font-size:2rem; font-weight:800; color:${result.passed ? '#065f46' : '#9a3412'};">
            ${result.passed ? '🎉 Passed!' : '💪 Keep Practicing!'} Score: ${result.percentage}%
          </div>
          <p style="margin:0.5rem 0;">You earned <strong>+${result.xpEarned} XP</strong>!</p>
          <div style="margin-top:1rem;"><a href="#dashboard" class="btn btn-primary btn-sm">Return to Dashboard</a></div>
        </div>
      `;

      result.results.forEach(res => {
        const box = document.querySelector(`.quiz-question-box[data-qid="${res.question_id}"]`);
        if (box) {
          const div = document.createElement('div');
          div.style.marginTop = '0.5rem';
          div.style.padding = '0.5rem';
          div.style.borderRadius = '4px';
          div.style.fontSize = '0.8rem';
          div.style.background = res.isCorrect ? '#ecfdf5' : '#fef2f2';
          div.style.color = res.isCorrect ? '#065f46' : '#991b1b';
          div.innerHTML = `<strong>${res.isCorrect ? '✅ Correct' : '❌ Target: ' + res.correctAnswer}</strong>: ${isHi ? res.explanation_hi : res.explanation_en}`;
          box.appendChild(div);
        }
      });
    });
  },

  async renderInterview(container) {
    const isHi = State.language === 'hinglish';
    let allQuestions = [];
    let mockRounds = [];

    try {
      const [qRes, rRes] = await Promise.all([
        API.getInterviewQuestions(),
        API.getMockInterviewRounds()
      ]);
      allQuestions = qRes.questions || [];
      mockRounds = rRes.rounds || [];
    } catch (e) {
      console.warn("Interview prep load error:", e);
    }

    let activeFilter = 'All';
    let activeQ = allQuestions[0];

    const getFilteredQuestions = () => {
      if (activeFilter === 'All') return allQuestions;
      if (activeFilter === 'Technical Screen') return allQuestions.filter(q => q.stage === 'Technical Screen' || q.category.includes('SQL') || q.category.includes('Python') || q.category.includes('Excel'));
      if (activeFilter === 'Business Cases') return allQuestions.filter(q => q.category.includes('Business') || q.category.includes('Product') || q.category.includes('Sales'));
      if (activeFilter === 'Portfolio Defense') return allQuestions.filter(q => q.category.includes('Portfolio') || q.stage === 'Portfolio Defense');
      if (activeFilter === 'Behavioral STAR') return allQuestions.filter(q => q.category.includes('Behavioral') || q.stage === 'Behavioral STAR');
      if (activeFilter === 'Reverse Questions') return allQuestions.filter(q => q.category.includes('Reverse') || q.stage === 'Reverse Questions');
      return allQuestions;
    };

    const renderStageTabs = () => `
      <div class="interview-stage-tabs">
        <button class="filter-btn ${activeFilter === 'All' ? 'active' : ''}" data-filter="All">All Questions (${allQuestions.length})</button>
        <button class="filter-btn ${activeFilter === 'Technical Screen' ? 'active' : ''}" data-filter="Technical Screen">💻 Technical Screen</button>
        <button class="filter-btn ${activeFilter === 'Business Cases' ? 'active' : ''}" data-filter="Business Cases">📊 Business Cases</button>
        <button class="filter-btn ${activeFilter === 'Portfolio Defense' ? 'active' : ''}" data-filter="Portfolio Defense">📁 Portfolio Defense</button>
        <button class="filter-btn ${activeFilter === 'Behavioral STAR' ? 'active' : ''}" data-filter="Behavioral STAR">⭐ Behavioral STAR</button>
        <button class="filter-btn ${activeFilter === 'Reverse Questions' ? 'active' : ''}" data-filter="Reverse Questions">❓ Reverse Questions</button>
        <button class="filter-btn ${activeFilter === 'Mock Rounds' ? 'active' : ''}" data-filter="Mock Rounds">🏆 Mock Rounds (${mockRounds.length})</button>
      </div>
    `;

    const renderMainContent = () => {
      if (activeFilter === 'Mock Rounds') {
        return `
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem;">
            ${mockRounds.map(r => `
              <div class="card interview-mock-card" data-round-id="${r.id}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
                  <span class="badge badge-blue">${r.difficulty}</span>
                  <span style="font-size:0.75rem; color:var(--text-light);">⏱️ ${r.duration_minutes} min</span>
                </div>
                <h3 style="font-size:1.15rem; font-weight:700; margin-bottom:0.4rem;">${isHi && r.title_hi ? r.title_hi : r.title}</h3>
                <p style="font-size:0.85rem; color:var(--text-muted); line-height:1.4; margin-bottom:1rem;">${r.description}</p>
                <div style="font-size:0.75rem; color:var(--text-light); margin-bottom:1rem;">
                  Includes ${r.question_ids ? r.question_ids.length : 3} structured interview prompts
                </div>
                <button class="btn btn-primary btn-sm start-mock-btn" data-round-id="${r.id}" style="width:100%;">
                  Begin Structured Round →
                </button>
              </div>
            `).join('')}
          </div>
        `;
      }

      const filtered = getFilteredQuestions();
      if (!filtered.includes(activeQ)) {
        activeQ = filtered[0] || null;
      }

      return `
        <div class="interview-grid">
          <div>
            <div style="font-weight:700; font-size:0.85rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.75rem;">
              Question Vault (${filtered.length})
            </div>
            ${filtered.map((q, idx) => `
              <div class="interview-question-item ${activeQ && activeQ.id === q.id ? 'active' : ''}" data-qid="${q.id}">
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                  <span class="badge badge-blue" style="font-size:0.7rem;">${q.category}</span>
                  <span style="font-size:0.7rem; color:var(--text-light);">${q.difficulty}</span>
                </div>
                <div style="font-size:0.85rem; font-weight:600;">${isHi && q.question_hi ? q.question_hi : q.question_en}</div>
              </div>
            `).join('')}
          </div>

          <div id="interview-workbench">
            ${this.renderInterviewWorkbench(activeQ, isHi)}
          </div>
        </div>
      `;
    };

    container.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('navInterview')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">
          Comprehensive entry-level to senior preparation: Technical SQL/Python/Excel, Business Case Studies, Portfolio Defense, STAR behavioral responses, and Reverse Questions.
        </p>
      </div>

      <div id="stage-tabs-container">
        ${renderStageTabs()}
      </div>

      <div id="interview-content-container">
        ${renderMainContent()}
      </div>
    `;

    const bindAllEvents = () => {
      // Stage tab switching
      document.querySelectorAll('#stage-tabs-container .filter-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          activeFilter = e.currentTarget.dataset.filter;
          document.getElementById('stage-tabs-container').innerHTML = renderStageTabs();
          document.getElementById('interview-content-container').innerHTML = renderMainContent();
          bindAllEvents();
        });
      });

      // Question selecting
      document.querySelectorAll('.interview-question-item').forEach(item => {
        item.addEventListener('click', (e) => {
          document.querySelectorAll('.interview-question-item').forEach(i => i.classList.remove('active'));
          e.currentTarget.classList.add('active');
          activeQ = allQuestions.find(q => q.id === e.currentTarget.dataset.qid);
          const wb = document.getElementById('interview-workbench');
          if (wb) {
            wb.innerHTML = this.renderInterviewWorkbench(activeQ, isHi);
            this.bindInterviewWorkbenchEvents(activeQ, isHi);
          }
        });
      });

      // Start mock round buttons
      document.querySelectorAll('.start-mock-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const roundId = e.currentTarget.dataset.roundId;
          const selectedRound = mockRounds.find(r => r.id === roundId);
          if (selectedRound && selectedRound.question_ids && selectedRound.question_ids.length > 0) {
            activeFilter = 'All';
            const firstQ = allQuestions.find(q => q.id === selectedRound.question_ids[0]);
            if (firstQ) activeQ = firstQ;
            document.getElementById('stage-tabs-container').innerHTML = renderStageTabs();
            document.getElementById('interview-content-container').innerHTML = renderMainContent();
            bindAllEvents();
          }
        });
      });

      this.bindInterviewWorkbenchEvents(activeQ, isHi);
    };

    bindAllEvents();
  },

  renderInterviewWorkbench(q, isHi) {
    if (!q) return `<div class="card" style="color:var(--text-muted);">Select a question from the vault.</div>`;
    const answerStructure = q.answer_structure || [];
    const commonPitfalls = q.common_pitfalls || [];

    return `
      <div class="card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem; flex-wrap:wrap; gap:0.5rem;">
          <div style="display:flex; gap:0.4rem; align-items:center;">
            <span class="badge badge-blue">${q.category}</span>
            ${q.sub_category ? `<span class="badge badge-slate">${q.sub_category}</span>` : ''}
            <span class="badge badge-green">${q.stage || 'Technical Screen'}</span>
          </div>
          <span style="font-size:0.75rem; color:var(--text-light);">${q.difficulty} • ${q.role_type || 'Junior Data Analyst'}</span>
        </div>

        <h2 style="font-size:1.25rem; font-weight:800; margin-bottom:0.75rem; color:var(--text-main);">
          ${isHi && q.question_hi ? q.question_hi : q.question_en}
        </h2>

        ${q.skill_assessed ? `
          <div style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">
            🎯 <strong>Skill Assessed:</strong> ${q.skill_assessed}
          </div>
        ` : ''}

        <!-- Recommended Answer Structure Checklist -->
        ${answerStructure.length > 0 ? `
          <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:6px; padding:0.85rem 1rem; margin-bottom:1rem;">
            <div style="font-size:0.82rem; font-weight:700; color:var(--text-main); margin-bottom:0.4rem;">
              📋 Recommended Answer Structure:
            </div>
            <ul style="margin:0; padding-left:1.2rem; font-size:0.8rem; color:var(--text-muted); line-height:1.4;">
              ${answerStructure.map(step => `<li>${step}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Self-Rating Rubric Checkboxes -->
        <div style="margin-bottom:0.75rem;">
          <div style="font-size:0.8rem; font-weight:700; color:var(--text-muted); text-transform:uppercase; margin-bottom:0.35rem;">
            Self-Evaluation Checklist (Select as you incorporate):
          </div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.35rem;">
            <label class="rubric-checkbox-item">
              <input type="checkbox" id="rubric-chk-clarify">
              <span>Clarified business goal & context</span>
            </label>
            <label class="rubric-checkbox-item">
              <input type="checkbox" id="rubric-chk-structure">
              <span>Logical structure (STAR / Step-by-Step)</span>
            </label>
            <label class="rubric-checkbox-item">
              <input type="checkbox" id="rubric-chk-edgecases">
              <span>Addressed data validation & edge cases</span>
            </label>
            <label class="rubric-checkbox-item">
              <input type="checkbox" id="rubric-chk-impact">
              <span>Stated measurable business impact / ROI</span>
            </label>
          </div>
        </div>

        <!-- Answer Input -->
        <div style="position:relative; margin-bottom:1rem;">
          <textarea id="interview-user-answer" style="width:100%; min-height:140px; padding:0.75rem; border-radius:6px; border:1px solid var(--border); font-size:0.88rem; line-height:1.5;" placeholder="Type your structured answer here... (Tip: include technical reasoning and metric changes)"></textarea>
          <div id="word-count-display" style="position:absolute; bottom:8px; right:12px; font-size:0.75rem; color:var(--text-light);">0 words</div>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
          <div style="display:flex; gap:0.5rem;">
            <button id="submit-interview-answer-btn" class="btn btn-primary">
              Evaluate with AI Rubric (+30 XP)
            </button>
            <button id="toggle-model-answer-btn" class="btn btn-secondary">
              View Model Answer
            </button>
          </div>
          <div class="ai-disclaimer-tag">
            ℹ️ AI-Assisted Evaluation (Simulated Interview Rubric)
          </div>
        </div>

        <!-- Evaluation Results Display -->
        <div id="interview-eval-result" style="display:none; margin-top:1.25rem;"></div>

        <!-- Common Pitfalls Box -->
        ${commonPitfalls.length > 0 ? `
          <div class="pitfalls-container" id="pitfalls-container" style="display:none;">
            <strong>⚠️ Common Interview Traps & Pitfalls:</strong>
            <ul style="margin:0.35rem 0 0 1.2rem; padding:0;">
              ${commonPitfalls.map(p => `<li>${p}</li>`).join('')}
            </ul>
          </div>
        ` : ''}

        <!-- Model Answer Box -->
        <div id="model-answer-container" style="display:none; margin-top:1.25rem; padding:1.25rem; background:var(--bg-surface); border-radius:6px; border:1px solid var(--border);">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h4 style="font-weight:700; color:var(--text-main);">🌟 Model Interview Answer (${isHi ? 'Hindi / Hinglish' : 'English'})</h4>
            <span style="font-size:0.75rem; color:var(--text-light);">Reference benchmark</span>
          </div>
          <div class="prose" style="font-size:0.88rem;">
            ${Tutor.formatMarkdown(isHi && q.model_answer_hi ? q.model_answer_hi : q.model_answer_en)}
          </div>
        </div>
      </div>
    `;
  },

  bindInterviewWorkbenchEvents(q, isHi) {
    if (!q) return;
    const submitBtn = document.getElementById('submit-interview-answer-btn');
    const toggleBtn = document.getElementById('toggle-model-answer-btn');
    const modelBox = document.getElementById('model-answer-container');
    const pitfallsBox = document.getElementById('pitfalls-container');
    const evalResult = document.getElementById('interview-eval-result');
    const textarea = document.getElementById('interview-user-answer');
    const wordCountSpan = document.getElementById('word-count-display');

    if (textarea && wordCountSpan) {
      textarea.addEventListener('input', () => {
        const words = textarea.value.trim().split(/\s+/).filter(Boolean).length;
        wordCountSpan.textContent = `${words} words`;
      });
    }

    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isHidden = modelBox.style.display === 'none';
        modelBox.style.display = isHidden ? 'block' : 'none';
        if (pitfallsBox) pitfallsBox.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? 'Hide Model Answer' : 'View Model Answer';
      });
    }

    if (submitBtn) {
      submitBtn.addEventListener('click', async () => {
        const txt = textarea ? textarea.value : '';
        if (!txt.trim()) {
          alert('Please enter your answer before evaluating.');
          return;
        }

        const selfRatings = [
          document.getElementById('rubric-chk-clarify')?.checked || false,
          document.getElementById('rubric-chk-structure')?.checked || false,
          document.getElementById('rubric-chk-edgecases')?.checked || false,
          document.getElementById('rubric-chk-impact')?.checked || false
        ];

        try {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Evaluating...';
          const res = await API.evaluateInterviewAnswer(q.id, {
            answer: txt,
            self_ratings: selfRatings,
            language: State.language
          });

          evalResult.style.display = 'block';
          evalResult.innerHTML = `
            <div style="background:var(--primary-light); padding:1.25rem; border-radius:6px; border:1px solid var(--border-focus);">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
                <span style="font-weight:700; color:var(--primary); font-size:1rem;">
                  AI Rubric Feedback (Score: ${res.score}/10)
                </span>
                <span class="badge ${res.score >= 7 ? 'badge-green' : 'badge-slate'}">
                  ${res.score >= 7 ? 'Interview Ready' : 'Needs Polish'}
                </span>
              </div>
              <p style="font-size:0.88rem; line-height:1.5; color:var(--text-main); margin-bottom:0.5rem;">
                ${res.feedback}
              </p>
              <div style="font-size:0.75rem; color:var(--text-muted); font-style:italic;">
                ${res.disclaimer || 'AI-Assisted Evaluation (Simulated Interview Rubric) — verify with industry benchmarks and standard interview rubrics.'}
              </div>
            </div>
          `;

          // Reveal model answer and traps automatically on submission
          if (modelBox) modelBox.style.display = 'block';
          if (pitfallsBox) pitfallsBox.style.display = 'block';
          if (toggleBtn) toggleBtn.textContent = 'Hide Model Answer';

          submitBtn.disabled = false;
          submitBtn.textContent = 'Re-evaluate Answer (+30 XP)';
        } catch (err) {
          alert('Evaluation error: ' + err.message);
          submitBtn.disabled = false;
          submitBtn.textContent = 'Evaluate with AI Rubric';
        }
      });
    }
  },

  async renderProjects(container) {
    const isHi = State.language === 'hinglish';
    let projects = [];
    try {
      const res = await API.getProjects();
      projects = res.projects || [];
    } catch (e) {}

    container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('navProjects')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">Guided capstone projects with datasets, rubrics, and recruiter-ready README generators.</p>
      </div>

      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(340px, 1fr)); gap:1.5rem;">
        ${projects.map(p => `
          <div class="card" style="display:flex; flex-direction:column;">
            <span class="badge badge-blue" style="align-self:flex-start; margin-bottom:0.5rem;">${p.difficulty}</span>
            <h3 class="card-title">${isHi ? p.title_hi : p.title}</h3>
            <p class="card-desc" style="margin-bottom:1rem;">${isHi ? p.scenario_hi : p.scenario_en}</p>
            <div style="margin-top:auto; padding-top:1rem; border-top:1px solid var(--border); display:flex; justify-content:space-between; align-items:center;">
              <span class="badge ${p.userStatus === 'submitted' ? 'badge-green' : 'badge-slate'}">${p.userStatus === 'submitted' ? '✓ Submitted' : 'Ready'}</span>
              <a href="#project/${p.id}" class="btn btn-primary btn-sm">View Project →</a>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  async renderProjectDetail(container, projectId) {
    const isHi = State.language === 'hinglish';
    let data = null;
    try {
      data = await API.getProject(projectId);
    } catch (e) {
      container.innerHTML = `<div class="card" style="color:red;">Project not found: ${e.message}</div>`;
      return;
    }

    const { project, userNotes } = data;

    container.innerHTML = `
      <div class="lesson-top-bar">
        <div class="lesson-breadcrumbs">
          <a href="#projects">← Projects</a>
          <span>/</span>
          <span>${isHi ? project.title_hi : project.title}</span>
        </div>
      </div>

      <div class="card" style="margin-bottom:2rem;">
        <h1 style="font-size:1.85rem; font-weight:800; margin-bottom:0.5rem;">${isHi ? project.title_hi : project.title}</h1>
        <p style="font-size:0.95rem; color:var(--text-muted); margin-bottom:1.5rem;">${isHi ? project.scenario_hi : project.scenario_en}</p>

        <!-- Datasets -->
        <div style="background:var(--bg-surface); padding:1rem; border-radius:6px; display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem;">
          <div><strong>📁 Dataset:</strong> ${project.dataset_name}</div>
          <div style="display:flex; gap:0.5rem;">
            <a href="/api/datasets/orders.csv" class="btn btn-secondary btn-sm" download>📥 orders.csv</a>
            <a href="/api/datasets/customers.csv" class="btn btn-secondary btn-sm" download>📥 customers.csv</a>
          </div>
        </div>

        <h3 class="card-title">Milestone Checkpoints</h3>
        <div class="project-steps-timeline">
          ${project.steps.map(s => `
            <div class="step-item">
              <div class="step-number">${s.step_num}</div>
              <div><strong>${s.title}</strong><div style="font-size:0.85rem; color:var(--text-muted);">${s.desc}</div></div>
            </div>
          `).join('')}
        </div>

        <!-- README Generator -->
        <div style="margin-top:2rem; background:#0f172a; color:#f8fafc; padding:1.25rem; border-radius:8px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <div style="font-weight:700; color:#38bdf8;">📄 Recruiter-Ready GitHub README Template</div>
            <button id="copy-readme-btn" class="btn btn-secondary btn-sm" style="background:#1e293b; color:white;">Copy</button>
          </div>
          <pre style="background:#090d16; padding:0.75rem; border-radius:4px; font-size:0.8rem; overflow-x:auto;">${project.portfolio_template}</pre>
        </div>

        <!-- Submit -->
        <div style="margin-top:2rem; border-top:1px solid var(--border); padding-top:1.5rem;">
          <h3 class="card-title">Submit Project Deliverables</h3>
          <textarea id="project-submission-notes" style="width:100%; min-height:80px; padding:0.6rem; border-radius:6px; border:1px solid var(--border);" placeholder="GitHub repository URL or summary...">${userNotes || ''}</textarea>
          <button id="submit-project-btn" class="btn btn-primary" style="margin-top:0.75rem;">🚀 Submit & Notify Squad</button>
        </div>
      </div>
    `;

    document.getElementById('copy-readme-btn').addEventListener('click', () => {
      navigator.clipboard.writeText(project.portfolio_template);
      alert('README template copied to clipboard!');
    });

    document.getElementById('submit-project-btn').addEventListener('click', async () => {
      const notes = document.getElementById('project-submission-notes').value;
      const res = await API.submitProject(project.id, notes);
      alert(res.message);
      Router.navigate('projects');
    });
  },

  async renderSchedule(container) {
    const isHi = State.language === 'hinglish';
    let schedule = [];
    try {
      const res = await API.getSchedule();
      schedule = res.schedule || [];
    } catch (e) {
      console.warn("Schedule load error:", e);
    }

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:1rem;">
        <div>
          <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.25rem;">${State.t('navSchedule')}</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">Personalized editable study timetable. Balance your study days, reschedule missed sessions, and add custom tasks.</p>
        </div>
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
          <button id="add-custom-task-btn" class="btn btn-primary btn-sm">➕ Add Custom Task</button>
          <button id="recalculate-plan-btn" class="btn btn-secondary btn-sm">⚖️ Rebalance Plan</button>
          <button id="bulk-move-btn" class="btn btn-secondary btn-sm">⏩ Bulk Shift Tasks</button>
        </div>
      </div>

      <div class="reschedule-banner">
        <div>
          <div style="font-weight:700; color:#1e40af;">🗓️ ${State.t('rescheduleAlert')}</div>
          <div style="font-size:0.8rem; color:#3b82f6;">Life happens! Calmly push overdue sessions forward into upcoming open study days.</div>
        </div>
        <button id="reschedule-sched-btn" class="btn btn-primary btn-sm">🔄 ${State.t('rescheduleBtn')}</button>
      </div>

      <div class="timetable-grid">
        ${schedule.map(task => `
          <div class="day-card ${task.is_completed ? 'completed' : ''}" data-task-id="${task.id}">
            <div class="day-header">
              <span>${task.day_name} (${task.date_str})</span>
              <div style="display:flex; align-items:center; gap:0.35rem;">
                <span class="badge ${task.is_completed ? 'badge-green' : 'badge-slate'}">${task.is_completed ? 'Done' : `${task.duration_minutes} min`}</span>
                <button class="btn btn-secondary btn-sm delete-task-btn" data-task-id="${task.id}" style="padding:2px 6px; font-size:0.75rem;" title="Delete task">🗑️</button>
              </div>
            </div>
            <div class="task-item ${task.is_completed ? 'completed' : ''}">
              <input type="checkbox" class="task-checkbox" data-task-id="${task.id}" ${task.is_completed ? 'checked' : ''}>
              <span style="flex:1;">${isHi && task.task_title_hi ? task.task_title_hi : task.task_title}</span>
            </div>
            ${task.notes ? `<div style="font-size:0.75rem; color:var(--text-light); margin-top:0.25rem;">📝 ${task.notes}</div>` : ''}
          </div>
        `).join('')}
        ${schedule.length === 0 ? `<div class="card" style="grid-column: 1/-1; text-align:center; color:var(--text-muted);">No study tasks scheduled yet. Click 'Rebalance Plan' to generate your initial timetable.</div>` : ''}
      </div>

      <!-- Add Task Modal Placeholder -->
      <div id="schedule-modal-container"></div>
    `;

    // Reschedule Overdue
    document.getElementById('reschedule-sched-btn')?.addEventListener('click', async () => {
      const res = await API.rescheduleMissed();
      alert(res.message);
      this.renderCurrentView();
    });

    // Checkbox toggles
    document.querySelectorAll('.task-checkbox').forEach(box => {
      box.addEventListener('change', async (e) => {
        await API.toggleTask(e.target.dataset.taskId);
        const parentCard = e.target.closest('.day-card');
        if (parentCard) parentCard.classList.toggle('completed', e.target.checked);
      });
    });

    // Delete task buttons
    document.querySelectorAll('.delete-task-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const taskId = e.currentTarget.dataset.taskId;
        if (confirm('Are you sure you want to remove this study task?')) {
          await API.deleteScheduleTask(taskId);
          this.renderCurrentView();
        }
      });
    });

    // Add Custom Task Modal
    document.getElementById('add-custom-task-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('schedule-modal-container');
      const todayStr = new Date().toISOString().split('T')[0];
      modal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content-card">
            <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:1rem;">Add Custom Study Task</h3>
            <div style="margin-bottom:0.75rem;">
              <label style="font-size:0.8rem; font-weight:700;">Task Title:</label>
              <input type="text" id="modal-task-title" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px;" placeholder="e.g. Revise SQL Window Functions">
            </div>
            <div style="margin-bottom:0.75rem;">
              <label style="font-size:0.8rem; font-weight:700;">Date:</label>
              <input type="date" id="modal-task-date" value="${todayStr}" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px;">
            </div>
            <div style="margin-bottom:0.75rem;">
              <label style="font-size:0.8rem; font-weight:700;">Duration (minutes):</label>
              <input type="number" id="modal-task-duration" value="30" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px;">
            </div>
            <div style="margin-bottom:1.25rem;">
              <label style="font-size:0.8rem; font-weight:700;">Notes (Optional):</label>
              <input type="text" id="modal-task-notes" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px;" placeholder="e.g. Focus on DENSE_RANK() examples">
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <button id="modal-cancel-btn" class="btn btn-secondary btn-sm">Cancel</button>
              <button id="modal-save-task-btn" class="btn btn-primary btn-sm">Save Task</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('modal-cancel-btn').addEventListener('click', () => { modal.innerHTML = ''; });
      document.getElementById('modal-save-task-btn').addEventListener('click', async () => {
        const title = document.getElementById('modal-task-title').value.trim();
        const dateStr = document.getElementById('modal-task-date').value;
        const dur = Number(document.getElementById('modal-task-duration').value) || 30;
        const notes = document.getElementById('modal-task-notes').value.trim();
        if (!title || !dateStr) {
          alert('Please enter task title and date');
          return;
        }
        await API.addScheduleTask({
          task_title: title,
          date_str: dateStr,
          duration_minutes: dur,
          task_type: 'custom',
          notes
        });
        modal.innerHTML = '';
        this.renderCurrentView();
      });
    });

    // Rebalance Plan Modal
    document.getElementById('recalculate-plan-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('schedule-modal-container');
      modal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content-card">
            <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:0.5rem;">Rebalance Study Plan</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Adjust your available hours per week. Your upcoming timetable will be re-distributed smoothly.</p>
            <div style="margin-bottom:1.25rem;">
              <label style="font-size:0.85rem; font-weight:700;">Hours Available Per Week:</label>
              <select id="modal-rebalance-hours" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:0.35rem;">
                <option value="5">5 hours / week (Casual / Working Professional)</option>
                <option value="10" selected>10 hours / week (Steady Progression - Recommended)</option>
                <option value="15">15 hours / week (Accelerated Bootcamp)</option>
                <option value="20">20 hours / week (Full-Time Immersion)</option>
              </select>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <button id="modal-cancel-rebal-btn" class="btn btn-secondary btn-sm">Cancel</button>
              <button id="modal-confirm-rebal-btn" class="btn btn-primary btn-sm">Confirm & Recalculate</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('modal-cancel-rebal-btn').addEventListener('click', () => { modal.innerHTML = ''; });
      document.getElementById('modal-confirm-rebal-btn').addEventListener('click', async () => {
        const hrs = Number(document.getElementById('modal-rebalance-hours').value);
        await API.recalculateSchedule({ hours_per_week: hrs });
        modal.innerHTML = '';
        alert(`Study plan successfully updated to ${hrs} hours/week!`);
        this.renderCurrentView();
      });
    });

    // Bulk Shift Tasks Modal
    document.getElementById('bulk-move-btn')?.addEventListener('click', () => {
      const modal = document.getElementById('schedule-modal-container');
      modal.innerHTML = `
        <div class="modal-overlay">
          <div class="modal-content-card">
            <h3 style="font-size:1.2rem; font-weight:800; margin-bottom:0.5rem;">Bulk Shift Incomplete Tasks</h3>
            <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Took a break? Push all pending incomplete tasks forward without losing your roadmap.</p>
            <div style="margin-bottom:1.25rem;">
              <label style="font-size:0.85rem; font-weight:700;">Shift Forward By:</label>
              <select id="modal-shift-days" style="width:100%; padding:0.5rem; border:1px solid var(--border); border-radius:4px; margin-top:0.35rem;">
                <option value="1">1 Day</option>
                <option value="2">2 Days</option>
                <option value="3">3 Days</option>
                <option value="7" selected>7 Days (1 Week)</option>
                <option value="14">14 Days (2 Weeks)</option>
              </select>
            </div>
            <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
              <button id="modal-cancel-shift-btn" class="btn btn-secondary btn-sm">Cancel</button>
              <button id="modal-confirm-shift-btn" class="btn btn-primary btn-sm">Apply Shift</button>
            </div>
          </div>
        </div>
      `;

      document.getElementById('modal-cancel-shift-btn').addEventListener('click', () => { modal.innerHTML = ''; });
      document.getElementById('modal-confirm-shift-btn').addEventListener('click', async () => {
        const days = Number(document.getElementById('modal-shift-days').value);
        const res = await API.bulkMoveSchedule({ days_shift: days });
        modal.innerHTML = '';
        alert(res.message);
        this.renderCurrentView();
      });
    });
  },

  async renderSkillGapReport(container) {
    let analytics = null;
    try {
      analytics = await API.getWeakAreaAnalytics();
    } catch (e) {
      console.warn("Weak area analytics load error:", e);
    }

    const { formulaExplanation, overallReadinessScore, strong = [], improving = [], needsPractice = [], recommendedLessons = [] } = analytics || {};

    container.innerHTML = `
      <div style="margin-bottom:1.5rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.25rem;">${State.t('navReport')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">Multi-attempt weighted performance analysis across all quizzes, lesson tests, and practical exercises.</p>
      </div>

      <!-- Transparent Formula Explainer -->
      <div class="formula-explainer-pill">
        ℹ️ <strong>Calculation Methodology:</strong> ${formulaExplanation || 'Your topic scores are derived from a recency-weighted exponential moving average across all quiz attempts, end-of-lesson tests, and practice questions. Your most recent attempt carries 50% weight, with older attempts discounted to accurately capture your current retention.'}
      </div>

      <!-- Overall Job Readiness Card -->
      <div class="card" style="background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:white; margin-bottom:2rem; border:1px solid #334155;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <span class="badge badge-blue" style="margin-bottom:0.5rem;">Job Readiness Score</span>
            <h2 style="font-size:2.25rem; font-weight:800; margin:0.25rem 0;">${overallReadinessScore || 70}% Ready for Junior Analyst Roles</h2>
            <p style="color:#cbd5e1; font-size:0.85rem; margin:0;">Weighted across SQL queries, Python data wrangling, Excel modeling, and interview assessments.</p>
          </div>
          <div style="font-size:0.75rem; color:#94a3b8; background:rgba(255,255,255,0.06); padding:0.5rem 0.85rem; border-radius:6px; border:1px solid rgba(255,255,255,0.1);">
            🔒 Strictly Private to your account
          </div>
        </div>
      </div>

      <!-- 3-Column Categorization Grid -->
      <div class="mastery-columns-grid">
        <!-- Strong Topics -->
        <div class="mastery-col-card strong">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">🟢 Strong (≥80%)</h3>
            <span class="badge badge-green">${strong.length} Topics</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Concepts mastered with high confidence and accuracy across multiple attempts.</p>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${strong.map(s => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:0.5rem 0.75rem; border-radius:6px;">
                <span style="font-size:0.85rem; font-weight:600;">${s.topic}</span>
                <span style="font-size:0.8rem; font-weight:700; color:var(--success);">${s.weightedScore}%</span>
              </div>
            `).join('')}
            ${strong.length === 0 ? `<div style="font-size:0.85rem; color:var(--text-light); text-align:center; padding:1rem 0;">Complete quizzes and lesson tests to build your strong topics vault!</div>` : ''}
          </div>
        </div>

        <!-- Improving Topics -->
        <div class="mastery-col-card improving">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">🟡 Improving (60-79%)</h3>
            <span class="badge badge-blue">${improving.length} Topics</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Topics progressing steadily. Recommended for periodic review before technical screens.</p>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${improving.map(imp => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:0.5rem 0.75rem; border-radius:6px;">
                <span style="font-size:0.85rem; font-weight:600;">${imp.topic}</span>
                <span style="font-size:0.8rem; font-weight:700; color:#d97706;">${imp.weightedScore}%</span>
              </div>
            `).join('')}
            ${improving.length === 0 ? `<div style="font-size:0.85rem; color:var(--text-light); text-align:center; padding:1rem 0;">No topics in the improving zone.</div>` : ''}
          </div>
        </div>

        <!-- Needs Practice Topics -->
        <div class="mastery-col-card needs-practice">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem;">
            <h3 style="font-size:1.1rem; font-weight:800; color:var(--text-main);">🔴 Needs Practice (&lt;60%)</h3>
            <span class="badge badge-slate" style="color:var(--danger); border-color:#fca5a5;">${needsPractice.length} Topics</span>
          </div>
          <p style="font-size:0.8rem; color:var(--text-muted); margin-bottom:1rem;">Priority revision needed. Practice recommended to address knowledge gaps.</p>
          <div style="display:flex; flex-direction:column; gap:0.5rem;">
            ${needsPractice.map(np => `
              <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:0.5rem 0.75rem; border-radius:6px;">
                <div>
                  <div style="font-size:0.85rem; font-weight:600;">${np.topic}</div>
                  <div style="font-size:0.72rem; color:var(--text-light);">${np.attemptsCount} attempt(s)</div>
                </div>
                <span style="font-size:0.8rem; font-weight:700; color:var(--danger);">${np.weightedScore}%</span>
              </div>
            `).join('')}
            ${needsPractice.length === 0 ? `<div style="font-size:0.85rem; color:var(--success); text-align:center; padding:1rem 0;">Zero pending weak areas! Excellent work.</div>` : ''}
          </div>
        </div>
      </div>

      <!-- Targeted Revision Launcher -->
      ${recommendedLessons.length > 0 ? `
        <div class="card" style="margin-top:2rem;">
          <h3 style="font-size:1.15rem; font-weight:800; margin-bottom:0.5rem;">🚀 Recommended Revision Lessons</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">Direct 1-click links to lessons that will help you master your current weak topics:</p>
          <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(260px, 1fr)); gap:1rem;">
            ${recommendedLessons.map(rl => `
              <div style="background:var(--bg-surface); border:1px solid var(--border); border-radius:6px; padding:1rem; display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                  <div style="font-size:0.75rem; color:var(--text-light); text-transform:uppercase;">${rl.course_id}</div>
                  <div style="font-weight:700; font-size:0.95rem; margin:0.25rem 0;">${rl.title}</div>
                  <div style="font-size:0.8rem; color:var(--text-muted);">⏱️ ${rl.estimated_minutes} min</div>
                </div>
                <a href="#lesson/${rl.id}" class="btn btn-primary btn-sm" style="margin-top:0.75rem; text-align:center;">Launch Revision Lesson →</a>
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  },

  async renderSettings(container) {
    const user = State.user || {};
    let blockedUsers = [];
    try {
      const res = await API.getBlockedUsers();
      blockedUsers = res.blocked_users || [];
    } catch (e) {}

    container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('navSettings')}</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">Manage your goals, preferred language, and private account settings.</p>
      </div>

      <div style="display:flex; flex-direction:column; gap:2rem; max-width:680px;">
        <!-- Profile Card -->
        <div class="card">
          <h3 class="card-title">Profile Preferences</h3>
          <form id="settings-form">
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Full Name</label>
              <input type="text" name="name" value="${user.name || ''}" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border);">
            </div>
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Email Address</label>
              <input type="email" value="${user.email || ''}" disabled style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border); background:var(--bg-surface);">
            </div>
            <div style="margin-bottom:1rem;">
              <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Default Learning Language</label>
              <select name="preferred_language" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border);">
                <option value="hinglish" ${State.language === 'hinglish' ? 'selected' : ''}>🇮🇳 Hinglish</option>
                <option value="en" ${State.language === 'en' ? 'selected' : ''}>🌐 English</option>
              </select>
            </div>
            <button type="submit" class="btn btn-primary">Save Profile</button>
          </form>
        </div>

        <!-- Privacy & GDPR Data Protection Card -->
        <div class="card">
          <h3 class="card-title">🔒 Privacy & Data Portability (GDPR / CCPA)</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1.25rem;">
            Your personal notes, quiz answers, study schedules, and partner chats are strictly confidential and stored securely under your account. You have full ownership and right of portability over your data.
          </p>

          <div style="display:flex; flex-direction:column; gap:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-surface); padding:1rem; border-radius:6px; border:1px solid var(--border);">
              <div>
                <div style="font-weight:700; font-size:0.9rem;">Download All Account Data (JSON)</div>
                <div style="font-size:0.8rem; color:var(--text-muted);">Export your profile, study progress, private notes, and submissions in a machine-readable format.</div>
              </div>
              <button id="export-data-btn" class="btn btn-secondary btn-sm" style="white-space:nowrap;">
                📥 Export JSON
              </button>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:#fef2f2; padding:1rem; border-radius:6px; border:1px solid #fecaca;">
              <div>
                <div style="font-weight:700; font-size:0.9rem; color:#991b1b;">Delete Account & All Data</div>
                <div style="font-size:0.8rem; color:#b91c1c;">Permanently erase your account, notes, schedule, answers, and study squad links. This cannot be undone.</div>
              </div>
              <button id="delete-account-btn" class="btn btn-secondary btn-sm" style="color:var(--danger); border-color:#fca5a5; white-space:nowrap;">
                🗑️ Delete Account
              </button>
            </div>
          </div>
        </div>

        <!-- Blocked Users Card -->
        <div class="card">
          <h3 class="card-title">🛡️ Blocked Users & Safety</h3>
          <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
            Blocked users cannot send you study group messages or initiate video/voice calls.
          </p>
          <div id="blocked-users-list">
            ${blockedUsers.length === 0 ? `
              <div style="color:var(--text-muted); font-size:0.85rem; padding:0.5rem 0;">You have not blocked any users.</div>
            ` : `
              <table class="admin-table">
                <thead>
                  <tr>
                    <th>User ID</th>
                    <th>Reason</th>
                    <th>Blocked At</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  ${blockedUsers.map(b => `
                    <tr>
                      <td><code>${b.blocked_user_id}</code></td>
                      <td>${b.reason || 'None specified'}</td>
                      <td>${new Date(b.created_at).toLocaleDateString()}</td>
                      <td>
                        <button class="btn btn-secondary btn-sm unblock-btn" data-user-id="${b.blocked_user_id}" style="padding:2px 8px; font-size:0.75rem;">
                          Unblock
                        </button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            `}
          </div>
        </div>
      </div>
    `;

    // Form submission
    document.getElementById('settings-form').addEventListener('submit', (e) => {
      e.preventDefault();
      State.setLanguage(e.target.preferred_language.value);
      alert('Settings saved!');
    });

    // Export Data
    document.getElementById('export-data-btn').addEventListener('click', async () => {
      try {
        const data = await API.exportUserData();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `analystpath-export-${user.id || 'user'}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (err) {
        alert('Failed to export data: ' + err.message);
      }
    });

    // Delete Account
    document.getElementById('delete-account-btn').addEventListener('click', async () => {
      const confirmText = prompt('WARNING: This will permanently delete your account, private notes, study timetable, progress, and study squads.\n\nType DELETE to confirm:');
      if (confirmText === 'DELETE') {
        try {
          await API.deleteUserAccount();
          alert('Your account and personal data have been completely erased. You have been signed out.');
          State.setUser(null);
          Router.navigate('welcome');
        } catch (err) {
          alert('Failed to delete account: ' + err.message);
        }
      } else if (confirmText !== null) {
        alert('Account deletion canceled. Confirmation text did not match "DELETE".');
      }
    });

    // Unblock handlers
    document.querySelectorAll('.unblock-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const uId = btn.dataset.userId;
        try {
          await API.unblockUser(uId);
          alert('User unblocked.');
          this.renderSettings(container);
        } catch (err) {
          alert('Failed to unblock: ' + err.message);
        }
      });
    });
  },

  // -----------------------------------------------------------
  // 11. PRACTICE QUESTION BANK (MCQ, CODING, WEAK AREAS)
  // -----------------------------------------------------------
  async renderQuestionBank(container) {
    const isHi = State.language === 'hinglish';
    let questions = [];
    let activeTab = 'all';
    let currentFilters = { course: '', difficulty: '', search: '' };

    const loadAndRender = async () => {
      container.innerHTML = `
        <div style="margin-bottom:1.5rem;">
          <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">${State.t('navQuestionBank')}</h1>
          <p style="color:var(--text-muted); font-size:0.95rem;">Curated practice question bank with real-world scenarios, interactive hints, model solutions, and rubric guidelines.</p>
        </div>

        <div class="card" style="margin-bottom:1.5rem; padding:1.25rem;">
          <div style="display:flex; flex-wrap:wrap; gap:1rem; align-items:center; justify-content:space-between; margin-bottom:1rem;">
            <div style="display:flex; gap:0.5rem;">
              <button class="filter-btn ${activeTab === 'all' ? 'active' : ''}" id="qb-tab-all">📚 All Practice Questions</button>
              <button class="filter-btn ${activeTab === 'weak' ? 'active' : ''}" id="qb-tab-weak">⚡ Weak Areas to Review</button>
            </div>
            <div style="display:flex; gap:0.5rem; flex:1; max-width:350px;">
              <input type="text" id="qb-search-input" placeholder="Search questions..." value="${currentFilters.search}" style="width:100%; padding:0.5rem 0.75rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;">
            </div>
          </div>

          <div style="display:flex; flex-wrap:wrap; gap:0.75rem; align-items:center;">
            <select id="qb-course-filter" style="padding:0.4rem 0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;">
              <option value="">All Subjects</option>
              <option value="setup" ${currentFilters.course === 'setup' ? 'selected' : ''}>Computer & Environment Setup</option>
              <option value="excel" ${currentFilters.course === 'excel' ? 'selected' : ''}>Microsoft Excel & Formulas</option>
              <option value="sql" ${currentFilters.course === 'sql' ? 'selected' : ''}>SQL & Database Queries</option>
              <option value="python" ${currentFilters.course === 'python' ? 'selected' : ''}>Python & Pandas</option>
              <option value="bi-tools" ${currentFilters.course === 'bi-tools' ? 'selected' : ''}>Power BI & Tableau</option>
              <option value="business-analysis" ${currentFilters.course === 'business-analysis' ? 'selected' : ''}>Business Analysis & Requirements</option>
              <option value="stats-prob" ${currentFilters.course === 'stats-prob' ? 'selected' : ''}>Statistics & Probability</option>
              <option value="data-cleaning" ${currentFilters.course === 'data-cleaning' ? 'selected' : ''}>Data Cleaning & Quality</option>
            </select>

            <select id="qb-diff-filter" style="padding:0.4rem 0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;">
              <option value="">All Difficulties</option>
              <option value="beginner" ${currentFilters.difficulty === 'beginner' ? 'selected' : ''}>Beginner</option>
              <option value="intermediate" ${currentFilters.difficulty === 'intermediate' ? 'selected' : ''}>Intermediate</option>
              <option value="advanced" ${currentFilters.difficulty === 'advanced' ? 'selected' : ''}>Advanced</option>
            </select>
          </div>
        </div>

        <div id="qb-list-area">
          <div style="text-align:center; padding:2rem; color:var(--text-muted);">Loading questions...</div>
        </div>
      `;

      try {
        if (activeTab === 'weak') {
          const res = await API.getWeakQuestions();
          questions = res.questions || [];
        } else {
          const queryParams = {};
          if (currentFilters.course) queryParams.course = currentFilters.course;
          if (currentFilters.difficulty) queryParams.difficulty = currentFilters.difficulty;
          const res = await API.getQuestions(queryParams);
          questions = res.questions || [];
        }
      } catch (err) {
        document.getElementById('qb-list-area').innerHTML = `<div class="card" style="color:var(--danger);">Error loading questions: ${err.message}</div>`;
        return;
      }

      let filtered = questions;
      if (currentFilters.search) {
        const s = currentFilters.search.toLowerCase();
        filtered = filtered.filter(q =>
          (q.topic && q.topic.toLowerCase().includes(s)) ||
          (q.prompt_en && q.prompt_en.toLowerCase().includes(s)) ||
          (q.prompt_hi && q.prompt_hi.toLowerCase().includes(s))
        );
      }

      renderQuestionsList(filtered);

      document.getElementById('qb-tab-all').addEventListener('click', () => {
        activeTab = 'all';
        loadAndRender();
      });
      document.getElementById('qb-tab-weak').addEventListener('click', () => {
        activeTab = 'weak';
        loadAndRender();
      });
      document.getElementById('qb-course-filter').addEventListener('change', (e) => {
        currentFilters.course = e.target.value;
        loadAndRender();
      });
      document.getElementById('qb-diff-filter').addEventListener('change', (e) => {
        currentFilters.difficulty = e.target.value;
        loadAndRender();
      });
      document.getElementById('qb-search-input').addEventListener('input', (e) => {
        currentFilters.search = e.target.value;
        const s = currentFilters.search.toLowerCase();
        const searchFiltered = questions.filter(q =>
          (q.topic && q.topic.toLowerCase().includes(s)) ||
          (q.prompt_en && q.prompt_en.toLowerCase().includes(s)) ||
          (q.prompt_hi && q.prompt_hi.toLowerCase().includes(s))
        );
        renderQuestionsList(searchFiltered);
      });
    };

    const renderQuestionsList = (qList) => {
      const area = document.getElementById('qb-list-area');
      if (!area) return;

      if (qList.length === 0) {
        area.innerHTML = `
          <div class="card" style="text-align:center; padding:3rem 1.5rem;">
            <div style="font-size:2rem; margin-bottom:0.5rem;">🎯</div>
            <h3 style="font-size:1.1rem; font-weight:700;">No Questions Found</h3>
            <p style="color:var(--text-muted); font-size:0.85rem;">Try relaxing your filters or check back later.</p>
          </div>
        `;
        return;
      }

      area.innerHTML = qList.map(q => {
        const diffColor = q.difficulty === 'beginner' ? 'badge-green' : q.difficulty === 'intermediate' ? 'badge-blue' : 'badge-red';
        const promptText = (isHi && q.prompt_hi) ? q.prompt_hi : q.prompt_en;
        const hasOptions = q.options && q.options.length > 0;

        return `
          <div class="qb-card" id="qcard-${q.id}">
            <div class="qb-meta">
              <span class="badge ${diffColor}">${q.difficulty.toUpperCase()}</span>
              <span class="badge badge-purple">${q.course_id}</span>
              <span style="font-weight:700; font-size:0.85rem; color:var(--text-main);">${q.topic}</span>
              <span style="font-size:0.75rem; color:var(--text-muted); margin-left:auto;">${q.question_type.toUpperCase()}</span>
            </div>

            <div style="font-size:0.95rem; font-weight:600; line-height:1.5; margin-bottom:0.75rem;">
              ${promptText}
            </div>

            ${q.code_snippet ? `
              <pre style="background:#0f172a; color:#f8fafc; padding:0.75rem 1rem; border-radius:6px; font-size:0.85rem; overflow-x:auto; margin-bottom:1rem;"><code>${q.code_snippet}</code></pre>
            ` : ''}

            <!-- Multiple Choice Options -->
            ${hasOptions ? `
              <div class="qb-options-group" data-qid="${q.id}" style="margin-bottom:1rem;">
                ${q.options.map((opt, idx) => `
                  <div class="qb-option" data-idx="${idx}">
                    <input type="radio" name="opt-${q.id}" id="opt-${q.id}-${idx}" value="${idx}" style="cursor:pointer;">
                    <label for="opt-${q.id}-${idx}" style="cursor:pointer; flex:1; font-size:0.85rem;">${opt}</label>
                  </div>
                `).join('')}
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center;">
                <button class="btn btn-primary btn-sm submit-mcq-btn" data-qid="${q.id}">Submit Answer</button>
                <button class="btn btn-secondary btn-sm toggle-hint-btn" data-qid="${q.id}">💡 Hint</button>
              </div>
            ` : `
              <!-- Open-ended / Code Practice -->
              <div style="margin-bottom:1rem;">
                <textarea id="answer-input-${q.id}" placeholder="Type your answer, formula, or SQL query here..." style="width:100%; min-height:80px; padding:0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem; font-family:monospace;"></textarea>
              </div>
              <div style="display:flex; gap:0.5rem; align-items:center; flex-wrap:wrap;">
                <button class="btn btn-primary btn-sm submit-open-btn" data-qid="${q.id}">Save Attempt</button>
                <button class="btn btn-secondary btn-sm toggle-hint-btn" data-qid="${q.id}">💡 Hint</button>
                <button class="btn btn-secondary btn-sm toggle-solution-btn" data-qid="${q.id}">✅ Model Solution & Rubric</button>
              </div>
            `}

            <!-- Collapsible Hint -->
            <div id="hint-box-${q.id}" class="qb-hint-box" style="display:none;">
              <strong>Hint:</strong> ${q.hint || 'Carefully review the lesson notes related to this topic.'}
            </div>

            <!-- Collapsible Solution & Rubric -->
            <div id="solution-box-${q.id}" class="qb-solution-box" style="display:none;">
              <div style="font-weight:700; margin-bottom:0.4rem;">Model Solution:</div>
              <div style="font-family:monospace; background:rgba(0,0,0,0.05); padding:0.5rem; border-radius:4px; margin-bottom:0.5rem;">${q.solution || ''}</div>
              <div style="font-size:0.85rem; margin-bottom:0.35rem;"><strong>Explanation:</strong> ${q.explanation || ''}</div>
              ${q.rubric ? `<div style="font-size:0.8rem; color:#15803d;"><strong>Grading Rubric:</strong> ${q.rubric}</div>` : ''}
            </div>

            <!-- Feedback Result Area -->
            <div id="feedback-${q.id}" style="margin-top:0.75rem; font-size:0.85rem; display:none;"></div>
          </div>
        `;
      }).join('');

      document.querySelectorAll('.toggle-hint-btn').forEach(b => {
        b.addEventListener('click', () => {
          const qid = b.dataset.qid;
          const hb = document.getElementById(`hint-box-${qid}`);
          if (hb) hb.style.display = hb.style.display === 'none' ? 'block' : 'none';
        });
      });

      document.querySelectorAll('.toggle-solution-btn').forEach(b => {
        b.addEventListener('click', () => {
          const qid = b.dataset.qid;
          const sb = document.getElementById(`solution-box-${qid}`);
          if (sb) sb.style.display = sb.style.display === 'none' ? 'block' : 'none';
        });
      });

      document.querySelectorAll('.submit-mcq-btn').forEach(b => {
        b.addEventListener('click', async () => {
          const qid = b.dataset.qid;
          const q = questions.find(item => item.id == qid);
          if (!q) return;

          const checked = document.querySelector(`input[name="opt-${qid}"]:checked`);
          if (!checked) {
            alert('Please select an option before submitting.');
            return;
          }
          const chosenIdx = parseInt(checked.value, 10);
          const isCorrect = chosenIdx === q.correct_option_index;

          const opts = document.querySelectorAll(`[data-qid="${qid}"] .qb-option`);
          opts.forEach((el, idx) => {
            el.classList.remove('correct', 'incorrect');
            if (idx === q.correct_option_index) {
              el.classList.add('correct');
            } else if (idx === chosenIdx && !isCorrect) {
              el.classList.add('incorrect');
            }
          });

          const fb = document.getElementById(`feedback-${qid}`);
          fb.style.display = 'block';
          fb.innerHTML = isCorrect ?
            `<div style="color:var(--success); font-weight:700;">✓ Correct! Well done.</div><div style="color:var(--text-muted); font-size:0.8rem; margin-top:0.25rem;">${q.explanation || ''}</div>` :
            `<div style="color:var(--danger); font-weight:700;">✗ Incorrect. Check the model explanation below:</div><div style="color:var(--text-muted); font-size:0.8rem; margin-top:0.25rem;">${q.explanation || ''}</div>`;

          try {
            await API.submitQuestionAttempt(qid, {
              userCode: q.options[chosenIdx],
              isCorrect: isCorrect,
              answerChosen: chosenIdx
            });
          } catch (e) {}
        });
      });

      document.querySelectorAll('.submit-open-btn').forEach(b => {
        b.addEventListener('click', async () => {
          const qid = b.dataset.qid;
          const val = document.getElementById(`answer-input-${qid}`).value.trim();
          if (!val) {
            alert('Please enter your response before saving.');
            return;
          }
          try {
            await API.submitQuestionAttempt(qid, { userCode: val });
            const fb = document.getElementById(`feedback-${qid}`);
            fb.style.display = 'block';
            fb.innerHTML = `<div style="color:var(--success); font-weight:600;">✓ Attempt saved to your learning log!</div>`;
          } catch (e) {
            alert('Error saving attempt: ' + e.message);
          }
        });
      });
    };

    await loadAndRender();
  },

  // -----------------------------------------------------------
  // 12. ADMINISTRATOR DASHBOARD
  // -----------------------------------------------------------
  async renderAdminDashboard(container) {
    if (!State.isAuthenticated || !State.user || State.user.role !== 'admin') {
      container.innerHTML = `
        <div class="card" style="text-align:center; padding:3rem 1.5rem; max-width:500px; margin:2rem auto;">
          <div style="font-size:3rem; margin-bottom:1rem;">🛡️</div>
          <h2 style="font-size:1.5rem; font-weight:800; margin-bottom:0.5rem;">Administrator Access Required</h2>
          <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:1.5rem;">
            This management console is restricted to system administrators. To configure an admin, set the <code>ADMIN_EMAIL</code> environment variable or run <code>node make-admin.js &lt;your-email&gt;</code> in the terminal.
          </p>
          <a href="#dashboard" class="btn btn-primary">Return to Dashboard</a>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">🛡️ Administrator Console</h1>
            <p style="color:var(--text-muted); font-size:0.95rem;">Manage user accounts, review security audit logs, examine content error reports, and enforce user safety.</p>
          </div>
          <span class="badge badge-purple" style="font-size:0.85rem; padding:0.4rem 0.8rem;">Logged in as Admin: ${State.user.email}</span>
        </div>
      </div>

      <div style="display:flex; gap:0.5rem; margin-bottom:1.5rem; border-bottom:1px solid var(--border); padding-bottom:0.75rem; flex-wrap:wrap;">
        <button class="filter-btn active" id="adm-tab-users-btn">👥 User Accounts</button>
        <button class="filter-btn" id="adm-tab-logs-btn">🛡️ Security Audit Logs</button>
        <button class="filter-btn" id="adm-tab-feedback-btn">🚩 Content Error Reports</button>
        <button class="filter-btn" id="adm-tab-reports-btn">⚠️ User Misconduct Reports</button>
      </div>

      <div id="admin-tab-body">
        <div class="card">Loading admin data...</div>
      </div>
    `;

    const tabUsers = document.getElementById('adm-tab-users-btn');
    const tabLogs = document.getElementById('adm-tab-logs-btn');
    const tabFb = document.getElementById('adm-tab-feedback-btn');
    const tabRep = document.getElementById('adm-tab-reports-btn');
    const body = document.getElementById('admin-tab-body');

    const setTab = (btn) => {
      [tabUsers, tabLogs, tabFb, tabRep].forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    };

    const renderUsersTab = async () => {
      setTab(tabUsers);
      body.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:1rem;">
            <h3 class="card-title" style="margin:0;">Registered Users</h3>
            <div style="display:flex; gap:0.5rem;">
              <input type="text" id="adm-user-search" placeholder="Search by email, name, role..." style="padding:0.4rem 0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;">
              <select id="adm-user-status-filter" style="padding:0.4rem 0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;">
                <option value="all">All Statuses</option>
                <option value="active">Active Only</option>
                <option value="suspended">Suspended Only</option>
              </select>
            </div>
          </div>
          <div id="adm-users-table-container">Loading users...</div>
        </div>
      `;

      const loadUsers = async () => {
        const search = document.getElementById('adm-user-search').value;
        const status = document.getElementById('adm-user-status-filter').value;
        try {
          const res = await API.getAdminUsers({ search, status });
          const users = res.users || [];
          const container = document.getElementById('adm-users-table-container');
          if (users.length === 0) {
            container.innerHTML = `<div style="color:var(--text-muted); padding:1rem 0;">No registered users match your criteria.</div>`;
            return;
          }
          container.innerHTML = `
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Registered</th>
                  <th>Last Login</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${users.map(u => `
                  <tr>
                    <td><strong>${u.name}</strong></td>
                    <td>${u.email}</td>
                    <td><span class="badge ${u.role === 'admin' ? 'badge-purple' : 'badge-blue'}">${u.role}</span></td>
                    <td><span class="badge ${u.status === 'active' ? 'badge-green' : 'badge-red'}">${u.status}</span></td>
                    <td style="font-size:0.75rem; color:var(--text-muted);">${new Date(u.created_at).toLocaleDateString()}</td>
                    <td style="font-size:0.75rem; color:var(--text-muted);">${u.last_login_at ? new Date(u.last_login_at).toLocaleString() : 'Never'}</td>
                    <td>
                      <div style="display:flex; gap:0.4rem;">
                        ${u.id !== State.user.id ? `
                          ${u.status === 'active' ? `
                            <button class="btn btn-secondary btn-sm adm-suspend-btn" data-id="${u.id}" data-name="${u.name}" style="padding:2px 6px; font-size:0.75rem; color:#b45309;">Suspend</button>
                          ` : `
                            <button class="btn btn-secondary btn-sm adm-activate-btn" data-id="${u.id}" data-name="${u.name}" style="padding:2px 6px; font-size:0.75rem; color:var(--success);">Activate</button>
                          `}
                          <button class="btn btn-secondary btn-sm adm-delete-user-btn" data-id="${u.id}" data-name="${u.name}" style="padding:2px 6px; font-size:0.75rem; color:var(--danger);">Delete</button>
                        ` : `<span style="font-size:0.75rem; color:var(--text-muted);">(Current Admin)</span>`}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;

          document.querySelectorAll('.adm-suspend-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
              const name = btn.dataset.name;
              if (confirm(`Suspend user "${name}"? Suspended users cannot sign in.`)) {
                await API.updateUserStatus(id, 'suspended');
                loadUsers();
              }
            });
          });

          document.querySelectorAll('.adm-activate-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
              await API.updateUserStatus(id, 'active');
              loadUsers();
            });
          });

          document.querySelectorAll('.adm-delete-user-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
              const name = btn.dataset.name;
              if (confirm(`PERMANENTLY DELETE user "${name}"?\n\nThis will cascade delete all their progress, notes, schedule, and submissions.`)) {
                await API.deleteUser(id);
                loadUsers();
              }
            });
          });
        } catch (err) {
          document.getElementById('adm-users-table-container').innerHTML = `<div style="color:var(--danger);">Error: ${err.message}</div>`;
        }
      };

      document.getElementById('adm-user-search').addEventListener('input', loadUsers);
      document.getElementById('adm-user-status-filter').addEventListener('change', loadUsers);
      loadUsers();
    };

    const renderLogsTab = async () => {
      setTab(tabLogs);
      body.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 class="card-title" style="margin:0;">Security & Authentication Audit Logs</h3>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">
                Privacy Notice: Minimal audit logs record authentication and security events only. In accordance with strict privacy safeguards, personal notes and study chat are never logged.
              </p>
            </div>
            <button id="adm-refresh-logs-btn" class="btn btn-secondary btn-sm">🔄 Refresh Logs</button>
          </div>
          <div id="adm-logs-table-container">Loading logs...</div>
        </div>
      `;

      const loadLogs = async () => {
        try {
          const res = await API.getAdminAuditLogs(100);
          const logs = res.audit_logs || [];
          const container = document.getElementById('adm-logs-table-container');
          if (logs.length === 0) {
            container.innerHTML = `<div style="color:var(--text-muted); padding:1rem 0;">No audit events recorded yet.</div>`;
            return;
          }
          container.innerHTML = `
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Event Type</th>
                  <th>User ID</th>
                  <th>IP Address</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                ${logs.map(l => `
                  <tr>
                    <td style="font-size:0.75rem; white-space:nowrap; color:var(--text-muted);">${new Date(l.created_at).toLocaleString()}</td>
                    <td><span class="badge ${l.event_type.includes('fail') || l.event_type.includes('suspend') ? 'badge-red' : 'badge-blue'}">${l.event_type}</span></td>
                    <td><code>${l.user_id ? l.user_id.slice(0, 8) + '...' : 'Anonymous'}</code></td>
                    <td style="font-size:0.8rem;">${l.ip_address || '-'}</td>
                    <td style="font-size:0.8rem; font-family:monospace;">${l.details || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;
        } catch (err) {
          document.getElementById('adm-logs-table-container').innerHTML = `<div style="color:var(--danger);">Error: ${err.message}</div>`;
        }
      };

      document.getElementById('adm-refresh-logs-btn').addEventListener('click', loadLogs);
      loadLogs();
    };

    const renderFeedbackTab = async () => {
      setTab(tabFb);
      body.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 class="card-title" style="margin:0;">Content Error Reports & Technical Corrections</h3>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">
                Submissions from learners reporting typos, outdated instructions, broken commands, or technical clarifications.
              </p>
            </div>
            <button id="adm-refresh-fb-btn" class="btn btn-secondary btn-sm">🔄 Refresh</button>
          </div>
          <div id="adm-feedback-table-container">Loading reports...</div>
        </div>
      `;

      const loadFb = async () => {
        try {
          const res = await API.getAdminContentFeedback();
          const list = res.feedback || [];
          const container = document.getElementById('adm-feedback-table-container');
          if (list.length === 0) {
            container.innerHTML = `<div style="color:var(--text-muted); padding:1rem 0;">No content error reports submitted yet.</div>`;
            return;
          }
          container.innerHTML = `
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Course / Lesson</th>
                  <th>Issue Category</th>
                  <th>Reporter</th>
                  <th>Details & Suggested Correction</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(f => `
                  <tr>
                    <td><strong>${f.course_id}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${f.lesson_id || 'Course-wide'}</span></td>
                    <td><span class="badge badge-purple">${f.feedback_type}</span></td>
                    <td style="font-size:0.8rem;">${f.reporter_name || 'Anonymous'}<br><span style="font-size:0.7rem; color:var(--text-muted);">${f.reporter_email || ''}</span></td>
                    <td style="font-size:0.85rem;">
                      <div>${f.details}</div>
                      ${f.suggested_correction ? `<div style="margin-top:0.35rem; font-size:0.75rem; color:#15803d; background:#f0fdf4; padding:0.25rem 0.5rem; border-radius:4px;"><strong>Suggested Fix:</strong> ${f.suggested_correction}</div>` : ''}
                    </td>
                    <td><span class="badge ${f.status === 'resolved' ? 'badge-green' : f.status === 'in_review' ? 'badge-blue' : 'badge-yellow'}">${f.status}</span></td>
                    <td>
                      <div style="display:flex; flex-direction:column; gap:0.25rem;">
                        ${f.status !== 'resolved' ? `
                          <button class="btn btn-secondary btn-sm adm-resolve-fb-btn" data-id="${f.id}" style="padding:2px 6px; font-size:0.75rem; color:var(--success);">Mark Resolved</button>
                        ` : '<span style="font-size:0.75rem; color:var(--success);">✓ Resolved</span>'}
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;

          document.querySelectorAll('.adm-resolve-fb-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
              await API.updateContentFeedback(id, 'resolved', 'Addressed in curriculum update');
              loadFb();
            });
          });
        } catch (err) {
          document.getElementById('adm-feedback-table-container').innerHTML = `<div style="color:var(--danger);">Error: ${err.message}</div>`;
        }
      };

      document.getElementById('adm-refresh-fb-btn').addEventListener('click', loadFb);
      loadFb();
    };

    const renderReportsTab = async () => {
      setTab(tabRep);
      body.innerHTML = `
        <div class="card">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; flex-wrap:wrap; gap:0.5rem;">
            <div>
              <h3 class="card-title" style="margin:0;">User Conduct & Safety Reports</h3>
              <p style="font-size:0.8rem; color:var(--text-muted); margin-top:0.25rem;">
                Reports filed by study squad members regarding harassment, spam, or inappropriate conduct.
              </p>
            </div>
            <button id="adm-refresh-reports-btn" class="btn btn-secondary btn-sm">🔄 Refresh</button>
          </div>
          <div id="adm-reports-table-container">Loading reports...</div>
        </div>
      `;

      const loadReports = async () => {
        try {
          const res = await API.getAdminUserReports();
          const list = res.reports || [];
          const container = document.getElementById('adm-reports-table-container');
          if (list.length === 0) {
            container.innerHTML = `<div style="color:var(--text-muted); padding:1rem 0;">No user misconduct reports filed.</div>`;
            return;
          }
          container.innerHTML = `
            <table class="admin-table">
              <thead>
                <tr>
                  <th>Reported User</th>
                  <th>Category</th>
                  <th>Details</th>
                  <th>Reported By</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(r => `
                  <tr>
                    <td><strong>${r.reported_name}</strong><br><span style="font-size:0.75rem; color:var(--text-muted);">${r.reported_email}</span></td>
                    <td><span class="badge badge-red">${r.category}</span></td>
                    <td style="font-size:0.85rem;">${r.details || 'No details provided'}</td>
                    <td style="font-size:0.8rem;">${r.reporter_name}<br><span style="font-size:0.7rem; color:var(--text-muted);">${r.reporter_email}</span></td>
                    <td style="font-size:0.75rem; color:var(--text-muted);">${new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <button class="btn btn-secondary btn-sm adm-suspend-reported-btn" data-id="${r.reported_user_id}" data-name="${r.reported_name}" style="padding:2px 6px; font-size:0.75rem; color:var(--danger);">
                        Suspend User
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `;

          document.querySelectorAll('.adm-suspend-reported-btn').forEach(btn => {
            btn.addEventListener('click', async () => {
              const id = btn.dataset.id;
              const name = btn.dataset.name;
              if (confirm(`Suspend reported user "${name}"?`)) {
                await API.updateUserStatus(id, 'suspended');
                alert(`User ${name} has been suspended.`);
                loadReports();
              }
            });
          });
        } catch (err) {
          document.getElementById('adm-reports-table-container').innerHTML = `<div style="color:var(--danger);">Error: ${err.message}</div>`;
        }
      };

      document.getElementById('adm-refresh-reports-btn').addEventListener('click', loadReports);
      loadReports();
    };

    tabUsers.addEventListener('click', renderUsersTab);
    tabLogs.addEventListener('click', renderLogsTab);
    tabFb.addEventListener('click', renderFeedbackTab);
    tabRep.addEventListener('click', renderReportsTab);

    renderUsersTab();
  },

  // -----------------------------------------------------------
  // 13. PRIVACY POLICY & GDPR COMPLIANCE
  // -----------------------------------------------------------
  renderPrivacyPolicy(container) {
    container.innerHTML = `
      <div style="margin-bottom:2rem;">
        <h1 style="font-size:2rem; font-weight:800; margin-bottom:0.5rem;">🔒 Privacy Policy & Data Protection Safeguards</h1>
        <p style="color:var(--text-muted); font-size:0.95rem;">Last Updated: October 2026 • Effective Immediately</p>
      </div>

      <div class="card prose" style="max-width:850px; line-height:1.7;">
        <h2>1. Commitment to Privacy and Security</h2>
        <p>
          At <strong>${State.appName || 'Data Analyst Platform'}</strong>, your privacy and personal trust are our highest priorities. This policy outlines our transparent data practices, rigorous security safeguards, and explicit learner privacy guarantees designed to comply with global data protection standards, including the General Data Protection Regulation (GDPR) and the California Consumer Privacy Act (CCPA).
        </p>

        <h2>2. Information We Collect</h2>
        <p>We collect only the minimum information necessary to provide an authentic, personalized learning experience:</p>
        <ul>
          <li><strong>Account Registration:</strong> Your full name, email address, optional mobile number, and password. Passwords are never stored in plaintext; they are cryptographically salted and hashed using industry-standard PBKDF2 (SHA-512) with 100,000 iterations.</li>
          <li><strong>Learning Progress:</strong> Completed lesson IDs, quiz attempt scores, project checkpoint states, and study streak counters.</li>
          <li><strong>User Notes & Timetable:</strong> Personal lesson takeaway notes, study hours goals, and custom study timetables.</li>
          <li><strong>Study Squad Communications:</strong> Messages transmitted in private study squads and WebRTC call signaling metadata.</li>
        </ul>

        <h2>3. Learner Privacy: Strict Confidentiality of Notes & Answers</h2>
        <p>
          <strong>Your private notes, custom schedules, detailed quiz answer choices, and study group chat messages are strictly private to you.</strong>
        </p>
        <p>
          Unlike legacy platforms, our architecture enforces zero-knowledge learner privacy. Neither site administrators nor other learners have access to inspect your personal notes, browse your chat history, or evaluate your individual practice answers unless you choose to share them.
        </p>

        <h2>4. Study Squad Granular Sharing Controls</h2>
        <p>
          When you create or join a Study Squad with a friend, each learner maintains a separate, independent account. By default, detailed progress and personal notes remain confidential. You have granular, explicit toggles in squad settings to share:
        </p>
        <ul>
          <li>Curriculum progress percentage and completed lesson count</li>
          <li>Capstone project milestone announcements</li>
          <li>Weekly study hour targets</li>
        </ul>
        <p>You may pause sharing or leave a study squad at any time with immediate effect.</p>

        <h2>5. Owner and Administrator Visibility Boundaries</h2>
        <p>
          Platform administrators have access strictly limited to operational security and platform integrity:
        </p>
        <ul>
          <li>Managing account statuses (activating, suspending, or deleting accounts upon request)</li>
          <li>Reviewing minimal security audit logs (timestamped authentication attempts, IP addresses for abuse prevention and rate limiting)</li>
          <li>Reviewing learner-submitted content error reports and technical corrections</li>
          <li>Reviewing reported user misconduct to maintain a safe, welcoming community</li>
        </ul>
        <p>
          <strong>Administrators have zero access to read your personal lesson notes, study schedules, or private partner discussions.</strong>
        </p>

        <h2>6. Safety, Reporting, and User Blocking</h2>
        <p>
          Every learner is empowered with self-service safety tools:
        </p>
        <ul>
          <li><strong>User Blocking:</strong> You can block any squad member directly from the squad dashboard or your account settings. Blocked users are immediately prevented by our server backend from sending you messages or initiating video/voice calls.</li>
          <li><strong>Misconduct Reporting:</strong> You can report harassment, abusive conduct, or spam directly to platform administrators for investigation.</li>
        </ul>

        <h2>7. Data Portability and Erasure (GDPR / CCPA Rights)</h2>
        <p>
          You hold full ownership over your educational data. We provide self-service tools under <a href="#settings">Settings</a>:
        </p>
        <ul>
          <li><strong>One-Click Data Portability:</strong> Download a full, machine-readable JSON archive of your account, progress, notes, schedule, and quiz history.</li>
          <li><strong>Right to Erasure (Permanent Account Deletion):</strong> Permanently delete your account. This triggers a complete database cascade erasing all personal notes, timetable entries, progress records, and group memberships.</li>
        </ul>

        <h2>8. Zero Fake Accounts & Authentic Data Policy</h2>
        <p>
          We do not populate fake profiles, simulated study partners, or fabricated user accounts. All learners on the platform are real registered individuals.
        </p>

        <h2>9. Technical Accuracy & Content Corrections</h2>
        <p>
          Technical learning materials in data analytics evolve rapidly. While we rigorously test exercises and align with official documentation, we do not claim content is error-free. Every lesson includes a <strong>🚩 Report Error / Suggest Correction</strong> tool that forwards technical feedback directly to curriculum maintainers.
        </p>

        <h2>10. Contact Us</h2>
        <p>
          For privacy inquiries, GDPR data requests, or security concerns, contact our platform data protection team via your administrator console or email support.
        </p>
      </div>
    `;
  },

  // -----------------------------------------------------------
  // 14. FEEDBACK & REPORTING MODALS
  // -----------------------------------------------------------
  openContentCorrectionModal(context) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="font-size:1.25rem; font-weight:700;">🚩 Report Content Error or Suggest Correction</h3>
          <button id="close-modal-btn" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">&times;</button>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
          Help us keep curriculum instructions accurate and up to date. Target: <strong>${context.title || context.lessonId}</strong>
        </p>
        <form id="correction-form">
          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Issue Category</label>
            <select name="feedbackType" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border);">
              <option value="technical_error">Technical Accuracy / Buggy Code</option>
              <option value="outdated">Outdated Instructions / Version Mismatch</option>
              <option value="typo">Typo or Grammar Issue</option>
              <option value="broken_link">Broken Link or Command</option>
              <option value="clarity">Explanation Unclear / Needs More Detail</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Details of Issue</label>
            <textarea name="details" required rows="3" placeholder="Describe the error, step number, or incorrect command..." style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;"></textarea>
          </div>
          <div style="margin-bottom:1.5rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Suggested Fix (Optional)</label>
            <textarea name="suggestedCorrection" rows="2" placeholder="What should the correct explanation, syntax, or link be?" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;"></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" id="cancel-modal-btn" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary">Submit Report</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#close-modal-btn').addEventListener('click', close);
    overlay.querySelector('#cancel-modal-btn').addEventListener('click', close);

    overlay.querySelector('#correction-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        await API.submitContentFeedback({
          courseId: context.courseId,
          lessonId: context.lessonId,
          feedbackType: form.feedbackType.value,
          details: form.details.value,
          suggestedCorrection: form.suggestedCorrection.value
        });
        close();
        alert('Thank you! Your correction report has been forwarded to the curriculum maintainers for review.');
      } catch (err) {
        alert('Failed to submit report: ' + err.message);
      }
    });
  },

  openReportUserModal(userId, userName) {
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-content">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
          <h3 style="font-size:1.25rem; font-weight:700;">🚩 Report Member Misconduct</h3>
          <button id="close-modal-btn" style="background:none; border:none; font-size:1.25rem; cursor:pointer;">&times;</button>
        </div>
        <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:1rem;">
          Reporting member: <strong>${userName}</strong>. Reports are handled confidentially by platform administrators.
        </p>
        <form id="user-report-form">
          <div style="margin-bottom:1rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Reason for Report</label>
            <select name="category" style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border);">
              <option value="harassment">Harassment or Bullying</option>
              <option value="inappropriate_content">Inappropriate Content or Messages</option>
              <option value="spam">Spam or Commercial Solicitation</option>
              <option value="impersonation">Impersonation or False Information</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style="margin-bottom:1.5rem;">
            <label style="display:block; font-weight:600; font-size:0.85rem; margin-bottom:0.35rem;">Details of Misconduct</label>
            <textarea name="details" required rows="3" placeholder="Provide context regarding the incident..." style="width:100%; padding:0.6rem; border-radius:6px; border:1px solid var(--border); font-size:0.85rem;"></textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" id="cancel-modal-btn" class="btn btn-secondary">Cancel</button>
            <button type="submit" class="btn btn-primary" style="background:var(--danger);">Submit Report</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);

    const close = () => overlay.remove();
    overlay.querySelector('#close-modal-btn').addEventListener('click', close);
    overlay.querySelector('#cancel-modal-btn').addEventListener('click', close);

    overlay.querySelector('#user-report-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.target;
      try {
        await API.reportUser(userId, form.category.value, form.details.value);
        close();
        alert('Report filed successfully. Our team will review this incident promptly.');
      } catch (err) {
        alert('Failed to submit report: ' + err.message);
      }
    });
  }
};

window.addEventListener('DOMContentLoaded', () => {
  window.App = App;
  App.init();
});
