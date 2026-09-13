/* reasoning.js — critical thinking exercises
 * These questions test a specific reasoning skill (pattern completion,
 * deduction, spotting weak arguments, source classification, expected-value
 * thinking). No claim is made that this transfers broadly to "intelligence".
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

  // Generic multi-question runner shared by all reasoning sub-types.
  function runQuestionSet(container, opts, questions, buildQuestionUI, onComplete) {
    const count = Math.min(questions.length, 3 + Math.floor(opts.level / 2));
    const picked = shuffle(questions).slice(0, count);
    let index = 0, correct = 0;

    function showQuestion() {
      if (index >= picked.length) return finish();
      clear(container);
      buildQuestionUI(container, picked[index], (isCorrect, explanationText) => {
        if (isCorrect) correct += 1;
        const note = document.createElement('div');
        note.className = 'inline-explain ' + (isCorrect ? 'good' : 'bad');
        note.textContent = (isCorrect ? '✓ Correct. ' : '✗ Not quite. ') + (explanationText || '');
        container.appendChild(note);
        if (isCorrect) AudioFx.success(); else AudioFx.error();
        index += 1;
        setTimeout(showQuestion, 1400);
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

  function mcQuestion(container, q, answer, prompt, options, correctIndex, explanation) {
    header(container, prompt.title, '');
    const p = document.createElement('div');
    p.className = 'question-text';
    p.innerHTML = prompt.html;
    container.appendChild(p);
    const optRow = document.createElement('div');
    optRow.className = 'option-col';
    options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'btn btn-option-block';
      b.textContent = opt;
      b.addEventListener('click', () => {
        [...optRow.children].forEach((c) => c.disabled = true);
        b.classList.add(i === correctIndex ? 'chosen-correct' : 'chosen-wrong');
        answer(i === correctIndex, explanation);
      });
      optRow.appendChild(b);
    });
    container.appendChild(optRow);
  }

  // 1. Logical Patterns
  function runLogicPatterns(container, opts, onComplete) {
    runQuestionSet(container, opts, LogicalPatterns, (c, q, answer) => {
      mcQuestion(c, q, answer,
        { title: 'Logical Patterns', html: `<span class="sequence">${q.sequence.join(' → ')} → ?</span>` },
        q.options.map(String), q.options.indexOf(q.answer),
        `The sequence continues to ${q.answer}.`);
    }, onComplete);
  }

  // 2. Deduction
  function runDeduction(container, opts, onComplete) {
    runQuestionSet(container, opts, DeductionQuestions, (c, q, answer) => {
      mcQuestion(c, q, answer,
        { title: 'Deduction', html: q.premises.map((p) => `<div>${p}</div>`).join('') + `<div class="question-prompt">${q.question}</div>` },
        q.options, q.correctIndex, q.explanation);
    }, onComplete);
  }

  // 3. Detect the Assumption
  function runAssumption(container, opts, onComplete) {
    runQuestionSet(container, opts, AssumptionQuestions, (c, q, answer) => {
      mcQuestion(c, q, answer,
        { title: 'Detect the Assumption', html: `<div class="question-quote">"${q.statement}"</div><div class="question-prompt">${q.question}</div>` },
        q.options, q.correctIndex, q.explanation);
    }, onComplete);
  }

  // 4. Fact vs Opinion
  function runFactOpinion(container, opts, onComplete) {
    const labels = ['fact', 'opinion', 'inference', 'unsupported claim'];
    runQuestionSet(container, opts, FactOpinionItems, (c, q, answer) => {
      mcQuestion(c, q, answer,
        { title: 'Fact vs Opinion', html: `<div class="question-quote">"${q.text}"</div><div class="question-prompt">What kind of statement is this?</div>` },
        labels.map((l) => l[0].toUpperCase() + l.slice(1)), labels.indexOf(q.label),
        `This is best classified as ${q.label}.`);
    }, onComplete);
  }

  // 5. Probability / Decision Making
  function runProbability(container, opts, onComplete) {
    runQuestionSet(container, opts, ProbabilityScenarios, (c, q, answer) => {
      mcQuestion(c, q, answer,
        { title: 'Probability & Decisions', html: `<div class="question-quote">${q.scenario}</div>` },
        q.options, q.correctIndex, q.explanation);
    }, onComplete);
  }

  Exercises.registerRun('logic_patterns', runLogicPatterns);
  Exercises.registerRun('deduction', runDeduction);
  Exercises.registerRun('assumption', runAssumption);
  Exercises.registerRun('fact_opinion', runFactOpinion);
  Exercises.registerRun('probability', runProbability);
})();
