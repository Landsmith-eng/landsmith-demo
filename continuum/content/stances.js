// The interview: seven views people hold, asked gently ("where do you stand?" and "how did you come to it?"). It is
// not a test. Each view has an idea on the map that shares it and gives it reasons (`with`), one that sees it another
// way (`other`), and a practice. Strong views reached mostly by instinct become the first stops of the user's journey.
// Only walk-only ideas are used, so no daily card is given away; `npm run check` verifies every id.
export const stances = [
  { id: 'human_nature', view: 'People are basically good.', with: 'mencius_child_at_the_well', other: 'xunzi_human_nature_is_bad', practice: 'practice_invest_in_people' },
  { id: 'free_choice', view: 'Our choices are truly our own.', with: 'sartre_existence_precedes_essence', other: 'skinner_beyond_freedom', practice: 'practice_control_your_response' },
  { id: 'success_happiness', view: 'More money and success would make a person happier.', with: 'maslow_hierarchy', other: 'brickman_lottery_winners', practice: 'practice_examine_daily' },
  { id: 'moral_lines', view: 'Some things are wrong, however good the outcome.', with: 'kant_ends_not_means', other: 'singer_drowning_child', practice: 'practice_hold_beliefs_loosely' },
  { id: 'meaning', view: 'A meaningful life needs something greater than ourselves: God, a cause, a tradition.', with: 'augustine_restless_heart', other: 'camus_myth_of_sisyphus', practice: 'practice_work_that_outlasts_you' },
  { id: 'liberty', view: 'People should be free to live as they choose, as long as they harm no one.', with: 'rousseau_born_free', other: 'burke_little_platoon', practice: 'practice_invest_in_people' },
  { id: 'death', view: 'Death is something to fear.', with: 'ecclesiastes_no_work_in_the_grave', other: 'montaigne_to_philosophize_is_to_learn_to_die', practice: 'practice_keep_death_in_view' },
];
// Where they stand (-2 strongly disagree … 2 strongly agree) and how they came to it.
export const BASIS = { thought: 'I have read and thought about it a lot', some: 'Some reading and thinking', instinct: 'Mostly instinct or upbringing' };
