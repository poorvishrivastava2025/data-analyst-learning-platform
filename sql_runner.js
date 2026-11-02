// sql_runner.js - Interactive SQL Query Sandbox against Live SQLite Practice Tables
const SqlRunner = {
  activeQuery: "SELECT o.order_id, c.full_name, p.product_name, o.total_amount, o.shipping_region \nFROM orders o \nJOIN customers c ON o.customer_id = c.customer_id \nJOIN products p ON o.product_id = p.product_id \nWHERE o.total_amount > 10000 \nORDER BY o.total_amount DESC \nLIMIT 10;",

  renderSandbox(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const initialCode = options.initialCode || this.activeQuery;
    const isHi = State.language === 'hinglish';

    container.innerHTML = `
      <div class="practice-container">
        <div class="practice-header">
          <div class="practice-title">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>
            <span>${isHi ? 'लाइव एसक्यूएल क्वेरी कंसोल (Live SQLite Runner)' : 'Interactive SQLite Console'}</span>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <select id="sample-query-select" style="background:#0f172a; color:#cbd5e1; border:1px solid #334155; border-radius:4px; padding:3px 8px; font-size:0.75rem;">
              <option value="">${isHi ? '📋 सैंपल क्वेरीज...' : '📋 Sample Queries...'}</option>
              <option value="1">High-Value Orders (> ₹15,000)</option>
              <option value="2">Revenue by Product Category</option>
              <option value="3">Customers without orders (LEFT JOIN)</option>
              <option value="4">Employee Churn by Department</option>
            </select>
          </div>
        </div>

        <textarea id="sql-query-input" class="practice-textarea" rows="5" spellcheck="false">${initialCode}</textarea>

        <div class="practice-toolbar">
          <div style="display:flex; gap:0.5rem; align-items:center;">
            <button id="run-sql-btn" class="btn btn-primary btn-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>${State.t('runQuery')}</span>
            </button>
            <button id="ai-review-sql-btn" class="btn btn-secondary btn-sm" style="color:white; border-color:#475569;">
              <span>🤖 ${State.t('aiReviewCode')}</span>
            </button>
          </div>
          <div id="sql-execution-badge" style="font-size:0.75rem; color:#94a3b8;">
            Tables available: <code>orders</code>, <code>customers</code>, <code>products</code>, <code>employee_churn</code>
          </div>
        </div>

        <div id="sql-results-area" class="practice-output">
          <div style="color:#64748b; font-style:italic;">
            ${isHi ? 'क्वेरी चलाने के लिए "Run SQL Query" बटन दबाएं।' : 'Click "Run SQL Query" to execute against the live database.'}
          </div>
        </div>
      </div>
    `;

    // Bind event handlers
    const runBtn = document.getElementById('run-sql-btn');
    const reviewBtn = document.getElementById('ai-review-sql-btn');
    const select = document.getElementById('sample-query-select');
    const textarea = document.getElementById('sql-query-input');

    if (runBtn) {
      runBtn.addEventListener('click', () => this.executeSql(options.expectedQuery));
    }

    if (reviewBtn) {
      reviewBtn.addEventListener('click', async () => {
        const query = textarea.value.trim();
        const review = await API.reviewCode('sql', query, options.instruction || 'Practice query', State.language);
        Tutor.askPrompt(`Please review my SQL query:\n\`\`\`sql\n${query}\n\`\`\``);
      });
    }

    if (select) {
      select.addEventListener('change', (e) => {
        const val = e.target.value;
        if (val === '1') {
          textarea.value = "SELECT order_id, customer_id, total_amount, shipping_region \nFROM orders \nWHERE total_amount > 15000 \nORDER BY total_amount DESC;";
        } else if (val === '2') {
          textarea.value = "SELECT p.category, COUNT(o.order_id) AS total_orders, SUM(o.total_amount) AS category_revenue \nFROM orders o \nJOIN products p ON o.product_id = p.product_id \nGROUP BY p.category \nORDER BY category_revenue DESC;";
        } else if (val === '3') {
          textarea.value = "SELECT c.customer_id, c.full_name, c.city, o.order_id \nFROM customers c \nLEFT JOIN orders o ON c.customer_id = o.customer_id \nWHERE o.order_id IS NULL;";
        } else if (val === '4') {
          textarea.value = "SELECT department, COUNT(*) AS total_staff, SUM(left_company) AS departed_staff, AVG(monthly_salary) AS avg_salary \nFROM employee_churn \nGROUP BY department;";
        }
      });
    }
  },

  async executeSql(expectedQuery = null) {
    const input = document.getElementById('sql-query-input');
    const resultsArea = document.getElementById('sql-results-area');
    const badge = document.getElementById('sql-execution-badge');
    if (!input || !resultsArea) return;

    const query = input.value.trim();
    if (!query) return;

    resultsArea.innerHTML = `<div style="color:#38bdf8;">Executing query on SQLite database... ⏳</div>`;

    try {
      const data = await API.runSql(query, expectedQuery);
      if (badge) {
        badge.innerHTML = `Returned <strong>${data.totalRows} rows</strong> in <strong>${data.executionTimeMs} ms</strong>`;
      }

      let matchFeedbackHtml = '';
      if (data.feedback) {
        matchFeedbackHtml = `
          <div style="padding:0.75rem; border-radius:6px; margin-bottom:0.75rem; background:${data.isMatch ? '#064e3b' : '#451a03'}; color:${data.isMatch ? '#6ee7b7' : '#fdba74'}; font-size:0.85rem;">
            ${data.feedback}
          </div>
        `;
      }

      if (data.rows.length === 0) {
        resultsArea.innerHTML = `
          ${matchFeedbackHtml}
          <div style="color:#94a3b8; font-style:italic;">Query executed successfully with 0 rows returned matching the criteria.</div>
        `;
        return;
      }

      const tableHtml = `
        ${matchFeedbackHtml}
        <div class="data-table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                ${data.columns.map(col => `<th>${col}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.rows.map(row => `
                <tr>
                  ${data.columns.map(col => `<td>${row[col] !== null ? row[col] : '<span style="color:#ef4444;">NULL</span>'}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      resultsArea.innerHTML = tableHtml;
    } catch (err) {
      if (badge) badge.innerText = 'Query Error';
      resultsArea.innerHTML = `
        <div style="color:#f87171; background:#450a0a; padding:0.75rem; border-radius:6px;">
          <strong>Error:</strong> ${err.message}
        </div>
      `;
    }
  }
};
