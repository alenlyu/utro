/* exercises.js
 * Shared exercise engine: registry of all exercises, adaptive difficulty
 * logic, daily session generation, and the runner that sequences exercises
 * during a session and aggregates results into Storage.
 *
 * Every exercise module (memory.js, attention.js, motor.js, reasoning.js,
 * french.js) exposes one function per exercise:
 *   run(container, { level, durationSec }, onComplete)
 * onComplete receives a standardized result object:
 *   { score, accuracy, reactionTimeMs, difficulty, duration }
 */

const Exercises = (() => {
  // Registry: id -> metadata + run function (assigned once modules load)
  const registry = {
    memory_sequence:  { name: 'Memory Sequence',  category: 'memory',    defaultSec: 90,  run: null },
    spatial_memory:   { name: 'Spatial Memory',   category: 'memory',    defaultSec: 90,  run: null },
    digit_span:       { name: 'Digit Span',       category: 'memory',    defaultSec: 90,  run: null },
    matching_pairs:   { name: 'Matching Pairs',   category: 'memory',    defaultSec: 90,  run: null },
    word_recall:      { name: 'Word Recall',      category: 'memory',    defaultSec: 90,  run: null },
    stroop:           { name: 'Stroop Test',      category: 'attention', defaultSec: 60,  run: null },
    visual_search:    { name: 'Visual Search',    category: 'attention', defaultSec: 60,  run: null },
    sustained:        { name: 'Sustained Attention', category: 'attention', defaultSec: 60, run: null },
    change_detection: { name: 'Change Detection', category: 'attention', defaultSec: 60,  run: null },
    divided_attention:{ name: 'Divided Attention', category: 'attention', defaultSec: 60, run: null },
    reaction:         { name: 'Reaction Time',    category: 'motor',     defaultSec: 45,  run: null },
    target_tracking:  { name: 'Target Tracking',  category: 'motor',     defaultSec: 45,  run: null },
    sequence_tapping: { name: 'Sequence Tapping', category: 'motor',     defaultSec: 60,  run: null },
    aim_trainer:      { name: 'Aim Trainer',      category: 'motor',     defaultSec: 45,  run: null },
    rhythm_tap:       { name: 'Rhythm Tap',       category: 'motor',     defaultSec: 45,  run: null },
    logic_patterns:   { name: 'Logical Patterns', category: 'reasoning', defaultSec: 90,  run: null },
    deduction:        { name: 'Deduction',        category: 'reasoning', defaultSec: 90,  run: null },
    assumption:       { name: 'Detect the Assumption', category: 'reasoning', defaultSec: 90, run: null },
    fact_opinion:     { name: 'Fact vs Opinion',  category: 'reasoning', defaultSec: 60,  run: null },
    probability:      { name: 'Probability',      category: 'reasoning', defaultSec: 90,  run: null },
    analogies:        { name: 'Analogies',        category: 'reasoning', defaultSec: 90,  run: null },
    odd_one_out:      { name: 'Odd One Out',      category: 'reasoning', defaultSec: 60,  run: null },
    cognitive_bias:   { name: 'Cognitive Biases', category: 'reasoning', defaultSec: 90,  run: null },
    causal_reasoning: { name: 'Causal Reasoning', category: 'reasoning', defaultSec: 90,  run: null },
    conditional_logic:{ name: 'Conditional Logic',category: 'reasoning', defaultSec: 90,  run: null },
    french_grammar:   { name: 'French Grammar',   category: 'french',    defaultSec: 120, run: null },
    french_fillblank: { name: 'French Fill-in-Blank', category: 'french', defaultSec: 90, run: null },
    french_ordering:  { name: 'Sentence Ordering', category: 'french',   defaultSec: 90,  run: null },
    french_listening: { name: 'French Listening',  category: 'french',  defaultSec: 90,  run: null },
    verb_conjugation: { name: 'Verb Conjugation', category: 'french',   defaultSec: 90,  run: null }
  };

  function registerRun(id, fn) {
    if (!registry[id]) { console.warn('Unknown exercise id', id); return; }
    registry[id].run = fn;
  }

  function all() { return registry; }
  function get(id) { return registry[id]; }

  const CATEGORY_LABELS = {
    memory: 'Memory', attention: 'Attention', motor: 'Reaction',
    reasoning: 'Critical Thinking', french: 'French'
  };

  // ---- Adaptive difficulty ----------------------------------------------
  function getLevel(exerciseId) {
    const settings = Storage.getSettings();
    if (settings.difficultyMode === 'easy') return 1;
    if (settings.difficultyMode === 'medium') return 3;
    if (settings.difficultyMode === 'hard') return 6;
    return Storage.getExerciseStat(exerciseId).level || 1;
  }

  function adjustDifficulty(exerciseId, accuracy) {
    const settings = Storage.getSettings();
    if (settings.difficultyMode !== 'adaptive') return; // manual modes don't auto-adjust
    const stat = Storage.getExerciseStat(exerciseId);
    let level = stat.level || 1;
    if (accuracy >= 0.85) level += 1;
    else if (accuracy < 0.6 && level > 1) level -= 1;
    level = Math.max(1, Math.min(10, level));
    Storage.setExerciseLevel(exerciseId, level);
  }

  // ---- Scoring ------------------------------------------------------------
  // Standardized 0-100 score from accuracy, with a mild bonus for speed when
  // reaction time is meaningful (lower is better, capped).
  function computeScore(accuracy, reactionTimeMs) {
    let score = Math.round(Math.max(0, Math.min(1, accuracy)) * 100);
    if (typeof reactionTimeMs === 'number' && reactionTimeMs > 0) {
      const speedBonus = Math.max(0, Math.min(10, (900 - reactionTimeMs) / 60));
      score = Math.round(Math.min(100, score * 0.9 + speedBonus));
    }
    return score;
  }

  // ---- Session generation --------------------------------------------------
  // Builds a varied morning session that fits within totalMinutes, drawing
  // one exercise per category (weighted toward weaker categories) plus extra
  // slots if time allows. Order is shuffled daily so it doesn't feel identical.
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function categoryAverage(category) {
    const stats = Storage.getExerciseStats();
    const relevant = Object.entries(registry).filter(([, m]) => m.category === category).map(([id]) => id);
    let sum = 0, count = 0;
    relevant.forEach((id) => {
      const hist = (stats[id] && stats[id].history) || [];
      hist.slice(-3).forEach((h) => { sum += h.score; count += 1; });
    });
    return count > 0 ? sum / count : 50; // unseen categories treated as mid-level (prioritized)
  }

  function generateSession(totalMinutes) {
    const categories = ['memory', 'attention', 'motor', 'reasoning', 'french'];
    // Weaker average score => picked earlier / more likely included
    const ranked = categories.slice().sort((a, b) => categoryAverage(a) - categoryAverage(b));
    const totalSec = totalMinutes * 60;
    const plan = [];
    let usedSec = 0;

    ranked.forEach((cat) => {
      const options = Object.entries(registry).filter(([, m]) => m.category === cat).map(([id]) => id);
      const chosen = shuffle(options)[0];
      const meta = registry[chosen];
      if (usedSec + meta.defaultSec <= totalSec + 30) {
        plan.push({ exerciseId: chosen, durationSec: meta.defaultSec });
        usedSec += meta.defaultSec;
      }
    });

    // Fill remaining time with a second pass through categories, if any budget left
    let guard = 0;
    while (usedSec < totalSec - 30 && guard < 20) {
      guard += 1;
      const cat = ranked[guard % ranked.length];
      const options = Object.entries(registry).filter(([, m]) => m.category === cat).map(([id]) => id);
      const notYetUsed = options.filter((id) => !plan.find((p) => p.exerciseId === id));
      const pool = notYetUsed.length ? notYetUsed : options;
      const chosen = shuffle(pool)[0];
      const meta = registry[chosen];
      if (usedSec + meta.defaultSec > totalSec + 60) break;
      plan.push({ exerciseId: chosen, durationSec: meta.defaultSec });
      usedSec += meta.defaultSec;
    }

    return plan.length ? plan : [{ exerciseId: ranked[0], durationSec: registry[ranked[0]] ? Object.values(registry)[0].defaultSec : 60 }];
  }

  // ---- Session runner -------------------------------------------------------
  // Sequences a list of {exerciseId, durationSec} through their run() functions,
  // collecting results and persisting everything at the end.
  function runSession(container, plan, callbacks) {
    const results = [];
    let index = 0;

    function next() {
      if (index >= plan.length) {
        finishSession();
        return;
      }
      const step = plan[index];
      const meta = registry[step.exerciseId];
      if (!meta || typeof meta.run !== 'function') {
        console.warn('Exercise not implemented:', step.exerciseId);
        index += 1; next(); return;
      }
      const level = getLevel(step.exerciseId);
      if (callbacks.onStepStart) callbacks.onStepStart(step, index, plan.length);
      meta.run(container, { level, durationSec: step.durationSec }, (result) => {
        const score = result.score != null ? result.score : computeScore(result.accuracy || 0, result.reactionTimeMs);
        const finalResult = Object.assign({ exerciseId: step.exerciseId, category: meta.category, score }, result);
        results.push(finalResult);
        Storage.saveExerciseResult(step.exerciseId, {
          score, accuracy: result.accuracy, reactionTimeMs: result.reactionTimeMs,
          difficulty: level, duration: step.durationSec
        });
        adjustDifficulty(step.exerciseId, result.accuracy != null ? result.accuracy : score / 100);
        index += 1;
        next();
      });
    }

    function finishSession() {
      const totalDuration = results.reduce((s, r) => s + (r.duration || 0), 0);
      const byCategory = {};
      results.forEach((r) => {
        if (!byCategory[r.category]) byCategory[r.category] = [];
        byCategory[r.category].push(r.score);
      });
      const categoryAverages = {};
      Object.keys(byCategory).forEach((c) => {
        const arr = byCategory[c];
        categoryAverages[c] = Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
      });

      const progress = Storage.getProgress();
      const today = Storage.todayStr();
      const yesterday = Storage.todayStr(new Date(Date.now() - 86400000));
      if (progress.lastSessionDate === today) {
        // already trained today; streak unchanged
      } else if (progress.lastSessionDate === yesterday) {
        progress.streak += 1;
      } else {
        progress.streak = 1;
      }
      progress.lastSessionDate = today;
      progress.totalSessions += 1;
      progress.sessionHistory.push({
        date: new Date().toISOString(), durationSec: totalDuration,
        avgScore: Math.round(results.reduce((a, r) => a + r.score, 0) / (results.length || 1)),
        categories: categoryAverages
      });
      if (progress.sessionHistory.length > 90) progress.sessionHistory = progress.sessionHistory.slice(-90);
      Storage.setProgress(progress);

      if (callbacks.onSessionComplete) callbacks.onSessionComplete({ results, categoryAverages, progress });
    }

    next();
  }

  return { all, get, registerRun, getLevel, adjustDifficulty, computeScore, generateSession, runSession, CATEGORY_LABELS };
})();
