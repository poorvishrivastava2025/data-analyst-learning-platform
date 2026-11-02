// api.js - REST Client for Learning Platform Backend
const API = {
  baseUrl: '',

  async request(endpoint, options = {}) {
    const token = localStorage.getItem('ap_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {})
    };

    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Server error occurred');
      }
      return data;
    } catch (err) {
      console.error(`[API Error] ${endpoint}:`, err);
      throw err;
    }
  },

  // Config
  async getConfig() {
    return this.request('/api/config');
  },

  // Auth & Security
  async register(formData) {
    const data = await this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(formData)
    });
    if (data.token) {
      localStorage.setItem('ap_token', data.token);
    }
    return data;
  },

  async verifyEmail(token) {
    return this.request('/api/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify({ token })
    });
  },

  async login(email, password) {
    const data = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
    if (data.token) {
      localStorage.setItem('ap_token', data.token);
    }
    return data;
  },

  async forgotPassword(email) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    });
  },

  async resetPassword(token, newPassword) {
    return this.request('/api/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword })
    });
  },

  async logout() {
    try {
      await this.request('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    localStorage.removeItem('ap_token');
  },

  async getMe() {
    return this.request('/api/auth/me');
  },

  async submitOnboarding(answers) {
    return this.request('/api/onboarding', {
      method: 'POST',
      body: JSON.stringify(answers)
    });
  },

  // Dashboard
  async getDashboard() {
    return this.request('/api/dashboard');
  },

  // Study Groups & Two Friends Learning Together
  async getGroups() {
    return this.request('/api/groups');
  },

  async createGroup(name, description) {
    return this.request('/api/groups', {
      method: 'POST',
      body: JSON.stringify({ name, description })
    });
  },

  async joinGroup(inviteCode) {
    return this.request('/api/groups/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode })
    });
  },

  async getGroupDetails(groupId) {
    return this.request(`/api/groups/${groupId}`);
  },

  async updateGroupSharing(groupId, sharing) {
    return this.request(`/api/groups/${groupId}/sharing`, {
      method: 'PUT',
      body: JSON.stringify(sharing)
    });
  },

  async addGroupGoal(groupId, goal_text, target_date) {
    return this.request(`/api/groups/${groupId}/goals`, {
      method: 'POST',
      body: JSON.stringify({ goal_text, target_date })
    });
  },

  async toggleGroupGoal(groupId, goalId) {
    return this.request(`/api/groups/${groupId}/goals/${goalId}/toggle`, {
      method: 'POST'
    });
  },

  async sendMilestoneReaction(groupId, milestone_id, reaction_type, message) {
    return this.request(`/api/groups/${groupId}/reactions`, {
      method: 'POST',
      body: JSON.stringify({ milestone_id, reaction_type, message })
    });
  },

  async leaveGroup(groupId) {
    return this.request(`/api/groups/${groupId}/leave`, {
      method: 'POST'
    });
  },

  // Partner Chat & WebRTC Call Signaling
  async getChatMessages(groupId) {
    return this.request(`/api/groups/${groupId}/chat`);
  },

  async sendChatMessage(groupId, message, lesson_link = null) {
    return this.request(`/api/groups/${groupId}/chat`, {
      method: 'POST',
      body: JSON.stringify({ message, lesson_link })
    });
  },

  async sendCallSignal(groupId, signalType, data) {
    return this.request('/api/calls/signal', {
      method: 'POST',
      body: JSON.stringify({ groupId, signalType, data })
    });
  },

  async getCallSignals(groupId) {
    return this.request(`/api/calls/${groupId}/signals`);
  },

  // Courses & Lessons
  async getCourses() {
    return this.request('/api/courses');
  },

  async getCourse(id) {
    return this.request(`/api/courses/${id}`);
  },

  async getLesson(id) {
    return this.request(`/api/lessons/${id}`);
  },

  async recordLessonMode(lessonId, mode) {
    return this.request(`/api/lessons/${lessonId}/mode`, {
      method: 'POST',
      body: JSON.stringify({ mode })
    });
  },

  async submitLessonTest(lessonId, answers) {
    return this.request(`/api/lessons/${lessonId}/test-attempt`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  async toggleCompleteLesson(id) {
    return this.request(`/api/lessons/${id}/complete`, { method: 'POST' });
  },

  async saveLessonNotes(lessonId, note_text, is_shared = 0) {
    return this.request(`/api/lessons/${lessonId}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note_text, is_shared })
    });
  },

  // Practice Runners
  async runSql(query, expectedQuery = null) {
    return this.request('/api/practice/sql-run', {
      method: 'POST',
      body: JSON.stringify({ query, expectedQuery })
    });
  },

  async evalExcel(formula) {
    return this.request('/api/practice/excel-eval', {
      method: 'POST',
      body: JSON.stringify({ formula })
    });
  },

  async runPython(code) {
    return this.request('/api/practice/python-run', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  // Quizzes
  async getQuiz(id) {
    return this.request(`/api/quizzes/${id}`);
  },

  async submitQuiz(id, answers) {
    return this.request(`/api/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers })
    });
  },

  // Interview & Mock Rounds
  async getInterviewQuestions(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/api/interview/questions${query ? '?' + query : ''}`);
  },

  async getMockInterviewRounds() {
    return this.request('/api/interview/mock-rounds');
  },

  async evaluateInterviewAnswer(question_id, payload) {
    return this.request('/api/interview/evaluate', {
      method: 'POST',
      body: JSON.stringify({
        question_id,
        user_answer: payload.answer || payload.user_answer,
        self_ratings: payload.self_ratings || [],
        language: payload.language || 'hinglish'
      })
    });
  },

  async submitInterviewAnswer(question_id, answer, language = 'hinglish') {
    return this.request('/api/interview/submit-answer', {
      method: 'POST',
      body: JSON.stringify({ question_id, answer, language })
    });
  },

  // Guided Projects
  async getProjects() {
    return this.request('/api/projects');
  },

  async getProject(id) {
    return this.request(`/api/projects/${id}`);
  },

  async submitProject(id, submission_notes) {
    return this.request(`/api/projects/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ submission_notes })
    });
  },

  // Schedule & Timetable Management
  async getSchedule() {
    return this.request('/api/schedule');
  },

  async addScheduleTask(taskData) {
    return this.request('/api/schedule/task', {
      method: 'POST',
      body: JSON.stringify(taskData)
    });
  },

  async updateScheduleTask(taskId, taskData) {
    return this.request(`/api/schedule/task/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    });
  },

  async deleteScheduleTask(taskId) {
    return this.request(`/api/schedule/task/${taskId}`, {
      method: 'DELETE'
    });
  },

  async recalculateSchedule(params) {
    return this.request('/api/schedule/recalculate', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async bulkMoveSchedule(params) {
    return this.request('/api/schedule/bulk-move', {
      method: 'POST',
      body: JSON.stringify(params)
    });
  },

  async toggleTask(taskId) {
    return this.request(`/api/schedule/${taskId}/toggle`, { method: 'POST' });
  },

  async rescheduleMissed() {
    return this.request('/api/schedule/reschedule', { method: 'POST' });
  },

  // Weak-Area Analytics
  async getWeakAreaAnalytics() {
    return this.request('/api/analytics/weak-areas');
  },

  async getGroupComparison(groupId) {
    return this.request(`/api/groups/${groupId}/comparison`);
  },

  // AI Tutor
  async sendTutorMessage(message, lesson_id, language) {
    return this.request('/api/tutor/chat', {
      method: 'POST',
      body: JSON.stringify({ message, lesson_id, language })
    });
  },

  async reviewCode(codeType, userCode, taskContext, language) {
    return this.request('/api/tutor/review-code', {
      method: 'POST',
      body: JSON.stringify({ codeType, userCode, taskContext, language })
    });
  },

  // Content Feedback & Error Corrections
  async submitContentFeedback(payload) {
    return this.request('/api/content/feedback', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  // User Safety & Blocking
  async blockUser(userId) {
    return this.request(`/api/users/${userId}/block`, { method: 'POST' });
  },

  async unblockUser(userId) {
    return this.request(`/api/users/${userId}/unblock`, { method: 'POST' });
  },

  async getBlockedUsers() {
    return this.request('/api/users/blocked');
  },

  async reportUser(userId, reason, details = '') {
    return this.request(`/api/users/${userId}/report`, {
      method: 'POST',
      body: JSON.stringify({ reason, details })
    });
  },

  // GDPR Data Privacy & Account Lifecycle
  async exportUserData() {
    const token = localStorage.getItem('ap_token');
    const res = await fetch('/api/user/export-data', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error('Data export failed');
    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `data-analyst-learning-data-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  },

  async deleteUserAccount() {
    return this.request('/api/user/delete-account', {
      method: 'DELETE',
      body: JSON.stringify({ confirm: true })
    });
  },

  // Large Question Bank
  async getQuestions(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/api/questions?${query}`);
  },

  async getQuestion(id) {
    return this.request(`/api/questions/${id}`);
  },

  async attemptQuestion(id, user_response) {
    return this.request(`/api/questions/${id}/attempt`, {
      method: 'POST',
      body: JSON.stringify({ user_response })
    });
  },

  async getWeakQuestions() {
    return this.request('/api/questions/weak-areas');
  },

  // Owner / Admin Dashboard
  async adminGetUsers(filters = {}) {
    const query = new URLSearchParams(filters).toString();
    return this.request(`/api/admin/users?${query}`);
  },

  async adminSetUserStatus(id, status) {
    return this.request(`/api/admin/users/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status })
    });
  },

  async adminDeleteUser(id) {
    return this.request(`/api/admin/users/${id}`, { method: 'DELETE' });
  },

  async adminGetAuditLogs() {
    return this.request('/api/admin/audit-logs');
  },

  async adminGetFeedback() {
    return this.request('/api/admin/content-feedback');
  },

  async adminUpdateFeedback(id, payload) {
    return this.request(`/api/admin/content-feedback/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
  },

  async adminGetUserReports() {
    return this.request('/api/admin/user-reports');
  }
};
