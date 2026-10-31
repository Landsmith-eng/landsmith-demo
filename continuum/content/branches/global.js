// Branch: Global (Ethiopian, southern African, Haudenosaunee, Indian Buddhist, Chinese and Indian thought),
// where it crosses the daily line. Walk-only nodes (no seq).
// Verification status: the Nagarjuna and Gandhi source_faces were checked word for word against the cited
// public-domain Gutenberg texts. Zera Yacob, Ubuntu and Xunzi are labelled summaries (the English translations
// are in copyright, or no public-domain copy could be fetched). The Haudenosaunee face is a labelled summary of
// Parker's 1916 edition, which is public domain but could not be fetched for word-for-word checking.

export const nodes = [
  {
    id: 'zera_yacob_hatata',
    type: 'thinker',
    field: 'philosophy',
    thinker: 'Zera Yacob',
    year: 1667,
    title: 'Test every inherited belief with the reason you were given',
    prompt: 'Which of your beliefs did you inherit rather than choose? Pick one and ask what you would think if you had been born somewhere else.',
    plain_face:
      'In the 1630s an Ethiopian scholar fled a religious purge and lived for two years in a cave by a river, with nothing to do but think. Zera Yacob noticed that every faith he knew called itself the true one and the others false, which cannot all be right. His test: a lamp. God, he reasoned, gave every person intelligence for a reason, and a belief that cannot stand in that light should not be kept in the dark either. He wrote it up thirty years later as the Hatata, an "inquiry", one of the earliest works of rationalist philosophy from Africa.',
    source_face:
      'Summary (work under copyright): In the Hatata, Zera Yacob tells how he was denounced during the persecutions under Emperor Susenyos, hid in a cave near the Tekeze river, and there began to examine what he had been taught. Christians, Muslims, Jews and Indians each hold their own scripture to be true and the others false, he observes, and each believes it because they were raised in it. So he resolves to accept only what survives examination by the intelligence the Creator gave him, and he tests laws of fasting, marriage and purity against what he calls the order of nature, keeping what agrees with it and setting the rest aside.',
    source_citation: 'Zera Yacob, Hatata (1667), chs. 2–5. English translations: Claude Sumner, Ethiopian Philosophy, Vol. II: The Treatise of Zär\'a Ya\'eqob and of Wäldä Heywät (Addis Ababa, 1976); Teodros Kiros, Zara Yacob: Rationality of the Human Heart (2005). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'ubuntu_person_through_persons',
    type: 'concept',
    field: 'religion',
    thinker: 'Southern African tradition (formulated by John S. Mbiti)',
    year: 1969,
    title: 'Ubuntu: a person is a person through other persons',
    prompt: 'Name three people without whom you would not be who you are. How much of "you" is really theirs?',
    plain_face:
      'A Nguni proverb says "umuntu ngumuntu ngabantu": a person is a person through other persons. Think of a word in a sentence. On its own it barely means anything; the sentence around it gives it its sense. Ubuntu, a southern African ethic rather than a creed, says people are like that. You did not become yourself alone and you cannot stay yourself alone, so generosity and welcome are not extras. They are how a person is made. The Kenyan theologian John Mbiti gave it its best-known one-line form in 1969, deliberately turning the Western "I think, therefore I am" inside out.',
    source_face:
      'Summary (work under copyright): Describing the African view of the person, Mbiti writes that the individual does not and cannot exist alone but owes existence to other people, including past generations and those still to come; that whatever happens to the individual happens to the whole group, and whatever happens to the group happens to the individual; and he sums this up in a single sentence that makes "we are" the ground of "I am", the reverse of Descartes\'s order. The Nguni proverb above is older than the book and belongs to no author.',
    source_citation: 'John S. Mbiti, African Religions and Philosophy (London: Heinemann, 1969), ch. 10, "Ethnic Groups, Kinship and the Individual". Summary, not a quotation; Mbiti\'s one-sentence formula is widely quoted but is not reproduced here because it could not be checked against a fetched copy.',
    source_url: null,
  },
  {
    id: 'haudenosaunee_seventh_generation',
    type: 'concept',
    field: 'religion',
    thinker: 'Haudenosaunee (Iroquois) Great Law of Peace',
    year: 1450,
    title: 'Decide for the seventh generation',
    prompt: 'Think of a decision you are weighing now. How would it look to someone living a hundred and fifty years from today?',
    plain_face:
      'The Great Law of Peace is the founding constitution of the Haudenosaunee, the five (later six) nations of what is now upstate New York, carried for centuries in memory and wampum before it was written down. It tells a new chief to weigh every decision for the whole people, including those not yet born. Like planting an oak you will never sit under, the point is not what the tree does for you. The modern shorthand is "the seventh generation": act so that people seven generations ahead still thank you.',
    source_face:
      'Summary (public-domain text not checked word for word): In the version written down by the Seneca scholar Arthur C. Parker in 1916, the Great Law instructs the chiefs (royaneh) at their installation to let their skin be seven spans thick against anger and criticism, to look and listen for the welfare of the whole people, and to keep in view not only the present but the coming generations, those whose faces are still beneath the ground, the unborn of the future nation. The Great Law is traditionally dated to the founding of the Confederacy by the Peacemaker and Hiawatha; estimates range from the twelfth to the fifteenth century.',
    source_citation: 'Arthur C. Parker, The Constitution of the Five Nations, or The Iroquois Book of the Great Law (Albany: New York State Museum Bulletin 184, 1916), §28. Paraphrase; the fetched copy could not be checked, so no words are quoted.',
    source_url: 'https://archive.org/details/cu31924101928012',
  },
  {
    id: 'nagarjuna_emptiness',
    type: 'concept',
    field: 'religion',
    thinker: 'Nagarjuna',
    year: 150,
    title: 'Emptiness: nothing exists on its own',
    prompt: 'Pick anything you call "mine" or "me". Try to find the part of it that would still be there if everything it depends on were removed.',
    plain_face:
      'A knot is real: you can trip over it. But look for the knot apart from the rope and there is nothing there. Nagarjuna, an Indian Buddhist monk, said everything is like the knot, including you. Things exist only through what they depend on, so nothing has a fixed, separate essence of its own. That is what he means by "empty". It is not that nothing exists; it is that nothing exists by itself. Which is why, he adds, things can change at all.',
    source_face:
      'Some say that there are seeing, hearing, feeling, etc., because there is something which exists even prior to those [manifestations]. For how could seeing, etc. come from that which does not exist? Therefore, it must be admitted that that being [i.e. soul] existed prior to those [manifestations].\n\nBut [this hypothesis of the prior (pûrva) or independent existence of the soul is wrong, because] how could that being be known if it existed prior to seeing, feeling, etc.? If that being could exist without seeing, etc., the latter too could surely exist without that being. … How could this exist without that, and how could that exist without this? [Are not all things relative and conditioning one another?] …\n\nSubject and object are mutually conditioned. The soul as it is has no independent, individual reality whatever. Therefore, the hypothesis that contends for the existence of an ego-soul prior to simultaneous with, or posterior to, seeing, etc., is to be abandoned as fruitless, for the ego-soul existeth not.\n\n… Nâgârjuna\'s famous doctrine of "The Middle Path of Eight No\'s" … declares:\n"There is no death, no birth, no destruction, no persistence,\nNo oneness, no manyness, no coming, no departing,"',
    source_citation: 'Nagarjuna, Mulamadhyamakakarika (Madhyamika Shastra), ch. 9 and the dedicatory verse, as translated from Kumarajiva\'s Chinese by D. T. Suzuki in Outlines of Mahayana Buddhism (Chicago: Open Court, 1908; first pub. London: Luzac, 1907), pp. 168–170 and 103. Square brackets are Suzuki\'s. Cf. Jay L. Garfield, The Fundamental Wisdom of the Middle Way (1995), chs. 9, 18 and 24.',
    source_url: 'https://www.gutenberg.org/ebooks/75283',
  },
  {
    id: 'xunzi_human_nature_is_bad',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Xunzi',
    year: -250,
    title: 'Human nature is bad; goodness is made',
    prompt: 'What is one good habit you have that did not come naturally? Who or what shaped it into you?',
    plain_face:
      'Mencius said goodness is a seed in everyone. Xunzi, the last great Confucian of the classical age, looked at the same people and disagreed. We are born wanting, he said, and wanting left alone turns into grabbing and quarrelling. Think of a warped plank: it becomes straight only because a carpenter steams it and presses it against a frame. Ritual, teachers and study are the frame. The good person is not found; they are made, by deliberate effort, and anyone can do the making.',
    source_face:
      'Summary (work under copyright): Chapter 23 opens with the thesis that human nature (xing) is bad and that whatever is good in people is the product of deliberate effort (wei). By nature, Xunzi argues, people are born with a love of profit and with envy and desire; follow those and the result is strife and disorder. Hence the need for the transforming influence of teachers and models and the guidance of ritual and rightness, after which people become orderly and good. He names Mencius\'s claim that nature is good, declares it mistaken, and compares the shaping of nature to the straightening of warped wood and the sharpening of blunt metal.',
    source_citation: 'Xunzi, ch. 23, "Human Nature Is Bad" (Xing e), c. 250 BCE. English: Eric L. Hutton, Xunzi: The Complete Text (Princeton, 2014); an older translation is Homer H. Dubs, The Works of Hsüntze (London: Probsthain, 1928). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'gandhi_satyagraha',
    type: 'thinker',
    field: 'religion',
    thinker: 'Mohandas K. Gandhi',
    year: 1909,
    title: 'Satyagraha: truth-force',
    prompt: 'When someone wrongs you, what would it cost you to refuse both to obey and to strike back?',
    plain_face:
      'Gandhi, a lawyer in South Africa, found a third way between obeying an unjust law and fighting it with fists. Break the law openly, and accept the punishment yourself. He called it satyagraha, "holding to truth", and wrote the method down in 1909 on a ship home from London. Think of a stone in a river: it does not hit the water, it simply will not move, and the river bends. The power is in your willingness to suffer rather than to make others suffer. It later freed India and shaped the American civil rights movement.',
    source_face:
      'EDITOR: Passive resistance is a method of securing rights by personal suffering; it is the reverse of resistance by arms. When I refuse to do a thing that is repugnant to my conscience, I use soul-force. For instance, the government of the day has passed a law which is applicable to me: I do not like it, if, by using violence, I force the government to repeal the law, I am employing what may be termed body-force. If I do not obey the law and accept the penalty for its breach, I use soul-force. It involves sacrifice of self.\n\nEverybody admits that sacrifice of self is infinitely superior to sacrifice of others. …\n\nPassive resistance has been described in the course of our discussion as truth-force. Truth, therefore, has necessarily to be followed, and that at any cost.',
    source_citation: 'M. K. Gandhi, Hind Swaraj, or Indian Home Rule (written in Gujarati, 1909; the author\'s own English translation, 1910), ch. XVII "Passive Resistance". Gutenberg text from the 5th edition (Madras: Ganesh & Co., 1922).',
    source_url: 'https://www.gutenberg.org/ebooks/40461',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
// converged is symmetric (no contact); lands_on points from any node to a practice.
export const edges = [
  // Zera Yacob
  { from: 'descartes_i_think_therefore_i_am', to: 'zera_yacob_hatata', relation: 'converged', note: 'Discourse on the Method (1637) and the Hatata (1667): each begins by doubting what he was taught and rebuilds from the reason God gave him, a generation apart with no contact.' },
  { from: 'ghazali_crisis_of_doubt', to: 'zera_yacob_hatata', relation: 'converged', note: 'Both reach the point where every inherited authority is suspect and only what survives one\'s own examination may be kept; Zera Yacob shows no sign of having read al-Ghazali.' },
  { from: 'zera_yacob_hatata', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Ubuntu
  { from: 'aristotle_friendship', to: 'ubuntu_person_through_persons', relation: 'converged', note: 'Aristotle: no one would choose to live without friends, and a human is by nature a social animal; the Nguni proverb goes a step further and makes other people the very ground of personhood. No contact.' },
  { from: 'mencius_child_at_the_well', to: 'ubuntu_person_through_persons', relation: 'converged', note: 'Mencius says whoever lacks the feeling of concern for others is not human; ubuntu says a person becomes a person only through others. Same relational self, no contact.' },
  { from: 'ubuntu_person_through_persons', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Haudenosaunee
  { from: 'haudenosaunee_seventh_generation', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Nagarjuna
  { from: 'buddha_craving_root_of_suffering', to: 'nagarjuna_emptiness', relation: 'extended', year: 150, note: 'Nagarjuna systematised the Buddha\'s no-self and dependent origination into the Madhyamaka: whatever arises dependently is empty of own-being (MMK ch. 24).' },
  { from: 'heraclitus_same_river', to: 'nagarjuna_emptiness', relation: 'converged', note: 'Heraclitus: nothing abides, all flows; Nagarjuna: nothing has a fixed essence to abide. No contact between Ephesus and the Madhyamaka.' },
  { from: 'nagarjuna_emptiness', to: 'hume_bundle_of_perceptions', relation: 'converged', note: 'Both look for a self over and above its perceptions and find none: Nagarjuna in MMK ch. 9, Hume in the Treatise. No contact.' },
  { from: 'nagarjuna_emptiness', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Xunzi
  { from: 'mencius_child_at_the_well', to: 'xunzi_human_nature_is_bad', relation: 'refuted', year: -250, note: 'Xunzi ch. 23 names Mencius\'s claim that human nature is good and declares it wrong: goodness is the product of deliberate effort, not a sprout.' },
  { from: 'zengzi_three_daily_examinations', to: 'xunzi_human_nature_is_bad', relation: 'extended', year: -250, note: 'Xunzi built on the Analects, where Zengzi examines himself three times a day; for him that daily effort of ritual and study is exactly what turns a bad nature good.' },
  { from: 'xunzi_human_nature_is_bad', to: 'practice_examine_daily', relation: 'lands_on' },

  // Gandhi
  { from: 'gita_act_without_attachment_to_fruits', to: 'gandhi_satyagraha', relation: 'extended', year: 1909, note: 'Hind Swaraj cites the Gita; Gandhi read it daily and published his own Gujarati commentary (Anasakti Yoga, 1929), reading its battlefield as the war inside each person.' },
  { from: 'tolstoy_a_confession', to: 'gandhi_satyagraha', relation: 'extended', year: 1909, note: 'Hind Swaraj\'s reading list opens with Tolstoy\'s The Kingdom of God Is Within You; Gandhi and Tolstoy corresponded in 1909–10, and Gandhi named his South African settlement Tolstoy Farm.' },
  { from: 'thoreau_live_deliberately', to: 'gandhi_satyagraha', relation: 'extended', year: 1909, note: 'Hind Swaraj\'s reading list recommends Thoreau\'s "On the Duty of Civil Disobedience", which Gandhi had read in South Africa and reprinted in Indian Opinion in 1907.' },
  { from: 'gandhi_satyagraha', to: 'practice_control_your_response', relation: 'lands_on' },
];
