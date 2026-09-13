/* data/questions.js
 * Content bank for the Critical Thinking section, organized by sub-type so
 * new questions can be appended without touching exercise logic.
 */

const LogicalPatterns = [
  { id: 'lp1', sequence: [2, 4, 8, 16], answer: 32, options: [24, 32, 20, 30] },
  { id: 'lp2', sequence: [1, 1, 2, 3, 5, 8], answer: 13, options: [11, 13, 12, 14] },
  { id: 'lp3', sequence: [3, 6, 12, 24], answer: 48, options: [36, 42, 48, 30] },
  { id: 'lp4', sequence: [100, 90, 81, 73], answer: 66, options: [64, 65, 66, 68] },
  { id: 'lp5', sequence: [1, 4, 9, 16, 25], answer: 36, options: [30, 32, 36, 49] },
  { id: 'lp6', sequence: [5, 10, 20, 40], answer: 80, options: [60, 70, 80, 90] },
  { id: 'lp7', sequence: [2, 3, 5, 7, 11], answer: 13, options: [12, 13, 14, 15] }
];

const DeductionQuestions = [
  {
    id: 'd1',
    premises: ['All A are B.', 'Some B are C.'],
    question: 'Which conclusion is definitely true?',
    options: ['All A are C.', 'Some A are C.', 'No A are C.', 'None of the above must be true.'],
    correctIndex: 3,
    explanation: 'Overlap between B and C is not guaranteed to include A — nothing about A and C follows for certain.'
  },
  {
    id: 'd2',
    premises: ['All doctors are professionals.', 'No professionals work for free.'],
    question: 'Which conclusion is definitely true?',
    options: ['No doctors work for free.', 'Some doctors work for free.', 'All professionals are doctors.', 'Nothing follows.'],
    correctIndex: 0,
    explanation: 'If all doctors are professionals, and no professionals work free, then no doctors work free.'
  },
  {
    id: 'd3',
    premises: ['If it rains, the game is cancelled.', 'The game was not cancelled.'],
    question: 'Which conclusion is definitely true?',
    options: ['It rained.', 'It did not rain.', 'The game was played indoors.', 'Nothing follows.'],
    correctIndex: 1,
    explanation: 'This is modus tollens: not-cancelled implies not-rain.'
  },
  {
    id: 'd4',
    premises: ['Some cats are black.', 'All black things absorb heat.'],
    question: 'Which conclusion is definitely true?',
    options: ['All cats absorb heat.', 'Some cats absorb heat.', 'No cats absorb heat.', 'All black things are cats.'],
    correctIndex: 1,
    explanation: 'Only the black cats are guaranteed to absorb heat — so "some cats" follows.'
  }
];

const AssumptionQuestions = [
  {
    id: 'a1',
    statement: 'People who drink coffee every morning are more productive. Therefore coffee makes people productive.',
    question: 'What is the weakness in this reasoning?',
    options: [
      'It confuses correlation with causation.',
      'It uses too small a sample.',
      'It contradicts itself.',
      'There is no weakness.'
    ],
    correctIndex: 0,
    explanation: 'A correlation between coffee drinking and productivity does not prove coffee causes it — other factors could explain both.'
  },
  {
    id: 'a2',
    statement: 'Our top salesperson wears a red tie every day. New hires should wear red ties to sell more.',
    question: 'What is the weakness in this reasoning?',
    options: [
      'It assumes an unrelated trait caused the success.',
      'It is a circular argument.',
      'It appeals to popularity.',
      'It is a false dilemma.'
    ],
    correctIndex: 0,
    explanation: 'The tie color is almost certainly irrelevant to sales skill — a classic spurious correlation.'
  },
  {
    id: 'a3',
    statement: 'This diet worked for my neighbor, so it will definitely work for me.',
    question: 'What is the weakness in this reasoning?',
    options: [
      'It generalizes from a single case to a different person.',
      'It relies on an authority.',
      'It attacks the person, not the argument.',
      'It sets up a false dilemma.'
    ],
    correctIndex: 0,
    explanation: 'One anecdote does not account for individual differences in biology, habits, or context.'
  }
];

const FactOpinionItems = [
  { id: 'fo1', text: 'The Eiffel Tower is located in Paris.', label: 'fact' },
  { id: 'fo2', text: 'The Eiffel Tower is the most beautiful landmark in the world.', label: 'opinion' },
  { id: 'fo3', text: 'Sales rose because the new ad campaign launched last month.', label: 'inference' },
  { id: 'fo4', text: 'This product will change your life.', label: 'unsupported claim' },
  { id: 'fo5', text: 'Water boils at 100°C at sea level.', label: 'fact' },
  { id: 'fo6', text: 'Remote work makes employees more creative.', label: 'unsupported claim' },
  { id: 'fo7', text: 'She left early, so she probably wanted to avoid traffic.', label: 'inference' },
  { id: 'fo8', text: 'Chocolate ice cream tastes better than vanilla.', label: 'opinion' }
];

const ProbabilityScenarios = [
  {
    id: 'p1',
    scenario: 'There is a 70% chance of rain today. Would bringing an umbrella be rational?',
    options: ['Yes — the odds of rain outweigh the small cost of carrying one.', 'No — 70% is not a majority of the day.', 'It depends only on the temperature.', 'Rain probability is irrelevant to this decision.'],
    correctIndex: 0,
    explanation: 'A high probability event with a low-cost precaution is a rational reason to prepare.'
  },
  {
    id: 'p2',
    scenario: 'A lottery ticket has a 1 in 10,000,000 chance of winning $1,000,000. The ticket costs $2. Is buying it a good financial decision on average?',
    options: ['Yes, because the prize is large.', 'No — the expected value is far below the cost.', 'Yes, because someone has to win.', 'It is impossible to say.'],
    correctIndex: 1,
    explanation: 'Expected value ≈ $0.10, well under the $2 cost — a losing bet on average, even though someone eventually wins.'
  },
  {
    id: 'p3',
    scenario: 'A medical test is 95% accurate. You test positive for a rare disease affecting 1 in 1000 people. Should you assume you definitely have it?',
    options: ['Yes, 95% accuracy is conclusive.', 'No — with such a rare disease, false positives can outnumber true positives.', 'It depends on your age.', 'Accuracy is irrelevant here.'],
    correctIndex: 1,
    explanation: 'This is the base-rate fallacy: with a rare condition, even an accurate test yields many false positives relative to true cases.'
  }
];
