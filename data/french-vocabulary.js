/* data/french-vocabulary.js
 * Content bank for the French section. Kept separate from UI logic so new
 * items can be added without touching exercise code.
 */

const FrenchVocab = [
  { fr: 'cependant', en: 'however', example: 'Je suis fatigué, cependant je vais travailler.' },
  { fr: 'malgré', en: 'despite', example: 'Malgré la pluie, nous sommes sortis.' },
  { fr: 'désormais', en: 'from now on', example: 'Désormais, je me lève tôt.' },
  { fr: 'parvenir à', en: 'to manage to / succeed in', example: 'Il est parvenu à finir le projet.' },
  { fr: 'davantage', en: 'more', example: 'Il faut travailler davantage.' },
  { fr: 'lorsque', en: 'when', example: 'Lorsque tu arrives, appelle-moi.' },
  { fr: 'ainsi', en: 'thus / this way', example: 'Ainsi, nous avons résolu le problème.' },
  { fr: 'quoique', en: 'although', example: 'Quoique fatigué, il a continué.' },
  { fr: 'se rendre compte', en: 'to realize', example: 'Je me suis rendu compte de mon erreur.' },
  { fr: 'au fur et à mesure', en: 'gradually / as', example: 'Il apprend au fur et à mesure.' },
  { fr: 'tenir compte de', en: 'to take into account', example: 'Il faut tenir compte des risques.' },
  { fr: 'faire face à', en: 'to face', example: 'Nous devons faire face à ce défi.' },
  { fr: 'un défi', en: 'a challenge', example: "C'est un vrai défi pour moi." },
  { fr: 'un souci', en: 'a worry / concern', example: "Ce n'est pas un souci." },
  { fr: 'la veille', en: 'the day before', example: 'La veille de l’examen, j’ai révisé.' },
  { fr: 'le lendemain', en: 'the next day', example: 'Le lendemain, il est parti tôt.' },
  { fr: 'davantage de', en: 'more of', example: 'Il me faut davantage de temps.' },
  { fr: 'éprouver', en: 'to feel / experience', example: 'J’éprouve de la joie.' },
  { fr: 'un enjeu', en: 'a stake / issue', example: 'C’est un enjeu important.' },
  { fr: 'un aperçu', en: 'an overview', example: 'Voici un aperçu du projet.' },
  { fr: 'entreprendre', en: 'to undertake', example: 'Il a entrepris un long voyage.' },
  { fr: 's’attendre à', en: 'to expect', example: 'Je m’attends à une réponse rapide.' },
  { fr: 'un bilan', en: 'a summary / assessment', example: 'Faisons le bilan de l’année.' },
  { fr: 'sensible', en: 'sensitive', example: 'Elle est très sensible.' },
  { fr: 'la mesure', en: 'the measure / extent', example: 'Dans la mesure du possible.' },
  { fr: 'à peine', en: 'barely / hardly', example: 'Il a à peine dormi.' },
  { fr: 'volontiers', en: 'gladly', example: 'Je viendrai volontiers.' },
  { fr: 'un atout', en: 'an asset / advantage', example: 'C’est un vrai atout.' },
  { fr: 'un obstacle', en: 'an obstacle', example: 'Le manque de temps est un obstacle.' },
  { fr: 'convaincre', en: 'to convince', example: 'Il faut le convaincre.' }
];

const FrenchGrammarQuestions = [
  {
    id: 'g1', prompt: 'Je ___ au travail demain.',
    options: ['vais', 'va', 'aller', 'allant'], correctIndex: 0,
    explanation: 'Futur proche = aller (conjugated) + infinitive.'
  },
  {
    id: 'g2', prompt: 'Nous ___ un café hier matin.',
    options: ['buvons', 'avons bu', 'boirons', 'bu'], correctIndex: 1,
    explanation: 'Passé composé with avoir: avons + past participle.'
  },
  {
    id: 'g3', prompt: 'Si j’avais le temps, je ___ avec toi.',
    options: ['viens', 'viendrai', 'viendrais', 'venais'], correctIndex: 2,
    explanation: 'Hypothetical "si + imparfait" pairs with the conditional.'
  },
  {
    id: 'g4', prompt: 'Elle est allée ___ Canada l’été dernier.',
    options: ['à', 'au', 'en', 'du'], correctIndex: 1,
    explanation: '"Le Canada" is masculine, so "au Canada".'
  },
  {
    id: 'g5', prompt: 'Il faut que tu ___ tes devoirs.',
    options: ['fais', 'faisais', 'fasses', 'ferais'], correctIndex: 2,
    explanation: '"Il faut que" triggers the subjunctive: que tu fasses.'
  },
  {
    id: 'g6', prompt: 'C’est le livre ___ je t’ai parlé.',
    options: ['que', 'qui', 'dont', 'où'], correctIndex: 2,
    explanation: '"Parler de" needs the relative pronoun "dont".'
  },
  {
    id: 'g7', prompt: 'Nous ___ arrivés en retard à cause du trafic.',
    options: ['avons', 'sommes', 'sont', 'étions'], correctIndex: 1,
    explanation: '"Arriver" takes être in the passé composé.'
  },
  {
    id: 'g8', prompt: 'Elle parle ___ couramment.',
    options: ['française', 'français', 'le français', 'en français'], correctIndex: 1,
    explanation: 'Adverbial use with "parler": parler français.'
  }
];

const FrenchFillBlank = [
  { id: 'f1', sentence: 'Je suis allé ___ Canada l’an dernier.', answer: 'au', hints: ['à', 'au', 'en'] },
  { id: 'f2', sentence: 'Elle habite ___ France depuis cinq ans.', answer: 'en', hints: ['à', 'en', 'au'] },
  { id: 'f3', sentence: 'Nous partons ___ vacances demain.', answer: 'en', hints: ['en', 'à', 'de'] },
  { id: 'f4', sentence: 'Il a ___ peur du noir quand il était petit.', answer: 'eu', hints: ['eu', 'avait', 'a'] },
  { id: 'f5', sentence: 'Je pense ___ toi tous les jours.', answer: 'à', hints: ['à', 'de', 'sur'] }
];

const FrenchSentenceOrdering = [
  { id: 's1', words: ['tous', 'les', 'matins', 'je', 'cours'], answer: 'je cours tous les matins' },
  { id: 's2', words: ['n’', 'jamais', 'je', 'ai', 'vu', 'ça'], answer: 'je n’ai jamais vu ça' },
  { id: 's3', words: ['plus', 'tard', 'appelle', 'moi'], answer: 'appelle moi plus tard' },
  { id: 's4', words: ['de', 'bonne', 'humeur', 'aujourd’hui', 'je', 'suis'], answer: 'je suis de bonne humeur aujourd’hui' }
];

const FrenchListeningItems = [
  { id: 'l1', text: 'Bonjour, comment allez-vous aujourd’hui ?', translation: 'Hello, how are you today?' },
  { id: 'l2', text: 'Je voudrais réserver une table pour deux personnes.', translation: 'I would like to book a table for two.' },
  { id: 'l3', text: 'Il pleut depuis ce matin.', translation: 'It has been raining since this morning.' },
  { id: 'l4', text: 'Pouvez-vous répéter, s’il vous plaît ?', translation: 'Can you repeat, please?' }
];
