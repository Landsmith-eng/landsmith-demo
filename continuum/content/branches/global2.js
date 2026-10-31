// Branch: twentieth-century crossings: Tagore, Singer, Heidegger, Han Fei, Fanon, bell hooks, Nishitani.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Tagore (his own English, 1912) verified word for word against Project Gutenberg #7164.
// Han Fei: no public-domain English text was reachable (Liao 1939 is in copyright), so the face is a labelled summary.
// In-copyright works (Singer, Heidegger in English, Fanon, hooks, Nishitani) carry labelled summaries, no quotation.

export const nodes = [
  {
    id: 'tagore_gitanjali',
    type: 'quote',
    field: 'religion',
    thinker: 'Rabindranath Tagore',
    year: 1912,
    title: 'Deliverance is not in renunciation',
    prompt: 'What is one thing you love, a person, a place, a piece of work, that ties you down? Would you really want the knot undone?',
    plain_face:
      'A kite does not fly in spite of the string; it flies because of it. Tagore, a Bengali poet raised in a reform movement that read the Upanishads, says the same of a life: freedom is not found by cutting every tie and walking away from the senses, but inside the thousand bonds of delight, sight, hearing, touch, work, love. The world is the temple; keep the doors open.',
    source_face:
      'Deliverance is not for me in renunciation. I feel the embrace of freedom in a thousand bonds of delight.\n\nThou ever pourest for me the fresh draught of thy wine of various colours and fragrance, filling this earthen vessel to the brim.\n\nMy world will light its hundred different lamps with thy flame and place them before the altar of thy temple.\n\nNo, I will never shut the doors of my senses. The delights of sight and hearing and touch will bear thy delight.\n\nYes, all my illusions will burn into illumination of joy, and all my desires ripen into fruits of love.',
    source_citation: 'Rabindranath Tagore, Gitanjali (Song Offerings), no. 73, the author\'s own prose translation from the Bengali, with an introduction by W. B. Yeats (London: India Society, 1912; Macmillan, 1913)',
    source_url: 'https://www.gutenberg.org/ebooks/7164',
  },
  {
    id: 'singer_drowning_child',
    type: 'dilemma',
    field: 'philosophy',
    thinker: 'Peter Singer',
    year: 1972,
    title: 'The drowning child',
    prompt: 'What did you spend money on this month that you would not miss? What could the same money have done for a stranger?',
    plain_face:
      'You pass a shallow pond and a small child is drowning in it. You can wade in and pull her out; the only cost is your clothes get muddy. Nobody thinks you may walk on. Singer asks why distance changes anything: if you can prevent something terrible at trivial cost to yourself, the child a thousand miles away has the same claim on you as the child at your feet.',
    source_face:
      'Summary (work under copyright): Writing during the 1971 Bengal famine, Singer argues from two premises. First, suffering and death from lack of food, shelter and medical care are bad. Second, if it is in our power to prevent something bad from happening without sacrificing anything of comparable moral importance, we ought to do it. He illustrates the second with a child drowning in a shallow pond: wading in will muddy your clothes, but that is plainly insignificant beside the child\'s death. He then argues that neither physical distance nor the number of other people who could also help makes any moral difference, so that giving to famine relief is not charity, an optional act of generosity, but a duty; and he concedes that this conclusion is far more demanding than the ordinary moral view allows.',
    source_citation: 'Peter Singer, "Famine, Affluence, and Morality", Philosophy & Public Affairs 1, no. 3 (Spring 1972), pp. 229–243. Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'heidegger_being_toward_death',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Martin Heidegger',
    year: 1927,
    title: 'Being-toward-death',
    prompt: 'When you say "everyone dies", whose death do you picture? When did you last picture your own, as yours alone?',
    plain_face:
      'Nobody can take your turn at the dentist. Heidegger says death is like that, only absolutely: it is the one thing no one can do in your place, and it can arrive at any moment. Most of the time we hide behind "one dies, eventually", the way we talk about the weather. To face your own death as yours, with the anxiety that brings, is what he calls being authentic: it pulls you out of the crowd and hands your life back to you as a whole.',
    source_face:
      'Summary (work under copyright): In Division Two, chapter 1 (§§46–53), Heidegger asks how Dasein (human existence) can be grasped as a whole when its end, death, is always still outstanding. Death, he argues, is not an event at the end of life but a way of being: Dasein is "being-toward-death" as long as it exists. Death is one\'s ownmost possibility (no one can die in my place), non-relational (it severs every tie to others), not to be outstripped, certain, and yet indefinite as to its "when". The everyday "they" (das Man) covers this over with the formula "one dies", which treats death as a public event that happens to no one in particular, and the resulting tranquillity is a flight. Authentic being-toward-death, which he calls "anticipation" (Vorlaufen), holds one\'s own death open as a possibility rather than fleeing it, and in the anxiety this brings Dasein is freed from the illusions of the "they" and given back to itself as a whole. A footnote in §51 cites Tolstoy\'s The Death of Ivan Ilyich for the way the everyday world "shatters" in the face of dying.',
    source_citation: 'Martin Heidegger, Sein und Zeit (Halle: Niemeyer, 1927), Division Two, ch. 1, §§46–53; English as Being and Time, trans. John Macquarrie and Edward Robinson (Oxford: Blackwell, 1962), pp. 279–311. Summary, not quotation; the German text was not reachable for verification.',
    source_url: null,
  },
  {
    id: 'han_feizi_two_handles',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Han Fei',
    year: -240,
    title: 'The two handles: reward and punishment',
    prompt: 'Think of a rule you follow only because of what happens if you break it. Would you still follow it if no one were watching?',
    plain_face:
      'A driver steers a horse with reins, not by lecturing it on virtue. Han Fei, a prince who studied with the Confucian Xunzi and became the sharpest voice of the "Legalist" school, says a ruler holds a state the same way, by two handles: punishment and reward. People are moved by what they fear and what they want; a government that counts on their goodness will be ruled by its ministers instead. The handles must stay in the ruler\'s own hands, and the law must be the same for everyone.',
    source_face:
      'Summary (no public-domain English text reachable; the standard translation, W. K. Liao, 1939–59, is in copyright): In chapter 7, "The Two Handles" (Er bing), Han Fei writes that the enlightened ruler controls his ministers by two handles alone: punishment (xing), which is to kill or injure, and favour (de), which is to reward. Ministers fear punishment and profit from reward; if the ruler keeps both in his own hands, all his ministers will fear his authority and turn toward its benefits. If he lets a minister dispense them, as Duke Jian of Qi let Tian Chang and the king of Song let Zihan, the people will fear the minister and slight the ruler, and the ruler will be deposed. The ruler should also compare each minister\'s words with his deeds and punish any mismatch, whether the result falls short of the claim or exceeds it. Elsewhere Han Fei argues that one cannot wait for a sage ruler or rely on the people\'s goodness: a strong state rests on clear laws, impartially applied, and on reward and punishment, not on virtue.',
    source_citation: 'Han Feizi, ch. 7 "The Two Handles" (二柄), with ch. 49 "The Five Vermin" and ch. 50 "Eminence in Learning"; English in W. K. Liao, The Complete Works of Han Fei Tzu, 2 vols (London: Probsthain, 1939, 1959) and Burton Watson, Han Feizi: Basic Writings (Columbia, 1964). Summary from the Chinese text, not quotation.',
    source_url: null,
  },
  {
    id: 'fanon_wretched_of_the_earth',
    type: 'text',
    field: 'philosophy',
    thinker: 'Frantz Fanon',
    year: 1961,
    title: 'The Wretched of the Earth',
    prompt: 'Whose eyes do you see yourself through when you feel small? Who taught you to look that way?',
    plain_face:
      'A tenant who has lived for years under a landlord who calls him dirty may start scrubbing to prove he is clean. Fanon, a psychiatrist from Martinique who treated patients in Algeria during its war of independence, said colonialism works like that on the mind: the colonised learn to see themselves through the coloniser\'s eyes and to want his approval. Independence, he argued, is not only taking back the land but unlearning that inherited self-image, and he warned that a new nation which merely copies its old masters has not finished the job.',
    source_face:
      'Summary (work under copyright): In Black Skin, White Masks (1952), Fanon, trained in psychiatry, examines how the black person in a white colonial world comes to experience himself through the white gaze, learning to want whiteness and to despise his own body and speech; in chapter 7 he reworks Hegel\'s master–slave dialectic, arguing that the colonised were freed without the struggle for recognition Hegel describes, so that recognition was never won. The Wretched of the Earth (1961), written as he was dying, turns to the war in Algeria: colonial rule is a Manichaean world divided into the settler\'s town and the native\'s town, held by violence, and decolonisation is the native\'s violent reversal of it. Later chapters warn that the national bourgeoisie which inherits the state tends to imitate its former rulers, and the final chapter, drawn from his clinical notes, records the psychiatric damage of the war on colonised and colonisers alike. The conclusion asks the new nations not to imitate Europe but to "set afoot a new man".',
    source_citation: 'Frantz Fanon, Peau noire, masques blancs (Paris: Seuil, 1952), ch. 7; Les Damnés de la terre (Paris: Maspero, 1961), with a preface by Jean-Paul Sartre; English as Black Skin, White Masks (trans. Charles Lam Markmann, 1967) and The Wretched of the Earth (trans. Constance Farrington, 1963). Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'hooks_all_about_love',
    type: 'text',
    field: 'philosophy',
    thinker: 'bell hooks',
    year: 2000,
    title: 'All About Love: love is a practice, not a feeling',
    prompt: 'Name someone you say you love. What did you actually do for their growth this week?',
    plain_face:
      'You can feel like a gardener all day; the plants only notice when you water them. bell hooks says love is like that: not a feeling that happens to us but a set of actions we choose, care, respect, honesty, commitment, trust, and the will to help another person grow. If love is something you do, then it can be learned, it can be practised badly or well, and "I love you" can be checked against what you did.',
    source_face:
      'Summary (work under copyright): hooks opens by observing that in her culture people speak constantly of love and almost never define it. She adopts M. Scott Peck\'s definition of love as the will to extend oneself in order to nurture one\'s own or another\'s spiritual growth, and argues that treating love as an action rather than a feeling makes us accountable for it. Love, on her account, combines care, affection, recognition, respect, commitment, trust and honest communication; where there is abuse or domination, love cannot be present, and many people who were harmed as children have been taught to call something love that was not. She argues that a "love ethic" could reshape public life as well as private, and that lovelessness, not a shortage of romance, is the real affliction of modern life. She names Martin Luther King Jr. among the thinkers who taught her that love is a practice with political force.',
    source_citation: 'bell hooks, All About Love: New Visions (New York: William Morrow, 2000), esp. ch. 1 "Clarity: Give Love Words" and ch. 6 "Values: Living by a Love Ethic". Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'nishitani_religion_and_nothingness',
    type: 'concept',
    field: 'religion',
    thinker: 'Keiji Nishitani',
    year: 1961,
    title: 'Through nihilism to emptiness',
    prompt: 'When nothing seems to matter, what do you reach for to make the feeling go away? What would happen if you stayed in it instead?',
    plain_face:
      'A frozen lake looks like solid ground until it cracks and you see black water underneath. Nishitani, a Japanese philosopher who studied Nietzsche in Germany and practised Zen for decades, says modern life stands on that lake: science and doubt have cracked the old ground, and the nothingness beneath, Nietzsche\'s nihilism, cannot be patched over. His answer is to go further down, not back. Below the black water of nihilism lies what Buddhism calls emptiness: things lose their fixed selves and, in losing them, show up as they truly are, and the nothing becomes a place to live from.',
    source_face:
      'Summary (work under copyright): Nishitani, a leading figure of the Kyoto School, argues that modern science and secular thought have hollowed out the ground on which religion and morality stood, leaving the nihilism Nietzsche diagnosed: the "nihility" (kyomu) that opens beneath the self when meaning gives way. Philosophy and religion, he holds, must pass through this nihility rather than evade it. Beyond it he describes a further "field" which he names with the Mahayana Buddhist term śūnyatā, emptiness (ku): on the field of nihility things are experienced as groundless and meaningless, but on the field of emptiness that same groundlessness turns over, and each thing is affirmed in its "suchness", existing in and through all others. He reads Nietzsche\'s amor fati and eternal recurrence, Eckhart\'s detachment and the Zen koan tradition as approaches to this standpoint, and presents it as the religious answer to the question of the book\'s Japanese title, "What is religion?".',
    source_citation: 'Keiji Nishitani, Shūkyō to wa nani ka (Tokyo: Sōbunsha, 1961); English as Religion and Nothingness, trans. Jan Van Bragt (Berkeley: University of California Press, 1982), esp. chs. 1, 3 and 4. See also his The Self-Overcoming of Nihilism (lectures 1949; trans. Graham Parkes and Setsuko Aihara, 1990). Summary, not quotation.',
    source_url: null,
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Tagore
  { from: 'upanishads_tat_tvam_asi', to: 'tagore_gitanjali', relation: 'extended', year: 1912, note: 'Tagore was raised in the Brahmo Samaj, the Hindu reform movement led by his father that grounded itself in the Upanishads; his Sadhana lectures (1913) open from Upanishadic texts.' },
  { from: 'gandhi_satyagraha', to: 'tagore_gitanjali', relation: 'refuted', year: 1921, note: 'Close friends who argued in public: Tagore\'s "The Call of Truth" (Modern Review, 1921) criticised Gandhi\'s non-cooperation movement as narrow nationalism; Gandhi replied in Young India ("The Great Sentinel").' },
  { from: 'tagore_gitanjali', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Singer
  { from: 'mill_ask_whether_you_are_happy', to: 'singer_drowning_child', relation: 'extended', year: 1972, note: 'Singer argues as a utilitarian in the line of Bentham, Mill and Sidgwick, though the 1972 paper itself rests only on a premise about preventing bad outcomes at small cost.' },
  { from: 'mencius_child_at_the_well', to: 'singer_drowning_child', relation: 'converged', note: 'Both begin from a child in mortal danger and the immediate pull to help; Singer does not cite Mencius, and draws the opposite moral (a duty that extends to distant strangers, not a native sprout of feeling).' },
  { from: 'singer_drowning_child', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Heidegger
  { from: 'kierkegaard_fear_and_trembling', to: 'heidegger_being_toward_death', relation: 'extended', year: 1927, note: 'Being and Time credits Kierkegaard, in a footnote to §40, with having gone furthest in analysing the phenomenon of anxiety, which Heidegger makes the mood that discloses death.' },
  { from: 'tolstoy_a_confession', to: 'heidegger_being_toward_death', relation: 'extended', year: 1927, note: 'A footnote in §51 of Being and Time cites Tolstoy\'s The Death of Ivan Ilyich as a portrayal of how the everyday "one dies" breaks down (cited here from memory of the footnote, as the text was not reachable).' },
  { from: 'heidegger_being_toward_death', to: 'sartre_existence_precedes_essence', relation: 'extended', year: 1943, note: 'Sartre\'s Being and Nothingness (1943) takes its framework from Being and Time and argues with Heidegger\'s account of death at length.' },
  { from: 'heidegger_being_toward_death', to: 'practice_keep_death_in_view', relation: 'lands_on' },

  // Han Fei
  { from: 'xunzi_human_nature_is_bad', to: 'han_feizi_two_handles', relation: 'taught', year: -250, note: 'Han Fei was Xunzi\'s student (Sima Qian, Records of the Grand Historian, ch. 63), and kept his teacher\'s view that human nature is not good while dropping his trust in ritual and teachers.' },
  { from: 'hobbes_state_of_nature', to: 'han_feizi_two_handles', relation: 'converged', note: 'Both reason from self-interested human nature to a sovereign who must hold the power to punish; no contact, nineteen centuries apart.' },

  // Fanon
  { from: 'hegel_master_and_slave', to: 'fanon_wretched_of_the_earth', relation: 'extended', year: 1952, note: 'Chapter 7 of Black Skin, White Masks ("The Negro and Hegel") reworks the master–slave dialectic for the colonised, arguing that recognition granted without struggle is not recognition.' },
  { from: 'sartre_existence_precedes_essence', to: 'fanon_wretched_of_the_earth', relation: 'extended', year: 1961, note: 'Sartre wrote the preface to The Wretched of the Earth, and Fanon\'s earlier Black Skin, White Masks engages Sartre\'s Anti-Semite and Jew and Black Orpheus.' },
  { from: 'fanon_wretched_of_the_earth', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // hooks
  { from: 'king_letter_from_birmingham_jail', to: 'hooks_all_about_love', relation: 'extended', year: 2000, note: 'hooks names King among those who taught her that love is a practice with political force, and builds All About Love around a "love ethic" in his sense.' },
  { from: 'aristotle_friendship', to: 'hooks_all_about_love', relation: 'converged', note: 'Both treat love between persons as something done and sustained by character over time, not a feeling that befalls us; hooks does not build on Aristotle.' },
  { from: 'hooks_all_about_love', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Nishitani
  { from: 'nagarjuna_emptiness', to: 'nishitani_religion_and_nothingness', relation: 'extended', year: 1961, note: 'Nishitani names his final standpoint with the Mahayana term śūnyatā, emptiness, the concept Nagarjuna made central, reached through Zen rather than through Nagarjuna\'s own texts.' },
  { from: 'nietzsche_amor_fati', to: 'nishitani_religion_and_nothingness', relation: 'extended', year: 1949, note: 'Nishitani\'s lectures The Self-Overcoming of Nihilism (1949) are a study of Nietzsche, and Religion and Nothingness reads amor fati and eternal recurrence as steps toward emptiness.' },
  { from: 'dogen_just_sitting', to: 'nishitani_religion_and_nothingness', relation: 'extended', year: 1961, note: 'Nishitani practised Zen for decades and draws on Dōgen\'s Shōbōgenzō in Religion and Nothingness; the lineage is through Zen practice, not a specific doctrine.' },
  { from: 'nishitani_religion_and_nothingness', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
  { from: 'han_feizi_two_handles', to: 'machiavelli_fortune_and_virtu', relation: 'converged', note: 'Han Fei would have rulers govern by reward and punishment rather than by virtue; Machiavelli, eighteen centuries later and with no knowledge of him, tells the prince what works rather than what is good.' },
];
