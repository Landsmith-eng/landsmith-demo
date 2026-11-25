// Branch: seven more crossings: the Yaksha's questions (Mahabharata), Ramanuja, Vine Deloria Jr., Paulo Freire,
// Senghor's Négritude, Mariátegui's Seven Essays, Kwasi Wiredu's conceptual decolonization.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Mahabharata verified word for word against Ganguli's prose translation (Project Gutenberg #12333, Vana Parva, section CCCXII).
// Ramanuja verified against Thibaut's translation of the Sri Bhashya (Project Gutenberg #7297, SBE 48, commentary on I.1.1).
// Mariátegui's Spanish original (1928) is public domain in the US, but es.wikisource is blocked from here and Gutenberg has no
// copy, so the face is a labelled summary. Deloria, Freire, Senghor and Wiredu are in copyright: labelled summaries, no quotation.

export const nodes = [
  {
    id: 'mahabharata_yaksha_questions',
    type: 'puzzle',
    field: 'religion',
    thinker: 'Mahabharata (Vana Parva)',
    year: -300,
    title: 'The Yaksha\'s questions: what is the greatest wonder?',
    prompt: 'Someone you know died this year. In what small ways have you been acting, since then, as if it could not happen to you?',
    plain_face:
      'Four brothers die one by one at a lake because each drinks before answering the voice that guards it. The fifth, Yudhishthira, stops and answers. The voice, a Yaksha, asks riddle after riddle, and one of them is "What is the most wonderful thing?" His answer is the heart of the scene: every day people are carried off to the house of death, and the ones left behind go on living as if they were immortal. It is like watching cars pass a crash and speed up again a mile later. Nothing in the world is stranger than that, and the brothers live again because he says so.',
    source_face:
      'The Yaksha asked,--\'Who is truly happy? What is most wonderful? What is the path? And what is the news? Answer these four questions of mine and let thy dead brothers revive.\' Yudhishthira answered,--\'O amphibious creature, a man who cooketh in his own house, on the fifth or the sixth part of the day, with scanty vegetables, but who is not in debt and who stirreth not from home, is truly happy. Day after day countless creatures are going to the abode of Yama, yet those that remain behind believe themselves to be immortal. What can be more wonderful than this? Argument leads to no certain conclusion, the Srutis are different from one another; there is not even one Rishi whose opinion can be accepted by all; the truth about religion and duty is hid in caves: therefore, that alone is the path along which the great have trod. This world full of ignorance is like a pan. The sun is fire, the days and nights are fuel. The months and the seasons constitute the wooden ladle. Time is the cook that is cooking all creatures in that pan (with such aids); this is the news.\'',
    source_citation: 'Mahabharata, Vana Parva, section CCCXII (the Yaksha Prasna, in the Aranyaka-parva) (trans. Kisari Mohan Ganguli, 1883–96)',
    source_url: 'https://www.gutenberg.org/ebooks/12333',
  },
  {
    id: 'ramanuja_qualified_nondualism',
    type: 'concept',
    field: 'religion',
    thinker: 'Ramanuja',
    year: 1100,
    title: 'Qualified non-dualism: the world is real, as the body of God',
    prompt: 'Is there someone you feel most yourself with precisely because you are not them? What would be lost if the two of you simply merged?',
    plain_face:
      'Shankara had said the many things of the world, and your separate self, are a snake seen in a rope: there is only one Brahman, and the rest is a mistake. Ramanuja, a temple theologian in south India three centuries later, answered that your body is not an illusion of you; it is yours, real, and alive because you are in it. The world and every soul are like that for God: real, distinct, and held together as a body is held by the one who lives in it. "That art thou" then means not "you are nothing but it" but "you belong to it the way a hand belongs to a person." The point is love, because you cannot adore something you are identical with.',
    source_face:
      'This entire theory rests on a fictitious foundation of altogether hollow and vicious arguments, incapable of being stated in definite logical alternatives, and devised by men who are destitute of those particular qualities which cause individuals to be chosen by the Supreme Person revealed in the Upanishads; whose intellects are darkened by the impression of beginningless evil; and who thus have no insight into the nature of words and sentences, into the real purport conveyed by them, and into the procedure of sound argumentation, with all its methods depending on perception and the other instruments of right knowledge. …\n\nThe slokas also, which begin with the words \'Thou alone art real\' (Vi. Pu. I, 4, 38 ff.), do not assert that the whole world is unreal, but only that, as Brahman is the Self of the world, the latter viewed apart from Brahman is not real. …\n\nFrom all this it follows that the entire aggregate of things, intelligent and non-intelligent, has its Self in Brahman in so far as it constitutes Brahman\'s body. And as, thus, the whole world different from Brahman derives its substantial being only from constituting Brahman\'s body, any term denoting the world or something in it conveys a meaning which has its proper consummation in Brahman only: in other words all terms whatsoever denote Brahman in so far as distinguished by the different things which we associate with those terms on the basis of ordinary use of speech and etymology.—The text \'that art thou\' we therefore understand merely as a special expression of the truth already propounded in the clause \'in that all this has its Self.\'',
    source_citation: 'Ramanuja, Sri Bhashya (commentary on the Vedanta-Sutras) I.1.1, "The great Siddhanta": its opening against the doctrine of a non-differenced Brahman, and its reading of the Vishnu Purana and of "That art thou" (trans. George Thibaut, Sacred Books of the East vol. 48, 1904)',
    source_url: 'https://www.gutenberg.org/ebooks/7297',
  },
  {
    id: 'deloria_god_is_red',
    type: 'text',
    field: 'religion',
    thinker: 'Vine Deloria Jr.',
    year: 1973,
    title: 'God Is Red: religions of place and religions of time',
    prompt: 'Is there a place that would feel like a desecration to see paved over? What is it that you believe about that ground, and where did you learn it?',
    plain_face:
      'Ask one person "when did the important thing happen?" and another "where?" and you have the difference Deloria draws. Christianity, he says, is a religion of time: a creation, a fall, a saviour, a judgment, all on a line that runs the same anywhere on earth. Tribal religions are religions of space: the sacred is this mountain, this river, these graves, and the duties come from the land you stand on, not from a date. A time religion travels, converts, and runs out of history to wait for; a place religion does not export, because you cannot pack up a mountain. Deloria, a Standing Rock Sioux lawyer and theologian, thought the second kind had the better chance of keeping a continent alive.',
    source_face:
      'Summary (work under copyright): Written in the wake of the occupation of Alcatraz and the Trail of Broken Treaties, God Is Red contrasts two kinds of religion. Christianity and its secular descendants locate meaning in time: a linear history from creation through incarnation to a final judgment, in which any land is as good as any other and the believer\'s task is to spread the message before history ends. American Indian religions locate meaning in space: particular places, mountains, lakes, burial grounds, are holy because of what happened and keeps happening there, and a people\'s duties follow from their relationship to that land rather than from a doctrine. Deloria argues that a time-centred religion has no brake on the destruction of land, since its hopes lie elsewhere, while a place-centred religion makes ecology a sacred obligation. He also contrasts the two on death (ancestors remain present in the land rather than being removed to a heaven), on community (religion belongs to a people, not to individual converts) and on the relation of humans to animals and plants (relatives, not resources). Later editions add his reading of the return of sacred lands as the test of whether the United States can take the first religions of the continent seriously.',
    source_citation: 'Vine Deloria Jr., God Is Red (New York: Grosset & Dunlap, 1973; 30th-anniversary edition, Golden, CO: Fulcrum, 2003), esp. ch. 4 "Thinking in Time and Space" and the chapters on death and sacred places. Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'freire_pedagogy_of_the_oppressed',
    type: 'text',
    field: 'philosophy',
    thinker: 'Paulo Freire',
    year: 1968,
    title: 'Pedagogy of the Oppressed: banking education versus problem-posing',
    prompt: 'Think of the best teacher you ever had. Did they fill you up, or did they ask you something you could not stop thinking about?',
    plain_face:
      'Freire, who taught sugar-cane workers in north-east Brazil to read, named the usual kind of schooling "banking": the teacher makes deposits of information into students, who store them and give them back. It keeps everyone in their place, because a person who has only ever received does not expect to act. His alternative is to teach by posing problems the learners already live with, a landlord, a drought, a word like "favela", so that reading the word and reading the world happen together. The oppressed, he argued, cannot be liberated by someone else; they have to become the authors of the change, and the oppressor is freed in the same act.',
    source_face:
      'Summary (work under copyright): Written in exile in Chile in 1968 and published in English in 1970, the book opens from the dialectic of oppressor and oppressed: the oppressed carry the oppressor inside themselves and must recover their humanity without simply becoming new oppressors. Chapter 2 names the "banking concept" of education, in which the teacher narrates and the students memorize, as an instrument of oppression because it treats people as adaptable, manageable objects; against it, "problem-posing" education takes the students\' own situation as the material of study, abolishes the one-way line between teacher and student (the teacher-student with students-teachers), and treats knowledge as something people make together through dialogue. Chapter 3 sets out the method: generative words and themes drawn from the learners\' lives, "codified" in pictures and decoded in culture circles, so that literacy and critical consciousness (conscientização) grow together. Chapter 4 contrasts the "antidialogical" tools of domination (conquest, divide and rule, manipulation, cultural invasion) with the dialogical tools of liberation (cooperation, unity, organization, cultural synthesis). The whole rests on the claim that to name the world is to change it, and that this naming must be done by the oppressed themselves.',
    source_citation: 'Paulo Freire, Pedagogia do Oprimido (written 1968; Rio de Janeiro: Paz e Terra, 1970); English trans. Myra Bergman Ramos, Pedagogy of the Oppressed (New York: Herder and Herder, 1970), esp. chs. 1–2. Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'senghor_negritude',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Léopold Sédar Senghor',
    year: 1948,
    title: 'Négritude: the whole of the values of the Black world',
    prompt: 'Which part of your background did you once hide and later come to claim out loud? What changed the sign from minus to plus?',
    plain_face:
      'Take the word used against you and wear it on the front of your shirt: that is the move. In 1930s Paris, three students from the colonies, Aimé Césaire from Martinique, Léon Damas from French Guiana and Senghor from Senegal, took "nègre", the slur, and made "négritude" from it. Césaire coined the word; Senghor made it a philosophy: the sum of the Black world\'s cultural values, and a distinct way of knowing by rhythm and participation rather than dissection. His line that emotion is Black as reason is Greek won him followers and the charge that he had kept the coloniser\'s picture and only flipped its sign.',
    source_face:
      'Summary (work under copyright): Senghor\'s 1948 Anthologie de la nouvelle poésie nègre et malgache de langue française gathered the poets of Négritude (Césaire, Damas, Rabéarivelo, Roumain and others) and carried Sartre\'s preface "Orphée noir", which made the movement famous and called it an "anti-racist racism" that would have to pass away into a universal humanism. Senghor\'s own essays define Négritude as "the sum of the cultural values of the Black world" and, more controversially, as a distinctive mode of knowledge: where European reason is, in his image, an eye that holds its object at a distance in order to analyse it, African reason is a participation that embraces the object, grasping it through rhythm, emotion and sympathy. The sentence "emotion is Negro, as reason is Hellenic", from his 1939 essay "Ce que l\'homme noir apporte", is the line his critics seized on. Senghor later insisted he meant a difference of emphasis, not a hierarchy, and framed Négritude as one contribution to a "civilisation of the universal" in which every people brings its gift. Césaire, who coined the word in the 1930s, defined it more plainly as the simple recognition of the fact of being Black, and the acceptance of that fact and of one\'s history.',
    source_citation: 'Léopold Sédar Senghor, ed., Anthologie de la nouvelle poésie nègre et malgache de langue française (Paris: PUF, 1948), with Sartre\'s "Orphée noir"; Senghor, "Ce que l\'homme noir apporte" (1939) and the essays collected in Liberté I: Négritude et humanisme (Paris: Seuil, 1964). Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'mariategui_seven_essays',
    type: 'text',
    field: 'philosophy',
    thinker: 'José Carlos Mariátegui',
    year: 1928,
    title: 'Seven Interpretive Essays: socialism rooted in the ayllu',
    prompt: 'What is the oldest shared arrangement in your life, a family rota, a neighbourhood habit, a club? What does it know that no new plan has matched?',
    plain_face:
      'A transplanted tree grows only if it finds roots in the new soil. Mariátegui, a self-taught Peruvian journalist who came back from Europe a Marxist, insisted that socialism in Peru could not be a copy of Europe\'s. Its root was already in the ground: the ayllu, the Andean village community that had farmed land in common since before the Incas and had survived four centuries of conquest. The "problem of the Indian", he argued, was not a question of race or schooling or religion; it was a question of land, and the answer was to build on the communal practice that Indigenous people had never given up. He called it Indo-American socialism, "neither a copy nor an imitation" but a heroic creation.',
    source_face:
      'Summary (no public-domain text reachable; the 1928 Spanish original is public domain in the US, the 1971 English translation is in copyright): The seven essays take Peru apart by theme: economic evolution, the problem of the Indian, the problem of land, public education, the religious factor, regionalism and centralism, and literature. The thread is that every "Indian problem" that liberals had blamed on race, ignorance or morality is in fact the land problem: the colonial latifundio and the gamonal (the local landlord-boss) expropriated the communities and kept them in servitude, and no school or sermon will change that while the land stays where it is. Against this, Mariátegui points to the ayllu, the Andean agrarian community, as a living institution with a communist tradition that outlasted the Inca state and the conquest, and he argues that Peruvian socialism must be built on it rather than imported. In the essay on the religious factor he treats Catholicism in Peru as a thin layer over an older, agrarian spirituality and holds that a revolutionary movement must itself carry a "myth" that moves people, drawing on Sorel. His programme, stated elsewhere in the same years, is that Indo-American socialism must be "neither a copy nor an imitation" but a heroic creation of the peoples of the Americas.',
    source_citation: 'José Carlos Mariátegui, Siete ensayos de interpretación de la realidad peruana (Lima: Biblioteca Amauta, 1928); English trans. Marjory Urquidi, Seven Interpretive Essays on Peruvian Reality (Austin: University of Texas Press, 1971), esp. "The Problem of the Indian" and "The Problem of Land". Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'wiredu_conceptual_decolonization',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Kwasi Wiredu',
    year: 1995,
    title: 'Conceptual decolonization: think it through in your own language',
    prompt: 'Pick a big word you use without thinking, "mind", "God", "freedom". Can you say it in the language your grandparents spoke at home? What changes when you try?',
    plain_face:
      'Try translating a puzzle into another language and watch some of it dissolve: the problem was in the grammar, not the world. Wiredu, a Ghanaian philosopher trained at Oxford, saw that African thinkers schooled in English or French had inherited the coloniser\'s conceptual furniture along with his schools: mind and body, the supernatural, existence as a thing one can "have". His discipline: test each inherited concept in your own language, Akan in his case. Some survive and turn out to be human universals; some dissolve, and those were never yours to defend.',
    source_face:
      'Summary (work under copyright): In "Conceptual Decolonization in African Philosophy" (1995) and Cultural Universals and Particulars (1996), Wiredu defines conceptual decolonization as two things at once: ridding African philosophical thinking of undue influence from the conceptual frameworks of the colonial languages and religions in which Africans were educated, and exploiting the resources of African languages and traditions in one\'s own philosophical work. His test is translation: think a received philosophical doctrine through in an African language and see whether it is still intelligible or even statable. He works the method on Akan: the Akan idiom for existence is "to be at some place", so a wholly non-spatial, "transcendent" God is hard to state in Akan, and the Cartesian mind-body problem does not arise in its familiar form; the Akan person is analysed into okra (life-giving principle), sunsum (character) and honam (body) rather than into a spirit and a machine. Against the view that this makes thought relative, he argues for cultural universals: logic, the norms of truth and of sympathetic impartiality are common to all humans, and it is precisely by distinguishing them from the particulars of any one culture that a decolonized philosophy avoids both parochialism and copying. The same book includes his accounts of Akan communalism and of a consensus-based politics drawn from Akan traditional practice.',
    source_citation: 'Kwasi Wiredu, Conceptual Decolonization in African Philosophy: Four Essays, ed. Olusegun Oladipo (Ibadan: Hope Publications, 1995); Cultural Universals and Particulars: An African Perspective (Bloomington: Indiana University Press, 1996). Summary, not quotation.',
    source_url: null,
  },
];

export const edges = [
  // Mahabharata: the Yaksha's questions
  { from: 'mahabharata_yaksha_questions', to: 'gita_act_without_attachment_to_fruits', relation: 'extended', year: -200, note: 'The Bhagavad Gita is itself a chapter of the Mahabharata (Bhishma Parva, sections XXV–XLII in Ganguli); the Yaksha Prasna in the Vana Parva precedes it in the same epic, and both put Yudhishthira\'s and Arjuna\'s doubts into the mouth of a questioner before the war.' },
  { from: 'gilgamesh_siduri_seize_the_day', to: 'mahabharata_yaksha_questions', relation: 'converged', note: 'Siduri tells Gilgamesh that the life he seeks he will never find, and the Yaksha scene says the greatest wonder is that the living believe themselves immortal; the oldest two texts on the map on death-denial, with no contact between Mesopotamia and the Sanskrit epic.' },
  { from: 'mahabharata_yaksha_questions', to: 'practice_keep_death_in_view', relation: 'lands_on' },

  // Ramanuja
  { from: 'shankara_rope_and_snake', to: 'ramanuja_qualified_nondualism', relation: 'refuted', year: 1100, note: 'The "great Siddhanta" of Ramanuja\'s Sri Bhashya I.1.1 attacks the Advaita doctrine of Nescience and the unreal world as resting "on a fictitious foundation of altogether hollow and vicious arguments", and under "Plurality is not unreal" argues that the snake-rope case does not show that the many are an illusion (Thibaut); he names the doctrine, not Shankara.' },
  { from: 'upanishads_tat_tvam_asi', to: 'ramanuja_qualified_nondualism', relation: 'extended', year: 1100, note: 'Ramanuja reads "That art thou" (Chandogya VI.8.7) as co-ordinate predication, two terms applied to one Brahman qualified by the world and souls as its body, "merely as a special expression of the truth already propounded in the clause \'in that all this has its Self\'" (Sri Bhashya I.1.1, Thibaut).' },
  { from: 'ramanuja_qualified_nondualism', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Deloria
  { from: 'ohiyesa_silence_cornerstone_of_character', to: 'deloria_god_is_red', relation: 'extended', year: 1973, note: 'Deloria (Standing Rock Sioux) writes out of the same Dakota and Lakota religious tradition that Eastman (Santee Dakota) recorded in The Soul of the Indian, and God Is Red makes that tradition\'s sense of sacred place its case against time-centred religion; no specific citation of Eastman is claimed here.' },
  { from: 'deloria_god_is_red', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Freire
  { from: 'hegel_master_and_slave', to: 'freire_pedagogy_of_the_oppressed', relation: 'extended', year: 1968, note: 'Chapter 1 of Pedagogy of the Oppressed cites Hegel\'s Phenomenology on the master-slave relation: the oppressed, like Hegel\'s bondsman, win their humanity through the struggle in which the oppressor\'s consciousness depends on them.' },
  { from: 'fanon_wretched_of_the_earth', to: 'freire_pedagogy_of_the_oppressed', relation: 'extended', year: 1968, note: 'Freire cites The Wretched of the Earth in chapter 1 for the claim that the oppressed, having internalized the oppressor, at first want to resemble him; Fanon\'s account of the colonized is one of the book\'s named sources.' },
  { from: 'freire_pedagogy_of_the_oppressed', to: 'hooks_all_about_love', relation: 'extended', year: 2000, note: 'hooks names Freire as one of her two teachers (with Thich Nhat Hanh) and her Teaching to Transgress (1994) includes a dialogue on his influence; All About Love carries his insistence that love is an act, not a feeling, into the ethics of relationships.' },
  { from: 'freire_pedagogy_of_the_oppressed', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Senghor
  { from: 'du_bois_double_consciousness', to: 'senghor_negritude', relation: 'extended', year: 1948, note: 'Senghor and Césaire read the Harlem Renaissance in 1930s Paris, and Senghor repeatedly credited the "New Negro" writers as forerunners of Négritude; Du Bois, who organized the Pan-African Congresses in Paris from 1919, was the movement\'s elder, though Senghor\'s direct source was the poets more than Du Bois himself.' },
  { from: 'senghor_negritude', to: 'fanon_wretched_of_the_earth', relation: 'refuted', year: 1961, note: 'Fanon rejected Négritude in Black Skin, White Masks (1952), where Sartre\'s "Orphée noir" preface to Senghor\'s anthology cost him "the last illusion", and in The Wretched of the Earth ("On National Culture") he argues that a continent-wide Black culture is an abstraction, and that national culture is made in the struggle, not recovered from the past.' },

  // Mariátegui
  { from: 'marx_alienated_labor', to: 'mariategui_seven_essays', relation: 'extended', year: 1928, note: 'Mariátegui became a Marxist in Italy in 1920–23, founded the Peruvian Socialist Party in 1928, and the Seven Essays apply Marx\'s analysis of landholding and labour to Peru; his originality is to root it in the Indigenous ayllu rather than an industrial proletariat.' },
  { from: 'mariategui_seven_essays', to: 'ubuntu_person_through_persons', relation: 'converged', note: 'Both hold that the community comes before the individual and is the ground of a good life: Mariátegui\'s ayllu with its common land, the Southern African "I am because we are"; Mariátegui died in 1930 and Mbiti\'s 1969 formulation does not draw on him.' },
  { from: 'mariategui_seven_essays', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Wiredu
  { from: 'ubuntu_person_through_persons', to: 'wiredu_conceptual_decolonization', relation: 'extended', year: 1995, note: 'Wiredu\'s essays on Akan communalism and personhood (Cultural Universals and Particulars) belong to the same African-philosophy debate as Mbiti\'s "I am because we are", and Wiredu engages Mbiti\'s African Religions and Philosophy directly, criticizing its claim that Africans are "notoriously religious".' },
  { from: 'zera_yacob_hatata', to: 'wiredu_conceptual_decolonization', relation: 'converged', note: 'Both test inherited religious and philosophical doctrines against one\'s own reasoning and tradition rather than accepting them from the teachers who brought them; three centuries apart, and no citation of Zera Yacob by Wiredu is known to us.' },
  { from: 'wiredu_conceptual_decolonization', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
];
