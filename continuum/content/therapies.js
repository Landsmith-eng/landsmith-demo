// Therapies: the named talking therapies and self-help programmes that grew out of the schools in schools.js. The app
// shows them to users, and gives the whole list to Claude, which picks the best-matched therapy for a user's problem
// and turns its sessions into a short self-guided programme. Accuracy and safety come before length.
//
// Each entry: `school` is an id from schools.js; `for` lists problem tags from PROBLEMS, best-supported first;
// `evidence` is one or two honest sentences on the state of the evidence for those problems; `self_help` says whether
// the core can be done well alone with a guide ('yes'), only in part ('partly'), or needs a trained therapist
// ('professional'); `sessions` are 5 to 8 generic weekly steps, each safe to do alone. For a 'professional' therapy the
// sessions are preparation, stabilisation and finding help only, and say so. No session asks for anything risky: no
// unsupervised exposure to trauma memories, no extreme sleep restriction, no stopping medication, no confronting
// anyone who has hurt you. `practices` and session `practice` ids are practice nodes (practice_steps.js); `ideas` are
// idea nodes on the map. content/index.js checks every id and tag at load time.
// Our plain words throughout; founders and key texts are named in a comment per therapy, and SOURCES.md (Batch 13)
// says what each evidence statement rests on. No quotations.

export const PROBLEMS = {
  low_mood: 'Low mood',
  worry: 'Worry',
  panic: 'Panic',
  social_anxiety: 'Social anxiety',
  phobia: 'A specific fear or phobia',
  obsessions: 'Obsessions and compulsions',
  health_worry: 'Health worry',
  trauma: 'After a trauma',
  sleep: 'Sleep',
  stress: 'Stress',
  emotions_overwhelm: 'Overwhelming emotions',
  anger: 'Anger',
  grief: 'Grief',
  loneliness: 'Loneliness',
  relationships: 'Relationships',
  family: 'Family',
  parenting: 'Parenting',
  self_esteem: 'Self-esteem',
  self_criticism: 'Self-criticism and shame',
  perfectionism: 'Perfectionism',
  procrastination: 'Procrastination',
  habit: 'A habit to change',
  addiction: 'Drinking, drugs or gambling',
  eating: 'Eating',
  chronic_pain: 'Living with pain',
  meaning: 'Meaning and purpose',
  decision: 'A hard decision',
  life_change: 'A big life change',
};

const CRISIS = 'If you have thoughts of ending your life or harming yourself, contact a doctor, a crisis line or emergency services now.';

export const THERAPIES = [
  // Aaron Beck, Cognitive Therapy and the Emotional Disorders (1976); Beck, Rush, Shaw and Emery, Cognitive Therapy of
  // Depression (1979); Albert Ellis, Reason and Emotion in Psychotherapy (1962); Clark (1986) on panic; Clark and Wells
  // (1995) on social anxiety; Salkovskis and Warwick (1986) on health anxiety; Burns, Feeling Good (1980).
  {
    id: 'cbt', name: 'Cognitive behavioural therapy', short: 'CBT', school: 'cbt', founders: 'Aaron Beck, Albert Ellis', years: 'from the 1960s',
    how: 'CBT holds that problems are kept going by a loop of thoughts, feelings, body sensations and behaviour. You learn to catch the thoughts that drive the loop, test them against the evidence, and try new behaviour as an experiment. Versions built for specific problems (panic, social anxiety, health worry, binge eating) target the particular loop that keeps each one going.',
    for: ['low_mood', 'worry', 'panic', 'social_anxiety', 'health_worry', 'obsessions', 'perfectionism', 'self_esteem', 'eating', 'chronic_pain', 'loneliness'],
    evidence: 'The most tested talking therapy: first-line in NICE guidance for depression and most anxiety problems, and NICE recommends CBT-based guided self-help as a first step for mild to moderate depression, anxiety and binge eating. Its lead over other good therapies is smaller than once claimed.',
    suits: 'People who like practical tools, structure and homework, and want to work on the problem as it is now.',
    self_help: 'yes',
    needs_professional: `Moderate to severe depression, panic or anxiety that stops you working or leaving home, obsessions and compulsions that take hours a day, any eating problem with rapid weight loss, vomiting or fainting, and anything that has not shifted after a few weeks of self-help need a doctor or a CBT therapist. ${CRISIS}`,
    sessions: [
      { title: 'Map the loop', aim: 'See how the problem keeps itself going.', exercise: 'Pick one recent time the problem showed up. Write down the situation, the thoughts that went through your mind, the feelings, what your body did, and what you did next. Draw arrows to show how each fed the next.', practice: 'practice_name_the_feeling' },
      { title: 'Catch the thoughts', aim: 'Notice the automatic thoughts as they happen.', exercise: 'For a week, whenever your mood drops or worry spikes, jot down what was happening and the exact thought in your head. Rate how much you believed it, from 0 to 100. Do not try to change anything yet.', practice: 'practice_thought_record' },
      { title: 'Test the thoughts', aim: 'Weigh a hot thought against the evidence.', exercise: 'Take two thoughts from your record. List the evidence for and against each, look for a thinking trap (all-or-nothing, mind-reading, fortune-telling, a should), and write a fairer thought you can actually believe. Rate the feeling again.', practice: 'practice_thought_record' },
      { title: 'Run an experiment', aim: 'Test a prediction in real life rather than in your head.', exercise: 'Choose one fearful or gloomy prediction ("if I speak up they will think I am stupid"). Plan a small, safe action that would test it, write what you expect, do it, and write what actually happened.', practice: 'practice_hold_beliefs_loosely' },
      { title: 'Drop a safety behaviour', aim: 'Stop the small habits that keep the fear alive.', exercise: 'List the things you do to feel safe: avoiding eye contact, checking, reassurance-seeking, over-preparing. Pick one and drop it in one ordinary situation this week, and note what happens.', practice: 'practice_exposure_ladder' },
      { title: 'Look at the rules underneath', aim: 'Find the beliefs that keep producing the hot thoughts.', exercise: 'Look across your records for a repeating theme, and ask "if that were true, what would it mean about me?" until you reach a rule or belief ("I must never fail"). Write a more flexible version and one small action that would live by it.', practice: 'practice_control_your_response' },
      { title: 'Your blueprint', aim: 'Keep the gains and spot early warning signs.', exercise: 'Write a one-page plan: what you learned, which tools helped most, your early warning signs, and what you will do if they come back. Put a date in the diary to reread it in a month.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_thought_record', 'practice_control_your_response', 'practice_exposure_ladder', 'practice_hold_beliefs_loosely', 'practice_name_the_feeling'],
    ideas: ['ellis_abc_model', 'beck_cognitive_therapy_stoicism_tested', 'burns_cognitive_distortions', 'epictetus_up_to_us'],
  },
  // Lewinsohn (1974) on reinforcement and depression; Jacobson et al. (1996) component analysis; Martell, Addis and
  // Jacobson, Depression in Context (2001); Dimidjian et al. (2006); Richards et al. (2016), the COBRA trial.
  {
    id: 'behavioural_activation', name: 'Behavioural activation', short: 'BA', school: 'behaviourism', founders: 'Peter Lewinsohn, Neil Jacobson, Christopher Martell', years: 'from the 1970s',
    how: 'Low mood shrinks life: you stop doing things, which removes what used to lift you, which deepens the low. Behavioural activation reverses the spiral by planning small activities that bring pleasure or a sense of achievement, done on schedule rather than when you feel like it. It also tracks avoidance and replaces it with small steps towards what matters.',
    for: ['low_mood', 'procrastination'],
    evidence: 'Strong for depression: trials found it about as effective as full CBT, including when delivered by less experienced staff (the COBRA trial), and NICE lists it among first-line treatments. Its use for procrastination rests on the same principles rather than on dedicated trials.',
    suits: 'People who feel stuck and flat, prefer doing to talking, and want something concrete to start with.',
    self_help: 'yes',
    needs_professional: `Depression that is moderate to severe, lasts more than a few weeks without lifting, or comes with not eating, not getting out of bed most days, or hopelessness needs a doctor. ${CRISIS}`,
    sessions: [
      { title: 'Watch the week', aim: 'See how what you do links to how you feel.', exercise: 'For a week, note what you did each hour or two and rate your mood from 0 to 10. Look for activities that lifted mood a little and times that dragged it down.', practice: '' },
      { title: 'What used to matter', aim: 'Build a list of activities worth doing.', exercise: 'List activities that once gave pleasure, ones that give a sense of getting something done, and ones that fit what you value (people, health, home, work). Include tiny ones: a walk round the block, a call, washing up.', practice: 'practice_values_compass' },
      { title: 'Schedule, then do', aim: 'Act according to a plan, not a mood.', exercise: 'Put three small activities into the coming week at set times, like appointments. Do them whatever your mood, and rate your mood before and after.', practice: 'practice_behavioural_activation' },
      { title: 'Spot the avoidance', aim: 'Notice what you do instead of what matters.', exercise: 'When you catch yourself avoiding, note the trigger, what you did instead (scrolling, staying in bed, ruminating), and what it cost. Choose one alternative action for next time.', practice: 'practice_if_then_plan' },
      { title: 'Break it down', aim: 'Make hard tasks small enough to start.', exercise: 'Take one task you have been putting off and break it into steps of ten minutes or less. Schedule the first step and do only that.', practice: 'practice_behavioural_activation' },
      { title: 'Rumination as a cue', aim: 'Turn brooding into a signal to act.', exercise: 'When you notice yourself going over the same thoughts, ask "is this helping me solve anything?" If not, switch to a planned activity that absorbs attention, and note what happens to the brooding.', practice: 'practice_if_then_plan' },
      { title: 'Keep it going', aim: 'Make activity a habit that survives a bad week.', exercise: 'Look back at what helped most. Choose a minimum weekly menu you will keep even on bad days, and write what you will do if your mood drops again.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_behavioural_activation', 'practice_values_compass', 'practice_if_then_plan'],
    ideas: ['lewinsohn_behavioural_activation', 'thorndike_law_of_effect', 'seligman_learned_helplessness'],
  },
  // Wolpe, Psychotherapy by Reciprocal Inhibition (1958); Marks, Fears, Phobias and Rituals (1987); Meyer (1966) on
  // exposure and response prevention; Foa and Kozak (1986); Öst (1989) one-session treatment; Craske et al. (2014) on
  // inhibitory learning.
  {
    id: 'exposure', name: 'Exposure therapy', short: 'Exposure', school: 'behaviourism', founders: 'Joseph Wolpe, Isaac Marks, Edna Foa', years: 'from the 1950s',
    how: 'Avoidance keeps fear alive, because you never learn that the feared thing is bearable or less likely than it seems. Exposure means facing feared situations step by step, from easier to harder, staying long enough to learn something new, without escaping or using safety tricks. For obsessions it takes the form of exposure and response prevention (ERP): facing the trigger while not doing the compulsion.',
    for: ['phobia', 'panic', 'social_anxiety', 'obsessions', 'health_worry'],
    evidence: 'Among the best-supported psychological treatments: very effective for specific phobias, a core part of CBT for panic and social anxiety, and ERP is first-line for obsessive-compulsive disorder in NICE guidance. Self-guided graded exposure works for milder fears; ERP for OCD is best led by a therapist.',
    suits: 'People ready to face a fear in small steps, who like a clear plan and measurable progress.',
    self_help: 'partly',
    needs_professional: 'Obsessions and compulsions (ERP should be therapist-led), panic with frequent attacks or being housebound, fears that came from a trauma, and any fear tied to a health condition (for example a heart or breathing problem) need a professional. Never use exposure for trauma memories on your own.',
    sessions: [
      { title: 'Understand the fear', aim: 'See how avoidance keeps fear going.', exercise: 'Write down what you fear, what you think will happen, and everything you avoid or do to stay safe. Note how avoiding brings short-term relief and long-term growth of the fear.', practice: 'practice_name_the_feeling' },
      { title: 'Build the ladder', aim: 'Turn one big fear into small steps.', exercise: 'List eight to ten situations linked to the fear, from mildly uncomfortable to the hardest. Rate each from 0 to 10 for how anxious it would make you, and order them. Choose an everyday fear for self-help, not a trauma.', practice: 'practice_exposure_ladder' },
      { title: 'First rung', aim: 'Take the easiest step and stay with it.', exercise: 'Do the bottom step, aiming for a rating around 3 or 4. Stay until you have learned something (the feared thing did not happen, or you coped), without escaping early. Write your prediction before and what happened after.', practice: 'practice_exposure_ladder' },
      { title: 'Repeat and climb', aim: 'Make each step ordinary before moving up.', exercise: 'Repeat a step several times in the week until it feels much easier, then move up one rung. Short, frequent practice beats one heroic attempt.', practice: 'practice_exposure_ladder' },
      { title: 'Drop the safety tricks', aim: 'Learn that you are safe without the props.', exercise: 'Notice the small things you do to get through (holding on, carrying a bottle of water, checking, distraction). On a step you have already climbed, drop one and see what happens.', practice: 'practice_hold_beliefs_loosely' },
      { title: 'Vary it', aim: 'Make the learning stick in real life.', exercise: 'Practise climbed steps in different places, times and moods, so the new learning is not tied to one setting.', practice: 'practice_exposure_ladder' },
      { title: 'Plan for setbacks', aim: 'Expect a wobble and know what to do.', exercise: 'Write which steps you will keep practising, the signs that avoidance is creeping back, and the first step you will take if it does. A setback is a signal to practise, not proof of failure.', practice: 'practice_if_then_plan' },
    ],
    practices: ['practice_exposure_ladder', 'practice_hold_beliefs_loosely', 'practice_if_then_plan', 'practice_name_the_feeling'],
    ideas: ['wolpe_systematic_desensitisation', 'pavlov_conditioned_reflex', 'bandura_self_efficacy'],
  },
  // D'Zurilla and Goldfried (1971); D'Zurilla and Nezu, Problem-Solving Therapy (3rd ed. 2007); Bell and D'Zurilla
  // (2009) meta-analysis; Cuijpers et al. on problem-solving therapy for depression.
  {
    id: 'problem_solving', name: 'Problem-solving therapy', short: 'PST', school: 'cbt', founders: 'Thomas D\'Zurilla, Arthur Nezu, Christine Maguth Nezu', years: 'from the 1970s',
    how: 'Many stresses are real problems that feel unsolvable because they arrive tangled together. Problem-solving therapy teaches a fixed sequence: define one problem clearly, brainstorm options without judging, weigh them, choose and plan one, try it and review. It also works on the attitude to problems, treating them as challenges to work through rather than threats to avoid.',
    for: ['stress', 'low_mood', 'decision', 'worry', 'life_change'],
    evidence: 'Meta-analyses find it effective for depression, comparable to other psychological treatments, and it is used in primary care and with older adults. Evidence for other problems is thinner.',
    suits: 'People facing real practical problems (money, work, caring, housing) who like a clear method.',
    self_help: 'yes',
    needs_professional: `Problems involving debt, housing, legal trouble or abuse also need practical advice from the right service (debt advice, a solicitor, a domestic abuse service). Severe low mood needs a doctor. ${CRISIS}`,
    sessions: [
      { title: 'List and pick', aim: 'Untangle the pile into separate problems.', exercise: 'Write every problem on your mind, one per line. Mark which are within your control and pick one that matters and is not the hardest to start on.', practice: 'practice_control_your_response' },
      { title: 'Define it', aim: 'Turn a vague worry into a solvable problem.', exercise: 'Describe the chosen problem in plain facts: what is happening, what you want instead, and what is in the way. Write the goal as something you could see achieved.', practice: '' },
      { title: 'Brainstorm', aim: 'Generate many options before judging any.', exercise: 'Write at least eight possible actions, including silly and partial ones. Do not judge yet; quantity helps quality.', practice: 'practice_miracle_question' },
      { title: 'Weigh and choose', aim: 'Pick the best option on balance.', exercise: 'For each option, note pros and cons for you and others, short and long term, and how doable it is. Choose one, or a combination.', practice: 'practice_decisional_balance' },
      { title: 'Plan and do', aim: 'Turn the choice into concrete steps.', exercise: 'Break the chosen option into small steps with when and where. Plan for the likeliest obstacle, then take the first step this week.', practice: 'practice_if_then_plan' },
      { title: 'Review and repeat', aim: 'Learn from the result and move to the next problem.', exercise: 'Ask what happened, what worked and what you would change. If the problem is solved, pick the next one from your list; if not, go back to your options.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_control_your_response', 'practice_decisional_balance', 'practice_if_then_plan', 'practice_miracle_question'],
    ideas: ['bandura_self_efficacy', 'kahneman_two_systems'],
  },
  // Bootzin (1972) stimulus control; Spielman, Saskin and Thorpy (1987) sleep restriction; Morin, Insomnia (1993);
  // Qaseem et al. (2016), American College of Physicians guideline; Riemann et al. (2017), European guideline; NICE
  // MTG70 (2022) on digital CBT-I.
  {
    id: 'cbt_insomnia', name: 'CBT for insomnia', short: 'CBT-I', school: 'cbt', founders: 'Richard Bootzin, Arthur Spielman, Charles Morin', years: 'from the 1970s',
    how: 'Long-term insomnia is kept going by habits and worries that grow around poor sleep: long hours awake in bed, irregular times, napping, and anxious thoughts about not sleeping. CBT-I retrains the bed as a place for sleep (stimulus control), matches time in bed to the sleep you are actually getting so sleep becomes deeper (sleep restriction, gently in self-help), and works on the worries about sleep.',
    for: ['sleep'],
    evidence: 'Recommended as the first treatment for chronic insomnia by the American College of Physicians and European guidelines, ahead of sleeping tablets, with lasting effects; digital and book-based versions also work, and NICE has recommended a digital CBT-I programme.',
    suits: 'People with insomnia of a month or more who are willing to keep a sleep diary and a fixed wake-up time.',
    self_help: 'yes',
    needs_professional: 'See a doctor first if you snore loudly or stop breathing in sleep, have restless legs, have bipolar disorder or epilepsy, are pregnant, or work where sleepiness is dangerous (driving, machinery): sleep restriction can make you sleepier at first and is not safe for everyone. Do not stop sleeping tablets without your doctor\'s advice.',
    sessions: [
      { title: 'Sleep diary', aim: 'See your real sleep pattern.', exercise: 'For one to two weeks, each morning write the time you went to bed, roughly how long it took to fall asleep, time awake in the night, final waking time and time out of bed. Do not watch the clock in the night; rough guesses are fine.', practice: '' },
      { title: 'Bed is for sleep', aim: 'Rebuild the link between bed and sleeping.', exercise: 'Go to bed only when sleepy, and use the bed only for sleep and sex. If you have been awake for what feels like 20 minutes, get up, do something calm in dim light, and return when sleepy. Get up at the same time every day, weekends included.', practice: 'practice_if_then_plan' },
      { title: 'A gentle sleep window', aim: 'Make sleep deeper by not lying awake for hours.', exercise: 'From your diary, take your average actual sleep time and add 30 minutes: that is your time in bed, but never less than six hours in self-help. Keep the fixed wake time and set bedtime from it. Expect some extra sleepiness at first; do not drive or use machinery if you feel drowsy.', practice: '' },
      { title: 'Wind down and park worries', aim: 'Calm the mind before bed.', exercise: 'Early in the evening, spend ten minutes writing worries and a next step for each, then close the notebook. In the last hour before bed, dim lights, put screens away and do something relaxing.', practice: 'practice_care_for_the_body' },
      { title: 'Thoughts about sleep', aim: 'Loosen the fears that keep you awake.', exercise: 'Write your beliefs about sleep ("if I do not get eight hours tomorrow will be a disaster"). Check them against your diary: how did you actually manage on poor nights? Write a calmer, accurate version.', practice: 'practice_thought_record' },
      { title: 'Adjust the window', aim: 'Grow sleep time as sleep becomes solid.', exercise: 'If you are asleep for most of your time in bed (about 85 per cent or more) for a week, move bedtime 15 minutes earlier. If not, keep the window as it is. Keep the fixed wake time throughout.', practice: '' },
      { title: 'Keep it', aim: 'Hold on to the gains through bad nights.', exercise: 'Write the habits that helped most and your plan for a bad patch: keep the wake time, get up when wide awake, avoid long lie-ins and naps. A bad night now and then is normal.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_if_then_plan', 'practice_care_for_the_body', 'practice_thought_record'],
    ideas: ['pavlov_conditioned_reflex', 'cannon_fight_or_flight', 'selye_stress'],
  },
  // Hayes, Strosahl and Wilson, Acceptance and Commitment Therapy (1999; 2nd ed. 2012); Harris, The Happiness Trap
  // (2007); A-Tjak et al. (2015) meta-analysis; NICE NG193 (2021) on chronic primary pain.
  {
    id: 'act', name: 'Acceptance and commitment therapy', short: 'ACT', school: 'third_wave', founders: 'Steven C. Hayes, Kirk Strosahl, Kelly Wilson', years: 'from the 1980s',
    how: 'ACT holds that much suffering comes from struggling with painful thoughts and feelings and organising life around avoiding them. Instead of trying to change the thoughts, you learn to notice them without obeying them (defusion), make room for discomfort (acceptance), and take steps in the direction of what you value (committed action).',
    for: ['chronic_pain', 'worry', 'low_mood', 'stress', 'health_worry', 'meaning'],
    evidence: 'Well supported for chronic pain (NICE recommends ACT or CBT for chronic primary pain) and roughly as effective as CBT for anxiety and depression in meta-analyses, not better; self-help books based on ACT also show benefits.',
    suits: 'People tired of fighting their thoughts, or living with something that cannot simply be fixed, who want to build a life around their values.',
    self_help: 'yes',
    needs_professional: `New, worsening or unexplained pain needs a doctor before it is treated as something to accept. Severe depression or anxiety needs professional help. ${CRISIS}`,
    sessions: [
      { title: 'What has the struggle cost?', aim: 'See where fighting feelings has led.', exercise: 'List everything you have tried to get rid of the painful thoughts or feelings, and for each, whether it worked in the long run and what it cost you in time, energy or life.', practice: 'practice_name_the_feeling' },
      { title: 'Thoughts are thoughts', aim: 'Unhook from sticky thoughts.', exercise: 'When a painful thought shows up, put "I am having the thought that..." in front of it, or name the story ("the not-good-enough story"). Practise a few times a day and notice the small distance it creates.', practice: 'practice_defusion' },
      { title: 'Making room', aim: 'Let a feeling be there without fighting it.', exercise: 'When a difficult feeling comes, notice where it is in your body, breathe into it, and let it be there for a minute, as an observer. You are not trying to like it, only to stop the tug of war.', practice: 'practice_name_the_feeling' },
      { title: 'Being here now', aim: 'Come back to the present moment.', exercise: 'Several times a day, pause for one minute and notice five things you can see, sounds you can hear and how your feet feel on the floor. Use it whenever you are lost in worry.', practice: 'practice_care_for_the_body' },
      { title: 'What matters', aim: 'Clarify your values as directions.', exercise: 'For work, relationships, health and leisure, write what kind of person you want to be there. Values are directions, not goals: "a caring friend", not "have more friends".', practice: 'practice_values_compass' },
      { title: 'Committed action', aim: 'Take steps toward values with the discomfort along.', exercise: 'Choose one small action in a valued direction this week, expect discomfort, and do it anyway. Note what showed up and what you did.', practice: 'practice_values_compass' },
      { title: 'Keep moving', aim: 'Build a pattern of valued action.', exercise: 'Plan a few valued actions a week, with if-then plans for the thoughts that usually stop you. Review weekly: what moved you toward or away from your values?', practice: 'practice_if_then_plan' },
    ],
    practices: ['practice_defusion', 'practice_values_compass', 'practice_name_the_feeling', 'practice_if_then_plan'],
    ideas: ['hayes_acceptance_and_commitment', 'kabat_zinn_mbsr', 'marcus_pain_is_your_estimate'],
  },
  // Linehan, Cognitive-Behavioral Treatment of Borderline Personality Disorder and Skills Training Manual (both 1993;
  // manual 2nd ed. 2015); Linehan et al. (2015) dismantling trial; Storebø et al. (2020), Cochrane review.
  {
    id: 'dbt_skills', name: 'Dialectical behaviour therapy skills', short: 'DBT skills', school: 'third_wave', founders: 'Marsha Linehan', years: 'from the 1980s',
    how: 'DBT pairs acceptance with change. Its skills come in four sets: mindfulness (noticing without judging), distress tolerance (getting through a crisis without making it worse), emotion regulation (understanding emotions and lowering vulnerability to them), and interpersonal effectiveness (asking for what you need and saying no while keeping relationships and self-respect). Full DBT adds individual therapy, phone coaching and a therapist team.',
    for: ['emotions_overwhelm', 'anger', 'relationships', 'stress'],
    evidence: 'Full DBT has good evidence for reducing self-harm and suicidal behaviour, especially in borderline personality disorder (Cochrane review), and trials suggest skills training is an active ingredient. Skills-only and self-help use has a smaller evidence base.',
    suits: 'People whose emotions come fast and strong and who want concrete skills for intense moments.',
    self_help: 'partly',
    needs_professional: `Self-harm, suicidal thoughts or behaviour, or a diagnosis of borderline personality disorder call for full DBT or another specialist treatment, not self-help alone. ${CRISIS}`,
    sessions: [
      { title: 'Observe and describe', aim: 'Notice emotions without judging them.', exercise: 'Twice a day, stop and observe: what you feel, where in your body, what thoughts are there. Describe it in plain words without "good", "bad" or "should".', practice: 'practice_name_the_feeling' },
      { title: 'Get through the moment', aim: 'Tolerate distress without making things worse.', exercise: 'Make a crisis card: a few things that soothe each of your senses, a slow breathing pattern (breathe out longer than in), and a short list of distractions and people to contact. Practise one when calm so it is ready.', practice: 'practice_care_for_the_body' },
      { title: 'Stop before acting', aim: 'Pause between the urge and the action.', exercise: 'When an urge rises, use STOP: stop, take a step back and breathe, observe what is happening, then proceed mindfully. Write down one time you used it.', practice: 'practice_control_your_response' },
      { title: 'Understand an emotion', aim: 'Trace what set it off and what it urged.', exercise: 'Pick one strong emotion this week and write the trigger, your interpretation, body sensations, urge, what you did, and what followed. Ask whether the emotion fit the facts.', practice: 'practice_thought_record' },
      { title: 'Lower vulnerability', aim: 'Reduce how easily emotions take over.', exercise: 'Look after sleep, regular eating, movement and any physical illness, avoid mood-altering drugs, and do one thing a day that builds a sense of mastery.', practice: 'practice_behavioural_activation' },
      { title: 'Opposite action', aim: 'Act against an unhelpful urge.', exercise: 'When an emotion does not fit the facts, or acting on it would not help, do the opposite of its urge gently: approach instead of avoid, be gentle instead of attacking, get active instead of withdrawing.', practice: '' },
      { title: 'Ask and say no', aim: 'Get needs met while keeping the relationship and self-respect.', exercise: 'Plan one everyday request or refusal: describe the situation, express how you feel, assert clearly what you want, and say why it helps them too (DEAR MAN). Choose a low-stakes, safe person to try it with.', practice: 'practice_invest_in_people' },
      { title: 'Radical acceptance', aim: 'Stop fighting what cannot be changed right now.', exercise: 'Pick one fact you keep fighting. Say to yourself that it is what it is, notice the resistance in your body, and turn your effort to what you can do next.', practice: 'practice_self_compassion_break' },
    ],
    practices: ['practice_name_the_feeling', 'practice_care_for_the_body', 'practice_control_your_response', 'practice_self_compassion_break'],
    ideas: ['linehan_radical_acceptance', 'kabat_zinn_mbsr'],
  },
  // Kabat-Zinn, Full Catastrophe Living (1990); Segal, Williams and Teasdale, Mindfulness-Based Cognitive Therapy for
  // Depression (2002); Williams, Teasdale, Segal and Kabat-Zinn, The Mindful Way through Depression (2007); Teasdale et
  // al. (2000); Kuyken et al. (2016) meta-analysis; NICE NG222 (2022).
  {
    id: 'mbct', name: 'Mindfulness-based cognitive therapy', short: 'MBCT', school: 'third_wave', founders: 'Zindel Segal, Mark Williams, John Teasdale; after Jon Kabat-Zinn\'s MBSR', years: 'from the 1990s',
    how: 'MBCT is an eight-week course, usually in a group, that combines mindfulness meditation with ideas from cognitive therapy. It teaches people to notice early signs of a downward spiral and to step out of autopilot and rumination, seeing thoughts as passing events rather than facts. Its parent, mindfulness-based stress reduction (MBSR), uses the same practices for stress and illness.',
    for: ['low_mood', 'stress', 'worry'],
    evidence: 'Good evidence for preventing relapse in recurrent depression, mainly for people with three or more past episodes who are currently well, and NICE recommends it for that; MBSR shows moderate benefits for stress. It is not designed for the middle of a severe episode.',
    suits: 'People who have had depression before and want to stay well, or who live with stress and are willing to practise daily.',
    self_help: 'partly',
    needs_professional: `Use this when you are reasonably well, not in a severe depression. If you have had trauma or psychosis, long silent meditation can bring up distress, so start with short practices and seek a teacher or therapist. ${CRISIS}`,
    sessions: [
      { title: 'Autopilot', aim: 'Notice how much of life runs on automatic.', exercise: 'Eat one thing slowly, noticing taste and texture. Then do a 10 to 15 minute body scan once a day, moving attention through the body; when the mind wanders, note it and come back.', practice: 'practice_care_for_the_body' },
      { title: 'Living in our heads', aim: 'See how thoughts colour experience.', exercise: 'Keep up the body scan, and note one pleasant event a day: what happened, the thoughts, feelings and body sensations that came with it.', practice: 'practice_three_good_things' },
      { title: 'Gathering the scattered mind', aim: 'Use the breath as an anchor.', exercise: 'Sit for ten minutes with attention on the breath. Several times a day, do a three-minute breathing space: notice what is here, gather attention on the breath, then widen it to the whole body.', practice: 'practice_care_for_the_body' },
      { title: 'Recognising aversion', aim: 'Notice the pull to push unpleasant things away.', exercise: 'Note one unpleasant event a day with its thoughts, feelings and sensations. When something difficult arises, use the breathing space instead of reacting straight away.', practice: 'practice_name_the_feeling' },
      { title: 'Allowing', aim: 'Let difficult experience be there.', exercise: 'In a sitting practice, bring to mind a mild difficulty, notice where it shows in the body and breathe with it, saying "it is okay to feel this". Keep it mild; this is not a time for the hardest memories.', practice: 'practice_self_compassion_break' },
      { title: 'Thoughts are not facts', aim: 'Step back from depressive thinking.', exercise: 'When a gloomy thought comes, label it ("a thought") and ask whether it is a fact. Write down thoughts that come with low mood and notice how alike they are.', practice: 'practice_defusion' },
      { title: 'Caring for yourself', aim: 'Plan for warning signs.', exercise: 'Write your relapse signature: the early signs that your mood is slipping. List nourishing activities and what you will do, and who you will tell, when the signs appear.', practice: 'practice_behavioural_activation' },
      { title: 'Keep practising', aim: 'Make the practice part of life.', exercise: 'Choose a daily practice you can actually sustain, even ten minutes, plus the breathing space at hard moments. Write why it matters to you.', practice: 'practice_values_compass' },
    ],
    practices: ['practice_care_for_the_body', 'practice_defusion', 'practice_name_the_feeling', 'practice_self_compassion_break'],
    ideas: ['segal_williams_teasdale_mbct', 'kabat_zinn_mbsr'],
  },
  // Gilbert, The Compassionate Mind (2009) and Compassion Focused Therapy (2010); Neff, Self-Compassion (2011); Neff and
  // Germer (2013) trial of Mindful Self-Compassion; Kirby, Tellegen and Steindl (2017) meta-analysis.
  {
    id: 'compassion_focused', name: 'Compassion-focused therapy and self-compassion', short: 'CFT', school: 'third_wave', founders: 'Paul Gilbert; Kristin Neff and Christopher Germer (Mindful Self-Compassion)', years: 'from the 2000s',
    how: 'Compassion-focused therapy holds that many people, especially those high in shame and self-criticism, have an overactive threat system and an underdeveloped capacity to soothe themselves. It trains compassion toward oneself and others through imagery, soothing breathing and writing, so the inner critic is answered with warmth rather than more attack. Neff\'s self-compassion work adds three parts: mindfulness, common humanity and kindness.',
    for: ['self_criticism', 'self_esteem', 'perfectionism', 'low_mood'],
    evidence: 'Compassion-based interventions show moderate benefits in meta-analyses, and a Mindful Self-Compassion trial found gains in self-compassion and well-being, but CFT itself has few large trials and much of the research is correlational.',
    suits: 'People with a harsh inner critic or a lot of shame, who find that reasoning with their thoughts does not feel true.',
    self_help: 'partly',
    needs_professional: `If shame or self-criticism are tied to trauma, severe depression or self-harm, work with a therapist. Some people find kindness to themselves distressing at first; go slowly and seek help if it overwhelms you. ${CRISIS}`,
    sessions: [
      { title: 'Three systems', aim: 'Understand threat, drive and soothing.', exercise: 'Draw three circles for threat, drive (striving) and soothing. Note which situations and thoughts feed each, and how big each circle is in your life right now.', practice: 'practice_name_the_feeling' },
      { title: 'Soothing breath', aim: 'Calm the threat system through the body.', exercise: 'Twice a day, breathe a little slower and deeper than usual for a few minutes, with a soft face and a hand on your chest if it helps. Notice any slowing in the body.', practice: 'practice_care_for_the_body' },
      { title: 'Meet the critic', aim: 'See what the inner critic says and wants.', exercise: 'Write down what your critic says when you slip up, and how it says it. Ask what it is afraid of, and whether its tone would help a friend.', practice: 'practice_externalise_problem' },
      { title: 'The self-compassion break', aim: 'Answer pain with kindness.', exercise: 'When something hurts, name it ("this is hard"), remember others feel this too, and offer yourself the kind words you would give a friend. Do it at least once a day.', practice: 'practice_self_compassion_break' },
      { title: 'A compassionate letter', aim: 'Write to yourself from a kind point of view.', exercise: 'Choose a current struggle and write a short letter to yourself as a wise, warm friend would: understanding, not blaming, and encouraging a next step.', practice: 'practice_self_compassion_break' },
      { title: 'Compassionate correction', aim: 'Learn from mistakes without attack.', exercise: 'Take a recent mistake. Write what a harsh critic would say, then what a good coach would say: what went wrong, what to do next time, said with care.', practice: 'practice_thought_record' },
      { title: 'Keep the kind voice', aim: 'Make self-compassion a habit.', exercise: 'Pick one daily cue (brushing teeth, a hard email) for a brief kind phrase or soothing breath, and one weekly act of care for yourself. Review what has changed in how you speak to yourself.', practice: 'practice_if_then_plan' },
    ],
    practices: ['practice_self_compassion_break', 'practice_care_for_the_body', 'practice_externalise_problem', 'practice_name_the_feeling'],
    ideas: ['neff_self_compassion', 'horney_tyranny_of_the_should'],
  },
  // Klerman, Weissman, Rounsaville and Chevron, Interpersonal Psychotherapy of Depression (1984); Weissman, Markowitz
  // and Klerman, Comprehensive Guide to Interpersonal Psychotherapy (2000); Cuijpers et al. (2011, 2016) meta-analyses.
  {
    id: 'ipt', name: 'Interpersonal psychotherapy', short: 'IPT', school: 'attachment', founders: 'Gerald Klerman, Myrna Weissman', years: 'from the 1970s',
    how: 'IPT links low mood to what is happening in your relationships and works on one of four areas: grief after a death, a dispute with someone important, a role transition (a move, a new job, a baby, retirement), or isolation and lack of close relationships. It is time-limited, usually 12 to 16 sessions, and focuses on the present, improving relationships and support so that mood improves.',
    for: ['low_mood', 'grief', 'relationships', 'life_change', 'loneliness'],
    evidence: 'Well supported for depression, about as effective as CBT, and NICE lists it among treatments for depression; it has also been adapted for bulimia and other problems. The evidence is for therapist-delivered IPT; self-guided versions are little studied.',
    suits: 'People whose low mood is bound up with a relationship, a loss or a change in their life, who prefer to work on the here and now.',
    self_help: 'partly',
    needs_professional: `IPT itself is delivered by a trained therapist; the steps below are reflective parts you can do alone. If a relationship involves violence, threats or control, contact a domestic abuse service rather than working on the relationship alone. ${CRISIS}`,
    sessions: [
      { title: 'Mood and events', aim: 'Link changes in mood to what happened in life.', exercise: 'Draw a timeline of the last year or two. Mark when your mood dropped or lifted and what was happening in your relationships and roles at the time.', practice: 'practice_name_the_feeling' },
      { title: 'Your circle', aim: 'Map the important people in your life.', exercise: 'List the important people, past and present. For each, note what is good, what is hard, how often you are in touch and what you would like to change.', practice: 'practice_invest_in_people' },
      { title: 'Choose a focus', aim: 'Pick the area most linked to your mood.', exercise: 'Decide which fits best: grief, a dispute, a big change of role, or loneliness. Write one sentence on what you would like to be different in that area in two months.', practice: 'practice_values_compass' },
      { title: 'Look at expectations', aim: 'Understand what each side wants.', exercise: 'For your focus, write what you expect of the other person or the new role, and what they or it seem to expect of you. Where do expectations clash, and which could change?', practice: 'practice_hold_beliefs_loosely' },
      { title: 'Plan a conversation', aim: 'Prepare to communicate more clearly.', exercise: 'Choose a safe, everyday conversation you want to have. Write what you want to say using "I" statements, what you hope for, and how you might respond if it goes badly. Rehearse it aloud.', practice: 'practice_control_your_response' },
      { title: 'Build support', aim: 'Widen your network.', exercise: 'Choose two small steps to strengthen or add relationships this week: a message, a coffee, joining a group or class linked to an interest.', practice: 'practice_invest_in_people' },
      { title: 'Review and go on', aim: 'Notice what changed and what to keep doing.', exercise: 'Look back over the weeks: how have your mood and relationships changed? Write what you will keep doing and the warning signs to watch for.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_invest_in_people', 'practice_name_the_feeling', 'practice_control_your_response'],
    ideas: ['bowlby_ainsworth_attachment', 'harvard_study_adult_development'],
  },
  // Malan, Individual Psychotherapy and the Science of Psychodynamics (1979); Luborsky, Principles of Psychoanalytic
  // Psychotherapy (1984) and the core conflictual relationship theme; Shedler (2010); Abbass et al. (2014), Cochrane
  // review; Leichsenring et al. (2015); Driessen et al. (2015).
  {
    id: 'psychodynamic', name: 'Short-term psychodynamic therapy', short: 'STPP', school: 'psychoanalysis', founders: 'David Malan, Lester Luborsky, Habib Davanloo; after Freud', years: 'from the 1960s',
    how: 'Psychodynamic therapy looks for the patterns beneath a problem: feelings kept out of awareness, defences used to avoid them, and repeating ways of relating that began in earlier relationships. In a short-term version (often 16 to 30 sessions) the therapist and client focus on one central pattern, often as it shows up in the therapy relationship itself, so it can be seen and changed.',
    for: ['low_mood', 'relationships', 'self_esteem', 'worry', 'emotions_overwhelm'],
    evidence: 'Trials and meta-analyses find short-term psychodynamic therapy roughly as effective as other therapies for depression and some anxiety problems, and NICE lists it as an option for depression, though its evidence base is smaller than CBT\'s.',
    suits: 'People who want to understand where their patterns come from, and are drawn to talking openly over time.',
    self_help: 'partly',
    needs_professional: `The core of this therapy is the relationship with a therapist; the steps below are its reflective parts. Painful early experiences, especially abuse, are best explored with a therapist rather than alone. ${CRISIS}`,
    sessions: [
      { title: 'The repeating pattern', aim: 'Find a pattern in how relationships go.', exercise: 'Think of three recent moments of conflict or hurt with others. For each, write what you wanted, how the other person responded, and how you then felt and acted. Look for what repeats.', practice: 'practice_examine_daily' },
      { title: 'Feelings behind feelings', aim: 'Notice the feelings that are harder to feel.', exercise: 'When a familiar feeling shows up (irritation, numbness, worry), ask what might be underneath it: hurt, sadness, longing, fear. Name it gently, without having to act on it.', practice: 'practice_name_the_feeling' },
      { title: 'How you protect yourself', aim: 'Spot your usual defences.', exercise: 'Notice what you do when something hurts: joke, get busy, intellectualise, blame, go quiet. Write down one example, with curiosity rather than judgement.', practice: 'practice_hold_beliefs_loosely' },
      { title: 'Where it began', aim: 'Link the pattern to earlier relationships, gently.', exercise: 'Ask when you first remember feeling and acting this way, and what it protected you from then. Stay with ordinary memories; if painful ones flood in, stop and come back to the present.', practice: 'practice_self_compassion_break' },
      { title: 'Doing it differently', aim: 'Try one new response.', exercise: 'Choose one situation where the pattern usually plays out. Decide on a small new response (saying what you feel, asking for what you want) and try it with a safe person.', practice: 'practice_control_your_response' },
      { title: 'Endings and what remains', aim: 'Pull together what you have understood.', exercise: 'Write a short account of your central pattern, where it came from and what you are doing about it. Note what you would want to explore further with a therapist.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_name_the_feeling', 'practice_examine_daily', 'practice_self_compassion_break'],
    ideas: ['freud_ego_not_master', 'anna_freud_defence_mechanisms', 'horney_tyranny_of_the_should'],
  },
  // Young, Cognitive Therapy for Personality Disorders: A Schema-Focused Approach (1990); Young and Klosko, Reinventing
  // Your Life (1993); Young, Klosko and Weishaar, Schema Therapy (2003); Giesen-Bloo et al. (2006).
  {
    id: 'schema', name: 'Schema therapy', short: 'Schema therapy', school: 'cbt', founders: 'Jeffrey Young', years: 'from the 1990s',
    how: 'Schema therapy extends CBT for long-standing patterns. It names "schemas" (deep beliefs formed when core childhood needs went unmet, such as abandonment, defectiveness or unrelenting standards) and "modes" (the states we switch into). Over a long course it combines cognitive work, imagery, chair work and a warm therapy relationship to meet old needs and weaken the schemas.',
    for: ['self_esteem', 'relationships', 'self_criticism', 'emotions_overwhelm'],
    evidence: 'Trials support it for borderline personality disorder, and there is emerging evidence for other personality difficulties and chronic depression, but the evidence base is still modest.',
    suits: 'People with lifelong patterns in relationships or self-worth that shorter therapies have not shifted.',
    self_help: 'professional',
    needs_professional: `The core of schema therapy (imagery rescripting, chair work, the therapy relationship) needs a trained schema therapist, often for a year or more. These steps only prepare you: noticing patterns, looking after yourself and finding help. ${CRISIS}`,
    sessions: [
      { title: 'This is preparation', aim: 'Understand what schema therapy is and what to do alone.', exercise: 'Read a plain introduction to schemas and modes. Write down which descriptions seem familiar, and note that the deep work is done with a therapist.', practice: '' },
      { title: 'Notice the triggers', aim: 'See when an old pattern switches on.', exercise: 'For two weeks, note moments when your reaction felt bigger than the situation. Write the trigger, the feeling and what you did, without digging into the past.', practice: 'practice_name_the_feeling' },
      { title: 'Steady ground', aim: 'Look after yourself while patterns are active.', exercise: 'Build a routine that supports you: regular sleep, food, movement and one person you can talk to. Use a self-compassion break when a pattern flares.', practice: 'practice_self_compassion_break' },
      { title: 'Find a schema therapist', aim: 'Take the step to proper help.', exercise: 'Ask your doctor about referral, or look for an accredited schema therapist through a professional register. List questions to ask: training, experience, length and cost of therapy.', practice: '' },
      { title: 'What you want from therapy', aim: 'Arrive at the first appointment ready.', exercise: 'Write a short summary: the patterns you noticed, how they affect your life, and what you hope will change. Take it to your first session.', practice: 'practice_values_compass' },
    ],
    practices: ['practice_name_the_feeling', 'practice_self_compassion_break'],
    ideas: ['bowlby_ainsworth_attachment', 'beck_cognitive_therapy_stoicism_tested'],
  },
  // Rogers, Client-Centered Therapy (1951), "The necessary and sufficient conditions of therapeutic personality change"
  // (1957) and On Becoming a Person (1961); Elliott et al. meta-analyses of humanistic-experiential therapies; Barkham et
  // al. (2021), the PRaCTICED trial of Counselling for Depression.
  {
    id: 'person_centred', name: 'Person-centred therapy and counselling', short: 'Person-centred', school: 'humanistic', founders: 'Carl Rogers', years: 'from the 1940s',
    how: 'Person-centred therapy offers a relationship rather than techniques: a counsellor who is genuine, deeply empathic and accepting without conditions. In that setting, the person can hear their own feelings and values more clearly, loosen "conditions of worth" taken on from others, and find their own direction. The client leads.',
    for: ['low_mood', 'self_esteem', 'life_change', 'grief'],
    evidence: 'NICE includes counselling as an option for depression, and a large UK trial found a person-centred-experiential counselling for depression about as effective as CBT; empathy and the therapeutic alliance are among the best-supported ingredients of all therapy.',
    suits: 'People who want to be listened to rather than taught, and to find their own answers at their own pace.',
    self_help: 'partly',
    needs_professional: `Its heart is being listened to by another person, so a counsellor, or at least a trusted listener, is part of it. Severe or lasting low mood needs a doctor. ${CRISIS}`,
    sessions: [
      { title: 'Listen to yourself', aim: 'Hear what you actually feel.', exercise: 'Write for ten minutes a day about what is on your mind, without correcting or judging. At the end, underline the feelings you named.', practice: 'practice_name_the_feeling' },
      { title: 'Whose voice?', aim: 'Notice conditions of worth.', exercise: 'Write the "shoulds" you live by, and next to each whose voice it sounds like. Ask which you truly hold, and which you took on to be accepted.', practice: 'practice_hold_beliefs_loosely' },
      { title: 'Be heard', aim: 'Experience being listened to.', exercise: 'Ask someone you trust for twenty minutes of listening without advice. Tell them what is on your mind and notice what changes when you are simply heard.', practice: 'practice_invest_in_people' },
      { title: 'Accept where you are', aim: 'Treat your own experience with acceptance.', exercise: 'When you notice a feeling you dislike in yourself, say "it makes sense that I feel this" and stay with it a moment before deciding what to do.', practice: 'practice_self_compassion_break' },
      { title: 'Your own direction', aim: 'Find what you want for yourself.', exercise: 'Ask: if no one were judging me, what would I want here? Write freely, then choose one small step toward it.', practice: 'practice_values_compass' },
      { title: 'Find a counsellor if you want one', aim: 'Know how to get the relationship this therapy rests on.', exercise: 'Look up accredited counsellors through a professional body or your doctor, or a low-cost service. Note what you would want to bring to the first session.', practice: '' },
    ],
    practices: ['practice_name_the_feeling', 'practice_values_compass', 'practice_self_compassion_break', 'practice_invest_in_people'],
    ideas: ['rogers_unconditional_positive_regard', 'maslow_hierarchy'],
  },
  // Greenberg, Rice and Elliott, Facilitating Emotional Change (1993); Greenberg and Watson, Emotion-Focused Therapy for
  // Depression (2006); Greenberg, Emotion-Focused Therapy (2011); Greenberg and Webster (1982) on two-chair work;
  // Paivio and Greenberg (1995) on unfinished business.
  {
    id: 'emotion_focused', name: 'Emotion-focused therapy', short: 'EFT', school: 'humanistic', founders: 'Leslie Greenberg, Robert Elliott, Laura Rice', years: 'from the 1980s',
    how: 'Emotion-focused therapy treats emotions as useful information and works to reach the core feelings under surface reactions (for example sadness under anger, or shame under anxiety). In an empathic relationship, it uses tasks such as two-chair dialogue between a critical and a criticised part of the self, so that painful emotions can be felt, understood and changed by new ones such as self-compassion or assertive anger.',
    for: ['emotions_overwhelm', 'self_criticism', 'low_mood', 'decision'],
    evidence: 'Trials show it effective for depression, comparable to CBT in a few studies, and two-chair work has shown benefits for self-criticism and decisional conflict, but the trials are fewer and smaller than for CBT.',
    suits: 'People who understand their problems in their heads but feel stuck, and want to work with feelings directly.',
    self_help: 'partly',
    needs_professional: `Emotion work with past trauma or abuse, including talking to someone who hurt you in an empty chair, should be done only with a therapist. ${CRISIS}`,
    sessions: [
      { title: 'Feel in the body', aim: 'Notice emotion as a bodily experience.', exercise: 'Once a day, sit for five minutes and ask "what am I feeling?" Notice where in the body, and find words that fit, refining until one feels right.', practice: 'practice_name_the_feeling' },
      { title: 'Surface and core', aim: 'Find the feeling under the first feeling.', exercise: 'Take one recent reaction (snapping, shutting down, worrying). Ask what feeling lay underneath, and what you needed at that moment.', practice: 'practice_name_the_feeling' },
      { title: 'Two chairs, inner critic', aim: 'Give the critic and the criticised part a voice.', exercise: 'Set two chairs. In one, say aloud what your inner critic says to you. Move to the other and say how it feels to hear that and what you need. Go back and forth a few times; stop if it becomes overwhelming.', practice: 'practice_externalise_problem' },
      { title: 'The need', aim: 'Hear the need behind the pain.', exercise: 'From your chair work or writing, name the core need (to be accepted, protected, valued). Write how you might meet some of it yourself, and who else could help meet it.', practice: 'practice_self_compassion_break' },
      { title: 'Two chairs, decision', aim: 'Work through an inner conflict.', exercise: 'For a decision you are torn about, let each side speak from its own chair, saying what it wants and fears. Notice what each side needs and whether a middle way emerges.', practice: 'practice_decisional_balance' },
      { title: 'New emotion for old', aim: 'Answer a painful feeling with a helpful one.', exercise: 'When an old painful feeling arises, deliberately call up a different one that fits your need: compassion for hurt, healthy anger at mistreatment, hope for helplessness. Write what happens.', practice: 'practice_self_compassion_break' },
    ],
    practices: ['practice_name_the_feeling', 'practice_self_compassion_break', 'practice_externalise_problem', 'practice_decisional_balance'],
    ideas: ['perls_gestalt_here_and_now', 'rogers_unconditional_positive_regard'],
  },
  // Johnson, The Practice of Emotionally Focused Couple Therapy (1996; 2nd ed. 2004) and Hold Me Tight (2008); Johnson
  // et al. (1999) meta-analysis; Wiebe and Johnson (2016) review.
  {
    id: 'eft_couples', name: 'Emotionally focused couples therapy', short: 'EFT for couples', school: 'attachment', founders: 'Sue Johnson, Leslie Greenberg', years: 'from the 1980s',
    how: 'EFT for couples sees distress as a cycle driven by attachment fears: one partner pursues or protests, the other withdraws, and each move provokes the other. The therapist helps the couple see the cycle as the enemy, reach the softer feelings beneath it (fear of rejection, of not mattering), and turn to each other for comfort and closeness.',
    for: ['relationships'],
    evidence: 'One of the best-researched couple therapies, with trials showing good rates of recovery from relationship distress, though many trials are small and from the developers\' group.',
    suits: 'Couples who keep having the same fight and want to understand and change the emotional pattern between them.',
    self_help: 'partly',
    needs_professional: 'Couple work is not advised where there is violence, threats or coercive control; contact a domestic abuse service instead. Couples in serious distress do best with a trained couple therapist.',
    sessions: [
      { title: 'Name the cycle', aim: 'See the pattern rather than blame each other.', exercise: 'Together, describe your usual argument as steps: what one does, how the other reacts, what happens next. Give the cycle a name, so it becomes something you face together.', practice: 'practice_externalise_problem' },
      { title: 'Under the moves', aim: 'Find the feelings beneath pursuing and withdrawing.', exercise: 'Each of you writes what you feel underneath when the cycle starts: lonely, not good enough, afraid of conflict. Share one feeling each, gently, at a calm time.', practice: 'practice_name_the_feeling' },
      { title: 'What I need from you', aim: 'Express needs instead of complaints.', exercise: 'Each says one need as a soft request ("I need to know I matter to you"), not a criticism. The listener reflects back what they heard before answering.', practice: 'practice_invest_in_people' },
      { title: 'Catch the cycle', aim: 'Interrupt the pattern in real time.', exercise: 'Agree a signal for "the cycle is here". When either uses it, pause for twenty minutes to calm down, then come back and talk about the feelings beneath.', practice: 'practice_control_your_response' },
      { title: 'Turning toward', aim: 'Build moments of connection.', exercise: 'Each day, make one small reach toward your partner (a touch, a question, a thank you) and notice the reaches they make toward you.', practice: 'practice_invest_in_people' },
      { title: 'Our story', aim: 'Consolidate what has changed.', exercise: 'Together, write a short account of your cycle, how you get out of it, and what helps you feel close. Keep it to reread when things get hard.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_invest_in_people', 'practice_externalise_problem', 'practice_name_the_feeling', 'practice_control_your_response'],
    ideas: ['bowlby_ainsworth_attachment', 'gottman_four_horsemen'],
  },
  // Gottman, Why Marriages Succeed or Fail (1994); Gottman and Silver, The Seven Principles for Making Marriage Work
  // (1999); Heyman and Slep (2001) on the divorce predictions.
  {
    id: 'gottman', name: 'Gottman method couples therapy', short: 'Gottman method', school: 'systems', founders: 'John Gottman, Julie Schwartz Gottman', years: 'from the 1990s',
    how: 'Built on decades of observing couples, the Gottman method strengthens friendship (knowing each other\'s worlds, fondness and admiration, turning toward bids for attention), helps manage conflict (softer starts, repair attempts, accepting influence), and avoids the "four horsemen" of criticism, contempt, defensiveness and stonewalling by using their antidotes.',
    for: ['relationships'],
    evidence: 'The observational research on what distinguishes stable and unhappy couples is substantial, but controlled trials of the therapy itself are few, and the famous divorce predictions were overstated.',
    suits: 'Couples who want practical, research-based exercises they can do together.',
    self_help: 'partly',
    needs_professional: 'Not for relationships with violence, threats or coercive control; contact a domestic abuse service. If conflict is constant or contempt has set in deeply, see a couple therapist.',
    sessions: [
      { title: 'Know each other\'s world', aim: 'Refresh your knowledge of each other.', exercise: 'Take turns asking open questions: current worries, hopes, friends, what a good day looks like. Listen without fixing.', practice: 'practice_invest_in_people' },
      { title: 'Fondness and admiration', aim: 'Notice and say what you appreciate.', exercise: 'Each day, tell your partner one specific thing you appreciate about them or something they did. Keep a short list of what you notice.', practice: 'practice_three_good_things' },
      { title: 'Turn toward bids', aim: 'Respond to small reaches for attention.', exercise: 'Notice your partner\'s bids (a comment, a sigh, a question) and respond to them, even briefly, instead of ignoring or turning against them.', practice: 'practice_invest_in_people' },
      { title: 'Spot the horsemen', aim: 'Recognise criticism, contempt, defensiveness and stonewalling.', exercise: 'After a disagreement, each notes privately which horsemen showed up in your own behaviour, not your partner\'s. Read the antidote for each: a gentle start, appreciation, taking responsibility, self-soothing.', practice: 'practice_control_your_response' },
      { title: 'Soft start and repair', aim: 'Raise problems without attack, and repair when it goes wrong.', exercise: 'Raise one small issue using "I feel... about... and I need...". If it heats up, use a repair attempt ("let me try again", "can we take a break?") and accept the other\'s repair.', practice: 'practice_control_your_response' },
      { title: 'Calm down first', aim: 'Avoid fighting while flooded.', exercise: 'Agree that if either feels flooded (racing heart, can\'t think), you pause for at least twenty minutes, do something calming, and come back to the conversation.', practice: 'practice_care_for_the_body' },
      { title: 'Shared meaning', aim: 'Build rituals and goals together.', exercise: 'Talk about the rituals you want (meals, goodbyes, weekends) and what you want your life together to stand for. Choose one ritual to start.', practice: 'practice_values_compass' },
    ],
    practices: ['practice_invest_in_people', 'practice_control_your_response', 'practice_three_good_things', 'practice_values_compass'],
    ideas: ['gottman_four_horsemen'],
  },
  // Bowen, Family Therapy in Clinical Practice (1978); Minuchin, Families and Family Therapy (1974); Selvini Palazzoli
  // et al., Paradox and Counterparadox (1978); Carr (2019) reviews of systemic therapy evidence; NICE NG69 (2017) on
  // family therapy for young people with anorexia.
  {
    id: 'systemic', name: 'Family and systemic therapy', short: 'Systemic therapy', school: 'systems', founders: 'Murray Bowen, Salvador Minuchin, Mara Selvini Palazzoli', years: 'from the 1950s',
    how: 'Systemic therapy treats a problem as part of a pattern between people: roles, alliances, unspoken rules and the way a family handles stress. Usually the family meets together with a therapist to map these patterns and try new ways of relating. Bowen\'s version also works with one person on their own part, staying connected while staying calm and true to themselves.',
    for: ['family', 'parenting', 'eating', 'relationships', 'addiction'],
    evidence: 'Systemic and family therapies have good evidence for several problems, especially family-based treatment for anorexia in young people (recommended by NICE) and for young people\'s conduct and substance problems; specific theories such as Bowen\'s are hard to test.',
    suits: 'People whose problem is tangled up with family, or families who want to work on a problem together.',
    self_help: 'partly',
    needs_professional: 'Eating disorders in young people, family violence, and serious risk to a child need professional and, where relevant, safeguarding help. Family therapy proper needs a trained therapist with the family present.',
    sessions: [
      { title: 'Draw the family', aim: 'See the system you belong to.', exercise: 'Draw a family tree (a genogram) going back two or three generations. Mark close, distant and conflicted relationships, and note patterns that repeat.', practice: 'practice_examine_daily' },
      { title: 'Map the pattern', aim: 'See the problem as a cycle between people.', exercise: 'Describe what happens around the problem: who does what, who reacts how, who gets drawn in. Write it as a loop, not a blame list.', practice: 'practice_externalise_problem' },
      { title: 'Triangles', aim: 'Notice when tension gets passed to a third person.', exercise: 'Notice times when tension between two people gets routed through a third (a child, a sibling, a parent). Note your own part in any triangle.', practice: 'practice_hold_beliefs_loosely' },
      { title: 'Your own part', aim: 'Change the one part you control.', exercise: 'Choose one small change in your own behaviour in the pattern: staying calm instead of reacting, speaking directly instead of through someone else. Do it a few times and notice what shifts.', practice: 'practice_control_your_response' },
      { title: 'Calm and connected', aim: 'Stay in contact without being swept up.', exercise: 'In one family contact this week, aim to stay calm, say what you think in an "I" statement, and stay connected without taking on others\' anxiety.', practice: 'practice_care_for_the_body' },
      { title: 'Bring the family in', aim: 'Decide whether to work together with help.', exercise: 'Consider whether family members would come to family therapy. Look up family or systemic therapists, or ask a doctor or school for a referral.', practice: '' },
    ],
    practices: ['practice_control_your_response', 'practice_externalise_problem', 'practice_invest_in_people'],
    ideas: ['bowen_family_systems', 'lewin_person_and_situation'],
  },
  // Patterson, Coercive Family Process (1982); Webster-Stratton, The Incredible Years (1992); Sanders, Triple P; Eyberg,
  // parent-child interaction therapy; NICE CG158 (2013) on conduct problems in children.
  {
    id: 'parent_training', name: 'Parenting programmes', short: 'Parent training', school: 'behaviourism', founders: 'Gerald Patterson, Carolyn Webster-Stratton, Matthew Sanders, Sheila Eyberg', years: 'from the 1960s',
    how: 'Behavioural parenting programmes start from the finding that difficult behaviour is often kept going by attention: children get more of it for misbehaving than for behaving well. Parents learn to spend warm one-to-one play time with the child, praise and reward what they want to see, give clear calm instructions, and use mild, consistent consequences such as ignoring minor misbehaviour or a brief time-out.',
    for: ['parenting', 'family'],
    evidence: 'Strong evidence for reducing behaviour problems in young children, and NICE recommends group parent-training programmes for conduct problems; self-directed versions of programmes such as Triple P also have trial support.',
    suits: 'Parents of young children with tantrums, defiance or difficult behaviour who want practical, step-by-step methods.',
    self_help: 'yes',
    needs_professional: 'Get professional help for possible developmental conditions (such as autism or ADHD), behaviour that puts the child or others at risk, or if you fear you might hurt your child. Never use physical punishment.',
    sessions: [
      { title: 'Watch and count', aim: 'See the behaviour and what follows it.', exercise: 'For a week, note the behaviours that bother you, when they happen, what came before and what you did after. Also note good moments.', practice: '' },
      { title: 'Special time', aim: 'Build warmth through child-led play.', exercise: 'Give your child 10 to 15 minutes a day of play where they lead. Describe what they are doing, praise, and avoid questions, instructions and criticism.', practice: 'practice_invest_in_people' },
      { title: 'Catch them being good', aim: 'Reward the behaviour you want.', exercise: 'Choose one behaviour you want more of and praise it specifically every time you see it ("thank you for putting your shoes away"). Consider a simple sticker chart.', practice: 'practice_three_good_things' },
      { title: 'Clear instructions', aim: 'Give instructions that work.', exercise: 'Get close, use the child\'s name, give one short, specific instruction in a calm voice, and wait a few seconds. Praise when they do it.', practice: '' },
      { title: 'Calm consequences', aim: 'Respond to misbehaviour consistently without escalation.', exercise: 'Ignore minor attention-seeking behaviour. For agreed problems, use a mild, consistent consequence you have explained beforehand, such as a short time-out or loss of a small privilege. Stay calm.', practice: 'practice_control_your_response' },
      { title: 'Look after yourself', aim: 'Keep your own stress manageable.', exercise: 'Notice what drains you and plan one way to recharge each week. When you feel yourself getting angry, step away briefly before responding.', practice: 'practice_care_for_the_body' },
      { title: 'Plan ahead', aim: 'Prevent problems in hard situations.', exercise: 'Choose a regular difficult moment (shops, bedtime). Before it, agree simple rules with your child, a reward for good behaviour and the consequence for breaking a rule.', practice: 'practice_if_then_plan' },
    ],
    practices: ['practice_invest_in_people', 'practice_control_your_response', 'practice_if_then_plan'],
    ideas: ['thorndike_law_of_effect', 'winnicott_good_enough_mother', 'bowlby_ainsworth_attachment'],
  },
  // de Shazer, Keys to Solution in Brief Therapy (1985) and Clues (1988); Berg and Miller, Working with the Problem
  // Drinker (1992); Kim (2008) and Gingerich and Peterson (2013) reviews.
  {
    id: 'solution_focused', name: 'Solution-focused brief therapy', short: 'SFBT', school: 'brief', founders: 'Steve de Shazer, Insoo Kim Berg', years: 'from the 1980s',
    how: 'Solution-focused therapy spends little time on the problem and its causes. It asks what you want instead (the miracle question), finds exceptions (times when the problem was absent or smaller), uses scales to measure progress, and builds on what already works. It is usually brief, often fewer than six sessions.',
    for: ['decision', 'life_change', 'stress', 'relationships', 'low_mood'],
    evidence: 'Reviews find modest benefits across a range of problems, in studies of mixed quality; it is less tested than CBT for specific conditions.',
    suits: 'People who want to look forward rather than back, and to build on their strengths.',
    self_help: 'yes',
    needs_professional: `Severe depression or anxiety, risk to yourself or others, and complex long-term problems need more than a brief approach. ${CRISIS}`,
    sessions: [
      { title: 'The miracle question', aim: 'Describe the future you want.', exercise: 'Imagine the problem is solved overnight. Describe tomorrow in detail: the first thing you notice, what you do, what others notice about you.', practice: 'practice_miracle_question' },
      { title: 'Find exceptions', aim: 'Discover when things already go better.', exercise: 'Look back for times when the problem was absent or smaller. What was different? What were you doing?', practice: 'practice_miracle_question' },
      { title: 'Scale it', aim: 'Measure where you are and what one step up looks like.', exercise: 'Rate where you are from 0 to 10, where 10 is the miracle. Ask why you are not lower, and what one point higher would look like.', practice: 'practice_miracle_question' },
      { title: 'Do more of what works', aim: 'Repeat the exceptions on purpose.', exercise: 'Pick one thing you did during an exception and do it deliberately this week. Note what happens.', practice: 'practice_if_then_plan' },
      { title: 'Notice change', aim: 'Pay attention to progress.', exercise: 'Each day, note one small sign of the preferred future, however small. Ask what you did to make it happen.', practice: 'practice_three_good_things' },
      { title: 'Next steps', aim: 'Decide how to keep going.', exercise: 'Rescale. Write what has helped, what you will keep doing, and what a good-enough point on the scale would be for you.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_miracle_question', 'practice_if_then_plan', 'practice_three_good_things'],
    ideas: ['de_shazer_berg_miracle_question'],
  },
  // White and Epston, Narrative Means to Therapeutic Ends (1990); White, Maps of Narrative Practice (2007).
  {
    id: 'narrative', name: 'Narrative therapy', short: 'Narrative therapy', school: 'brief', founders: 'Michael White, David Epston', years: 'from the 1980s',
    how: 'Narrative therapy sees people as living by stories about themselves, often thin, problem-saturated ones. It separates the person from the problem by naming the problem as something outside you ("the Worry", "the Anger"), maps its effects, finds "unique outcomes" when you resisted it, and helps write a richer, preferred story, often with others as witnesses.',
    for: ['self_esteem', 'life_change', 'family', 'grief'],
    evidence: 'Its evidence rests on fewer and smaller studies than most therapies here, so it is promising rather than established.',
    suits: 'People who think in stories, feel defined by a problem, or want a respectful, collaborative approach.',
    self_help: 'partly',
    needs_professional: `Severe or risky problems need professional help; narrative work is a complement, not a replacement. ${CRISIS}`,
    sessions: [
      { title: 'Name the problem', aim: 'Separate yourself from the problem.', exercise: 'Give the problem a name as if it were a character. Write how it talks to you and what it wants from you.', practice: 'practice_externalise_problem' },
      { title: 'Map its effects', aim: 'See what the problem has taken.', exercise: 'Write how the problem has affected your life, relationships, work and view of yourself. Ask whether you are happy with these effects.', practice: 'practice_externalise_problem' },
      { title: 'Unique outcomes', aim: 'Find times you stood up to the problem.', exercise: 'Look for moments when the problem did not get its way, however small. Write how you did it and what it says about you.', practice: 'practice_externalise_problem' },
      { title: 'The preferred story', aim: 'Write the story you want to live.', exercise: 'Write a short story of your life from the unique outcomes onward, emphasising your values and skills. What would you call this story?', practice: 'practice_values_compass' },
      { title: 'Witnesses', aim: 'Share the new story with others.', exercise: 'Tell someone you trust about a time you resisted the problem. Ask them what it shows about you.', practice: 'practice_invest_in_people' },
    ],
    practices: ['practice_externalise_problem', 'practice_values_compass', 'practice_invest_in_people'],
    ideas: ['white_epston_narrative_therapy', 'pennebaker_expressive_writing'],
  },
  // Miller (1983); Miller and Rollnick, Motivational Interviewing (1991; 3rd ed. 2013); Prochaska and DiClemente (1983);
  // Lundahl et al. (2010) meta-analysis; West (2005) critique of the stages model.
  {
    id: 'motivational_interviewing', name: 'Motivational interviewing', short: 'MI', school: 'motivational', founders: 'William R. Miller, Stephen Rollnick; with James Prochaska and Carlo DiClemente\'s stages of change', years: 'from the 1980s',
    how: 'Motivational interviewing is a way of talking about change that works with ambivalence rather than against it. Instead of arguing for change, the helper listens, reflects and draws out the person\'s own reasons, values and confidence ("change talk"), so the decision is theirs. It is often paired with the stages of change, matching help to readiness.',
    for: ['addiction', 'habit', 'decision'],
    evidence: 'Meta-analyses find small to moderate effects, strongest for alcohol and other substance use and as a brief intervention before other treatment; the stages-of-change model itself is disputed.',
    suits: 'People who are torn about a change, or tired of being told what to do.',
    self_help: 'partly',
    needs_professional: 'If you are physically dependent on alcohol, drugs such as benzodiazepines or opioids, or if stopping gives you shakes, sweats or seizures, do not stop suddenly on your own; see a doctor for a safe plan. Gambling or drug problems that are harming money or relationships deserve specialist help.',
    sessions: [
      { title: 'Where am I?', aim: 'Locate yourself honestly.', exercise: 'Write what you are thinking of changing and where you stand: not seeing a problem, wondering, planning, started, or keeping it up. Rate importance and confidence from 0 to 10.', practice: 'practice_decisional_balance' },
      { title: 'Both sides', aim: 'Make room for ambivalence.', exercise: 'Write what the current behaviour gives you and what it costs you, and what the change would give and cost. Be honest about the benefits of not changing.', practice: 'practice_decisional_balance' },
      { title: 'Your own reasons', aim: 'Hear your reasons for change in your own words.', exercise: 'Write why the change matters to you, how life might be better, and why your importance score is not lower. Read it aloud.', practice: 'practice_decisional_balance' },
      { title: 'Values check', aim: 'Link change to what matters.', exercise: 'List your most important values, and how the current behaviour fits or clashes with them.', practice: 'practice_values_compass' },
      { title: 'Confidence', aim: 'Build belief that you can change.', exercise: 'Recall past changes you made and what helped. Ask what would raise your confidence score by one point.', practice: '' },
      { title: 'A first plan', aim: 'Turn intention into a step, if you are ready.', exercise: 'If you are ready, choose one small, specific step and an if-then plan for the likeliest obstacle. If not, decide when you will revisit this.', practice: 'practice_if_then_plan' },
    ],
    practices: ['practice_decisional_balance', 'practice_values_compass', 'practice_if_then_plan'],
    ideas: ['miller_rollnick_motivational_interviewing', 'prochaska_stages_of_change'],
  },
  // Marlatt and Gordon, Relapse Prevention (1985); Irvin et al. (1999) meta-analysis; Witkiewitz and Marlatt (2004);
  // Bowen, Chawla and Marlatt, Mindfulness-Based Relapse Prevention (2010); NICE CG115 (2011) on alcohol-use disorders.
  {
    id: 'relapse_prevention', name: 'Relapse prevention for drinking and other addictions', short: 'Relapse prevention', school: 'cbt', founders: 'G. Alan Marlatt, Judith Gordon', years: 'from the 1980s',
    how: 'Relapse prevention, a CBT approach, treats a lapse as a predictable event to plan for, not a moral failure. You identify high-risk situations (people, places, feelings), build coping skills and alternatives for each, plan for cravings, and learn to stop a single lapse from becoming a full relapse. It is usually combined with motivational interviewing and, where needed, medical help.',
    for: ['addiction', 'habit'],
    evidence: 'Meta-analyses support relapse prevention for alcohol and other substance problems, with effects strongest for alcohol, and NICE recommends CBT-based and behavioural approaches for harmful drinking and mild dependence. More severe dependence needs medical treatment as well.',
    suits: 'People who have decided to cut down or stop and want a practical plan for the hard moments.',
    self_help: 'partly',
    needs_professional: 'If you drink heavily every day, or get shakes, sweats, anxiety or confusion when you stop, stopping suddenly can be dangerous (withdrawal seizures); see a doctor for a supervised plan. Dependence on drugs, gambling debts, or harm to others need specialist services.',
    sessions: [
      { title: 'Your pattern', aim: 'See when and why you drink or use.', exercise: 'For a week or two, note each time you drink, use or gamble: when, where, with whom, how you felt before and how much. Look for patterns.', practice: '' },
      { title: 'High-risk situations', aim: 'List your triggers.', exercise: 'From your record, list the situations, feelings and people that most often lead to drinking or using. Rate each for risk.', practice: 'practice_name_the_feeling' },
      { title: 'Coping plans', aim: 'Prepare alternatives for each trigger.', exercise: 'For your top three triggers, write an if-then plan: what you will do instead, who you can call, how you will leave or avoid the situation.', practice: 'practice_if_then_plan' },
      { title: 'Riding cravings', aim: 'Get through urges without acting.', exercise: 'When a craving comes, notice it in your body, rate it, and watch it rise and fall like a wave over 15 to 30 minutes, while doing something else. Note how it passes.', practice: 'practice_defusion' },
      { title: 'A lapse is not a relapse', aim: 'Stop one slip turning into many.', exercise: 'Write what you will do if you slip: stop, leave the situation, call someone, and look at what led to it, without the "I have blown it" thought.', practice: 'practice_self_compassion_break' },
      { title: 'A balanced life', aim: 'Build rewards that replace drinking or using.', exercise: 'List activities and people that give you pleasure or meaning without drinking or using. Schedule some each week.', practice: 'practice_behavioural_activation' },
      { title: 'Keep your plan', aim: 'Review and strengthen the plan.', exercise: 'Write your warning signs, your top coping strategies and your support contacts on one card. Review it weekly.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_if_then_plan', 'practice_defusion', 'practice_self_compassion_break', 'practice_behavioural_activation'],
    ideas: ['prochaska_stages_of_change', 'miller_rollnick_motivational_interviewing', 'gollwitzer_implementation_intentions'],
  },
  // Frankl, Man's Search for Meaning (1946; English 1959); Yalom, Existential Psychotherapy (1980); May, Existence
  // (1958); Breitbart et al. (2010, 2015) on meaning-centred psychotherapy; Vos, Craig and Cooper (2015) meta-analysis.
  {
    id: 'existential', name: 'Existential therapy and logotherapy', short: 'Existential', school: 'existential', founders: 'Viktor Frankl, Rollo May, Irvin Yalom', years: 'from the 1940s',
    how: 'Existential therapy helps people face the givens of life (death, freedom and responsibility, isolation, and the search for meaning) honestly rather than dodge them. Frankl\'s logotherapy focuses on finding meaning: in what we give to the world, what we take from it, and the attitude we take toward suffering we cannot change.',
    for: ['meaning', 'grief', 'life_change', 'decision', 'loneliness'],
    evidence: 'Few controlled trials, so its evidence as a treatment is thin, though meaning-centred therapies for people with serious illness have encouraging trial results.',
    suits: 'People facing questions of meaning, mortality, choice or loneliness, who want to think deeply rather than learn techniques.',
    self_help: 'partly',
    needs_professional: `Reflection on death and meaning can stir up distress; if it deepens hopelessness rather than easing it, talk to someone. ${CRISIS}`,
    sessions: [
      { title: 'What is given', aim: 'Name the life questions you are facing.', exercise: 'Write which of the givens (death, freedom, isolation, meaning) feels most present in your life right now, and how you have been avoiding or facing it.', practice: 'practice_keep_death_in_view' },
      { title: 'Your choices', aim: 'Take responsibility for what you can choose.', exercise: 'List what you are choosing, even by default, in your current situation. Pick one area where you want to choose more deliberately.', practice: 'practice_control_your_response' },
      { title: 'Sources of meaning', aim: 'Find meaning in what you give, receive and how you bear what you cannot change.', exercise: 'Write examples of meaning from what you create or give, from people, beauty or experiences, and from how you have faced hard times.', practice: 'practice_work_that_outlasts_you' },
      { title: 'Facing mortality', aim: 'Let finitude clarify priorities.', exercise: 'Imagine looking back from the end of your life. What would you want to have done with the time you have? Choose one thing to do this week. Stop if this brings hopelessness rather than clarity.', practice: 'practice_keep_death_in_view' },
      { title: 'Connection and aloneness', aim: 'Accept some aloneness and deepen real contact.', exercise: 'Write about the ways you feel alone. Choose one relationship to deepen through honest conversation.', practice: 'practice_invest_in_people' },
      { title: 'Living by meaning', aim: 'Commit to meaningful action.', exercise: 'Write a short statement of what makes your life meaningful now, and one concrete step toward it.', practice: 'practice_values_compass' },
    ],
    practices: ['practice_keep_death_in_view', 'practice_work_that_outlasts_you', 'practice_values_compass', 'practice_invest_in_people'],
    ideas: ['frankl_mans_search_for_meaning', 'yalom_four_givens'],
  },
  // Perls, Hefferline and Goodman, Gestalt Therapy (1951); Greenberg and Webster (1982) on two-chair work for decisional
  // conflict.
  {
    id: 'gestalt', name: 'Gestalt therapy', short: 'Gestalt', school: 'gestalt', founders: 'Fritz Perls, Laura Perls, Paul Goodman', years: 'from the 1950s',
    how: 'Gestalt therapy focuses on awareness of what is happening now: in the body, feelings and the relationship. It uses experiments, such as speaking in the first person, exaggerating a gesture, or dialogue between two parts of yourself, to bring "unfinished business" into awareness and complete it.',
    for: ['decision', 'self_criticism', 'emotions_overwhelm', 'relationships'],
    evidence: 'Little tested in its classic form; chair work studied within emotion-focused therapy has shown benefits, so its evidence is mainly borrowed.',
    suits: 'People who intellectualise and want to feel and act more directly in the present.',
    self_help: 'partly',
    needs_professional: `Empty-chair work with someone who hurt you, and any work on trauma, should be done only with a therapist. ${CRISIS}`,
    sessions: [
      { title: 'Here and now', aim: 'Build awareness of the present.', exercise: 'Several times a day, complete "Right now I am aware of..." for what you see, hear, feel in your body and feel emotionally.', practice: 'practice_name_the_feeling' },
      { title: 'I, not it', aim: 'Own your experience in language.', exercise: 'Notice when you say "it" or "you" for your own experience ("it is frustrating") and say it again with "I" ("I am frustrated"). Note what changes.', practice: 'practice_name_the_feeling' },
      { title: 'The body speaks', aim: 'Notice what the body is expressing.', exercise: 'When you feel something, notice a gesture or tension. Exaggerate it slightly and ask what it would say if it had words.', practice: 'practice_care_for_the_body' },
      { title: 'Two parts', aim: 'Give voice to an inner conflict.', exercise: 'For a conflict between two parts of yourself (a "should" and a "want"), let each speak from its own chair. Notice what each needs. Stop if it overwhelms you.', practice: 'practice_decisional_balance' },
      { title: 'Unfinished business, gently', aim: 'Notice what is still incomplete.', exercise: 'Write an unsent letter to someone with whom something feels unfinished (not someone who has abused or hurt you badly). Say what you did not get to say.', practice: 'practice_name_the_feeling' },
    ],
    practices: ['practice_name_the_feeling', 'practice_care_for_the_body', 'practice_decisional_balance'],
    ideas: ['perls_gestalt_here_and_now'],
  },
  // Seligman, Steen, Park and Peterson (2005); Seligman, Flourish (2011); Lyubomirsky, The How of Happiness (2007); Sin
  // and Lyubomirsky (2009), Bolier et al. (2013) and White, Uttl and Holder (2019) meta-analyses.
  {
    id: 'positive_psychology', name: 'Positive psychology interventions', short: 'Positive psychology', school: 'positive', founders: 'Martin Seligman, Sonja Lyubomirsky, Christopher Peterson', years: 'from the 2000s',
    how: 'Positive psychology interventions are brief exercises aimed at building well-being rather than fixing problems: noting good things, expressing gratitude, using personal strengths in new ways, acts of kindness and savouring. They aim to widen attention and build resources.',
    for: ['meaning', 'low_mood', 'stress', 'loneliness'],
    evidence: 'Meta-analyses find small benefits for well-being and mild depressive symptoms, smaller in more rigorous reanalyses; they are not a treatment for clinical depression.',
    suits: 'People doing reasonably well who want to flourish more, or as a gentle addition to other help.',
    self_help: 'yes',
    needs_professional: `These are not a substitute for treatment of depression or anxiety; if mood is very low, a forced focus on positives can feel worse, so seek help. ${CRISIS}`,
    sessions: [
      { title: 'Three good things', aim: 'Train attention toward what goes well.', exercise: 'Each night for a week, write three things that went well and why they happened.', practice: 'practice_three_good_things' },
      { title: 'Strengths', aim: 'Use a strength in a new way.', exercise: 'Identify your top strengths (what you do well and enjoy). Each day this week, use one in a new way.', practice: 'practice_values_compass' },
      { title: 'Gratitude', aim: 'Express gratitude to someone.', exercise: 'Write a letter to someone you never properly thanked. Consider reading it to them in person or sending it.', practice: 'practice_invest_in_people' },
      { title: 'Kindness', aim: 'Do kind acts on purpose.', exercise: 'On one day this week, do five small acts of kindness. Note how you feel.', practice: 'practice_invest_in_people' },
      { title: 'Savouring and flow', aim: 'Make the most of good moments and absorbing activity.', exercise: 'Slow down to savour one pleasant experience a day. Notice when you lose track of time in an activity, and make room for more of it.', practice: 'practice_three_good_things' },
      { title: 'Meaning', aim: 'Connect to something larger.', exercise: 'Write about what gives your life meaning and one way to serve it this week.', practice: 'practice_work_that_outlasts_you' },
    ],
    practices: ['practice_three_good_things', 'practice_invest_in_people', 'practice_values_compass', 'practice_work_that_outlasts_you'],
    ideas: ['seligman_perma', 'fredrickson_broaden_and_build', 'csikszentmihalyi_flow', 'deci_ryan_self_determination'],
  },
  // Azrin and Nunn (1973) habit reversal; Gollwitzer (1999) and Gollwitzer and Sheeran (2006) on implementation
  // intentions; Lally et al. (2010) on habit formation; Wood and Neal (2007); Piacentini et al. (2010), the CBIT trial.
  {
    id: 'habit_change', name: 'Habit change and habit reversal', short: 'Habit change', school: 'behaviourism', founders: 'Nathan Azrin, Gregory Nunn, Peter Gollwitzer, Wendy Wood', years: 'from the 1970s',
    how: 'Habits run on cues: a time, a place, a feeling or a preceding action triggers the behaviour almost automatically. Habit change works on the cue and routine: noticing the triggers, changing the environment, planning if-then responses, and repeating a new behaviour in the same context until it becomes automatic. Habit reversal training adds awareness training and a competing response for tics, hair-pulling and skin-picking.',
    for: ['habit', 'procrastination'],
    evidence: 'If-then plans have good meta-analytic support for goal pursuit, and habit reversal training has good evidence for tics (as part of CBIT) and moderate evidence for hair-pulling and skin-picking. Forming a new habit often takes weeks to months.',
    suits: 'People who want to start or stop an everyday behaviour and like experimenting with small changes.',
    self_help: 'yes',
    needs_professional: 'Tics, hair-pulling (trichotillomania) and skin-picking are best treated with a therapist trained in habit reversal or CBIT. Habits that are addictions with physical dependence need a doctor.',
    sessions: [
      { title: 'Track the habit', aim: 'Notice when and where it happens.', exercise: 'For a week, note each time the habit happens: time, place, feeling, what happened just before and what you got from it.', practice: '' },
      { title: 'Find the cue', aim: 'Identify the main triggers.', exercise: 'From your notes, pick the most common cue. Write how you could change or avoid it (moving the phone, changing route, putting the healthy option in sight).', practice: 'practice_if_then_plan' },
      { title: 'If-then plans', aim: 'Plan the new response.', exercise: 'Write an if-then plan for the main cue: "If [cue], then I will [new action]." Make the new action small and easy.', practice: 'practice_if_then_plan' },
      { title: 'Competing response', aim: 'Do something incompatible with the habit.', exercise: 'Choose an action you can do instead that makes the habit hard (clenching fists gently for hair-pulling, holding a pen for nail-biting). Practise it for a minute whenever the urge comes.', practice: 'practice_if_then_plan' },
      { title: 'Repeat in context', aim: 'Make the new behaviour automatic.', exercise: 'Do the new behaviour in the same context every day. Track repetitions; expect it to take weeks.', practice: 'practice_behavioural_activation' },
      { title: 'Slips and support', aim: 'Plan for setbacks.', exercise: 'Write what you will do after a slip, and who could support you. Treat slips as information.', practice: 'practice_self_compassion_break' },
    ],
    practices: ['practice_if_then_plan', 'practice_behavioural_activation', 'practice_self_compassion_break'],
    ideas: ['gollwitzer_implementation_intentions', 'william_james_habit', 'mischel_delay_of_gratification'],
  },
  // Resick and Schnicke (1992), cognitive processing therapy; Foa, Hembree and Rothbaum (2007), prolonged exposure;
  // Ehlers and Clark (2000), cognitive therapy for PTSD; Shapiro (1989), EMDR; Herman, Trauma and Recovery (1992);
  // NICE NG116 (2018); APA PTSD guideline (2017); Davidson and Parker (2001) on eye movements.
  {
    id: 'trauma_focused', name: 'Trauma-focused therapies (CPT, PE, CT-PTSD, EMDR)', short: 'Trauma-focused therapy', school: 'cbt', founders: 'Patricia Resick, Edna Foa, Anke Ehlers and David Clark, Francine Shapiro', years: 'from the 1980s',
    how: 'Trauma-focused therapies help the mind process a traumatic memory so it becomes a memory of the past rather than a present threat. Cognitive processing therapy and cognitive therapy for PTSD work on the meanings taken from the trauma (blame, danger, shame); prolonged exposure revisits the memory and avoided situations in a controlled way; EMDR combines recalling the memory with bilateral stimulation such as eye movements. All are done with a trained therapist.',
    for: ['trauma'],
    evidence: 'Trauma-focused CBT (including CPT, PE and cognitive therapy) and EMDR are recommended for PTSD by NICE and are effective in trials; the APA gives its strongest recommendation to CBT, CPT, CT and PE. In EMDR, the eye movements may not be the active part.',
    suits: 'People with PTSD or lasting trauma symptoms (flashbacks, nightmares, avoidance, feeling on edge) who are ready to work with a therapist.',
    self_help: 'professional',
    needs_professional: `Processing a trauma needs a trained therapist; do not try to relive or process trauma memories on your own. These sessions are only stabilisation and preparation: steadying daily life and finding the right help. If you are still in danger, safety comes first: contact the police or a support service. ${CRISIS}`,
    sessions: [
      { title: 'This is preparation, not processing', aim: 'Understand what these steps are for.', exercise: 'Read a plain introduction to trauma reactions: flashbacks, being on edge and avoidance are common, understandable responses. Note that these steps are about steadying daily life, not going over what happened.', practice: '' },
      { title: 'Grounding', aim: 'Come back to the present when memories intrude.', exercise: 'Practise a grounding skill daily when calm: name five things you see, four you can touch, three you hear; press your feet into the floor and breathe out slowly. Use it when you feel pulled into the past.', practice: 'practice_care_for_the_body' },
      { title: 'Routine and body', aim: 'Build steady daily rhythms.', exercise: 'Set regular times to get up, eat and go to bed, and add some gentle movement each day. Cut back on alcohol and drugs, which make symptoms worse.', practice: 'practice_care_for_the_body' },
      { title: 'Support', aim: 'Connect with safe people.', exercise: 'List people you feel safe with and decide how to stay in touch. You do not have to tell them details; spending time together is enough.', practice: 'practice_invest_in_people' },
      { title: 'Kindness to yourself', aim: 'Answer self-blame with understanding.', exercise: 'When you notice self-blame or shame, use a self-compassion break. Remind yourself that your reactions are a normal response to an abnormal event.', practice: 'practice_self_compassion_break' },
      { title: 'Find a trauma therapist', aim: 'Take the step to proper treatment.', exercise: 'See your doctor or look for a therapist trained in a trauma-focused therapy (CPT, PE, CT-PTSD, TF-CBT or EMDR). Ask about their training and approach.', practice: '' },
    ],
    practices: ['practice_care_for_the_body', 'practice_invest_in_people', 'practice_self_compassion_break'],
    ideas: ['cannon_fight_or_flight', 'selye_stress'],
  },
  // Bowlby, Loss (1980); Stroebe and Schut (1999), the dual process model; Bonanno (2004) on resilience; Shear et al.
  // (2005, 2014), complicated grief treatment; Currier, Neimeyer and Berman (2008) meta-analysis; ICD-11 (2019) and
  // DSM-5-TR (2022) on prolonged grief disorder.
  {
    id: 'grief', name: 'Grief support and complicated grief treatment', short: 'Grief work', school: 'attachment', founders: 'John Bowlby; Margaret Stroebe and Henk Schut; M. Katherine Shear', years: 'from the 1980s',
    how: 'Most grief does not need therapy: it is the natural cost of love, and most people adapt over time with support. The dual process model describes healthy grieving as moving between facing the loss and rebuilding life. For prolonged grief, where intense yearning and inability to function continue long after the loss, complicated grief treatment combines work on the loss with restoring life goals and relationships, and is led by a therapist.',
    for: ['grief', 'loneliness', 'life_change'],
    evidence: 'Grief counselling for everyone who is bereaved shows little benefit, but complicated grief treatment and grief-focused CBT are effective for prolonged grief disorder in trials. The popular "five stages" of grief are not supported as a fixed sequence.',
    suits: 'People who are grieving and want to understand what is normal, look after themselves and keep connected to the person they lost.',
    self_help: 'partly',
    needs_professional: `If, long after the loss (around a year or more), grief still stops you living your life, or you feel you cannot go on without the person, see a doctor or a grief specialist. ${CRISIS}`,
    sessions: [
      { title: 'No right way', aim: 'Understand that grief varies.', exercise: 'Read about grief as it actually is: waves, not stages. Write how your grief shows up and remind yourself that it is a normal response to loss.', practice: 'practice_name_the_feeling' },
      { title: 'Basic care', aim: 'Look after the body through grief.', exercise: 'Check sleep, eating and movement, and choose one small way to look after each this week.', practice: 'practice_care_for_the_body' },
      { title: 'Facing and resting', aim: 'Move between grieving and living.', exercise: 'Set aside some time for grieving (looking at photos, writing, visiting a place) and some for ordinary life and rest. Both are part of healthy grief.', practice: '' },
      { title: 'Continuing bonds', aim: 'Keep a connection with the person who died.', exercise: 'Write a letter to the person, or about a memory you cherish. Stop and do something soothing if it becomes overwhelming.', practice: 'practice_self_compassion_break' },
      { title: 'Hard days', aim: 'Plan for anniversaries and triggers.', exercise: 'List the dates and situations likely to be hard. Plan how you will spend them and who you will be with.', practice: 'practice_if_then_plan' },
      { title: 'Back into life', aim: 'Take small steps toward a life with meaning.', exercise: 'Choose one small activity that matters to you, or that the person would have wanted for you, and do it this week.', practice: 'practice_behavioural_activation' },
      { title: 'Support', aim: 'Stay connected to others.', exercise: 'Reach out to one person each week. Consider a bereavement group or service if you want to talk with others who understand.', practice: 'practice_invest_in_people' },
    ],
    practices: ['practice_name_the_feeling', 'practice_care_for_the_body', 'practice_self_compassion_break', 'practice_invest_in_people'],
    ideas: ['bowlby_ainsworth_attachment', 'yalom_four_givens'],
  },
  // Novaco, Anger Control (1975); Deffenbacher and McKay, Overcoming Situational and General Anger (2000); Beck and
  // Fernandez (1998) and Del Vecchio and O'Leary (2004) meta-analyses.
  {
    id: 'anger_management', name: 'CBT-based anger management', short: 'Anger management', school: 'cbt', founders: 'Raymond Novaco, Jerry Deffenbacher', years: 'from the 1970s',
    how: 'CBT-based anger management treats anger as a normal emotion that becomes a problem when it is too frequent, intense or acted on harmfully. You learn to spot early warning signs, calm the body, rethink the hot thoughts that fuel anger (blame, "shoulds", catastrophising), and use assertive communication and problem-solving instead of aggression.',
    for: ['anger', 'relationships', 'stress'],
    evidence: 'Meta-analyses find moderate benefits of CBT-based anger programmes in adults; evidence for programmes for domestic abuse perpetrators is more mixed.',
    suits: 'People who want to stay calm under provocation and handle conflict without blowing up.',
    self_help: 'yes',
    needs_professional: 'If your anger leads to violence, threats, breaking things, or anyone feeling afraid of you, seek professional help now; if you are hurting a partner or children, contact a service for people who want to stop abusive behaviour.',
    sessions: [
      { title: 'Anger log', aim: 'Understand your anger pattern.', exercise: 'For a week, log each time you get angry: trigger, thoughts, body signs, intensity 0 to 10, what you did and the result.', practice: 'practice_name_the_feeling' },
      { title: 'Early warning signs', aim: 'Catch anger early.', exercise: 'From your log, list your early signs (clenched jaw, heat, raised voice). Practise noticing them at low intensity.', practice: 'practice_name_the_feeling' },
      { title: 'Calm the body', aim: 'Lower arousal quickly.', exercise: 'Practise slow breathing (longer out-breath) and relaxing tense muscles twice a day, then use it when early signs appear.', practice: 'practice_care_for_the_body' },
      { title: 'Time out', aim: 'Leave before you explode.', exercise: 'Agree a time-out plan with people close to you: say you need a break, leave for at least 20 minutes, calm down (no drinking or driving), and come back to talk.', practice: 'practice_if_then_plan' },
      { title: 'Hot thoughts', aim: 'Rethink anger-fuelling thoughts.', exercise: 'Take one angry episode and write the hot thoughts ("they did it on purpose", "they should..."). Look for other explanations and write a cooler thought.', practice: 'practice_thought_record' },
      { title: 'Assertive, not aggressive', aim: 'Say what you want without attacking.', exercise: 'Plan an assertive statement for a recurring frustration: describe the situation, how you feel, and what you would like, calmly and specifically.', practice: 'practice_control_your_response' },
      { title: 'Prevention plan', aim: 'Keep anger in check long term.', exercise: 'Write your triggers, early signs, and best strategies on a card. Look after sleep, stress and alcohol, which all lower the fuse.', practice: 'practice_examine_daily' },
    ],
    practices: ['practice_name_the_feeling', 'practice_care_for_the_body', 'practice_thought_record', 'practice_control_your_response'],
    ideas: ['ellis_abc_model', 'cannon_fight_or_flight', 'epictetus_up_to_us'],
  },
];

const byId = new Map(THERAPIES.map((t) => [t.id, t]));

export function therapy(id) {
  return byId.get(id) ?? null;
}
