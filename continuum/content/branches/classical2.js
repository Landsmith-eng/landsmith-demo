// Branch: classical and early-modern thought beyond the line, part two: Homer, Sophocles, Machiavelli, Locke,
// Rousseau, Adam Smith, Leibniz, Voltaire.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Every passage verified word for word against the Project Gutenberg texts cited.

export const nodes = [
  {
    id: 'homer_achilles_choice',
    type: 'text',
    field: 'philosophy',
    thinker: 'Homer',
    year: -750,
    title: 'Achilles\' two fates: a short life with undying fame, or a long one at home',
    prompt: 'If you could trade twenty quiet years for being remembered a thousand years from now, would you? What are you actually trading for already?',
    plain_face:
      'The oldest poem in Europe pauses its war for a job offer. Achilles, the best fighter alive, tells the envoys that his mother, a goddess, laid out his two fates: stay at Troy and die young with a name that never fades, or sail home and live long and be forgotten. He is sitting by his ships, refusing to fight, genuinely weighing the quiet life. It is the first time anyone in our literature asks whether glory is worth what it costs.',
    source_face:
      'My mother Thetis tells me that there are two ways in which I may meet my end. If I stay here and fight, I shall not return alive but my name will live for ever: whereas if I go home my name will die, but it will be long ere death shall take me. To the rest of you, then, I say, ‘Go home, for you will not take Ilius.’',
    source_citation: 'Homer, Iliad, Book IX (Achilles answering the embassy; Greek lines 410–420), trans. Samuel Butler (London: Longmans, Green, 1898)',
    source_url: 'https://www.gutenberg.org/ebooks/2199',
  },
  {
    id: 'sophocles_antigone',
    type: 'dilemma',
    field: 'philosophy',
    thinker: 'Sophocles',
    year: -441,
    title: 'Antigone: the unwritten laws against the king\'s decree',
    prompt: 'Is there a rule you would break, openly and at real cost, because something older than the rule says you must? What is that something?',
    plain_face:
      'Creon, the new king of Thebes, has decreed that the body of Antigone\'s brother, who died attacking the city, must lie unburied. She buries him anyway and, caught, does not deny it. Her defence: a king\'s proclamation is a notice pinned to a door; the duty to bury your dead was never pinned up by anyone, has no date, and cannot be taken down. Creon cannot bend, she cannot yield, and both lose everything. The play does not say who was right. It makes you choose.',
    source_face:
      'ANTIGONE. Yea, for these laws were not ordained of Zeus,\nAnd she who sits enthroned with gods below,\nJustice, enacted not these human laws.\nNor did I deem that thou, a mortal man,\nCould’st by a breath annul and override\nThe immutable unwritten laws of Heaven.\nThey were not born today nor yesterday;\nThey die not; and none knoweth whence they sprang.\nI was not like, who feared no mortal’s frown,\nTo disobey these laws and so provoke\nThe wrath of Heaven. I knew that I must die,\nE’en hadst thou not proclaimed it; and if death\nIs thereby hastened, I shall count it gain.',
    source_citation: 'Sophocles, Antigone, lines 450–464 (Antigone to Creon), trans. Francis Storr (Loeb Classical Library, 1912)',
    source_url: 'https://www.gutenberg.org/ebooks/31',
  },
  {
    id: 'machiavelli_fortune_and_virtu',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Niccolò Machiavelli',
    year: 1532,
    title: 'Fortune is a river in flood; build the dykes while the weather is fair',
    prompt: 'Think of the last thing that "just happened" to you. What could you have built beforehand that would have changed how it landed?',
    plain_face:
      'For a thousand years the advice about luck was: accept it. Machiavelli, a sacked Florentine civil servant, changed the picture. Fortune is a river that floods and sweeps away everything in its path, but a river can be given dykes and canals, if you dig them before the rain. He guesses luck rules about half of what happens to us; the other half is ours. His harder claim: in that half, the bold usually do better than the careful, because the times change faster than careful people do.',
    source_face:
      'I hold it to be true that Fortune is the arbiter of one-half of our actions, but that she still leaves us to direct the other half, or perhaps a little less. … I compare her to one of those raging rivers, which when in flood overflows the plains, sweeping away trees and buildings, bearing away the soil from place to place; everything flies before it, all yield to its violence, without being able in any way to withstand it; and yet, though its nature be such, it does not follow therefore that men, when the weather becomes fair, shall not make provision, both with defences and barriers, in such a manner that, rising again, the waters may pass away by canal, and their force be neither so unrestrained nor so dangerous.\n\n… For my part I consider that it is better to be adventurous than cautious, because fortune is a woman, and if you wish to keep her under it is necessary to beat and ill-use her; and it is seen that she allows herself to be mastered by the adventurous rather than by those who go to work more coldly.',
    source_citation: 'Niccolò Machiavelli, The Prince (written 1513, published 1532), ch. XXV, "What Fortune Can Effect in Human Affairs and How to Withstand Her", trans. W. K. Marriott (London: J. M. Dent, 1908). The ellipsis skips a page; the second passage is the chapter\'s closing paragraph.',
    source_url: 'https://www.gutenberg.org/ebooks/1232',
  },
  {
    id: 'locke_blank_slate',
    type: 'quote',
    field: 'philosophy',
    thinker: 'John Locke',
    year: 1689,
    title: 'The mind is white paper: everything on it came from experience',
    prompt: 'Pick one conviction you hold about how people are. Can you trace where it was written on you, and by whom?',
    plain_face:
      'Locke asked where all the furniture of the mind comes from and answered: none of it was there at the start. A newborn\'s mind is a blank sheet, and every idea on it was written by experience, either the senses looking outward or the mind watching its own workings. Nothing is innate, not even our principles, which were penned on the sheet by parents and teachers while it was still blank. The hopeful twist is that whatever experience wrote, more experience can revise.',
    source_face:
      'Let us then suppose the mind to be, as we say, white paper, void of all characters, without any ideas:—How comes it to be furnished? Whence comes it by that vast store which the busy and boundless fancy of man has painted on it with an almost endless variety? Whence has it all the MATERIALS of reason and knowledge? To this I answer, in one word, from EXPERIENCE. In that all our knowledge is founded; and from that it ultimately derives itself.',
    source_citation: 'John Locke, An Essay Concerning Human Understanding (1689), Book II, ch. I, §2. Capitals are the Project Gutenberg text\'s rendering of the original emphasis.',
    source_url: 'https://www.gutenberg.org/ebooks/10615',
  },
  {
    id: 'rousseau_born_free',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Jean-Jacques Rousseau',
    year: 1762,
    title: '"Man is born free; and everywhere he is in chains"',
    prompt: 'Which of the constraints on your life did you agree to, and which did you simply find yourself inside? Would you sign up for them now?',
    plain_face:
      'Rousseau opens the Social Contract like a detective: here is a free creature, here are its chains, and the question is not who did it but what, if anything, could make it legitimate. His earlier answer was that people are not wicked by nature; wickedness arrived with property and comparison. His later answer was that only a society we would genuinely agree to, as equals, has any right to bind us. A lock is not a chain if you hold the key.',
    source_face:
      'Man is born free; and everywhere he is in chains. One thinks himself the master of others, and still remains a greater slave than they. How did this change come about? I do not know. What can make it legitimate? That question I think I can answer.',
    source_citation: 'Jean-Jacques Rousseau, The Social Contract (1762), Book I, ch. 1, "Subject of the First Book", trans. G. D. H. Cole (London: J. M. Dent, 1913)',
    source_url: 'https://www.gutenberg.org/ebooks/46333',
  },
  {
    id: 'adam_smith_impartial_spectator',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Adam Smith',
    year: 1759,
    title: 'The impartial spectator: the tribunal within the breast',
    prompt: 'Imagine a fair-minded stranger who saw everything you did today. Where would they nod, and where would they wince?',
    plain_face:
      'Before the Wealth of Nations, Smith wrote a book about conscience. We learn what is right, he says, by watching how other people react to us, and then we carry a judge home: an imagined impartial spectator who sees our conduct the way a fair stranger would. Think of the dashcam you install in your own head. Once it is running, applause from the whole world cannot drown it out, and the whole world\'s scorn cannot overrule it when it says you were right.',
    source_face:
      'The applause of the whole world will avail but little, if our own conscience condemn us; and the disapprobation of all mankind is not capable of oppressing us, when we are absolved by the tribunal within our own breast, and when our own mind tells us that mankind are in the wrong. But though this tribunal within the breast be thus the supreme arbiter of all our actions, though it can reverse the decisions of all mankind with regard to our character and conduct, and mortify us amidst the applause, or support us under the censure of the world; yet, if we inquire into the origin of its institution, its jurisdiction we shall find is in a great measure derived from the authority of that very tribunal, whose decisions it so often and so justly reverses.',
    source_citation: 'Adam Smith, The Theory of Moral Sentiments (1759), Part III, ch. II; text of the Dublin printing of 1777 (J. Beatty and C. Jackson, labelled "the sixth edition")',
    source_url: 'https://www.gutenberg.org/ebooks/67363',
  },
  {
    id: 'leibniz_best_of_all_possible_worlds',
    type: 'thinker',
    field: 'philosophy',
    thinker: 'Gottfried Wilhelm Leibniz',
    year: 1710,
    title: 'This is the best of all possible worlds',
    prompt: 'Take one thing you wish were different. If you could change it and nothing else, are you sure the whole would come out better?',
    plain_face:
      'Leibniz, who invented calculus alongside Newton, asked why a perfect God would make a world with earthquakes and cruelty in it. His answer: a perfect being chooses the best, so of all the worlds that could have existed, this one, evil included, is the best as a whole. Every chess move looks bad if you look at one square; the grandmaster is playing the board. Voltaire found this unbearable after the Lisbon earthquake and mocked it for ever. But the question underneath, whether the good of the whole can justify the pain of the part, has not gone away.',
    source_face:
      'Now this supreme wisdom, united to a goodness that is no less infinite, cannot but have chosen the best. For as a lesser evil is a kind of good, even so a lesser good is a kind of evil if it stands in the way of a greater good; and there would be something to correct in the actions of God if it were possible to do better.',
    source_citation: 'G. W. Leibniz, Theodicy (1710), Part I, §8, trans. E. M. Huggard (London: Routledge & Kegan Paul, 1951), as hosted by Project Gutenberg, which has cleared the text for the United States',
    source_url: 'https://www.gutenberg.org/ebooks/17147',
  },
  {
    id: 'voltaire_cultivate_our_garden',
    type: 'text',
    field: 'philosophy',
    thinker: 'Voltaire',
    year: 1759,
    title: 'Candide: "let us cultivate our garden"',
    prompt: 'What is the small plot that is actually yours to tend? How much of today went to arguing about plots that are not?',
    plain_face:
      'Candide is raised on the tutor Pangloss\'s doctrine that this is the best of all possible worlds, then marched through war, earthquake, the Inquisition, shipwreck and slavery to test it. At the end the survivors meet an old Turk with twenty acres who has never heard of the great questions and says that work keeps away three evils: boredom, vice and want. Pangloss is still explaining. Candide\'s last word cuts him off: fine, but let us tend our garden. Not an answer to the problem of evil; a decision to stop waiting for one.',
    source_face:
      '“You must have a vast and magnificent estate,” said Candide to the Turk.\n\n“I have only twenty acres,” replied the old man; “I and my children cultivate them; our labour preserves us from three great evils—weariness, vice, and want.”\n\n… Pangloss sometimes said to Candide: “There is a concatenation of events in this best of all possible worlds: for if you had not been kicked out of a magnificent castle for love of Miss Cunegonde: if you had not been put into the Inquisition: if you had not walked over America: if you had not stabbed the Baron: if you had not lost all your sheep from the fine country of El Dorado: you would not be here eating preserved citrons and pistachio-nuts.”\n\n“All that is very well,” answered Candide, “but let us cultivate our garden.”',
    source_citation: 'Voltaire, Candide (1759), ch. XXX, anonymous English translation in the Modern Library edition (New York: Boni and Liveright, 1918, with an introduction by Philip Littell)',
    source_url: 'https://www.gutenberg.org/ebooks/19942',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Homer
  { from: 'gilgamesh_siduri_seize_the_day', to: 'homer_achilles_choice', relation: 'converged', note: 'Both epics set the hero the same choice, a long quiet life or a name that outlasts death; Siduri urges the first, Achilles weighs both. No direct contact is documented.' },
  { from: 'homer_achilles_choice', to: 'socrates_unexamined_life', relation: 'extended', year: -399, note: 'In the Apology Socrates defends staying at his post by citing "the son of Thetis", who "despised danger in comparison with disgrace" (Jowett).' },
  { from: 'homer_achilles_choice', to: 'practice_keep_death_in_view', relation: 'lands_on' },

  // Sophocles
  { from: 'sophocles_antigone', to: 'aquinas_unjust_law_is_no_law', relation: 'converged', note: 'Both hold that a human decree can be overruled by a higher law; Aquinas builds on Augustine and Aristotle and does not cite Sophocles.' },
  { from: 'sophocles_antigone', to: 'king_letter_from_birmingham_jail', relation: 'converged', note: 'King\'s letter argues that an unjust law is no law and breaks it openly, accepting the penalty, as Antigone does; he cites Augustine and Aquinas, not Sophocles.' },
  { from: 'sophocles_antigone', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Machiavelli
  { from: 'boethius_wheel_of_fortune', to: 'machiavelli_fortune_and_virtu', relation: 'refuted', year: 1513, note: 'Boethius counsels accepting Fortune\'s turns; Machiavelli answers that Fortune rules only half, and the rest can be dyked and canalled before the flood.' },
  { from: 'machiavelli_fortune_and_virtu', to: 'hobbes_state_of_nature', relation: 'converged', note: 'Both build politics on men as they are rather than as they should be; Leviathan never names Machiavelli, so no direct debt is claimed.' },
  { from: 'machiavelli_fortune_and_virtu', to: 'practice_control_your_response', relation: 'lands_on' },

  // Locke
  { from: 'locke_blank_slate', to: 'hume_bundle_of_perceptions', relation: 'extended', year: 1739, note: 'Hume\'s Treatise starts from Locke\'s ideas and says it restores the word "idea" to its original sense, "from which Mr Locke had perverted it" (Book I, Part I, §1, note).' },
  { from: 'locke_blank_slate', to: 'rousseau_born_free', relation: 'extended', year: 1755, note: 'Rousseau\'s Discourse on Inequality cites "the axiom of the wise Locke, Where there is no property, there can be no injury", then argues that property is where injury began.' },
  { from: 'locke_blank_slate', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Rousseau
  { from: 'hobbes_state_of_nature', to: 'rousseau_born_free', relation: 'refuted', year: 1755, note: 'The Discourse on Inequality names Hobbes and rejects his picture: "let us beware concluding with Hobbes, that man, as having no idea of goodness, must be naturally bad."' },
  { from: 'rousseau_born_free', to: 'kant_ends_not_means', relation: 'extended', year: 1785, note: 'Kant wrote in private notes (1764–65) that Rousseau "set me right" and taught him to honour humanity; the Groundwork itself does not name Rousseau.' },
  { from: 'rousseau_born_free', to: 'wollstonecraft_reason_has_no_sex', relation: 'refuted', year: 1792, note: 'The Vindication attacks Rousseau\'s Émile by name: "it is not the superstructure, but the foundation of her character, the principles on which her education was built, that I mean to attack."' },
  { from: 'rousseau_born_free', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Adam Smith
  { from: 'epictetus_up_to_us', to: 'adam_smith_impartial_spectator', relation: 'extended', year: 1759, note: 'Smith expounds the Stoics at length in Moral Sentiments Part VII and quotes Epictetus directly ("If I am going to fail, says Epictetus, I chuse the best ship, and the best pilot").' },
  { from: 'hume_bundle_of_perceptions', to: 'adam_smith_impartial_spectator', relation: 'extended', year: 1759, note: 'Hume was Smith\'s closest friend and his Treatise had already made sympathy central; Moral Sentiments builds on that without naming him.' },
  { from: 'adam_smith_impartial_spectator', to: 'marx_alienated_labor', relation: 'extended', year: 1848, note: 'Marx\'s Capital quotes The Wealth of Nations on the division of labour repeatedly; the Manifesto does not name Smith.' },
  { from: 'adam_smith_impartial_spectator', to: 'practice_examine_daily', relation: 'lands_on' },

  // Leibniz
  { from: 'spinoza_freedom_understanding_necessity', to: 'leibniz_best_of_all_possible_worlds', relation: 'refuted', year: 1710, note: 'The Theodicy names Spinoza among those who "extended furthest the doctrine of the necessity of things" and argues that God chose this world freely among possible ones.' },
  { from: 'job_why_the_righteous_suffer', to: 'leibniz_best_of_all_possible_worlds', relation: 'extended', year: 1710, note: 'The Theodicy takes up Job\'s question, why a just God permits evil, and cites Job 1:21 among its scriptural cases.' },
  { from: 'leibniz_best_of_all_possible_worlds', to: 'voltaire_cultivate_our_garden', relation: 'refuted', year: 1759, note: 'Pangloss is Leibniz\'s optimism in motley; Candide names him outright ("Leibnitz could never be wrong … the pre-established harmony is the finest thing in the world").' },

  // Voltaire
  { from: 'voltaire_cultivate_our_garden', to: 'practice_control_your_response', relation: 'lands_on' },
];
