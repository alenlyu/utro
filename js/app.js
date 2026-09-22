/* app.js — wires together storage, exercises, and pages. Registers routes
 * with Router and builds each screen's DOM. Kept as plain functions (no
 * framework) that render into whatever container they're given.
 */
(function () {

  const NAV_ITEMS = [
    { route: 'home', label: 'Home', icon: '⌂' },
    { route: 'train', label: 'Train', icon: '◎' },
    { route: 'french', label: 'French', icon: 'Fr' },
    { route: 'progress', label: 'Progress', icon: '▤' },
    { route: 'settings', label: 'Settings', icon: '⚙' }
  ];

  const CATEGORY_META = {
    memory:    { label: 'Memory', exercises: ['memory_sequence', 'spatial_memory', 'digit_span', 'matching_pairs', 'word_recall'] },
    attention: { label: 'Attention', exercises: ['stroop', 'visual_search', 'sustained', 'change_detection', 'divided_attention'] },
    motor:     { label: 'Reaction', exercises: ['reaction', 'target_tracking', 'sequence_tapping', 'aim_trainer', 'rhythm_tap'] },
    reasoning: { label: 'Critical Thinking', exercises: ['logic_patterns', 'deduction', 'assumption', 'fact_opinion', 'probability', 'analogies', 'odd_one_out', 'cognitive_bias', 'causal_reasoning', 'conditional_logic'] },
    french:    { label: 'French', exercises: ['french_grammar', 'french_fillblank', 'french_ordering', 'french_listening', 'verb_conjugation'] }
  };

  function fmtDate(d) {
    return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
  }
  function greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }

  // ---- Today's session plan cache (regenerated once per calendar day) -----
  function getTodaysPlan() {
    const today = Storage.todayStr();
    const cached = Storage.get('todaySessionPlan', null);
    if (cached && cached.date === today) return cached.plan;
    const settings = Storage.getSettings();
    const plan = Exercises.generateSession(settings.sessionLength);
    Storage.set('todaySessionPlan', { date: today, plan });
    return plan;
  }

  // ============================= HOME =======================================
  function renderHome(container) {
    const settings = Storage.getSettings();
    const progress = Storage.getProgress();
    const plan = getTodaysPlan();
    const today = Storage.todayStr();
    const trainedToday = progress.lastSessionDate === today;
    const totalMin = Math.max(1, Math.round(plan.reduce((s, p) => s + p.durationSec, 0) / 60));

    const stepsHtml = plan.map((p, i) => {
      const meta = Exercises.get(p.exerciseId);
      return `<div class="category-chip">${i + 1}. ${meta.name} — ${Math.round(p.durationSec / 60) || 1} min</div>`;
    }).join('');

    const lastSession = progress.sessionHistory[progress.sessionHistory.length - 1];
    const snapshotHtml = (trainedToday && lastSession)
      ? Object.entries(lastSession.categories).slice(0, 3).map(([k, v]) => `
          <div class="snapshot-item">
            <div class="snapshot-value">${v}%</div>
            <div class="snapshot-label">${Exercises.CATEGORY_LABELS[k] || k}</div>
          </div>`).join('')
      : `<p class="page-sub">No session yet today — your brain is ready when you are.</p>`;

    const recent = progress.sessionHistory.slice(-7);
    const maxScore = 100;
    const miniBars = recent.length ? recent.map((s) => `
        <div class="mini-bar"><div class="mini-bar-fill" style="height:${Math.max(8, (s.avgScore / maxScore) * 100)}%"></div></div>
      `).join('') : '<p class="page-sub">Your progress bars will appear here after your first session.</p>';

    container.innerHTML = `
      <div class="home-hero">
        <div class="home-greeting">${greeting()}</div>
        <div class="home-date">${fmtDate(new Date())}</div>
        <div class="home-tagline">Train your brain before you feed it information.</div>
        <div class="session-length-pill">${totalMin} minute morning session</div>
        <div class="category-chip-row">${stepsHtml}</div>
        <button class="btn btn-primary btn-block btn-large" id="start-session-btn" style="margin-top:18px;">
          ${trainedToday ? 'Train again' : `Start ${totalMin} min session`}
        </button>
        <div class="streak-row"><span class="streak-flame">🔥</span> ${progress.streak}-day streak</div>
      </div>

      <div class="card">
        <h3>Today</h3>
        <div class="snapshot-grid">${snapshotHtml}</div>
      </div>

      <div class="card">
        <h3>Recent progress</h3>
        <div class="mini-bars">${miniBars}</div>
      </div>
    `;

    container.querySelector('#start-session-btn').addEventListener('click', () => Router.navigate('session'));
  }

  // ============================= TRAIN (browse) ==============================
  function renderTrain(container) {
    container.innerHTML = `<div class="page-header"><h1>Train</h1><p class="page-sub">Practice any skill on its own, any time.</p></div>`;
    Object.entries(CATEGORY_META).forEach(([catKey, cat]) => {
      const section = document.createElement('div');
      section.className = 'category-section';
      section.innerHTML = `<div class="category-title-row"><h2>${cat.label}</h2></div>`;
      const list = document.createElement('div');
      list.className = 'exercise-list';
      cat.exercises.forEach((id) => {
        const meta = Exercises.get(id);
        const level = Exercises.getLevel(id);
        const row = document.createElement('div');
        row.className = 'exercise-row';
        row.innerHTML = `<div><div class="exercise-row-name">${meta.name}</div><div class="exercise-row-level">Level ${level}</div></div>`;
        const btn = document.createElement('button');
        btn.className = 'btn btn-secondary';
        btn.textContent = 'Practice';
        btn.addEventListener('click', () => practiceSingleExercise(id));
        row.appendChild(btn);
        list.appendChild(row);
      });
      section.appendChild(list);
      container.appendChild(section);
    });
  }

  function practiceSingleExercise(exerciseId, backRoute) {
    backRoute = backRoute || 'train';
    const root = document.getElementById('view-root');
    root.innerHTML = '';
    const meta = Exercises.get(exerciseId);
    const wrap = document.createElement('div');
    const backBtn = document.createElement('button');
    backBtn.className = 'btn btn-secondary';
    backBtn.textContent = '← Back';
    backBtn.style.marginBottom = '14px';
    backBtn.addEventListener('click', () => Router.navigate(backRoute));
    root.appendChild(backBtn);
    root.appendChild(wrap);

    const level = Exercises.getLevel(exerciseId);
    meta.run(wrap, { level, durationSec: meta.defaultSec }, (result) => {
      const score = result.score != null ? result.score : Exercises.computeScore(result.accuracy || 0, result.reactionTimeMs);
      Storage.saveExerciseResult(exerciseId, {
        score, accuracy: result.accuracy, reactionTimeMs: result.reactionTimeMs, difficulty: level, duration: meta.defaultSec
      });
      Exercises.adjustDifficulty(exerciseId, result.accuracy != null ? result.accuracy : score / 100);
      const doneBtn = document.createElement('button');
      doneBtn.className = 'btn btn-primary btn-block';
      doneBtn.style.marginTop = '16px';
      doneBtn.textContent = 'Back';
      doneBtn.addEventListener('click', () => Router.navigate(backRoute));
      root.appendChild(doneBtn);
    });
  }

  // ============================= SESSION (guided) =============================
  function renderSession(container) {
    const plan = getTodaysPlan();
    container.innerHTML = `
      <div class="session-progress-bar"><div class="session-progress-fill" id="session-progress-fill" style="width:0%"></div></div>
      <div class="session-step-label" id="session-step-label"></div>
      <div id="session-exercise-root"></div>
    `;
    const fill = container.querySelector('#session-progress-fill');
    const stepLabel = container.querySelector('#session-step-label');
    const exRoot = container.querySelector('#session-exercise-root');

    Exercises.runSession(exRoot, plan, {
      onStepStart: (step, index, total) => {
        const meta = Exercises.get(step.exerciseId);
        stepLabel.textContent = `Step ${index + 1} of ${total} · ${meta.name}`;
        fill.style.width = Math.round((index / total) * 100) + '%';
      },
      onSessionComplete: ({ results, categoryAverages }) => {
        fill.style.width = '100%';
        renderSessionComplete(container, results, categoryAverages);
      }
    });
  }

  function renderSessionComplete(container, results, categoryAverages) {
    AudioFx.complete();
    const totalMin = Math.round(results.reduce((s, r) => s + (r.duration || 0), 0) / 60) || 1;
    const rows = Object.entries(categoryAverages).map(([k, v]) => `
      <div class="complete-score-row"><span>${Exercises.CATEGORY_LABELS[k] || k}</span><strong>${v}%</strong></div>
    `).join('');

    container.innerHTML = `
      <div class="complete-hero">
        <div class="big-check">✓</div>
        <h1>Nice work.</h1>
        <p class="page-sub">${totalMin} minutes completed.</p>
      </div>
      <div class="complete-scores">${rows}</div>
      <div class="card reflection-box">
        <h3>Before you go</h3>
        <p class="page-sub" style="margin-bottom:8px;">What is one thing you want to accomplish today?</p>
        <textarea id="reflect-accomplish" placeholder="Type a short answer…"></textarea>
      </div>
      <button class="btn btn-primary btn-block btn-large" id="finish-btn" style="margin-top:8px;">You're done — go start your day</button>
    `;

    container.querySelector('#finish-btn').addEventListener('click', () => {
      const text = container.querySelector('#reflect-accomplish').value.trim();
      if (text) Storage.addReflection({ accomplish: text });
      Router.navigate('home');
    });
  }

  // ============================= FRENCH =============================
  let frenchTab = 'practice';
  function renderFrench(container) {
    container.innerHTML = `
      <div class="page-header"><h1>Français</h1></div>
      <div class="tab-row" id="french-tabs">
        <button class="tab-btn" data-tab="practice">Practice</button>
        <button class="tab-btn" data-tab="flashcards">Flashcards</button>
        <button class="tab-btn" data-tab="speaking">Speaking</button>
      </div>
      <div id="french-tab-body"></div>
    `;
    const tabs = container.querySelectorAll('.tab-btn');
    const body = container.querySelector('#french-tab-body');

    function selectTab(tab) {
      frenchTab = tab;
      tabs.forEach((t) => t.classList.toggle('tab-active', t.dataset.tab === tab));
      body.innerHTML = '';
      if (tab === 'practice') renderFrenchPractice(body);
      if (tab === 'flashcards') renderFrenchFlashcards(body);
      if (tab === 'speaking') renderFrenchSpeaking(body);
    }
    tabs.forEach((t) => t.addEventListener('click', () => selectTab(t.dataset.tab)));
    selectTab(frenchTab);
  }

  function renderFrenchPractice(body) {
    const list = document.createElement('div');
    list.className = 'exercise-list';
    CATEGORY_META.french.exercises.forEach((id) => {
      const meta = Exercises.get(id);
      const row = document.createElement('div');
      row.className = 'exercise-row';
      row.innerHTML = `<div class="exercise-row-name">${meta.name}</div>`;
      const btn = document.createElement('button');
      btn.className = 'btn btn-secondary';
      btn.textContent = 'Practice';
      btn.addEventListener('click', () => practiceSingleExercise(id, 'french'));
      row.appendChild(btn);
      list.appendChild(row);
    });
    body.appendChild(list);
  }

  function renderFrenchFlashcards(body) {
    Flashcards.seedIfEmpty();
    const due = Flashcards.dueToday();
    let idx = 0, flipped = false;

    const reviewCard = document.createElement('div');
    body.appendChild(reviewCard);

    function showCurrent() {
      flipped = false;
      if (idx >= due.length) {
        reviewCard.innerHTML = `<div class="card empty-state">All caught up for today. 🎉<br>Add more cards below.</div>`;
        renderManageSection();
        return;
      }
      const c = due[idx];
      reviewCard.innerHTML = `
        <div class="card-alt-wrap"></div>
        <div class="flashcard-view">
          <div class="flashcard" id="fc-card">
            <div class="flashcard-front">${c.front}</div>
          </div>
          <div class="flashcard-controls" id="fc-rate" style="display:none;">
            <button class="btn rating-again" data-r="again">Again</button>
            <button class="btn" data-r="hard">Hard</button>
            <button class="btn" data-r="good">Good</button>
            <button class="btn rating-easy" data-r="easy">Easy</button>
          </div>
          <button class="btn btn-block" id="fc-flip" style="margin-top:10px;">Show answer</button>
        </div>
        <p class="page-sub">Card ${idx + 1} of ${due.length}</p>
      `;
      reviewCard.querySelector('#fc-flip').addEventListener('click', () => {
        if (flipped) return;
        flipped = true;
        const cardEl = reviewCard.querySelector('#fc-card');
        cardEl.innerHTML = `
          <div class="flashcard-front">${c.front}</div>
          <div class="flashcard-back">${c.back}</div>
          ${c.example ? `<div class="flashcard-example">${c.example}</div>` : ''}
        `;
        reviewCard.querySelector('#fc-rate').style.display = 'flex';
        reviewCard.querySelector('#fc-flip').style.display = 'none';
      });
      reviewCard.querySelectorAll('[data-r]').forEach((b) => {
        b.addEventListener('click', () => {
          Flashcards.review(c.id, b.dataset.r);
          idx += 1;
          showCurrent();
        });
      });
      renderManageSection();
    }

    function renderManageSection() {
      let manageEl = body.querySelector('#fc-manage');
      if (manageEl) manageEl.remove();
      manageEl = document.createElement('div');
      manageEl.id = 'fc-manage';
      manageEl.className = 'card';
      manageEl.innerHTML = `<h3>Your cards</h3><div id="fc-list"></div>
        <button class="btn btn-secondary btn-block" id="fc-add-btn" style="margin-top:10px;">+ Add a card</button>
        <div id="fc-form-wrap"></div>`;
      body.appendChild(manageEl);
      renderFcList(manageEl.querySelector('#fc-list'));
      manageEl.querySelector('#fc-add-btn').addEventListener('click', () => renderFcForm(manageEl.querySelector('#fc-form-wrap')));
    }

    function renderFcList(listEl) {
      const cards = Flashcards.all();
      if (!cards.length) { listEl.innerHTML = '<p class="page-sub">No cards yet.</p>'; return; }
      listEl.innerHTML = cards.map((c) => `
        <div class="fc-list-item">
          <div>
            <div>${c.front} — ${c.back}</div>
            <div class="fc-list-meta">${c.category} · due ${c.dueDate}</div>
          </div>
          <div class="fc-list-actions">
            <button data-edit="${c.id}">Edit</button>
            <button data-del="${c.id}">Delete</button>
          </div>
        </div>`).join('');
      listEl.querySelectorAll('[data-del]').forEach((b) => b.addEventListener('click', () => {
        Flashcards.remove(b.dataset.del);
        renderFrenchFlashcards(body);
      }));
      listEl.querySelectorAll('[data-edit]').forEach((b) => b.addEventListener('click', () => {
        const card = Flashcards.all().find((c) => c.id === b.dataset.edit);
        renderFcForm(body.querySelector('#fc-form-wrap'), card);
      }));
    }

    function renderFcForm(wrap, existing) {
      wrap.innerHTML = `
        <div class="card-form">
          <label>French</label><input id="f-front" value="${existing ? existing.front : ''}">
          <label>Meaning</label><input id="f-back" value="${existing ? existing.back : ''}">
          <label>Example (optional)</label><input id="f-example" value="${existing ? existing.example : ''}">
          <label>Category</label><input id="f-category" value="${existing ? existing.category : 'Vocabulary'}">
          <label>Notes (optional)</label><textarea id="f-notes">${existing ? existing.notes : ''}</textarea>
          <button class="btn btn-primary btn-block" id="f-save" style="margin-top:12px;">${existing ? 'Save changes' : 'Add card'}</button>
        </div>`;
      wrap.querySelector('#f-save').addEventListener('click', () => {
        const data = {
          front: wrap.querySelector('#f-front').value.trim(),
          back: wrap.querySelector('#f-back').value.trim(),
          example: wrap.querySelector('#f-example').value.trim(),
          category: wrap.querySelector('#f-category').value.trim() || 'General',
          notes: wrap.querySelector('#f-notes').value.trim()
        };
        if (!data.front || !data.back) return;
        if (existing) Flashcards.update(existing.id, data); else Flashcards.add(data);
        renderFrenchFlashcards(body);
      });
    }

    showCurrent();
  }

  function renderFrenchSpeaking(body) {
    let currentItem = FrenchListeningItems[Math.floor(Math.random() * FrenchListeningItems.length)];
    let recordedUrl = null;

    function render() {
      body.innerHTML = `
        <div class="card">
          <h3>Listen &amp; repeat</h3>
          <div class="question-quote">${currentItem.text}</div>
          <p class="page-sub">${currentItem.translation}</p>
          <div class="record-controls">
            <button class="btn" id="sp-play">🔊 Play</button>
            <button class="btn btn-secondary" id="sp-next">Next phrase</button>
          </div>
        </div>
        <div class="card">
          <h3>Record yourself</h3>
          ${Recorder.supported
            ? `<div class="record-controls">
                 <button class="btn btn-primary" id="sp-record">● Record</button>
                 <button class="btn" id="sp-stop" disabled>■ Stop</button>
                 <button class="btn" id="sp-playback" disabled>▶ Play back</button>
                 <button class="btn btn-secondary" id="sp-delete" disabled>Delete</button>
               </div>
               <p class="page-sub" id="sp-status" style="margin-top:8px;"></p>`
            : `<p class="page-sub">Recording isn't supported in this browser.</p>`}
        </div>
      `;
      body.querySelector('#sp-play').addEventListener('click', () => Speech.speakFrench(currentItem.text));
      body.querySelector('#sp-next').addEventListener('click', () => {
        currentItem = FrenchListeningItems[Math.floor(Math.random() * FrenchListeningItems.length)];
        recordedUrl = null;
        render();
      });

      if (Recorder.supported) {
        const recordBtn = body.querySelector('#sp-record');
        const stopBtn = body.querySelector('#sp-stop');
        const playbackBtn = body.querySelector('#sp-playback');
        const deleteBtn = body.querySelector('#sp-delete');
        const status = body.querySelector('#sp-status');
        let audioEl = null;

        recordBtn.addEventListener('click', async () => {
          try {
            await Recorder.start();
            status.textContent = 'Recording…';
            recordBtn.disabled = true; stopBtn.disabled = false;
          } catch (e) {
            status.textContent = 'Microphone access was denied or unavailable.';
          }
        });
        stopBtn.addEventListener('click', async () => {
          recordedUrl = await Recorder.stop();
          status.textContent = 'Recording saved for this session.';
          recordBtn.disabled = false; stopBtn.disabled = true; playbackBtn.disabled = false; deleteBtn.disabled = false;
        });
        playbackBtn.addEventListener('click', () => {
          if (!recordedUrl) return;
          if (audioEl) audioEl.pause();
          audioEl = new Audio(recordedUrl);
          audioEl.play();
        });
        deleteBtn.addEventListener('click', () => {
          recordedUrl = null;
          status.textContent = 'Recording deleted.';
          playbackBtn.disabled = true; deleteBtn.disabled = true;
        });
      }
    }
    render();
  }

  // ============================= SETTINGS =============================
  function renderSettings(container) {
    const settings = Storage.getSettings();
    container.innerHTML = `
      <div class="page-header"><h1>Settings</h1></div>

      <div class="card">
        <div class="settings-row">
          <div><div class="settings-label">Theme</div></div>
          <div class="segmented" id="seg-theme">
            <button data-v="light" class="${settings.theme === 'light' ? 'seg-active' : ''}">Light</button>
            <button data-v="dark" class="${settings.theme === 'dark' ? 'seg-active' : ''}">Dark</button>
            <button data-v="system" class="${settings.theme === 'system' ? 'seg-active' : ''}">System</button>
          </div>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Sound</div><div class="settings-sub">Subtle feedback tones</div></div>
          <button class="toggle ${settings.sound ? 'on' : ''}" id="toggle-sound" aria-label="Toggle sound"></button>
        </div>
        <div class="settings-row">
          <div><div class="settings-label">Reduced motion</div></div>
          <button class="toggle ${settings.reducedMotion ? 'on' : ''}" id="toggle-motion" aria-label="Toggle reduced motion"></button>
        </div>
      </div>

      <div class="card">
        <div class="settings-row">
          <div><div class="settings-label">Daily session length</div></div>
        </div>
        <div class="segmented" id="seg-length">
          ${[5, 10, 15, 20].map((v) => `<button data-v="${v}" class="${settings.sessionLength === v ? 'seg-active' : ''}">${v} min</button>`).join('')}
        </div>
      </div>

      <div class="card">
        <div class="settings-row"><div><div class="settings-label">Difficulty</div></div></div>
        <div class="segmented" id="seg-difficulty">
          ${['adaptive', 'easy', 'medium', 'hard'].map((v) => `<button data-v="${v}" class="${settings.difficultyMode === v ? 'seg-active' : ''}">${v[0].toUpperCase() + v.slice(1)}</button>`).join('')}
        </div>
      </div>

      <div class="card">
        <h3>Your data</h3>
        <button class="btn btn-secondary btn-block" id="export-btn" style="margin-bottom:8px;">Export data</button>
        <label class="btn btn-secondary btn-block" style="display:block; text-align:center;">
          Import data
          <input type="file" id="import-input" accept="application/json" style="display:none;">
        </label>
      </div>

      <div class="card danger-zone">
        <h3>Reset</h3>
        <button class="btn btn-danger btn-block" id="reset-btn">Reset all progress</button>
      </div>
    `;

    container.querySelector('#seg-theme').addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      Storage.setSettings({ theme: btn.dataset.v });
      applyTheme();
      renderSettings(container);
    });
    container.querySelector('#toggle-sound').addEventListener('click', () => {
      Storage.setSettings({ sound: !Storage.getSettings().sound });
      renderSettings(container);
    });
    container.querySelector('#toggle-motion').addEventListener('click', () => {
      Storage.setSettings({ reducedMotion: !Storage.getSettings().reducedMotion });
      applyReducedMotion();
      renderSettings(container);
    });
    container.querySelector('#seg-length').addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      Storage.setSettings({ sessionLength: Number(btn.dataset.v) });
      Storage.set('todaySessionPlan', null);
      renderSettings(container);
    });
    container.querySelector('#seg-difficulty').addEventListener('click', (e) => {
      const btn = e.target.closest('button'); if (!btn) return;
      Storage.setSettings({ difficultyMode: btn.dataset.v });
      renderSettings(container);
    });
    container.querySelector('#export-btn').addEventListener('click', () => {
      const data = Storage.exportAll();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `brain-morning-backup-${Storage.todayStr()}.json`;
      a.click();
    });
    container.querySelector('#import-input').addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          Storage.importAll(data);
          alert('Data imported. Reloading…');
          location.reload();
        } catch (err) {
          alert('That file could not be read as a valid backup.');
        }
      };
      reader.readAsText(file);
    });
    container.querySelector('#reset-btn').addEventListener('click', () => {
      if (confirm('This will erase all progress, flashcards, and settings on this device. Continue?')) {
        Storage.resetAll();
        location.reload();
      }
    });
  }

  // ============================= THEME / MOTION =============================
  function applyTheme() {
    const settings = Storage.getSettings();
    let theme = settings.theme;
    if (theme === 'system') {
      theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  }
  function applyReducedMotion() {
    const settings = Storage.getSettings();
    document.body.classList.toggle('reduced-motion', !!settings.reducedMotion);
  }

  // ============================= NAV / INIT =============================
  function buildNav() {
    const bottomNav = document.getElementById('bottom-nav');
    const topNav = document.getElementById('top-nav');
    const navEls = [];
    NAV_ITEMS.forEach((item) => {
      const bBtn = document.createElement('button');
      bBtn.className = 'nav-item';
      bBtn.dataset.route = item.route;
      bBtn.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
      bBtn.addEventListener('click', () => Router.navigate(item.route));
      bottomNav.appendChild(bBtn);
      navEls.push(bBtn);

      const tBtn = document.createElement('button');
      tBtn.className = 'nav-item';
      tBtn.dataset.route = item.route;
      tBtn.innerHTML = `<span class="nav-icon">${item.icon}</span><span>${item.label}</span>`;
      tBtn.addEventListener('click', () => Router.navigate(item.route));
      topNav.appendChild(tBtn);
      navEls.push(tBtn);
    });
    Router.setNavElements(navEls);
  }

  function init() {
    applyTheme();
    applyReducedMotion();
    if (window.matchMedia) {
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (Storage.getSettings().theme === 'system') applyTheme();
      });
    }
    Flashcards.seedIfEmpty();
    buildNav();

    Router.register('home', renderHome);
    Router.register('train', renderTrain);
    Router.register('session', renderSession);
    Router.register('french', renderFrench);
    Router.register('progress', (c) => ProgressPage.render(c));
    Router.register('settings', renderSettings);

    Router.start();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
