/* data/french-vocabulary.js
 * Content bank for the French section. Kept separate from UI logic so new
 * items can be added without touching exercise code.
 *
 * Weekly update: all exercises below are built from this week's target
 * vocabulary (essentiel, élèves, tout d'abord, cela, expérience,
 * généralement, obtenir, cependant, étudier, acheter) and from the essay
 * paragraph on students and having a job.
 */

const FrenchVocab = [
  { fr: 'essentiel', en: 'essential', example: "Il est essentiel pour les élèves d'avoir un travail." },
  { fr: 'élèves', en: 'students', example: "Il est essentiel pour les élèves d'avoir un travail." },
  { fr: "tout d'abord", en: 'first of all', example: 'Tout d\u2019abord, cela leur permet de devenir plus confiants.' },
  { fr: 'cela', en: 'that / this', example: 'Cela leur permet de devenir plus confiants.' },
  { fr: 'expérience', en: 'experience', example: "Ils auront plus d'expérience." },
  { fr: 'généralement', en: 'generally', example: "Généralement, il est important d'avoir un travail." },
  { fr: 'obtenir', en: 'to obtain / to get', example: "Il est important d'obtenir de l'expérience." },
  { fr: 'cependant', en: 'however', example: "Cependant, ils ne doivent pas oublier d'étudier aussi." },
  { fr: 'étudier', en: 'to study', example: "Ils ne doivent pas oublier d'étudier aussi." },
  { fr: 'acheter', en: 'to buy', example: 'Ils peuvent acheter certaines choses.' }
];

const FrenchGrammarQuestions = [
  {
    id: 'g1', prompt: "Il ___ essentiel pour les élèves d'avoir un travail.",
    options: ['est', 'es', 'sont', 'était'], correctIndex: 0,
    explanation: '"Il est + adjectif" is an impersonal construction, so it takes "est" here, in the present tense.'
  },
  {
    id: 'g2', prompt: "Il est essentiel pour les ___ d'avoir un travail.",
    options: ['élève', 'élèves', 'élever', 'élevés'], correctIndex: 1,
    explanation: '"Les" calls for the plural noun "élèves" (students), not the verb "élever" (to raise).'
  },
  {
    id: 'g3', prompt: '___, cela leur permet de devenir plus confiants.',
    options: ["Tout d'abord", 'Cependant', 'Généralement', 'Cela'], correctIndex: 0,
    explanation: '"Tout d\u2019abord" ("first of all") introduces the first point of an argument, matching the essay\u2019s structure.'
  },
  {
    id: 'g4', prompt: '___ leur permet de devenir plus confiants.',
    options: ['Cela', 'Ça la', "Cela-là", "C'ela"], correctIndex: 0,
    explanation: '"Cela" ("that / this") refers back to the idea just mentioned and is the subject of "permet".'
  },
  {
    id: 'g5', prompt: "Ils auront plus d'___.",
    options: ['expérience', 'expériences', 'expériencé', 'expériencer'], correctIndex: 0,
    explanation: 'Here "expérience" means practical know-how and stays singular after "plus de".'
  },
  {
    id: 'g6', prompt: "___, il est important d'avoir un travail.",
    options: ['Généralement', 'Général', 'Générale', 'Généraux'], correctIndex: 0,
    explanation: '"Généralement" is the adverb form (from "général" + "-ement"), used to introduce a general statement.'
  },
  {
    id: 'g7', prompt: "Il est important d'___ de l'expérience.",
    options: ['obtenir', 'obtenu', 'obtiens', 'obtenant'], correctIndex: 0,
    explanation: 'After the preposition "de", the verb stays in the infinitive: "d\u2019obtenir".'
  },
  {
    id: 'g8', prompt: '___, ils ne doivent pas oublier d\u2019étudier aussi.',
    options: ['Cependant', 'Cépendant', 'Cependante', "Cepend'ant"], correctIndex: 0,
    explanation: '"Cependant" ("however") introduces a contrast with the previous idea in the essay.'
  },
  {
    id: 'g9', prompt: "Ils ne doivent pas oublier d'___ aussi.",
    options: ['étudier', 'étudie', 'étude', 'étudiant'], correctIndex: 0,
    explanation: 'After "oublier de", the following verb stays in the infinitive: "oublier d\u2019étudier".'
  },
  {
    id: 'g10', prompt: '___ certaines choses.',
    options: ['acheter', 'achète', 'achètent', 'acheté'], correctIndex: 0,
    explanation: 'After the modal verb "peuvent", the following verb stays in the infinitive: "peuvent acheter".'
  }
];

const FrenchFillBlank = [
  { id: 'f1', sentence: "Il est ___ pour les élèves d'avoir un travail.", answer: 'essentiel', hints: ['essentiel', 'important', 'facile'] },
  { id: 'f2', sentence: "Il est essentiel pour les ___ d'avoir un travail.", answer: 'élèves', hints: ['élèves', 'professeurs', 'parents'] },
  { id: 'f3', sentence: '___, cela leur permet de devenir plus confiants.', answer: "Tout d'abord", hints: ["Tout d'abord", 'Cependant', 'Généralement'] },
  { id: 'f4', sentence: 'Cela leur permet de devenir plus confiants, parce qu\u2019ils auront plus d\u2019___.', answer: 'expérience', hints: ['expérience', 'argent', 'temps'] },
  { id: 'f5', sentence: '___, il est important d\u2019avoir un travail.', answer: 'Généralement', hints: ['Généralement', 'Rarement', 'Jamais'] },
  { id: 'f6', sentence: "Il est important d'___ de l'expérience.", answer: 'obtenir', hints: ['obtenir', 'perdre', 'donner'] },
  { id: 'f7', sentence: '___, ils ne doivent pas oublier d\u2019étudier aussi.', answer: 'Cependant', hints: ['Cependant', 'Ainsi', 'Enfin'] },
  { id: 'f8', sentence: "Ils ne doivent pas oublier d'___ aussi.", answer: 'étudier', hints: ['étudier', 'dormir', 'voyager'] },
  { id: 'f9', sentence: 'Ils peuvent ___ certaines choses.', answer: 'acheter', hints: ['acheter', 'vendre', 'jeter'] }
];

const FrenchSentenceOrdering = [
  { id: 's1', words: ['il', 'est', 'essentiel', 'pour', 'les', 'élèves', "d'avoir", 'un', 'travail'], answer: "il est essentiel pour les élèves d'avoir un travail" },
  { id: 's2', words: ['cela', 'leur', 'permet', 'de', 'devenir', 'plus', 'confiants'], answer: 'cela leur permet de devenir plus confiants' },
  { id: 's3', words: ['généralement', 'il', 'est', 'important', "d'avoir", 'un', 'travail'], answer: "généralement il est important d'avoir un travail" },
  { id: 's4', words: ['ils', 'peuvent', 'acheter', 'certaines', 'choses'], answer: 'ils peuvent acheter certaines choses' },
  { id: 's5', words: ['ils', 'ne', 'doivent', 'pas', 'oublier', "d'étudier", 'aussi'], answer: "ils ne doivent pas oublier d'étudier aussi" }
];

const FrenchListeningItems = [
  { id: 'l1', text: "Il est essentiel pour les élèves d'avoir un travail.", translation: "It's essential for students to have a job." },
  { id: 'l2', text: 'Tout d\u2019abord, cela leur permet de devenir plus confiants.', translation: 'First of all, this allows them to become more confident.' },
  { id: 'l3', text: "Généralement, il est important d'avoir un travail.", translation: "Generally, it's important to have a job." },
  { id: 'l4', text: 'Cependant, ils ne doivent pas oublier d\u2019étudier aussi.', translation: 'However, they must not forget to study as well.' },
  { id: 'l5', text: 'Ils peuvent acheter certaines choses.', translation: 'They can buy certain things.' }
];

const FrenchConjugation = [
  {
    id: 'vc1', infinitive: 'permettre', prompt: 'Cela leur ___ de devenir plus confiants.',
    options: ['permet', 'permets', 'permettons', 'permettez'], correctIndex: 0,
    explanation: '"Cela" is a 3rd-person singular subject, so "permettre" becomes "permet".'
  },
  {
    id: 'vc2', infinitive: 'gagner', prompt: 'Ils ___ de l\u2019argent.',
    options: ['gagne', 'gagnes', 'gagnons', 'gagnent'], correctIndex: 3,
    explanation: '"Gagner" for "ils" (3rd-person plural) is "gagnent".'
  },
  {
    id: 'vc3', infinitive: 'apprendre', prompt: 'Ils peuvent ___ à le gérer.',
    options: ['apprendre', 'apprend', 'apprennent', 'appris'], correctIndex: 0,
    explanation: 'After the modal verb "peuvent", the following verb stays in the infinitive: "apprendre".'
  },
  {
    id: 'vc4', infinitive: 'obtenir', prompt: "Il est important d'___ de l'expérience.",
    options: ['obtenir', 'obtient', 'obtiens', 'obtenant'], correctIndex: 0,
    explanation: 'After the preposition "de", "obtenir" stays in the infinitive.'
  },
  {
    id: 'vc5', infinitive: 'devoir', prompt: 'Ils ne ___ pas oublier d\u2019étudier.',
    options: ['doivent', 'doit', 'dois', 'devons'], correctIndex: 0,
    explanation: '"Devoir" for "ils" (3rd-person plural) is "doivent".'
  },
  {
    id: 'vc6', infinitive: 'aider', prompt: 'Cela les ___ à obtenir un travail à l\u2019avenir.',
    options: ['aidera', 'aide', 'aidons', 'aideront'], correctIndex: 0,
    explanation: '"Cela" is singular, so the future tense of "aider" here is "aidera".'
  },
  {
    id: 'vc7', infinitive: 'être', prompt: 'Il ___ essentiel pour les élèves d\u2019avoir un travail.',
    options: ['est', 'es', 'sommes', 'sont'], correctIndex: 0,
    explanation: '"Il" (impersonal subject) takes "est", the 3rd-person singular of "être".'
  }
];
