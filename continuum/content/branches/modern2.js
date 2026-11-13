// Branch: modern philosophy beyond the line, part two: Kant, Mill, Thoreau, Douglass, Tolstoy.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Public-domain passages verified word for word against the Project Gutenberg / Wikisource texts cited.

export const nodes = [
  {
    id: 'kant_ends_not_means',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Immanuel Kant',
    year: 1785,
    title: 'Treat people as ends, never merely as means',
    prompt: 'Who did you deal with today purely for what they could do for you? What would it have cost to see the person as well?',
    plain_face:
      'A hammer is good for what it does; when it stops being useful you throw it away. Kant says a person is never like that. Of course we use each other every day, at the shop counter and at work, but a person always has a worth of their own that no usefulness adds to and no uselessness removes. His one rule: use people if you must, but never only use them.',
    source_face:
      'Now I say: man and generally any rational being exists as an end in himself, not merely as a means to be arbitrarily used by this or that will, but in all his actions, whether they concern himself or other rational beings, must be always regarded at the same time as an end. …\n\nAccordingly the practical imperative will be as follows: So act as to treat humanity, whether in thine own person or in that of any other, in every case as an end withal, never as means only.',
    source_citation: 'Immanuel Kant, Fundamental Principles of the Metaphysic of Morals (Groundwork, 1785), Second Section (trans. Thomas Kingsmill Abbott, 1873)',
    source_url: 'https://www.gutenberg.org/ebooks/5682',
  },
  {
    id: 'mill_ask_whether_you_are_happy',
    type: 'quote',
    field: 'philosophy',
    thinker: 'John Stuart Mill',
    year: 1873,
    title: 'Ask yourself whether you are happy, and you cease to be so',
    prompt: 'When were you last so absorbed in something that you forgot to check how you felt?',
    plain_face:
      'Mill was raised from childhood to make the world happier, and at twenty he broke down: he realised that even if every reform he wanted came true, he would not be glad. What pulled him out was a discovery, not a cure. Happiness is like sleep: stare at it and it will not come. Fix your mind on a person, a craft, a cause, and it arrives by the way.',
    source_face:
      'Those only are happy (I thought) who have their minds fixed on some object other than their own happiness; on the happiness of others, on the improvement of mankind, even on some art or pursuit, followed not as a means, but as itself an ideal end. Aiming thus at something else, they find happiness by the way. … Ask yourself whether you are happy, and you cease to be so. The only chance is to treat, not happiness, but some end external to it, as the purpose of life.',
    source_citation: 'John Stuart Mill, Autobiography (1873), ch. V, "A Crisis in My Mental History"',
    source_url: 'https://www.gutenberg.org/ebooks/10378',
  },
  {
    id: 'thoreau_live_deliberately',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Henry David Thoreau',
    year: 1854,
    title: '"I went to the woods because I wished to live deliberately"',
    prompt: 'If you cut your life down to its lowest terms for a month, what would you keep, and what would you be relieved to drop?',
    plain_face:
      'Thoreau built a cabin by a pond outside his home town and lived in it for two years, to run an experiment on himself. Strip a life back the way a mechanic strips an engine, down to the parts that actually do something, and see what is left. He did not want to reach the end and find he had never really lived. The body, he adds, is the one temple every person builds, and the material is your own flesh and habits.',
    source_face:
      'I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived. I did not wish to live what was not life, living is so dear; nor did I wish to practise resignation, unless it was quite necessary. I wanted to live deep and suck out all the marrow of life, to live so sturdily and Spartan-like as to put to rout all that was not life, to cut a broad swath and shave close, to drive life into a corner, and reduce it to its lowest terms, and, if it proved to be mean, why then to get the whole and genuine meanness of it, and publish its meanness to the world; or if it were sublime, to know it by experience, and be able to give a true account of it in my next excursion.\n\nEvery man is the builder of a temple, called his body, to the god he worships, after a style purely his own, nor can he get off by hammering marble instead. We are all sculptors and painters, and our material is our own flesh and blood and bones.',
    source_citation: 'Henry David Thoreau, Walden (1854), "Where I Lived, and What I Lived For" and "Higher Laws"',
    source_url: 'https://www.gutenberg.org/ebooks/205',
  },
  {
    id: 'douglass_learning_to_read',
    type: 'text',
    field: 'philosophy',
    thinker: 'Frederick Douglass',
    year: 1845,
    title: 'Narrative of the Life of Frederick Douglass: learning to read',
    prompt: 'What is one thing you were told not to learn, or not to ask about? What did the warning tell you?',
    plain_face:
      'Douglass was an enslaved boy in Baltimore when his master forbade his mistress to teach him letters, saying that a slave who could read could not be kept. The man meant it as a rule; the boy heard it as a map. A locked door tells you exactly where the treasure is. From that moment he taught himself to read, by any means, and the book you are reading from is the result.',
    source_face:
      'Now," said he, "if you teach that nigger (speaking of myself) how to read, there would be no keeping him. It would forever unfit him to be a slave. He would at once become unmanageable, and of no value to his master. As to himself, it could do him no good, but a great deal of harm. It would make him discontented and unhappy." These words sank deep into my heart, stirred up sentiments within that lay slumbering, and called into existence an entirely new train of thought. It was a new and special revelation, explaining dark and mysterious things, with which my youthful understanding had struggled, but struggled in vain. I now understood what had been to me a most perplexing difficulty—to wit, the white man\'s power to enslave the black man. It was a grand achievement, and I prized it highly. From that moment, I understood the pathway from slavery to freedom. … Though conscious of the difficulty of learning without a teacher, I set out with high hope, and a fixed purpose, at whatever cost of trouble, to learn how to read.',
    source_citation: 'Frederick Douglass, Narrative of the Life of Frederick Douglass, an American Slave (Boston: Anti-Slavery Office, 1845), ch. VI. The quoted slur is printed as in the original.',
    source_url: 'https://www.gutenberg.org/ebooks/23',
  },
  {
    id: 'tolstoy_a_confession',
    type: 'text',
    field: 'philosophy',
    thinker: 'Leo Tolstoy',
    year: 1882,
    title: 'A Confession',
    prompt: 'If you knew for certain that everything you are working on would be forgotten, what would still be worth doing tomorrow morning?',
    plain_face:
      'At fifty, with War and Peace and Anna Karenina behind him, a happy family and good health, Tolstoy found he could not go on: every wish ran into the fact that he would die and all of it would be erased. He retold an old fable: a man hangs from a twig in a well, a dragon waiting below, two mice gnawing the twig, licking honey from a leaf. The honey is family and work. The question that would not let him go: is there any meaning in my life that my death does not wipe out?',
    source_face:
      'There is an Eastern fable, told long ago, of a traveller overtaken on a plain by an enraged beast. Escaping from the beast he gets into a dry well, but sees at the bottom of the well a dragon that has opened its jaws to swallow him. And the unfortunate man, not daring to climb out lest he should be destroyed by the enraged beast, and not daring to leap to the bottom of the well lest he should be eaten by the dragon, seizes a twig growing in a crack in the well and clings to it. His hands are growing weaker and he feels he will soon have to resign himself to the destruction that awaits him above or below, but still he clings on. Then he sees that two mice, a black one and a white one, go regularly round and round the stem of the twig to which he is clinging and gnaw at it. And soon the twig itself will snap and he will fall into the dragon\'s jaws. The traveller sees this and knows that he will inevitably perish; but while still hanging he looks around, sees some drops of honey on the leaves of the twig, reaches them with his tongue and licks them. So I too clung to the twig of life, knowing that the dragon of death was inevitably awaiting me, ready to tear me to pieces; and I could not understand why I had fallen into such torment.',
    source_citation: 'Leo Tolstoy, A Confession (written 1879–80, published 1882), ch. IV (trans. Aylmer Maude, Oxford World\'s Classics, 1921)',
    source_url: 'https://en.wikisource.org/wiki/A_Confession_(Maude%27s_translation)/IV',
  },

  // Practice (Monday). The same practice may appear in several files; the first copy wins.
  {
    id: 'practice_care_for_the_body',
    type: 'practice',
    field: 'practice',
    title: 'Care for the body',
    plain_face: 'Monday\'s practice. Do one plain thing for the body you think with: walk, sleep on time, eat something real, put the screen down an hour early. It is the only temple you will ever build.',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
// converged is symmetric (no contact); lands_on points from any node to a practice.
export const edges = [
  { from: 'hume_bundle_of_perceptions', to: 'kant_ends_not_means', relation: 'extended', year: 1783, note: 'Kant: "the suggestion of David Hume was the very thing, which many years ago first interrupted my dogmatic slumber" (Prolegomena, 1783).' },
  { from: 'kant_ends_not_means', to: 'nietzsche_amor_fati', relation: 'refuted', year: 1888, note: 'Nietzsche: "to possess a virtue merely because one happens to respect the concept \'virtue,\' as Kant would have us do, is pernicious" (The Antichrist §11).' },
  { from: 'kant_ends_not_means', to: 'practice_invest_in_people', relation: 'lands_on' },
  { from: 'epicurus_absence_of_pain', to: 'mill_ask_whether_you_are_happy', relation: 'extended', year: 1861, note: 'Mill places himself in the line of "every writer, from Epicurus to Bentham, who maintained the theory of utility" (Utilitarianism, ch. II).' },
  { from: 'mill_ask_whether_you_are_happy', to: 'frankl_mans_search_for_meaning', relation: 'converged', note: 'Both found that happiness cannot be aimed at directly and comes only as a by-product of devotion to something else; Frankl does not cite Mill.' },
  { from: 'mill_ask_whether_you_are_happy', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },
  { from: 'gita_act_without_attachment_to_fruits', to: 'thoreau_live_deliberately', relation: 'extended', year: 1854, note: 'Thoreau at the pond: "In the morning I bathe my intellect in the stupendous and cosmogonal philosophy of the Bhagvat Geeta" (Walden, "The Pond in Winter").' },
  { from: 'epictetus_up_to_us', to: 'thoreau_live_deliberately', relation: 'converged', note: 'Both reduce life to what is actually one\'s own and let the rest go; Walden never names the Stoics.' },
  { from: 'thoreau_live_deliberately', to: 'practice_care_for_the_body', relation: 'lands_on' },
  { from: 'epictetus_up_to_us', to: 'douglass_learning_to_read', relation: 'converged', note: 'Both were born enslaved and located freedom in the mind no master can reach; Douglass does not cite Epictetus.' },
  { from: 'douglass_learning_to_read', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },
  { from: 'schopenhauer_will_source_of_suffering', to: 'tolstoy_a_confession', relation: 'extended', year: 1882, note: 'A Confession ch. VI quotes Schopenhauer at length: "Life is that which should not be—an evil; and the passage into Nothingness is the only good in life".' },
  { from: 'buddha_craving_root_of_suffering', to: 'tolstoy_a_confession', relation: 'extended', year: 1882, note: 'A Confession ch. VI retells the story of "Sakya Muni, a young, happy prince" who meets old age, sickness and death, as one of the four answers of human wisdom.' },
  { from: 'tolstoy_a_confession', to: 'practice_keep_death_in_view', relation: 'lands_on' },
];
