// The great debates: seven questions people have argued over for thousands of years, each answered by two camps from
// the map. The interview asks which case speaks to the user more (never "what is wrong with you"), and how well they
// know the debate. Cases they find clearly stronger, but know mostly by feeling, become the first stops of their
// journey: that camp at its best, then the other camp at its best, then a practice. Only walk-only ideas are used, so
// no daily card is given away; `npm run check` verifies every id.
export const stances = [
  {
    id: 'human_nature', question: 'Are human beings good by nature?',
    a: { idea: 'mencius_child_at_the_well', who: 'Mencius', claim: 'Goodness is in us from the start, like a sprout. Anyone who sees a child about to fall into a well feels alarm.' },
    b: { idea: 'xunzi_human_nature_is_bad', who: 'Xunzi', claim: 'Goodness is made, not born: by teaching, ritual and long effort, the way a warped board is steamed straight.' },
    practice: 'practice_invest_in_people',
  },
  {
    id: 'free_choice', question: 'Do we freely choose who we become?',
    a: { idea: 'sartre_existence_precedes_essence', who: 'Sartre', claim: 'We are thrown into the world without a fixed nature, and we make ourselves by what we choose.' },
    b: { idea: 'skinner_beyond_freedom', who: 'Skinner', claim: 'What we call choice is behaviour shaped by its consequences; change the surroundings and the person changes.' },
    practice: 'practice_control_your_response',
  },
  {
    id: 'success_happiness', question: 'Do better circumstances make for a better life?',
    a: { idea: 'maslow_hierarchy', who: 'Maslow', claim: 'Meet people\'s needs, from bread and safety to love and respect, and they become free to become themselves.' },
    b: { idea: 'brickman_lottery_winners', who: 'Brickman', claim: 'We soon get used to good fortune and drift back to where we were; gains in circumstance fade.' },
    practice: 'practice_examine_daily',
  },
  {
    id: 'moral_lines', question: 'Are some things wrong whatever the outcome?',
    a: { idea: 'kant_ends_not_means', who: 'Kant', claim: 'Yes: some lines hold whatever they would achieve. Treat people always as ends, never merely as means.' },
    b: { idea: 'singer_drowning_child', who: 'Singer', claim: 'What matters is the good we can do: if we can prevent great suffering at small cost, we ought to.' },
    practice: 'practice_hold_beliefs_loosely',
  },
  {
    id: 'meaning', question: 'Does a meaningful life need something greater than ourselves?',
    a: { idea: 'augustine_restless_heart', who: 'Augustine', claim: 'Our hearts are restless until they rest in something beyond us.' },
    b: { idea: 'camus_myth_of_sisyphus', who: 'Camus', claim: 'Meaning is made in the living itself, even when no answer comes from above.' },
    practice: 'practice_work_that_outlasts_you',
  },
  {
    id: 'liberty', question: 'Is a person freest alone, or within a community?',
    a: { idea: 'rousseau_born_free', who: 'Rousseau', claim: 'We are born free, and everywhere in chains: every bond society puts on us must justify itself.' },
    b: { idea: 'burke_little_platoon', who: 'Burke', claim: 'We find ourselves in our little platoons: family, neighbours, place and tradition.' },
    practice: 'practice_invest_in_people',
  },
  {
    id: 'death', question: 'How should we face death?',
    a: { idea: 'ecclesiastes_no_work_in_the_grave', who: 'Ecclesiastes', claim: 'Soberly: there is no work in the grave, so whatever your hand finds to do, do it now.' },
    b: { idea: 'montaigne_to_philosophize_is_to_learn_to_die', who: 'Montaigne', claim: 'By rehearsing it, until it holds no terror: to study philosophy is to learn to die.' },
    practice: 'practice_keep_death_in_view',
  },
];
// How well they know the debate. Said kindly: most of what anyone believes comes from feeling and upbringing.
export const BASIS = { thought: 'I have read and thought about it', some: 'I know a little of it', instinct: 'It is more a feeling than a study' };
