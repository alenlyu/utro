/* french.js — French language exercises (A2→B1), used both inside the daily
 * session and for standalone practice from the French tab.
 */
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
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
    return a;
  }

  function runQuestionSet(container, opts, questions, buildUI, onComplete) {
    const EXPLANATION_MS = 6000; // hold the answer on screen long enough to read
    const count = Math.min(questions.length, 3 + Math.floor(opts.level / 2));
    const picked = shuffle(questions).slice(0, count);
    let index = 0, correct = 0;

    function showQuestion() {
      if (index >= picked.length) return finish();
      clear(container);

      const counter = document.createElement('div');
      counter.className = 'session-step-label';
      counter.textContent = `Question ${index + 1} of ${picked.length}`;
      container.appendChild(counter);

      buildUI(container, picked[index], (isCorrect, explanationText) => {
        if (isCorrect) correct += 1;
        if (isCorrect) AudioFx.success(); else AudioFx.error();

        const note = document.createElement('div');
        note.className = 'inline-explain ' + (isCorrect ? 'good' : 'bad');
        note.innerHTML = `
          <div class="explain-verdict">${isCorrect ? '✓ Correct' : '✗ Not quite'}</div>
          <div class="explain-body">${explanationText || ''}</div>`;
        container.appendChild(note);

        const continueBtn = document.createElement('button');
        continueBtn.className = 'btn btn-primary btn-block continue-btn';
        container.appendChild(continueBtn);
        continueBtn.focus();

        let finished = false;
        let remaining = Math.ceil(EXPLANATION_MS / 1000);
        continueBtn.textContent = `Continue (${remaining})`;
        const interval = setInterval(() => {
          remaining -= 1;
          if (remaining > 0) continueBtn.textContent = `Continue (${remaining})`;
        }, 1000);

        function advance() {
          if (finished) return;
          finished = true;
          clearInterval(interval);
          clearTimeout(timeout);
          continueBtn.disabled = true;
          index += 1;
          showQuestion();
        }
        const timeout = setTimeout(advance, EXPLANATION_MS);
        continueBtn.addEventListener('click', advance);
      });
    }
    function finish() {
      clear(container);
      const accuracy = correct / picked.length;
      showFeedback(container, accuracy, `${correct}/${picked.length} correct`);
      onComplete({ accuracy, score: Exercises.computeScore(accuracy), duration: opts.durationSec });
    }
    showQuestion();
  }

  // ---- 1. French Grammar (multiple choice) --------------------------------
  function runFrenchGrammar(container, opts, onComplete) {
    runQuestionSet(container, opts, FrenchGrammarQuestions, (c, q, answer) => {
      header(c, 'Français — Grammaire', '');
      const p = document.createElement('div');
      p.className = 'question-text';
      p.textContent = q.prompt;
      c.appendChild(p);
      const optRow = document.createElement('div');
      optRow.className = 'option-col';
      q.options.forEach((opt, i) => {
        const b = document.createElement('button');
        b.className = 'btn btn-option-block';
        b.textContent = opt;
        b.addEventListener('click', () => {
          [...optRow.children].forEach((x) => x.disabled = true);
          b.classList.add(i === q.correctIndex ? 'chosen-correct' : 'chosen-wrong');
          answer(i === q.correctIndex, q.explanation);
        });
        optRow.appendChild(b);
      });
      c.appendChild(optRow);
    }, onComplete);
  }

  // ---- 2. Fill in the Blank -------------------------------------------------
  function runFrenchFillBlank(container, opts, onComplete) {
    runQuestionSet(container, opts, FrenchFillBlank, (c, q, answer) => {
      header(c, 'Français — Complétez', '');
      const p = document.createElement('div');
      p.className = 'question-text';
      p.textContent = q.sentence;
      c.appendChild(p);
      const optRow = document.createElement('div');
      optRow.className = 'option-row';
      shuffle(q.hints).forEach((opt) => {
        const b = document.createElement('button');
        b.className = 'btn btn-option';
        b.textContent = opt;
        b.addEventListener('click', () => {
          [...optRow.children].forEach((x) => x.disabled = true);
          const isCorrect = opt === q.answer;
          b.classList.add(isCorrect ? 'chosen-correct' : 'chosen-wrong');
          answer(isCorrect, `Réponse: "${q.answer}"`);
        });
        optRow.appendChild(b);
      });
      c.appendChild(optRow);
    }, onComplete);
  }

  // ---- 3. Sentence Ordering ---------------------------------------------------
  function runFrenchOrdering(container, opts, onComplete) {
    runQuestionSet(container, opts, FrenchSentenceOrdering, (c, q, answer) => {
      header(c, 'Français — Remettez les mots en ordre', '');
      const built = [];
      const bank = shuffle(q.words);
      const sentenceRow = document.createElement('div');
      sentenceRow.className = 'sentence-build';
      const bankRow = document.createElement('div');
      bankRow.className = 'word-bank';
      c.appendChild(sentenceRow);
      c.appendChild(bankRow);

      function renderBank() {
        bankRow.innerHTML = '';
        bank.forEach((w, i) => {
          if (built.includes(i)) return;
          const chip = document.createElement('button');
          chip.className = 'word-chip';
          chip.textContent = w;
          chip.addEventListener('click', () => { built.push(i); renderAll(); });
          bankRow.appendChild(chip);
        });
      }
      function renderSentence() {
        sentenceRow.innerHTML = '';
        built.forEach((i) => {
          const chip = document.createElement('button');
          chip.className = 'word-chip placed';
          chip.textContent = bank[i];
          chip.addEventListener('click', () => { built.splice(built.indexOf(i), 1); renderAll(); });
          sentenceRow.appendChild(chip);
        });
        if (built.length === bank.length) {
          const check = document.createElement('button');
          check.className = 'btn btn-primary';
          check.textContent = 'Check';
          check.addEventListener('click', () => {
            const attempt = built.map((i) => bank[i]).join(' ').toLowerCase();
            const isCorrect = attempt === q.answer.toLowerCase();
            answer(isCorrect, `Réponse: "${q.answer}"`);
          });
          c.appendChild(check);
        }
      }
      function renderAll() { renderBank(); renderSentence(); }
      renderAll();
    }, onComplete);
  }

  // ---- 4. Listening -----------------------------------------------------------
  function runFrenchListening(container, opts, onComplete) {
    runQuestionSet(container, opts, FrenchListeningItems, (c, q, answer) => {
      header(c, 'Français — Écoute', 'Listen, then choose the correct translation.');
      const playBtn = document.createElement('button');
      playBtn.className = 'btn btn-primary';
      playBtn.textContent = Speech.supported ? '🔊 Play audio' : 'Audio unavailable — read the sentence';
      playBtn.addEventListener('click', () => Speech.speakFrench(q.text));
      c.appendChild(playBtn);
      if (!Speech.supported) {
        const note = document.createElement('div');
        note.className = 'question-text';
        note.textContent = q.text;
        c.appendChild(note);
      } else {
        setTimeout(() => Speech.speakFrench(q.text), 300);
      }
      const others = shuffle(FrenchListeningItems.filter((x) => x.id !== q.id)).slice(0, 2).map((x) => x.translation);
      const options = shuffle([q.translation, ...others]);
      const optRow = document.createElement('div');
      optRow.className = 'option-col';
      options.forEach((opt) => {
        const b = document.createElement('button');
        b.className = 'btn btn-option-block';
        b.textContent = opt;
        b.addEventListener('click', () => {
          [...optRow.children].forEach((x) => x.disabled = true);
          const isCorrect = opt === q.translation;
          b.classList.add(isCorrect ? 'chosen-correct' : 'chosen-wrong');
          answer(isCorrect, `"${q.text}" = "${q.translation}"`);
        });
        optRow.appendChild(b);
      });
      c.appendChild(optRow);
    }, onComplete);
  }

  Exercises.registerRun('french_grammar', runFrenchGrammar);
  Exercises.registerRun('french_fillblank', runFrenchFillBlank);
  Exercises.registerRun('french_ordering', runFrenchOrdering);
  Exercises.registerRun('french_listening', runFrenchListening);

  // Exposed for the standalone French tab (practice outside a session)
  window.FrenchExercises = {
    runFrenchGrammar, runFrenchFillBlank, runFrenchOrdering, runFrenchListening
  };
})();
