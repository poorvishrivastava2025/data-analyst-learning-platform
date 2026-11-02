// tutor.js - Client AI Tutor Drawer Controller & Markdown Formatter
const Tutor = {
  init() {
    this.bindEvents();
    this.renderHistory();
  },

  bindEvents() {
    const sendBtn = document.getElementById('tutor-send-btn');
    const input = document.getElementById('tutor-input');
    const closeBtn = document.getElementById('tutor-close-btn');

    if (sendBtn && input) {
      sendBtn.addEventListener('click', () => this.sendMessage());
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        State.toggleTutor(false);
      });
    }
  },

  async sendMessage(customText = null) {
    const input = document.getElementById('tutor-input');
    const text = customText || (input ? input.value.trim() : '');
    if (!text) return;

    if (input && !customText) input.value = '';

    // Add user message to state
    State.tutorMessages.push({
      role: 'user',
      message: text
    });
    this.renderHistory();

    // Show typing placeholder
    const body = document.getElementById('tutor-messages');
    const typingId = 'typing_' + Date.now();
    if (body) {
      const typingEl = document.createElement('div');
      typingEl.id = typingId;
      typingEl.className = 'tutor-message bot';
      typingEl.innerHTML = `<em>Thinking & consulting course knowledge... ⏳</em>`;
      body.appendChild(typingEl);
      body.scrollTop = body.scrollHeight;
    }

    try {
      const res = await API.sendTutorMessage(
        text,
        State.currentLesson ? State.currentLesson.id : null,
        State.language
      );

      // Remove typing placeholder
      const placeholder = document.getElementById(typingId);
      if (placeholder) placeholder.remove();

      State.tutorMessages.push({
        role: 'bot',
        message: res.reply,
        citations: res.citations
      });
      this.renderHistory();
    } catch (err) {
      const placeholder = document.getElementById(typingId);
      if (placeholder) placeholder.remove();

      State.tutorMessages.push({
        role: 'bot',
        message: `Sorry, I encountered an issue connecting to the tutor engine: ${err.message}. Please try again.`
      });
      this.renderHistory();
    }
  },

  askPrompt(promptText) {
    State.toggleTutor(true);
    this.sendMessage(promptText);
  },

  renderHistory() {
    const container = document.getElementById('tutor-messages');
    if (!container) return;

    container.innerHTML = State.tutorMessages.map(msg => {
      const isHi = State.language === 'hinglish';
      const text = (isHi && msg.message_hi) ? msg.message_hi : msg.message;
      const formattedHtml = this.formatMarkdown(text);
      
      let citationsHtml = '';
      if (msg.citations && msg.citations.length > 0) {
        citationsHtml = `
          <div style="margin-top: 0.5rem; display: flex; flex-wrap: wrap; gap: 0.35rem;">
            ${msg.citations.map(c => `
              <a href="${c.url}" target="_blank" class="tutor-citation-pill">
                <span>📖 ${c.source}</span>
              </a>
            `).join('')}
          </div>
        `;
      }

      return `
        <div class="tutor-message ${msg.role}">
          ${formattedHtml}
          ${citationsHtml}
        </div>
      `;
    }).join('');

    container.scrollTop = container.scrollHeight;
  },

  formatMarkdown(text) {
    if (!text) return '';
    let parsed = text
      // Headings
      .replace(/^### (.*$)/gim, '<h4 style="font-weight:700; margin:0.4rem 0;">$1</h4>')
      .replace(/^## (.*$)/gim, '<h3 style="font-weight:700; margin:0.5rem 0;">$1</h3>')
      // Code blocks
      .replace(/```([a-z]*)\n([\s\S]*?)```/gim, '<pre><code>$2</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      // Bold
      .replace(/\*\*([^*]+)\*\*/gim, '<strong>$1</strong>')
      // Bullet lists
      .replace(/^\s*-\s+(.*$)/gim, '<div style="display:flex; gap:0.4rem; margin:0.2rem 0;"><span>•</span><span>$1</span></div>')
      // Newlines to line breaks (outside pre)
      .replace(/\n\n/g, '<div style="height:0.5rem"></div>');

    return parsed;
  }
};
