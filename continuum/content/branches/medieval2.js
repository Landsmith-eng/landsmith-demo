// Branch: medieval crossovers, batch 2 (Mesopotamia, Latin scholasticism, Andalusian Islam and Judaism).
// Walk-only nodes (no seq). Every source_face below was checked word for word against the cited
// public-domain text on Project Gutenberg (ebook ids in source_url).

export const nodes = [
  {
    id: 'gilgamesh_siduri_seize_the_day',
    type: 'text',
    field: 'religion',
    thinker: 'Epic of Gilgamesh (Siduri)',
    year: -1800,
    title: 'Fill your belly, hold your child: this is the lot of mankind',
    prompt: 'If you knew for certain you would never escape death, what would you do with tonight?',
    plain_face:
      'A man who has just buried his best friend runs to the edge of the world looking for a way out of dying. He meets a woman who keeps a tavern by the sea, and she tells him what any good barkeeper might: you will not find it. Wash your hair, put on clean clothes, eat well, hold the little one by the hand, let your wife be glad of you. That is the whole of what people get, and it is enough. It is the oldest version of "seize the day" we have, written down almost four thousand years ago.',
    source_face:
      '"Why, O Gish, does thou run about?\nThe life that thou seekest, thou wilt not find.\nWhen the gods created mankind,\nDeath they imposed on mankind;\nLife they kept in their power.\nThou, O Gish, fill thy belly,\nDay and night do thou rejoice,\nDaily make a rejoicing!\nDay and night a renewal of jollification!\nLet thy clothes be clean,\nWash thy head and pour water over thee!\nCare for the little one who takes hold of thy hand!\nLet the wife rejoice in thy bosom!"',
    source_citation: 'Epic of Gilgamesh, Old Babylonian version, the tavern-keeper (Sabitum / Siduri) to Gilgamesh ("Gish"), Meissner fragment, as translated in Morris Jastrow and Albert T. Clay, An Old Babylonian Version of the Gilgamesh Epic (Yale Oriental Series, 1920), p. 12',
    source_url: 'https://www.gutenberg.org/ebooks/11000',
  },
  {
    id: 'aquinas_unjust_law_is_no_law',
    type: 'quote',
    field: 'religion',
    thinker: 'Thomas Aquinas',
    year: 1270,
    title: 'An unjust law is no law at all',
    prompt: 'Is there a rule you obey only because it is a rule? What would make you stop?',
    plain_face:
      'A counterfeit banknote looks like money, but it is not money, and a shopkeeper who refuses it is not stealing. Aquinas, a Dominican friar teaching in Paris, said the same of laws. A real law is a rule made for everyone\'s good by someone with the right to make it, and it binds you in conscience. A rule that serves the ruler\'s greed or vanity, or that lands unfairly on some, is not a weaker law; it is violence dressed as law, and you owe it no inner obedience.',
    source_face:
      'Laws framed by man are either just or unjust. If they be just, they have the power of binding in conscience, from the eternal law whence they are derived … Now laws are said to be just, both from the end, when, to wit, they are ordained to the common good--and from their author, that is to say, when the law that is made does not exceed the power of the lawgiver--and from their form, when, to wit, burdens are laid on the subjects, according to an equality of proportion and with a view to the common good. …\n\nOn the other hand laws may be unjust in two ways: first, by being contrary to human good … as when an authority imposes on his subjects burdensome laws, conducive, not to the common good, but rather to his own cupidity or vainglory … The like are acts of violence rather than laws; because, as Augustine says (De Lib. Arb. i, 5), "a law that is not just, seems to be no law at all." Wherefore such laws do not bind in conscience, except perhaps in order to avoid scandal or disturbance …\n\n… every human law has just so much of the nature of law, as it is derived from the law of nature. But if in any point it deflects from the law of nature, it is no longer a law but a perversion of law.',
    source_citation: 'Thomas Aquinas, Summa Theologica I-II, q. 96, a. 4 ("Whether human law binds a man in conscience?") and q. 95, a. 2 (trans. Fathers of the English Dominican Province, 1911–20; Benziger Brothers ed.)',
    source_url: 'https://www.gutenberg.org/ebooks/17897',
  },
  {
    id: 'averroes_decisive_treatise',
    type: 'concept',
    field: 'religion',
    thinker: 'Averroes (Ibn Rushd)',
    year: 1179,
    title: 'Truth cannot contradict truth',
    prompt: 'Where in your life do a belief you hold and something you have learned seem to clash? Which one are you reinterpreting?',
    plain_face:
      'Two surveyors measure the same field from opposite corners. If their maps disagree, the field has not split in two; one of them has misread an instrument. Averroes, a judge and physician in Muslim Córdoba, said scripture and reason are two surveyors of the one truth. When a proof from philosophy seems to collide with a verse, the verse is being read too literally and must be read again. Religion does not forbid thinking; for those able to follow a demonstration, it commands it.',
    source_face:
      'As this Law is true and leads to the consideration of the knowledge of God, we Muslims should believe that rational investigation is not contrary to Law, for truth cannot contradict truth, but verifies it and bears testimony to it. …\n\nBut if the Law speaks of it, either it will agree with that which has been proved by inference, or else it will disagree with it. If it is in agreement it needs no comment, and if it is opposed to the Law, an interpretation is to be sought. Interpretation means to carry the meaning of a word from its original sense to a metaphorical one.',
    source_citation: 'Averroes, Fasl al-Maqal (The Decisive Treatise), in The Philosophy and Theology of Averroes, "A Decisive Discourse on the Delineation of the Relation between Religion and Philosophy" (trans. Mohammad Jamil-ur-Rehman, Gaekwad Studies in Religion and Philosophy, Baroda, 1921)',
    source_url: 'https://www.gutenberg.org/ebooks/65708',
  },
  {
    id: 'maimonides_middle_path',
    type: 'concept',
    field: 'religion',
    thinker: 'Moses Maimonides',
    year: 1170,
    title: 'The middle path: neither surplus nor deficiency',
    prompt: 'Pick one trait of yours, generosity, caution, appetite. Are you nearer the too-much or the too-little end of it?',
    plain_face:
      'A thermostat does not aim for the hottest or the coldest setting; it aims for the setting that lets you live. Maimonides, the Jewish physician and rabbi of Cairo, said good character works the same way: every trait has a too-much and a too-little, and the right place is the balanced middle, which you reach by practising middle-sized actions until they become habit. He read the Law itself this way, as a rule set tuned to the mean, demanding neither a hermit\'s self-denial nor a glutton\'s licence, and he counted a healthy body as part of the work.',
    source_face:
      'For if one individual of a class has reached the highest perfection possible in that class, every other individual must necessarily be less perfect, and deviate from the perfect measure either by surplus or deficiency. Take, e.g., the normal constitution of a being, it is the most proper composition possible in that class; any constitution that deviates from that norm contains something too much or too little. The same is the case with the Law. It is clear that the Law is normal in this sense; for it contains "Just statutes and judgments" (Deut. iv. 8); but "just" is here identical with "equibalanced." The statutes of the Law do not impose burdens or excesses as are implied in the service of a hermit or pilgrim, and the like; but, on the other hand, they are not so deficient as to lead to gluttony or lewdness …\n\nWhen man possesses a good sound body that does not overpower him nor disturb the equilibrium in him, he possesses a divine gift. In short, a good constitution facilitates the rule of the soul over the body, but it is not impossible to conquer a bad constitution by training.',
    source_citation: 'Moses Maimonides, The Guide for the Perplexed, Part II, ch. XXXIX and Part III, ch. VIII (trans. M. Friedländer, 2nd ed. 1904; Routledge, 1910). The doctrine of the mean in character is set out in full in his Eight Chapters (ch. 4) and Mishneh Torah, Hilkot De\'ot 1–2, which the Guide refers back to (III.35, III.38).',
    source_url: 'https://www.gutenberg.org/ebooks/73584',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Gilgamesh
  { from: 'gilgamesh_siduri_seize_the_day', to: 'epicurus_absence_of_pain', relation: 'converged', note: 'Siduri\'s "fill thy belly, day and night rejoice" reaches Epicurus\'s simple pleasures 1,500 years early; the tablet lay buried until modern excavation, so there was no contact.' },
  { from: 'gilgamesh_siduri_seize_the_day', to: 'ecclesiastes_no_work_in_the_grave', relation: 'converged', note: 'Jastrow\'s 1920 edition already notes the parallel with Eccl. 9:7–9; whether or not Ecclesiastes knew it, both answer death with bread, clean clothes and a loved companion.' },
  { from: 'gilgamesh_siduri_seize_the_day', to: 'lucretius_death_nothing_to_us', relation: 'converged', note: 'Siduri says the gods kept life for themselves and tells the hero to feast; Lucretius\'s Nature tells the mourner to "even like a banqueter, depart the halls, laden with life" (Book III). Same answer, no contact.' },
  { from: 'gilgamesh_siduri_seize_the_day', to: 'practice_keep_death_in_view', relation: 'lands_on' },

  // Aquinas
  { from: 'aristotle_friendship', to: 'aquinas_unjust_law_is_no_law', relation: 'extended', year: 1270, note: 'Aquinas builds his account of law on "the Philosopher": the article on what law is quotes Ethics V.1 on legal matters "just, which are adapted to produce and preserve happiness and its parts for the body politic" (I-II q. 90, a. 2).' },
  { from: 'augustine_restless_heart', to: 'aquinas_unjust_law_is_no_law', relation: 'extended', year: 1270, note: 'In this very article Aquinas rests the claim on Augustine, De libero arbitrio I.5: "a law that is not just, seems to be no law at all."' },
  { from: 'aquinas_unjust_law_is_no_law', to: 'king_letter_from_birmingham_jail', relation: 'extended', year: 1963, note: 'King quotes Aquinas: an unjust law is no law at all.' },

  // Averroes
  { from: 'aristotle_friendship', to: 'averroes_decisive_treatise', relation: 'extended', year: 1179, note: 'Averroes wrote the great commentaries on Aristotle; the Latin West, Aquinas included, called him simply "the Commentator".' },
  { from: 'ghazali_crisis_of_doubt', to: 'averroes_decisive_treatise', relation: 'refuted', year: 1179, note: 'The Decisive Treatise answers "Abu Hamid (Al Ghazzali)" by name for charging al-Farabi and Avicenna with infidelity in his Refutation of the Philosophers; Averroes\'s Incoherence of the Incoherence is his point-by-point reply to that book.' },
  { from: 'averroes_decisive_treatise', to: 'aquinas_unjust_law_is_no_law', relation: 'extended', year: 1270, note: 'Aquinas cites Averroes as Aristotle\'s "Commentator" (Summa I q. 54, a. 1) and argues against him elsewhere ("Neither can we say, as Averroes imagines", I q. 66, a. 2).' },
  { from: 'averroes_decisive_treatise', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Maimonides
  { from: 'aristotle_friendship', to: 'maimonides_middle_path', relation: 'extended', year: 1170, note: 'The mean between surplus and deficiency is Aristotle\'s (Nicomachean Ethics II); Maimonides names Aristotle throughout the Guide, over a hundred times in Friedländer\'s translation.' },
  { from: 'maimonides_middle_path', to: 'aquinas_unjust_law_is_no_law', relation: 'extended', year: 1270, note: 'Aquinas cites "Rabbi Moses" and his Guide ("Perplex. ii") repeatedly in Summa I, e.g. on the number of the angels (q. 50, a. 3).' },
  { from: 'maimonides_middle_path', to: 'practice_care_for_the_body', relation: 'lands_on' },
];
