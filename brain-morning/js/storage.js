/* storage.js
 * Central localStorage access layer. Every read/write to persistent data
 * goes through this module so the schema lives in one place.
 *
 * Schema (all keys prefixed "bm_"):
 *  bm_settings        { theme, sound, sessionLength, difficultyMode, name, reducedMotion }
 *  bm_progress         { streak, lastSessionDate, totalSessions, sessionHistory:[{date, durationSec, avgScore, categories:{memory,attention,motor,reasoning,french}}] }
 *  bm_exerciseStats    { [exerciseId]: { level, attempts, history:[{date,score,accuracy,reactionTimeMs,difficulty}] } }
 *  bm_flashcards       [ {id, front, back, example, notes, category, ease, intervalDays, dueDate, status} ]
 *  bm_reflections      [ {date, accomplish, grateful} ]
 */

const Storage = (() => {
  const PREFIX = 'bm_';

  function safeParse(raw, fallback) {
    if (raw === null || raw === undefined) return fallback;
    try {
      const parsed = JSON.parse(raw);
      return parsed === null || parsed === undefined ? fallback : parsed;
    } catch (e) {
      console.warn('Storage: corrupted data, resetting key', e);
      return fallback;
    }
  }

  function get(key, fallback) {
    try {
      return safeParse(localStorage.getItem(PREFIX + key), fallback);
    } catch (e) {
      console.warn('Storage.get failed (localStorage unavailable)', e);
      return fallback;
    }
  }

  function set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('Storage.set failed', e);
      return false;
    }
  }

  const DEFAULT_SETTINGS = {
    theme: 'system',
    sound: true,
    sessionLength: 10,
    difficultyMode: 'adaptive',
    name: 'friend',
    reducedMotion: false
  };

  const DEFAULT_PROGRESS = {
    streak: 0,
    lastSessionDate: null,
    totalSessions: 0,
    sessionHistory: []
  };

  function getSettings() {
    return Object.assign({}, DEFAULT_SETTINGS, get('settings', {}));
  }
  function setSettings(patch) {
    const merged = Object.assign({}, getSettings(), patch);
    set('settings', merged);
    return merged;
  }

  function getProgress() {
    return Object.assign({}, DEFAULT_PROGRESS, get('progress', {}));
  }
  function setProgress(progress) {
    set('progress', progress);
  }

  function getExerciseStats() {
    return get('exerciseStats', {});
  }
  function getExerciseStat(exerciseId) {
    const all = getExerciseStats();
    return all[exerciseId] || { level: 1, attempts: 0, history: [] };
  }
  function saveExerciseResult(exerciseId, result) {
    const all = getExerciseStats();
    const stat = all[exerciseId] || { level: 1, attempts: 0, history: [] };
    stat.attempts += 1;
    stat.history.push(Object.assign({ date: new Date().toISOString() }, result));
    if (stat.history.length > 50) stat.history = stat.history.slice(-50);
    all[exerciseId] = stat;
    set('exerciseStats', all);
    return stat;
  }
  function setExerciseLevel(exerciseId, level) {
    const all = getExerciseStats();
    const stat = all[exerciseId] || { level: 1, attempts: 0, history: [] };
    stat.level = Math.max(1, level);
    all[exerciseId] = stat;
    set('exerciseStats', all);
  }

  function getFlashcards() {
    return get('flashcards', []);
  }
  function setFlashcards(cards) {
    set('flashcards', cards);
  }

  function getReflections() {
    return get('reflections', []);
  }
  function addReflection(entry) {
    const all = getReflections();
    all.push(Object.assign({ date: new Date().toISOString() }, entry));
    set('reflections', all);
  }

  function exportAll() {
    const data = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) {
        data[k] = safeParse(localStorage.getItem(k), null);
      }
    }
    return data;
  }

  function importAll(data) {
    if (!data || typeof data !== 'object') return false;
    Object.keys(data).forEach((k) => {
      if (k.startsWith(PREFIX)) {
        try {
          localStorage.setItem(k, JSON.stringify(data[k]));
        } catch (e) {
          console.warn('Import failed for key', k, e);
        }
      }
    });
    return true;
  }

  function resetAll() {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  }

  function todayStr(d) {
    const date = d || new Date();
    return date.toISOString().slice(0, 10);
  }

  return {
    get, set,
    getSettings, setSettings,
    getProgress, setProgress,
    getExerciseStats, getExerciseStat, saveExerciseResult, setExerciseLevel,
    getFlashcards, setFlashcards,
    getReflections, addReflection,
    exportAll, importAll, resetAll,
    todayStr
  };
})();
