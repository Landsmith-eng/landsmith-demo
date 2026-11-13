// Branch: classical and early-modern thought beyond the line, part four: Thucydides, Plutarch, Chaucer,
// Burke, Copernicus, Kepler, Wundt.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Every passage verified word for word against the Project Gutenberg texts cited.

export const nodes = [
  {
    id: 'thucydides_melian_dialogue',
    type: 'dilemma',
    field: 'philosophy',
    thinker: 'Thucydides',
    year: -410,
    title: 'The Melian dialogue: "the strong do what they can and the weak suffer what they must"',
    prompt: 'Think of a time you had all the power in a negotiation. Did you talk about what was right, or only about what you could get away with?',
    plain_face:
      'In 416 BCE Athens sent a fleet to the small island of Melos and offered a choice: join our empire or be destroyed. Thucydides writes the talks up like a courtroom transcript. The Melians appeal to justice and to the gods; the Athenians answer that fairness only comes up between equals, and that between a big power and a small one, might simply decides. Melos refuses. Athens kills the men and enslaves the women and children, and Thucydides reports it in one flat sentence. He never says who was right. That silence is the dilemma: is this how the world is, or only how Athens chose to be, two years before its own fleet was destroyed at Syracuse?',
    source_face:
      'Athenians. For ourselves, we shall not trouble you with specious pretences—either of how we have a right to our empire because we overthrew the Mede, or are now attacking you because of wrong that you have done us—and make a long speech which would not be believed; and in return we hope that you, instead of thinking to influence us by saying that you did not join the Lacedaemonians, although their colonists, or that you have done us no wrong, will aim at what is feasible, holding in view the real sentiments of us both; since you know as well as we do that right, as the world goes, is only in question between equals in power, while the strong do what they can and the weak suffer what they must.\n\nMelians. As we think, at any rate, it is expedient—we speak as we are obliged, since you enjoin us to let right alone and talk only of interest—that you should not destroy what is our common protection, the privilege of being allowed in danger to invoke what is fair and right …\n\n… the Melians surrendered at discretion to the Athenians, who put to death all the grown men whom they took, and sold the women and children for slaves, and subsequently sent out five hundred colonists and inhabited the place themselves.',
    source_citation: 'Thucydides, The History of the Peloponnesian War, Book V, chs. 89–90 (the Athenian and Melian envoys) and 116 (the end of Melos), trans. Richard Crawley (London: Longmans, 1874)',
    source_url: 'https://www.gutenberg.org/ebooks/7142',
  },
  {
    id: 'plutarch_lives_parallel',
    type: 'text',
    field: 'philosophy',
    thinker: 'Plutarch',
    year: 100,
    title: 'Parallel Lives: "my design is not to write histories, but lives"',
    prompt: 'What small thing someone did this week, a remark or a joke, told you more about them than their job title ever has?',
    plain_face:
      'Plutarch, a Greek priest at Delphi under Roman rule, paired famous Greeks with famous Romans, Alexander with Caesar, and wrote their lives side by side to ask what kind of people they were. He warns at the start of the Alexander that he is not writing history. A battle is a wide shot; a jest at dinner is a close-up of the face, and the face is where character shows. Think of how a good portrait painter spends most of the effort on the eyes and lets the coat stay rough. For fifteen centuries Europeans learned their ancient heroes, and much of their moral sense, from these close-ups; Shakespeare took his Roman plays from them.',
    source_face:
      'It must be borne in mind that my design is not to write histories, but lives. And the most glorious exploits do not always furnish us with the clearest discoveries of virtue or vice in men; sometimes a matter of less moment, an expression or a jest, informs us better of their characters and inclinations, than the most famous sieges, the greatest armaments, or the bloodiest battles whatsoever. Therefore as portrait-painters are more exact in the lines and features of the face in which the character is seen, than in the other parts of the body, so I must be allowed to give my more particular attention to the marks and indications of the souls of men, and while I endeavor by these to portray their lives, may be free to leave more weighty matters and great battles to be treated of by others.',
    source_citation: 'Plutarch, Parallel Lives, Life of Alexander, ch. 1, in Plutarch\'s Lives: The Translation Called Dryden\'s, Corrected from the Greek and Revised by A. H. Clough (Boston: Little, Brown, 1859)',
    source_url: 'https://www.gutenberg.org/ebooks/674',
  },
  {
    id: 'chaucer_pardoners_tale',
    type: 'text',
    field: 'philosophy',
    thinker: 'Geoffrey Chaucer',
    year: 1390,
    title: 'The Pardoner\'s Tale: three men go looking for Death and find a pile of gold',
    prompt: 'What have you chased so hard that you stopped noticing what it was costing you? Who paid?',
    plain_face:
      'Three young drunks in a plague-struck town swear to hunt down Death and kill him. An old man points them to a tree, and under it they find eight bushels of gold. They forget Death at once; by nightfall two have stabbed the third and then drunk the wine he had poisoned for them. So they did find Death after all; they just called him by a different name. The preacher telling the story is himself a swindler whose one sermon text, "greed is the root of evils", he uses to empty the pockets of the pious. Chaucer lets the con man preach the truth, which is its own kind of joke about where wisdom comes from.',
    source_face:
      'My theme is always one, and ever was;\nRadix malorum est cupiditas.\n\n…\n\n"Now, Sirs," quoth he, "if it be you so lief\nTo finde Death, turn up this crooked way,\nFor in that grove I left him, by my fay,\nUnder a tree, and there he will abide;\nNor for your boast he will him nothing hide.\nSee ye that oak? right there ye shall him find.\nGod save you, that bought again mankind,\nAnd you amend!" Thus said this olde man;\nAnd evereach of these riotoures ran,\nTill they came to the tree, and there they found\nOf florins fine, of gold y-coined round,\nWell nigh a seven bushels, as them thought.\nNo longer as then after Death they sought;\n\n…\n\nThus ended be these homicides two,\nAnd eke the false empoisoner also.',
    source_citation: 'Geoffrey Chaucer, The Canterbury Tales, The Pardoner\'s Tale (prologue and tale), modernised-spelling text in The Canterbury Tales and Other Poems, ed. D. Laing Purves (Edinburgh: Nimmo, 1870). "Radix malorum est cupiditas" = "the love of money is the root of all evil", 1 Timothy 6:10.',
    source_url: 'https://www.gutenberg.org/ebooks/2383',
  },
  {
    id: 'burke_little_platoon',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Edmund Burke',
    year: 1790,
    title: '"To love the little platoon we belong to in society"',
    prompt: 'Name your little platoon: the handful of people whose good you actually work for. Is loving them where your larger loyalties start, or where they stop?',
    plain_face:
      'Burke, watching the French Revolution from London in 1790, thought you cannot love humanity by skipping over the people in front of you. Affection is learned like swimming: in the shallow end first. Your family, your street, your workmates and your town are the "little platoon", and loyalty to them is the seed from which love of country and of mankind grow. A revolution that dissolves all the small loyalties to make one big one, he argued, will get neither. Critics have replied that platoons can also be clubs that keep others out; Burke would say that is a reason to widen the circle, not to erase it.',
    source_face:
      'To be attached to the subdivision, to love the little platoon we belong to in society, is the first principle (the germ, as it were) of public affections. It is the first link in the series by which we proceed towards a love to our country and to mankind. The interest of that portion of social arrangement is a trust in the hands of all those who compose it; and as none but bad men would justify it in abuse, none but traitors would barter it away for their own personal advantage.',
    source_citation: 'Edmund Burke, Reflections on the Revolution in France (1790), in The Works of the Right Honourable Edmund Burke, vol. III (London: John C. Nimmo, 1887)',
    source_url: 'https://www.gutenberg.org/ebooks/15679',
  },
  {
    id: 'copernicus_de_revolutionibus',
    type: 'concept',
    field: 'science',
    thinker: 'Nicolaus Copernicus',
    year: 1543,
    title: 'The earth moves: we are not the centre',
    prompt: 'Which belief of yours feels like plain common sense, the ground under your feet? What would it take to move it?',
    plain_face:
      'For two thousand years everyone, including the experts, knew the earth sat still in the middle while the sky turned around it. Copernicus, a Polish canon doing astronomy in his spare time, found that the old system had become a patchwork of circles bolted onto circles, like a monster assembled from parts of different bodies. Put the sun in the middle and let the earth spin and orbit, and the parts fit one body. He sat on the book for decades out of fear of ridicule and saw it printed only in the year he died. Nothing about daily life changed, and everything about where we stand did.',
    source_face:
      'I can easily conceive, most Holy Father, that as soon as some people learn that in this book which I have written concerning the revolutions of the heavenly bodies, I ascribe certain motions to the Earth, they will cry out at once that I and my theory should be rejected. For I am not so much in love with my conclusions as not to weigh what others will think about them …\n\n… but their procedure has been as if someone were to collect hands, feet, a head, and other members from various places, all very fine in themselves, but not proportionate to one body, and no single one corresponding in its turn to the others, so that a monster rather than a man would be formed from them.\n\n… Taking this as a starting point, I began to consider the mobility of the Earth; and although the idea seemed absurd, yet because I knew that the liberty had been granted to others before me to postulate all sorts of little circles for explaining the phenomena of the stars, I thought I also might easily be permitted to try whether by postulating some motion of the Earth, more reliable conclusions could be reached regarding the revolution of the heavenly bodies, than those of my predecessors.',
    source_citation: 'Nicolaus Copernicus, dedication of De revolutionibus orbium coelestium (Nuremberg, 1543) to Pope Paul III, English in Prefaces and Prologues to Famous Books, Harvard Classics vol. 39, ed. Charles W. Eliot (New York: P. F. Collier, 1910); the translator is not named in that edition',
    source_url: 'https://www.gutenberg.org/ebooks/13182',
  },
  {
    id: 'kepler_harmony',
    type: 'concept',
    field: 'science',
    thinker: 'Johannes Kepler',
    year: 1619,
    title: 'The planets move in ellipses, and the heavens are written in geometry',
    prompt: 'Have you ever given up a tidy explanation because of a small fact that would not fit? What did it cost you to let go of the tidy one?',
    plain_face:
      'Kepler believed God had built the heavens as a geometer, so the sky should be readable. He inherited Tycho Brahe\'s precise observations of Mars and tried for years to fit them with circles, as every astronomer since the Greeks had. The best circle missed by eight minutes of arc, a sliver, and Kepler refused to round it away. Think of a tailor who will not call a suit finished while one seam puckers. The shape that fitted was an ellipse with the sun at one focus, and a planet speeds up when near the sun and slows when far. Ten years later he found that the time each planet takes squares with the cube of its distance: the harmony he had been looking for, in numbers.',
    source_face:
      'The conclusions which previously Pena published as disclosed by the aid of optics, started indeed from certain slight supports, rather than foundations, afforded by actual sight, but were proved by long arguments depending one upon another, so that they might be assigned to human reason rather than to sight; but now our very eyes, as if a new door of heaven had been opened, are led to the view of matters once hidden from them.\n\nWith no less certainty also do we decide by the use of this instrument even that famous question, which, coeval with philosophy itself, is disputed to this day by the noblest intellects—I mean, whether the earth can move (as the theory of the Planets greatly requires) without the overthrow of all bodies that have weight, or the confusion of the motion of the elements?\n\n… heavy bodies do not tend to the centre of the universe, supposing the earth to be placed there, because that point is the centre of the universe, but because it is the centre of the earth. So, wherever the earth be set, or whithersoever it be transported, heavy bodies have a continual tendency to it.',
    source_citation: 'Johannes Kepler, preface to the Dioptrice (Augsburg, 1611), first two passages; third passage from his introduction to the Astronomia Nova (Prague, 1609), as quoted in the translator\'s note. Both trans. Edward Stafford Carlos, in The Sidereal Messenger of Galileo Galilei and a Part of the Preface to Kepler\'s Dioptrics (London: Rivingtons, 1880). The elliptical orbits (Astronomia Nova, 1609) and the third law (Harmonices Mundi, 1619) have no public-domain English translation reachable; the plain face summarises them.',
    source_url: 'https://www.gutenberg.org/ebooks/46036',
  },
  {
    id: 'wundt_first_laboratory',
    type: 'thinker',
    field: 'science',
    thinker: 'Wilhelm Wundt',
    year: 1879,
    title: 'The first psychology laboratory: the mind studied under controlled conditions',
    prompt: 'Try it: count your breaths for one minute without changing them. What did paying attention do to the thing you were attending to?',
    plain_face:
      'In 1879 Wundt set aside a room at Leipzig with metronomes, timers and reaction keys, and psychology stopped being a branch of philosophy done from an armchair. The idea was simple: do not ask people what they think happens in their minds; give them a precise stimulus, a click, a flash, and measure what they report and how fast, over and over, like a chemist running the same titration until the numbers settle. Wundt himself distrusted loose introspection; the lab was there to tame it. Students came from all over the world and went home to found laboratories of their own, so that most early psychology departments descend from that room.',
    source_face:
      'For this purpose let us make use of a little instrument to help us--an instrument well known to all who have studied music, i.e. the metronome. … This instrument is not only very useful for teaching singing and music, but it is also a psychological apparatus of the simplest kind. In psychology, as we shall see, we can use it for so many purposes that we are almost justified in saying that with its help we can demonstrate the most important part of the psychology of consciousness.\n\n… Many psychologists thought that this method could be improved by making use of direct introspection. They thought by turning their attention to their own consciousness to be able to explain what happened when we were thinking. … It is obvious to the reader, who has followed our discussion so far, that nothing can be discovered in such experiments, where the most complicated psychical processes are investigated directly and without any further preparation. We need first of all a careful analysis of the more elementary psychical processes, of the facts of attention and of the wider scope of consciousness …',
    source_citation: 'Wilhelm Wundt, An Introduction to Psychology (Einführung in die Psychologie, 1911), ch. I "Consciousness and Attention" and ch. IV "The Processes of Thought", trans. Rudolf Pintner (London: George Allen, 1912)',
    source_url: 'https://www.gutenberg.org/ebooks/46677',
  },
];

export const edges = [
  // Thucydides
  { from: 'herodotus_call_no_man_happy', to: 'thucydides_melian_dialogue', relation: 'extended', year: -410, note: 'Thucydides I.20–22 never names Herodotus but corrects two of his claims (that Spartan kings have two votes each and that there is a "company of Pitane") and sets his own work against "an essay which is to win the applause of the moment", offering instead "a possession for all time".' },
  { from: 'thucydides_melian_dialogue', to: 'hobbes_state_of_nature', relation: 'extended', year: 1629, note: 'Hobbes\'s first published book was his own translation of Thucydides, Eight Bookes of the Peloponnesian Warre (1629); the Leviathan\'s war of all against all restates the Athenians\' claim that between unequals only interest counts. Leviathan does not cite Thucydides by name.' },
  { from: 'thucydides_melian_dialogue', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Plutarch
  { from: 'plutarch_lives_parallel', to: 'montaigne_to_philosophize_is_to_learn_to_die', relation: 'extended', year: 1580, note: 'Montaigne, Essays II.10 "Of Books" (Cotton): "the books that serve me to this purpose are Plutarch, since he has been translated into French, and Seneca"; Plutarch is named about 150 times across the Essays.' },
  { from: 'plutarch_lives_parallel', to: 'practice_examine_daily', relation: 'lands_on' },

  // Chaucer
  { from: 'boethius_wheel_of_fortune', to: 'chaucer_pardoners_tale', relation: 'extended', year: 1380, note: 'Chaucer translated the Consolation of Philosophy into English prose (the Boece, c. 1380), and the rioters\' "This treasure hath Fortune unto us given" turns Boethius\'s wheel: the gift of Fortune is what kills them.' },
  { from: 'chaucer_pardoners_tale', to: 'buddha_craving_root_of_suffering', relation: 'converged', note: 'The Pardoner\'s text (1 Timothy 6:10) makes the love of money the root of evils; the Dhammapada makes thirst the root of suffering. Same diagnosis, no contact between fourteenth-century England and the Pali canon.' },
  { from: 'chaucer_pardoners_tale', to: 'practice_keep_death_in_view', relation: 'lands_on' },

  // Burke
  { from: 'aristotle_friendship', to: 'burke_little_platoon', relation: 'extended', year: 1790, note: 'The Reflections cite Aristotle from memory ("If I recollect rightly, Aristotle observes, that a democracy has many striking points of resemblance with a tyranny", with the Politics passage supplied in a note); Burke\'s platoon grows affection outward from the small circle, as Aristotle\'s friendship holds a city together before justice does.' },
  { from: 'rousseau_born_free', to: 'burke_little_platoon', relation: 'refuted', year: 1790, note: 'The Reflections answer Rousseau by name: "We are not the converts of Rousseau; we are not the disciples of Voltaire", and Burke writes that "were Rousseau alive, and in one of his lucid intervals, he would be shocked at the practical frenzy of his scholars".' },
  { from: 'burke_little_platoon', to: 'tocqueville_individualism', relation: 'extended', year: 1840, note: 'Tocqueville read Burke closely and quotes the Reflections repeatedly in The Old Regime and the Revolution (1856); in Democracy in America the art of association does for democrats what Burke\'s inherited platoons did for the old order.' },
  { from: 'burke_little_platoon', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Copernicus
  { from: 'copernicus_de_revolutionibus', to: 'kepler_harmony', relation: 'extended', year: 1596, note: 'Kepler\'s first book, the Mysterium Cosmographicum (1596), is an open defence of Copernicus; his later laws keep the sun at the centre and replace Copernicus\'s circles with ellipses.' },
  { from: 'copernicus_de_revolutionibus', to: 'galileo_two_books', relation: 'extended', year: 1615, note: 'Galileo\'s Letter to the Grand Duchess Christina (1615) is written to defend the Copernican motion of the earth against objections drawn from scripture; De revolutionibus was placed on the Index the next year.' },
  { from: 'copernicus_de_revolutionibus', to: 'kuhn_paradigm_shift', relation: 'extended', year: 1957, note: 'Kuhn\'s first book, The Copernican Revolution (1957), was a study of this change; it became the model case for the paradigm shifts of The Structure of Scientific Revolutions (1962).' },
  { from: 'copernicus_de_revolutionibus', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Kepler
  { from: 'kepler_harmony', to: 'newton_general_scholium', relation: 'extended', year: 1687, note: 'Principia, Book III, Phenomenon IV, on the periods and distances of the planets: "This proportion, first observed by Kepler, is now received by all astronomers" (Motte); Newton derives Kepler\'s laws from universal gravitation.' },
  { from: 'kepler_harmony', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Wundt
  { from: 'wundt_first_laboratory', to: 'william_james_habit', relation: 'extended', year: 1890, note: 'James\'s preface to The Principles of Psychology (1890) records "the inspiration I have got from the writings of J. S. Mill, Lotze, Renouvier, Hodgson, and Wundt"; the book then reports Wundt\'s reaction-time experiments and disputes his reading of them ("no such succession of conscious feelings as Wundt describes takes place").' },
  { from: 'wundt_first_laboratory', to: 'practice_examine_daily', relation: 'lands_on' },
];
