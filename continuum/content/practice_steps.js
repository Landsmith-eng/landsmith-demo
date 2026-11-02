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
  // The schools' methods (psychology2.js), as everyday exercises, not treatment.
  // From Beck's record of automatic thoughts, Burns's list of distortions and Ellis's A-B-C.
  practice_thought_record: {
    tiny: 'Catch the last thought that stung. Ask one question of it: is that a fact, or a bend in the mirror?',
    small: 'Write one line for what happened, one for the thought that went through your head, and one word for the feeling. Then ask: what would I say to a friend who had that thought?',
    full: [
      'Write the situation in one plain sentence, as a camera would have recorded it.',
      'Write the thought that went through your head, word for word, and how much you believe it, from 0 to 100.',
      'Name the feeling and how strong it is.',
      'Look for the bend: all-or-nothing, mind-reading, fortune-telling, a label, a "should".',
      'Write a fairer version of the thought, one you can actually believe, and rate the feeling again.',
    ],
    intention: 'Next time that thought comes, I will answer it with…',
  },
  // From Lewinsohn's pleasant-activity scheduling and Jacobson's behavioural activation; Thorndike's law of effect.
  practice_behavioural_activation: {
    tiny: 'Name one small thing you could do in the next hour that is either pleasant or worth doing. Stand up.',
    small: 'Pick one small activity that you used to enjoy or that matters to you. Make it smaller still, until it would fit on a bad day, and give it a time today.',
    full: [
      'Notice how you feel right now, from 0 to 10.',
      'List three activities that used to bring pleasure, and three that bring a sense of getting something done.',
      'Choose one, and shrink it until it takes ten minutes or less.',
      'Put it in the day at a set time and place, as you would an appointment.',
      'Afterwards, rate your mood again, and notice whether doing came before feeling.',
    ],
    intention: 'Today, whatever my mood, I will…',
  },
  // From Wolpe's hierarchy and later exposure work; Bandura's mastery. For everyday avoidance only.
  practice_exposure_ladder: {
    tiny: 'Name one small thing you have been avoiding. Picture the very first step towards it, and breathe out slowly.',
    small: 'Take one everyday avoidance. Write five steps toward it, from the easiest to the hardest. Choose the bottom step, and decide when you will take it.',
    full: [
      'Choose an everyday avoidance, not a serious phobia, panic or trauma; those deserve a professional.',
      'Write a ladder of five to eight steps, from slightly uncomfortable to the hardest.',
      'Rate how anxious each step would make you, from 0 to 10.',
      'Take the bottom step, and stay with it until the worry has clearly eased, without escaping early.',
      'Repeat it until it feels easy, then move up one rung. Note each rung climbed.',
    ],
    intention: 'This week I will take the step of…',
  },
  // From Hayes's ACT (values as directions, committed action) and Deci and Ryan on autonomous motivation.
  practice_values_compass: {
    tiny: 'Ask: in this moment, what kind of person do I want to be? Take one breath in that direction.',
    small: 'Pick one area of life: work, family, health or friendship. Finish the sentence "Here I want to be someone who…". Then name one small step that way today.',
    full: [
      'Choose an area of life that feels stuck.',
      'Write what you want to stand for there, as a direction ("being a patient parent"), not a goal you could finish.',
      'Notice what feeling or thought usually stops you: fear, boredom, "I\'m not good at this".',
      'Choose a step in your direction small enough to take with that feeling along for the ride.',
      'Take it, and notice that you did it without waiting to feel ready.',
    ],
    intention: 'Today, in the direction of what I value, I will…',
  },
  // From ACT's cognitive defusion and MBCT's "thoughts are not facts".
  practice_defusion: {
    tiny: 'Take the harshest thought you have had today and add, silently: "I\'m having the thought that…"',
    small: 'Say the thought to yourself. Then say "I\'m having the thought that…" before it. Then "I notice I\'m having the thought that…" Feel the small distance each frame adds.',
    full: [
      'Sit, and let a sticky, painful thought about yourself come to mind. Keep it short: "I\'m a failure."',
      'Hold it for a few seconds, and notice how it feels to believe it.',
      'Now put a frame on it: "I\'m having the thought that I\'m a failure."',
      'Add another: "I notice I\'m having the thought that I\'m a failure."',
      'Picture the thought as a leaf on a stream or a car passing, and let it go by without following it.',
    ],
    intention: 'When that thought comes back, I will say: "I\'m having the thought that…"',
  },
  // From Neff's self-compassion break: mindfulness, common humanity, kindness.
  practice_self_compassion_break: {
    tiny: 'Put a hand on your chest. Say: this is hard. Others feel this too. May I be kind to myself.',
    small: 'Think of what is hurting now. Say three things slowly: "This is a moment of pain." "Pain is part of being human; I am not the only one." "May I give myself what I need."',
    full: [
      'Bring to mind a difficulty that is bothering you, not the worst one.',
      'Name it plainly: "This is painful", or "This is stress."',
      'Remind yourself that others feel this too: "I am not alone in this."',
      'Put a hand somewhere comforting and ask: what would I say to a good friend here? Say it to yourself.',
      'Do one kind, practical thing for yourself before the day ends.',
    ],
    intention: 'The next time I fail, I will speak to myself as I would to…',
  },
  // From de Shazer and Berg's miracle question, exceptions and scaling questions.
  practice_miracle_question: {
    tiny: 'Imagine the problem gone tomorrow morning. What is the first small thing you would notice?',
    small: 'Picture waking up with the problem solved. Describe the first hour in detail: what you do, what others see. Then ask when a little of that already happens.',
    full: [
      'Name the problem in one sentence.',
      'Imagine that while you sleep tonight, a miracle solves it. You do not know it happened.',
      'Describe tomorrow in small, visible details: what is the first sign? What do others notice about you?',
      'Find an exception: when, recently, did a little of that already happen? What were you doing differently?',
      'On a scale of 0 to 10, where are you now? What would one point higher look like?',
    ],
    intention: 'Tomorrow I will do more of what worked when…',
  },
  // From White and Epston's externalising conversations and "unique outcomes".
  practice_externalise_problem: {
    tiny: 'Give the problem that is bothering you a name, like a character. Notice the small gap between you and it.',
    small: 'Name the problem ("the Worry", "the Put-Off"). Ask: what does it tell me? When does it win? When did I last get the better of it?',
    full: [
      'Choose a problem that keeps coming back, and give it a name, as if it were a character outside you.',
      'Write what it says to you and what tricks it uses: when it shows up, what it makes you do.',
      'Write what it has cost you, and what it has tried to take from you.',
      'Find a time you resisted it, even a little. How did you manage that?',
      'Write a sentence or two of the story of you and this problem from that time on.',
    ],
    intention: 'Next time it shows up, I will remember that I beat it when…',
  },
  // From the decisional balance of the stages model, reshaped by motivational interviewing's change talk
  // (Miller and Rose 2015: end on your own reasons, not a neutral tally).
  practice_decisional_balance: {
    tiny: 'Think of a change you are unsure about. Name one reason for it that is truly your own.',
    small: 'About one change you keep putting off, ask: what would be better if I did it? Why does that matter to me? How ready am I, from 0 to 10, and why not a lower number?',
    full: [
      'Choose a change you are torn about.',
      'Write honestly what the present habit gives you. It does give you something.',
      'Write what it costs you, now and later.',
      'Write what the change would give you, in your own words, and why each item matters to you.',
      'Rate how ready you feel, from 0 to 10, and ask why it is not a lower number. That answer is your own reason.',
    ],
    intention: 'My own reason for this change is…',
  },
  // From Seligman's "three good things" exercise and Fredrickson's broaden-and-build.
  practice_three_good_things: {
    tiny: 'Name one thing that went well today, however small.',
    small: 'Name three things that went well today. For one of them, say why it happened, and what part you or others played.',
    full: [
      'Before sleep, think back over the day, from waking until now.',
      'Write down three things that went well, large or small.',
      'For each, write a line on why it happened.',
      'Choose one, and let yourself feel again, for a few breaths, what was good about it.',
    ],
    intention: 'Tomorrow I will look out for…',
  },
};

// The skeleton around every exercise.
export const ARRIVE = {
  tiny: 'Ten seconds. Stop where you are.',
  small: 'One minute. Put everything else down.',
  full: 'Five minutes. Find somewhere quiet.',
};
