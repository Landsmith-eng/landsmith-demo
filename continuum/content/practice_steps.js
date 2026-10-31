// The daily practice: wisdom is easy, practice is hard. Every session has the same skeleton (arrive, anchor, the
// exercise, an intention) at one of three sizes that grow with the habit:
//   tiny  = about ten seconds: one breath and one turn of attention
//   small = about a minute: the exercise once, slowly
//   full  = about five minutes: the exercise in steps
// The anchor is a line the user kept that lands on this practice, so the practice is built from what they chose to
// remember. These are our own words, written from the practices' sources (Seneca's evening review, Epictetus's split,
// Marcus Aurelius on mortality, and the rest); `npm run check` requires an entry for every practice node.
export const SIZES = { tiny: 10, small: 60, full: 300 };
export const SIZE_ORDER = ['tiny', 'small', 'full'];

export const practiceSteps = {
  practice_examine_daily: {
    tiny: 'Close your eyes. Name one thing you did well today, and one thing you would do differently.',
    small: 'Replay the day like a coach watching the tape: morning, middle, evening. Where did you act as you meant to? Where not? No verdicts, only notes.',
    full: [
      'Sit, and let the day come back in order, from waking until now.',
      'Stop at each moment that stung or pleased. Ask: what did I do, and what did I mean to do?',
      'Choose one thing to do differently tomorrow, and say it to yourself in a single sentence.',
    ],
    intention: 'Tomorrow I will…',
  },
  practice_control_your_response: {
    tiny: 'Think of one thing bothering you. Split it in two: the part that is up to you, and the part that is not. Put the second down for ten seconds.',
    small: 'Name what is bothering you. Write the event in one plain sentence, with no adjectives. Then notice the story you added to it. Only the story is yours to change.',
    full: [
      'Bring to mind the thing that upset you most today.',
      'Describe only what happened, as a camera would have recorded it.',
      'Now name your judgment of it: unfair, insulting, a disaster. That is the part you added.',
      'Ask what a calm, fair person would make of the same event, and try their reading on.',
    ],
    intention: 'Next time it happens, I will remember that…',
  },
  practice_work_that_outlasts_you: {
    tiny: 'Name one person or thing that will still be better because of something you did this week.',
    small: 'Think of the work, the person or the cause you would most like to outlast you. What is the smallest step toward it you could take today?',
    full: [
      'List the three things you spend the most hours on.',
      'For each, ask: will this matter to anyone in ten years?',
      'Pick the one that will, and choose a step toward it that fits inside today.',
    ],
    intention: 'Today, for something larger than me, I will…',
  },
  practice_keep_death_in_view: {
    tiny: 'Breathe in: this day will not come again. Breathe out: what deserves it?',
    small: 'Imagine you are looking back on today from the very end of your life. What would you be glad you spent it on? What would you not miss at all?',
    full: [
      'Sit still and let yourself remember, calmly, that this ends. Not today, but surely.',
      'Notice what goes quiet when you hold that thought: the small irritations, the comparisons.',
      'Notice what gets louder: the people, the work, the moments you would want back.',
      'Choose one of the loud ones and give it something today.',
    ],
    intention: 'Because this day is one of a limited number, I will…',
  },
  practice_hold_beliefs_loosely: {
    tiny: 'Pick one opinion you hold firmly. Picture the smartest person who disagrees. What would they say first?',
    small: 'Choose a belief you are sure of. Ask: what evidence would change my mind? If the answer is "nothing", hold it a little more loosely.',
    full: [
      'Write down one belief you hold strongly about how the world works or how people should live.',
      'Make the best case against it, as its strongest critic would, without arguing back.',
      'Name one thing in that case you cannot easily answer.',
      'Keep the belief if you still do, but keep the question too.',
    ],
    intention: 'This week I will listen for…',
  },
  practice_care_for_the_body: {
    tiny: 'Unclench your jaw. Drop your shoulders. Take one slow breath, all the way out.',
    small: 'Scan from your head down to your feet, slowly. Wherever you find tightness, breathe into it once. Then stand up and stretch.',
    full: [
      'Sit or lie down. Breathe in for four counts, out for six, five times.',
      'Move your attention slowly from your head down to your feet, softening each place as you go.',
      'Ask the body what it needs today: water, a walk, sleep, food, rest from the screen.',
      'Choose one of those and give it to yourself before the day ends.',
    ],
    intention: 'Today my body gets…',
  },
  practice_invest_in_people: {
    tiny: 'Bring one person to mind. Decide when you will next tell them they matter.',
    small: 'Think of someone you have been meaning to contact. Write them a short message now, or decide exactly when you will.',
    full: [
      'Bring to mind three people who make your life better.',
      'For each, remember one specific thing they did that you never thanked them for.',
      'Pick one of them, and give them real attention today: a call, a meal, a question whose answer you actually listen to.',
    ],
    intention: 'Today I will reach out to…',
  },
  // From Gollwitzer's implementation intentions, James's "seize the very first possible opportunity", and Bandura's
  // small wins.
  practice_if_then_plan: {
    tiny: 'Name one thing you keep meaning to do. Finish the sentence: "When ___ happens, I will ___."',
    small: 'Pick one goal that keeps slipping. Find the moment it slips: a time, a place, a feeling. Write one line, "If that moment comes, then I will…", with an action small enough to do on a bad day. Read it twice.',
    full: [
      'Choose one habit you want to start or stop. Make it small enough to do even on a bad day.',
      'Remember the last few times it went wrong. What was happening just before? That is your cue.',
      'Write the plan: "If [the cue], then I will [the action]." Make the action specific enough that someone watching could see you do it.',
      'Picture the cue arriving tomorrow, and see yourself doing the action, once, in detail.',
      'Add a second plan for the likeliest obstacle: "If [obstacle], then I will…"',
    ],
    intention: 'If ___ happens, then I will…',
  },
  // From affect labelling (putting feelings into words), Linehan's observe-and-describe skills, Pennebaker's
  // writing, and Spinoza on forming a clear idea of a passion.
  practice_name_the_feeling: {
    tiny: 'Stop and put one word to what you feel right now. Not why; only the word.',
    small: 'Notice where the feeling sits in your body. Try a few words for it (angry, hurt, ashamed, tired, afraid) until one fits better than the rest. Then say it plainly to yourself: "This is…"',
    full: [
      'Sit, and bring to mind something that stirred you today.',
      'Notice the body first: where the feeling is, how strong, tight or heavy, hot or cold.',
      'Name it in one or two words. If the first word is vague ("bad", "stressed"), look for a sharper one.',
      'Say what it is about in one plain sentence, as a reporter would.',
      'Ask what the feeling is urging you to do, and whether you want to do it.',
    ],
    intention: 'Next time I feel it rising, I will stop and name it…',
  },
};

// The skeleton around every exercise.
export const ARRIVE = {
  tiny: 'Ten seconds. Stop where you are.',
  small: 'One minute. Put everything else down.',
  full: 'Five minutes. Find somewhere quiet.',
};
