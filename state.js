// state.js - Centralized Reactive State Store
const State = {
  appName: 'Data Analyst Learning Platform',
  aiProviderLabel: 'Built-in Local Pedagogical Engine',
  user: null,
  isAuthenticated: false,
  language: localStorage.getItem('ap_language') || 'hinglish',
  currentRoute: 'welcome',
  routeParams: {},
  courses: [],
  currentLesson: null,
  currentQuiz: null,
  currentGroup: null,
  tutorOpen: false,
  tutorMessages: [
    {
      role: 'bot',
      message: 'Hello! I am your personal Data Analyst Tutor & Career Coach. How can I help you master analytics today?',
      message_hi: 'नमस्ते! मैं आपका पर्सनल डेटा एनालिस्ट ट्यूटर और करियर कोच हूँ। आज डेटा एनालिसिस में आप क्या सीखना या समझना चाहते हैं?'
    }
  ],
  subscribers: [],

  subscribe(callback) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  },

  notify() {
    this.subscribers.forEach(cb => cb(this));
  },

  setLanguage(lang) {
    this.language = lang;
    localStorage.setItem('ap_language', lang);
    document.documentElement.lang = lang === 'hinglish' ? 'hi' : 'en';
    this.notify();
  },

  setUser(user) {
    this.user = user;
    this.isAuthenticated = !!user;
    if (user && user.preferred_language) {
      this.language = user.preferred_language;
      localStorage.setItem('ap_language', user.preferred_language);
    }
    this.notify();
  },

  setRoute(route, params = {}) {
    this.currentRoute = route;
    this.routeParams = params;
    window.location.hash = this.buildHash(route, params);
    this.notify();
  },

  buildHash(route, params) {
    if (route === 'course' && params.id) return `#course/${params.id}`;
    if (route === 'lesson' && params.id) return `#lesson/${params.id}`;
    if (route === 'quiz' && params.id) return `#quiz/${params.id}`;
    if (route === 'project' && params.id) return `#project/${params.id}`;
    if (route === 'group' && params.id) return `#group/${params.id}`;
    if (route === 'chat' && params.id) return `#chat/${params.id}`;
    if (route === 'call' && params.id) return `#call/${params.id}`;
    return `#${route}`;
  },

  toggleTutor(forceState = null) {
    this.tutorOpen = forceState !== null ? forceState : !this.tutorOpen;
    const drawer = document.getElementById('tutor-drawer');
    if (drawer) {
      if (this.tutorOpen) {
        drawer.classList.add('open');
      } else {
        drawer.classList.remove('open');
      }
    }
    this.notify();
  },

  t(key) {
    const dict = TRANSLATIONS[this.language] || TRANSLATIONS.en;
    return dict[key] || TRANSLATIONS.en[key] || key;
  }
};
