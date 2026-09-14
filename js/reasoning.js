/* reasoning.js — critical thinking exercises
 * These questions test a specific reasoning skill (pattern completion,
 * deduction, spotting weak arguments, source classification, analogy,
 * categorisation, bias recognition, causal inference, conditional logic).
 * No claim is made that this transfers broadly to "intelligence".
 *
 * Feedback pacing: after answering, the explanation stays on screen for
 * EXPLANATION_MS (6s) so it can actually be read, with a countdown and a
 * "Continue" button to move on sooner.
 */
(function () {

  const EXPLANATION_MS = 6000; // time to read the answer before auto-advance

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

  /* Shows the verdict + explanation, holds it for EXPLANATION_MS with a live
   * countdown, and offers a Continue button. Calls done() exactly once. */
  function showExplanation(container, isCorrect, explanationText, done) {
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

    function finish() {
      if (finished) return; // guard against double-fire
      finished = true;
      clearInterval(interval);
      clearTimeout(timeout);
      continueBtn.disabled = true;
      done();
    }
    const timeout = setTimeout(finish, EXPLANATION_MS);
    continueBtn.addEventListener('click', finish);
  }

  // Generic multi-question runner shared by all reasoning sub-types.
  function runQuestionSet(container, opts, questions, buildQuestionUI, onComplete) {
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

      buildQuestionUI(container, picked[index], (isCorrect, explanationText) => {
        if (isCorrect) correct += 1;
        if (isCorrect) AudioFx.success(); else AudioFx.error();
        showExplanation(container, isCorrect, explanationText, () => {
          index += 1;
          showQuestion();
        });
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

  /* Renders a titled multiple-choice question. `options` may be reordered by
   * the caller; correctIndex refers to the array as passed in. */
  function mcQuestion(container, answer, prompt, options, correctIndex, explanation) {
    header(container, prompt.title, prompt.sub || '');
    const p = document.createElement('div');
    p.className = 'question-text';
    p.innerHTML = prompt.html;
    container.appendChild(p);

    const optCol = document.createElement('div');
    optCol.className = 'option-col';
    options.forEach((opt, i) => {
      const b = document.createElement('button');
      b.className = 'btn btn-option-block';
      b.textContent = opt;
      b.addEventListener('click', () => {
        [...optCol.children].forEach((c) => { c.disabled = true; });
        b.classList.add(i === correctIndex ? 'chosen-correct' : 'chosen-wrong');
        if (i !== correctIndex) optCol.children[correctIndex].classList.add('reveal-correct');
        answer(i === correctIndex, explanation);
      });
      optCol.appendChild(b);
    });
    container.appendChild(optCol);
  }

  /* Shuffles options while keeping track of where the correct one lands, so
   * the right answer isn't always in the same position. */
  function shuffleWithAnswer(options, correctIndex) {
    const tagged = options.map((text, i) => ({ text, isCorrect: i === correctIndex }));
    const mixed = shuffle(tagged);
    return { options: mixed.map((t) => t.text), correctIndex: mixed.findIndex((t) => t.isCorrect) };
  }

  // ---- 1. Logical Patterns ------------------------------------------------
  function runLogicPatterns(container, opts, onComplete) {
    runQuestionSet(container, opts, LogicalPatterns, (c, q, answer) => {
      const m = shuffleWithAnswer(q.options.map(String), q.options.indexOf(q.answer));
      mcQuestion(c, answer,
        { title: 'Logical Patterns', sub: 'What comes next in the sequence?', html: `<span class="sequence">${q.sequence.join(' → ')} → ?</span>` },
        m.options, m.correctIndex, `The sequence continues to ${q.answer}.`);
    }, onComplete);
  }

  // ---- 2. Deduction --------------------------------------------------------
  function runDeduction(container, opts, onComplete) {
    runQuestionSet(container, opts, DeductionQuestions, (c, q, answer) => {
      mcQuestion(c, answer,
        { title: 'Deduction', sub: 'Assume the premises are true.',
          html: `<div class="premise-box">${q.premises.map((p) => `<div class="premise">${p}</div>`).join('')}</div><div class="question-prompt">${q.question}</div>` },
        q.options, q.correctIndex, q.explanation);
    }, onComplete);
  }

  // ---- 3. Detect the Assumption ---------------------------------------------
  function runAssumption(container, opts, onComplete) {
    runQuestionSet(container, opts, AssumptionQuestions, (c, q, answer) => {
      const m = shuffleWithAnswer(q.options, q.correctIndex);
      mcQuestion(c, answer,
        { title: 'Detect the Assumption', sub: '',
          html: `<div class="question-quote">${q.statement}</div><div class="question-prompt">${q.question}</div>` },
        m.options, m.correctIndex, q.explanation);
    }, onComplete);
  }

  // ---- 4. Fact vs Opinion -----------------------------------------------------
  function runFactOpinion(container, opts, onComplete) {
    const labels = ['fact', 'opinion', 'inference', 'unsupported claim'];
    runQuestionSet(container, opts, FactOpinionItems, (c, q, answer) => {
      mcQuestion(c, answer,
        { title: 'Fact vs Opinion', sub: 'Classify the statement.',
          html: `<div class="question-quote">${q.text}</div>` },
        labels.map((l) => l[0].toUpperCase() + l.slice(1)), labels.indexOf(q.label),
        `This is best classified as ${q.label}.`);
    }, onComplete);
  }

  // ---- 5. Probability / Decision Making -----------------------------------------
  function runProbability(container, opts, onComplete) {
    runQuestionSet(container, opts, ProbabilityScenarios, (c, q, answer) => {
      const m = shuffleWithAnswer(q.options, q.correctIndex);
      mcQuestion(c, answer,
        { title: 'Probability & Decisions', sub: '', html: `<div class="question-quote">${q.scenario}</div>` },
        m.options, m.correctIndex, q.explanation);
    }, onComplete);
  }

  // ---- 6. NEW: Analogies -------------------------------------------------------
  function runAnalogies(container, opts, onComplete) {
    runQuestionSet(container, opts, AnalogyQuestions, (c, q, answer) => {
      const m = shuffleWithAnswer(q.options, q.correctIndex);
      mcQuestion(c, answer,
        { title: 'Analogies', sub: 'Find the matching relationship.', html: `<span class="analogy-prompt">${q.prompt}</span>` },
        m.options, m.correctIndex, q.explanation);
    }, onComplete);
  }

  // ---- 7. NEW: Odd One Out -------------------------------------------------------
  function runOddOneOut(container, opts, onComplete) {
    runQuestionSet(container, opts, OddOneOutQuestions, (c, q, answer) => {
      const m = shuffleWithAnswer(q.items, q.correctIndex);
      mcQuestion(c, answer,
        { title: 'Odd One Out', sub: 'Which item does not belong with the others?', html: '' },
        m.options, m.correctIndex, q.explanation);
    }, onComplete);
  }

  // ---- 8. NEW: Cognitive Biases -----------------------------------------------------
  function runCognitiveBias(container, opts, onComplete) {
    runQuestionSet(container, opts, CognitiveBiasQuestions, (c, q, answer) => {
      const m = shuffleWithAnswer(q.options, q.correctIndex);
      mcQuestion(c, answer,
        { title: 'Spot the Bias', sub: 'Which thinking bias does this describe?',
          html: `<div class="question-quote">${q.scenario}</div>` },
        m.options, m.correctIndex, q.explanation);
    }, onComplete);
  }

  // ---- 9. NEW: Causal Reasoning --------------------------------------------------------
  function runCausalReasoning(container, opts, onComplete) {
    runQuestionSet(container, opts, CausalReasoningQuestions, (c, q, answer) => {
      const m = shuffleWithAnswer(q.options, q.correctIndex);
      mcQuestion(c, answer,
        { title: 'Cause & Effect', sub: '',
          html: `<div class="question-quote">${q.scenario}</div><div class="question-prompt">${q.question}</div>` },
        m.options, m.correctIndex, q.explanation);
    }, onComplete);
  }

  // ---- 10. NEW: Conditional Logic ----------------------------------------------------------
  function runConditionalLogic(container, opts, onComplete) {
    runQuestionSet(container, opts, ConditionalLogicQuestions, (c, q, answer) => {
      const m = shuffleWithAnswer(q.options, q.correctIndex);
      mcQuestion(c, answer,
        { title: 'Conditional Logic', sub: 'Reason carefully about if/then.',
          html: `<div class="premise-box"><div class="premise">${q.rule}</div></div><div class="question-prompt">${q.question}</div>` },
        m.options, m.correctIndex, q.explanation);
    }, onComplete);
  }

  Exercises.registerRun('logic_patterns', runLogicPatterns);
  Exercises.registerRun('deduction', runDeduction);
  Exercises.registerRun('assumption', runAssumption);
  Exercises.registerRun('fact_opinion', runFactOpinion);
  Exercises.registerRun('probability', runProbability);
  Exercises.registerRun('analogies', runAnalogies);
  Exercises.registerRun('odd_one_out', runOddOneOut);
  Exercises.registerRun('cognitive_bias', runCognitiveBias);
  Exercises.registerRun('causal_reasoning', runCausalReasoning);
  Exercises.registerRun('conditional_logic', runConditionalLogic);
})();
