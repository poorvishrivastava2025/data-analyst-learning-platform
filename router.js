// router.js - Client-Side Hash Router
const Router = {
  routes: {},

  init() {
    window.addEventListener('hashchange', () => this.handleRouting());
    this.handleRouting();
  },

  handleRouting() {
    const rawHash = window.location.hash.slice(1) || '';
    const parts = rawHash.split('/');
    const mainRoute = parts[0] || (State.isAuthenticated ? 'dashboard' : 'welcome');
    const param = parts[1] || null;

    State.currentRoute = mainRoute;
    State.routeParams = { id: param };

    // Query parameters support (e.g. ?token=...)
    const queryIdx = window.location.hash.indexOf('?');
    if (queryIdx !== -1) {
      const queryStr = window.location.hash.slice(queryIdx + 1);
      const urlParams = new URLSearchParams(queryStr);
      State.routeParams.token = urlParams.get('token');
      State.routeParams.code = urlParams.get('code');
    }

    // Protection check
    const protectedRoutes = ['dashboard', 'onboarding', 'schedule', 'groups', 'group', 'report', 'settings', 'admin'];
    if (protectedRoutes.includes(mainRoute) && !State.isAuthenticated) {
      State.currentRoute = 'login';
      State.routeParams = { redirect: mainRoute };
    } else if (mainRoute === 'admin' && State.isAuthenticated && (!State.user || State.user.role !== 'admin')) {
      State.currentRoute = 'dashboard';
    }

    // Notify app to render the corresponding view
    if (window.App && typeof window.App.renderCurrentView === 'function') {
      window.App.renderCurrentView();
    }
  },

  navigate(route, param = null) {
    if (param) {
      window.location.hash = `#${route}/${param}`;
    } else {
      window.location.hash = `#${route}`;
    }
  }
};
