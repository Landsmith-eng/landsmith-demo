// Branch: classical and early-modern thought beyond the line, part three: Herodotus, Euclid, Petrarch,
// Berkeley, Milton, Tocqueville.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Every passage verified word for word against the Project Gutenberg or Perseus texts cited.

export const nodes = [
  {
    id: 'herodotus_call_no_man_happy',
    type: 'text',
    field: 'philosophy',
    thinker: 'Herodotus',
    year: -430,
    title: 'Call no man happy until he is dead',
    prompt: 'If your life were a story that ended today, how would it read? What would you want the last chapter to change?',
    plain_face:
      'Croesus, the richest king alive, shows the Athenian sage Solon his treasury and asks, fishing for the answer, who is the happiest man he has met. Solon names a farmer who died well in battle, and two brothers who died in their sleep after an act of kindness. Croesus is furious. Solon explains: a life is like a match, and you cannot call it won at half time. Luck can turn in any one of your twenty-six thousand days; until the last one, you are only "fortunate". Herodotus then shows Croesus losing his son, his kingdom and nearly his life, and, on the pyre, calling Solon\'s name.',
    source_face:
      'As for thee, I perceive that thou art both great in wealth and king of many men, but that of which thou didst ask me I cannot call thee yet, until I learn that thou hast brought thy life to a fair ending: for the very rich man is not at all to be accounted more happy than he who has but his subsistence from day to day, unless also the fortune go with him of ending his life well in possession of all things fair. …\n\n… but before he comes to his end it is well to hold back and not to call him yet happy but only fortunate. …\n\nBut we must of every thing examine the end and how it will turn out at the last, for to many God shows but a glimpse of happiness and then plucks them up by the roots and overturns them.',
    source_citation: 'Herodotus, The Histories, Book I, ch. 32 (Solon to Croesus), trans. G. C. Macaulay (London: Macmillan, 1890)',
    source_url: 'https://www.gutenberg.org/ebooks/2707',
  },
  {
    id: 'euclid_proof',
    type: 'concept',
    field: 'science',
    thinker: 'Euclid',
    year: -300,
    title: 'Proof: start from a few things you grant, and everything else follows',
    prompt: 'Take one belief you hold firmly. What are the two or three things you would have to grant first for it to follow? Do you actually grant them?',
    plain_face:
      'Euclid\'s Elements opens with a short list of things you are asked to grant: you can draw a straight line between any two points, you can draw a circle, all right angles are equal. Then, step by careful step, it builds. By the end of Book I it has proved the Pythagorean theorem, and nothing on the way was taken on trust. Think of a game where you agree the rules before the first move; after that, no one can argue about the score. That is the invention here, bigger than any single theorem: the idea that a claim can be shown, not merely asserted, and shown to anyone willing to follow the steps.',
    source_face:
      'Let the following be postulated:\n1. To draw a straight line from any point to any point.\n2. To produce a finite straight line continuously in a straight line.\n3. To describe a circle with any centre and distance.\n4. That all right angles are equal to one another.\n5. That, if a straight line falling on two straight lines make the interior angles on the same side less than two right angles, the two straight lines, if produced indefinitely, meet on that side on which are the angles less than the two right angles.\n\n…\n\nProposition 47. In right-angled triangles the square on the side subtending the right angle is equal to the squares on the sides containing the right angle.',
    source_citation: 'Euclid, Elements, Book I, Postulates 1–5 and Proposition 47 (trans. Sir Thomas L. Heath, The Thirteen Books of Euclid\'s Elements, Cambridge University Press, 1908; Perseus Digital Library text)',
    source_url: 'https://www.perseus.tufts.edu/hopper/text?doc=Perseus%3Atext%3A1999.01.0086%3Abook%3D1%3Atype%3DPost%3Anumber%3D1',
  },
  {
    id: 'petrarch_mont_ventoux',
    type: 'text',
    field: 'philosophy',
    thinker: 'Petrarch',
    year: 1336,
    title: 'The ascent of Mont Ventoux: he climbs a mountain and finds himself',
    prompt: 'When did you last go somewhere just to see the view? What did you notice about yourself while you were looking?',
    plain_face:
      'In April 1336 the poet Petrarch climbed the big windy mountain near Avignon for no reason except to see what was up there, which was an odd thing to do then. At the summit, dazzled by the view of the Rhône and the Alps, he opens the pocket copy of Augustine\'s Confessions he always carried, at random, like cracking a fortune cookie. The line under his finger says that people go off to marvel at mountains and oceans and stars, and never look at themselves. He shuts the book, says nothing all the way down, and writes this letter that night. It is often called the first modern piece of self-examination outdoors.',
    source_face:
      'I opened the compact little volume, small indeed in size, but of infinite charm, with the intention of reading whatever came to hand, for I could happen upon nothing that would be otherwise than edifying and devout. Now it chanced that the tenth book presented itself. My brother, waiting to hear something of St. Augustine\'s from my lips, stood attentively by. I call him, and God too, to witness that where I first fixed my eyes it was written: "And men go about to wonder at the heights of the mountains, and the mighty waves of the sea, and the wide sweep of rivers, and the circuit of the ocean, and the revolution of the stars, but themselves they consider not." I was abashed, and, asking my brother (who was anxious to hear more), not to annoy me, I closed the book, angry with myself that I should still be admiring earthly things who might long ago have learned from even the pagan philosophers that nothing is wonderful but the soul, which, when great itself, finds nothing great outside itself. Then, in truth, I was satisfied that I had seen enough of the mountain; I turned my inward eye upon myself, and from that time not a syllable fell from my lips until we reached the bottom again.',
    source_citation: 'Petrarch, "The Ascent of Mount Ventoux", letter to Dionigi da Borgo San Sepolcro (Familiares IV.1, dated Malaucène, 26 April 1336), trans. James Harvey Robinson, in Robinson and H. W. Rolfe, Petrarch: The First Modern Scholar and Man of Letters (New York: G. P. Putnam\'s Sons, 1898). The sentence he reads is Augustine, Confessions X.8.',
    source_url: 'https://www.gutenberg.org/ebooks/48776',
  },
  {
    id: 'berkeley_esse_est_percipi',
    type: 'quote',
    field: 'philosophy',
    thinker: 'George Berkeley',
    year: 1710,
    title: '"Their esse is percipi": to be is to be perceived',
    prompt: 'Describe your kitchen table without mentioning anything you see, touch or could see or touch. What is left?',
    plain_face:
      'Berkeley, an Irish bishop, asks what you actually mean when you say the table exists. You mean you see it and feel it, or that you would if you walked in, or that someone else is seeing it now. Strip away every seeing and touching and there is nothing left to point to. So, he says, for things like tables, to be simply is to be perceived. A video game level only exists while something is rendering it. Berkeley\'s world is like that, except the thing always rendering it is God\'s mind, which is why the table is still there when you leave the room.',
    source_face:
      'The table I write on I say exists, that is, I see and feel it; and if I were out of my study I should say it existed—meaning thereby that if I was in my study I might perceive it, or that some other spirit actually does perceive it. … There was an odour, that is, it was smelt; there was a sound, that is, it was heard; a colour or figure, and it was perceived by sight or touch. This is all that I can understand by these and the like expressions. For as to what is said of the absolute existence of unthinking things without any relation to their being perceived, that seems perfectly unintelligible. Their esse is percipi, nor is it possible they should have any existence out of the minds or thinking things which perceive them.',
    source_citation: 'George Berkeley, A Treatise Concerning the Principles of Human Knowledge (1710), Part I, §3 (text of the 1734 edition; the Gutenberg text prints "ESSE" and "PERCIPI" in capitals for the original\'s italics)',
    source_url: 'https://www.gutenberg.org/ebooks/4723',
  },
  {
    id: 'milton_mind_is_its_own_place',
    type: 'quote',
    field: 'philosophy',
    thinker: 'John Milton',
    year: 1667,
    title: '"The mind is its own place"',
    prompt: 'Where are you right now, in your head rather than on the map? Who put you there?',
    plain_face:
      'Satan has just been thrown out of Heaven and lands in a lake of fire. His first speech on his feet is a declaration: it does not matter where I am, because the mind makes its own weather; it can turn a hell into a heaven and a heaven into a hell. It is a Stoic thought, and a true one, which is exactly the trap. Milton puts it in the mouth of the one character who will spend the whole poem proving its other half: a mind that can make a heaven of hell can make a hell anywhere, and Satan later admits, "Which way I flie is Hell; my self am Hell."',
    source_face:
      'Farewel happy Fields\nWhere Joy for ever dwells: Hail horrours, hail\nInfernal world, and thou profoundest Hell\nReceive thy new Possessor: One who brings\nA mind not to be chang’d by Place or Time.\nThe mind is its own place, and in it self\nCan make a Heav’n of Hell, a Hell of Heav’n.\nWhat matter where, if I be still the same,\nAnd what I should be, all but less then hee\nWhom Thunder hath made greater?',
    source_citation: 'John Milton, Paradise Lost (1667), Book I, lines 249–258 (Satan\'s first speech in Hell); text of the 1667 first edition with its spelling',
    source_url: 'https://www.gutenberg.org/ebooks/20',
  },
  {
    id: 'tocqueville_individualism',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Alexis de Tocqueville',
    year: 1840,
    title: 'Individualism: the calm withdrawal into a little circle of one\'s own',
    prompt: 'Outside your family and a few friends, what do you belong to? When did you last join anything?',
    plain_face:
      'Tocqueville, a young French aristocrat touring America in 1831, needed a new word for what he saw coming. Not selfishness, which is hot and old; this was cool and reasonable: each person draws a small circle around family and friends and quietly leaves everyone else to look after themselves. It is like a town where every house has its own well, so no one bothers with the river. His warning: that calm withdrawal dries up public life, and then private life after it. His hope was the other thing he saw everywhere in America: people forming associations for everything, from building a church to sending missionaries abroad.',
    source_face:
      'Individualism is a novel expression, to which a novel idea has given birth. Our fathers were only acquainted with egotism. Egotism is a passionate and exaggerated love of self, which leads a man to connect everything with his own person, and to prefer himself to everything in the world. Individualism is a mature and calm feeling, which disposes each member of the community to sever himself from the mass of his fellow-creatures; and to draw apart with his family and his friends; so that, after he has thus formed a little circle of his own, he willingly leaves society at large to itself.\n\n…\n\nAmericans of all ages, all conditions, and all dispositions, constantly form associations. They have not only commercial and manufacturing companies, in which all take part, but associations of a thousand other kinds—religious, moral, serious, futile, extensive, or restricted, enormous or diminutive.',
    source_citation: 'Alexis de Tocqueville, Democracy in America, vol. II (1840), Book II, ch. II "Of Individualism in Democratic Countries" and ch. V "Of the Use Which the Americans Make of Public Associations in Civil Life", trans. Henry Reeve (1840)',
    source_url: 'https://www.gutenberg.org/ebooks/816',
  },
];

export const edges = [
  // Herodotus
  { from: 'herodotus_call_no_man_happy', to: 'aristotle_friendship', relation: 'extended', year: -340, note: 'In the same Nicomachean Ethics (Book I, ch. 10; ch. VIII in Chase\'s numbering) Aristotle asks whether, "as Solon would have us", we should call no man happy while he lives, and answers that happiness is an activity, so the living can be called happy.' },
  { from: 'herodotus_call_no_man_happy', to: 'kahneman_peak_end', relation: 'converged', note: 'Solon judges a life by its ending; Kahneman found that memory judges an experience by its peak and its end, not its length. Same weighting, no contact: Kahneman measured a bias, Solon preached a caution.' },
  { from: 'herodotus_call_no_man_happy', to: 'practice_keep_death_in_view', relation: 'lands_on' },

  // Euclid
  { from: 'euclid_proof', to: 'descartes_i_think_therefore_i_am', relation: 'extended', year: 1637, note: 'Discourse on Method, Part II: "The long chains of simple and easy reasonings by means of which geometers are accustomed to reach the conclusions of their most difficult demonstrations" led Descartes to imagine all knowledge connected the same way.' },
  { from: 'euclid_proof', to: 'spinoza_freedom_understanding_necessity', relation: 'extended', year: 1677, note: 'Spinoza\'s Ethics is laid out as definitions, axioms and numbered propositions with proofs; its Part III preface announces it will treat "human vice and folly geometrically".' },
  { from: 'euclid_proof', to: 'newton_general_scholium', relation: 'extended', year: 1687, note: 'The Principia takes Euclid\'s form: definitions, then axioms (the laws of motion), then propositions proved in geometrical style.' },
  { from: 'euclid_proof', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Petrarch
  { from: 'augustine_restless_heart', to: 'petrarch_mont_ventoux', relation: 'extended', year: 1336, note: 'At the summit Petrarch opens his pocket Confessions at Book X and reads Augustine\'s line about men who wonder at mountains "but themselves they consider not"; the letter itself records it.' },
  { from: 'petrarch_mont_ventoux', to: 'montaigne_to_philosophize_is_to_learn_to_die', relation: 'extended', year: 1580, note: 'Montaigne quotes Petrarch\'s verse in the Essays (for example in "Of Sorrow" and "Of Cato the Younger") and makes the inward turn of this letter a whole book\'s method, though he never cites the letter itself.' },
  { from: 'petrarch_mont_ventoux', to: 'practice_examine_daily', relation: 'lands_on' },

  // Berkeley
  { from: 'locke_blank_slate', to: 'berkeley_esse_est_percipi', relation: 'extended', year: 1710, note: 'Berkeley keeps Locke\'s starting point, ideas received by sense, and argues away the Essay\'s abstract ideas and matter; his Introduction quotes Locke\'s Essay on Human Understanding (IV.vii.9) at length in order to answer it.' },
  { from: 'berkeley_esse_est_percipi', to: 'hume_bundle_of_perceptions', relation: 'extended', year: 1739, note: 'Treatise I.i.7 credits "a great philosopher" (the note names Dr. Berkeley) with "one of the greatest and most valuable discoveries that has been made of late years": that general ideas are only particular ones.' },
  { from: 'shankara_rope_and_snake', to: 'berkeley_esse_est_percipi', relation: 'converged', note: 'Both deny that the sensed world exists on its own apart from a perceiving mind, with no contact; they part at the end: Berkeley\'s world rests in God\'s perceiving, Shankara\'s dissolves into Brahman.' },
  { from: 'berkeley_esse_est_percipi', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Milton
  { from: 'milton_mind_is_its_own_place', to: 'frankl_mans_search_for_meaning', relation: 'converged', note: 'Satan\'s boast that the mind makes its own place is, in a camp rather than a pit, Frankl\'s last freedom to choose one\'s attitude; Frankl does not cite Milton.' },
  { from: 'milton_mind_is_its_own_place', to: 'practice_control_your_response', relation: 'lands_on' },

  // Tocqueville
  { from: 'tocqueville_individualism', to: 'harvard_study_adult_development', relation: 'measured', year: 1938, note: 'Tocqueville claimed that withdrawing into a little circle starves a life; the Harvard Study, following its men for eight decades, found that the breadth and warmth of their bonds predicted their health and happiness. The study does not cite him.' },
  { from: 'tocqueville_individualism', to: 'practice_invest_in_people', relation: 'lands_on' },
];
