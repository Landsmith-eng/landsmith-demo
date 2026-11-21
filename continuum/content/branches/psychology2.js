// Branch: psychology, second batch: the schools of psychology. Walk-only nodes (no `seq`) for the room "Psychology and
// the mind", filling the gaps between the schools already on the map so a reader can look at one problem through
// each school's eyes: psychoanalysis and its heirs (Freud, Anna Freud, Winnicott, Horney, Erikson), behaviourism
// (Thorndike, Watson, Wolpe, behavioural activation), development (Piaget, Vygotsky), cognitive therapy (Burns) and
// Kahneman's two systems, humanistic and existential therapy (Perls, Yalom), the third wave (ACT, self-compassion,
// MBCT), family systems (Bowen, Gottman), brief and narrative therapy, motivational interviewing, positive psychology
// (PERMA, self-determination, grit, broaden-and-build), social psychology (Asch, Zimbardo, Tajfel), and the body
// (Cannon, Selye); plus ten practices that carry the schools' methods as everyday exercises, never as treatment.
// The schools themselves, with what each looks for and does, are in content/schools.js.
// Public-domain passages (Freud in Hall's 1920 and Riviere's 1927 translations; Thorndike 1911; Watson 1913;
// Cannon 1915) verified word for word against fetched texts with scripts/verify-quotes.js; everything in copyright
// is a labelled summary. Where a finding was later questioned (Zimbardo, grit, the positivity ratio, priming,
// Gottman's predictions, Little Albert), the plain face says so.

export const nodes = [
  // Psychoanalysis and its heirs
  {
    id: 'freud_ego_not_master',
    type: 'quote',
    field: 'science',
    thinker: 'Sigmund Freud',
    year: 1917,
    title: 'The ego is not master in its own home',
    prompt: 'Think of something you did that surprised you: a slip of the tongue, a flash of anger, a choice you still cannot explain. Who decided?',
    plain_face:
      'A rider on a strong horse may think he is steering, when often he is going where the horse wants and calling it his plan. Freud said the conscious "I" is like that: much of what moves us goes on out of sight, and we learn of it only through slips, dreams and symptoms. He called this the third great blow to human pride, after Copernicus and Darwin. Much of his detailed theory has not survived testing, but the core claim, that a great deal of mental life runs outside awareness, is now mainstream.',
    source_face:
      'Humanity, in the course of time, has had to endure from the hands of science two great outrages against its naive self-love. The first was when humanity discovered that our earth was not the center of the universe, but only a tiny speck in a world-system hardly conceivable in its magnitude.\n\n… The second occurred when biological research robbed man of his apparent superiority under special creation, and rebuked him with his descent from the animal kingdom, and his ineradicable animal nature.\n\n… But the third and most irritating insult is flung at the human mania of greatness by present-day psychological research, which wants to prove to the "I" that it is not even master in its own home, but is dependent upon the most scanty information concerning all that goes on unconsciously in its psychic life.\n\n… in its relation to the id it is like a man on horseback, who has to hold in check the superior strength of the horse; with this difference, that the rider seeks to do so with his own strength while the ego uses borrowed forces. … Often a rider, if he is not to be parted from his horse, is obliged to guide it where it wants to go; so in the same way the ego constantly carries into action the wishes of the id as if they were its own.',
    source_citation: 'Sigmund Freud, A General Introduction to Psychoanalysis, trans. G. Stanley Hall (New York: Boni and Liveright, 1920), Eighteenth Lecture "General Theory of the Neuroses: Traumatic Fixation, the Unconscious" (lectures given in Vienna, 1915–17; Strachey later rendered the phrase "master in its own house"). The last paragraph: Freud, The Ego and the Id, trans. Joan Riviere (London: Hogarth Press, 1927), ch. II "The Ego and the Id"; German original 1923 (Gutenberg 79682).',
    source_url: 'https://www.gutenberg.org/ebooks/38219',
  },
  {
    id: 'anna_freud_defence_mechanisms',
    type: 'concept',
    field: 'science',
    thinker: 'Anna Freud',
    year: 1936,
    title: 'Defence mechanisms: how the mind keeps a painful feeling out of sight',
    prompt: 'When did your reaction to something last seem bigger than the thing itself? What might it have been protecting you from?',
    plain_face:
      'Someone furious with the boss comes home and snaps at the dog. Anna Freud, Sigmund\'s daughter, gathered the ways the mind shields itself from feelings it cannot bear: forgetting them (repression), seeing them in someone else (projection), acting their opposite (reaction formation), turning them on yourself, or putting them to good use (sublimation). Psychologists still find the idea useful, but particular mechanisms are hard to measure and the evidence is uneven. The everyday use: when a reaction seems too big, ask what it is guarding.',
    source_face:
      'Summary (work under copyright): In The Ego and the Mechanisms of Defence (1936; English translation 1937) Anna Freud turned psychoanalytic attention from the id to the ego and its ways of warding off anxiety. She gathered the defences described in her father\'s writings (among them regression, repression, reaction formation, isolation, undoing, projection, introjection, turning against the self, reversal and sublimation) and added others from her work with children, notably "identification with the aggressor" and a form of altruism in which a person lives out their own wishes through others. Defences, she argued, are normal and necessary as well as a source of symptoms; the analyst studies them as they show up in the session. George Vaillant later rated defences in the men of the Harvard Study of Adult Development and found "mature" ones (humour, altruism, sublimation, suppression) went with better lives (Adaptation to Life, 1977).',
    source_citation: 'Anna Freud, Das Ich und die Abwehrmechanismen (Vienna: Internationaler Psychoanalytischer Verlag, 1936); The Ego and the Mechanisms of Defence, trans. Cecil Baines (London: Hogarth Press, 1937); George E. Vaillant, Adaptation to Life (Boston: Little, Brown, 1977). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'winnicott_good_enough_mother',
    type: 'concept',
    field: 'science',
    thinker: 'Donald Winnicott',
    year: 1953,
    title: 'The good-enough mother: care that fails a little, in the right way',
    prompt: 'Where are you demanding perfection, of yourself as a parent, partner, friend or worker, when "good enough" would serve better?',
    plain_face:
      'Stabilisers that never come off leave a child who cannot ride. Winnicott, a paediatrician turned psychoanalyst, said a baby needs not a perfect mother but a "good-enough" one: closely in tune at first, then failing in small, bearable ways, so the child learns that the world is not run by its wishes and that it can cope. He also noticed the teddy or blanket that carries comfort from parent to world. His ideas came from clinical observation more than experiment; the lasting lesson is that perfect care is not the goal.',
    source_face:
      'Summary (work under copyright): In "Transitional Objects and Transitional Phenomena" (1953) Winnicott describes the first "not-me" possession, the blanket, rag or soft toy an infant clings to, as belonging to an intermediate area between inner fantasy and outer reality, the root of later play, art and religion. The "good enough mother" begins by adapting almost completely to her infant\'s needs and then adapts less and less as the infant becomes able to tolerate frustration; a mother who went on adapting perfectly would deprive the child of the chance to meet reality. Elsewhere he wrote of the "holding environment" and of a "false self" built to comply with others when care fails badly (1960). His views came from decades of paediatric and analytic practice rather than controlled study.',
    source_citation: 'D. W. Winnicott, "Transitional Objects and Transitional Phenomena", International Journal of Psycho-Analysis 34 (1953); "Ego Distortion in Terms of True and False Self" (1960), in The Maturational Processes and the Facilitating Environment (London: Hogarth Press, 1965). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'horney_tyranny_of_the_should',
    type: 'concept',
    field: 'science',
    thinker: 'Karen Horney',
    year: 1950,
    title: 'The tyranny of the should',
    prompt: 'Write down three "shoulds" you said to yourself this week. Whose voice are they in, and what happens inside you when you fall short of them?',
    plain_face:
      'Picture a sergeant inside you who never stops barking: you should be calmer, cleverer, more generous, never tired. Horney, a psychoanalyst who argued with Freud about women and culture, said anxious people build an idealised picture of who they ought to be and then drive themselves to match it. The shoulds feel like ideals but rule like a tyrant, and every shortfall turns into self-contempt. Her ideas came from her practice, not from trials, but they run straight into Ellis\'s "musts" and later research on self-compassion.',
    source_face:
      'Summary (work under copyright): In Neurosis and Human Growth (1950), Horney argues that a child who grows up anxious, without warmth and respect, loses touch with the "real self" and builds an "idealized image" of who they must be in order to feel safe and worthy. The person then pursues a "search for glory" and is ruled by inner dictates, which she calls "the tyranny of the should": demands to be perfectly honest, generous, wise, loving and untroubled, regardless of whether they are possible. Falling short brings self-hate. Earlier books (The Neurotic Personality of Our Time, 1937; Our Inner Conflicts, 1945) described neurotic strategies of moving toward, against or away from people, and argued, against Freud, that culture and relationships rather than biology shape these conflicts. Albert Ellis acknowledged her "shoulds" among the sources of his attack on "musts".',
    source_citation: 'Karen Horney, Neurosis and Human Growth: The Struggle Toward Self-Realization (New York: W. W. Norton, 1950), ch. 3 "The Tyranny of the Should"; The Neurotic Personality of Our Time (1937); Our Inner Conflicts (1945). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'erikson_eight_stages',
    type: 'concept',
    field: 'science',
    thinker: 'Erik Erikson',
    year: 1950,
    title: 'Eight stages of life, each with its own question',
    prompt: 'Which of Erikson\'s questions is your life asking most loudly right now: who am I, can I love, what will I leave behind, or was it worth it?',
    plain_face:
      'A house goes up floor by floor, and a weak floor makes the ones above it wobble. Erikson, trained by Anna Freud in Vienna, said a life goes up in stages too, each with a question to settle: can I trust the world, can I act on my own, who am I (he made "identity crisis" a household phrase), can I love, will I give something to those who come after, and, at the end, was it worth it? It is a map more than a tested law, and lives go less neatly, but it asks a good question: what is my stage asking of me now?',
    source_face:
      'Summary (work under copyright): In Childhood and Society (1950), in the chapter "Eight Ages of Man", Erikson extends Freud\'s stages of childhood across the whole life and recasts them in social terms. Each age turns on a crisis between two outcomes: basic trust versus mistrust, autonomy versus shame and doubt, initiative versus guilt, industry versus inferiority, identity versus role confusion, intimacy versus isolation, generativity versus stagnation, and ego integrity versus despair. Each resolution leaves a strength (hope, will, purpose, competence, fidelity, love, care, wisdom, in his later list) and prepares the next stage. Identity: Youth and Crisis (1968) developed the idea of the identity crisis. Erikson trained in psychoanalysis in Vienna, where Anna Freud was his analyst. Later researchers, including George Vaillant with the Harvard Study, used his stages; others argue they fit mid-century Western lives better than others.',
    source_citation: 'Erik H. Erikson, Childhood and Society (New York: W. W. Norton, 1950), ch. 7 "Eight Ages of Man"; Identity: Youth and Crisis (New York: Norton, 1968). Summary, not a quotation.',
    source_url: null,
  },

  // Behaviourism
  {
    id: 'thorndike_law_of_effect',
    type: 'quote',
    field: 'science',
    thinker: 'Edward Thorndike',
    year: 1911,
    title: 'The law of effect: what satisfies is stamped in',
    prompt: 'Pick a habit you would like to drop. What does it pay you, every time, within a few seconds?',
    plain_face:
      'A cat shut in a slatted box claws at everything until, by luck, it hits the latch and gets out to the fish. Put it back, and it gets out a little faster, then faster, until it goes straight to the latch. Thorndike, timing cats in puzzle boxes in the 1890s, said no flash of insight was needed: actions followed by satisfaction get "stamped in", and those followed by discomfort get "stamped out". Skinner built his science on it. The everyday use: notice what each habit pays you, because the payment keeps it alive.',
    source_face:
      'The cat that is clawing all over the box in her impulsive struggle will probably claw the string or loop or button so as to open the door. And gradually all the other non-successful impulses will be stamped out and the particular impulse leading to the successful act will be stamped in by the resulting pleasure, until, after many trials, the cat will, when put in the box, immediately claw the button or loop in a definite way.\n\n… The Law of Effect is that: Of several responses made to the same situation, those which are accompanied or closely followed by satisfaction to the animal will, other things being equal, be more firmly connected with the situation, so that, when it recurs, they will be more likely to recur; those which are accompanied or closely followed by discomfort to the animal will, other things being equal, have their connections with that situation weakened, so that, when it recurs, they will be less likely to occur. The greater the satisfaction or discomfort, the greater the strengthening or weakening of the bond.',
    source_citation: 'Edward L. Thorndike, Animal Intelligence: Experimental Studies (New York: Macmillan, 1911): ch. II "Animal Intelligence: An Experimental Study of the Associative Processes in Animals" (first published 1898), and ch. VI "Laws and Hypotheses for Behavior". Thorndike\'s italics are not reproduced.',
    source_url: 'https://www.gutenberg.org/ebooks/69904',
  },
  {
    id: 'watson_behaviorist_manifesto',
    type: 'quote',
    field: 'science',
    thinker: 'John B. Watson',
    year: 1913,
    title: 'Behaviourism: study what people do, not what they report',
    prompt: 'Think of a fear or habit you assume is just "how you are". Could it have been learned, and if so, when?',
    plain_face:
      'A doctor does not ask your liver how it feels; she measures what it does. Watson said psychology should work the same way: drop looking inward, study behaviour, and aim to predict and control it. In 1920 he and Rosalie Rayner taught a baby, "Little Albert", to fear a white rat by banging a steel bar behind him. It was one child, never properly repeated, and plainly unethical by today\'s standards. But the hopeful half of the idea lasted: a fear that was learned can be unlearned.',
    source_face:
      'Psychology as the behaviorist views it is a purely objective experimental branch of natural science. Its theoretical goal is the prediction and control of behavior. Introspection forms no essential part of its methods, nor is the scientific value of its data dependent upon the readiness with which they lend themselves to interpretation in terms of consciousness. The behaviorist, in his efforts to get a unitary scheme of animal response, recognizes no dividing line between man and brute. The behavior of man, with all of its refinement and complexity, forms only a part of the behaviorist\'s total scheme of investigation.',
    source_citation: 'John B. Watson, "Psychology as the Behaviorist Views It", Psychological Review 20, no. 2 (March 1913), p. 158, the opening paragraph. Little Albert: John B. Watson and Rosalie Rayner, "Conditioned Emotional Reactions", Journal of Experimental Psychology 3 (1920).',
    source_url: 'https://archive.org/details/sim_psychological-review_1913-03_20_2',
  },
  {
    id: 'wolpe_systematic_desensitisation',
    type: 'concept',
    field: 'science',
    thinker: 'Joseph Wolpe',
    year: 1958,
    title: 'Systematic desensitisation: approach the fear one step at a time',
    prompt: 'What do you avoid because it makes you anxious? What would the very smallest step towards it look like?',
    plain_face:
      'Nobody gets used to a cold sea by being thrown in the deep end; you go in to the ankles, then the knees. Wolpe, a South African psychiatrist, had anxious people relax deeply and then imagine a ladder of feared scenes, from mild to worst, climbing only when the rung below no longer frightened them. Later research found the relaxation mattered less than he thought: the key is facing the feared thing, step by step and without escaping, until the alarm dies down. Exposure is one of the best-supported methods in psychology.',
    source_face:
      'Summary (work under copyright): In Psychotherapy by Reciprocal Inhibition (1958) Wolpe argues, from experiments in which he produced and then removed "experimental neuroses" in cats, that anxiety is a learned response that can be weakened if a response incompatible with it, chiefly deep muscle relaxation (after Edmund Jacobson), is evoked in the presence of the anxiety-provoking stimulus. In systematic desensitisation the patient learns relaxation, builds a hierarchy of feared situations from least to most disturbing, and imagines each in turn while relaxed, moving up only when a scene no longer causes anxiety. Later dismantling studies suggested that repeated exposure to the feared situation, especially in real life, is the active ingredient, and exposure-based therapies became first-line treatments for phobias and anxiety disorders. Mary Cover Jones had already reduced a small boy\'s fear of a rabbit by gradual approach in 1924.',
    source_citation: 'Joseph Wolpe, Psychotherapy by Reciprocal Inhibition (Stanford, CA: Stanford University Press, 1958); Mary Cover Jones, "A Laboratory Study of Fear: The Case of Peter", Pedagogical Seminary 31 (1924). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'lewinsohn_behavioural_activation',
    type: 'concept',
    field: 'science',
    thinker: 'Peter Lewinsohn, later Neil Jacobson',
    year: 1974,
    title: 'Behavioural activation: act first, and the mood may follow',
    prompt: 'What did you used to enjoy, or find worthwhile, that has quietly dropped out of your weeks? What is the smallest piece of it you could do tomorrow?',
    plain_face:
      'Wait until you feel like going for a walk and you may wait all winter; the feeling tends to arrive on the way. Lewinsohn proposed that low mood deepens when life offers too few rewards: you withdraw, there is less to enjoy, so you withdraw more. The remedy was to schedule small, valued activities whatever the mood. In 1996 Jacobson\'s team found this piece alone did about as well as full cognitive therapy, and later trials largely agreed. Real depression needs a clinician; the everyday core is simple: do one small thing that matters.',
    source_face:
      'Summary (works under copyright): Lewinsohn (1974) proposed a behavioural account of depression: a low rate of "response-contingent positive reinforcement" (too few rewarding consequences of one\'s own actions, through lack of opportunities, skills or the loss of sources of reward) leads to low mood and withdrawal, which reduces reward further. Treatment included monitoring mood and activities and increasing pleasant activities. Jacobson and colleagues (1996) compared the full package of Beck\'s cognitive therapy with its behavioural-activation component alone and found the component did as well, at the end of treatment and at follow-up. Dimidjian and colleagues (2006) found behavioural activation comparable to antidepressant medication and better than cognitive therapy among more severely depressed patients; later trials (for example Richards and colleagues, 2016) found it about as effective as CBT and cheaper to deliver.',
    source_citation: 'Peter M. Lewinsohn, "A Behavioral Approach to Depression", in R. J. Friedman and M. M. Katz (eds.), The Psychology of Depression (Washington, DC: Winston, 1974); Neil S. Jacobson and others, Journal of Consulting and Clinical Psychology 64 (1996); Sona Dimidjian and others, Journal of Consulting and Clinical Psychology 74 (2006); David A. Richards and others, The Lancet 388 (2016). Summary, not a quotation.',
    source_url: null,
  },

  // Development
  {
    id: 'piaget_stages_of_thinking',
    type: 'concept',
    field: 'science',
    thinker: 'Jean Piaget',
    year: 1936,
    title: 'Children are not small adults: thinking is built in stages',
    prompt: 'Think of something you once believed firmly and then outgrew. What finally made the old idea stop working?',
    plain_face:
      'Pour juice from a short, wide glass into a tall, thin one in front of a four-year-old, and she will tell you there is more now. Piaget, watching his own and other children, said this is not ignorance but a different kind of thinking, which children build in stages by acting on the world and revising their ideas when they fail. Later research found children can do more, earlier, than his tests showed, and the stages are less tidy than he said. The core idea holds: we understand by building, not by soaking up.',
    source_face:
      'Summary (works under copyright): Beginning with The Origins of Intelligence in Children (French 1936) and his studies of his own three children, Piaget argued that knowledge is constructed by the child\'s activity: children assimilate experience to existing mental structures and accommodate those structures when they fail. Thinking develops through an invariant sequence of stages: sensorimotor (to about two years), preoperational, concrete operational (from about seven, when children "conserve" quantity across changes of shape) and formal operational (abstract, hypothetical reasoning from adolescence). He opposed both the empiricist view that the mind simply records experience and the view that knowledge is inborn. Later work (for example Margaret Donaldson\'s Children\'s Minds, 1978, and studies of infant cognition) showed that young children succeed at many tasks when they are put in familiar terms, and that development is less stage-like than he proposed.',
    source_citation: 'Jean Piaget, La naissance de l\'intelligence chez l\'enfant (Neuchâtel: Delachaux et Niestlé, 1936), trans. Margaret Cook as The Origins of Intelligence in Children (1952); Margaret Donaldson, Children\'s Minds (London: Fontana, 1978). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'vygotsky_zone_of_proximal_development',
    type: 'concept',
    field: 'science',
    thinker: 'Lev Vygotsky',
    year: 1934,
    title: 'The zone of proximal development: what you do with help today, you do alone tomorrow',
    prompt: 'What could you almost do, if someone a little ahead of you stood beside you? Who might that person be?',
    plain_face:
      'A child who cannot yet ride alone can ride with a parent\'s hand on the saddle; that gap is where the learning happens. Vygotsky, who died at 37 in the Soviet Union, said what a person can do with a more skilled helper today shows what they will soon do alone, and that thinking itself grows out of talk with others, turned inward as the voice we use to steer ourselves. The word "scaffolding" came later, from other researchers. His idea is a framework widely used in teaching more than a precisely tested law.',
    source_face:
      'Summary (works under copyright): In Thinking and Speech (1934) and in writings gathered in English as Mind in Society (1978), Vygotsky argues that higher mental functions arise first between people and are then internalised: speech used socially becomes "inner speech" with which the child plans and regulates its own behaviour (against Piaget\'s early view that children\'s self-talk is merely egocentric and fades away). The "zone of proximal development" is the distance between what a child can do alone and what it can do with guidance from an adult or a more capable peer; teaching, he held, should aim at that zone rather than at what the child can already do. The metaphor of "scaffolding" was introduced by Wood, Bruner and Ross (1976). Vygotsky died of tuberculosis in 1934, and his work was suppressed in the USSR for some years.',
    source_citation: 'L. S. Vygotsky, Myshlenie i rech\' (Thinking and Speech, Moscow, 1934); Mind in Society, ed. Michael Cole and others (Cambridge, MA: Harvard University Press, 1978); David Wood, Jerome S. Bruner and Gail Ross, Journal of Child Psychology and Psychiatry 17 (1976). Summary, not a quotation.',
    source_url: null,
  },

  // Cognitive
  {
    id: 'burns_cognitive_distortions',
    type: 'concept',
    field: 'science',
    thinker: 'David D. Burns',
    year: 1980,
    title: 'Thinking errors: the mind\'s favourite ways of misleading itself',
    prompt: 'Take the worst thing you said to yourself today. Is it all-or-nothing, mind-reading, fortune-telling, a label, or a "should"?',
    plain_face:
      'A funhouse mirror does not show nothing; it shows you, bent. Burns, who trained with Beck, wrote a popular book naming the usual bends in upset thinking: all-or-nothing, overgeneralising ("always", "never"), mind-reading, fortune-telling, labelling yourself, "should" statements, blowing things up or shrinking them. Spotting the bend by name makes it easier to straighten. Small trials found reading the book helped some people with mild to moderate depression; self-help works best with support, and is no substitute for care when things are serious.',
    source_face:
      'Summary (work under copyright): Feeling Good: The New Mood Therapy (1980) presents Aaron Beck\'s cognitive therapy for a general readership. Burns argues that moods are created by thoughts ("cognitions"), that depressed and anxious thinking is full of characteristic distortions, and that these can be identified and answered. His list of ten distortions includes all-or-nothing thinking, overgeneralisation, mental filter, disqualifying the positive, jumping to conclusions (mind-reading and fortune-telling), magnification and minimisation, emotional reasoning, "should" statements, labelling and personalisation. The main tool is a written record with columns for the automatic thought, the distortion and a rational response. In trials of "bibliotherapy" (for example Scogin and colleagues in the late 1980s and early 1990s), older adults with mild to moderate depression who read the book improved more than those on a waiting list.',
    source_citation: 'David D. Burns, Feeling Good: The New Mood Therapy (New York: William Morrow, 1980). Summary, not a quotation; the bibliotherapy trials are cited from memory.',
    source_url: null,
  },
  {
    id: 'kahneman_two_systems',
    type: 'concept',
    field: 'science',
    thinker: 'Daniel Kahneman',
    year: 2011,
    title: 'Thinking, fast and slow: two systems in one head',
    prompt: 'What judgement did you make today in a second that might deserve a minute? What would the slow version have asked?',
    plain_face:
      'An experienced driver can chat on an empty road, but goes quiet to merge across busy lanes. Kahneman described the mind as two systems: a fast one that answers at once, from habit and impression, and a slow one that does careful work but tires and is easily skipped. Many errors he and Tversky studied come from a fast answer going unchecked. He later admitted that one chapter, on "priming", leaned on studies that failed to replicate. The core advice survives: when it matters, slow the answer down.',
    source_face:
      'Summary (work under copyright): Thinking, Fast and Slow (2011) gathers decades of research, much of it with Amos Tversky, under the device of two "systems" (terms borrowed from Keith Stanovich and Richard West). System 1 operates automatically and quickly, with little effort and no sense of voluntary control; System 2 allocates attention to effortful mental activities and is lazy, often endorsing System 1\'s answers without checking. The book traces heuristics and biases (anchoring, availability, substitution of an easier question), overconfidence, prospect theory, and the gap between the "experiencing" and "remembering" selves. In 2017, responding to a critique of the studies cited in its chapter on priming, Kahneman wrote that he had placed too much faith in underpowered studies.',
    source_citation: 'Daniel Kahneman, Thinking, Fast and Slow (New York: Farrar, Straus and Giroux, 2011); Kahneman\'s 2017 comment on the "Replicability-Index" blog post on the priming chapter. Summary, not a quotation.',
    source_url: null,
  },

  // Humanistic and existential
  {
    id: 'perls_gestalt_here_and_now',
    type: 'concept',
    field: 'science',
    thinker: 'Fritz and Laura Perls, with Paul Goodman',
    year: 1951,
    title: 'Gestalt therapy: what are you feeling, here and now?',
    prompt: 'Say out loud what you are feeling right now, and what your hands and shoulders are doing. What were you about to explain instead?',
    plain_face:
      'You can read every review of a meal and still not know its taste until you eat it. Fritz Perls, a former psychoanalyst, wanted clients to stop explaining their lives and notice them: what you feel now, what your body is doing, what you are avoiding saying. In his "empty chair" a client speaks to an absent person, or to a part of themselves, then answers back. Perls could be harsh and showy, and the therapy was little tested in his day; later emotion-focused researchers studied chair work more carefully and found it can help.',
    source_face:
      'Summary (work under copyright): Gestalt Therapy: Excitement and Growth in the Human Personality (1951), by Frederick Perls, Ralph Hefferline and Paul Goodman, with Laura Perls a co-founder of the approach, draws on Gestalt psychology\'s study of perception (the whole figure against its ground), on phenomenology and on psychoanalysis, which Perls had practised. It holds that health is full awareness and contact in the present, and that neurosis is a pattern of interrupting contact (taking in others\' rules unexamined, projecting, deflecting). The therapist attends to how the client speaks and moves rather than to the history, and uses experiments such as speaking in the present tense, owning statements with "I", and dialogues between parts of the self or with an absent person in an empty chair. Leslie Greenberg and colleagues later studied two-chair and empty-chair work within emotion-focused therapy and reported benefits for self-criticism and "unfinished business".',
    source_citation: 'Frederick S. Perls, Ralph F. Hefferline and Paul Goodman, Gestalt Therapy (New York: Julian Press, 1951); Leslie S. Greenberg and others on chair work in emotion-focused therapy (1990s–2000s). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'yalom_four_givens',
    type: 'concept',
    field: 'science',
    thinker: 'Irvin Yalom',
    year: 1980,
    title: 'Four givens: death, freedom, isolation and meaninglessness',
    prompt: 'Which of the four givens, death, freedom, being alone in your own experience, or the lack of a ready-made meaning, does your present worry circle around?',
    plain_face:
      'Every house sits on ground the builder did not choose. Yalom, a Stanford psychiatrist, said every life sits on four givens: we will die; we are free, and so responsible; we are finally alone inside our own experience; and no meaning comes ready-made. Much anxiety, he thought, is a way of dodging one of them, and facing them squarely can be oddly freeing. Existential therapy has had few controlled trials, so the evidence for it as a treatment is thin; its questions are the oldest in philosophy.',
    source_face:
      'Summary (work under copyright): Existential Psychotherapy (1980) organises a therapy around four "ultimate concerns" that are part of every human existence: death, freedom (and with it responsibility and the burden of choosing), existential isolation (the unbridgeable gap between oneself and any other being) and meaninglessness. Conflict arises from confronting these givens, and many symptoms are defences against the anxiety they cause; the therapist helps the patient face them, take responsibility and choose. Yalom draws on Kierkegaard, Nietzsche, Heidegger, Sartre and Camus, and on the therapists Rollo May and Viktor Frankl. He wrote that existential therapy is a way of thinking that can inform other therapies rather than a separate school with its own techniques. Controlled trials of existential therapies are few and small.',
    source_citation: 'Irvin D. Yalom, Existential Psychotherapy (New York: Basic Books, 1980). Summary, not a quotation.',
    source_url: null,
  },

  // The third wave
  {
    id: 'hayes_acceptance_and_commitment',
    type: 'concept',
    field: 'science',
    thinker: 'Steven C. Hayes',
    year: 1999,
    title: 'Acceptance and commitment: make room for the feeling, move toward what matters',
    prompt: 'What have you been waiting to stop feeling before you act? What would you do this week if the feeling came along for the ride?',
    plain_face:
      'Thrashing in quicksand makes you sink faster; lying back and spreading out lets you float. Hayes said much suffering comes from fighting our own thoughts and feelings. ACT teaches people to notice a thought as a thought ("I\'m having the thought that I\'m a failure") rather than a fact, to make room for discomfort, and to take small steps toward what they value. Trials find it works about as well as standard CBT for many problems, not better, and some early claims for its theory ran ahead of the evidence.',
    source_face:
      'Summary (work under copyright): Acceptance and Commitment Therapy (1999), by Hayes, Kirk Strosahl and Kelly Wilson, grows out of behaviour analysis and the authors\' "relational frame theory" of language. It holds that suffering is amplified by "experiential avoidance" (attempts to escape or control unwanted thoughts, feelings and sensations) and by "cognitive fusion" (taking thoughts literally, as the things they describe). Its six processes are acceptance, cognitive defusion, contact with the present moment, the self as the context of experience, values, and committed action. Defusion exercises include prefacing a thought with "I\'m having the thought that…" or repeating a word until it loses its sense. Meta-analyses (for example A-Tjak and colleagues, 2015) find ACT more effective than waiting lists and usual care and about as effective as established treatments such as CBT.',
    source_citation: 'Steven C. Hayes, Kirk D. Strosahl and Kelly G. Wilson, Acceptance and Commitment Therapy: An Experiential Approach to Behavior Change (New York: Guilford, 1999); Jacqueline G. L. A-Tjak and others, Psychotherapy and Psychosomatics 84 (2015). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'neff_self_compassion',
    type: 'concept',
    field: 'science',
    thinker: 'Kristin Neff',
    year: 2003,
    title: 'Self-compassion: speak to yourself as you would to a friend',
    prompt: 'What did you call yourself the last time you failed? Would you say it to a friend in the same spot?',
    plain_face:
      'If a friend failed an exam you would not tell her she is worthless; you would sit with her, then help her plan the next try. Neff, drawing on Buddhist teaching, defined self-compassion as three things: kindness to yourself instead of harsh judgement, seeing failure as part of being human rather than proof you are alone, and noticing pain without drowning in it. Studies link it with less anxiety and depression and, against the fear that it breeds laziness, with more willingness to try again. Much of the evidence is correlational.',
    source_face:
      'Summary (works under copyright): In two 2003 papers Neff defined self-compassion, drawing on Buddhist thought, as three related components, each set against its opposite: self-kindness versus self-judgement, a sense of common humanity versus isolation, and mindfulness versus over-identification with painful thoughts and feelings; she also published a Self-Compassion Scale to measure it. She distinguished it from self-esteem, which depends on comparison and success. Later studies associate self-compassion with lower anxiety and depression, and some experiments (for example Breines and Chen, 2012) found that a self-compassionate frame after failure increased people\'s motivation to improve. A randomised trial of the Mindful Self-Compassion programme she developed with Christopher Germer (2013) reported gains in self-compassion and well-being. Critics note that much of the evidence is correlational and that the scale\'s structure is debated.',
    source_citation: 'Kristin D. Neff, "Self-Compassion: An Alternative Conceptualization of a Healthy Attitude Toward Oneself" and "The Development and Validation of a Scale to Measure Self-Compassion", Self and Identity 2 (2003); Juliana G. Breines and Serena Chen, Personality and Social Psychology Bulletin 38 (2012); Neff and Germer, Journal of Clinical Psychology 69 (2013). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'segal_williams_teasdale_mbct',
    type: 'concept',
    field: 'science',
    thinker: 'Zindel Segal, Mark Williams and John Teasdale',
    year: 2002,
    title: 'Mindfulness-based cognitive therapy: step out of the spiral before it starts',
    prompt: 'When your mood dips a little, what thoughts tend to show up next? Could you watch them arrive, the way you would watch weather?',
    plain_face:
      'A path worn across a lawn is easy to slip back onto; the trick is noticing your feet turning that way. Segal, Williams and Teasdale saw that in people who had recovered from depression, a small dip in mood could wake the old gloomy thinking and pull them back down. They joined Kabat-Zinn\'s mindfulness course to cognitive therapy, teaching people to see thoughts as passing events, not facts. Trials found it cut the risk of relapse, mainly for people with three or more past episodes. It is not a cure-all.',
    source_face:
      'Summary (works under copyright): Mindfulness-Based Cognitive Therapy for Depression (2002) describes an eight-week group programme for people in remission from recurrent depression, combining the mindfulness practices of Kabat-Zinn\'s stress-reduction course with elements of cognitive therapy. The rationale: in people who have been depressed, mild sad moods can reactivate patterns of negative thinking that escalate into relapse; mindfulness trains a "decentred" stance in which thoughts are seen as mental events rather than truths, and a shift from a "doing" to a "being" mode of mind. In the first trial (Teasdale and colleagues, 2000) MBCT roughly halved relapse over a year among patients with three or more previous episodes, but not among those with two. An individual-patient meta-analysis (Kuyken and colleagues, 2016) found MBCT reduced the risk of relapse compared with usual care.',
    source_citation: 'Zindel V. Segal, J. Mark G. Williams and John D. Teasdale, Mindfulness-Based Cognitive Therapy for Depression (New York: Guilford, 2002); John D. Teasdale and others, Journal of Consulting and Clinical Psychology 68 (2000); Willem Kuyken and others, JAMA Psychiatry 73 (2016). Summary, not a quotation.',
    source_url: null,
  },

  // Systems and relationships
  {
    id: 'bowen_family_systems',
    type: 'concept',
    field: 'science',
    thinker: 'Murray Bowen',
    year: 1978,
    title: 'Family systems: you can change only your own part in the dance',
    prompt: 'When there is tension in your family or team, who gets pulled in as the third person, and what part do you usually play?',
    plain_face:
      'Touch one piece of a hanging mobile and every piece moves. Bowen said a family works like that: anxiety travels round it, people settle into fixed roles, and two who are at odds will pull in a third, often a child, to steady things, which he called a triangle. His aim was "differentiation": staying calm and yourself while still connected, instead of being swept up in the family\'s mood or cutting it off. His theory came from clinical observation and is hard to test, but its picture of repeating patterns is still widely used.',
    source_face:
      'Summary (work under copyright): From a research project at the US National Institute of Mental Health in the 1950s, in which whole families of patients with schizophrenia lived on the ward, Bowen developed a theory of the family as an emotional unit. Its concepts include differentiation of self (the ability to keep one\'s own thinking and feeling distinct while staying in contact with others), triangles (a two-person relationship under strain draws in a third), the nuclear family emotional process, the family projection process, multigenerational transmission, emotional cutoff and sibling position. Change, he held, comes from one member raising their own level of differentiation, which changes the system, rather than from trying to change the others. His papers are collected in Family Therapy in Clinical Practice (1978). Empirical tests of the theory are limited and mostly correlational.',
    source_citation: 'Murray Bowen, Family Therapy in Clinical Practice (New York: Jason Aronson, 1978). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'gottman_four_horsemen',
    type: 'concept',
    field: 'science',
    thinker: 'John Gottman',
    year: 1994,
    title: 'The four horsemen: what to watch for in a quarrel',
    prompt: 'In your last argument with someone close, which came out: criticism, contempt, defensiveness or stonewalling? What would the gentler version have been?',
    plain_face:
      'A cough is usually nothing, but some coughs are worth a doctor. Gottman videotaped couples arguing and said conflict itself does not doom a relationship; four habits do: criticising the person rather than the act, contempt, defensiveness, and stonewalling. Contempt was the worst. The antidotes are a gentle start, appreciation, owning some of the problem, and calming down before going on. His claims to predict divorce with over 90 per cent accuracy were fitted after the fact and are disputed; the four signs are still a useful mirror.',
    source_face:
      'Summary (work under copyright): In Why Marriages Succeed or Fail (1994), drawing on laboratory studies with Robert Levenson in which couples\' conversations and physiology were recorded, Gottman argues that what distinguishes couples who stay together is not the absence of conflict but the ratio of positive to negative interactions during it and the presence of four corrosive patterns, the "Four Horsemen of the Apocalypse": criticism, contempt, defensiveness and stonewalling, with contempt the most damaging. Later work named antidotes (a gentle start-up, building a culture of appreciation, taking responsibility, physiological self-soothing). Studies by his group reported predicting divorce with very high accuracy; critics (for example Heyman and Slep, 2001) pointed out that these figures came from models fitted to the same data rather than tested on new couples.',
    source_citation: 'John Gottman with Nan Silver, Why Marriages Succeed or Fail (New York: Simon & Schuster, 1994); Richard E. Heyman and Amy M. Smith Slep, Journal of Marriage and Family 63 (2001). Summary, not a quotation.',
    source_url: null,
  },

  // Brief and narrative therapy
  {
    id: 'de_shazer_berg_miracle_question',
    type: 'concept',
    field: 'science',
    thinker: 'Steve de Shazer and Insoo Kim Berg',
    year: 1988,
    title: 'The miracle question: start from the solution, not the problem',
    prompt: 'Suppose that tonight, while you sleep, the problem you are working on is solved. What is the first small thing you would notice tomorrow?',
    plain_face:
      'A sailor who studies only the leak may never notice the island ahead. De Shazer and Berg, at a family clinic in Milwaukee, stopped digging into the causes of problems and asked instead: suppose a miracle happened tonight and the problem was gone; what would you notice tomorrow? Then: when does a little of that already happen, and how do you do it? Therapy was short and built on what already worked. Reviews find modest benefits, similar to other talking therapies, from studies of mixed quality.',
    source_face:
      'Summary (works under copyright): At the Brief Family Therapy Center in Milwaukee, founded in 1978, de Shazer, Berg and colleagues developed solution-focused brief therapy. Instead of analysing a problem\'s causes, the therapist helps the client describe a preferred future and find "exceptions", times when the problem is absent or smaller, and asks the client to do more of what works. Characteristic tools include the "miracle question" (if a miracle happened overnight and the problem were solved, how would you know?), scaling questions ("on a scale of 0 to 10, where are you now?") and compliments on existing strengths; therapy is often a handful of sessions. De Shazer set out the approach in Keys to Solution in Brief Therapy (1985) and Clues (1988), and later drew on Wittgenstein\'s philosophy of language (Words Were Originally Magic, 1994). Systematic reviews report small to moderate effects from studies of variable quality.',
    source_citation: 'Steve de Shazer, Keys to Solution in Brief Therapy (New York: Norton, 1985); Clues: Investigating Solutions in Brief Therapy (New York: Norton, 1988); Words Were Originally Magic (New York: Norton, 1994); Insoo Kim Berg and others. Summary, not a quotation; the date the miracle question was first used is uncertain.',
    source_url: null,
  },
  {
    id: 'white_epston_narrative_therapy',
    type: 'concept',
    field: 'science',
    thinker: 'Michael White and David Epston',
    year: 1990,
    title: 'Narrative therapy: the person is not the problem; the problem is the problem',
    prompt: 'Give your problem a name, as if it were a character. What tricks does it use on you, and when have you got the better of it?',
    plain_face:
      'Tell someone "you are a mess" and they are stuck; say "the mess has been winning lately" and there is a fight to join. White and Epston, in Australia and New Zealand, helped people speak of a problem as a separate thing with its own tactics, recall times they had resisted it, and build a new story of their lives from those times. They drew on Foucault\'s ideas about whose stories count. The research is thinner than for CBT, mostly small studies, but the move of "externalising" is widely borrowed.',
    source_face:
      'Summary (work under copyright): In Narrative Means to Therapeutic Ends (1990), White, of the Dulwich Centre in Adelaide, and Epston, of Auckland, propose that people make sense of their lives through stories, and that problems persist when a "problem-saturated" story crowds out experiences that do not fit it. The therapist "externalises" the problem, talking about it as an entity separate from the person (the authors\' slogan, as later stated, is that "the person is not the problem; the problem is the problem"), maps its influence, and searches for "unique outcomes", times the person resisted it, from which an alternative story is built; letters and certificates from the therapist reinforce the new story. The authors draw on Michel Foucault on the power of dominant knowledges. Outcome research is limited, mostly small and uncontrolled studies.',
    source_citation: 'Michael White and David Epston, Narrative Means to Therapeutic Ends (New York: Norton, 1990). Summary, not a quotation; the slogan is a widely quoted summary of the approach, not a sentence cited from the book.',
    source_url: null,
  },

  // Motivational interviewing
  {
    id: 'miller_rollnick_motivational_interviewing',
    type: 'concept',
    field: 'science',
    thinker: 'William R. Miller and Stephen Rollnick',
    year: 1991,
    title: 'Motivational interviewing: help people hear their own reasons to change',
    prompt: 'About a change you keep putting off: what are your own reasons for it, not anyone else\'s? Say them in your own words.',
    plain_face:
      'Push someone toward a door and they lean back; ask what is on the other side and they may walk through. Miller noticed that arguing with heavy drinkers made them defend their drinking. Motivational interviewing instead asks open questions, reflects back what people say, and draws out their own reasons for change, without lecturing. Many trials, above all on alcohol, find small to moderate benefits that vary a great deal with the counsellor. It is a way of talking, and it works on the voice in your own head too.',
    source_face:
      'Summary (works under copyright): Miller described motivational interviewing with problem drinkers in 1983, and with Rollnick set it out in Motivational Interviewing: Preparing People to Change Addictive Behavior (1991). Rather than confronting "denial", which tends to provoke resistance, the counsellor expresses empathy, develops the discrepancy between the person\'s present behaviour and their goals, "rolls with resistance" and supports self-efficacy; skills include open questions, affirmations, reflective listening and summaries. The aim is to evoke the person\'s own "change talk", their reasons, desire, ability and need to change. The approach takes Carl Rogers\'s client-centred stance and adds a direction. Meta-analyses find small to moderate effects, strongest for alcohol use, with large differences between counsellors and sites. Miller and Rose (2015) cautioned that a neutral "decisional balance" exercise can lower commitment in people who are ambivalent.',
    source_citation: 'William R. Miller, "Motivational Interviewing with Problem Drinkers", Behavioural Psychotherapy 11 (1983); William R. Miller and Stephen Rollnick, Motivational Interviewing (New York: Guilford, 1991); William R. Miller and Gary S. Rose, "Motivational Interviewing and Decisional Balance", Behavioural and Cognitive Psychotherapy 43 (2015). Summary, not a quotation.',
    source_url: null,
  },

  // Positive psychology and motivation
  {
    id: 'seligman_perma',
    type: 'concept',
    field: 'science',
    thinker: 'Martin Seligman',
    year: 2011,
    title: 'PERMA: well-being is more than feeling good',
    prompt: 'Of positive feeling, absorption, good relationships, meaning and achievement, which is thinnest in your life right now?',
    plain_face:
      'A good garden is not one where nothing is wrong; it is one where things grow. Seligman, who launched "positive psychology" in 1998, said well-being has five strands: Positive emotion, Engagement, Relationships, Meaning and Accomplishment. Each can be built, and none alone is enough. Critics note that measures of the five overlap heavily with plain life satisfaction, and that school programmes built on the idea show small or short-lived effects. As a checklist for a life that has gone flat, it still serves.',
    source_face:
      'Summary (work under copyright): In Flourish (2011), Seligman revises the "authentic happiness" theory of his earlier book (2002), which centred on life satisfaction, and proposes that well-being is a construct with five measurable elements, each pursued for its own sake: positive emotion, engagement (absorption or flow), positive relationships, meaning (belonging to and serving something larger than the self), and accomplishment. As president of the American Psychological Association in 1998 he had called for a "positive psychology" studying strengths and flourishing as well as illness. The book describes interventions such as writing down three good things each day and a gratitude visit, and school and army resilience programmes. Critics have argued that the PERMA elements are highly correlated with one another and with subjective well-being (Goodman and colleagues, 2018), and evaluations of school programmes found small effects that faded.',
    source_citation: 'Martin E. P. Seligman, Flourish (New York: Free Press, 2011); Authentic Happiness (2002); Fallon J. Goodman and others, Journal of Positive Psychology 13 (2018). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'deci_ryan_self_determination',
    type: 'concept',
    field: 'science',
    thinker: 'Edward Deci and Richard Ryan',
    year: 1985,
    title: 'Self-determination: we thrive on autonomy, competence and connection',
    prompt: 'Think of something you do only because you are made to. Is there any part of it you could make your own?',
    plain_face:
      'Pay a child to read and she may stop reading when the payments stop. In 1971 Deci found that rewards can crowd out the pleasure people take in a task. With Ryan he built self-determination theory: people flourish when three needs are met, feeling that their actions are their own, feeling capable, and feeling connected to others. Control, threats and pressure undermine all three. The theory rests on many studies, though how much rewards harm motivation depends on the kind of reward, and has been argued over for decades.',
    source_face:
      'Summary (works under copyright): Deci (1971) found that students paid to solve puzzles spent less of their free time on them afterwards than unpaid students, suggesting that external rewards can undermine intrinsic motivation. In Intrinsic Motivation and Self-Determination in Human Behavior (1985), Deci and Ryan set out self-determination theory: motivation ranges from controlled (by rewards, punishments, guilt) to autonomous (from interest or personally endorsed values), and well-being and persistence depend on satisfying three basic psychological needs, for autonomy, competence and relatedness. Ryan and Deci (2000) summarised the evidence across education, work, health and sport. The undermining effect was disputed in a long exchange of meta-analyses (Cameron and Pierce, 1994; Deci, Koestner and Ryan, 1999), which agreed that expected, tangible rewards tied to doing a task are the ones most likely to undermine interest.',
    source_citation: 'Edward L. Deci, Journal of Personality and Social Psychology 18 (1971); Edward L. Deci and Richard M. Ryan, Intrinsic Motivation and Self-Determination in Human Behavior (New York: Plenum, 1985); Richard M. Ryan and Edward L. Deci, American Psychologist 55 (2000); Judy Cameron and W. David Pierce, Review of Educational Research 64 (1994); Edward L. Deci, Richard Koestner and Richard M. Ryan, Psychological Bulletin 125 (1999). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'duckworth_grit',
    type: 'concept',
    field: 'science',
    thinker: 'Angela Duckworth',
    year: 2007,
    title: 'Grit: passion and perseverance for long-term goals, and the doubts',
    prompt: 'Is there one long goal you keep starting over on? Is the problem staying with it, or that it was never the right goal?',
    plain_face:
      'A marathon is not won by the fastest sprinter but by whoever keeps a pace for hours. Duckworth measured "grit", sticking with one long-term goal through setbacks, and found it predicted who got through West Point\'s gruelling first summer and who went further in a national spelling bee. Her book made it a slogan. A 2017 review found grit predicts success only weakly and is hard to tell apart from ordinary conscientiousness. The modest lesson stands: steady practice on one thing adds up, so choose the thing with care.',
    source_face:
      'Summary (works under copyright): Duckworth, Peterson, Matthews and Kelly (2007) defined grit as perseverance and passion for long-term goals, built a self-report Grit Scale, and reported that grit predicted educational attainment, retention of cadets through the first summer of training at the US Military Academy at West Point, and advancement in the Scripps National Spelling Bee, over and above IQ. Her book Grit (2016) popularised the idea. A meta-analysis by Credé, Tynan and Harms (2017) found grit only moderately related to performance and retention, strongly correlated with conscientiousness, and with its perseverance facet doing most of the work; they concluded that its predictive power had been overstated. Duckworth was Seligman\'s doctoral student, and has worked with Gollwitzer and Oettingen on combining goals with if-then plans.',
    source_citation: 'Angela L. Duckworth, Christopher Peterson, Michael D. Matthews and Dennis R. Kelly, Journal of Personality and Social Psychology 92 (2007); Angela Duckworth, Grit (New York: Scribner, 2016); Marcus Credé, Michael C. Tynan and Peter D. Harms, Journal of Personality and Social Psychology 113 (2017). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'fredrickson_broaden_and_build',
    type: 'concept',
    field: 'science',
    thinker: 'Barbara Fredrickson',
    year: 1998,
    title: 'Broaden and build: good feelings widen what you see',
    prompt: 'When were you last at ease enough to be curious? What did you notice, try or make then that you would not have when tense?',
    plain_face:
      'Fear narrows the eyes to the snake on the path; ease lets you look up and notice the view. Fredrickson proposed that while negative emotions narrow attention for quick action, positive ones widen it: we play, explore and connect, and over time build friendships, skills and resilience. Lab studies support the widening, though some effects are small. A famous add-on claiming a precise 2.9-to-1 "positivity ratio" for flourishing was shown to rest on faulty mathematics, and that part was formally withdrawn.',
    source_face:
      'Summary (works under copyright): In "What Good Are Positive Emotions?" (1998) and "The Role of Positive Emotions in Positive Psychology" (2001), Fredrickson argues that, whereas negative emotions narrow a person\'s momentary thought-action repertoire toward specific actions (to flee, to attack), positive emotions such as joy, interest and contentment broaden it, prompting play, exploration and savouring, and over time build lasting physical, intellectual and social resources. Experiments found that induced positive emotion widened the scope of attention and speeded recovery from the cardiovascular effects of negative emotion. A 2005 paper with Marcial Losada claimed that flourishing requires a ratio of positive to negative emotions above about 2.9; Brown, Sokal and Friedman (2013) showed its mathematical modelling to be unfounded, and the journal formally withdrew the model, while Fredrickson defended the broader claim that more positivity helps.',
    source_citation: 'Barbara L. Fredrickson, Review of General Psychology 2 (1998); American Psychologist 56 (2001); Barbara L. Fredrickson and Marcial F. Losada, American Psychologist 60 (2005); Nicholas J. L. Brown, Alan D. Sokal and Harris L. Friedman, American Psychologist 68 (2013). Summary, not a quotation.',
    source_url: null,
  },

  // Social psychology
  {
    id: 'asch_conformity',
    type: 'concept',
    field: 'science',
    thinker: 'Solomon Asch',
    year: 1951,
    title: 'Conformity: when the whole room says the short line is long',
    prompt: 'Where did you last go along with a group while privately disagreeing? What would one ally have changed?',
    plain_face:
      'When everyone in a queue faces one way, most newcomers turn to face it too. Asch asked students to match line lengths after a row of actors had all given the same plainly wrong answer. About a third of answers went along with the group, though a quarter of people never gave in, and a single ally who disagreed broke much of the pressure. Later studies found conformity varies with culture and era. The lesson cuts both ways: one honest dissenter frees others to speak.',
    source_face:
      'Summary (works under copyright): In Asch\'s experiments (reported 1951 and in full 1956), a student sat with a group of confederates who, on certain trials, unanimously gave an obviously wrong answer to a simple judgement of which of three lines matched a standard line. Across the critical trials about a third of the real subjects\' answers went along with the majority; about a quarter of subjects never conformed, while most conformed at least once. Conformity dropped sharply when one confederate gave the correct answer, and was low when subjects could write their answers privately. A meta-analysis by Bond and Smith (1996) found conformity in the line task had declined in the United States since the 1950s and was higher in more collectivist cultures. Stanley Milgram worked as Asch\'s assistant before designing his obedience studies.',
    source_citation: 'Solomon E. Asch, "Effects of Group Pressure upon the Modification and Distortion of Judgments", in Harold Guetzkow (ed.), Groups, Leadership and Men (Pittsburgh: Carnegie Press, 1951); "Studies of Independence and Conformity", Psychological Monographs 70, no. 9 (1956); Rod Bond and Peter B. Smith, Psychological Bulletin 119 (1996). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'zimbardo_stanford_prison',
    type: 'concept',
    field: 'science',
    thinker: 'Philip Zimbardo',
    year: 1971,
    title: 'The Stanford prison experiment, and what was wrong with it',
    prompt: 'Think of a role you play, at work or at home, that brings out a side of you that you dislike. How much is the role, and how much is who is directing it?',
    plain_face:
      'A stage set makes actors play their parts, all the more when the director whispers instructions. Zimbardo cast students as guards and prisoners in a mock jail at Stanford; within days some guards turned cruel and it was stopped. For decades it was taught as proof that situations make good people do evil. Later recordings and interviews showed guards were urged to be tough and some were acting, and it was never a controlled experiment. A 2002 study by Haslam and Reicher went quite differently. Read it as a warning about leadership.',
    source_face:
      'Summary (works under copyright): In August 1971 Zimbardo and colleagues assigned paid male student volunteers at random to be "guards" or "prisoners" in a simulated prison in the basement of Stanford\'s psychology building, with Zimbardo acting as superintendent. Some guards became abusive and several prisoners broke down; the study, planned for two weeks, was ended after six days. Haney, Banks and Zimbardo (1973) and Zimbardo\'s The Lucifer Effect (2007) presented it as showing the power of situations over individual character. Later critics, drawing on the archive and interviews (notably Thibault Le Texier, 2018 and 2019), showed that the guards had been briefed and encouraged to be harsh, that some behaviour was performed for the experimenters, and that the study had no control condition and was never published as a full peer-reviewed experiment. In the 2002 BBC Prison Study, Reicher and Haslam found guards reluctant to impose authority and argued that tyranny arises from group identity and leadership, not from roles alone.',
    source_citation: 'Craig Haney, Curtis Banks and Philip Zimbardo, "Interpersonal Dynamics in a Simulated Prison", International Journal of Criminology and Penology 1 (1973); Philip Zimbardo, The Lucifer Effect (New York: Random House, 2007); Thibault Le Texier, "Debunking the Stanford Prison Experiment", American Psychologist 74 (2019); Stephen Reicher and S. Alexander Haslam, British Journal of Social Psychology 45 (2006). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'tajfel_social_identity',
    type: 'concept',
    field: 'science',
    thinker: 'Henri Tajfel and John Turner',
    year: 1979,
    title: 'Social identity: us and them, out of almost nothing',
    prompt: 'Which group\'s "we" do you think in most often? When did it last decide something for you before you had looked at the facts?',
    plain_face:
      'Fans of rival football clubs can be friendly neighbours all week and enemies for ninety minutes. Tajfel, a Polish Jew who survived the war as a prisoner by passing as French, split schoolboys into groups on trivial grounds, such as which of two painters they preferred, and found they still favoured their own group. With Turner he argued that part of who we are comes from our groups, so we want ours to look better. Favouritism in such "minimal groups" is reliable but often mild; by itself it does not explain hatred.',
    source_face:
      'Summary (works under copyright): In the "minimal group" experiments (Tajfel, 1970; Tajfel, Billig, Bundy and Flament, 1971), Bristol schoolboys were divided into groups on trivial or arbitrary criteria, such as a preference for paintings by Klee or Kandinsky, with no contact within or between groups and no personal gain, and then allocated points to anonymous others; they reliably favoured members of their own group, often preferring to maximise the difference between the groups over maximising their own group\'s total. Tajfel and Turner (1979) explained this with social identity theory: part of a person\'s self-concept derives from group memberships, people seek a positive social identity, and they achieve it by comparing their group favourably with others. Later research found in-group favouritism robust but usually stronger as favouritism toward one\'s own than as hostility toward others. Tajfel, a Polish Jew, survived the war as a prisoner of war in the French army, his Jewish identity undiscovered.',
    source_citation: 'Henri Tajfel, "Experiments in Intergroup Discrimination", Scientific American 223 (1970); Henri Tajfel, Michael Billig, R. P. Bundy and Claude Flament, European Journal of Social Psychology 1 (1971); Henri Tajfel and John Turner, "An Integrative Theory of Intergroup Conflict", in W. G. Austin and S. Worchel (eds.), The Social Psychology of Intergroup Relations (Monterey, CA: Brooks/Cole, 1979). Summary, not a quotation.',
    source_url: null,
  },

  // The body: stress and emotion
  {
    id: 'cannon_fight_or_flight',
    type: 'quote',
    field: 'science',
    thinker: 'Walter B. Cannon',
    year: 1915,
    title: 'Fighting or flight: the body readies for a battle that is not coming',
    prompt: 'What are you worrying about that you can do nothing about tonight? Where in your body is it sitting?',
    plain_face:
      'A worried mind is like an army called up in peacetime: the soldiers are out and the farms go untended. Cannon, a Harvard physiologist, showed that fear and rage pour adrenaline into the blood, raise blood sugar, speed the heart and even quicken clotting, readying the body to fight or flee. He saw this as an evolved preparation for struggle. His own footnote names the modern trouble: we sound the same alarm over worries where there is nothing to fight. Later work found the stress response more varied than two options.',
    source_face:
      'The increase of blood sugar, the secretion of adrenin, and the altered circulation in pain and emotional excitement have been interpreted in the foregoing discussion as biological adaptations to conditions in wild life which are likely to involve pain and emotional excitement, i. e., the necessities of fighting or flight.\n\n… the strong emotions, as fear and anger, are rightly interpreted as the concomitants of bodily changes which may be of utmost service in subsequent action. These bodily changes are so much like those which occur in pain and fierce struggle that, as early writers on evolution suggested, the emotions may be considered as foreshadowing the suffering and intensity of actual strife.\n\n… One who permits fears, worries and anxieties to disturb the digestive processes when there is nothing to be done, is evidently allowing the body to go onto what we may regard as a "war footing," when there is no "war" to be waged, no fighting or struggle to be engaged in.',
    source_citation: 'Walter B. Cannon, Bodily Changes in Pain, Hunger, Fear and Rage (New York: D. Appleton, 1915), ch. XI "The Utility of the Bodily Changes in Pain and Great Emotion"; the last paragraph is a footnote in ch. XIV "The Interrelations of Emotions". The short form "fight or flight" became current later; Cannon here writes "fighting or flight".',
    source_url: 'https://www.gutenberg.org/ebooks/73932',
  },
  {
    id: 'selye_stress',
    type: 'concept',
    field: 'science',
    thinker: 'Hans Selye',
    year: 1936,
    title: 'Stress: the alarm that wears you down if it never stops',
    prompt: 'What has kept your alarm ringing for weeks rather than minutes? What would let it switch off, even for an hour a day?',
    plain_face:
      'An engine revved hard now and then is fine; kept in the red all day, it wears out. Selye, injecting rats with all sorts of harmful substances, found the same pattern whatever the cause: an alarm, a stage of resistance, and, if it went on long enough, exhaustion. He borrowed the engineers\' word "stress" for it. Later research showed the response is less uniform than he claimed, and that how a threat is judged matters greatly. The core lesson stands: the body is built for short bursts of stress, not endless ones.',
    source_face:
      'Summary (works under copyright): In a short letter to Nature, "A Syndrome Produced by Diverse Nocuous Agents" (1936), Selye reported that rats exposed to many different harmful agents (cold, surgical injury, excessive exercise, drugs) showed the same triad of changes: enlarged adrenal glands, shrunken thymus and lymph nodes, and stomach ulcers. He described a "general adaptation syndrome" with three stages, an alarm reaction, a stage of resistance and, if the stressor persisted, a stage of exhaustion, and later adopted the word "stress" for the non-specific response, popularising it in The Stress of Life (1956). Critics such as John Mason (1971) argued that the response is less uniform than Selye claimed and depends heavily on psychological factors, and Richard Lazarus\'s work made the person\'s appraisal of a threat central. Later research on "allostatic load" (McEwen, 1998) developed the idea that prolonged activation of stress systems wears on the body.',
    source_citation: 'Hans Selye, "A Syndrome Produced by Diverse Nocuous Agents", Nature 138 (1936); The Stress of Life (New York: McGraw-Hill, 1956); John W. Mason, Journal of Psychiatric Research 8 (1971); Richard S. Lazarus, Psychological Stress and the Coping Process (1966); Bruce S. McEwen, New England Journal of Medicine 338 (1998). Summary, not a quotation.',
    source_url: null,
  },

  // Practices: the schools' methods as everyday exercises (steps in content/practice_steps.js).
  {
    id: 'practice_thought_record',
    type: 'practice',
    field: 'practice',
    title: 'Keep a thought record',
    plain_face: 'When your mood drops, write three things: what happened, the thought that went through your head, and how strongly you believe it. Then look for the bend in it, and write a fairer version. This is an everyday exercise, not therapy.',
  },
  {
    id: 'practice_behavioural_activation',
    type: 'practice',
    field: 'practice',
    title: 'Do one small thing that matters',
    plain_face: 'When you feel flat, do not wait to feel like it. Pick one small activity that is either pleasant or worthwhile, put it in the day at a set time, and do it. Afterwards, notice how you feel. If low mood lasts for weeks, talk to a doctor.',
  },
  {
    id: 'practice_exposure_ladder',
    type: 'practice',
    field: 'practice',
    title: 'Climb a small fear ladder',
    plain_face: 'For an everyday avoidance (a phone call, a crowded shop, speaking up), list steps from easiest to hardest and take the bottom one, staying until the worry eases. Serious phobias, panic or trauma deserve a professional, not a ladder on your own.',
  },
  {
    id: 'practice_values_compass',
    type: 'practice',
    field: 'practice',
    title: 'Check your values compass',
    plain_face: 'Name what you want to stand for in one area of life (work, family, health, friendship) as a direction, not a goal you tick off. Then ask: what is one small step in that direction today, even with the discomfort along for the ride?',
  },
  {
    id: 'practice_defusion',
    type: 'practice',
    field: 'practice',
    title: '"I\'m having the thought that…"',
    plain_face: 'When a harsh thought grips you ("I\'m useless"), put a frame around it: "I\'m having the thought that I\'m useless." The words stay, but you are now watching the thought instead of standing inside it.',
  },
  {
    id: 'practice_self_compassion_break',
    type: 'practice',
    field: 'practice',
    title: 'Take a self-compassion break',
    plain_face: 'In a hard moment say three things to yourself: this is painful; pain like this is part of being human, and others feel it too; may I be kind to myself now. Then do one kind thing, as you would for a friend.',
  },
  {
    id: 'practice_miracle_question',
    type: 'practice',
    field: 'practice',
    title: 'Ask the miracle question',
    plain_face: 'Imagine the problem was solved overnight. What would you notice first tomorrow, in small, visible details? Then ask when a little of that already happens, and what you are doing differently then.',
  },
  {
    id: 'practice_externalise_problem',
    type: 'practice',
    field: 'practice',
    title: 'Give the problem a name',
    plain_face: 'Name a problem as if it were a character outside you ("the Worry", "the Procrastinator"). Ask what it tells you, when it wins, and when you have beaten it. You are not the problem; you are dealing with one.',
  },
  {
    id: 'practice_decisional_balance',
    type: 'practice',
    field: 'practice',
    title: 'Hear your own reasons for change',
    plain_face: 'About a change you are unsure of, write what the present habit gives you and what it costs, then what change would give you. Finish with your own reasons for changing, in your own words, and how ready you feel from 0 to 10.',
  },
  {
    id: 'practice_three_good_things',
    type: 'practice',
    field: 'practice',
    title: 'Write down three good things',
    plain_face: 'Before sleep, write three things that went well today, however small, and for each one a line on why it happened. It trains attention to notice what the day gave as well as what it took.',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Freud: the unconscious
  { from: 'copernicus_de_revolutionibus', to: 'freud_ego_not_master', relation: 'extended', year: 1917, note: 'Freud named Copernicus\'s displacement of the earth as the first of the "great outrages" to human self-love, and counted his own as the third.' },
  { from: 'darwin_grandeur_of_life', to: 'freud_ego_not_master', relation: 'extended', year: 1917, note: 'Darwin\'s descent of man from the animals is Freud\'s second outrage; the unconscious, he said, is the third (Eighteenth Lecture).' },
  { from: 'freud_ego_not_master', to: 'freud_pleasure_principle', relation: 'extended', year: 1920, note: 'Three years after the lectures, Beyond the Pleasure Principle went further into the forces the ego does not command.' },
  { from: 'hume_bundle_of_perceptions', to: 'freud_ego_not_master', relation: 'converged', note: 'Hume found no self steering the stream of perceptions; Freud found an "I" that knows little of what moves it. The parallel is ours.' },
  { from: 'freud_ego_not_master', to: 'kahneman_two_systems', relation: 'converged', note: 'Freud\'s rider and Kahneman\'s fast and slow systems both put most of the mind\'s work out of conscious view; Kahneman\'s automatic System 1 is not a repressed unconscious, and the parallel is ours.' },
  { from: 'freud_ego_not_master', to: 'practice_name_the_feeling', relation: 'lands_on', note: 'What is unconscious cannot be argued with; a feeling put into words has come at least partly into view.' },

  // Anna Freud
  { from: 'freud_ego_not_master', to: 'anna_freud_defence_mechanisms', relation: 'taught', year: 1936, note: 'Anna Freud trained with her father and gathered the defences scattered through his writings into one account of the ego.' },
  { from: 'anna_freud_defence_mechanisms', to: 'harvard_study_adult_development', relation: 'extended', year: 1977, note: 'George Vaillant rated the defences of the Harvard Study\'s men and found the "mature" ones (humour, altruism, sublimation) went with better lives (Adaptation to Life, 1977).' },
  { from: 'festinger_cognitive_dissonance', to: 'anna_freud_defence_mechanisms', relation: 'converged', note: 'Rationalising a choice to quiet dissonance is close kin to a defence mechanism; Festinger studied it experimentally without psychoanalytic terms. The parallel is ours.' },
  { from: 'anna_freud_defence_mechanisms', to: 'practice_name_the_feeling', relation: 'lands_on', note: 'When a reaction seems too big for its cause, name the feeling underneath, not only the one on top.' },

  // Winnicott
  { from: 'freud_ego_not_master', to: 'winnicott_good_enough_mother', relation: 'extended', year: 1953, note: 'Winnicott worked within British psychoanalysis but moved its attention from inner drives to the infant\'s first relationship and environment.' },
  { from: 'winnicott_good_enough_mother', to: 'bowlby_ainsworth_attachment', relation: 'converged', note: 'Two London psychoanalysts of the same years, one from the consulting room and one from research, both put the early bond with a caregiver at the root of security.' },
  { from: 'winnicott_good_enough_mother', to: 'practice_self_compassion_break', relation: 'lands_on', note: '"Good enough" applies to the carer too: you can fail a little and still be the safe person.' },

  // Horney
  { from: 'freud_pleasure_principle', to: 'horney_tyranny_of_the_should', relation: 'refuted', year: 1950, note: 'Horney rejected Freud\'s biology of drives and his account of women, and put culture and relationships at the root of neurosis.' },
  { from: 'adler_feeling_of_inferiority', to: 'horney_tyranny_of_the_should', relation: 'converged', note: 'Both saw neurosis as a striving to make up for a felt inadequacy with a fictional, idealised goal; Horney\'s "search for glory" is close to Adler\'s striving for superiority, though she developed it on her own terms.' },
  { from: 'horney_tyranny_of_the_should', to: 'ellis_abc_model', relation: 'extended', year: 1962, note: 'Ellis acknowledged Horney\'s "tyranny of the should" among the sources of his attack on absolutist "musts".' },
  { from: 'horney_tyranny_of_the_should', to: 'practice_self_compassion_break', relation: 'lands_on', note: 'Catch the "should", and answer it in the voice you would use with a friend.' },

  // Erikson
  { from: 'anna_freud_defence_mechanisms', to: 'erikson_eight_stages', relation: 'taught', year: 1950, note: 'Erikson trained in Vienna as a child analyst, with Anna Freud as his analyst, before emigrating to the United States.' },
  { from: 'freud_pleasure_principle', to: 'erikson_eight_stages', relation: 'extended', year: 1950, note: 'Erikson stretched Freud\'s stages of childhood across the whole life and recast them as social, not only sexual, crises.' },
  { from: 'harvard_study_adult_development', to: 'erikson_eight_stages', relation: 'converged', note: 'Vaillant later used Erikson\'s adult stages, intimacy, generativity and integrity, to read the Harvard Study\'s lives.' },
  { from: 'erikson_eight_stages', to: 'practice_work_that_outlasts_you', relation: 'lands_on', note: 'Erikson\'s "generativity": caring for what, and who, comes after you.' },

  // Thorndike
  { from: 'darwin_grandeur_of_life', to: 'thorndike_law_of_effect', relation: 'extended', year: 1898, note: 'Thorndike set out to test, with stopwatches and puzzle boxes, the anecdotes of animal reasoning that followed Darwin, and found trial and error instead.' },
  { from: 'thorndike_law_of_effect', to: 'pavlov_conditioned_reflex', relation: 'converged', note: 'In the same years, Thorndike in New York and Pavlov in St Petersburg found two kinds of learning without thought: by consequences, and by signals.' },
  { from: 'thorndike_law_of_effect', to: 'skinner_beyond_freedom', relation: 'extended', year: 1938, note: 'Skinner\'s operant conditioning is the law of effect made exact: behaviour is shaped by the reinforcement that follows it.' },
  { from: 'thorndike_law_of_effect', to: 'practice_behavioural_activation', relation: 'lands_on', note: 'Low mood starves a life of the satisfactions that "stamp in" doing things; this practice puts some back.' },

  // Watson
  { from: 'wundt_first_laboratory', to: 'watson_behaviorist_manifesto', relation: 'refuted', year: 1913, note: 'Watson threw out the trained introspection of the laboratory tradition that ran from Wundt through Titchener: "Introspection forms no essential part of its methods."' },
  { from: 'pavlov_conditioned_reflex', to: 'watson_behaviorist_manifesto', relation: 'extended', year: 1916, note: 'Pavlov\'s conditioning work dates from the early 1900s; in his 1915 presidential address to the American Psychological Association Watson made the conditioned reflex behaviourism\'s method.' },
  { from: 'locke_blank_slate', to: 'watson_behaviorist_manifesto', relation: 'converged', note: 'Watson\'s later boast that he could make any healthy infant into any kind of adult is the blank slate pushed to its limit; he did not build on Locke, and the link is ours.' },
  { from: 'thorndike_law_of_effect', to: 'watson_behaviorist_manifesto', relation: 'extended', year: 1913, note: 'Watson trained in animal psychology, the field Thorndike\'s puzzle boxes had made experimental, and extended its objective methods to people.' },
  { from: 'watson_behaviorist_manifesto', to: 'skinner_beyond_freedom', relation: 'extended', year: 1938, note: 'Skinner, converted by reading Watson, kept his refusal to explain behaviour by inner mental states.' },
  { from: 'watson_behaviorist_manifesto', to: 'practice_exposure_ladder', relation: 'lands_on', note: 'What Little Albert showed (a fear can be learned) has a hopeful twin: approached step by step, it can be unlearned.' },

  // Wolpe
  { from: 'watson_behaviorist_manifesto', to: 'wolpe_systematic_desensitisation', relation: 'extended', year: 1958, note: 'Mary Cover Jones, advised by Watson, unlearned a boy\'s fear of a rabbit step by step in 1924; Wolpe made the method systematic.' },
  { from: 'pavlov_conditioned_reflex', to: 'wolpe_systematic_desensitisation', relation: 'extended', year: 1958, note: 'Wolpe built his "reciprocal inhibition" on Pavlov\'s and Sherrington\'s physiology: anxiety, a conditioned response, weakens when a calm response is paired with the same cue.' },
  { from: 'aristotle_friendship', to: 'wolpe_systematic_desensitisation', relation: 'converged', note: 'Aristotle held that we become brave by doing brave things, little by little (Nicomachean Ethics II.1-2); the fear ladder is that advice in steps. The link is ours.' },
  { from: 'wolpe_systematic_desensitisation', to: 'bandura_self_efficacy', relation: 'extended', year: 1977, note: 'Bandura\'s snake-phobia studies set his modelling methods beside Wolpe\'s desensitisation, and he argued that all such treatments work by raising self-efficacy.' },
  { from: 'wolpe_systematic_desensitisation', to: 'practice_exposure_ladder', relation: 'lands_on' },
  { from: 'bandura_self_efficacy', to: 'practice_exposure_ladder', relation: 'lands_on', note: 'Each rung climbed is a small success, the most dependable source of belief that you can.' },

  // Behavioural activation
  { from: 'skinner_beyond_freedom', to: 'lewinsohn_behavioural_activation', relation: 'extended', year: 1974, note: 'Lewinsohn explained depression in Skinner\'s terms, as too little reward following one\'s own actions; Ferster had applied operant ideas to depression in 1973.' },
  { from: 'beck_cognitive_therapy_stoicism_tested', to: 'lewinsohn_behavioural_activation', relation: 'measured', year: 1996, note: 'Jacobson\'s team took Beck\'s cognitive therapy apart and found its activity-scheduling component alone did as well as the whole.' },
  { from: 'seligman_learned_helplessness', to: 'lewinsohn_behavioural_activation', relation: 'converged', note: 'Two accounts of depression in the same years: helplessness, where nothing one does matters, and too little reward for what one does. Each implies the remedy of doing things that work.' },
  { from: 'lewinsohn_behavioural_activation', to: 'practice_behavioural_activation', relation: 'lands_on' },

  // Piaget and Vygotsky
  { from: 'locke_blank_slate', to: 'piaget_stages_of_thinking', relation: 'refuted', year: 1936, note: 'Piaget rejected both the blank slate that only records experience and the inborn idea: the child builds knowledge by acting on the world.' },
  { from: 'piaget_stages_of_thinking', to: 'vygotsky_zone_of_proximal_development', relation: 'refuted', year: 1934, note: 'In Thinking and Speech Vygotsky criticised Piaget\'s early account of children\'s egocentric speech (The Language and Thought of the Child, 1923): self-talk is not a fading habit but social speech turning into thought.' },
  { from: 'piaget_stages_of_thinking', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'Piaget\'s "accommodation": growing up, at any age, is letting an idea that keeps failing change shape.' },
  { from: 'ubuntu_person_through_persons', to: 'vygotsky_zone_of_proximal_development', relation: 'converged', note: 'A person becomes a person through other persons; Vygotsky said the same of the mind, which grows first between people and then within. Independent, and the parallel is ours.' },
  { from: 'vygotsky_zone_of_proximal_development', to: 'bandura_self_efficacy', relation: 'converged', note: 'Both put learning in watching and being helped by someone a step ahead; Bandura\'s modelling and Vygotsky\'s more capable peer were developed apart.' },
  { from: 'vygotsky_zone_of_proximal_development', to: 'practice_invest_in_people', relation: 'lands_on', note: 'Be the hand on the saddle for someone, and find one for yourself.' },

  // Burns
  { from: 'beck_cognitive_therapy_stoicism_tested', to: 'burns_cognitive_distortions', relation: 'taught', year: 1980, note: 'Burns trained with Beck at the University of Pennsylvania and wrote Feeling Good to bring cognitive therapy to general readers.' },
  { from: 'ellis_abc_model', to: 'burns_cognitive_distortions', relation: 'extended', year: 1980, note: 'Burns\'s "should statements" are Ellis\'s "musts"; he credits Ellis among the founders of the approach.' },
  { from: 'marcus_pain_is_your_estimate', to: 'burns_cognitive_distortions', relation: 'converged', note: 'Marcus told himself to strip the added judgement from an event; a thought record does it on paper. The link is ours.' },
  { from: 'burns_cognitive_distortions', to: 'practice_thought_record', relation: 'lands_on', note: 'Burns\'s "daily mood log": the event, the automatic thought, the distortion, and a fairer answer.' },
  { from: 'beck_cognitive_therapy_stoicism_tested', to: 'practice_thought_record', relation: 'lands_on', note: 'The written record of automatic thoughts is the core homework of Beck\'s cognitive therapy.' },
  { from: 'ellis_abc_model', to: 'practice_thought_record', relation: 'lands_on', note: 'A thought record is A, B and C in columns, with D, the dispute, at the end.' },

  // Kahneman's two systems
  { from: 'kahneman_tversky_loss_aversion', to: 'kahneman_two_systems', relation: 'extended', year: 2011, note: 'Thinking, Fast and Slow gathers the heuristics and biases work with Tversky under a single picture of two systems.' },
  { from: 'james_attention_is_will', to: 'kahneman_two_systems', relation: 'extended', year: 2011, note: 'Kahneman\'s effortful System 2 is James\'s attention with effort; Kahneman\'s first book, Attention and Effort (1973), studied the same limited, effortful attention.' },
  { from: 'kahneman_two_systems', to: 'practice_thought_record', relation: 'lands_on', note: 'Writing a thought down is one way to hand a fast judgement to the slow system for checking.' },
  { from: 'kahneman_two_systems', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'Including Kahneman\'s own: he publicly withdrew his confidence in the priming studies he had cited.' },

  // Perls
  { from: 'freud_ego_not_master', to: 'perls_gestalt_here_and_now', relation: 'refuted', year: 1951, note: 'Perls, trained as a psychoanalyst, turned from interpreting the past to awareness of what is happening now, in the room and in the body.' },
  { from: 'husserl_back_to_the_things', to: 'perls_gestalt_here_and_now', relation: 'extended', year: 1951, note: 'Gestalt therapy takes phenomenology\'s method, describe what appears before explaining it, into the consulting room.' },
  { from: 'merleau_ponty_body_subject', to: 'perls_gestalt_here_and_now', relation: 'converged', note: 'Both put the lived body at the centre of experience; Gestalt therapy asks what your hands and breath are doing as you speak. The parallel is ours.' },
  { from: 'perls_gestalt_here_and_now', to: 'practice_name_the_feeling', relation: 'lands_on', note: 'Gestalt\'s first move: say what you feel now, in the present tense, beginning with "I".' },

  // Yalom
  { from: 'heidegger_being_toward_death', to: 'yalom_four_givens', relation: 'extended', year: 1980, note: 'Yalom draws on Heidegger for death as the given that, faced, can turn a person from everyday distraction to living authentically.' },
  { from: 'sartre_existence_precedes_essence', to: 'yalom_four_givens', relation: 'extended', year: 1980, note: 'Yalom\'s "freedom" is Sartre\'s: we are the authors of our lives and responsible for them, which is why freedom frightens.' },
  { from: 'kierkegaard_fear_and_trembling', to: 'yalom_four_givens', relation: 'extended', year: 1980, note: 'Kierkegaard\'s anxiety before freedom and choice is one of the sources Yalom names for existential psychotherapy.' },
  { from: 'frankl_mans_search_for_meaning', to: 'yalom_four_givens', relation: 'extended', year: 1980, note: 'Yalom\'s fourth given, meaninglessness, takes up Frankl\'s logotherapy, while doubting that meaning can be found rather than made.' },
  { from: 'camus_myth_of_sisyphus', to: 'yalom_four_givens', relation: 'converged', note: 'Camus asked how to live once you see that the world offers no meaning; Yalom treats the same question as a clinical one.' },
  { from: 'yalom_four_givens', to: 'practice_keep_death_in_view', relation: 'lands_on', note: 'Yalom saw patients\' lives sharpen when they faced death squarely: the fact of death ends us, the idea of it can wake us up.' },

  // Hayes: ACT
  { from: 'skinner_beyond_freedom', to: 'hayes_acceptance_and_commitment', relation: 'extended', year: 1999, note: 'Hayes is a behaviour analyst; ACT and its theory of language, relational frame theory, grew out of Skinner\'s tradition.' },
  { from: 'buddha_craving_root_of_suffering', to: 'hayes_acceptance_and_commitment', relation: 'converged', note: 'Suffering grows from clinging and pushing away: the Buddha\'s diagnosis and ACT\'s "experiential avoidance" meet, though Hayes built ACT from behavioural research, not from Buddhism.' },
  { from: 'linehan_radical_acceptance', to: 'hayes_acceptance_and_commitment', relation: 'converged', note: 'In the same decade two behaviour therapists added acceptance to change: Linehan from Zen practice, Hayes from a theory of language.' },
  { from: 'epictetus_up_to_us', to: 'hayes_acceptance_and_commitment', relation: 'converged', note: 'Epictetus disputed false judgements; ACT does not argue with a thought but loosens its grip. Same aim, different route; the contrast is ours.' },
  { from: 'hayes_acceptance_and_commitment', to: 'practice_values_compass', relation: 'lands_on', note: 'In ACT values are directions, like west on a compass: you never arrive, but you can always take a step that way.' },
  { from: 'hayes_acceptance_and_commitment', to: 'practice_defusion', relation: 'lands_on', note: 'ACT\'s best-known defusion exercise.' },

  // Neff
  { from: 'buddha_craving_root_of_suffering', to: 'neff_self_compassion', relation: 'secularized', year: 2003, note: 'Neff, a practitioner of Buddhist meditation, took compassion from Buddhist teaching and defined and measured it as a psychological trait, without the religion.' },
  { from: 'horney_tyranny_of_the_should', to: 'neff_self_compassion', relation: 'converged', note: 'Horney diagnosed self-hatred driven by shoulds; Neff measured its remedy. The link is ours.' },
  { from: 'rogers_unconditional_positive_regard', to: 'neff_self_compassion', relation: 'converged', note: 'Self-compassion is Rogers\'s unconditional regard turned inward: worth that does not depend on performance. The parallel is ours.' },
  { from: 'neff_self_compassion', to: 'practice_self_compassion_break', relation: 'lands_on', note: 'Neff\'s three steps in one breath: mindfulness, common humanity, kindness.' },

  // MBCT
  { from: 'kabat_zinn_mbsr', to: 'segal_williams_teasdale_mbct', relation: 'extended', year: 2002, note: 'MBCT took the eight-week format and practices of Kabat-Zinn\'s stress-reduction course and aimed them at relapse into depression.' },
  { from: 'beck_cognitive_therapy_stoicism_tested', to: 'segal_williams_teasdale_mbct', relation: 'extended', year: 2002, note: 'The authors set out to build a maintenance form of cognitive therapy and found that changing one\'s relation to thoughts mattered more than changing their content.' },
  { from: 'dogen_just_sitting', to: 'segal_williams_teasdale_mbct', relation: 'secularized', year: 2002, note: 'Sitting and watching thoughts come and go without following them, taught in a hospital without the temple; the line runs through Kabat-Zinn.' },
  { from: 'segal_williams_teasdale_mbct', to: 'practice_defusion', relation: 'lands_on', note: 'MBCT\'s phrase for it: thoughts are not facts.' },
  { from: 'segal_williams_teasdale_mbct', to: 'practice_name_the_feeling', relation: 'lands_on' },

  // Bowen
  { from: 'lewin_person_and_situation', to: 'bowen_family_systems', relation: 'converged', note: 'Lewin saw a person in a field of forces; Bowen saw a family as one emotional field in which each member\'s move shifts the others. The parallel is ours.' },
  { from: 'bowen_family_systems', to: 'practice_control_your_response', relation: 'lands_on', note: 'Bowen\'s rule: you can change only your own part in the pattern, and that is often enough to change the pattern.' },

  // Gottman
  { from: 'aristotle_friendship', to: 'gottman_four_horsemen', relation: 'converged', note: 'Aristotle said friendship lives on goodwill shown and returned; Gottman measured how contempt, its opposite, wears a couple down. The link is ours.' },
  { from: 'harvard_study_adult_development', to: 'gottman_four_horsemen', relation: 'converged', note: 'The Harvard Study found warm relationships protect health; Gottman studied, moment by moment, what makes a close relationship warm or cold.' },
  { from: 'bowlby_ainsworth_attachment', to: 'gottman_four_horsemen', relation: 'converged', note: 'Stonewalling and the flooded body Gottman measured look much like the threat of losing a secure base; later couples therapies joined the two ideas.' },
  { from: 'gottman_four_horsemen', to: 'practice_invest_in_people', relation: 'lands_on', note: 'Gottman\'s antidote to contempt: build a habit of noticing and saying what you appreciate.' },

  // Solution-focused and narrative therapy
  { from: 'wittgenstein_whereof_one_cannot_speak', to: 'de_shazer_berg_miracle_question', relation: 'extended', year: 1994, note: 'De Shazer read the later Wittgenstein closely and described therapy as a language game in which problems and solutions are made in talk (Words Were Originally Magic, 1994).' },
  { from: 'de_shazer_berg_miracle_question', to: 'white_epston_narrative_therapy', relation: 'converged', note: 'Two brief, postmodern therapies of the same years: both search for "exceptions" or "unique outcomes" when the problem did not win, and build from there.' },
  { from: 'de_shazer_berg_miracle_question', to: 'practice_miracle_question', relation: 'lands_on' },
  { from: 'foucault_discipline', to: 'white_epston_narrative_therapy', relation: 'extended', year: 1990, note: 'White drew on Foucault\'s account of how dominant knowledges and "normalising judgement" shape the stories people tell about themselves.' },
  { from: 'pennebaker_expressive_writing', to: 'white_epston_narrative_therapy', relation: 'converged', note: 'Both find that turning a hard experience into a story changes it, Pennebaker by measuring writing, White and Epston by rewriting the story in therapy.' },
  { from: 'white_epston_narrative_therapy', to: 'practice_externalise_problem', relation: 'lands_on' },

  // Motivational interviewing
  { from: 'rogers_unconditional_positive_regard', to: 'miller_rollnick_motivational_interviewing', relation: 'extended', year: 1991, note: 'Miller and Rollnick took Rogers\'s empathy and reflective listening and gave them a direction: evoking the person\'s own reasons to change.' },
  { from: 'festinger_cognitive_dissonance', to: 'miller_rollnick_motivational_interviewing', relation: 'extended', year: 1991, note: 'MI works by letting people hear the gap between what they do and what they value, in their own words; Miller drew on dissonance and self-perception research to explain why.' },
  { from: 'prochaska_stages_of_change', to: 'miller_rollnick_motivational_interviewing', relation: 'converged', note: 'Developed in the same years in the addiction field, the stages and MI were soon paired: MI for those still deciding, plans for those ready.' },
  { from: 'socrates_unexamined_life', to: 'miller_rollnick_motivational_interviewing', relation: 'converged', note: 'Socrates drew answers out with questions rather than lecturing; MI draws out a person\'s own reasons the same way. The link is ours.' },
  { from: 'miller_rollnick_motivational_interviewing', to: 'practice_decisional_balance', relation: 'lands_on', note: 'With Miller and Rose\'s caution (2015): weighing both sides evenly can stall someone who is torn, so the exercise ends on your own reasons for change.' },
  { from: 'prochaska_stages_of_change', to: 'practice_decisional_balance', relation: 'lands_on', note: 'The stages model borrowed "decisional balance", weighing pros and cons, from Janis and Mann\'s work on decisions.' },

  // PERMA
  { from: 'seligman_learned_helplessness', to: 'seligman_perma', relation: 'extended', year: 2011, note: 'Seligman moved from what makes people helpless and depressed to what makes them flourish, by way of learned optimism.' },
  { from: 'maslow_hierarchy', to: 'seligman_perma', relation: 'extended', year: 2011, note: 'Maslow titled a chapter "Toward a Positive Psychology" in 1954; Seligman gave the name to a movement in 1998.' },
  { from: 'csikszentmihalyi_flow', to: 'seligman_perma', relation: 'extended', year: 2011, note: 'Engagement, the E in PERMA, is flow; Csikszentmihalyi and Seligman co-wrote the 2000 manifesto of positive psychology.' },
  { from: 'aristotle_friendship', to: 'seligman_perma', relation: 'converged', note: 'Aristotle counted friendship and fine activity among the parts of a flourishing life, not only pleasure; PERMA is a modern list in the same spirit.' },
  { from: 'seligman_perma', to: 'practice_three_good_things', relation: 'lands_on', note: 'One of the exercises Seligman\'s group tested (2005); later trials found smaller benefits than first reported.' },

  // Self-determination theory
  { from: 'skinner_beyond_freedom', to: 'deci_ryan_self_determination', relation: 'refuted', year: 1985, note: 'Against the behaviourist view that rewards simply strengthen behaviour, Deci showed that rewards can weaken the motivation to do something for its own sake.' },
  { from: 'maslow_hierarchy', to: 'deci_ryan_self_determination', relation: 'converged', note: 'Both are theories of basic psychological needs; Deci and Ryan named three, without Maslow\'s ladder, and tested them.' },
  { from: 'deci_ryan_self_determination', to: 'practice_values_compass', relation: 'lands_on', note: 'Motivation lasts best when it is your own: a step chosen from what you value, not from pressure.' },

  // Grit
  { from: 'seligman_learned_helplessness', to: 'duckworth_grit', relation: 'taught', year: 2007, note: 'Duckworth did her doctorate with Seligman at the University of Pennsylvania.' },
  { from: 'dweck_mindsets', to: 'duckworth_grit', relation: 'converged', note: 'Two of the most popular ideas in schools in the 2000s, both about persisting after setbacks, both later found to have smaller effects than claimed.' },
  { from: 'duckworth_grit', to: 'practice_if_then_plan', relation: 'lands_on', note: 'Duckworth worked with Gollwitzer and Oettingen on pairing long goals with if-then plans for the obstacles.' },

  // Broaden and build
  { from: 'spinoza_freedom_understanding_necessity', to: 'fredrickson_broaden_and_build', relation: 'converged', note: 'Spinoza defined joy as a passage to greater power of acting; Fredrickson proposed that positive emotions widen what we can think and do. The parallel is ours.' },
  { from: 'cannon_fight_or_flight', to: 'fredrickson_broaden_and_build', relation: 'extended', year: 1998, note: 'Fredrickson began from the standard account, going back to Cannon, of negative emotions as preparing specific actions like fight or flight, and asked what positive emotions are for.' },
  { from: 'fredrickson_broaden_and_build', to: 'seligman_perma', relation: 'converged', note: 'Positive emotion is the P in PERMA; Fredrickson\'s theory says what it builds.' },
  { from: 'fredrickson_broaden_and_build', to: 'practice_three_good_things', relation: 'lands_on' },

  // Asch
  { from: 'asch_conformity', to: 'milgram_obedience', relation: 'taught', year: 1963, note: 'Milgram worked as Asch\'s assistant and designed his obedience studies partly to ask whether Asch\'s pressure would hold for actions, not just judgements.' },
  { from: 'tocqueville_individualism', to: 'asch_conformity', relation: 'converged', note: 'Tocqueville feared the quiet pressure of majority opinion in a democracy; Asch measured it in a room of eight. The link is ours.' },
  { from: 'asch_conformity', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'Ask of a belief whether you came to it, or only heard it agreed.' },

  // Zimbardo
  { from: 'milgram_obedience', to: 'zimbardo_stanford_prison', relation: 'extended', year: 1971, note: 'Zimbardo, Milgram\'s schoolmate in the Bronx, pushed the situationist reading further: put people in a role and the role takes over. That reading is now in doubt.' },
  { from: 'arendt_banality_of_evil', to: 'zimbardo_stanford_prison', relation: 'converged', note: 'Arendt saw evil done by ordinary functionaries; Zimbardo claimed to show it in a basement and later cited her. His critics argue that the cruelty was led and encouraged, not simply produced by the role.' },
  { from: 'zimbardo_stanford_prison', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'Including about famous findings: ask how the study was actually done.' },

  // Tajfel
  { from: 'ibn_khaldun_asabiyyah', to: 'tajfel_social_identity', relation: 'converged', note: 'Ibn Khaldun made group feeling the engine of history; Tajfel found its seed in boys sorted by a taste in paintings. The link is ours.' },
  { from: 'du_bois_double_consciousness', to: 'tajfel_social_identity', relation: 'converged', note: 'Du Bois described seeing oneself through the eyes of a group that looks down on one\'s own; social identity theory studies what such comparisons do to the self.' },
  { from: 'tajfel_social_identity', to: 'zimbardo_stanford_prison', relation: 'refuted', year: 2006, note: 'Haslam and Reicher\'s BBC prison study, built on social identity theory, argued that people follow tyrannical roles only when they identify with the group and its leaders.' },
  { from: 'tajfel_social_identity', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'Notice when "we" and "they" are doing your thinking for you.' },

  // Cannon and Selye
  { from: 'darwin_grandeur_of_life', to: 'cannon_fight_or_flight', relation: 'extended', year: 1915, note: 'Cannon read the bodily changes of fear and rage as adaptations shaped by natural selection, as "early writers on evolution suggested".' },
  { from: 'marcus_pain_is_your_estimate', to: 'cannon_fight_or_flight', relation: 'converged', note: 'Marcus said the harm is in our estimate of a thing; Cannon showed the body mobilising for war on the strength of a worry. The link is ours.' },
  { from: 'cannon_fight_or_flight', to: 'selye_stress', relation: 'extended', year: 1936, note: 'Selye built on Cannon\'s work on adrenaline and the body\'s balance (Cannon\'s "homeostasis", 1926) and asked what happens when the alarm does not stop.' },
  { from: 'cannon_fight_or_flight', to: 'practice_care_for_the_body', relation: 'lands_on', note: 'A long slow out-breath is one of the quickest ways to tell the body the war is off.' },
  { from: 'selye_stress', to: 'practice_care_for_the_body', relation: 'lands_on' },
  { from: 'selye_stress', to: 'practice_behavioural_activation', relation: 'lands_on', note: 'Recovery from long stress includes putting back the rewarding things stress pushed out.' },
];
