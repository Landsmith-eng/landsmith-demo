// Branch: six more crossings: Shankara, Mozi, Wang Yangming, Las Casas at Valladolid, Kimmerer, Dostoevsky's Grand Inquisitor.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Shankara verified word for word against Thibaut's translation (Project Gutenberg #16295, Brahma-Sutra commentary I.4.6).
// Las Casas verified against MacNutt's 1909 life (Project Gutenberg #23466), which translates his Valladolid reply.
// Dostoevsky verified against Constance Garnett's translation (Project Gutenberg #28054).
// Mencius's attack on Mozi verified against Legge's Works of Mencius on Wikisource (Book III Part II, ch. 9).
// Mozi (Mei 1929) and Wang Yangming (Henke 1916) are public domain but no copy was reachable, so their faces are labelled summaries.
// Kimmerer is in copyright: labelled summary, no quotation.

export const nodes = [
  {
    id: 'shankara_rope_and_snake',
    type: 'concept',
    field: 'religion',
    thinker: 'Adi Shankara',
    year: 800,
    title: 'The rope and the snake: the world is a misreading of Brahman',
    prompt: 'Think of a fear that vanished the moment you understood what you were actually looking at. What changed, the world or you?',
    plain_face:
      'At dusk you see a snake on the path, your heart pounds, and then a friend says "it is a rope." The snake is gone, and nothing on the path has changed. Shankara, who built Advaita Vedanta out of the Upanishads, says the whole world of separate things, including the separate little self you take yourself to be, is like that snake: laid over one single reality, Brahman, by not-knowing. Learn what you are looking at and the fear ends; the rope was never anything else.',
    source_face:
      'For as long as Nescience remains, so long the soul is affected with definite attributes, &c.; but as soon as Nescience comes to an end, the soul is one with the highest Self, as is taught by such scriptural texts as \'Thou art that.\' But whether Nescience be active or inactive, no difference is made thereby in the thing itself (viz. the soul). A man may, in the dark, mistake a piece of rope lying on the ground for a snake, and run away from it, frightened and trembling; thereon another man may tell him, \'Do not be afraid, it is only a rope, not a snake;\' and he may then dismiss the fear caused by the imagined snake, and stop running. But all the while the presence and subsequent absence of his erroneous notion, as to the rope being a snake, make no difference whatever in the rope itself. Exactly analogous is the case of the individual soul which is in reality one with the highest soul, although Nescience makes it appear different.',
    source_citation: 'Shankara, Commentary on the Vedanta-Sutras (Brahma-Sutra-Bhashya) I.4.6 (trans. George Thibaut, Sacred Books of the East vol. 34, 1890)',
    source_url: 'https://www.gutenberg.org/ebooks/16295',
  },
  {
    id: 'mozi_impartial_care',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Mozi (Mo Di)',
    year: -430,
    title: 'Impartial care: love everyone\'s family as your own',
    prompt: 'Whose troubles do you treat as your own, and where does that circle stop? What would it cost you to widen it by one ring?',
    plain_face:
      'A town where every household guards only its own well goes thirsty in a drought; a town that shares its wells does not. Mozi, a craftsman-philosopher a century after Confucius, diagnosed the wars and robberies of his age as one disease: partiality. People care for their own family, their own state, and so feel free to harm everyone else\'s. His cure, jian ai, "impartial care", is to regard other people\'s parents, cities and bodies as you regard your own. Not because it is sweet, but because it is the only arrangement under which everyone, including you, is safe.',
    source_face:
      'Summary (no public-domain translation reachable): In the three "Jian ai" chapters, Mozi argues that the sage who would order the world must first know where disorder comes from, as a doctor must know the source of a disease. Disorder, he finds, comes from the lack of mutual love: the son loves himself and not his father, so he harms his father to benefit himself; thieves love their own houses and not others\', so they rob; lords love their own states and not others\', so they attack. If all under heaven loved each other impartially, regarding others\' states, houses and persons as their own, there would be no one to attack, rob or harm, and the world would be in order. To the objection that this is fine but impossible, he replies that rulers have made people do far harder things, such as starving to be thin or walking into fire, and that impartial care, being to everyone\'s benefit, is far easier to bring about.',
    source_citation: 'Mozi, "Jian ai" (Universal Love), chapters 14–16; English in Y. P. Mei, The Ethical and Political Works of Motse (London: Probsthain, 1929), public domain in the US but no copy was reachable. Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'wang_yangming_unity_of_knowing_and_acting',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Wang Yangming',
    year: 1520,
    title: 'Knowing and acting are one',
    prompt: 'Name something you say you know is right but do not do. Do you really know it, or do you only know the words?',
    plain_face:
      'You do not know that the stove is hot and then decide to pull your hand away; the knowing and the pulling are one movement. Wang Yangming, a Ming official, general and philosopher, said all real moral knowledge is like that. If you "know" you should visit your sick friend and never go, you have not yet known it; you have only repeated a sentence. Knowledge is the beginning of action and action is the completion of knowledge, so the test of what you know is what you do.',
    source_face:
      'Summary (no public-domain translation reachable): In the Chuanxilu, his disciple Xu Ai objects that people plainly know they should be filial to their parents and respectful to elder brothers yet are not, so knowing and acting must be two things. Wang replies that such people have been cut off by selfish desire and have never known at all: there has never been anyone who knew and did not act, and those who know but do not act simply do not yet know. He compares it to seeing a beautiful colour and loving it, or smelling a bad odour and hating it: the seeing belongs to knowing, the loving to acting, and the two happen at once. Knowledge, he says, is the direction of action, and action the effort of knowledge; knowledge is the beginning of action and action the completion of knowledge. His later teaching of "the extension of innate knowing" (zhi liangzhi) is this doctrine applied: act on what the heart already knows is right.',
    source_citation: 'Wang Yangming, Chuanxilu (Instructions for Practical Living), part I, conversation with Xu Ai, c. 1518; English in F. G. Henke, The Philosophy of Wang Yang-ming (Chicago: Open Court, 1916), public domain but no copy was reachable. Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'las_casas_valladolid',
    type: 'dilemma',
    field: 'religion',
    thinker: 'Bartolomé de las Casas',
    year: 1550,
    title: 'The Valladolid debate: do the conquered have the same rights?',
    prompt: 'Is there a group of people whose suffering you have quietly filed under "different"? What argument are you using to keep them there?',
    plain_face:
      'In 1550 the Spanish emperor paused the conquest of the Americas and ordered a debate. A courtroom where the accused is a whole continent: that was Valladolid. On one side, the scholar Sepúlveda argued that the peoples of the Americas were natural slaves whose sins and backwardness justified war on them. On the other, Las Casas, a friar who had spent fifty years watching the conquest, argued that they were full human beings with the same rights as anyone in Spain, and that Christians could not conquer their way to converts. No verdict was announced. The question did not go away.',
    source_face:
      'In the first session of the assembly, Sepulveda stated his propositions and expounded his defence of them, presenting, under four heads, his reasons why it was lawful to make war on the Indians:\n\n1. Because of the gravity of their sins, particularly the practice of idolatry and other sins against nature.\n2. Because of the rudeness of their heathen and barbarous natures, which oblige them to serve those of more elevated natures, such as the Spaniards possess.\n3. For the spread of the faith; for their subjection renders its preaching easier and more persuasive.\n4. On account of the harm they do to one another, killing men to sacrifice them and some, in order to eat them. …\n\n[Las Casas, opening his reply:] "So enormous are the errors and scandalous propositions, contrary to all evangelical truth and to all Christianity that the Doctor Sepulveda has accumulated, set forth, and coloured with misguided zeal in the royal service, that no honest Christian would be surprised should we wish to combat him, not only with lengthy argument, but likewise as a mortal enemy of Christendom, an abettor of cruel tyrants, extirpator of the human race, and disseminator of fatal blindness throughout this realm of Spain. But the least we could do, having regard to the obligations imposed by the law of God, is to answer each point here presented, and this will complete his confusion."',
    source_citation: 'Francis Augustus MacNutt, Bartholomew de Las Casas: His Life, Apostolate, and Writings (New York: Putnam, 1909), ch. XX, summarizing Sepúlveda\'s four propositions at Valladolid and translating the opening of Las Casas\'s reply to his twelve objections',
    source_url: 'https://www.gutenberg.org/ebooks/23466',
  },
  {
    id: 'kimmerer_braiding_sweetgrass',
    type: 'text',
    field: 'religion',
    thinker: 'Robin Wall Kimmerer',
    year: 2013,
    title: 'Braiding Sweetgrass: the honorable harvest',
    prompt: 'What did you take from the living world today, food, water, wood, air? Did you ask, did you give anything back, and would it change anything if you did?',
    plain_face:
      'Sweetgrass grows thicker where people harvest it with care and thins out where no one picks it at all. Kimmerer, a botanist and a citizen of the Potawatomi Nation, found that students\' field data agreed with what her elders already taught: the world is not a warehouse but a gift exchange. Take only what you need, ask first, never take the first plant you see or the last, use everything, give something back. She calls this the honorable harvest, and says it turns a consumer back into a relative.',
    source_face:
      'Summary (work under copyright): Braiding Sweetgrass weaves three strands: Indigenous knowledge, the botany Kimmerer teaches, and her own life as a mother and a member of the Citizen Potawatomi Nation. Its central idea is reciprocity. In a gift economy, she argues, a gift creates a relationship and an obligation, and the land\'s gifts (berries, maple sap, sweetgrass) ask for gratitude and care in return. The chapter "Allegiance to Gratitude" presents the Haudenosaunee Thanksgiving Address, which greets and thanks each part of the living world in turn, as a model for a culture that begins from enough rather than scarcity. The chapter "The Honorable Harvest" sets out the unwritten rules she learned from elders: know the ways of the ones who take care of you; introduce yourself and ask permission; never take the first or the last; take only what you need; harvest in a way that minimizes harm; use everything; share; give thanks; give a gift in reciprocity for what you have taken; sustain the ones who sustain you. A sweetgrass-harvesting study by one of her students found that plots harvested respectfully flourished while unharvested plots declined. The book ends with the hope that people can again become "naturalized" to a place, living as if their children\'s future mattered and as if the land were a relative.',
    source_citation: 'Robin Wall Kimmerer, Braiding Sweetgrass: Indigenous Wisdom, Scientific Knowledge, and the Teachings of Plants (Minneapolis: Milkweed Editions, 2013), esp. "Allegiance to Gratitude", "The Honorable Harvest" and "Mishkos Kenomagwen: The Teachings of Grass". Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'dostoevsky_grand_inquisitor',
    type: 'text',
    field: 'philosophy',
    thinker: 'Fyodor Dostoevsky',
    year: 1880,
    title: 'The Grand Inquisitor: people will trade freedom for bread',
    prompt: 'When did you last hand a decision to someone else, an expert, a boss, a rule, mostly so it would not be yours to carry? What did it buy you?',
    plain_face:
      'Christ returns to Seville during the Inquisition and is arrested. In his cell, the old Inquisitor tells him his mistake: he offered people freedom, and freedom is the one thing they cannot bear. Dostoevsky\'s story, told by the atheist brother Ivan, is like a bargain at a fairground: give us your right to choose and we will give you bread, a miracle to believe in and someone to obey, and you will finally sleep. The Inquisitor says people will take that deal every time. Christ says nothing, and kisses him.',
    source_face:
      '"Thou wouldst go into the world, and art going with empty hands, with some promise of freedom which men in their simplicity and their natural unruliness cannot even understand, which they fear and dread—for nothing has ever been more insupportable for a man and a human society than freedom. But seest Thou these stones in this parched and barren wilderness? Turn them into bread, and mankind will run after Thee like a flock of sheep, grateful and obedient, though for ever trembling, lest Thou withdraw Thy hand and deny them Thy bread." …\n\nNo science will give them bread so long as they remain free. In the end they will lay their freedom at our feet, and say to us, "Make us your slaves, but feed us." They will understand themselves, at last, that freedom and bread enough for all are inconceivable together, for never, never will they be able to share between them! …\n\nThere are three powers, three powers alone, able to conquer and to hold captive for ever the conscience of these impotent rebels for their happiness—those forces are miracle, mystery and authority. Thou hast rejected all three and hast set the example for doing so.',
    source_citation: 'Fyodor Dostoevsky, The Brothers Karamazov, Part II, Book V, ch. 5 "The Grand Inquisitor" (trans. Constance Garnett, 1912)',
    source_url: 'https://www.gutenberg.org/ebooks/28054',
  },
];

export const edges = [
  // Shankara
  { from: 'upanishads_tat_tvam_asi', to: 'shankara_rope_and_snake', relation: 'extended', year: 800, note: 'Shankara\'s whole system is a reading of the Upanishads; his Brahma-Sutra commentary cites "That art thou" (Chandogya VI.8.7) as the great saying that the self and Brahman are one.' },
  { from: 'plato_cave', to: 'shankara_rope_and_snake', relation: 'converged', note: 'Both say ordinary experience is appearance mistaken for reality, dispelled only by knowledge; Shankara had no contact with Greek philosophy.' },
  { from: 'shankara_rope_and_snake', to: 'schrodinger_atman_brahman', relation: 'extended', year: 1944, note: 'Schrödinger\'s "Atman = Brahman" is the Advaita Vedanta formula, which he read in German accounts of Indian philosophy; he cites the Upanishads rather than Shankara by name.' },
  { from: 'shankara_rope_and_snake', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Mozi
  { from: 'mozi_impartial_care', to: 'mencius_child_at_the_well', relation: 'refuted', year: -300, note: 'Mencius attacks Mozi by name (III.B.9): "Mo\'s principle is \'to love all equally,\' which does not acknowledge the peculiar affection due to a father" and so puts people "in the state of a beast" (Legge).' },
  { from: 'mozi_impartial_care', to: 'singer_drowning_child', relation: 'converged', note: 'Both argue that a stranger\'s need has the same claim on you as your own family\'s; Singer\'s 1972 paper does not cite Mozi.' },
  { from: 'mozi_impartial_care', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Wang Yangming
  { from: 'mencius_child_at_the_well', to: 'wang_yangming_unity_of_knowing_and_acting', relation: 'extended', year: 1520, note: 'Wang\'s "innate knowing" (liangzhi) is Mencius\'s term (VII.A.15, "the knowledge possessed by them without the exercise of thought is their intuitive knowledge", Legge); Wang built his teaching on it.' },
  { from: 'wang_yangming_unity_of_knowing_and_acting', to: 'william_james_habit', relation: 'converged', note: 'James\'s chapter on habit tells the reader to act on every resolution at the first opportunity, since a resolve not acted on is nothing; Wang said knowing that does not issue in action is not yet knowing. James did not read Wang.' },
  { from: 'wang_yangming_unity_of_knowing_and_acting', to: 'practice_examine_daily', relation: 'lands_on' },

  // Las Casas
  { from: 'aquinas_unjust_law_is_no_law', to: 'las_casas_valladolid', relation: 'extended', year: 1550, note: 'Las Casas was a Dominican who, MacNutt records, gave much of his cloister years to the works of Aquinas, and he argued at Valladolid from Thomist natural law, which binds all peoples alike.' },
  { from: 'las_casas_valladolid', to: 'kant_ends_not_means', relation: 'converged', note: 'Las Casas held that the peoples of the Americas may not be used as instruments of conquest or profit because they are human; Kant\'s 1785 formula says every person is an end, never merely a means. Kant does not cite Las Casas.' },
  { from: 'las_casas_valladolid', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Kimmerer
  { from: 'haudenosaunee_seventh_generation', to: 'kimmerer_braiding_sweetgrass', relation: 'extended', year: 2013, note: 'Kimmerer is Potawatomi, not Haudenosaunee, but her chapter "Allegiance to Gratitude" takes the Haudenosaunee Thanksgiving Address, taught in the schools of the Onondaga Nation near her home, as a model of reciprocity.' },
  { from: 'gita_act_without_attachment_to_fruits', to: 'kimmerer_braiding_sweetgrass', relation: 'converged', note: 'Both treat the harvest as not yours to claim: the Gita says act without owning the fruits, Kimmerer says take only what is given and give back. Kimmerer does not draw on the Gita.' },
  { from: 'kimmerer_braiding_sweetgrass', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Dostoevsky
  { from: 'dostoevsky_grand_inquisitor', to: 'nietzsche_amor_fati', relation: 'extended', year: 1888, note: 'Nietzsche, Twilight of the Idols, "Skirmishes" 45: "Dostoiewsky who, incidentally, was the only psychologist from whom I had anything to learn: he belongs to the happiest windfalls of my life" (Ludovici).' },
  { from: 'dostoevsky_grand_inquisitor', to: 'sartre_existence_precedes_essence', relation: 'extended', year: 1946, note: 'Sartre\'s 1946 lecture takes Ivan Karamazov\'s "if God did not exist, everything would be permitted" as the starting point of existentialism; the Sartre node here is a summary, so the wording is not verified.' },
  { from: 'hobbes_state_of_nature', to: 'dostoevsky_grand_inquisitor', relation: 'converged', note: 'Both picture people surrendering liberty to an authority in exchange for safety and bread; Hobbes thinks the bargain rational, the Inquisitor thinks it a betrayal of what people were offered. Dostoevsky is not building on Hobbes.' },
  { from: 'dostoevsky_grand_inquisitor', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
];
