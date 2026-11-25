// Branch: psychology, how minds work and how people change. Walk-only nodes (no `seq`) for the room "Psychology and
// the mind": ideas a reader can use to work out a problem or change a habit (beliefs, emotions, decisions, will),
// from James and Adler to Linehan and Dweck, each tied back to the older philosophy and religion it tests or
// restates, and two new practices (an if-then plan; naming the feeling).
// Public-domain passages (James 1890; Adler in the 1927 New York translation) verified word for word against
// fetched texts (Gutenberg, archive.org); everything in copyright is a labelled summary. Where a finding was later
// questioned (Mischel, Dweck, Prochaska, Pennebaker), the plain face says so.

export const nodes = [
  {
    id: 'james_attention_is_will',
    type: 'quote',
    field: 'science',
    thinker: 'William James',
    year: 1890,
    title: 'Will is attention: hold the hard idea before the mind',
    prompt: 'Think of something you know you should do and keep not doing. Is the hard part the doing, or keeping the thought of it in your head long enough?',
    plain_face:
      'Walking away from a fight is no harder for the legs than starting one. James said the struggle is in the head: when a strong feeling is on us, it crowds out every thought that does not fit it, and the wise idea flickers and goes out. So the work of the will is not a push of muscle but an act of attention, like keeping a match lit in the wind: hold the hard thought steady until it fills the mind, and the body follows.',
    source_face:
      'We have now brought things to a point at which we see that attention with effort is all that any case of volition implies. The essential achievement of the will, in short, when it is most \'voluntary,\' is to ATTEND to a difficult object and hold it fast before the mind.\n\n… Effort of attention is thus the essential phenomenon of will.\n\n… What constitutes the difficulty for a man laboring under an unwise passion of acting as if the passion were unwise? Certainly there is no physical difficulty. It is as easy physically to avoid a fight as to begin one, to pocket one\'s money as to squander it on one\'s cupidities, to walk away from as towards a coquette\'s door. The difficulty is mental; it is that of getting the idea of the wise action to stay before our mind at all.\n\n… The idea to be consented to must be kept from flickering and going out. It must be held steadily before the mind until it fills the mind.',
    source_citation: 'William James, The Principles of Psychology (New York: Henry Holt, 1890), vol. II, ch. XXVI "Will". James\'s italics are not reproduced; "ATTEND" is in capitals in the original.',
    source_url: 'https://www.gutenberg.org/ebooks/57634',
  },
  {
    id: 'adler_feeling_of_inferiority',
    type: 'quote',
    field: 'science',
    thinker: 'Alfred Adler',
    year: 1927,
    title: 'The feeling of inferiority is where every striving starts',
    prompt: 'What is something you have worked hardest at in your life? Was there a feeling of not being enough somewhere underneath it?',
    plain_face:
      'A seed under a paving stone grows sideways toward the light; the stone shapes the plant. Adler, who broke with Freud, said every life starts small and helpless among adults, and that feeling of not being enough is the push behind all our striving. It can make us brave and useful, or, if it is fed by ridicule and too-high demands, it bends into a hunger to dominate or a habit of giving up. His cure was encouragement and a sense of belonging; his followers called it the courage to be imperfect.',
    source_face:
      'Sooner or later every child becomes conscious of his inability to cope single-handed with the challenges of existence. This feeling of inferiority is the driving force, the starting point from which every childish striving originates. It determines how this individual child acquires peace and security in life, it determines the very goal of his existence, and prepares the path along which this goal may be reached.\n\n… Most of our errors in education begin at this point. In demanding more than the child can do, the idea of his own helplessness is thrown into his face.\n\n… Numerous children grow up in the constant dread of being laughed at. Ridicule of children is well-nigh criminal.',
    source_citation: 'Alfred Adler, Understanding Human Nature, trans. W. Béran Wolfe (New York: Greenberg, 1927), ch. V "The Feeling of Inferiority and the Striving for Recognition", pp. 70–71; German original Menschenkenntnis (Leipzig: Hirzel, 1927). The phrase "the courage to be imperfect" is his followers\' (Sofie Lazarsfeld, Rudolf Dreikurs), not his.',
    source_url: 'https://archive.org/details/understandinghum00adlerich',
  },
  {
    id: 'lewin_person_and_situation',
    type: 'concept',
    field: 'science',
    thinker: 'Kurt Lewin',
    year: 1936,
    title: 'Behaviour is a function of the person and the situation',
    prompt: 'Think of a habit you have tried to break by willpower alone. What in your surroundings keeps pulling you back to it?',
    plain_face:
      'A boat\'s course depends on the helmsman and on the wind and current at once; blame only the helmsman and you will never understand the voyage. Lewin wrote it as a formula, B = f(P, E): behaviour comes from the person and their environment together. To change what someone does, look at the whole field of forces pushing and holding them, and weaken the holding forces rather than only pushing harder. In his wartime studies, people who talked a change over and decided on it together kept to it better than those who were lectured.',
    source_face:
      'Summary (work under copyright): In Principles of Topological Psychology (1936) Lewin states that behaviour is a function of the person and the environment, B = f(P, E), and that the two must be treated as one "life space" or psychological field. In "Frontiers in Group Dynamics" (1947) he describes social change as a shift in a quasi-stationary equilibrium held in place by opposing forces, and suggests that a lasting change involves "unfreezing" the present level, moving to a new one, and "freezing" it there; his wartime experiments on food habits found that group discussion ending in a decision changed behaviour more than lectures did. Later scholars (Cummings, Bridgman and Brown, 2016) argue that the tidy "three-step model" was built by others from a few of his passages. The line "there is nothing so practical as a good theory" is from his Field Theory in Social Science (1951).',
    source_citation: 'Kurt Lewin, Principles of Topological Psychology (New York: McGraw-Hill, 1936); "Frontiers in Group Dynamics", Human Relations 1 (1947); Field Theory in Social Science, ed. Dorwin Cartwright (New York: Harper, 1951). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'festinger_cognitive_dissonance',
    type: 'concept',
    field: 'science',
    thinker: 'Leon Festinger',
    year: 1957,
    title: 'Cognitive dissonance: we bend beliefs to fit what we have done',
    prompt: 'Think of a choice you defend more fiercely than the evidence warrants. What would it cost you to admit it was a mistake?',
    plain_face:
      'A smoker who knows smoking kills has two thoughts that grind against each other like gears out of mesh. Festinger said the mind cannot leave that grinding alone: it either changes the act or, far more often, changes the belief ("my grandfather smoked and lived to ninety"). Paid a dollar to call a dull task fun, people came to rate it more enjoyable than those paid twenty, who had an excuse. Watch for the moment you start explaining away a fact; that is often where the real problem sits.',
    source_face:
      'Summary (work under copyright): A Theory of Cognitive Dissonance proposes that holding two cognitions that do not fit (a belief and an action, two beliefs) produces an unpleasant tension, dissonance, which people are motivated to reduce, by changing a behaviour, changing a belief, or adding new cognitions that justify the mismatch, and by avoiding information that would increase it. Dissonance is greater the more important the matter and the more freely the choice was made. After a decision, people inflate the merits of what they chose. In the experiment of Festinger and Carlsmith (1959), students paid $1 to tell another student a boring task was enjoyable later rated it as more enjoyable than students paid $20. In When Prophecy Fails (1956), he and colleagues observed a group whose predicted cataclysm did not come; some members responded by seeking converts more eagerly.',
    source_citation: 'Leon Festinger, A Theory of Cognitive Dissonance (Evanston, IL: Row, Peterson, 1957); Leon Festinger and James M. Carlsmith, "Cognitive Consequences of Forced Compliance", Journal of Abnormal and Social Psychology 58 (1959); Festinger, Henry W. Riecken and Stanley Schachter, When Prophecy Fails (1956). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'ellis_abc_model',
    type: 'concept',
    field: 'science',
    thinker: 'Albert Ellis',
    year: 1962,
    title: 'A, B, C: it is the belief about the event that makes the feeling',
    prompt: 'Recall the last time you were badly upset. Was it the thing that happened, or a "should" you told yourself about it?',
    plain_face:
      'A missed phone call is just a missed call; the panic comes from the sentence you add, "they must be angry with me". Ellis called this A, B, C: an Activating event, a Belief about it, and the emotional Consequence, which follows from B more than from A. He traced the idea to Epictetus. Rigid demands ("I must", "they should", "I can\'t stand it") turn disappointment into misery. You cannot always change A, but you can catch B, argue with it, and swap the "must" for a "would prefer".',
    source_face:
      'Summary (work under copyright): Reason and Emotion in Psychotherapy sets out Ellis\'s rational(-emotive) therapy, begun in 1955 after he abandoned psychoanalysis as too slow. Emotional disturbance, he argues, comes chiefly not from activating events (A) but from the beliefs (B) people hold about them, which produce the emotional and behavioural consequences (C). Disturbing beliefs are irrational: absolute demands and "musts" about oneself, others and the world, and the conviction that frustration is awful and unbearable. Ellis lists common irrational ideas (that one must be loved and approved by everyone, must be thoroughly competent at everything, and so on) and has the therapist actively dispute them; later writings add D (disputing) and E (the effective new outlook). He credits the Stoics, Epictetus above all, with the core insight that people are disturbed not by things but by their views of things.',
    source_citation: 'Albert Ellis, Reason and Emotion in Psychotherapy (New York: Lyle Stuart, 1962). The therapy was renamed rational emotive behaviour therapy (REBT) in the 1990s. Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'bowlby_ainsworth_attachment',
    type: 'concept',
    field: 'science',
    thinker: 'John Bowlby and Mary Ainsworth',
    year: 1969,
    title: 'Attachment: a secure base lets us explore',
    prompt: 'When things go badly, who do you turn to first, or do you turn to no one? Where did you learn that?',
    plain_face:
      'A climber dares the cliff because the rope is tied to someone at the bottom. Bowlby said a child\'s bond to a caregiver is that rope: not love bought with food, but a built-in need for a safe person, the "secure base" from which a child explores and to which it runs back when afraid. Ainsworth watched one-year-olds left briefly by their mothers and found patterns, secure, avoidant and anxious, that seem to colour how people later seek comfort. They are not fixed for life: good relationships can rewrite them.',
    source_face:
      'Summary (works under copyright): In Attachment (1969), the first volume of Attachment and Loss, Bowlby argues, against the psychoanalytic and learning-theory view that an infant loves its mother because she feeds it, that attachment is a separate, biologically based behavioural system that keeps a young child close to a protective figure. He draws on ethology (imprinting, Harlow\'s monkeys) and on studies of children separated from their parents. The child uses the attachment figure as a secure base for exploration and a haven in alarm, and forms "internal working models" of self and others. Mary Ainsworth\'s "Strange Situation" observations of infants briefly separated from and reunited with their mothers, published in Patterns of Attachment (1978), classified attachment as secure, anxious-avoidant or anxious-resistant, and linked security to the mother\'s sensitive responsiveness.',
    source_citation: 'John Bowlby, Attachment and Loss, vol. 1: Attachment (London: Hogarth Press, 1969); Mary D. Salter Ainsworth, Mary C. Blehar, Everett Waters and Sally Wall, Patterns of Attachment (Hillsdale, NJ: Erlbaum, 1978). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'mischel_delay_of_gratification',
    type: 'concept',
    field: 'science',
    thinker: 'Walter Mischel',
    year: 1972,
    title: 'The marshmallow test: waiting is a skill of attention, not a trait',
    prompt: 'What temptation do you lose to most often? When you lose, what are you looking at or thinking about just before?',
    plain_face:
      'A dieter who keeps the biscuit tin on the desk is fighting with one hand tied. Mischel left four-year-olds alone with one treat now or two if they waited. The waiters did not grit their teeth; they looked away, sang, or pictured the marshmallow as a cloud. Waiting was a trick of attention that could be taught. Later reports that waiters did better in life made the test famous, but a larger 2018 replication found that link much weaker once family background was counted. The lasting lesson is the tricks, not the verdict.',
    source_face:
      'Summary (work under copyright): Mischel, Ebbesen and Zeiss (1972) gave preschool children at Stanford\'s Bing Nursery School a choice between a smaller reward now and a larger one if they waited for the experimenter to return. Children waited far longer when the rewards were hidden, when they distracted themselves, or when they were told to think about the rewards\' abstract qualities rather than their tastiness; thinking about the treats themselves made waiting harder. Follow-ups (Shoda, Mischel and Peake, 1990) reported that longer waiting predicted later school results. A larger and more diverse replication (Watts, Duncan and Quan, 2018) found the link with age-15 achievement about half as strong, and much smaller again after controlling for family background and early ability. Mischel\'s The Marshmallow Test (2014) stresses that self-control strategies can be learned.',
    source_citation: 'Walter Mischel, Ebbe B. Ebbesen and Antonette Raskoff Zeiss, "Cognitive and Attentional Mechanisms in Delay of Gratification", Journal of Personality and Social Psychology 21 (1972); Yuichi Shoda, Walter Mischel and Philip K. Peake, Developmental Psychology 26 (1990); Tyler W. Watts, Greg J. Duncan and Haonan Quan, "Revisiting the Marshmallow Test", Psychological Science 29 (2018). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'bandura_self_efficacy',
    type: 'concept',
    field: 'science',
    thinker: 'Albert Bandura',
    year: 1977,
    title: 'Self-efficacy: believing you can is built by small wins',
    prompt: 'Is there something you have stopped trying because you are sure you would fail? When did you last actually test that?',
    plain_face:
      'Nobody learns to swim from a pep talk; you push off from the side, then a little further. Bandura found that whether people take on a hard task, and keep going when it bites, depends less on skill than on their belief that they can do it. That belief is built mainly by doing: small, real successes, each a little harder. Watching someone like you succeed helps, encouragement helps less, and a calmer body helps too. To change a habit, shrink the first step until success is likely.',
    source_face:
      'Summary (work under copyright): In "Self-efficacy: Toward a Unifying Theory of Behavioral Change" (1977), Bandura distinguishes outcome expectations (a given behaviour will lead to an outcome) from efficacy expectations (I can carry out that behaviour), and argues that the second largely decides whether people attempt a task, how much effort they spend and how long they persist against obstacles. Efficacy expectations come from four sources: performance accomplishments (the most dependable), vicarious experience of seeing others succeed, verbal persuasion, and the person\'s reading of their own physiological arousal. Treatments work, he proposes, by raising self-efficacy, which is why guided mastery (as in his work with people afraid of snakes) changed behaviour more than talk alone. Social Foundations of Thought and Action (1986) set this inside a broader social cognitive theory opposed to purely behaviourist accounts.',
    source_citation: 'Albert Bandura, "Self-efficacy: Toward a Unifying Theory of Behavioral Change", Psychological Review 84 (1977); Social Foundations of Thought and Action (Englewood Cliffs, NJ: Prentice-Hall, 1986). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'kahneman_tversky_loss_aversion',
    type: 'concept',
    field: 'science',
    thinker: 'Daniel Kahneman and Amos Tversky',
    year: 1979,
    title: 'Loss aversion: losing hurts more than winning pleases',
    prompt: 'Is there something you are holding on to (a job, a plan, a grudge) mainly because letting go would feel like losing?',
    plain_face:
      'Lose a twenty-pound note and the sting outlasts the pleasure of finding one. Kahneman and Tversky showed that people judge outcomes as gains or losses from where they stand now, not by where they end up, and that losses weigh more, roughly twice as much in later estimates. So we cling to the status quo, chase bad money with more, and choose differently when the same facts are framed as lives saved or lives lost. Some researchers now think the effect is narrower than once claimed. Still: ask what the choice looks like from a different starting point.',
    source_face:
      'Summary (work under copyright): "Prospect Theory: An Analysis of Decision under Risk" (1979) presents choice problems in which people\'s decisions systematically violate expected utility theory, and proposes an alternative. Outcomes are evaluated as gains and losses relative to a reference point, usually the current position, rather than as final states of wealth. The value function is concave for gains and convex for losses, and steeper for losses than for gains: "losses loom larger than gains". People are risk-averse for gains and risk-seeking for losses, overweight outcomes that are certain, and are influenced by how a problem is framed. Tversky and Kahneman\'s 1992 cumulative version estimated losses to weigh a little over twice as much as equal gains. Some later work (for example Gal and Rucker, 2018) argues that loss aversion is less general than often assumed.',
    source_citation: 'Daniel Kahneman and Amos Tversky, "Prospect Theory: An Analysis of Decision under Risk", Econometrica 47 (1979); Amos Tversky and Daniel Kahneman, "Advances in Prospect Theory", Journal of Risk and Uncertainty 5 (1992); David Gal and Derek D. Rucker, "The Loss of Loss Aversion", Journal of Consumer Psychology 28 (2018). Summary; the four-word phrase is the paper\'s.',
    source_url: null,
  },
  {
    id: 'prochaska_stages_of_change',
    type: 'concept',
    field: 'science',
    thinker: 'James Prochaska and Carlo DiClemente',
    year: 1983,
    title: 'Stages of change: people change in stages, not in one leap',
    prompt: 'Think of a change you keep saying you will make. Honestly, are you deciding whether to, or getting ready to, or already doing it?',
    plain_face:
      'You do not push a car that is still in park; first you have to shift the gear. Prochaska and DiClemente studied smokers who quit on their own and saw them move through stages: not yet thinking about it, thinking about it, preparing, acting, and keeping it up, often slipping back and going round again. Advice that suits one stage misfires in another: an action plan means nothing to someone still deciding. Critics say real people do not move in neat steps, but asking "which stage am I in?" is still a useful start.',
    source_face:
      'Summary (works under copyright): Prochaska and DiClemente (1983) compared smokers changing on their own at different points and described stages of self-change (precontemplation, contemplation, action and maintenance, with relapse common), each marked by heavier use of particular processes of change. The processes were drawn from rival therapies, hence "transtheoretical": consciousness raising, self-reevaluation, helping relationships, reinforcement management, stimulus control and others. In "In Search of How People Change" (1992), with Norcross, they added a preparation stage and described change as a spiral in which most people relapse and recycle through the stages before succeeding, arguing that interventions should be matched to a person\'s stage. Critics (for example Robert West, 2005) have argued that the stage boundaries are arbitrary and that stage-matched treatments do not reliably do better.',
    source_citation: 'James O. Prochaska and Carlo C. DiClemente, "Stages and Processes of Self-Change of Smoking", Journal of Consulting and Clinical Psychology 51 (1983); Prochaska, DiClemente and John C. Norcross, "In Search of How People Change", American Psychologist 47 (1992); Robert West, "Time for a Change", Addiction 100 (2005). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'pennebaker_expressive_writing',
    type: 'concept',
    field: 'science',
    thinker: 'James Pennebaker',
    year: 1986,
    title: 'Expressive writing: putting a hard thing into words',
    prompt: 'Is there something that happened to you that you have never told anyone in full? What do you imagine would happen if you wrote it down, just for yourself?',
    plain_face:
      'A drawer you cannot close because it is stuffed with crumpled papers: take them out, smooth them, fold them, and the drawer shuts. Pennebaker asked students to write for fifteen minutes on four days about the most upsetting thing in their lives, the facts and their deepest feelings together. Months later they had visited the health centre less than students who wrote about trivial things. Venting feelings alone did not do it; making a story did. Later studies found the benefit real but small on average.',
    source_face:
      'Summary (work under copyright): Pennebaker and Beall (1986) asked undergraduates to write for 15 minutes on four consecutive days either about a trivial topic or about a traumatic experience, writing about the facts only, the emotions only, or both. Those who wrote about both the facts and their emotions were more upset just after writing but made fewer visits to the student health centre in the following months. Pennebaker proposed that actively holding back thoughts and feelings about upsetting events is a strain, and that translating them into language helps people organise and understand them; later work found that people who benefited used more insight and causal words over the days of writing. A meta-analysis (Frattaroli, 2006) found a positive but small average effect across many studies.',
    source_citation: 'James W. Pennebaker and Sandra K. Beall, "Confronting a Traumatic Event: Toward an Understanding of Inhibition and Disease", Journal of Abnormal Psychology 95 (1986); James W. Pennebaker, Opening Up (New York: Morrow, 1990); Joanne Frattaroli, Psychological Bulletin 132 (2006). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'csikszentmihalyi_flow',
    type: 'concept',
    field: 'science',
    thinker: 'Mihaly Csikszentmihalyi',
    year: 1990,
    title: 'Flow: happiest when the challenge just fits the skill',
    prompt: 'When did you last lose track of time doing something hard? What were you doing, and what made it possible?',
    plain_face:
      'A tightrope that is too low is boring and one too high is terrifying; at the right height you forget yourself and just walk. Csikszentmihalyi paged people at random through their days and found they were happiest not resting but absorbed in something hard enough to stretch them: a clear goal, quick feedback, a challenge matched to their skill. In that state, "flow", worry and self-consciousness drop away. It turned up as often at work as in play, so the cure for a dull life may be a harder, clearer task, not more leisure.',
    source_face:
      'Summary (work under copyright): Drawing on interviews with climbers, chess players, dancers and surgeons (Beyond Boredom and Anxiety, 1975) and on the experience sampling method, in which people carrying pagers reported what they were doing and feeling at random moments, Flow describes "optimal experience": deep absorption in an activity with clear goals and immediate feedback, where the challenge matches the person\'s skills. Concentration is complete, self-consciousness vanishes, the sense of time alters, and the activity becomes worth doing for its own sake ("autotelic"). Too little challenge brings boredom; too much, anxiety. Csikszentmihalyi argues that people can learn to turn work and everyday tasks into flow activities, and that a life ordered by such goals is happier than one spent in passive leisure, which his samples found was often less enjoyable than work.',
    source_citation: 'Mihaly Csikszentmihalyi, Flow: The Psychology of Optimal Experience (New York: Harper & Row, 1990); Beyond Boredom and Anxiety (San Francisco: Jossey-Bass, 1975). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'linehan_radical_acceptance',
    type: 'concept',
    field: 'science',
    thinker: 'Marsha Linehan',
    year: 1993,
    title: 'Radical acceptance: accept what is, in order to change it',
    prompt: 'Is there something in your life you keep fighting that has already happened? What would change if you stopped arguing with the fact?',
    plain_face:
      'In a rip current, swimmers drown fighting straight back to shore; the ones who survive accept the current and swim across it. Linehan built dialectical behaviour therapy for people in desperate pain on that balance: total acceptance of what is, together with hard work to change it. "Radical acceptance" means accepting a fact all the way, with mind and body, not approving it. Refusing reality turns pain into suffering. She drew on her own Zen practice and taught skills: notice, name the feeling, ride the wave.',
    source_face:
      'Summary (works under copyright): Dialectical behaviour therapy (DBT), developed by Linehan for chronically suicidal people diagnosed with borderline personality disorder, rests on a dialectic between acceptance and change: standard cognitive-behavioural change techniques are balanced with validation of the patient and with acceptance skills taken from Zen practice. Patients learn four sets of skills: mindfulness (observing, describing and participating without judgement), distress tolerance, emotion regulation (including identifying and labelling emotions) and interpersonal effectiveness. Among the distress tolerance skills, radical acceptance is complete acceptance, from deep within, of reality as it is in the present moment, including facts one cannot change; acceptance is not approval, and refusing to accept reality turns pain into suffering. Linehan\'s randomised trials found DBT reduced suicidal behaviour and hospital stays.',
    source_citation: 'Marsha M. Linehan, Cognitive-Behavioral Treatment of Borderline Personality Disorder and Skills Training Manual for Treating Borderline Personality Disorder (New York: Guilford Press, 1993). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'gollwitzer_implementation_intentions',
    type: 'concept',
    field: 'science',
    thinker: 'Peter Gollwitzer',
    year: 1999,
    title: 'Implementation intentions: "if X, then I will Y"',
    prompt: 'What is a good intention you have had for months? Do you know exactly when and where you will next act on it?',
    plain_face:
      'A goal without a plan is a letter with no address: it means well and goes nowhere. Gollwitzer found that people who add one sentence to a goal, "if situation X arises, then I will do Y", follow through far more often than people with the goal alone. The plan hands control to the situation: when X turns up, you notice it and act almost without deciding, the way a habit runs. It helps most with the things that usually derail us: forgetting, missing the moment, or giving in to the first temptation.',
    source_face:
      'Summary (work under copyright): Gollwitzer distinguishes goal intentions ("I intend to reach Z") from implementation intentions, which specify when, where and how one will act ("If situation X is encountered, then I will perform behaviour Y"). Forming an implementation intention links an anticipated cue to a response in advance, so the cue becomes highly accessible and the response is triggered quickly, efficiently and without fresh deliberation: the control of action is delegated to the environment, a strategic form of automaticity. Experiments showed better rates of completing difficult goals, such as writing a report over the holidays, and better shielding of goals from distraction and unwanted habits. A later meta-analysis (Gollwitzer and Sheeran, 2006) found a medium-to-large average effect on goal attainment across 94 independent tests.',
    source_citation: 'Peter M. Gollwitzer, "Implementation Intentions: Strong Effects of Simple Plans", American Psychologist 54 (1999); Peter M. Gollwitzer and Paschal Sheeran, Advances in Experimental Social Psychology 38 (2006). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'dweck_mindsets',
    type: 'concept',
    field: 'science',
    thinker: 'Carol Dweck',
    year: 2006,
    title: 'Mindsets: is ability fixed, or can it grow?',
    prompt: 'When you fail at something, what do you conclude about yourself? Would you say the same about a friend who failed at it?',
    plain_face:
      'A muscle that hurts after training is growing, not failing. Dweck found that people who think ability is fixed treat a setback as a verdict and avoid hard tasks; people who think it can grow treat a setback as information and keep going. Her popular claim that teaching a "growth mindset" lifts results has been tested hard: large reviews find the effects small, mostly for struggling students, and much smaller than the hype. The modest version holds: how you explain a failure shapes what you try next.',
    source_face:
      'Summary (work under copyright): Building on her studies of how children respond to failure (beginning with Diener and Dweck\'s 1978 work on learned helplessness in schoolchildren), Dweck argues in Mindset that people hold implicit theories about ability. In a fixed mindset, ability is a set quantity that tasks reveal, so effort and failure are threatening; in a growth mindset, ability is developed through effort, strategy and help, so challenges are opportunities. The book applies the idea to school, sport, business and relationships. Later evidence is mixed: a meta-analysis by Sisk and colleagues (2018) found weak links between mindset and achievement and very small average effects of mindset interventions, while a large national experiment (Yeager and colleagues, 2019) found a short online intervention modestly raised grades among lower-achieving US secondary-school students.',
    source_citation: 'Carol S. Dweck, Mindset: The New Psychology of Success (New York: Random House, 2006); Victoria F. Sisk and others, Psychological Science 29 (2018); David S. Yeager and others, Nature 573 (2019). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'practice_if_then_plan',
    type: 'practice',
    field: 'practice',
    title: 'Make an if-then plan',
    plain_face: 'Pick one thing you keep meaning to do or stop doing. Decide the exact moment it will be tested, and write one sentence: "If that happens, then I will…" Let the moment do the remembering.',
  },
  {
    id: 'practice_name_the_feeling',
    type: 'practice',
    field: 'practice',
    title: 'Name the feeling',
    plain_face: 'When a strong feeling rises, stop and put a plain word to it: angry, ashamed, afraid, lonely. Naming it does not fix it, but it gives you a little room between the feeling and what you do next.',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // James on will
  { from: 'william_james_habit', to: 'james_attention_is_will', relation: 'extended', year: 1890, note: 'Same book: the habit chapter (vol. I, ch. IV) explains what runs without attention; the will chapter (vol. II, ch. XXVI) says the will is the attention we give to what does not.' },
  { from: 'spinoza_freedom_understanding_necessity', to: 'james_attention_is_will', relation: 'converged', note: 'Both put the mind\'s power over passion in what it holds in view rather than in force: Spinoza in understanding, James in steady attention to the wise idea.' },
  { from: 'james_attention_is_will', to: 'practice_control_your_response', relation: 'lands_on', note: 'James\'s version: when the feeling floods in, the work is to keep the calm thought in view long enough to act on it.' },
  { from: 'william_james_habit', to: 'practice_if_then_plan', relation: 'lands_on', note: 'James\'s third maxim of habit: "Seize the very first possible opportunity to act on every resolution you make" (Principles, ch. IV).' },

  // Adler
  { from: 'freud_pleasure_principle', to: 'adler_feeling_of_inferiority', relation: 'refuted', year: 1927, note: 'Adler left Freud\'s circle in 1911 and put the striving to overcome inferiority, not sexual pleasure, at the centre of the mind.' },
  { from: 'adler_feeling_of_inferiority', to: 'practice_invest_in_people', relation: 'lands_on', note: 'Adler\'s cure for discouragement was "social feeling": being useful to and connected with other people.' },

  // Lewin
  { from: 'lewin_person_and_situation', to: 'festinger_cognitive_dissonance', relation: 'taught', year: 1957, note: 'Festinger did his doctorate under Lewin at Iowa and followed him to MIT\'s Research Center for Group Dynamics; dissonance theory keeps Lewin\'s picture of the mind as a field of tensions seeking balance.' },
  { from: 'lewin_person_and_situation', to: 'gollwitzer_implementation_intentions', relation: 'extended', year: 1999, note: 'Gollwitzer\'s work on intentions descends from the German will-psychology of Ach and Lewin; Lewin had described an intention as a tension released when the fitting situation appears.' },
  { from: 'lewin_person_and_situation', to: 'prochaska_stages_of_change', relation: 'converged', note: 'Lewin\'s unfreeze-move-freeze and the stages of change both describe change as a sequence with a before and an after-care; the parallel is ours, as Prochaska and DiClemente built their stages from smokers\' reports.' },

  // Festinger
  { from: 'sartre_existence_precedes_essence', to: 'festinger_cognitive_dissonance', relation: 'converged', note: 'Sartre called hiding from one\'s own freedom behind excuses "bad faith"; Festinger measured the ordinary machinery of self-justification without reference to him.' },
  { from: 'festinger_cognitive_dissonance', to: 'kuhn_paradigm_shift', relation: 'converged', note: 'Both describe committed believers explaining away facts that do not fit, a person in Festinger and a scientific community in Kuhn; the parallel is ours.' },
  { from: 'festinger_cognitive_dissonance', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'The moment you start explaining away an awkward fact is the moment to ask what would change your mind.' },

  // Ellis
  { from: 'epictetus_up_to_us', to: 'ellis_abc_model', relation: 'extended', year: 1962, note: 'Ellis named Epictetus\'s line that people are disturbed not by things but by their opinions about them (Enchiridion 5) as the root of his therapy.' },
  { from: 'freud_pleasure_principle', to: 'ellis_abc_model', relation: 'refuted', year: 1962, note: 'Trained as a psychoanalyst, Ellis gave it up in the early 1950s as slow and passive, replacing the search for buried causes with direct argument against present beliefs.' },
  { from: 'adler_feeling_of_inferiority', to: 'ellis_abc_model', relation: 'extended', year: 1962, note: 'Ellis counted Adler, who held that a person\'s goals and opinions shape their feelings, among the forerunners of his therapy.' },
  { from: 'ellis_abc_model', to: 'beck_cognitive_therapy_stoicism_tested', relation: 'converged', note: 'Beck reached cognitive therapy in the early 1960s from his own research on depression, then found Ellis had arrived at much the same view; each later credited the other.' },
  { from: 'ellis_abc_model', to: 'practice_control_your_response', relation: 'lands_on', note: 'Write down A, the event, and B, the belief about it; only B is yours to argue with.' },

  // Bowlby and Ainsworth
  { from: 'freud_pleasure_principle', to: 'bowlby_ainsworth_attachment', relation: 'refuted', year: 1969, note: 'Bowlby, trained in psychoanalysis, rejected the view that a baby loves its mother as the source of food and satisfaction, and made attachment a need of its own.' },
  { from: 'ubuntu_person_through_persons', to: 'bowlby_ainsworth_attachment', relation: 'converged', note: 'A person becomes a person through other persons: Ubuntu says it of the community, attachment theory of the first bond. Independent, and the parallel is ours.' },
  { from: 'harvard_study_adult_development', to: 'bowlby_ainsworth_attachment', relation: 'converged', note: 'The Harvard Study found warm relationships the strongest predictor of a good old age; attachment theory says where the capacity for them begins.' },
  { from: 'bowlby_ainsworth_attachment', to: 'practice_invest_in_people', relation: 'lands_on', note: 'Security is made, and remade, in relationships: be someone else\'s secure base.' },

  // Mischel
  { from: 'freud_pleasure_principle', to: 'mischel_delay_of_gratification', relation: 'measured', year: 1972, note: 'Freud suggested that a child bears delay by picturing the wished-for object; Mischel\'s experiments found that thinking about the treat made waiting harder, and distraction made it easier.' },
  { from: 'james_attention_is_will', to: 'mischel_delay_of_gratification', relation: 'measured', year: 1972, note: 'James said the will is a matter of where attention is held; the preschoolers who waited were the ones who managed where they looked and what they thought about. The link is ours.' },
  { from: 'epicurus_absence_of_pain', to: 'mischel_delay_of_gratification', relation: 'converged', note: 'Epicurus advised passing over some pleasures for greater ones later (Letter to Menoeceus); Mischel studied how small children manage it.' },
  { from: 'mischel_delay_of_gratification', to: 'practice_if_then_plan', relation: 'lands_on', note: 'In The Marshmallow Test (2014) Mischel recommends if-then plans as a way to make self-control automatic.' },

  // Bandura
  { from: 'skinner_beyond_freedom', to: 'bandura_self_efficacy', relation: 'refuted', year: 1977, note: 'Bandura argued against purely behaviourist accounts: people learn by watching, and their beliefs about what they can do, not only reinforcement, govern what they attempt.' },
  { from: 'aristotle_friendship', to: 'bandura_self_efficacy', relation: 'converged', note: 'Aristotle held that we become brave by doing brave acts (Nicomachean Ethics II.1); Bandura found confidence is built the same way, by mastery. The link is ours.' },
  { from: 'bandura_self_efficacy', to: 'practice_if_then_plan', relation: 'lands_on', note: 'Make the "then" small enough to succeed at; each success adds to the belief that you can.' },

  // Kahneman and Tversky
  { from: 'buddha_craving_root_of_suffering', to: 'kahneman_tversky_loss_aversion', relation: 'converged', note: 'Clinging makes loss bitter: the Buddha diagnosed it, Kahneman and Tversky measured how much heavier a loss weighs than a gain.' },
  { from: 'brickman_lottery_winners', to: 'kahneman_tversky_loss_aversion', relation: 'converged', note: 'Published a year apart: both say we feel changes from where we stand, not levels of wealth or luck.' },
  { from: 'kahneman_tversky_loss_aversion', to: 'kahneman_peak_end', relation: 'extended', year: 1996, note: 'Kahneman went on from how we weigh choices to how we remember experiences, finding another gap between the two "selves".' },
  { from: 'kahneman_tversky_loss_aversion', to: 'practice_control_your_response', relation: 'lands_on', note: 'Whether something is a loss depends on the reference point you chose; try describing the same event from another one.' },

  // Prochaska and DiClemente
  { from: 'skinner_beyond_freedom', to: 'prochaska_stages_of_change', relation: 'extended', year: 1983, note: 'Among the processes of change the model gathers from rival therapies are reinforcement management and stimulus control, taken from behaviourism.' },
  { from: 'prochaska_stages_of_change', to: 'practice_if_then_plan', relation: 'lands_on', note: 'Someone in the preparation stage needs a specific plan; someone still deciding needs reasons first.' },

  // Pennebaker
  { from: 'freud_pleasure_principle', to: 'pennebaker_expressive_writing', relation: 'measured', year: 1986, note: 'Pennebaker tested the old idea of catharsis that runs back to Breuer and Freud\'s "talking cure": venting feelings alone did not help health; feelings joined to the facts in a story did.' },
  { from: 'seneca_evening_review', to: 'pennebaker_expressive_writing', relation: 'converged', note: 'Seneca reviewed each day in words before sleep; Pennebaker found that putting a hard experience into words, in private, does the body good.' },
  { from: 'pennebaker_expressive_writing', to: 'practice_name_the_feeling', relation: 'lands_on' },
  { from: 'pennebaker_expressive_writing', to: 'practice_examine_daily', relation: 'lands_on' },

  // Csikszentmihalyi
  { from: 'gita_act_without_attachment_to_fruits', to: 'csikszentmihalyi_flow', relation: 'converged', note: 'Act wholly, without an eye on the reward: the Gita\'s counsel describes much of what Csikszentmihalyi\'s subjects reported in flow.' },
  { from: 'marx_alienated_labor', to: 'csikszentmihalyi_flow', relation: 'converged', note: 'Marx said work stripped of skill and meaning deforms the worker; Csikszentmihalyi found that work with clear goals and a fitting challenge is where many people are happiest.' },
  { from: 'maslow_hierarchy', to: 'csikszentmihalyi_flow', relation: 'extended', year: 1990, note: 'Csikszentmihalyi took up Maslow\'s "peak experiences" and studied them in ordinary days with random sampling.' },
  { from: 'csikszentmihalyi_flow', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Linehan
  { from: 'dogen_just_sitting', to: 'linehan_radical_acceptance', relation: 'secularized', year: 1993, note: 'Linehan, a Zen practitioner, translated Zen acceptance and mindfulness into teachable skills inside a behavioural therapy.' },
  { from: 'shantideva_remedy_or_no_remedy', to: 'linehan_radical_acceptance', relation: 'converged', note: 'If it can be fixed, why be upset; if not, why be upset: Shantideva\'s verse is radical acceptance in two lines.' },
  { from: 'beck_cognitive_therapy_stoicism_tested', to: 'linehan_radical_acceptance', relation: 'extended', year: 1993, note: 'DBT began as cognitive-behavioural therapy; Linehan added acceptance and validation when change techniques alone drove her patients away.' },
  { from: 'linehan_radical_acceptance', to: 'practice_name_the_feeling', relation: 'lands_on', note: 'DBT\'s emotion-regulation skills begin with observing and naming the emotion.' },
  { from: 'linehan_radical_acceptance', to: 'practice_control_your_response', relation: 'lands_on' },

  // Gollwitzer
  { from: 'wang_yangming_unity_of_knowing_and_acting', to: 'gollwitzer_implementation_intentions', relation: 'converged', note: 'Wang said knowing not yet acted on is not yet knowing; Gollwitzer started from the gap between good intentions and action and found a way to close it.' },
  { from: 'gollwitzer_implementation_intentions', to: 'practice_if_then_plan', relation: 'lands_on' },

  // Dweck
  { from: 'seligman_learned_helplessness', to: 'dweck_mindsets', relation: 'extended', year: 1978, note: 'Dweck\'s research began with learned helplessness in schoolchildren (Diener and Dweck, 1978): why some children give up after failure and others try harder.' },
  { from: 'xunzi_human_nature_is_bad', to: 'dweck_mindsets', relation: 'converged', note: 'Xunzi held that goodness and ability are made by steady learning, as wood is straightened in a press; Dweck\'s growth mindset is the same bet about the self.' },
  { from: 'dweck_mindsets', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'Including beliefs about yourself: "I am no good at this" is a hypothesis, not a fact.' },

  // The practices
  { from: 'spinoza_freedom_understanding_necessity', to: 'practice_name_the_feeling', relation: 'lands_on', note: '"An emotion, which is a passion, ceases to be a passion, as soon as we form a clear and distinct idea thereof" (Ethics V, Prop. III, Elwes).' },
  { from: 'kabat_zinn_mbsr', to: 'practice_name_the_feeling', relation: 'lands_on' },
];
