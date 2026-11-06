// Branch: Western philosophy beyond the line, from Socrates to the existentialists.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Public-domain passages verified word for word against the Project Gutenberg texts cited.
// Sartre and Camus are under copyright: summaries only.

export const nodes = [
  {
    id: 'socrates_unexamined_life',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Socrates',
    year: -399,
    title: '"The unexamined life is not worth living"',
    prompt: 'What is one thing you do every day without ever having asked why?',
    plain_face:
      'On trial for his life, Socrates was offered a way out: go quiet, stop asking questions. He refused. Living without questioning yourself, he said, is like driving a car you never look under the bonnet of: it runs, until one day it doesn\'t, and you have no idea why. He would rather die than stop looking.',
    source_face:
      'Some one will say: Yes, Socrates, but cannot you hold your tongue, and then you may go into a foreign city, and no one will interfere with you? Now I have great difficulty in making you understand my answer to this. For if I tell you that to do as you say would be a disobedience to the God, and therefore that I cannot hold my tongue, you will not believe that I am serious; and if I say again that daily to discourse about virtue, and of those other things about which you hear me examining myself and others, is the greatest good of man, and that the unexamined life is not worth living, you are still less likely to believe me.',
    source_citation: 'Plato, Apology 38a (trans. Benjamin Jowett, 1871)',
    source_url: 'https://www.gutenberg.org/ebooks/1656',
  },
  {
    id: 'montaigne_to_philosophize_is_to_learn_to_die',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Michel de Montaigne',
    year: 1580,
    title: 'To study philosophy is to learn to die',
    prompt: 'If you thought about your death for one minute every day, what would you stop doing first?',
    plain_face:
      'A dog that barks at the vacuum cleaner every time stops once it has seen it a hundred times. Montaigne, a French nobleman who filled his essays with lines from Lucretius, proposed the same cure for death: make it familiar. Think of it when a horse stumbles or a tile falls, and it loses its power to ambush you. Whoever has learned to die, he says, has unlearned how to be a slave.',
    source_face:
      'Let us disarm him of his novelty and strangeness, let us converse and be familiar with him, and have nothing so frequent in our thoughts as death. Upon all occasions represent him to our imagination in his every shape; at the stumbling of a horse, at the falling of a tile, at the least prick with a pin, let us presently consider, and say to ourselves, "Well, and what if it had been death itself?" and, thereupon, let us encourage and fortify ourselves. …\n\nWhere death waits for us is uncertain; let us look for him everywhere. The premeditation of death is the premeditation of liberty; he who has learned to die has unlearned to serve.',
    source_citation: 'Michel de Montaigne, Essays, Book I, ch. 19 (ch. 20 in some editions), "That to study philosophy is to learn to die" (trans. Charles Cotton, 1685–86; ed. W. Carew Hazlitt, 1877)',
    source_url: 'https://www.gutenberg.org/ebooks/3600',
  },
  {
    id: 'descartes_i_think_therefore_i_am',
    type: 'quote',
    field: 'philosophy',
    thinker: 'René Descartes',
    year: 1637,
    title: '"I think, therefore I am"',
    prompt: 'What is one thing you believe that you have never actually checked?',
    plain_face:
      'When a basket of apples might hold a rotten one, you tip them all out and put back only the ones you have checked. Descartes did that with everything he believed: the senses can deceive, dreams feel real, so out it all went. One apple survived. Even while doubting, someone has to be doing the doubting. That much, at least, is certain.',
    source_face:
      'I supposed that all the objects (presentations) that had ever entered into my mind when awake, had in them no more truth than the illusions of my dreams. But immediately upon this I observed that, whilst I thus wished to think that all was false, it was absolutely necessary that I, who thus thought, should be somewhat; and as I observed that this truth, I think, therefore I am (COGITO ERGO SUM), was so certain and of such evidence that no ground of doubt, however extravagant, could be alleged by the sceptics capable of shaking it, I concluded that I might, without scruple, accept it as the first principle of the philosophy of which I was in search.',
    source_citation: 'René Descartes, Discourse on Method, Part IV (1637; trans. John Veitch, 1850)',
    source_url: 'https://www.gutenberg.org/ebooks/59',
  },
  {
    id: 'pascal_sit_quietly_in_a_room',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Blaise Pascal',
    year: 1670,
    title: 'We cannot stay quietly in our own room',
    prompt: 'When did you last sit for ten minutes with nothing to do? What did you reach for?',
    plain_face:
      'Think of how fast your hand goes to your phone in a queue. Pascal, a mathematician who had read Montaigne closely, noticed the same reflex three centuries before phones: we fill every gap with noise, games and errands so we never have to sit alone with ourselves. Most of our trouble, he says, comes from that one inability.',
    source_face:
      'Diversion.—When I have occasionally set myself to consider the different distractions of men, the pains and perils to which they expose themselves at court or in war, whence arise so many quarrels, passions, bold and often bad ventures, etc., I have discovered that all the unhappiness of men arises from one single fact, that they cannot stay quietly in their own chamber.',
    source_citation: 'Blaise Pascal, Pensées, fragment 139 (Brunschvicg numbering; publ. posthumously 1670; trans. W. F. Trotter, Gutenberg text of the E. P. Dutton edition, 1958)',
    source_url: 'https://www.gutenberg.org/ebooks/18269',
  },
  {
    id: 'hume_bundle_of_perceptions',
    type: 'quote',
    field: 'philosophy',
    thinker: 'David Hume',
    year: 1739,
    title: 'The self is a bundle of perceptions',
    prompt: 'Close your eyes and look for "you". What do you actually find?',
    plain_face:
      'A river has a name, but look at it and you only ever see water moving past. Hume tried to catch his own self the same way. Every time he looked inward he found a feeling, a thought, warmth or cold, never the "I" that was supposed to be having them. Maybe, he says, we are just the flow, with no fixed someone underneath.',
    source_face:
      'For my part, when I enter most intimately into what I call myself, I always stumble on some particular perception or other, of heat or cold, light or shade, love or hatred, pain or pleasure. I never can catch myself at any time without a perception, and never can observe any thing but the perception. …\n\nBut setting aside some metaphysicians of this kind, I may venture to affirm of the rest of mankind, that they are nothing but a bundle or collection of different perceptions, which succeed each other with an inconceivable rapidity, and are in a perpetual flux and movement.',
    source_citation: 'David Hume, A Treatise of Human Nature, Book I, Part IV, Section VI, "Of Personal Identity" (1739)',
    source_url: 'https://www.gutenberg.org/ebooks/4705',
  },
  {
    id: 'kierkegaard_fear_and_trembling',
    type: 'text',
    field: 'philosophy',
    thinker: 'Søren Kierkegaard',
    year: 1843,
    title: 'Fear and Trembling: faith is a task for a whole lifetime',
    prompt: 'What is a decision only you can make, that no one else can make for you?',
    plain_face:
      'Everyone in Copenhagen, Kierkegaard complained, claimed to have "gone further" than faith, like people who say they understand a symphony after reading the programme notes. He went back to Abraham, told to sacrifice his son, and refused to make the story comfortable. Some choices no reasoning can make for you; you stand alone with them, and the fear is part of the deal.',
    source_face:
      'In the olden days it was different. Then, faith was a task for a whole life-time because it was held that proficiency in faith was not to be won within a few days or weeks. …\n\nThe fact is, the ethical expression for what Abraham did is that he wanted to murder Isaac; the religious, that he wanted to sacrifice him. But precisely in this contradiction is contained the fear which may well rob one of one\'s sleep. And yet Abraham were not Abraham without this fear.',
    source_citation: 'Søren Kierkegaard (as Johannes de Silentio), Fear and Trembling (1843), Preface and opening chapter, in Selections from the Writings of Kierkegaard (trans. Lee M. Hollander, University of Texas, 1923)',
    source_url: 'https://www.gutenberg.org/ebooks/60333',
  },
  {
    id: 'sartre_existence_precedes_essence',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Jean-Paul Sartre',
    year: 1946,
    title: 'Existence precedes essence',
    prompt: 'If nothing about you were fixed in advance, what would you choose to become?',
    plain_face:
      'A paper-knife is designed before it is made: its purpose comes first. Sartre said people are the other way round. We turn up first, with no blueprint, and become whatever our choices make us. That is freedom, and it is also a weight: there is no "that\'s just how I am" to hide behind.',
    source_face:
      'Summary (work under copyright): Sartre argues that for human beings existence comes before essence. Unlike a manufactured object such as a paper-knife, made to a prior plan, a person first exists and only then defines himself by what he does; there is no fixed human nature laid down in advance. So each of us is wholly responsible for what we make of ourselves, and feels that responsibility as anguish, which Sartre illustrates with Kierkegaard\'s Abraham.',
    source_citation: 'Jean-Paul Sartre, L\'existentialisme est un humanisme (lecture, Paris, October 1945; publ. Nagel, 1946); English: Existentialism and Humanism, trans. Philip Mairet (Methuen, 1948)',
    source_url: null,
  },
  {
    id: 'camus_myth_of_sisyphus',
    type: 'text',
    field: 'philosophy',
    thinker: 'Albert Camus',
    year: 1942,
    title: 'The Myth of Sisyphus: one must imagine Sisyphus happy',
    prompt: 'What task in your life feels like pushing a rock uphill? Could you push it differently?',
    plain_face:
      'The gods punished Sisyphus by making him roll a boulder up a hill forever, only to watch it roll back down. Camus said that is our situation: we want life to mean something and the universe does not answer. His advice is neither despair nor a leap of faith, but to keep pushing with your eyes open, and to find the walk back down the hill your own.',
    source_face:
      'Summary (work under copyright): Camus starts from the absurd, the clash between our demand for meaning and a world that gives none. He rejects both suicide and the "leap" into faith he finds in Kierkegaard and others, which he calls philosophical suicide. What remains is to live lucidly, in revolt, without appeal. His emblem is Sisyphus, condemned to push his rock forever, and the essay ends by telling us we must imagine Sisyphus happy.',
    source_citation: 'Albert Camus, Le Mythe de Sisyphe (Gallimard, 1942); English: The Myth of Sisyphus, trans. Justin O\'Brien (Knopf, 1955)',
    source_url: null,
  },

  // Practice (Saturday) from the concept doc's seven weekly practices.
  {
    id: 'practice_hold_beliefs_loosely',
    type: 'practice',
    field: 'practice',
    title: 'Hold beliefs loosely',
    plain_face: 'Saturday\'s practice. Pick one thing you are sure of and ask what would change your mind. If nothing could, hold it a little more loosely.',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  { from: 'socrates_unexamined_life', to: 'zeno_live_according_to_nature', relation: 'extended', year: -312, note: 'Zeno turned to philosophy after reading Xenophon\'s memoir of Socrates in an Athens bookshop (Diogenes Laërtius VII.2–3).' },
  { from: 'socrates_unexamined_life', to: 'practice_examine_daily', relation: 'lands_on' },
  { from: 'socrates_unexamined_life', to: 'kierkegaard_fear_and_trembling', relation: 'extended', year: 1841, note: 'Kierkegaard\'s doctoral thesis was The Concept of Irony, with Continual Reference to Socrates.' },
  { from: 'lucretius_death_nothing_to_us', to: 'montaigne_to_philosophize_is_to_learn_to_die', relation: 'extended', year: 1580, note: 'Montaigne\'s essay on learning to die quotes Lucretius\'s Book III on death again and again.' },
  { from: 'montaigne_to_philosophize_is_to_learn_to_die', to: 'practice_keep_death_in_view', relation: 'lands_on' },
  { from: 'montaigne_to_philosophize_is_to_learn_to_die', to: 'pascal_sit_quietly_in_a_room', relation: 'extended', note: 'Pascal read Montaigne closely and argues with him throughout the Pensées: "It is not in Montaigne, but in myself, that I find all that I see in him."' },
  { from: 'descartes_i_think_therefore_i_am', to: 'pascal_sit_quietly_in_a_room', relation: 'refuted', note: 'Pascal, a younger contemporary, rejected Descartes\'s philosophy: "I cannot forgive Descartes" (Pensées 77).' },
  { from: 'descartes_i_think_therefore_i_am', to: 'spinoza_freedom_understanding_necessity', relation: 'extended', year: 1663, note: 'Spinoza\'s first published book was an exposition of Descartes\'s Principles of Philosophy.' },
  { from: 'descartes_i_think_therefore_i_am', to: 'hume_bundle_of_perceptions', relation: 'refuted', year: 1739, note: 'Hume denies the Cartesian claim that we are directly aware of a single, continuing self: look inside and you find only perceptions.' },
  { from: 'descartes_i_think_therefore_i_am', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
  { from: 'buddha_craving_root_of_suffering', to: 'hume_bundle_of_perceptions', relation: 'converged', note: 'The Buddha\'s teaching of no fixed self and Hume\'s bundle of perceptions reach the same picture, with no known contact.' },
  { from: 'pascal_sit_quietly_in_a_room', to: 'practice_examine_daily', relation: 'lands_on' },
  { from: 'kierkegaard_fear_and_trembling', to: 'sartre_existence_precedes_essence', relation: 'extended', year: 1945, note: 'Sartre\'s lecture borrows Kierkegaard\'s Abraham to explain the anguish of choosing.' },
  { from: 'zeno_live_according_to_nature', to: 'sartre_existence_precedes_essence', relation: 'refuted', year: 1945, note: 'Sartre denies there is any given human nature, the premise of living "in agreement with nature".' },
  { from: 'kierkegaard_fear_and_trembling', to: 'camus_myth_of_sisyphus', relation: 'refuted', year: 1942, note: 'Camus names Kierkegaard\'s leap of faith as a form of "philosophical suicide" and refuses it.' },
  { from: 'nietzsche_amor_fati', to: 'camus_myth_of_sisyphus', relation: 'extended', year: 1942, note: 'Camus quotes Nietzsche throughout the essay; his happy Sisyphus is a cousin of amor fati.' },
  { from: 'epictetus_up_to_us', to: 'pascal_sit_quietly_in_a_room', relation: 'extended', year: 1660, note: 'Pascal names "Epictetus, Montaigne" as the writers whose manner is "the most remembered, and the oftenest quoted," and argues with Epictetus throughout the Pensées.' },
  { from: 'montaigne_to_philosophize_is_to_learn_to_die', to: 'nietzsche_amor_fati', relation: 'extended', year: 1874, note: 'Nietzsche ranked Montaigne beside Schopenhauer for honesty: "The joy of living on this earth is increased by the existence of such a man" (Schopenhauer as Educator, trans. Collins).' },
];
