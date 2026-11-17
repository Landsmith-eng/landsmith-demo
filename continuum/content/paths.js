// Paths: a practice to commit to, in three sizes. They grow out of "What It All Sums To" (Jack, October 2026): wisdom
// isn't scarce, practice is. The seven practices that unrelated traditions found independently, and that modern evidence
// supports, become ten short anchors, five to set the day and five to review it. A path decides which anchors you answer
// each day, which practice is in focus, and which idea on the map comes with it (from the ideas that land on that
// practice), so practising weaves in and out of the rest of Continuum. A day counts when you show up: missing a day
// never fails a path, it only waits.
//
// The source lines are standard translations, checked: Juvenal, Satires 10.356; Epictetus, Enchiridion 1 (Oldfather);
// Epicurus, Principal Doctrines 27 (Hicks); Nietzsche, Twilight of the Idols, "Maxims and Arrows" 12 (Kaufmann; the popular "He who
// has a why…" is Frankl's paraphrase of it); Marcus Aurelius, Meditations 7.69 and 8.47 (Hays; Long); Seneca, On Anger
// 3.36 (Kaster); Hume, Enquiry concerning Human Understanding 10.4; Confucius, Analects 2.13 (Legge); Aristotle, Nicomachean Ethics 2.1 (Ross); Dhammapada 1 (Müller).

export const ANCHORS = {
  body_am: { practice: 'practice_care_for_the_body', when: 'morning', label: 'Body', prompt: 'What is the sleep window tonight, and when does movement happen today? Name the time.', source: 'Juvenal, Satires 10', line: '"A sound mind in a sound body."' },
  control_am: { practice: 'practice_control_your_response', when: 'morning', label: 'Control', prompt: 'What is likely to go wrong today, and which parts of it are yours to control? Rehearse the response, not the outcome.', source: 'Epictetus, Enchiridion 1 (Oldfather)', line: '"Some things are under our control, while others are not under our control."' },
  people_am: { practice: 'practice_invest_in_people', when: 'morning', label: 'People', prompt: 'Who are the one or two people you will actually reach today?', source: 'Epicurus, Principal Doctrines 27', line: '"Of all the means which are procured by wisdom to ensure happiness throughout the whole of life, by far the most important is the acquisition of friends."' },
  work_am: { practice: 'practice_work_that_outlasts_you', when: 'morning', label: 'Lasting work', prompt: 'What is the one hard thing you will move forward today that nobody is paying you for?', source: 'Nietzsche, Twilight of the Idols, "Maxims and Arrows" 12', line: '"If we have our own why of life, we shall get along with almost any how."' },
  death_am: { practice: 'practice_keep_death_in_view', when: 'morning', label: 'Death in view', prompt: 'This is an ordinary day, and there are a finite number of them. What would it be a shame to leave undone today?', source: 'Marcus Aurelius, Meditations 7.69', line: '"Perfection of character: to live your last day, every day, without frenzy, or sloth, or pretense."' },
  ledger_pm: { practice: 'practice_examine_daily', when: 'evening', label: 'Ledger', prompt: 'What did you do well today? What did you do badly? What did you leave undone? Deeds, not thoughts.', source: 'Seneca, On Anger 3.36', line: '"When the light has been taken away and my wife has fallen silent, … I examine my entire day and go back over what I\'ve done and said."' },
  response_pm: { practice: 'practice_control_your_response', when: 'evening', label: 'Response check', prompt: 'Where did you react to something outside your control as if it were inside it?', source: 'Marcus Aurelius, Meditations 8.47', line: '"If you are pained by any external thing, it is not this thing that disturbs you, but your own judgement about it."' },
  people_pm: { practice: 'practice_invest_in_people', when: 'evening', label: 'People', prompt: 'Did you show up for anyone today? Did anyone show up for you, and did you notice?', source: 'Epicurus, Principal Doctrines 27', line: '"… by far the most important is the acquisition of friends."' },
  beliefs_pm: { practice: 'practice_hold_beliefs_loosely', when: 'evening', label: 'Beliefs', prompt: 'Did you learn anything today that should change your mind?', source: 'Hume, Enquiry concerning Human Understanding 10', line: '"A wise man, therefore, proportions his belief to the evidence."' },
  body_pm: { practice: 'practice_care_for_the_body', when: 'evening', label: 'Body', prompt: 'Lights out at the time you named this morning. Did today\'s movement happen?', source: 'Juvenal, Satires 10', line: '"A sound mind in a sound body."' },
  // The checks that come round less often, and the endings.
  weekly: { when: 'evening', label: 'The weekly test', prompt: 'Did what you did this week match what you claim to believe? Where not?', source: 'Confucius, Analects 2.13', line: '"He acts before he speaks, and afterwards speaks according to his actions."' },
  monthly: { when: 'evening', label: 'What changed your mind', prompt: 'List what changed your mind this month, however small. An empty list is the finding.', source: 'Socrates, in Plato\'s Apology', line: '"I neither know nor think that I know."' },
  seven: { when: 'evening', label: 'Two weeks in', prompt: 'Which of the seven came easiest to you, and which do you keep skipping? What would make the hard one easier?', source: 'Aristotle, Nicomachean Ethics 2.1', line: '"We become just by doing just acts, temperate by doing temperate acts, brave by doing brave acts."' },
  keep: { when: 'evening', label: 'What you keep', prompt: 'Which of these will you keep doing now the month is over, and when in the day will it happen?', source: 'Aristotle, Nicomachean Ethics 2.1', line: '"We become just by doing just acts, temperate by doing temperate acts, brave by doing brave acts."' },
  sums: { when: 'evening', label: 'What it sums to', prompt: 'Twelve weeks in: what does it all sum to, for you? A sentence or a page. Then: what will you do with it?', source: 'The Dhammapada 1', line: '"All that we are is the result of what we have thought."' },
};

export const PRACTICE_ORDER = ['practice_examine_daily', 'practice_care_for_the_body', 'practice_control_your_response', 'practice_invest_in_people',
  'practice_work_that_outlasts_you', 'practice_hold_beliefs_loosely', 'practice_keep_death_in_view'];
// One anchor per practice, for the light path's single daily question.
const ONE = { practice_examine_daily: 'ledger_pm', practice_care_for_the_body: 'body_am', practice_control_your_response: 'control_am', practice_invest_in_people: 'people_am',
  practice_work_that_outlasts_you: 'work_am', practice_hold_beliefs_loosely: 'beliefs_pm', practice_keep_death_in_view: 'death_am' };
const MORNING = ['body_am', 'control_am', 'people_am', 'work_am', 'death_am'];
const EVENING = ['ledger_pm', 'response_pm', 'people_pm', 'beliefs_pm', 'body_pm'];

export const PATHS = [
  {
    id: 'light', name: 'A light path', days: 14, effort: 'A minute or two a day',
    promise: 'Two weeks. One question a day from one of the seven practices, and the day\'s idea chosen to go with it, so you wander in and out of the map as you go.',
    examples: [
      'You find out which of the seven you already do without trying, and which one you keep skipping.',
      'A hard moment at work goes differently, because that morning you had already decided what was yours to control.',
      'You meet a dozen thinkers from five traditions, centuries and continents apart, who arrived at the same few habits.',
    ],
  },
  {
    id: 'month', name: 'The month', days: 30, effort: 'About ten minutes: five in the morning, five at night',
    promise: 'Thirty days of the morning and evening practice, built up a week at a time: the body and the evening ledger first, then control, then people, then lasting work, death and your beliefs. One idea from the map every other day, from the week\'s practice.',
    examples: [
      'Your evening ledger shows the same trigger three times in a week, and the fourth time you see it coming.',
      'You name a bedtime every morning; by the third week you keep it most nights, and you can tell the difference.',
      'On day thirty you have a list, in your own words, of what changed your mind this month.',
    ],
  },
  {
    id: 'course', name: 'The long course', days: 84, effort: 'About twenty minutes a day',
    promise: 'Twelve weeks for the convinced. The whole practice every day, morning and evening; each week one practice in depth, with an idea a day from the thinkers and traditions behind it and the practice itself at full size; then four weeks of living them in pairs, and a last week to write what it all sums to for you.',
    examples: [
      'You can say, in a sentence and with your sources, why each practice is there and who found it.',
      'Three months of your own entries show a pattern you could not see from inside any single week.',
      'You finish by writing what it all sums to, for you, and what you will do about it.',
    ],
  },
];
// The ideas on the map that show why: the evidence and the oldest witnesses.
export const WHY_IDEAS = ['seneca_evening_review', 'zengzi_three_daily_examinations', 'pennebaker_expressive_writing', 'william_james_habit',
  'harvard_study_adult_development', 'beck_cognitive_therapy_stoicism_tested', 'gollwitzer_implementation_intentions', 'epictetus_up_to_us'];
export const THESIS = { text: 'Wisdom isn\'t scarce. Practice is. Across two and a half thousand years and every continent, people found the same handful of practices for living well. The problem was never knowing them; it is doing them, every day.', source: 'From "What It All Sums To"' };

// What a path asks on its day d (1-based): the anchors morning and evening, the practice in focus, and whether an idea
// from that practice comes with the day.
export function planFor(pathId, d) {
  if (pathId === 'light') {
    const focus = PRACTICE_ORDER[(d - 1) % 7]; const one = ANCHORS[ONE[focus]];
    const extra = d === 7 ? ['weekly'] : d === 14 ? ['seven'] : [];
    return { focus, idea: true, morning: one.when === 'morning' ? [ONE[focus]] : [], evening: [...(one.when === 'evening' ? [ONE[focus]] : []), ...extra] };
  }
  if (pathId === 'month') {
    const week = Math.min(4, Math.ceil(d / 7));
    const morning = [['body_am'], ['body_am', 'control_am'], ['body_am', 'control_am', 'people_am'], MORNING][week - 1];
    const evening = [['ledger_pm', 'body_pm'], ['ledger_pm', 'response_pm', 'body_pm'], ['ledger_pm', 'response_pm', 'people_pm', 'body_pm'], EVENING][week - 1];
    const focus = ['practice_examine_daily', 'practice_control_your_response', 'practice_invest_in_people', ['practice_work_that_outlasts_you', 'practice_keep_death_in_view', 'practice_hold_beliefs_loosely'][d % 3]][week - 1];
    const extra = [...(d % 7 === 0 ? ['weekly'] : []), ...(d === 30 ? ['monthly', 'keep'] : [])];
    return { focus, idea: d % 2 === 1, morning, evening: [...evening, ...extra] };
  }
  // The long course: seven weeks, one practice each; four weeks of pairs; a last week of the whole.
  const week = Math.ceil(d / 7);
  const PAIRS = [['practice_care_for_the_body', 'practice_keep_death_in_view'], ['practice_control_your_response', 'practice_hold_beliefs_loosely'],
    ['practice_invest_in_people', 'practice_work_that_outlasts_you'], ['practice_examine_daily', 'practice_keep_death_in_view']];
  const focus = week <= 7 ? PRACTICE_ORDER[week - 1] : week <= 11 ? PAIRS[week - 8][d % 2] : PRACTICE_ORDER[d % 7];
  const extra = [...(d % 7 === 0 ? ['weekly'] : []), ...(d % 28 === 0 ? ['monthly'] : []), ...(d === 84 ? ['sums'] : [])];
  return { focus, idea: true, full: week <= 7 && (d % 7 === 1 || d % 7 === 4), morning: MORNING, evening: [...EVENING, ...extra] };
}
export const pathById = (id) => PATHS.find((p) => p.id === id) ?? null;
