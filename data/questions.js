/* data/questions.js
 * Content bank for the Critical Thinking section, organized by sub-type so
 * new questions can be appended without touching exercise logic.
 *
 * TO ADD YOUR OWN: append an object to any array below, matching the shape of
 * the existing entries. Nothing else needs to change — the exercise runner
 * picks questions at random from these arrays at load time.
 */

// ---- 1. Logical Patterns: {id, sequence[], answer, options[]} ----------------
const LogicalPatterns = [
  { id: 'lp1', sequence: [2, 4, 8, 16], answer: 32, options: [24, 32, 20, 30] },
  { id: 'lp2', sequence: [1, 1, 2, 3, 5, 8], answer: 13, options: [11, 13, 12, 14] },
  { id: 'lp3', sequence: [3, 6, 12, 24], answer: 48, options: [36, 42, 48, 30] },
  { id: 'lp4', sequence: [100, 90, 81, 73], answer: 66, options: [64, 65, 66, 68] },
  { id: 'lp5', sequence: [1, 4, 9, 16, 25], answer: 36, options: [30, 32, 36, 49] },
  { id: 'lp6', sequence: [5, 10, 20, 40], answer: 80, options: [60, 70, 80, 90] },
  { id: 'lp7', sequence: [2, 3, 5, 7, 11], answer: 13, options: [12, 13, 14, 15] },
  { id: 'lp8', sequence: [1, 2, 6, 24], answer: 120, options: [48, 96, 120, 144] },
  { id: 'lp9', sequence: [81, 27, 9, 3], answer: 1, options: [0, 1, 2, 3] },
  { id: 'lp10', sequence: [2, 6, 12, 20, 30], answer: 42, options: [40, 42, 44, 36] },
  { id: 'lp11', sequence: [1, 3, 7, 15, 31], answer: 63, options: [47, 55, 63, 62] },
  { id: 'lp12', sequence: [64, 32, 16, 8], answer: 4, options: [2, 4, 6, 0] },
  { id: 'lp13', sequence: [7, 14, 28, 56], answer: 112, options: [84, 98, 112, 120] },
  { id: 'lp14', sequence: [1, 8, 27, 64], answer: 125, options: [100, 125, 128, 144] },
  { id: 'lp15', sequence: [3, 4, 7, 11, 18], answer: 29, options: [25, 27, 29, 31] }
];

// ---- 2. Deduction: {id, premises[], question, options[], correctIndex, explanation}
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
  },
  {
    id: 'd5',
    premises: ['All engineers know maths.', 'Priya knows maths.'],
    question: 'Which conclusion is definitely true?',
    options: ['Priya is an engineer.', 'Priya is not an engineer.', 'Nothing follows about Priya’s job.', 'Some engineers are Priya.'],
    correctIndex: 2,
    explanation: 'Affirming the consequent. Knowing maths does not make someone an engineer — many non-engineers know maths too.'
  },
  {
    id: 'd6',
    premises: ['No reptiles are mammals.', 'All snakes are reptiles.'],
    question: 'Which conclusion is definitely true?',
    options: ['Some snakes are mammals.', 'No snakes are mammals.', 'All reptiles are snakes.', 'Nothing follows.'],
    correctIndex: 1,
    explanation: 'Snakes fall entirely inside "reptiles", and reptiles are entirely outside "mammals".'
  },
  {
    id: 'd7',
    premises: ['If the server is down, the site is offline.', 'The server is down.'],
    question: 'Which conclusion is definitely true?',
    options: ['The site is offline.', 'The site is online.', 'The server will restart.', 'Nothing follows.'],
    correctIndex: 0,
    explanation: 'Modus ponens: the condition is met, so the consequence follows directly.'
  },
  {
    id: 'd8',
    premises: ['Every student passed or retook the exam.', 'Marc is a student who did not retake the exam.'],
    question: 'Which conclusion is definitely true?',
    options: ['Marc failed.', 'Marc passed.', 'Marc was not a student.', 'Nothing follows.'],
    correctIndex: 1,
    explanation: 'Disjunctive syllogism: with one branch of the "or" eliminated, the other must hold.'
  },
  {
    id: 'd9',
    premises: ['Most of the team speaks Spanish.', 'Most of the team works remotely.'],
    question: 'Which conclusion is definitely true?',
    options: ['All remote workers speak Spanish.', 'At least one person both speaks Spanish and works remotely.', 'No overlap exists.', 'Nothing follows.'],
    correctIndex: 1,
    explanation: 'Two "most" groups in the same set must overlap by at least one member — each covers more than half.'
  },
  {
    id: 'd10',
    premises: ['If Ana attends, Bruno attends.', 'If Bruno attends, Carla attends.', 'Ana attends.'],
    question: 'Which conclusion is definitely true?',
    options: ['Only Bruno attends.', 'Carla attends.', 'Carla stays home.', 'Nothing follows.'],
    correctIndex: 1,
    explanation: 'Chained conditionals (hypothetical syllogism): Ana → Bruno → Carla.'
  }
];

// ---- 3. Detect the Assumption: {id, statement, question, options[], correctIndex, explanation}
const AssumptionQuestions = [
  {
    id: 'a1',
    statement: 'People who drink coffee every morning are more productive. Therefore coffee makes people productive.',
    question: 'What is the weakness in this reasoning?',
    options: ['It confuses correlation with causation.', 'It uses too small a sample.', 'It contradicts itself.', 'There is no weakness.'],
    correctIndex: 0,
    explanation: 'A correlation between coffee drinking and productivity does not prove coffee causes it — other factors could explain both.'
  },
  {
    id: 'a2',
    statement: 'Our top salesperson wears a red tie every day. New hires should wear red ties to sell more.',
    question: 'What is the weakness in this reasoning?',
    options: ['It assumes an unrelated trait caused the success.', 'It is a circular argument.', 'It appeals to popularity.', 'It is a false dilemma.'],
    correctIndex: 0,
    explanation: 'The tie colour is almost certainly irrelevant to sales skill — a classic spurious correlation.'
  },
  {
    id: 'a3',
    statement: 'This diet worked for my neighbour, so it will definitely work for me.',
    question: 'What is the weakness in this reasoning?',
    options: ['It generalises from a single case to a different person.', 'It relies on an authority.', 'It attacks the person, not the argument.', 'It sets up a false dilemma.'],
    correctIndex: 0,
    explanation: 'One anecdote does not account for individual differences in biology, habits, or context.'
  },
  {
    id: 'a4',
    statement: 'Either we cut the budget entirely or the company goes bankrupt.',
    question: 'What is the weakness in this reasoning?',
    options: ['It presents only two options when more exist.', 'It appeals to emotion.', 'It confuses cause and effect.', 'It relies on an unnamed authority.'],
    correctIndex: 0,
    explanation: 'A false dilemma: partial cuts, new revenue, or restructuring are all unmentioned alternatives.'
  },
  {
    id: 'a5',
    statement: 'The policy must be good — nobody in our office has complained about it.',
    question: 'What is the weakness in this reasoning?',
    options: ['Absence of complaints is treated as evidence of approval.', 'It is an ad hominem attack.', 'It is a circular definition.', 'It misuses a statistic.'],
    correctIndex: 0,
    explanation: 'Silence has many explanations — fear, apathy, or not being affected. Absence of evidence is not evidence of absence.'
  },
  {
    id: 'a6',
    statement: 'We surveyed visitors to our website and 95% said they love our brand. Clearly the public loves our brand.',
    question: 'What is the weakness in this reasoning?',
    options: ['The sample is self-selected and not representative.', 'The sample size is too large.', 'It reverses cause and effect.', 'It appeals to tradition.'],
    correctIndex: 0,
    explanation: 'Selection bias: people already visiting the site are far more favourable than the general public.'
  },
  {
    id: 'a7',
    statement: 'Dr. Lang has a PhD in physics, so his views on nutrition should settle the debate.',
    question: 'What is the weakness in this reasoning?',
    options: ['It appeals to authority outside the relevant field.', 'It uses circular reasoning.', 'It is a slippery slope.', 'It is a hasty generalisation.'],
    correctIndex: 0,
    explanation: 'Expertise does not transfer across domains — a physics doctorate carries no special weight in nutrition.'
  },
  {
    id: 'a8',
    statement: 'If we allow employees to work from home one day a week, soon nobody will come to the office at all.',
    question: 'What is the weakness in this reasoning?',
    options: ['It assumes an extreme outcome without justifying the steps.', 'It confuses correlation with causation.', 'It attacks the person.', 'It appeals to popularity.'],
    correctIndex: 0,
    explanation: 'A slippery slope: the chain from "one day" to "nobody ever" is asserted, not argued for.'
  },
  {
    id: 'a9',
    statement: 'Crime dropped after we installed the new streetlights, so the streetlights caused the drop.',
    question: 'What is the weakness in this reasoning?',
    options: ['Something else may have changed at the same time.', 'The conclusion restates the premise.', 'It uses an irrelevant authority.', 'It is a false dilemma.'],
    correctIndex: 0,
    explanation: 'Post hoc reasoning. Seasonal change, extra policing, or a general trend could explain the drop equally well.'
  },
  {
    id: 'a10',
    statement: 'Of course the newspaper is trustworthy — it says right on the masthead that it is the most reliable source in the country.',
    question: 'What is the weakness in this reasoning?',
    options: ['The claim is used as evidence for itself.', 'It is a slippery slope.', 'It generalises from one case.', 'It misreads a statistic.'],
    correctIndex: 0,
    explanation: 'Circular reasoning: the source own claim of reliability is offered as proof of that reliability.'
  }
];

// ---- 4. Fact vs Opinion: {id, text, label} -----------------------------------
// label must be one of: 'fact' | 'opinion' | 'inference' | 'unsupported claim'
const FactOpinionItems = [
  { id: 'fo1', text: 'The Eiffel Tower is located in Paris.', label: 'fact' },
  { id: 'fo2', text: 'The Eiffel Tower is the most beautiful landmark in the world.', label: 'opinion' },
  { id: 'fo3', text: 'Sales rose because the new ad campaign launched last month.', label: 'inference' },
  { id: 'fo4', text: 'This product will change your life.', label: 'unsupported claim' },
  { id: 'fo5', text: 'Water boils at 100°C at sea level.', label: 'fact' },
  { id: 'fo6', text: 'Remote work makes employees more creative.', label: 'unsupported claim' },
  { id: 'fo7', text: 'She left early, so she probably wanted to avoid traffic.', label: 'inference' },
  { id: 'fo8', text: 'Chocolate ice cream tastes better than vanilla.', label: 'opinion' },
  { id: 'fo9', text: 'The company reported 4.2 million euros in revenue last quarter.', label: 'fact' },
  { id: 'fo10', text: 'Given the queue outside, the restaurant must be excellent.', label: 'inference' },
  { id: 'fo11', text: 'Everyone knows this is the fastest phone ever made.', label: 'unsupported claim' },
  { id: 'fo12', text: 'French is a more elegant language than German.', label: 'opinion' },
  { id: 'fo13', text: 'The human body contains 206 bones in adulthood.', label: 'fact' },
  { id: 'fo14', text: 'The lights are off, so they have probably gone to bed.', label: 'inference' },
  { id: 'fo15', text: 'Morning routines are the single biggest driver of career success.', label: 'unsupported claim' },
  { id: 'fo16', text: 'Winter in Toronto is unpleasant.', label: 'opinion' }
];

// ---- 5. Probability / Decision Making ----------------------------------------
const ProbabilityScenarios = [
  {
    id: 'p1',
    scenario: 'There is a 70% chance of rain today. Would bringing an umbrella be rational?',
    options: ['Yes — the odds of rain outweigh the small cost of carrying one.', 'No — 70% is not a majority of the day.', 'It depends only on the temperature.', 'Rain probability is irrelevant to this decision.'],
    correctIndex: 0,
    explanation: 'A high-probability event with a low-cost precaution is a rational reason to prepare.'
  },
  {
    id: 'p2',
    scenario: 'A lottery ticket has a 1 in 10,000,000 chance of winning $1,000,000. The ticket costs $2. Is buying it a good financial decision on average?',
    options: ['Yes, because the prize is large.', 'No — the expected value is far below the cost.', 'Yes, because someone has to win.', 'It is impossible to say.'],
    correctIndex: 1,
    explanation: 'Expected value is about $0.10, well under the $2 cost — a losing bet on average, even though someone eventually wins.'
  },
  {
    id: 'p3',
    scenario: 'A medical test is 95% accurate. You test positive for a rare disease affecting 1 in 1000 people. Should you assume you definitely have it?',
    options: ['Yes, 95% accuracy is conclusive.', 'No — with such a rare disease, false positives can outnumber true positives.', 'It depends on your age.', 'Accuracy is irrelevant here.'],
    correctIndex: 1,
    explanation: 'The base-rate fallacy: with a rare condition, even an accurate test yields many false positives relative to true cases.'
  },
  {
    id: 'p4',
    scenario: 'A fair coin has landed heads five times in a row. What is the probability the next flip is heads?',
    options: ['Much less than 50% — tails is overdue.', 'Exactly 50%.', 'Much more than 50% — heads is on a streak.', 'It cannot be calculated.'],
    correctIndex: 1,
    explanation: 'The gambler fallacy. A fair coin has no memory; each flip stays at 50%.'
  },
  {
    id: 'p5',
    scenario: 'You have spent $200 on a concert ticket. On the night, you feel ill and would rather stay home. Should the $200 influence your decision to go?',
    options: ['Yes — you would waste the money otherwise.', 'No — the money is spent either way; only tonight comfort matters.', 'Yes, always honour a purchase.', 'Only if the ticket is refundable.'],
    correctIndex: 1,
    explanation: 'The sunk cost fallacy. The $200 is unrecoverable regardless, so it should not weigh on the choice.'
  },
  {
    id: 'p6',
    scenario: 'Offer A: a guaranteed $50. Offer B: a 50% chance at $110, otherwise nothing. Which has the higher expected value?',
    options: ['Offer A ($50).', 'Offer B ($55).', 'They are equal.', 'Expected value cannot apply here.'],
    correctIndex: 1,
    explanation: 'B expected value is 0.5 x $110 = $55, above A $50 — though a risk-averse person may still rationally prefer A.'
  },
  {
    id: 'p7',
    scenario: 'A shop advertises "90% of our customers are satisfied". What is the most important missing information?',
    options: ['How many customers were asked and how they were selected.', 'The shop opening hours.', 'The colour of the sign.', 'Nothing is missing.'],
    correctIndex: 0,
    explanation: 'A percentage without a denominator or sampling method can hide a tiny, self-selected sample.'
  },
  {
    id: 'p8',
    scenario: 'A new treatment reduces your risk from 2 in 10,000 to 1 in 10,000. The ad says "cuts your risk by 50%". Is that misleading?',
    options: ['No, 50% is accurate and meaningful.', 'Yes — the relative reduction hides a tiny absolute change.', 'Yes, because percentages are never valid.', 'No, absolute risk never matters.'],
    correctIndex: 1,
    explanation: 'The relative risk reduction is technically true, but the absolute reduction is only 0.01 percentage points.'
  }
];

// ---- 6. NEW — Analogies: {id, prompt, options[], correctIndex, explanation} ----
const AnalogyQuestions = [
  {
    id: 'an1', prompt: 'Bird is to nest as bee is to ___',
    options: ['honey', 'hive', 'flower', 'wing'], correctIndex: 1,
    explanation: 'The relationship is "animal to the structure it lives in". A bee lives in a hive.'
  },
  {
    id: 'an2', prompt: 'Doctor is to patient as teacher is to ___',
    options: ['school', 'lesson', 'student', 'textbook'], correctIndex: 2,
    explanation: 'The relationship is "professional to the person they serve".'
  },
  {
    id: 'an3', prompt: 'Thermometer is to temperature as scale is to ___',
    options: ['kitchen', 'weight', 'metal', 'number'], correctIndex: 1,
    explanation: 'The relationship is "instrument to the quantity it measures".'
  },
  {
    id: 'an4', prompt: 'Drought is to water as famine is to ___',
    options: ['hunger', 'food', 'desert', 'crops'], correctIndex: 1,
    explanation: 'The relationship is "crisis to the resource that is missing". A famine is a shortage of food.'
  },
  {
    id: 'an5', prompt: 'Whisper is to shout as drizzle is to ___',
    options: ['cloud', 'downpour', 'umbrella', 'damp'], correctIndex: 1,
    explanation: 'The relationship is "mild version to intense version of the same thing".'
  },
  {
    id: 'an6', prompt: 'Chapter is to book as movement is to ___',
    options: ['dance', 'symphony', 'muscle', 'orchestra'], correctIndex: 1,
    explanation: 'The relationship is "named subdivision to the whole work it belongs to".'
  },
  {
    id: 'an7', prompt: 'Sculptor is to marble as poet is to ___',
    options: ['language', 'emotion', 'paper', 'rhyme'], correctIndex: 0,
    explanation: 'The relationship is "artist to the raw material they shape".'
  },
  {
    id: 'an8', prompt: 'Cure is to disease as solution is to ___',
    options: ['chemistry', 'problem', 'answer', 'liquid'], correctIndex: 1,
    explanation: 'The relationship is "remedy to the thing it resolves".'
  },
  {
    id: 'an9', prompt: 'Frugal is to stingy as confident is to ___',
    options: ['shy', 'arrogant', 'capable', 'calm'], correctIndex: 1,
    explanation: 'The relationship is "positive trait to its excessive, negative form".'
  },
  {
    id: 'an10', prompt: 'Map is to territory as menu is to ___',
    options: ['restaurant', 'meal', 'waiter', 'price'], correctIndex: 1,
    explanation: 'The relationship is "representation to the reality it stands for".'
  }
];

// ---- 7. NEW — Odd One Out: {id, items[], correctIndex, explanation} ------------
const OddOneOutQuestions = [
  { id: 'oo1', items: ['Violin', 'Cello', 'Trumpet', 'Viola'], correctIndex: 2, explanation: 'The others are string instruments; a trumpet is brass.' },
  { id: 'oo2', items: ['Square', 'Triangle', 'Rectangle', 'Rhombus'], correctIndex: 1, explanation: 'The others all have four sides; a triangle has three.' },
  { id: 'oo3', items: ['Copper', 'Iron', 'Oxygen', 'Zinc'], correctIndex: 2, explanation: 'The others are metals; oxygen is a gas and a non-metal.' },
  { id: 'oo4', items: ['64', '81', '100', '50'], correctIndex: 3, explanation: 'The others are perfect squares (8², 9², 10²). 50 is not.' },
  { id: 'oo5', items: ['Whale', 'Shark', 'Dolphin', 'Seal'], correctIndex: 1, explanation: 'The others are mammals; a shark is a fish.' },
  { id: 'oo6', items: ['Paris', 'Madrid', 'Barcelona', 'Berlin'], correctIndex: 2, explanation: 'The others are national capitals; Barcelona is not.' },
  { id: 'oo7', items: ['Hammer', 'Screwdriver', 'Nail', 'Wrench'], correctIndex: 2, explanation: 'The others are tools; a nail is a fastener the tools act on.' },
  { id: 'oo8', items: ['Always', 'Never', 'Sometimes', 'Quickly'], correctIndex: 3, explanation: 'The others describe frequency; "quickly" describes manner.' },
  { id: 'oo9', items: ['3', '11', '21', '17'], correctIndex: 2, explanation: 'The others are prime; 21 = 3 x 7.' },
  { id: 'oo10', items: ['Mercury', 'Venus', 'Europa', 'Mars'], correctIndex: 2, explanation: 'The others are planets; Europa is a moon of Jupiter.' }
];

// ---- 8. NEW — Cognitive Biases: {id, scenario, options[], correctIndex, explanation}
const CognitiveBiasQuestions = [
  {
    id: 'cb1',
    scenario: 'You believe a stock will rise, so you read only the analysts who agree with you and skip the ones who do not.',
    options: ['Confirmation bias', 'Anchoring', 'Availability heuristic', 'Sunk cost fallacy'],
    correctIndex: 0,
    explanation: 'Confirmation bias: seeking out information that supports a belief you already hold.'
  },
  {
    id: 'cb2',
    scenario: 'A jacket is marked "was 400 euros, now 180" and suddenly feels like a bargain — though you would never pay 180 for a jacket normally.',
    options: ['Anchoring', 'Hindsight bias', 'Groupthink', 'Base-rate neglect'],
    correctIndex: 0,
    explanation: 'Anchoring: the first number you see becomes the reference point that makes the second look cheap.'
  },
  {
    id: 'cb3',
    scenario: 'After seeing news coverage of a plane crash, you feel flying is far more dangerous than driving.',
    options: ['Availability heuristic', 'Sunk cost fallacy', 'Dunning-Kruger effect', 'Confirmation bias'],
    correctIndex: 0,
    explanation: 'The availability heuristic: vivid, easily recalled events feel more probable than statistics justify.'
  },
  {
    id: 'cb4',
    scenario: 'After the election result is announced, a commentator insists the outcome was obvious all along — though he predicted the opposite last week.',
    options: ['Hindsight bias', 'Anchoring', 'Optimism bias', 'Framing effect'],
    correctIndex: 0,
    explanation: 'Hindsight bias: once you know the outcome, it feels far more predictable than it actually was.'
  },
  {
    id: 'cb5',
    scenario: 'A surgery described as having a "90% survival rate" sounds much better to patients than one with a "10% mortality rate".',
    options: ['Framing effect', 'Availability heuristic', 'Confirmation bias', 'Anchoring'],
    correctIndex: 0,
    explanation: 'The framing effect: identical information presented differently produces different decisions.'
  },
  {
    id: 'cb6',
    scenario: 'Everyone in the meeting privately has doubts, but nobody raises them because the team seems united and objecting feels disruptive.',
    options: ['Groupthink', 'Hindsight bias', 'Sunk cost fallacy', 'Base-rate neglect'],
    correctIndex: 0,
    explanation: 'Groupthink: the desire for harmony suppresses dissent and realistic appraisal of alternatives.'
  },
  {
    id: 'cb7',
    scenario: 'Having read two articles on immunology, someone feels confident debating a practising immunologist.',
    options: ['Dunning-Kruger effect', 'Anchoring', 'Framing effect', 'Confirmation bias'],
    correctIndex: 0,
    explanation: 'The Dunning-Kruger effect: limited knowledge can produce disproportionate confidence, because you cannot yet see what you are missing.'
  },
  {
    id: 'cb8',
    scenario: 'You study only the successful startups to find the habits that cause success, ignoring the failed ones that had identical habits.',
    options: ['Survivorship bias', 'Anchoring', 'Sunk cost fallacy', 'Hindsight bias'],
    correctIndex: 0,
    explanation: 'Survivorship bias: conclusions drawn only from survivors miss the cases that had the same traits but failed.'
  }
];

// ---- 9. NEW — Causal Reasoning: {id, scenario, question, options[], correctIndex, explanation}
const CausalReasoningQuestions = [
  {
    id: 'cr1',
    scenario: 'Cities with more ice cream sales also have more drownings each month.',
    question: 'What best explains this relationship?',
    options: ['Ice cream causes drowning.', 'Drownings cause ice cream sales.', 'Hot weather independently raises both.', 'It is a pure coincidence with no explanation.'],
    correctIndex: 2,
    explanation: 'A confounding variable: summer heat drives both swimming and ice cream consumption.'
  },
  {
    id: 'cr2',
    scenario: 'Students who attend optional tutoring score higher on exams than those who do not.',
    question: 'What is the biggest obstacle to concluding tutoring causes the higher scores?',
    options: ['Motivated students may be likelier to both attend and study more.', 'Exams are unreliable.', 'The sample is too large.', 'Nothing — the causal claim is safe.'],
    correctIndex: 0,
    explanation: 'Self-selection: students who choose tutoring may already differ in motivation, which independently raises scores.'
  },
  {
    id: 'cr3',
    scenario: 'A company introduced standing desks and productivity rose 8% that quarter.',
    question: 'What would most strengthen the claim that the desks caused the rise?',
    options: ['A comparable team without standing desks showed no change over the same quarter.', 'Employees said they liked the desks.', 'The desks were expensive.', 'Productivity also rose the previous year.'],
    correctIndex: 0,
    explanation: 'A control group experiencing the same period without the intervention is what isolates the desk effect.'
  },
  {
    id: 'cr4',
    scenario: 'Hospitals with the most advanced equipment report the highest patient death rates.',
    question: 'What is the most likely explanation?',
    options: ['Advanced equipment harms patients.', 'The sickest patients are referred to the best-equipped hospitals.', 'Death rates are randomly distributed.', 'Equipment quality is unrelated to outcomes.'],
    correctIndex: 1,
    explanation: 'Reverse selection: severity of illness drives the referral, so the causal arrow runs opposite to the naive reading.'
  },
  {
    id: 'cr5',
    scenario: 'A website changed its button colour and sign-ups increased the following week.',
    question: 'What weakens the causal conclusion most?',
    options: ['A major press feature ran that same week.', 'The new colour is blue.', 'Sign-ups are measured daily.', 'The team liked the new design.'],
    correctIndex: 0,
    explanation: 'A simultaneous alternative cause makes it impossible to attribute the lift to the colour change.'
  },
  {
    id: 'cr6',
    scenario: 'Countries with more mobile phones per person have longer average life expectancy.',
    question: 'What is the most plausible reading?',
    options: ['Mobile phones extend lifespan.', 'Longer lifespans cause phone ownership.', 'National wealth likely drives both.', 'The correlation must be a statistical error.'],
    correctIndex: 2,
    explanation: 'Wealth is a common cause: richer countries have both better healthcare and higher phone ownership.'
  }
];

// ---- 10. NEW — Conditional Logic: {id, rule, question, options[], correctIndex, explanation}
const ConditionalLogicQuestions = [
  {
    id: 'cl1',
    rule: 'If a card has a vowel on one side, it has an even number on the other.',
    question: 'You see four cards showing: A, K, 4, 7. Which cards must you turn over to test the rule?',
    options: ['A and 4', 'A and 7', 'A only', 'A, K and 4'],
    correctIndex: 1,
    explanation: 'The Wason selection task. Turn A (a vowel must have an even number) and 7 (an odd number must not hide a vowel). The 4 cannot break the rule whatever is behind it.'
  },
  {
    id: 'cl2',
    rule: 'If the alarm is armed, the door is locked.',
    question: 'Which observation would prove the rule false?',
    options: ['The alarm is armed and the door is locked.', 'The alarm is armed and the door is unlocked.', 'The alarm is off and the door is locked.', 'The alarm is off and the door is unlocked.'],
    correctIndex: 1,
    explanation: 'A conditional is falsified only by the antecedent being true while the consequent is false.'
  },
  {
    id: 'cl3',
    rule: 'If you have a ticket, you may enter.',
    question: 'Which statement is logically equivalent to this rule?',
    options: ['If you may enter, you have a ticket.', 'If you may not enter, you have no ticket.', 'If you have no ticket, you may not enter.', 'Only ticket holders exist.'],
    correctIndex: 1,
    explanation: 'The contrapositive (not-consequent implies not-antecedent) is the only form guaranteed to be equivalent.'
  },
  {
    id: 'cl4',
    rule: 'All members of the club pay dues. Sam pays dues.',
    question: 'What follows about Sam?',
    options: ['Sam is a member.', 'Sam is not a member.', 'Nothing about membership follows.', 'Sam runs the club.'],
    correctIndex: 2,
    explanation: 'Affirming the consequent is invalid — non-members could pay dues for other reasons.'
  },
  {
    id: 'cl5',
    rule: 'The light turns on only if the switch is up.',
    question: 'The light is on. What must be true?',
    options: ['The switch is up.', 'The switch is down.', 'Nothing follows.', 'The bulb is new.'],
    correctIndex: 0,
    explanation: '"Only if" makes the switch a necessary condition: no upward switch, no light.'
  },
  {
    id: 'cl6',
    rule: 'If it snows, school closes. School is closed today.',
    question: 'What can you conclude?',
    options: ['It snowed.', 'It did not snow.', 'It may or may not have snowed.', 'School never opens.'],
    correctIndex: 2,
    explanation: 'School could be closed for other reasons (a holiday, a burst pipe). The rule does not say snow is the only cause.'
  }
];
