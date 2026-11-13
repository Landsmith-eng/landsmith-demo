// Surveys for the psychology room: "where are you now?". Two kinds:
//   screen   short, widely used questionnaires, free to use, with their published scoring (a screening, never a
//            diagnosis; a high score is a reason to talk to a doctor or counsellor);
//   reflect  Continuum's own reflective questions (not validated scales): where a problem lives, readiness to change,
//            thinking traps, values. They point to the schools of psychology and the practices that fit.
// Shared by the phone (to ask and to show) and the server (to score and keep), so both read results the same way.
// score(answers) takes { itemId: value } and returns { total, band, summary, details: [lines], schools: [ids],
// practices: [ids], ideas: [ids], crisis: boolean }.

const OFTEN = [['Not at all', 0], ['Several days', 1], ['More than half the days', 2], ['Nearly every day', 3]];
const SEE_SOMEONE = 'If you have felt like this for a while, it is worth talking to a doctor or a counsellor: scores like this are what they look for.';
const band = (x, bands) => bands.find(([max]) => x <= max)?.[1] ?? bands.at(-1)[1];
const sum = (a, ids) => ids.reduce((s, id) => s + (Number(a[id]) || 0), 0);

export const SURVEYS = [
  {
    id: 'mood', name: 'Mood', short: 'PHQ-9', kind: 'screen', time: '2 minutes',
    about: 'Nine questions about low mood over the last two weeks. Used by doctors worldwide to notice depression.',
    lead: 'Over the last 2 weeks, how often have you been bothered by any of the following problems?',
    source: 'Patient Health Questionnaire (PHQ-9): Kroenke, Spitzer & Williams, 2001. Developed with an educational grant from Pfizer Inc.; free to reproduce and use.',
    options: OFTEN,
    items: [
      ['q1', 'Little interest or pleasure in doing things'],
      ['q2', 'Feeling down, depressed, or hopeless'],
      ['q3', 'Trouble falling or staying asleep, or sleeping too much'],
      ['q4', 'Feeling tired or having little energy'],
      ['q5', 'Poor appetite or overeating'],
      ['q6', 'Feeling bad about yourself — or that you are a failure or have let yourself or your family down'],
      ['q7', 'Trouble concentrating on things, such as reading the newspaper or watching television'],
      ['q8', 'Moving or speaking so slowly that other people could have noticed? Or the opposite — being so fidgety or restless that you have been moving around a lot more than usual'],
      ['q9', 'Thoughts that you would be better off dead or of hurting yourself in some way'],
    ],
    score(a) {
      const total = sum(a, ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9']);
      const b = band(total, [[4, 'minimal'], [9, 'mild'], [14, 'moderate'], [19, 'moderately severe'], [27, 'severe']]);
      return {
        total, max: 27, band: b, crisis: Number(a.q9) > 0,
        summary: `${total} of 27: ${b} symptoms of low mood.`,
        details: [
          total <= 4 ? 'Few signs of low mood in the last two weeks.' : total <= 9 ? 'Some signs of low mood: worth watching, and worth looking after the basics (sleep, movement, people, things you enjoy).' : `A real weight of low mood. ${SEE_SOMEONE}`,
          'Behavioural activation (doing small, valued things even before you feel like it) and cognitive therapy (testing the thoughts that keep mood low) are among the best-supported ways out.',
        ],
        schools: ['behaviourism', 'cbt', 'cognitive', 'third_wave'], practices: ['practice_behavioural_activation', 'practice_thought_record', 'practice_three_good_things'], ideas: ['beck_cognitive_therapy_stoicism_tested', 'seligman_learned_helplessness'],
      };
    },
  },
  {
    id: 'worry', name: 'Worry and anxiety', short: 'GAD-7', kind: 'screen', time: '2 minutes',
    about: 'Seven questions about worry and nerves over the last two weeks.',
    lead: 'Over the last 2 weeks, how often have you been bothered by the following problems?',
    source: 'Generalized Anxiety Disorder 7-item scale (GAD-7): Spitzer, Kroenke, Williams & Löwe, 2006. Free to reproduce and use.',
    options: OFTEN,
    items: [
      ['q1', 'Feeling nervous, anxious, or on edge'],
      ['q2', 'Not being able to stop or control worrying'],
      ['q3', 'Worrying too much about different things'],
      ['q4', 'Trouble relaxing'],
      ['q5', "Being so restless that it's hard to sit still"],
      ['q6', 'Becoming easily annoyed or irritable'],
      ['q7', 'Feeling afraid as if something awful might happen'],
    ],
    score(a) {
      const total = sum(a, ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7']);
      const b = band(total, [[4, 'minimal'], [9, 'mild'], [14, 'moderate'], [21, 'severe']]);
      return {
        total, max: 21, band: b, crisis: false,
        summary: `${total} of 21: ${b} anxiety.`,
        details: [
          total <= 4 ? 'Little worry or tension in the last two weeks.' : total <= 9 ? 'Some worry and tension: common, and worth a few good habits.' : `A lot of worry and tension. ${SEE_SOMEONE}`,
          'Worry shrinks when it is faced in small steps rather than avoided (exposure), when worried thoughts are held a little more lightly (defusion), and when the body is calmed (slow breathing, sleep, movement).',
        ],
        schools: ['cbt', 'third_wave', 'behaviourism', 'biological'], practices: ['practice_exposure_ladder', 'practice_defusion', 'practice_name_the_feeling'], ideas: ['kabat_zinn_mbsr', 'linehan_radical_acceptance'],
      };
    },
  },
  {
    id: 'wellbeing', name: 'Wellbeing', short: 'WHO-5', kind: 'screen', time: '1 minute',
    about: 'Five questions on how you have felt, from the World Health Organization. A quick, gentle check of wellbeing.',
    lead: 'Over the last two weeks:',
    source: 'WHO-5 Well-Being Index: World Health Organization, 1998 (Psychiatric Research Unit, Frederiksborg). Free to use.',
    options: [['At no time', 0], ['Some of the time', 1], ['Less than half of the time', 2], ['More than half of the time', 3], ['Most of the time', 4], ['All of the time', 5]],
    items: [
      ['q1', 'I have felt cheerful and in good spirits'],
      ['q2', 'I have felt calm and relaxed'],
      ['q3', 'I have felt active and vigorous'],
      ['q4', 'I woke up feeling fresh and rested'],
      ['q5', 'My daily life has been filled with things that interest me'],
    ],
    score(a) {
      const raw = sum(a, ['q1', 'q2', 'q3', 'q4', 'q5']); const total = raw * 4;
      const b = band(total, [[28, 'low'], [50, 'below par'], [75, 'good'], [100, 'very good']]);
      return {
        total, max: 100, band: b, crisis: false,
        summary: `${total} of 100: ${b} wellbeing.`,
        details: [
          total > 50 ? 'Your wellbeing looks reasonably well; the questions that scored lowest show where to look after yourself.' : total > 28 ? 'Wellbeing below par. The mood questionnaire would show more.' : `Low wellbeing. ${SEE_SOMEONE}`,
          'Positive psychology suggests building, not only repairing: noticing what went well, using your strengths, time with people, something absorbing.',
        ],
        schools: ['positive', 'behaviourism', 'biological'], practices: ['practice_three_good_things', 'practice_behavioural_activation'], ideas: ['csikszentmihalyi_flow', 'harvard_study_adult_development'],
      };
    },
  },
  {
    id: 'satisfaction', name: 'Satisfaction with life', short: 'SWLS', kind: 'screen', time: '1 minute',
    about: 'Five statements about your life as a whole, from the psychologist Ed Diener.',
    lead: 'How much do you agree with each statement?',
    source: 'Satisfaction With Life Scale: Diener, Emmons, Larsen & Griffin, 1985. Free to use with credit.',
    options: [['Strongly disagree', 1], ['Disagree', 2], ['Slightly disagree', 3], ['Neither', 4], ['Slightly agree', 5], ['Agree', 6], ['Strongly agree', 7]],
    items: [
      ['q1', 'In most ways my life is close to my ideal.'],
      ['q2', 'The conditions of my life are excellent.'],
      ['q3', 'I am satisfied with my life.'],
      ['q4', 'So far I have gotten the important things I want in life.'],
      ['q5', 'If I could live my life over, I would change almost nothing.'],
    ],
    score(a) {
      const total = sum(a, ['q1', 'q2', 'q3', 'q4', 'q5']);
      const b = band(total, [[9, 'extremely dissatisfied'], [14, 'dissatisfied'], [19, 'slightly dissatisfied'], [20, 'neutral'], [25, 'slightly satisfied'], [30, 'satisfied'], [35, 'extremely satisfied']]);
      return {
        total, max: 35, band: b, crisis: false,
        summary: `${total} of 35: ${b} with life as a whole.`,
        details: [
          total >= 26 ? 'You are largely content with how your life is going.' : total >= 20 ? 'Mixed: some parts of life satisfy you, some do not. The values questions can show which.' : 'Much of your life feels far from what you want. It may help to look at which part matters most, and start there.',
          'Satisfaction tends to follow living by your values, close relationships and meaningful work more than comfort or money.',
        ],
        schools: ['positive', 'existential', 'humanistic'], practices: ['practice_values_compass'], ideas: ['maslow_hierarchy', 'brickman_lottery_winners', 'harvard_study_adult_development'],
      };
    },
  },
  {
    id: 'personality', name: 'Personality (the Big Five)', short: 'Mini-IPIP', kind: 'screen', time: '3 minutes',
    about: 'Twenty statements that place you on the five broad traits psychology measures most: extraversion, agreeableness, conscientiousness, emotional sensitivity and imagination.',
    lead: 'How accurately does each statement describe you, as you generally are now?',
    source: 'Mini-IPIP: Donnellan, Oswald, Baird & Lucas, 2006, from the International Personality Item Pool (public domain).',
    options: [['Very inaccurate', 1], ['Moderately inaccurate', 2], ['Neither', 3], ['Moderately accurate', 4], ['Very accurate', 5]],
    items: [
      ['q1', 'I am the life of the party.'], ['q2', "I sympathize with others' feelings."], ['q3', 'I get chores done right away.'], ['q4', 'I have frequent mood swings.'], ['q5', 'I have a vivid imagination.'],
      ['q6', "I don't talk a lot."], ['q7', "I am not interested in other people's problems."], ['q8', 'I often forget to put things back in their proper place.'], ['q9', 'I am relaxed most of the time.'], ['q10', 'I am not interested in abstract ideas.'],
      ['q11', 'I talk to a lot of different people at parties.'], ['q12', "I feel others' emotions."], ['q13', 'I like order.'], ['q14', 'I get upset easily.'], ['q15', 'I have difficulty understanding abstract ideas.'],
      ['q16', 'I keep in the background.'], ['q17', 'I am not really interested in others.'], ['q18', 'I make a mess of things.'], ['q19', 'I seldom feel blue.'], ['q20', 'I do not have a good imagination.'],
    ],
    score(a) {
      const v = (id, rev) => { const x = Number(a[id]) || 3; return rev ? 6 - x : x; };
      const traits = [
        ['Extraversion', v('q1') + v('q6', 1) + v('q11') + v('q16', 1), 'outgoing and energised by people', 'reserved, energised by quiet'],
        ['Agreeableness', v('q2') + v('q7', 1) + v('q12') + v('q17', 1), 'warm and attuned to others', 'independent-minded, less swayed by others'],
        ['Conscientiousness', v('q3') + v('q8', 1) + v('q13') + v('q18', 1), 'organised and dependable', 'flexible and spontaneous'],
        ['Emotional sensitivity', v('q4') + v('q9', 1) + v('q14') + v('q19', 1), 'feels things strongly and quickly', 'even-keeled'],
        ['Imagination', v('q5') + v('q10', 1) + v('q15', 1) + v('q20', 1), 'imaginative, drawn to ideas', 'practical and concrete'],
      ];
      const lvl = (x) => (x >= 15 ? 'high' : x >= 10 ? 'middling' : 'low');
      return {
        total: null, band: 'profile', crisis: false,
        summary: traits.map(([n, x]) => `${n}: ${lvl(x)}`).join(' · '),
        details: [...traits.map(([n, x, hi, lo]) => `${n} ${x} of 20 (${lvl(x)}): ${x >= 15 ? hi : x < 10 ? lo : `between ${lo} and ${hi}`}.`),
          'No trait is good or bad: each has its strengths and its typical troubles. Knowing yours helps choose methods that suit you.'],
        schools: ['positive', 'biological'], practices: [], ideas: [], traits: Object.fromEntries(traits.map(([n, x]) => [n, x])),
      };
    },
  },
  {
    id: 'loneliness', name: 'Loneliness', short: '3-item scale', kind: 'screen', time: '30 seconds',
    about: 'Three questions on feeling alone, used in large studies of health and ageing.',
    lead: 'How often do you feel…',
    source: 'Three-Item Loneliness Scale: Hughes, Waite, Hawkley & Cacioppo, 2004 (from the UCLA Loneliness Scale). Free to use.',
    options: [['Hardly ever', 1], ['Some of the time', 2], ['Often', 3]],
    items: [['q1', 'that you lack companionship?'], ['q2', 'left out?'], ['q3', 'isolated from others?']],
    score(a) {
      const total = sum(a, ['q1', 'q2', 'q3']);
      const lonely = total >= 6;
      return {
        total, max: 9, band: lonely ? 'lonely' : 'not lonely', crisis: false,
        summary: `${total} of 9: ${lonely ? 'you are feeling lonely' : 'loneliness is not weighing much'}.`,
        details: [lonely ? 'Loneliness is common and painful, and it is about the closeness of connections more than their number. Small, regular contact helps more than rare big efforts.' : 'You feel reasonably connected.',
          'The longest study of adult life found that close relationships predict health and happiness better than almost anything else.'],
        schools: ['systems', 'attachment', 'social', 'positive'], practices: ['practice_behavioural_activation'], ideas: ['harvard_study_adult_development', 'bowlby_ainsworth_attachment'],
      };
    },
  },
  {
    id: 'drinking', name: 'Drinking', short: 'AUDIT-C', kind: 'screen', time: '30 seconds',
    about: 'Three questions on alcohol, from the World Health Organization.',
    lead: 'Thinking about the last year:',
    source: 'AUDIT-C (the first three questions of the AUDIT): Bush et al., 1998, from the World Health Organization AUDIT. Free to use.',
    perItem: true,
    items: [
      ['q1', 'How often do you have a drink containing alcohol?', [['Never', 0], ['Monthly or less', 1], ['2–4 times a month', 2], ['2–3 times a week', 3], ['4 or more times a week', 4]]],
      ['q2', 'How many standard drinks containing alcohol do you have on a typical day when drinking?', [['1 or 2', 0], ['3 or 4', 1], ['5 or 6', 2], ['7 to 9', 3], ['10 or more', 4]]],
      ['q3', 'How often do you have six or more drinks on one occasion?', [['Never', 0], ['Less than monthly', 1], ['Monthly', 2], ['Weekly', 3], ['Daily or almost daily', 4]]],
    ],
    score(a) {
      const total = sum(a, ['q1', 'q2', 'q3']);
      const b = total <= 2 ? 'low risk' : total <= 4 ? 'worth a look' : 'higher risk';
      return {
        total, max: 12, band: b, crisis: false,
        summary: `${total} of 12: ${b}.`,
        details: [total <= 2 ? 'Your drinking looks low-risk.' : total <= 4 ? 'Above the level many doctors suggest a second look at (3 or more for women, 4 or more for men).' : `Drinking at a level that often harms health or mood. ${SEE_SOMEONE}`,
          'If you are of two minds about it, motivational interviewing starts there: weighing, in your own words, what drinking gives you and what it costs.'],
        schools: ['motivational', 'behaviourism'], practices: ['practice_decisional_balance', 'practice_if_then_plan'], ideas: ['prochaska_stages_of_change'],
      };
    },
  },

  // ── Continuum's own reflective questions (not validated scales) ──
  {
    id: 'problem_map', name: 'Where does your problem live?', short: 'Reflection', kind: 'reflect', time: '2 minutes',
    about: 'Ten questions about a difficulty you have now. They show which schools of psychology see your kind of problem most clearly, and which of their methods might help.',
    lead: 'Think of one thing that is troubling you. How true is each of these about it?',
    source: 'Continuum\'s own reflective questions, drawn from how the main schools of psychology describe problems. Not a validated scale.',
    options: [['Not at all', 0], ['A little', 1], ['Quite a bit', 2], ['Very much', 3]],
    items: [
      ['thoughts', 'It runs on thoughts I can\'t stop, or can\'t stop believing.'],
      ['feelings', 'Strong feelings (fear, sadness, anger, shame) take over.'],
      ['habits', 'It\'s something I keep doing — or keep avoiding.'],
      ['body', 'It shows in my body: sleep, energy, tension, appetite.'],
      ['people', 'It\'s tangled up with people close to me.'],
      ['past', 'It feels like an old pattern, from long ago.'],
      ['meaning', 'I\'ve lost a sense of what it\'s all for, or of who I am.'],
      ['self', 'It\'s about how I see myself, or how I measure up.'],
      ['torn', 'Part of me wants to change, and part of me doesn\'t.'],
      ['situation', 'It\'s mostly what is happening to me: work, money, loss, a change.'],
    ],
    score(a) {
      const MAP = {
        thoughts: ['cognitive', 'cbt', 'third_wave'], feelings: ['third_wave', 'humanistic', 'gestalt', 'psychoanalysis'], habits: ['behaviourism', 'cbt', 'motivational'],
        body: ['biological', 'third_wave'], people: ['systems', 'attachment'], past: ['psychoanalysis', 'attachment', 'analytical'], meaning: ['existential', 'humanistic', 'analytical'],
        self: ['individual', 'cognitive', 'humanistic', 'third_wave'], torn: ['motivational', 'gestalt'], situation: ['brief', 'social', 'positive'],
      };
      const WORDS = { thoughts: 'your thoughts', feelings: 'strong feelings', habits: 'what you do or avoid', body: 'your body', people: 'your relationships', past: 'old patterns', meaning: 'meaning and identity', self: 'how you see yourself', torn: 'being of two minds', situation: 'your circumstances' };
      const weight = {}; for (const [k, schools] of Object.entries(MAP)) for (const sc of schools) weight[sc] = (weight[sc] ?? 0) + (Number(a[k]) || 0) * (schools.indexOf(sc) === 0 ? 1.2 : 1);
      const top = Object.entries(weight).filter(([, w]) => w > 0).sort((x, y) => y[1] - x[1]).slice(0, 4).map(([id]) => id);
      const strong = Object.entries(a).filter(([k, v]) => MAP[k] && Number(v) >= 2).sort((x, y) => y[1] - x[1]).map(([k]) => WORDS[k]);
      return {
        total: null, band: 'map', crisis: false,
        summary: strong.length ? `It lives most in ${strong.slice(0, 3).join(', ')}.` : 'No single part of life stands out: a mix.',
        details: [strong.length ? `The parts that score highest: ${strong.join(', ')}.` : 'Your answers were spread out.', 'The schools below see this kind of difficulty most clearly. Each has its own way in; you can try more than one.'],
        schools: top, practices: [], ideas: [],
      };
    },
  },
  {
    id: 'readiness', name: 'Ready to change?', short: 'Reflection', kind: 'reflect', time: '1 minute',
    about: 'Where you stand with a change you are thinking about, as motivational interviewing and the stages-of-change model see it.',
    lead: 'Think of one change you are considering.',
    source: 'Continuum\'s own questions, after the stages of change (Prochaska & DiClemente) and the "importance and confidence rulers" of motivational interviewing (Miller & Rollnick). Not a validated scale.',
    perItem: true,
    items: [
      ['stage', 'Which is closest?', [['I don\'t really see a problem', 0], ['I\'m starting to wonder about it', 1], ['I mean to change soon', 2], ['I\'ve started changing', 3], ['I\'ve changed and I\'m keeping it up', 4]]],
      ['importance', 'How important is this change to you? (0 none, 10 the most)', Array.from({ length: 11 }, (_, i) => [String(i), i])],
      ['confidence', 'How confident are you that you could make it? (0 none, 10 completely)', Array.from({ length: 11 }, (_, i) => [String(i), i])],
    ],
    score(a) {
      const STAGES = ['not yet considering', 'considering', 'preparing', 'acting', 'maintaining'];
      const s = Number(a.stage) || 0; const imp = Number(a.importance) || 0; const con = Number(a.confidence) || 0;
      const next = [
        'At this stage, the most useful thing is honest information and noticing what the problem costs, without pressure.',
        'Weighing both sides helps: what you would gain, what you would lose, in your own words.',
        'A specific plan helps most now: when, where, how, and what you will do when it gets hard.',
        'Keep the new behaviour easy and rewarded; plan for slips (they are normal, not failure).',
        'Guard against relapse: know your risky moments and have an if-then plan for each.',
      ][s];
      return {
        total: null, band: STAGES[s], crisis: false,
        summary: `${STAGES[s][0].toUpperCase()}${STAGES[s].slice(1)} · importance ${imp}/10 · confidence ${con}/10.`,
        details: [next, imp < 5 ? `Importance ${imp}: a good question is why it is ${imp} and not 0 — what matters to you in it?` : con < imp - 2 ? `Confidence lags behind importance: small wins and a clear plan build confidence (Bandura's self-efficacy).` : 'Importance and confidence are both reasonably high: a good moment to plan.'],
        schools: ['motivational', 'behaviourism', 'cbt'], practices: s <= 1 ? ['practice_decisional_balance'] : ['practice_if_then_plan'], ideas: ['prochaska_stages_of_change', 'bandura_self_efficacy', 'gollwitzer_implementation_intentions'],
      };
    },
  },
  {
    id: 'thinking_traps', name: 'Thinking traps', short: 'Reflection', kind: 'reflect', time: '2 minutes',
    about: 'Ten common slips of thought that cognitive therapy teaches people to spot. Which ones catch you most?',
    lead: 'Lately, how often do you catch yourself…',
    source: 'Continuum\'s own wording of the "cognitive distortions" described by Aaron Beck and David Burns. Not a validated scale.',
    options: [['Rarely', 0], ['Sometimes', 1], ['Often', 2], ['Most of the time', 3]],
    items: [
      ['allornothing', 'seeing things as all good or all bad, a total success or a total failure?'],
      ['always', 'saying "always" or "never" after one bad event?'],
      ['mindreading', 'assuming you know what others think of you?'],
      ['fortune', 'predicting things will go badly, before they happen?'],
      ['catastrophe', 'imagining the worst, and that you could not bear it?'],
      ['discount', 'brushing off what goes well as luck or "not counting"?'],
      ['should', 'driving yourself with "should", "must" and "ought"?'],
      ['label', 'calling yourself names ("I\'m an idiot", "I\'m a failure")?'],
      ['blame', 'taking the blame for things that weren\'t only yours?'],
      ['feeling', 'treating a feeling as proof ("I feel useless, so I am")?'],
    ],
    score(a) {
      const ANTIDOTE = {
        allornothing: ['All-or-nothing thinking', 'look for the shades of grey: what percentage is it, really?'],
        always: ['Overgeneralising', 'ask: always? Name one time it did not happen.'],
        mindreading: ['Mind reading', 'ask what evidence you have, or ask them.'],
        fortune: ['Fortune telling', 'treat the prediction as a guess, and test it.'],
        catastrophe: ['Catastrophising', 'ask what is most likely, and what you would do if the worst came.'],
        discount: ['Discounting the positive', 'write down what went well and why it does count.'],
        should: ['"Should" statements', 'swap "should" for "I would prefer", and see how it feels.'],
        label: ['Labelling', 'describe the action, not the person: "I made a mistake", not "I am a failure".'],
        blame: ['Personalising', 'draw a pie of everything that contributed; how big is your slice?'],
        feeling: ['Emotional reasoning', 'feelings are real, but they are not facts about the world.'],
      };
      const ranked = Object.keys(ANTIDOTE).map((k) => [k, Number(a[k]) || 0]).sort((x, y) => y[1] - x[1]);
      const top = ranked.filter(([, v]) => v >= 2).slice(0, 4);
      const total = ranked.reduce((s, [, v]) => s + v, 0);
      return {
        total, max: 30, band: top.length ? 'some traps' : 'few traps', crisis: false,
        summary: top.length ? `Your most frequent: ${top.map(([k]) => ANTIDOTE[k][0].toLowerCase()).join(', ')}.` : 'No trap catches you often.',
        details: [...(top.length ? top : ranked.slice(0, 2)).map(([k]) => `${ANTIDOTE[k][0]}: ${ANTIDOTE[k][1]}`), 'Everyone falls into these; the skill is noticing, then checking the thought against the evidence (a thought record).'],
        schools: ['cognitive', 'cbt', 'third_wave'], practices: ['practice_thought_record', 'practice_defusion'], ideas: ['ellis_abc_model', 'beck_cognitive_therapy_stoicism_tested'],
      };
    },
  },
  {
    id: 'values', name: 'Your values compass', short: 'Reflection', kind: 'reflect', time: '3 minutes',
    about: 'Eight parts of life: how much each matters to you, and how fully you have been living it lately. The gaps show where to turn.',
    lead: 'For each part of life, two numbers from 0 to 10.',
    source: 'Continuum\'s own questions, after the values work of Acceptance and Commitment Therapy (Hayes and colleagues). Not a validated scale.',
    perItem: true,
    items: ['Close relationships', 'Family', 'Work or study', 'Learning and growth', 'Health and body', 'Play and rest', 'Community', 'Meaning or spirit'].flatMap((d, i) => [
      [`i${i}`, `${d}: how much does it matter to you?`, Array.from({ length: 11 }, (_, k) => [String(k), k])],
      [`l${i}`, `${d}: how fully have you lived it lately?`, Array.from({ length: 11 }, (_, k) => [String(k), k])],
    ]),
    score(a) {
      const D = ['Close relationships', 'Family', 'Work or study', 'Learning and growth', 'Health and body', 'Play and rest', 'Community', 'Meaning or spirit'];
      const gaps = D.map((d, i) => [d, Number(a[`i${i}`]) || 0, Number(a[`l${i}`]) || 0]).map(([d, imp, lived]) => [d, imp, lived, imp - lived]).sort((x, y) => y[3] - x[3]);
      const big = gaps.filter((g) => g[3] >= 3 && g[1] >= 6);
      return {
        total: null, band: 'compass', crisis: false,
        summary: big.length ? `Biggest gaps: ${big.slice(0, 3).map((g) => g[0].toLowerCase()).join(', ')}.` : 'You are living close to what matters to you.',
        details: [...gaps.slice(0, 3).map(([d, imp, lived]) => `${d}: matters ${imp}, lived ${lived}.`), 'Values are directions, not goals: you never finish them. One small step toward a neglected value this week is enough to start.'],
        schools: ['third_wave', 'existential', 'positive'], practices: ['practice_values_compass', 'practice_behavioural_activation'], ideas: [],
      };
    },
  },
];

export const surveyById = (id) => SURVEYS.find((s) => s.id === id);
// The options for one item (per-item options, or the survey's).
export const optionsFor = (survey, item) => item[2] ?? survey.options;
// Answers complete and valid? Returns the cleaned answers, or null.
export function checkAnswers(survey, answers) {
  const out = {};
  for (const item of survey.items) {
    const v = Number(answers?.[item[0]]);
    if (!optionsFor(survey, item).some(([, x]) => x === v)) return null;
    out[item[0]] = v;
  }
  return out;
}
