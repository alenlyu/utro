/* flashcards.js — French flashcard CRUD and a simplified spaced-repetition
 * scheduler (Again / Hard / Good / Easy), inspired by SM-2 but intentionally
 * simplified rather than a full Anki-style algorithm.
 */
const Flashcards = (() => {
  function uid() { return 'fc_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }

  function all() { return Storage.getFlashcards(); }

  function add(card) {
    const cards = all();
    const newCard = {
      id: uid(),
      front: card.front || '',
      back: card.back || '',
      example: card.example || '',
      notes: card.notes || '',
      category: card.category || 'General',
      ease: 2.3,
      intervalDays: 0,
      dueDate: Storage.todayStr(),
      status: 'new'
    };
    cards.push(newCard);
    Storage.setFlashcards(cards);
    return newCard;
  }

  function update(id, patch) {
    const cards = all();
    const idx = cards.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    cards[idx] = Object.assign({}, cards[idx], patch);
    Storage.setFlashcards(cards);
    return cards[idx];
  }

  function remove(id) {
    Storage.setFlashcards(all().filter((c) => c.id !== id));
  }

  function categories() {
    const set = new Set(all().map((c) => c.category || 'General'));
    return Array.from(set);
  }

  // Simplified SM-2 style scheduling.
  // rating: 'again' | 'hard' | 'good' | 'easy'
  function review(id, rating) {
    const card = all().find((c) => c.id === id);
    if (!card) return null;
    let { ease, intervalDays } = card;
    switch (rating) {
      case 'again':
        ease = Math.max(1.3, ease - 0.2);
        intervalDays = 0; // due again today
        card.status = 'review-again';
        break;
      case 'hard':
        ease = Math.max(1.3, ease - 0.1);
        intervalDays = Math.max(1, Math.round(intervalDays * 1.2) || 1);
        card.status = 'learning';
        break;
      case 'good':
        intervalDays = intervalDays === 0 ? 1 : Math.round(intervalDays * ease);
        card.status = 'learning';
        break;
      case 'easy':
        ease = ease + 0.15;
        intervalDays = intervalDays === 0 ? 3 : Math.round(intervalDays * ease * 1.3);
        card.status = 'known';
        break;
    }
    const due = new Date();
    due.setDate(due.getDate() + intervalDays);
    return update(id, { ease, intervalDays, dueDate: Storage.todayStr(due), status: card.status });
  }

  function dueToday() {
    const today = Storage.todayStr();
    return all().filter((c) => !c.dueDate || c.dueDate <= today);
  }

  function seedIfEmpty() {
    if (all().length > 0) return;
    FrenchVocab.slice(0, 10).forEach((v) => add({ front: v.fr, back: v.en, example: v.example, category: 'Vocabulary' }));
  }

  return { all, add, update, remove, categories, review, dueToday, seedIfEmpty };
})();
