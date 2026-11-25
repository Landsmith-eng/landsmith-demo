// Branch: modern thought beyond the line, part four: Wollstonecraft, Sor Juana, Marx, William James, Jung.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Every passage verified word for word against the Project Gutenberg texts cited.
// Sor Juana is quoted in the Spanish of the 1872 Madrid edition; the bracketed English is our own rendering.

export const nodes = [
  {
    id: 'wollstonecraft_reason_has_no_sex',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Mary Wollstonecraft',
    year: 1792,
    title: 'Power over themselves: virtue and knowledge have no sex',
    prompt: 'Name one belief about what men or women are "naturally" like that you absorbed without choosing it. Where did it come from?',
    plain_face:
      'Wollstonecraft read the educators of her day telling girls to be pleasing rather than thinking, and asked a simple question: if a woman cannot reason, how can she be virtuous? A compass that is never allowed to settle points nowhere. She wanted no reversal of power, only that women be educated as rational creatures and left to steer themselves. Her bet was that truth is one thing for everyone, and that a mind kept in the dark cannot be good, only obedient.',
    source_face:
      '"Educate women like men," says Rousseau, "and the more they resemble our sex the less power will they have over us." This is the very point I aim at. I do not wish them to have power over men; but over themselves.\n\n… But I still insist, that not only the virtue, but the KNOWLEDGE of the two sexes should be the same in nature, if not in degree, and that women, considered not only as moral, but rational creatures, ought to endeavour to acquire human virtues (or perfections) by the SAME means as men, instead of being educated like a fanciful kind of HALF being, one of Rousseau\'s wild chimeras.\n\n… I wish to sum up what I have said in a few words, for I here throw down my gauntlet, and deny the existence of sexual virtues, not excepting modesty. For man and woman, truth, if I understand the meaning of the word, must be the same.',
    source_citation: 'Mary Wollstonecraft, A Vindication of the Rights of Woman (London, 1792), ch. IV and ch. III. Capitals are the Project Gutenberg text\'s rendering of the original italics.',
    source_url: 'https://www.gutenberg.org/ebooks/3420',
  },
  {
    id: 'sor_juana_reply',
    type: 'text',
    field: 'philosophy',
    thinker: 'Sor Juana Inés de la Cruz',
    year: 1691,
    title: 'Reply to Sor Filotea: "I study to be less ignorant"',
    prompt: 'What do you keep learning that nobody asked you to learn? Who, if anyone, has told you to stop?',
    plain_face:
      'A nun in Mexico City, the most learned woman of her continent, was told by a bishop (writing under a woman\'s name, "Sor Filotea") to put down her books and stick to religion. Her answer is the first great defence of a woman\'s right to think. Forbidden to study, she studied the kitchen: watch an egg fry and you learn chemistry. She wrote that if Aristotle had cooked, he would have written more. The pull toward knowing, she said, was not ambition; she only wanted to be less ignorant.',
    source_face:
      'Pero, señora, ¿qué podemos saber las mujeres, sino filosofías de cocina? Bien dijo Supercio Leonardo: Que bien se puede filosofar y aderezar la cena. Y yo suelo decir, viendo estas cosillas: Si Aristóteles hubiera guisado, mucho mas hubiera escrito.\n\n[But, my lady, what can we women know, except kitchen philosophies? Lupercio Leonardo put it well: one can philosophize perfectly well while preparing dinner. And I often say, seeing these little things: if Aristotle had cooked, he would have written much more.]\n\n… Lo que solo he deseado es estudiar para ignorar ménos … Pues ¿en qué ha estado el delito, si aun lo que es lícito á las mujeres, que es enseñar escribiendo, no hago yo, porque conozco que no tengo caudal para ello?\n\n[All I have wished is to study so as to be less ignorant … So where has the crime been, if even what is permitted to women, namely teaching by writing, I do not do, because I know I lack the means for it?]',
    source_citation: 'Sor Juana Inés de la Cruz, Respuesta á Sor Filotea de la Cruz (1691), Spanish text as printed in Obras selectas de la célebre monja de Méjico (Madrid, 1872; the "Respuesta de la poetisa" section). The bracketed English paragraphs are our own rendering for this card, not a published translation. The famous shorter form "yo no estudio para saber más, sino para ignorar menos" is how the line reads in other editions.',
    source_url: 'https://www.gutenberg.org/ebooks/74087',
  },
  {
    id: 'marx_alienated_labor',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Karl Marx',
    year: 1848,
    title: 'Alienated labour: the worker becomes an appendage of the machine',
    prompt: 'Think of the last piece of work you were proud of. Did you see it through from idea to finished thing, or only touch one slice of it?',
    plain_face:
      'A carpenter who builds a whole chair can look at it and see herself in it. Marx said factory work breaks that mirror: the job is cut into pieces so small that the work loses all character, and the worker becomes a part bolted onto the machine rather than a person using a tool. His word for the result was alienation. What we make, under those conditions, stops being ours in any sense that matters, and work, which could be the fullest expression of a human life, becomes the thing we do to afford the rest of it.',
    source_face:
      'Owing to the extensive use of machinery and to division of labour, the work of the proletarians has lost all individual character, and consequently, all charm for the workman. He becomes an appendage of the machine, and it is only the most simple, most monotonous, and most easily acquired knack, that is required of him.\n\n… All that is solid melts into air, all that is holy is profaned, and man is at last compelled to face with sober senses, his real conditions of life, and his relations with his kind.',
    source_citation: 'Karl Marx and Friedrich Engels, Manifesto of the Communist Party (1848), section I, "Bourgeois and Proletarians" (trans. Samuel Moore, authorised English edition of 1888, edited by Engels). The fuller theory of alienated labour is in Marx\'s 1844 Economic and Philosophic Manuscripts, whose English translations are still in copyright.',
    source_url: 'https://www.gutenberg.org/ebooks/61',
  },
  {
    id: 'william_james_habit',
    type: 'quote',
    field: 'science',
    thinker: 'William James',
    year: 1890,
    title: 'Habit: make your nervous system your ally instead of your enemy',
    prompt: 'What is one thing you decide afresh every day that could simply become automatic? What would you do with the attention you got back?',
    plain_face:
      'James, the first great American psychologist, pictured habit as the flywheel of society: a heavy wheel that keeps the engine turning smoothly once it is spinning. Each repeated action wears a groove in the nervous system, so the body learns to do it without the mind. His advice is to put the small, useful things on autopilot early, so that your attention is free for what actually needs it. Decide once; then let the wheel turn.',
    source_face:
      'Habit is thus the enormous fly-wheel of society, its most precious conservative agent. It alone is what keeps us all within the bounds of ordinance, and saves the children of fortune from the envious uprisings of the poor.\n\n… The great thing, then, in all education, is to make our nervous system our ally instead of our enemy. It is to fund and capitalize our acquisitions, and live at ease upon the interest of the fund. For this we must make automatic and habitual, as early as possible, as many useful actions as we can, and guard against the growing into ways that are likely to be disadvantageous to us, as we should guard against the plague. The more of the details of our daily life we can hand over to the effortless custody of automatism, the more our higher powers of mind will be set free for their own proper work.\n\n… And the faculty of voluntarily bringing back a wandering attention, over and over again, is the very root of judgment, character, and will.',
    source_citation: 'William James, The Principles of Psychology (New York: Henry Holt, 1890), vol. I, ch. IV "Habit" (first two passages) and ch. XI "Attention" (last sentence). James\'s italics are not reproduced.',
    source_url: 'https://www.gutenberg.org/ebooks/57628',
  },
  {
    id: 'jung_the_shadow',
    type: 'concept',
    field: 'science',
    thinker: 'Carl Gustav Jung',
    year: 1912,
    title: 'The unconscious reaches back past the individual',
    prompt: 'What in you feels older than your own life story: a fear, a longing, a story that was in you before you learned it?',
    plain_face:
      'Freud had shown that beneath the thoughts we know about lies a cellar of thoughts we do not. Jung, his closest ally until this book, went down another flight of stairs. Below the personal cellar he found a shared one: images and figures (the hero, the mother, the journey through darkness) that appear in the dreams of people who never heard the myths they match. Consciousness is each person\'s private adaptation to the day; the unconscious is what binds us to one another and to everyone who came before. The parts of ourselves we disown, which he later called the shadow, live there too.',
    source_face:
      'The essence of consciousness is the process of adaptation which takes place in the most minute details. On the other hand, the unconscious is the generally diffused, which not only binds the individuals among themselves to the race, but also unites them backwards with the peoples of the past and their psychology. Thus the unconscious, surpassing the individual in its generality, is, in the first place, the object of a true psychology, which claims not to be psychophysical.',
    source_citation: 'C. G. Jung, Psychology of the Unconscious (Wandlungen und Symbole der Libido, 1912), Part II, ch. IV "The Unconscious Origin of the Hero" (trans. Beatrice M. Hinkle, New York: Moffat, Yard, 1916). Jung\'s later term "the shadow" dates from his in-copyright writings of the 1930s and after.',
    source_url: 'https://www.gutenberg.org/ebooks/65903',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Wollstonecraft
  { from: 'sor_juana_reply', to: 'wollstonecraft_reason_has_no_sex', relation: 'converged', note: 'A century apart and with no known contact, both argue that denying women study denies them virtue; Wollstonecraft never cites Sor Juana.' },
  { from: 'wollstonecraft_reason_has_no_sex', to: 'douglass_learning_to_read', relation: 'converged', note: 'Both find that literacy and reason are the way out of subjection; Douglass\'s Narrative (1845) does not mention Wollstonecraft.' },
  { from: 'wollstonecraft_reason_has_no_sex', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
  // Sor Juana
  { from: 'zera_yacob_hatata', to: 'sor_juana_reply', relation: 'converged', note: 'Written within a quarter century of each other in Ethiopia and Mexico, with no contact: both defend the individual\'s reason against inherited religious authority.' },
  { from: 'sor_juana_reply', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },
  // Marx
  { from: 'hegel_master_and_slave', to: 'marx_alienated_labor', relation: 'extended', year: 1844, note: 'Marx took Hegel\'s idea that the worker finds himself in what he makes, and in the 1873 afterword to Capital called his own method "the direct opposite" of Hegel\'s while owning the debt.' },
  { from: 'marx_alienated_labor', to: 'frankl_mans_search_for_meaning', relation: 'converged', note: 'Both hold that work can be where a human life finds its meaning, and that work emptied of meaning deforms the person; Frankl writes as a psychiatrist, not a Marxist.' },
  { from: 'marx_alienated_labor', to: 'sartre_existence_precedes_essence', relation: 'extended', year: 1960, note: 'Sartre later called Marxism the philosophy of his age and tried to fit existentialism inside it (Critique of Dialectical Reason, 1960).' },
  { from: 'marx_alienated_labor', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },
  // William James
  { from: 'aristotle_friendship', to: 'william_james_habit', relation: 'converged', note: 'Aristotle held that we become just by doing just acts (Nicomachean Ethics II.1); James reaches the same conclusion from physiology without citing him in the Habit chapter.' },
  { from: 'william_james_habit', to: 'practice_care_for_the_body', relation: 'lands_on' },
  { from: 'william_james_habit', to: 'practice_examine_daily', relation: 'lands_on' },
  // Jung
  { from: 'freud_pleasure_principle', to: 'jung_the_shadow', relation: 'extended', year: 1912, note: 'Jung names Freud throughout this book and widens his libido concept beyond sex; its publication led to their break in 1913.' },
  { from: 'augustine_restless_heart', to: 'jung_the_shadow', relation: 'converged', note: 'Augustine\'s two wills at war in one person (Confessions VIII) and Jung\'s disowned unconscious both describe a self that is not master in its own house; no direct lineage claimed.' },
  { from: 'william_james_habit', to: 'jung_the_shadow', relation: 'extended', year: 1912, note: 'Jung quotes James\'s Principles on "merely associative" thinking in ch. I of this book and builds his account of undirected, phantasy thinking on it.' },
  { from: 'jung_the_shadow', to: 'practice_examine_daily', relation: 'lands_on' },
  { from: 'patanjali_stilling_the_mind', to: 'william_james_habit', relation: 'converged', note: 'Patañjali makes the stilling of the mind\'s movements the whole of yoga; James calls the faculty of bringing back a wandering attention "the very root of judgment, character, and will". Seventeen centuries apart, no contact.' },
];
