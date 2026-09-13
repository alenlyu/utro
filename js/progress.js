/* progress.js — renders the Progress page: streak, totals, per-category
 * performance, and a simple 7-day SVG bar chart. No external chart library.
 */
const ProgressPage = (() => {

  function svgBarChart(history) {
    const width = 320, height = 120, barGap = 8;
    const days = history.slice(-7);
    const n = Math.max(days.length, 1);
    const barWidth = (width - barGap * (n - 1)) / n;
    const max = 100;
    let bars = '';
    days.forEach((d, i) => {
      const h = Math.max(4, (d.avgScore / max) * (height - 24));
      const x = i * (barWidth + barGap);
      const y = height - h - 18;
      bars += `<rect x="${x}" y="${y}" width="${barWidth}" height="${h}" rx="6" fill="var(--accent)"></rect>`;
      const label = new Date(d.date).toLocaleDateString(undefined, { weekday: 'short' })[0];
      bars += `<text x="${x + barWidth / 2}" y="${height - 4}" text-anchor="middle" class="chart-label">${label}</text>`;
    });
    if (days.length === 0) {
      return `<svg viewBox="0 0 ${width} ${height}" class="chart-svg"><text x="${width/2}" y="${height/2}" text-anchor="middle" class="chart-empty">No sessions yet</text></svg>`;
    }
    return `<svg viewBox="0 0 ${width} ${height}" class="chart-svg">${bars}</svg>`;
  }

  function categoryBars(catAverages) {
    const labels = { memory: 'Memory', attention: 'Attention', motor: 'Reaction', reasoning: 'Critical Thinking', french: 'French' };
    return Object.entries(labels).map(([key, label]) => {
      const val = catAverages[key] || 0;
      return `
        <div class="cat-bar-row">
          <div class="cat-bar-label">${label}</div>
          <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${val}%"></div></div>
          <div class="cat-bar-value">${val ? val + '%' : '—'}</div>
        </div>`;
    }).join('');
  }

  function computeCategoryAverages() {
    const progress = Storage.getProgress();
    const recent = progress.sessionHistory.slice(-7);
    const sums = {}, counts = {};
    recent.forEach((s) => {
      Object.entries(s.categories || {}).forEach(([k, v]) => {
        sums[k] = (sums[k] || 0) + v; counts[k] = (counts[k] || 0) + 1;
      });
    });
    const avgs = {};
    Object.keys(sums).forEach((k) => { avgs[k] = Math.round(sums[k] / counts[k]); });
    return avgs;
  }

  function render(container) {
    const progress = Storage.getProgress();
    const catAverages = computeCategoryAverages();
    const totalMinutes = Math.round(progress.sessionHistory.reduce((a, s) => a + (s.durationSec || 0), 0) / 60);
    const avgScoreAll = progress.sessionHistory.length
      ? Math.round(progress.sessionHistory.reduce((a, s) => a + s.avgScore, 0) / progress.sessionHistory.length)
      : 0;

    const flashcards = Flashcards.all();
    const known = flashcards.filter((c) => c.status === 'known').length;

    container.innerHTML = `
      <div class="page-header"><h1>Progress</h1></div>
      <div class="stat-grid">
        <div class="stat-card"><div class="stat-value">${progress.streak}</div><div class="stat-label">day streak</div></div>
        <div class="stat-card"><div class="stat-value">${progress.totalSessions}</div><div class="stat-label">sessions</div></div>
        <div class="stat-card"><div class="stat-value">${avgScoreAll}%</div><div class="stat-label">avg score</div></div>
        <div class="stat-card"><div class="stat-value">${totalMinutes}</div><div class="stat-label">minutes trained</div></div>
      </div>

      <div class="card">
        <h3>Last 7 days</h3>
        ${svgBarChart(progress.sessionHistory)}
      </div>

      <div class="card">
        <h3>By category (7-day average)</h3>
        ${categoryBars(catAverages)}
      </div>

      <div class="card">
        <h3>French vocabulary</h3>
        <div class="cat-bar-row">
          <div class="cat-bar-label">Cards known</div>
          <div class="cat-bar-value">${known} / ${flashcards.length}</div>
        </div>
      </div>
    `;
  }

  return { render };
})();
