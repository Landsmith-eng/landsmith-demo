// Branch: six more crossings: Kalidasa's Shakuntala (the ring of recognition), Dignaga's two sources of knowledge,
// V. F. Cordova's Native American philosophy, José Martí's "Nuestra América", Nkrumah's Consciencism,
// Octavio Paz's The Labyrinth of Solitude.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Kalidasa verified word for word against Arthur W. Ryder's translation (Project Gutenberg #16659, Acts VI and VII).
// Martí's Spanish original (1891) is public domain, but es.wikisource is blocked from here and Gutenberg has no copy,
// so the face is a labelled summary. Dignaga has no reliable public-domain English (Hattori 1968 is in copyright);
// Cordova, Nkrumah and Paz are in copyright: labelled summaries, no quotation.

export const nodes = [
  {
    id: 'kalidasa_shakuntala',
    type: 'text',
    field: 'religion',
    thinker: 'Kalidasa',
    year: 400,
    title: 'Shakuntala and the ring of recognition',
    prompt: 'Who in your life have you failed to recognise, not out of malice but because something had clouded you? What brought them back into view?',
    plain_face:
      'A king marries a hermit\'s daughter in the forest, gives her his ring, and rides home. A curse wipes her from his memory, so when she arrives pregnant at court he looks straight at her and sees a stranger. Only when a fisherman finds the ring in a fish does the memory flood back, and the rest of the play is his remorse and their reunion. Kalidasa, the greatest Sanskrit poet, took the plot from the Mahabharata and added the curse and the ring. It is like the moment a name you had lost finally surfaces and the face in front of you turns from a stranger into someone you love: nothing in the world changed, only the recognising.',
    source_face:
      'Chamberlain. There is little more to tell. When his Majesty saw the ring, he remembered that he had indeed contracted a secret marriage with Shakuntala, and had rejected her under a delusion. And then he fell a prey to remorse.\n\nHe hates the things he loved; he intermits\nThe daily audience, nor in judgment sits;\nSpends sleepless nights in tossing on his bed;\nAt times, when he by courtesy is led\nTo address a lady, speaks another name,\nThen stands for minutes, sunk in helpless shame.\n\n…\n\nKing. Holy one, I married this your maid-servant by the voluntary ceremony. When after a time her relatives brought her to me, my memory failed and I rejected her. In so doing, I sinned against Kanva, who is kin to you. But afterwards, when I saw the ring, I perceived that I had married her. And this seems very wonderful to me.\n\nLike one who doubts an elephant,\nThough seeing him stride by,\nAnd yet believes when he has seen\nThe footprints left; so I.',
    source_citation: 'Kalidasa, Shakuntala (Abhijnanashakuntala), Act VI (the chamberlain on the recovered ring) and Act VII (the king before Kashyapa) (trans. Arthur W. Ryder, Translations of Shakuntala and Other Works, Everyman\'s Library, 1912)',
    source_url: 'https://www.gutenberg.org/ebooks/16659',
  },
  {
    id: 'dignaga_perception_and_inference',
    type: 'concept',
    field: 'religion',
    thinker: 'Dignaga',
    year: 500,
    title: 'Only two ways of knowing: perception and inference',
    prompt: 'Pick something you are sure of today. Did you see it, or did you reason your way to it? And how much of what you "saw" was already a label?',
    plain_face:
      'Dignaga, a Buddhist logician in fifth-century India, cut the list of ways we can know anything down to two. Perception is the bare contact of the senses with what is in front of you, before any word is attached. Inference is the reasoning that moves from a sign to what it signals, smoke to fire. Everything else people called knowledge, scripture, testimony, analogy, is one of these two in disguise. The twist is that the moment you say "that is a cup", you have left perception and started constructing. It is like the difference between the raw sensor data a camera records and the labelled photo it shows you: only the first is simply given.',
    source_face:
      'Summary (work under copyright; no public-domain English translation): Dignaga\'s Pramanasamuccaya, "Compendium of the Means of Valid Knowledge" (c. 500 CE), survives in Tibetan translation and in Sanskrit fragments; the standard English version of its first chapter is Masaaki Hattori\'s Dignaga, On Perception (Harvard, 1968). The opening thesis is that there are exactly two means of valid knowledge, perception (pratyaksha) and inference (anumana), because there are exactly two kinds of object: the unique particular, which perception grasps, and the general characteristic, which inference and language handle. Perception is defined as cognition that is free from conceptual construction (kalpana), that is, from the association of a name, a class or a quality with the thing sensed; the instant a cognition sorts its object under a concept it has become something other than perception. The chapter then criticises the definitions of perception in the Nyaya, Vaisheshika, Samkhya and Mimamsa schools, and introduces the thesis that every cognition is aware of itself (svasamvedana). Later chapters set out the theory of inference for oneself and for others, the three marks a valid logical reason must bear, and the apoha theory of meaning, on which a word like "cow" does not name a shared essence but excludes everything that is not a cow. Dharmakirti\'s commentary a century and a half later made this system the standard epistemology of Indian Buddhism.',
    source_citation: 'Dignaga, Pramanasamuccaya, ch. 1 (pratyaksha), as translated and reconstructed in Masaaki Hattori, Dignaga, On Perception (Harvard Oriental Series 47, 1968). Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'cordova_native_american_philosophy',
    type: 'concept',
    field: 'religion',
    thinker: 'V. F. Cordova',
    year: 2007,
    title: 'How It Is: a bounded, relational world',
    prompt: 'Describe where you live as if you were a part of it rather than a visitor passing through. What obligations appear when you do?',
    plain_face:
      'Viola Cordova, a Jicarilla Apache and the first Native American woman to earn a doctorate in philosophy, set out what she called a Native American worldview as a philosophy, not folklore. Its first move is that the universe is one living whole with no outside, and a human being is a part of it the way a wave is part of the sea: bounded, real, but not separable, and not above the rest. A person is made by a particular place and a particular people, so there is no view from nowhere and no ranking of humans over the earth they came out of. The European habit of starting from a lone individual facing a dead world looked, to her, like the odd one out among the world\'s philosophies.',
    source_face:
      'Summary (work under copyright): How It Is: The Native American Philosophy of V. F. Cordova (University of Arizona Press, 2007) gathers the essays, lectures and unpublished writings Cordova (1937–2002) left at her death, edited by Kathleen Dean Moore, Kurt Peters, Ted Jojola and Amber Lacy. Part one argues that a people\'s philosophy is their answer to three questions, what is the world, what is a human being, and what is the human role in the world, and that Native American answers form a coherent system that deserves to be taught alongside the Greek one. Parts two and three set out that system: the universe is a single, bounded, living whole ("the Usen" of the Apache is a dynamic whole, not a creator standing outside it); nothing in it is more real or more valuable than anything else; a human being is a bounded part of this whole, not a soul temporarily housed in matter; and a person is shaped from birth by a specific land, language and community, so that identity is relational and local rather than universal and abstract. Part four draws the ethics: because humans are not above the rest of the world, the measure of a good life is whether one maintains balance with a place and a people, and the duty to the land is the same kind of duty as the duty to one\'s relatives. Throughout she contrasts this with a European tradition she reads as built on the isolated individual, a transcendent God and a nature made for human use, and she asks why that tradition, alone among the world\'s philosophies, is taught as if it were simply "philosophy".',
    source_citation: 'V. F. Cordova, How It Is: The Native American Philosophy of V. F. Cordova, ed. Kathleen Dean Moore, Kurt Peters, Ted Jojola and Amber Lacy (Tucson: University of Arizona Press, 2007). Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'marti_our_america',
    type: 'text',
    field: 'philosophy',
    thinker: 'José Martí',
    year: 1891,
    title: '"Nuestra América": govern from your own reality',
    prompt: 'Where in your life are you running a borrowed plan, a career, a routine, a standard of success, that was written for a different person in a different place?',
    plain_face:
      'Martí, a Cuban poet in exile in New York, wrote a short essay in 1891 warning the new republics of Latin America against a mistake: trying to run themselves with constitutions and theories imported from France and the United States while ignoring the people and the land in front of them. A government, he said, is a product of the country, not a book you can order. His image is a tree: it must be rooted in its own soil, however much it borrows from the world\'s winds. It is like a gardener who plants a seed packet bought for a different climate and then blames the ground. Know your own country first; the university should teach its history before the history of Greece.',
    source_face:
      'Summary (no public-domain text reachable; the 1891 Spanish original is public domain, the English translations are in copyright): "Nuestra América" appeared in La Revista Ilustrada de Nueva York on 1 January 1891 and in El Partido Liberal of Mexico City on 30 January. It opens with the "villager" who thinks the whole world is his village and does not notice the giants with seven-league boots about to step on him, and calls the peoples of the Americas to wake up and close ranks. Its central argument is that the republics have failed where they tried to govern with imported forms: a good governor is not the one who knows how Germans or Frenchmen are governed but the one who knows the elements of his own country and governs with them; a government is not a thing one copies but a thing that grows out of a country as a tree grows out of its soil. Martí attacks the "sietemesinos", the seven-month men ashamed of their own country and of the Indian and the Black man beside them, and insists that there is no racial hatred because there are no races, only a shared humanity. He asks that the university teach the history of America from the Incas onward before the archons of Greece, calls for the natural man of each country to be understood rather than conquered, and ends by warning of the "tiger" of the northern neighbour, the United States, which does not know "our America" and which must be met by a continent that knows itself.',
    source_citation: 'José Martí, "Nuestra América", La Revista Ilustrada de Nueva York, 1 January 1891; El Partido Liberal (Mexico), 30 January 1891. English in José Martí, Selected Writings, trans. Esther Allen (Penguin, 2002). Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'nkrumah_consciencism',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Kwame Nkrumah',
    year: 1964,
    title: 'Consciencism: a philosophy for decolonisation',
    prompt: 'Name the three or four traditions that made you. Can they be brought into one honest whole, or are you keeping them in separate rooms?',
    plain_face:
      'Nkrumah, the first president of independent Ghana, argued that a colonised society comes out of colonialism with three strands in its mind: the old African communal life, the Islam that came by trade, and the Christianity that came with the colonisers. A philosophy for independence cannot throw two of them away; it has to digest all three on African terms. He called the result "consciencism": a materialist philosophy, built on the old African sense that the community comes before the individual, that keeps what is good in the other two and uses it to build socialism. It is like a family recipe that absorbs new ingredients from every place it travels without becoming a different dish.',
    source_face:
      'Summary (work under copyright): Consciencism: Philosophy and Ideology for De-Colonization and Development with Particular Reference to the African Revolution (London: Heinemann, 1964; revised 1970) begins with a short history of Western philosophy read as a series of social ideologies in disguise, and with the claim that every philosophy serves a society, so that a colonised people needs a philosophy of its own. Nkrumah argues that African society after colonialism is made of three segments, the traditional communal way of life, the Islamic strand and the Euro-Christian strand, and that an African philosophy must produce from them a single harmonious whole on the basis of the first. "Philosophical consciencism" is defined as materialism of a particular kind: matter is primary and capable of self-motion, mind arises from it by "categorial conversion", and the egalitarianism of traditional African society is its social expression. From this he derives an ethics in which the individual is an end but only within the community, and a politics in which socialism is the modern form of communalism, capitalism its betrayal, and neo-colonialism (independence in name while the economy is run from outside) the enemy to be fought by a united Africa. The revised edition sharpens the Marxist vocabulary and the call to armed struggle against colonial remnants.',
    source_citation: 'Kwame Nkrumah, Consciencism: Philosophy and Ideology for De-Colonization (London: Heinemann; New York: Monthly Review Press, 1964; rev. ed. 1970), esp. ch. 4 "Consciencism". Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'paz_labyrinth_of_solitude',
    type: 'text',
    field: 'philosophy',
    thinker: 'Octavio Paz',
    year: 1950,
    title: 'The Labyrinth of Solitude: masks and solitude',
    prompt: 'What is your mask, the thing people think you are because it is safer than what you are? When did you last take it off, and with whom?',
    plain_face:
      'Paz, a Mexican poet who later won the Nobel Prize, wrote a book-length essay asking what a Mexican is. His answer begins with a mask. The Mexican, he says, hides: behind courtesy, behind stoic silence, behind the fiesta that lets everything out once a year and closes again. Under the mask is a solitude that comes from history, from the conquest and from being born of a violated mother and an absent father, the Spaniard and the Indian. Paz thought everyone, not only Mexicans, lives inside a solitude and spends life looking for the way out of it, which is love and communion with others. It is like a person at a party who talks constantly so nobody will notice they are alone.',
    source_face:
      'Summary (work under copyright): El laberinto de la soledad (Mexico City: Cuadernos Americanos, 1950; enlarged 1959; English by Lysander Kemp, 1961) opens with "The Pachuco and Other Extremes", on the Mexican Americans of Los Angeles whose defiant dress Paz reads as a refusal to belong to either country. "Mexican Masks" argues that the Mexican hides himself behind dissimulation, formality, resignation and a cult of manliness as closedness, so that even love and friendship are guarded. "The Day of the Dead" treats the fiesta as the one sanctioned explosion in a closed life, and the familiarity with death as a way of mocking a life not worth much. "The Sons of La Malinche" is the famous chapter: the verb "chingar" and the figure of the "chingada", the violated mother, are read as the key to a people born of the conquest, who reject both the Indian mother and the Spanish father and so are orphaned twice. Later chapters run through the Conquest, the Colony, Independence, the Reform and the Revolution as attempts to find a form that fits, and "The Dialectic of Solitude" generalises the argument: solitude is the human condition, the labyrinth is the search for the exit, and the exit is communion, through love, through the fiesta, through a history finally one\'s own. The 1959 edition adds the chapter "The Present Day" on Mexico\'s place in a world of underdeveloped nations.',
    source_citation: 'Octavio Paz, El laberinto de la soledad (1950; 2nd ed. 1959), trans. Lysander Kemp as The Labyrinth of Solitude (New York: Grove Press, 1961), esp. ch. 2 "Mexican Masks" and the appendix "The Dialectic of Solitude". Summary, not quotation.',
    source_url: null,
  },
];

// Direction: `from` is the earlier idea A; read "B <relation> A".
export const edges = [
  // Kalidasa
  { from: 'mahabharata_yaksha_questions', to: 'kalidasa_shakuntala', relation: 'extended', year: 400, note: 'Kalidasa took the story of Shakuntala and King Dushyanta from the Adi Parva of the Mahabharata and added the curse of Durvasas and the ring that restores the king\'s memory.' },
  { from: 'kalidasa_shakuntala', to: 'tagore_gitanjali', relation: 'extended', year: 1902, note: 'Tagore\'s essay "Shakuntala" (Bengali, 1902) reads the play as a passage from the beauty of the forest hermitage through separation to a higher union, against Goethe\'s praise of its surface charm.' },
  { from: 'kalidasa_shakuntala', to: 'practice_invest_in_people', relation: 'lands_on' },
  // Dignaga
  { from: 'nagarjuna_emptiness', to: 'dignaga_perception_and_inference', relation: 'extended', year: 500, note: 'Dignaga wrote some three centuries after Nagarjuna within the Buddhist philosophical tradition the Madhyamaka had reshaped; his logic answered the question Nagarjuna had forced, how a Buddhist can claim valid knowledge at all.' },
  { from: 'dignaga_perception_and_inference', to: 'hume_bundle_of_perceptions', relation: 'converged', year: 1739, note: 'Both split the mind\'s contents into bare perception and what the mind constructs from it, and both reject any self standing behind the perceptions; Hume never read Dignaga.' },
  { from: 'dignaga_perception_and_inference', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
  // Cordova
  { from: 'deloria_god_is_red', to: 'cordova_native_american_philosophy', relation: 'extended', year: 2007, note: 'Cordova wrote in the generation after Deloria and drew on his contrast of religions of space and time; How It Is turns his claim that Native thought is a distinct worldview into a philosophy of the bounded, relational self.' },
  { from: 'ubuntu_person_through_persons', to: 'cordova_native_american_philosophy', relation: 'converged', year: 2007, note: 'Both hold that a person is constituted by relationships to a community and a place rather than existing first as an isolated individual; no contact between the Apache and Southern African traditions.' },
  { from: 'cordova_native_american_philosophy', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },
  // Martí
  { from: 'marti_our_america', to: 'mariategui_seven_essays', relation: 'extended', year: 1928, note: 'Mariátegui\'s demand that Peruvian socialism be "neither a copy nor an imitation" but grow from the Andean community continues Martí\'s rule that a government must be a product of the country, not an import.' },
  { from: 'marti_our_america', to: 'wiredu_conceptual_decolonization', relation: 'converged', year: 1995, note: 'Martí told Latin Americans to govern from their own reality rather than borrowed European forms; Wiredu told African philosophers to think in their own languages rather than inherited colonial concepts; no contact.' },
  { from: 'marti_our_america', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },
  // Nkrumah
  { from: 'marx_alienated_labor', to: 'nkrumah_consciencism', relation: 'extended', year: 1964, note: 'Consciencism declares itself a materialist philosophy and takes its account of class, capitalism and socialism from Marx, while grounding socialism in African communalism rather than in European industrial history.' },
  { from: 'mariategui_seven_essays', to: 'nkrumah_consciencism', relation: 'converged', year: 1964, note: 'Mariátegui built socialism on the Andean ayllu, Nkrumah on African communal society: each argued that a native communal tradition, not an imported model, is the base for socialism; no contact.' },
  { from: 'nkrumah_consciencism', to: 'practice_invest_in_people', relation: 'lands_on' },
  // Paz
  { from: 'sor_juana_reply', to: 'paz_labyrinth_of_solitude', relation: 'extended', year: 1982, note: 'Paz devoted his largest work, Sor Juana Inés de la Cruz o las trampas de la fe (1982), to her, reading her forced silence as the first Mexican case of the masked, solitary self he had described in the Labyrinth.' },
  { from: 'du_bois_double_consciousness', to: 'paz_labyrinth_of_solitude', relation: 'converged', year: 1950, note: 'Du Bois\'s self that always sees itself through others\' eyes and Paz\'s Mexican who lives behind a mask both describe an identity formed by being looked at from outside; Paz does not cite Du Bois.' },
  { from: 'paz_labyrinth_of_solitude', to: 'practice_examine_daily', relation: 'lands_on' },
];
