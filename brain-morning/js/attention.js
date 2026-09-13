/* attention.js — selective attention & inhibitory control exercises */
(function () {

  function clear(container) { container.innerHTML = ''; }
  function header(container, title, sub) {
    const h = document.createElement('div');
    h.className = 'ex-header';
    h.innerHTML = `<h2>${title}</h2>${sub ? `<p class="ex-sub">${sub}</p>` : ''}`;
    container.appendChild(h);
  }
  function showFeedback(container, accuracy, detail) {
    const good = accuracy >= 0.6;
    if (good) AudioFx.success(); else AudioFx.error();
    const fb = document.createElement('div');
    fb.className = 'feedback ' + (good ? 'feedback-good' : 'feedback-bad');
    fb.innerHTML = `<div class="feedback-pct">${Math.round(accuracy * 100)}%</div><div class="feedback-detail">${detail}</div>`;
    container.appendChild(fb);
  }

  // ---- 1. Stroop Test -------------------------------------------------------
  const COLOR_WORDS = [
    { word: 'RED', hex: '#c0554b' }, { word: 'BLUE', hex: '#4a6fa5' },
    { word: 'GREEN', hex: '#5a8a5f' }, { word: 'YELLOW', hex: '#b8963f' },
    { word: 'PURPLE', hex: '#7a5c99' }
  ];

  function runStroop(container, opts, onComplete) {
    clear(container);
    const rounds = 6 + Math.min(6, opts.level);
    header(container, 'Stroop Test', 'Tap the COLOR of the text, not the word itself.');

    const wordDisplay = document.createElement('div');
    wordDisplay.className = 'big-display';
    container.appendChild(wordDisplay);

    const optionsRow = document.createElement('div');
    optionsRow.className = 'option-row';
    container.appendChild(optionsRow);

    let round = 0, correct = 0, reactionTimes = [];
    let roundStart = 0;
    let current;

    function nextRound() {
      if (round >= rounds) return finish();
      const wordObj = COLOR_WORDS[Math.floor(Math.random() * COLOR_WORDS.length)];
      let colorObj = COLOR_WORDS[Math.floor(Math.random() * COLOR_WORDS.length)];
      // At higher levels, force more word/color mismatches (harder inhibition)
      if (opts.level > 2 && Math.random() < 0.8) {
        while (colorObj.word === wordObj.word) colorObj = COLOR_WORDS[Math.floor(Math.random() * COLOR_WORDS.length)];
      }
      current = { wordObj, colorObj };
      wordDisplay.textContent = wordObj.word;
      wordDisplay.style.color = colorObj.hex;
      optionsRow.innerHTML = '';
      shuffle(COLOR_WORDS).forEach((c) => {
        const b = document.createElement('button');
        b.className = 'btn btn-option';
        b.textContent = c.word;
        b.style.borderColor = c.hex;
        b.addEventListener('click', () => answer(c));
        optionsRow.appendChild(b);
      });
      roundStart = performance.now();
    }

    function answer(chosenColorObj) {
      const rt = performance.now() - roundStart;
      reactionTimes.push(rt);
      if (chosenColorObj.hex === current.colorObj.hex) correct += 1;
      round += 1;
      nextRound();
    }

    function finish() {
      const accuracy = correct / rounds;
      const avgRt = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
      wordDisplay.textContent = ''; optionsRow.innerHTML = '';
      showFeedback(container, accuracy, `${correct}/${rounds} correct · avg ${avgRt} ms`);
      onComplete({ accuracy, reactionTimeMs: avgRt, score: Exercises.computeScore(accuracy, avgRt), duration: opts.durationSec });
    }

    nextRound();
  }

  // ---- 2. Visual Search -------------------------------------------------------
  function runVisualSearch(container, opts, onComplete) {
    clear(container);
    const rounds = 4 + Math.min(4, Math.floor(opts.level / 2));
    header(container, 'Visual Search', 'Find and tap the one different symbol.');

    let round = 0, correct = 0, reactionTimes = [];
    const board = document.createElement('div');
    container.appendChild(board);

    function nextRound() {
      if (round >= rounds) return finish();
      board.innerHTML = '';
      const size = Math.min(64, 16 + opts.level * 6 + round * 4);
      const cols = Math.min(10, 5 + Math.floor(Math.sqrt(size)));
      board.className = 'grid visual-search-grid';
      board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      const targetIndex = Math.floor(Math.random() * size);
      const base = '○';
      const odd = '◉';
      for (let i = 0; i < size; i++) {
        const cell = document.createElement('button');
        cell.className = 'vs-cell';
        cell.textContent = i === targetIndex ? odd : base;
        cell.addEventListener('click', () => answer(i === targetIndex));
        board.appendChild(cell);
      }
      roundStart = performance.now();
    }
    let roundStart = 0;

    function answer(isCorrect) {
      const rt = performance.now() - roundStart;
      reactionTimes.push(rt);
      if (isCorrect) correct += 1;
      round += 1;
      nextRound();
    }

    function finish() {
      const accuracy = correct / rounds;
      const avgRt = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
      board.innerHTML = '';
      showFeedback(container, accuracy, `${correct}/${rounds} found · avg ${avgRt} ms`);
      onComplete({ accuracy, reactionTimeMs: avgRt, score: Exercises.computeScore(accuracy, avgRt), duration: opts.durationSec });
    }

    nextRound();
  }

  // ---- 3. Sustained Attention (go / no-go) -------------------------------------
  function runSustained(container, opts, onComplete) {
    clear(container);
    header(container, 'Sustained Attention', 'Tap ONLY when you see the letter O. Ignore X.');
    const display = document.createElement('div');
    display.className = 'big-display';
    container.appendChild(display);
    const tapBtn = document.createElement('button');
    tapBtn.className = 'btn btn-primary tap-target';
    tapBtn.textContent = 'TAP';
    container.appendChild(tapBtn);

    const totalRounds = 16 + Math.min(10, opts.level * 2);
    const intervalMs = Math.max(500, 900 - opts.level * 40);
    let round = 0, hits = 0, misses = 0, falseAlarms = 0, correctRejections = 0;
    let currentIsTarget = false, waitingForTap = false, timer = null;

    function tick() {
      if (round >= totalRounds) return finish();
      round += 1;
      currentIsTarget = Math.random() < 0.35;
      display.textContent = currentIsTarget ? 'O' : 'X';
      waitingForTap = true;
      timer = setTimeout(() => {
        if (waitingForTap) {
          if (currentIsTarget) misses += 1; else correctRejections += 1;
        }
        waitingForTap = false;
        display.textContent = '';
        setTimeout(tick, 180);
      }, intervalMs);
    }

    tapBtn.addEventListener('click', () => {
      if (!waitingForTap) return;
      waitingForTap = false;
      clearTimeout(timer);
      if (currentIsTarget) hits += 1; else falseAlarms += 1;
      display.textContent = '';
      setTimeout(tick, 180);
    });

    function finish() {
      const totalTargets = hits + misses;
      const totalNonTargets = falseAlarms + correctRejections;
      const accuracy = (hits + correctRejections) / (totalTargets + totalNonTargets || 1);
      tapBtn.remove();
      showFeedback(container, accuracy, `${hits} hits · ${falseAlarms} false alarms · ${misses} missed`);
      onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
    }

    tick();
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  Exercises.registerRun('stroop', runStroop);
  Exercises.registerRun('visual_search', runVisualSearch);
  Exercises.registerRun('sustained', runSustained);
})();
