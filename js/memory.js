/* memory.js — working memory & visuospatial memory exercises */
(function () {

  function clear(container) { container.innerHTML = ''; }

  function header(container, title, sub) {
    const h = document.createElement('div');
    h.className = 'ex-header';
    h.innerHTML = `<h2>${title}</h2>${sub ? `<p class="ex-sub">${sub}</p>` : ''}`;
    container.appendChild(h);
    return h;
  }

  function finishBtn(label, onClick) {
    const b = document.createElement('button');
    b.className = 'btn btn-primary';
    b.textContent = label;
    b.addEventListener('click', onClick);
    return b;
  }

  // ---- 1. Memory Sequence: show digits, hide, recall ----------------------
  function runMemorySequence(container, opts, onComplete) {
    clear(container);
    const length = 3 + Math.min(7, opts.level); // level 1 -> 4 digits, scales up
    const digits = Array.from({ length }, () => Math.floor(Math.random() * 10));

    header(container, 'Memory Sequence', 'Memorize the numbers, then type them back in order.');
    const display = document.createElement('div');
    display.className = 'big-display';
    display.textContent = digits.join(' ');
    container.appendChild(display);

    const showMs = 1500 + length * 500;
    setTimeout(() => {
      display.textContent = '';
      const input = document.createElement('input');
      input.type = 'tel';
      input.inputMode = 'numeric';
      input.className = 'ex-input';
      input.placeholder = 'Type the sequence, e.g. 3 8 1 9';
      input.setAttribute('aria-label', 'Enter the number sequence you saw');
      container.appendChild(input);
      input.focus();
      container.appendChild(finishBtn('Submit', submit));

      function submit() {
        const cleaned = input.value.replace(/[^0-9]/g, '').split('');
        let correct = 0;
        digits.forEach((d, i) => { if (String(d) === cleaned[i]) correct += 1; });
        const accuracy = correct / digits.length;
        showFeedback(container, accuracy, `${correct}/${digits.length} correct`);
        onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
      }
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    }, showMs);
  }

  // ---- 2. Spatial Memory: highlighted grid cells ---------------------------
  function runSpatialMemory(container, opts, onComplete) {
    clear(container);
    const gridSize = 4;
    const cellCount = Math.min(9, 3 + Math.floor(opts.level / 1.5));
    header(container, 'Spatial Memory', 'Remember the highlighted tiles, then tap them.');

    const grid = document.createElement('div');
    grid.className = 'grid grid-4';
    const cells = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const c = document.createElement('button');
      c.className = 'grid-cell';
      c.setAttribute('aria-label', `Tile ${i + 1}`);
      grid.appendChild(c);
      cells.push(c);
    }
    container.appendChild(grid);

    const indices = new Set();
    while (indices.size < cellCount) indices.add(Math.floor(Math.random() * cells.length));
    indices.forEach((i) => cells[i].classList.add('active'));

    setTimeout(() => {
      indices.forEach((i) => cells[i].classList.remove('active'));
      const picked = new Set();
      cells.forEach((cell, i) => {
        cell.addEventListener('click', () => {
          if (picked.has(i)) return;
          picked.add(i);
          cell.classList.add(indices.has(i) ? 'correct' : 'incorrect');
          if (picked.size === cellCount) finish();
        });
      });
      function finish() {
        let correct = 0;
        picked.forEach((i) => { if (indices.has(i)) correct += 1; });
        const accuracy = correct / cellCount;
        setTimeout(() => {
          showFeedback(container, accuracy, `${correct}/${cellCount} tiles correct`);
          onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
        }, 400);
      }
    }, 1400 + cellCount * 200);
  }

  // ---- 3. Digit Span: forward / backward ------------------------------------
  function runDigitSpan(container, opts, onComplete) {
    clear(container);
    const length = 3 + Math.min(6, opts.level);
    const backward = opts.level % 2 === 0; // alternate mode as level rises
    const digits = Array.from({ length }, () => Math.floor(Math.random() * 10));
    header(container, 'Digit Span', backward ? 'Memorize, then type the digits in REVERSE order.' : 'Memorize, then type the digits in the same order.');

    const display = document.createElement('div');
    display.className = 'big-display';
    container.appendChild(display);

    let i = 0;
    function showNext() {
      if (i >= digits.length) { display.textContent = ''; askInput(); return; }
      display.textContent = digits[i];
      i += 1;
      setTimeout(showNext, 800);
    }
    setTimeout(showNext, 500);

    function askInput() {
      const input = document.createElement('input');
      input.type = 'tel';
      input.inputMode = 'numeric';
      input.className = 'ex-input';
      input.placeholder = backward ? 'Type in reverse order' : 'Type in order';
      container.appendChild(input);
      input.focus();
      container.appendChild(finishBtn('Submit', submit));

      function submit() {
        const cleaned = input.value.replace(/[^0-9]/g, '').split('');
        const target = backward ? digits.slice().reverse() : digits;
        let correct = 0;
        target.forEach((d, idx) => { if (String(d) === cleaned[idx]) correct += 1; });
        const accuracy = correct / target.length;
        showFeedback(container, accuracy, `${correct}/${target.length} correct`);
        onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
      }
      input.addEventListener('keydown', (e) => { if (e.key === 'Enter') submit(); });
    }
  }

  // ---- 4. Matching Pairs ------------------------------------------------------
  function runMatchingPairs(container, opts, onComplete) {
    clear(container);
    const pairCount = Math.min(8, 4 + Math.floor(opts.level / 2));
    const symbols = ['★','◆','●','▲','■','♥','☀','☂','✿','☾','♫','✚'];
    const chosen = symbols.slice(0, pairCount);
    const deck = shuffle(chosen.concat(chosen)).map((s, i) => ({ id: i, symbol: s, matched: false }));

    header(container, 'Matching Pairs', 'Find all the matching tiles.');
    const grid = document.createElement('div');
    grid.className = 'grid grid-pairs';
    container.appendChild(grid);

    let first = null, second = null, lock = false, errors = 0, matchedCount = 0;
    const startTime = Date.now();

    deck.forEach((card) => {
      const btn = document.createElement('button');
      btn.className = 'card-tile';
      btn.dataset.id = card.id;
      btn.textContent = '?';
      btn.addEventListener('click', () => onFlip(btn, card));
      grid.appendChild(btn);
    });

    function onFlip(btn, card) {
      if (lock || card.matched || btn === first) return;
      btn.textContent = card.symbol;
      btn.classList.add('flipped');
      if (!first) { first = { btn, card }; return; }
      second = { btn, card };
      lock = true;
      if (first.card.symbol === second.card.symbol) {
        first.card.matched = true; second.card.matched = true;
        first.btn.classList.add('matched'); second.btn.classList.add('matched');
        matchedCount += 1;
        first = null; second = null; lock = false;
        if (matchedCount === pairCount) finish();
      } else {
        errors += 1;
        setTimeout(() => {
          first.btn.textContent = '?'; first.btn.classList.remove('flipped');
          second.btn.textContent = '?'; second.btn.classList.remove('flipped');
          first = null; second = null; lock = false;
        }, 700);
      }
    }

    function finish() {
      const elapsedSec = (Date.now() - startTime) / 1000;
      const accuracy = pairCount / (pairCount + errors);
      showFeedback(container, accuracy, `${errors} mistakes · ${Math.round(elapsedSec)}s`);
      onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
    }
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function showFeedback(container, accuracy, detail) {
    const good = accuracy >= 0.6;
    if (good) AudioFx.success(); else AudioFx.error();
    const fb = document.createElement('div');
    fb.className = 'feedback ' + (good ? 'feedback-good' : 'feedback-bad');
    fb.innerHTML = `<div class="feedback-pct">${Math.round(accuracy * 100)}%</div><div class="feedback-detail">${detail}</div>`;
    container.appendChild(fb);
  }

  Exercises.registerRun('memory_sequence', runMemorySequence);
  Exercises.registerRun('spatial_memory', runSpatialMemory);
  Exercises.registerRun('digit_span', runDigitSpan);
  Exercises.registerRun('matching_pairs', runMatchingPairs);
})();
