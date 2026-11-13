// Branch: ancient and medieval, batch 3 (Sappho, Diogenes the Cynic, Anselm, Dante, Ptahhotep, Ibn Khaldun).
// Walk-only nodes (no seq). Every quoted source_face below was checked word for word against the cited
// public-domain text (Project Gutenberg ebook ids in source_url, or the Wikisource page named). Ibn Khaldun has
// no public-domain English translation of the Muqaddimah, so his source face is a labelled summary.

export const nodes = [
  {
    id: 'sappho_fragment_31',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Sappho',
    year: -600,
    title: '"That man seems to me peer of gods"',
    prompt: 'When did wanting someone or something last take over your body before your mind had a say? What did it feel like, exactly?',
    plain_face:
      'Stage fright hits the body first: dry mouth, ringing ears, legs that will not hold. Sappho, a poet on the island of Lesbos twenty-six centuries ago, gave that same inventory for love. Watching the person she wants laugh with someone else, she loses her voice, a fire runs under her skin, her eyes fail, she sweats, she trembles, she turns the colour of grass. It is the oldest exact description we have of desire as something that happens to you rather than something you do.',
    source_face:
      'That man seems to me peer of gods, who sits in thy presence, and hears close to him thy sweet speech and lovely laughter; that indeed makes my heart flutter in my bosom. For when I see thee but a little, I have no utterance left, my tongue is broken down, and straightway a subtle fire has run under my skin, with my eyes I have no sight, my ears ring, sweat pours down, and a trembling seizes all my body; I am paler than grass, and seem in my madness little better than one dead. But I must dare all, since one so poor …',
    source_citation: 'Sappho, fragment 31 (Wharton\'s no. 2), the ode preserved by Longinus, On the Sublime 10; literal prose translation by Henry Thornton Wharton, Sappho: Memoir, Text, Selected Renderings, and a Literal Translation (1st ed. 1885; the Project Gutenberg text is the 1908 John Lane edition). The poem breaks off after "since one so poor".',
    source_url: 'https://www.gutenberg.org/ebooks/57390',
  },
  {
    id: 'diogenes_the_cynic',
    type: 'thinker',
    field: 'philosophy',
    thinker: 'Diogenes of Sinope',
    year: -350,
    title: 'Stand out of my light',
    prompt: 'What do you own, do or say only because everyone around you does? What would be left if you dropped it?',
    plain_face:
      'Imagine someone who treats every social rule like a dress code at a party they did not ask to attend. Diogenes lived in a large storage jar in Athens, ate in the marketplace, and walked about in daylight with a lit lamp saying he was looking for a human being. When Alexander the Great stood over him and offered him anything he liked, he asked him to move, because he was blocking the sun. The point was not rudeness for its own sake: he wanted to find out how much of what we call necessary is only custom, and how little a free person actually needs.',
    source_face:
      'When he was sunning himself in the Craneum, Alexander came and stood over him and said, "Ask of me any boon you like." To which he replied, "Stand out of my light." …\n\nHe lit a lamp in broad daylight and said, as he went about, "I am looking for a man." …\n\nHe had written to some one to try and procure a cottage for him. When this man was a long time about it, he took for his abode the tub … as he himself explains in his letters. …\n\nBeing reproached one day for having falsified the currency, he said, "That was the time when I was such as you are now; but such as I am now, you will never be."',
    source_citation: 'Diogenes Laërtius, Lives of Eminent Philosophers VI.38, VI.41, VI.23 and VI.56 (trans. R. D. Hicks, Loeb, 1925). The Alexander anecdote is also in Plutarch, Life of Alexander 14. The "tub" was a large storage jar (pithos) in the Metroön, the Athenian temple of the Mother of the Gods.',
    source_url: 'https://en.wikisource.org/wiki/Lives_of_the_Eminent_Philosophers/Book_VI',
  },
  {
    id: 'anselm_ontological_argument',
    type: 'puzzle',
    field: 'religion',
    thinker: 'Anselm of Canterbury',
    year: 1078,
    title: 'That than which nothing greater can be conceived',
    prompt: 'Have you ever heard an argument you were sure was wrong but could not answer? What did you do with it?',
    plain_face:
      'Try this: think of the greatest thing possible. Now ask whether it exists only in your head or also in the world. If only in your head, Anselm says, you can think of something greater, namely the same thing existing for real, so what you first imagined was not the greatest after all. It is like a chess problem that seems to prove the king is already in checkmate before a piece has moved. Nearly everyone who meets the argument feels it must be a trick; nine centuries of philosophers have disagreed about where the trick is.',
    source_face:
      'Nor do I seek to understand that I may believe, but I believe that I may understand. …\n\nAnd of a truth we believe that Thou art somewhat than which no greater can be conceived. Is there then nothing real that can be thus described? for the fool hath said in his heart, There is no God. Yet surely even that fool himself when he hears me speak of somewhat than which nothing greater can be conceived understands what he hears, and what he understands is in his understanding, even if he do not understand that it really exists. …\n\nAnd surely that than which no greater can be conceived cannot exist only in the understanding. For if it exist indeed in the understanding only, it can be thought to exist also in reality; and real existence is more than existence in the understanding only. If then that than which no greater can be conceived exists in the understanding only, then that than which no greater can be conceived is something a greater than which can be conceived: but this is impossible. Therefore it is certain that something than which no greater can be conceived exists both in the understanding and also in reality.',
    source_citation: 'Anselm, Proslogion, ch. 1 (closing words) and ch. 2 (trans. Clement C. J. Webb, in The Devotions of Saint Anselm, 1903). Webb\'s version is a devotional rendering made before the modern critical edition; S. N. Deane\'s 1903 translation (St. Anselm: Proslogium; Monologium …) is the one usually quoted. Words broken across lines in the Wikisource transcription ("under standing") are rejoined here.',
    source_url: 'https://en.wikisource.org/wiki/Proslogion',
  },
  {
    id: 'dante_midway',
    type: 'text',
    field: 'philosophy',
    thinker: 'Dante Alighieri',
    year: 1320,
    title: '"Midway upon the journey of our life"',
    prompt: 'If you woke up tomorrow and realised you had lost the path, who or what would you want as your guide?',
    plain_face:
      'Most people have at some point looked up from a life that seemed to be going fine and found they had no idea how they got there. Dante opens the Divine Comedy at exactly that moment: thirty-five years old, lost in a dark wood, unable to say how he wandered in. The way out, it turns out, runs down through hell and up through purgatory before it reaches anywhere pleasant. The poem is a map of a midlife reckoning drawn by someone who had just lost his city, his office and his home.',
    source_face:
      'Midway upon the journey of our life\nI found myself within a forest dark,\nFor the straightforward pathway had been lost.\n\nAh me! how hard a thing it is to say\nWhat was this forest savage, rough, and stern,\nWhich in the very thought renews the fear.\n\nSo bitter is it, death is little more;\nBut of the good to treat, which there I found,\nSpeak will I of the other things I saw there.\n\nI cannot well repeat how there I entered,\nSo full was I of slumber at the moment\nIn which I had abandoned the true way.',
    source_citation: 'Dante Alighieri, Inferno, Canto I, lines 1–12 (trans. Henry Wadsworth Longfellow, 1867). Dante was born in 1265; "midway" is thirty-five, half the biblical span of seventy years, so the poem is set in 1300.',
    source_url: 'https://www.gutenberg.org/ebooks/1001',
  },
  {
    id: 'ptahhotep_maxims',
    type: 'text',
    field: 'religion',
    thinker: 'Ptahhotep',
    year: -2400,
    title: 'Be not proud because thou art learned',
    prompt: 'Who is the least impressive person you have learned something real from this year? What stopped you from dismissing them?',
    plain_face:
      'The oldest book of advice we have was written by a retiring Egyptian vizier for his son, around the time the pyramids at Giza were new. Its first maxim is the one every expert needs: do not be proud of what you know, and talk with the uneducated as readily as with the wise, because no one ever reaches the limit of a skill. Think of a master carpenter who still asks the apprentice how the cut went. Four and a half thousand years later it is still the hardest lesson for clever people to keep.',
    source_face:
      'He said unto his son:\n\n1. Be not proud because thou art learned; but discourse with the ignorant man, as with the sage. For no limit can be set to skill, neither is there any craftsman that possesseth full advantages. Fair speech is more rare than the emerald that is found by slave-maidens on the pebbles.\n\n2. If thou find an arguer talking, one that is well disposed and wiser than thou, let thine arms fall, bend thy back, be not angry with him if he agree (?) not with thee. Refrain from speaking evilly; oppose him not at any time when he speaketh. If he address thee as one ignorant of the matter, thine humbleness shall bear away his contentions.',
    source_citation: 'The Instruction of Ptah-hotep, maxims 1–2 (trans. Battiscombe G. Gunn, The Instruction of Ptah-Hotep and the Instruction of Ke\'Gemni: The Oldest Books in the World, Wisdom of the East, 1906), from the Prisse Papyrus. The "(?)" is Gunn\'s own mark for an uncertain reading. Ptahhotep served Djedkare Isesi of the Fifth Dynasty, c. 2400 BCE; the surviving copy is some five centuries younger.',
    source_url: 'https://www.gutenberg.org/ebooks/30508',
  },
  {
    id: 'ibn_khaldun_asabiyyah',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Ibn Khaldun',
    year: 1377,
    title: 'Asabiyyah: group feeling rises and decays in three generations',
    prompt: 'Think of a team, club or family business you know. Is it in its founding, its comfortable or its fading generation? How can you tell?',
    plain_face:
      'A family firm: the founder builds it by sweat, the children run it well because they watched, the grandchildren inherit it and assume it runs itself. Ibn Khaldun, a North African judge and historian, saw that pattern in every dynasty he studied. What holds a group together he called asabiyyah, the fellow-feeling of people who have struggled side by side; it is strongest in hard places and softens in luxury, so that a ruling house tends to last about three generations before a hungrier group takes its place. He wrote this in 1377 as the introduction to a world history, and it reads like sociology six hundred years early.',
    source_face:
      'Summary (work under copyright): The Muqaddimah ("Introduction") to Ibn Khaldun\'s Kitab al-\'Ibar, written in 1377, argues that asabiyyah (group feeling or social cohesion) is the force that lets a group win and hold power. It is strongest among desert and tribal peoples whose hard life binds them together, and it weakens as a dynasty settles into cities, luxury and taxation. Book I, ch. 2 and 3 set out the rule of thumb that a dynasty\'s prestige and strength last about three generations, of roughly forty years each: the founders who built it, the sons who still remember the building, and the grandchildren who take it for granted. The only complete English translation, Franz Rosenthal\'s (1958), is in copyright, and no public-domain English version of these chapters could be fetched, so the argument is summarised rather than quoted.',
    source_citation: 'Ibn Khaldun, Muqaddimah (1377), Book I, ch. 2 §§7–8 and ch. 3 §§1–12, trans. Franz Rosenthal, The Muqaddimah: An Introduction to History (Princeton, 1958; abridged ed. N. J. Dawood, 1967). Summary, not a quotation.',
    source_url: null,
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
// converged is symmetric (no contact); lands_on points from any node to a practice.
export const edges = [
  // Sappho
  { from: 'sappho_fragment_31', to: 'augustine_restless_heart', relation: 'converged', note: 'Sappho records desire as a force that unseats the self ("my tongue is broken down … a trembling seizes all my body"); Augustine, a thousand years later, makes the same restlessness the engine of the Confessions and redirects it to God. No contact: Augustine read no Sappho.' },
  { from: 'sappho_fragment_31', to: 'buddha_craving_root_of_suffering', relation: 'converged', note: 'Sappho describes craving as it is felt in the body, fire under the skin and failing sight; the Buddha, within a century or two at the other end of the known world, diagnoses that same craving as the root of suffering. No contact between Lesbos and the Ganges plain.' },
  { from: 'sappho_fragment_31', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Diogenes
  { from: 'socrates_unexamined_life', to: 'diogenes_the_cynic', relation: 'extended', year: -350, note: 'Diogenes pushed Socratic self-sufficiency to its limit; asked what sort of man Diogenes was, Plato answered "A Socrates gone mad" (Diogenes Laërtius VI.54), and Diogenes\' teacher Antisthenes had been a companion of Socrates.' },
  { from: 'diogenes_the_cynic', to: 'zeno_live_according_to_nature', relation: 'extended', year: -300, note: 'Zeno\'s teacher Crates was Diogenes\' pupil: Diogenes Laërtius VII.2–3 says Zeno "was a pupil of Crates", and VI.85 lists Crates of Thebes "amongst the Cynic\'s famous pupils"; Stoic "life according to nature" grew out of Cynic indifference to convention.' },
  { from: 'laozi_sufficiency_of_contentment', to: 'diogenes_the_cynic', relation: 'converged', note: 'Laozi says there is "no calamity greater than to be discontented with one\'s lot; no fault greater than the wish to be getting" (Tao Te Ching 46); Diogenes, with a jar, a cloak and a lamp, lived the same claim in Athens a century or two later, with no contact between China and Greece.' },
  { from: 'diogenes_the_cynic', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Anselm
  { from: 'augustine_restless_heart', to: 'anselm_ontological_argument', relation: 'extended', year: 1078, note: 'Anselm\'s "I believe that I may understand" (Proslogion ch. 1) restates Augustine\'s crede ut intelligas, and the Proslogion opens, like the Confessions, as a prayer addressed to God rather than an argument addressed to readers.' },
  { from: 'anselm_ontological_argument', to: 'descartes_i_think_therefore_i_am', relation: 'extended', year: 1637, note: 'Discourse on Method, Part IV, revives Anselm\'s argument: Descartes finds "that the existence of the Being was comprised in the idea in the same way that the equality of its three angles to two right angles is comprised in the idea of a triangle"; he was challenged on the resemblance to Anselm in the Objections to the Meditations (1641).' },
  { from: 'anselm_ontological_argument', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Dante
  { from: 'aquinas_unjust_law_is_no_law', to: 'dante_midway', relation: 'extended', year: 1320, note: 'Dante\'s cosmos follows Aquinas\'s ordering of nature, grace and law, and he places Aquinas among the theologians in the sphere of the Sun (Paradiso X–XIII), where "I Thomas of Aquinum" introduces himself and narrates the life of St Francis.' },
  { from: 'boethius_wheel_of_fortune', to: 'dante_midway', relation: 'extended', year: 1320, note: 'Dante says in the Convivio (II.xii) that he turned to Boethius\'s Consolation for comfort after Beatrice\'s death, and Inferno VII recasts Boethius\'s Fortune as a minister of God who "turns her sphere, and blissful she rejoices", deaf to those who curse her.' },
  { from: 'dante_midway', to: 'practice_examine_daily', relation: 'lands_on' },

  // Ptahhotep
  { from: 'ptahhotep_maxims', to: 'zengzi_three_daily_examinations', relation: 'converged', note: 'Both are counsel on daily conduct passed from a senior to those who come after (Ptahhotep to his son, Zengzi to the disciples who compiled the Analects), nearly two thousand years apart, with no contact between Old Kingdom Egypt and Zhou China.' },
  { from: 'ptahhotep_maxims', to: 'socrates_unexamined_life', relation: 'converged', note: 'Ptahhotep\'s first maxim, "Be not proud because thou art learned … no limit can be set to skill", and Socrates\' profession in the Apology that he knows nothing worth knowing, reach the same humility about the limits of one\'s knowledge; the Greeks did not know the Egyptian text.' },
  { from: 'ptahhotep_maxims', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Ibn Khaldun
  { from: 'averroes_decisive_treatise', to: 'ibn_khaldun_asabiyyah', relation: 'extended', year: 1377, note: 'Ibn Khaldun was trained in the Maghrebi Aristotelian tradition that Averroes shaped two centuries earlier; his science of civilisation applies Aristotelian causal reasoning to history, though he was sceptical of philosophy\'s claims about the unseen.' },
  { from: 'ibn_khaldun_asabiyyah', to: 'hobbes_state_of_nature', relation: 'converged', note: 'Both make social cohesion the precondition of order: Ibn Khaldun\'s asabiyyah binds a group so that it can impose a ruler and restrain aggression, and Hobbes\'s covenant builds a sovereign to escape the war of all against all. Hobbes did not know the Muqaddimah, first translated into a European language in the nineteenth century.' },
  { from: 'ibn_khaldun_asabiyyah', to: 'practice_invest_in_people', relation: 'lands_on' },
];
