// excel_evaluator.js - Interactive Formula Tester & Simulated Spreadsheet Grid
const ExcelEvaluator = {
  sampleSheet: [
    { A: "Cust_ID", B: "Name", C: "Region", D: "Order_Val", E: "Status" },
    { A: "101", B: "Aarav Sharma", C: "West", D: 15198, E: "Completed" },
    { A: "102", B: "Priya Patel", C: "West", D: 48450, E: "Completed" },
    { A: "103", B: "Rohan Gupta", C: "North", D: 22499, E: "Pending" },
    { A: "104", B: "Ananya Iyer", C: "South", D: 11997, E: "Completed" },
    { A: "105", B: "Vikram Malhotra", C: "West", D: 8999, E: "Completed" }
  ],

  render(containerId, initialFormula = "=XLOOKUP(102, A2:A6, B2:B6)") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const isHi = State.language === 'hinglish';

    container.innerHTML = `
      <div class="card" style="margin: 1.5rem 0; border: 1px solid var(--border);">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem;">
          <h4 style="font-weight:700; display:flex; align-items:center; gap:0.5rem;">
            <span>📗</span>
            <span>${isHi ? 'लाइव एक्सेल फॉर्मूला सैंडबॉक्स (Excel Formula Sandbox)' : 'Interactive Excel Formula Sandbox'}</span>
          </h4>
          <span class="badge badge-blue">Excel 365 Grid</span>
        </div>

        <!-- Formula Bar -->
        <div style="display:flex; align-items:center; gap:0.5rem; background:var(--bg-surface); padding:0.5rem; border-radius:var(--radius-sm); border:1px solid var(--border); margin-bottom:1rem;">
          <span style="font-weight:700; color:var(--text-muted); font-size:0.9rem;">fx</span>
          <input type="text" id="excel-formula-bar" value="${initialFormula}" style="flex:1; border:none; background:none; outline:none; font-family:var(--font-mono); font-size:0.875rem;" placeholder="e.g. =XLOOKUP(102, A2:A6, B2:B6) or =SUMIFS(D2:D6, C2:C6, 'West')">
          <button id="excel-eval-btn" class="btn btn-primary btn-sm">${State.t('evalFormula')}</button>
        </div>

        <!-- Formula Output Alert -->
        <div id="excel-result-box" style="display:none; padding:0.75rem 1rem; border-radius:var(--radius-sm); background:var(--success-light); border:1px solid var(--success); margin-bottom:1rem; font-size:0.85rem;">
        </div>

        <!-- Grid Table -->
        <div style="overflow-x:auto;">
          <table style="width:100%; border-collapse:collapse; font-size:0.8rem; font-family:var(--font-mono);">
            <thead>
              <tr style="background:#e2e8f0; color:#475569;">
                <th style="padding:4px 8px; border:1px solid #cbd5e1; width:35px; text-align:center;">#</th>
                <th style="padding:4px 8px; border:1px solid #cbd5e1; text-align:center;">A</th>
                <th style="padding:4px 8px; border:1px solid #cbd5e1; text-align:center;">B</th>
                <th style="padding:4px 8px; border:1px solid #cbd5e1; text-align:center;">C</th>
                <th style="padding:4px 8px; border:1px solid #cbd5e1; text-align:center;">D</th>
                <th style="padding:4px 8px; border:1px solid #cbd5e1; text-align:center;">E</th>
              </tr>
            </thead>
            <tbody>
              ${this.sampleSheet.map((row, idx) => `
                <tr style="background:${idx === 0 ? '#f8fafc' : '#ffffff'}; font-weight:${idx === 0 ? '700' : '400'};">
                  <td style="background:#f1f5f9; padding:4px 8px; border:1px solid #cbd5e1; text-align:center; color:#64748b;">${idx + 1}</td>
                  <td style="padding:4px 8px; border:1px solid #cbd5e1;">${row.A}</td>
                  <td style="padding:4px 8px; border:1px solid #cbd5e1;">${row.B}</td>
                  <td style="padding:4px 8px; border:1px solid #cbd5e1;">${row.C}</td>
                  <td style="padding:4px 8px; border:1px solid #cbd5e1; text-align:right;">${typeof row.D === 'number' ? '₹' + row.D.toLocaleString('en-IN') : row.D}</td>
                  <td style="padding:4px 8px; border:1px solid #cbd5e1;">${row.E}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;

    const btn = document.getElementById('excel-eval-btn');
    const input = document.getElementById('excel-formula-bar');

    if (btn && input) {
      btn.addEventListener('click', () => this.evaluate(input.value));
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.evaluate(input.value);
      });
    }
  },

  async evaluate(formula) {
    const resultBox = document.getElementById('excel-result-box');
    if (!resultBox) return;

    try {
      const res = await API.evalExcel(formula);
      resultBox.style.display = 'block';
      resultBox.innerHTML = `
        <div style="font-weight:700; color:#065f46;">✅ Calculated Result: <span style="font-size:1.05rem;">${res.calculatedValue}</span></div>
        <div style="color:#047857; margin-top:0.25rem;">${res.explanation}</div>
      `;
    } catch (err) {
      resultBox.style.display = 'block';
      resultBox.style.background = '#fef2f2';
      resultBox.style.borderColor = '#ef4444';
      resultBox.innerHTML = `<span style="color:#b91c1c;">⚠️ Formula Error: ${err.message}</span>`;
    }
  }
};
