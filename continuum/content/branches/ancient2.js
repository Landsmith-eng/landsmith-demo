// Branch: ancient and medieval contemplatives, batch 2 (Plato's cave, Plotinus, Shantideva, Patanjali, Dogen).
// Walk-only nodes (no seq). Every quoted source_face below was checked word for word against the cited
// public-domain text on Project Gutenberg (ebook ids in source_url). Shantideva has no public-domain English
// text reachable from here, so its source face is a labelled summary.

export const nodes = [
  {
    id: 'plato_cave',
    type: 'puzzle',
    field: 'philosophy',
    thinker: 'Plato',
    year: -375,
    title: 'The allegory of the cave',
    prompt: 'What is one belief you hold mainly because everyone around you has always held it? How would you find out if it were a shadow?',
    plain_face:
      'Imagine people who have spent their whole lives watching a screen, never told it was a screen. The shapes on it are the only world they know, and they are expert at predicting them. Plato has Socrates tell this story about prisoners chained in a cave watching shadows on a wall. One is dragged out into daylight; it hurts his eyes, and when he comes back to describe the sun, the others think he has gone mad. Plato\'s question: which of them are you, and would you want to be unchained?',
    source_face:
      'Behold! human beings living in a underground den, which has a mouth open towards the light and reaching all along the den; here they have been from their childhood, and have their legs and necks chained so that they cannot move, and can only see before them, being prevented by the chains from turning round their heads. Above and behind them a fire is blazing at a distance, and between the fire and the prisoners there is a raised way; and you will see, if you look, a low wall built along the way, like the screen which marionette players have in front of them, over which they show the puppets. …\n\nAnd if he is compelled to look straight at the light, will he not have a pain in his eyes which will make him turn away to take refuge in the objects of vision which he can see, and which he will conceive to be in reality clearer than the things which are now being shown to him? …\n\nThis entire allegory, I said, you may now append, dear Glaucon, to the previous argument; the prison-house is the world of sight, the light of the fire is the sun, and you will not misapprehend me if you interpret the journey upwards to be the ascent of the soul into the intellectual world according to my poor belief, which, at your desire, I have expressed—whether rightly or wrongly God knows.',
    source_citation: 'Plato, Republic VII, 514a–517b (trans. Benjamin Jowett, 3rd ed., 1892). The passage is narrated by Socrates to Glaucon.',
    source_url: 'https://www.gutenberg.org/ebooks/1497',
  },
  {
    id: 'plotinus_the_one',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Plotinus',
    year: 260,
    title: 'The flight of the alone to the Alone',
    prompt: 'When you strip away your job, your name and your opinions, what is left that still feels like you? Is it smaller, or larger?',
    plain_face:
      'A river does not stop being water when it reaches the sea; it stops being separate. Plotinus, who taught in Rome six centuries after Plato, took the climb out of the cave one step further. Beyond all the things we can see or even think there is a single source he simply called the One, and the soul can travel back to it, not by going anywhere, but by turning inward, letting go of the body\'s concerns and being alone with what is alone. He claimed to have made the journey himself, more than once.',
    source_face:
      'We must therefore hasten to issue from here below, detaching ourselves so far as possible from the body to which we still have the regret of being chained, making the effort to embrace the Divinity by our whole being, without leaving in us any part that is not in contact with Him. Then the soul can see the Divinity and herself, so far as is possible to her nature. …\n\nSuch is the life of the divinities; such is also that of divine and blessed men; detachment from all things here below, scorn of all earthly pleasures, and flight of the soul towards the Divinity that she shall see face to face (that is, "alone with the alone," as thought Numenius).',
    source_citation: 'Plotinus, Enneads VI.9 ("Of the Good, or of the One"), §§9 and 11, the closing words of the treatise (trans. Kenneth Sylvan Guthrie, Plotinos: Complete Works, vol. 1, 1918). Stephen MacKenna\'s 1930 version of the last phrase is "the passing of solitary to solitary".',
    source_url: 'https://www.gutenberg.org/ebooks/42930',
  },
  {
    id: 'shantideva_remedy_or_no_remedy',
    type: 'quote',
    field: 'religion',
    thinker: 'Shantideva',
    year: 700,
    title: 'If there is a remedy, why be upset? If there is none, why be upset?',
    prompt: 'What are you fretting about right now? Can anything be done about it? Write the answer, then notice what the fretting is for.',
    plain_face:
      'A pipe bursts in the kitchen. Either you can reach the stopcock, in which case turn it and the panic adds nothing, or you cannot, in which case the panic still adds nothing. Shantideva, an eighth-century Buddhist monk at the university of Nalanda, put the whole case against worry into two lines. There is nothing stern in it: the point is not to toughen up, but to see that distress is a tax you pay on top of the trouble, and that nobody is collecting it.',
    source_face:
      'Summary (no public-domain translation reachable): Bodhicaryāvatāra ("Entering the Path of Awakening") VI.10, in the chapter on patience, asks: if a difficulty can be remedied, what reason is there to be unhappy about it, and if it cannot be remedied, what use is being unhappy? The surrounding verses (VI.1–21) argue that anger and distress harm their owner more than any enemy does, and that suffering accepted calmly becomes a teacher. No public-domain English translation (L. D. Barnett\'s partial The Path of Light, 1909, is the oldest) could be fetched to verify an exact wording, so the verse is paraphrased here.',
    source_citation: 'Shantideva, Bodhicaryāvatāra VI.10 (c. 700 CE). Modern translations: Kate Crosby and Andrew Skilton, The Bodhicaryāvatāra (Oxford World\'s Classics, 1995); Padmakara Translation Group, The Way of the Bodhisattva (Shambhala, 1997). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'patanjali_stilling_the_mind',
    type: 'quote',
    field: 'religion',
    thinker: 'Patanjali',
    year: 200,
    title: 'Yoga is the stilling of the mind\'s churning',
    prompt: 'Sit for two minutes and count the separate thoughts that arrive. Which of them did you choose?',
    plain_face:
      'A pond in wind shows you nothing but broken light; let the wind drop and the bottom appears. Patanjali, who gathered India\'s older meditation lore into 195 short threads, defines yoga in the second line, before any posture is mentioned: it is bringing the restless churning of the mind to stillness. Two things do it, he says, practice held steadily over a long time, and the willingness to stop grasping at what the senses offer. The postures the West calls yoga are one rung of an eight-rung ladder whose top is this stillness.',
    source_face:
      '2. Union, spiritual consciousness, is gained through control of the versatile psychic nature.\n\n3. Then the Seer comes to consciousness in his proper nature. …\n\n12. The control of these psychic activities comes through the right use of the will, and through ceasing from self-indulgence. …\n\n13. The right use of the will is the steady, effort to stand in spiritual being. …\n\n14. This becomes a firm resting-place, when followed long, persistently, with earnestness.',
    source_citation: 'Patanjali, Yoga Sutras I.2–3 and I.12–14 (trans. Charles Johnston, The Yoga Sutras of Patanjali: The Book of the Spiritual Man, 1912). Johnston renders "yoga" as "Union" and "chitta vritti" as "the versatile psychic nature"; a more literal I.2 is "Yoga is the restraint of the modifications of the mind."',
    source_url: 'https://www.gutenberg.org/ebooks/2526',
  },
  {
    id: 'dogen_just_sitting',
    type: 'concept',
    field: 'religion',
    thinker: 'Dōgen',
    year: 1233,
    title: 'Just sitting',
    prompt: 'Could you sit for ten minutes without trying to get anything out of it? What would you be tempted to add?',
    plain_face:
      'Most things we do are for something: we run to get fit, we study to pass. Dōgen, a Japanese monk who brought Sōtō Zen home from China in 1227, taught a practice that is for nothing: shikantaza, "just sitting", upright and awake, not chasing enlightenment, because the sitting is already it. In his essay Genjōkōan he adds that studying yourself this closely ends in forgetting yourself, the way you forget your hands when you are absorbed in work. Asked what he had learned in China, he said only that his eyes were horizontal and his nose vertical.',
    source_face:
      'Again, ancient Zenists did not claim that there was any mysterious element in their spiritual attainment, as Do-gen says unequivocally respecting his Enlightenment: "I recognized only that my eyes are placed crosswise above the nose that stands lengthwise, and that I was not deceived by others. I came home from China with nothing in my hand. There is nothing mysterious in Buddhism. Time passes as it is natural, the sun rising in the east, and the moon setting into the west."\n\n… The sole means of securing mental calmness is the practice of Zazen, or the sitting in Meditation. This method was known in India as Yoga as early as the Upanisad period, and developed by the followers of the Yoga system. But Buddhists sharply distinguished Zazen from Yoga, and have the method peculiar to themselves.',
    source_citation: 'Dōgen, Eihei Kōroku, as quoted in Kaiten Nukariya, The Religion of the Samurai (1913), ch. VIII §9, with Nukariya\'s own account of zazen from ch. VIII §5. Dōgen\'s Fukanzazengi (1227) and Genjōkōan (Shōbōgenzō, 1233) have no public-domain English translation; see Kazuaki Tanahashi (ed.), Treasury of the True Dharma Eye (Shambhala, 2010).',
    source_url: 'https://www.gutenberg.org/ebooks/5173',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
// converged is symmetric (no contact); lands_on points from any node to a practice.
export const edges = [
  // Plato's cave
  { from: 'socrates_unexamined_life', to: 'plato_cave', relation: 'taught', year: -375, note: 'Socrates taught Plato, and Plato puts the whole allegory in Socrates\' mouth: it is Socrates who tells Glaucon to "Behold! human beings living in a underground den".' },
  { from: 'plato_cave', to: 'zhuangzi_butterfly_dream', relation: 'converged', note: 'Both ask whether what we take for the world is the world or a shadow of it, within a generation of each other at opposite ends of Eurasia, with no contact.' },
  { from: 'plato_cave', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Plotinus
  { from: 'plato_cave', to: 'plotinus_the_one', relation: 'extended', year: 260, note: 'Plotinus called himself a Platonist and turned the cave\'s "ascent of the soul into the intellectual world" into a whole programme: Ennead VI.9 ends with the soul\'s flight "alone with the alone".' },
  { from: 'plotinus_the_one', to: 'augustine_restless_heart', relation: 'extended', year: 397, note: 'Confessions VII.9: Augustine was given "certain books of the Platonists, translated from Greek into Latin", generally identified as Plotinus and Porphyry in Victorinus\'s version, and says they taught him "to search for incorporeal truth".' },
  { from: 'plotinus_the_one', to: 'upanishads_tat_tvam_asi', relation: 'converged', note: 'The One beyond thought that the soul rejoins by turning inward, and Brahman that the self already is: the same shape of answer, with no documented contact between Plotinus and Indian texts (Porphyry says he wanted to study Persian and Indian philosophy, but the expedition failed).' },
  { from: 'plotinus_the_one', to: 'practice_examine_daily', relation: 'lands_on' },

  // Shantideva
  { from: 'buddha_craving_root_of_suffering', to: 'shantideva_remedy_or_no_remedy', relation: 'extended', year: 700, note: 'Shantideva was a Mahayana monk at Nalanda; the Bodhicaryāvatāra is a manual for the bodhisattva path and treats distress and anger as forms of the craving the Buddha diagnosed.' },
  { from: 'epictetus_up_to_us', to: 'shantideva_remedy_or_no_remedy', relation: 'converged', note: 'Epictetus splits the world into what is up to us and what is not; Shantideva\'s verse makes the same cut (remedy or no remedy) and draws the same conclusion, six centuries later with no contact.' },
  { from: 'marcus_pain_is_your_estimate', to: 'shantideva_remedy_or_no_remedy', relation: 'converged', note: 'Both locate the extra suffering in the mind\'s reaction rather than the event; the Meditations and the Bodhicaryāvatāra were written five centuries apart with no contact.' },
  { from: 'shantideva_remedy_or_no_remedy', to: 'practice_control_your_response', relation: 'lands_on' },

  // Patanjali
  { from: 'upanishads_tat_tvam_asi', to: 'patanjali_stilling_the_mind', relation: 'extended', year: 200, note: 'Yoga is one of the six orthodox (Vedic) schools; it systematised meditation practices already described in the Upanishads (the Katha Upanishad calls the firm holding of the senses "yoga"), and Johnston reads Patanjali\'s "Union" as the Upanishadic union of self and Oversoul.' },
  { from: 'pyrrho_suspend_judgment', to: 'patanjali_stilling_the_mind', relation: 'converged', note: 'Pyrrho found calm by suspending judgement; Patanjali by stilling the mind\'s modifications. Diogenes Laërtius says Pyrrho met Indian ascetics, but no link to the Yoga tradition is documented.' },
  { from: 'patanjali_stilling_the_mind', to: 'kabat_zinn_mbsr', relation: 'secularized', year: 1979, note: 'MBSR includes gentle hatha yoga alongside sitting meditation; Kabat-Zinn, who practised yoga himself, kept the attention training and dropped Patanjali\'s metaphysics of Seer and psychic nature.' },
  { from: 'patanjali_stilling_the_mind', to: 'practice_care_for_the_body', relation: 'lands_on' },

  // Dogen
  { from: 'buddha_craving_root_of_suffering', to: 'dogen_just_sitting', relation: 'extended', year: 1233, note: 'Dōgen taught that zazen is the practice of the Buddha himself, who awakened sitting under the Bodhi tree; Sōtō Zen traces its lineage to the Buddha through Bodhidharma and Dōgen\'s Chinese teacher Rujing.' },
  { from: 'dogen_just_sitting', to: 'kabat_zinn_mbsr', relation: 'secularized', year: 1979, note: 'Kabat-Zinn trained in Zen (with Seung Sahn, among others) before founding MBSR; the course keeps the sitting and drops the Buddhist doctrine, as he states in "Some reflections on the origins of MBSR" (2011).' },
  { from: 'dogen_just_sitting', to: 'practice_care_for_the_body', relation: 'lands_on' },
];
