// Proof-of-concept line from Jack's concept doc ("Continuum: a daily journey through human wisdom"):
// 14 two-faced nodes, typed edges, practices as the floor of every walk.
// Every source_face must be checked against a print edition before testers see it. Status: content/SOURCES.md.

export const nodes = [
  {
    seq: 1,
    id: 'democritus_atoms_and_void',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Democritus',
    year: -420,
    title: 'Everything is atoms and void',
    prompt: 'If everything you love is made of tiny particles bumping in empty space, does that make it matter less, or not at all?',
    plain_face:
      'Zoom far enough into a photo on your phone and it turns into coloured squares. Democritus said the whole world is like that: sweet, bitter, warm and cold are how things look from our distance. Up close there is only tiny uncuttable bits ("atoms") and the empty space they move through.',
    source_face:
      'νόμῳ γλυκὺ καὶ νόμῳ πικρόν, νόμῳ θερμόν, νόμῳ ψυχρόν, νόμῳ χροιή· ἐτεῇ δὲ ἄτομα καὶ κενόν.\n\nBy convention sweet, by convention bitter, by convention hot, by convention cold, by convention colour; but in reality atoms and void.',
    source_citation: 'Democritus, fragment DK 68 B9, preserved in Sextus Empiricus, Against the Logicians I.135. English is a literal rendering of the Greek.',
    source_url: null,
  },
  {
    seq: 2,
    id: 'epicurus_absence_of_pain',
    type: 'thinker',
    field: 'philosophy',
    thinker: 'Epicurus',
    year: -300,
    title: 'Pleasure is the absence of pain; fearing death is the great error',
    prompt: 'When did you last feel real relief? Was something added to your life, or taken away?',
    plain_face:
      'Epicurus took Democritus\'s atoms and drew a calm conclusion. Think of the moment a headache stops: nothing was added, and it feels wonderful. That quiet, no pain in the body and no turmoil in the mind, is his whole goal. And death? While you are here it has not come; once it comes, you are not here to mind.',
    source_face:
      'When we say, then, that pleasure is the end and aim, we do not mean the pleasures of the prodigal or the pleasures of sensuality, as we are understood to do by some through ignorance, prejudice, or wilful misrepresentation. By pleasure we mean the absence of pain in the body and of trouble in the soul.\n\n… Death, therefore, the most awful of evils, is nothing to us, seeing that, when we are, death is not come, and, when death is come, we are not.',
    source_citation: 'Epicurus, Letter to Menoeceus, in Diogenes Laërtius, Lives of Eminent Philosophers X.131 and X.125 (trans. R. D. Hicks, Loeb, 1925)',
    source_url: 'https://en.wikisource.org/wiki/Lives_of_the_Eminent_Philosophers/Book_X',
  },
  {
    seq: 3,
    id: 'lucretius_death_nothing_to_us',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Lucretius',
    year: -55,
    title: '"Death is nothing to us"',
    prompt: 'You were not bothered by the billions of years before you were born. Why does the time after you feel different?',
    plain_face:
      'Lucretius, a Roman poet, turned Epicurus into verse. His best image: the endless time before you were born is a mirror. Hold it up and you see the time after your death. It looks exactly the same, and it never hurt you once.',
    source_face:
      'Therefore death to us\nIs nothing, nor concerns us in the least,\nSince nature of mind is mortal evermore. …\n\nLook back:\nNothing to us was all fore-passed eld\nOf time the eternal, ere we had a birth.\nAnd Nature holds this like a mirror up\nOf time-to-be when we are dead and gone.\nAnd what is there so horrible appears?\nNow what is there so sad about it all?\nIs\'t not serener far than any sleep?',
    source_citation: 'Lucretius, On the Nature of Things, Book III, "Of Death" (trans. William Ellery Leonard, 1916)',
    source_url: 'https://www.gutenberg.org/ebooks/785',
  },
  {
    seq: 4,
    id: 'zeno_live_according_to_nature',
    type: 'thinker',
    field: 'philosophy',
    thinker: 'Zeno of Citium',
    year: -300,
    title: 'Live according to nature; virtue is the only good',
    prompt: 'Is there anything you would refuse to do even if it guaranteed you a pleasant life? What does that tell you?',
    plain_face:
      'Zeno taught in Athens at the same time as Epicurus, from a painted porch (the "stoa", hence Stoics). He disagreed: pleasure is not the point. A knife is good if it cuts well; a person is good if they live as a person should, with reason and character. That, not comfort, is the only real good.',
    source_face:
      'This is why Zeno was the first (in his treatise On the Nature of Man) to designate as the end "life in agreement with nature" (or living agreeably to nature), which is the same as a virtuous life, virtue being the goal towards which nature guides us.',
    source_citation: 'Diogenes Laërtius, Lives of Eminent Philosophers VII.87 (trans. R. D. Hicks, Loeb, 1925)',
    source_url: 'https://en.wikisource.org/wiki/Lives_of_the_Eminent_Philosophers/Book_VII',
  },
  {
    seq: 5,
    id: 'epictetus_up_to_us',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Epictetus',
    year: 125,
    title: 'Some things are up to us, some are not',
    prompt: 'List what is worrying you this week. Which items are actually up to you?',
    plain_face:
      'An archer controls the aim, the draw and the release. Once the arrow leaves the bow, the wind is not up to the archer. Epictetus, who began life as a slave, built everything on this split: put your effort into the aim, and let the wind be the wind.',
    source_face:
      'There are things which are within our power, and there are things which are beyond our power. Within our power are opinion, aim, desire, aversion, and, in one word, whatever affairs are our own. Beyond our power are body, property, reputation, office, and, in one word, whatever are not properly our own affairs.',
    source_citation: 'Epictetus, Enchiridion 1 (trans. Thomas Wentworth Higginson, 1865)',
    source_url: 'https://www.gutenberg.org/ebooks/45109',
  },
  {
    seq: 6,
    id: 'seneca_evening_review',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Seneca',
    year: 45,
    title: 'The evening review',
    prompt: 'Run today back like a film. What would you do differently, and what are you glad you did?',
    plain_face:
      'A good coach watches the game tape the same night, while it is fresh, without yelling. Seneca did that with his own day: lights out, everything replayed, nothing hidden, and then sleep. He says the sleep that follows is the best there is.',
    source_face:
      'The spirit ought to be brought up for examination daily. It was the custom of Sextius when the day was over, and he had betaken himself to rest, to inquire of his spirit: "What bad habit of yours have you cured to-day? what vice have you checked? in what respect are you better?" … I make use of this privilege, and daily plead my cause before myself: when the lamp is taken out of my sight, and my wife, who knows my habit, has ceased to talk, I pass the whole day in review before myself, and repeat all that I have said and done: I conceal nothing from myself, and omit nothing.',
    source_citation: 'Seneca, Of Anger III.36 (trans. Aubrey Stewart, Bohn\'s Classical Library, 1900)',
    source_url: 'https://en.wikisource.org/wiki/Of_Anger/Book_III',
  },
  {
    seq: 7,
    id: 'buddha_craving_root_of_suffering',
    type: 'concept',
    field: 'religion',
    thinker: 'The Buddha',
    year: -450,
    title: 'Craving is the root of suffering',
    prompt: 'Name something you want badly right now. How does the wanting itself feel?',
    plain_face:
      'Scratching a mosquito bite feels good for a second and makes the itch worse. The Buddha said most of our suffering works like that: not the world itself, but the thirst for things to be other than they are. Ease the thirst and the itch fades.',
    source_face:
      'The thirst of a thoughtless man grows like a creeper; he runs from life to life, like a monkey seeking fruit in the forest.\n\nWhomsoever this fierce thirst overcomes, full of poison, in this world, his sufferings increase like the abounding Birana grass.\n\nHe who overcomes this fierce thirst, difficult to be conquered in this world, sufferings fall off from him, like water-drops from a lotus leaf.',
    source_citation: 'Dhammapada, ch. XXIV "Thirst", verses 334–336 (trans. F. Max Müller, Sacred Books of the East X, 1881)',
    source_url: 'https://www.gutenberg.org/ebooks/2017',
  },
  {
    seq: 8,
    id: 'marcus_pain_is_your_estimate',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Marcus Aurelius',
    year: 175,
    title: 'The pain is your estimate of the thing',
    prompt: 'Pick something that upset you recently. Write the event in one line, and your judgement of it in another.',
    plain_face:
      'An emperor, writing to himself on campaign: the thing that hurt you is like a parcel with a price tag. The parcel is out of your hands; the price you put on it is yours. Take the tag off, he says, and much of the hurt goes with it.',
    source_face:
      'If thou art pained by any external thing, it is not this thing that disturbs thee, but thy own judgment about it. And it is in thy power to wipe out this judgment now.',
    source_citation: 'Marcus Aurelius, Meditations VIII.47 (trans. George Long, 1862)',
    source_url: 'https://www.gutenberg.org/ebooks/15877',
  },
  {
    seq: 9,
    id: 'spinoza_freedom_understanding_necessity',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Baruch Spinoza',
    year: 1677,
    title: 'Freedom is understanding necessity',
    prompt: 'Think of something you resent. If you fully understood every cause that led to it, would you still resent it?',
    plain_face:
      'You are not angry at the rain for falling; you know why it falls. Spinoza says the more clearly you see why anything happens, the less it can push you around. Freedom is not doing whatever you like; it is seeing the causes so clearly that they stop surprising you.',
    source_face:
      'The mind has greater power over the emotions and is less subject thereto, in so far as it understands all things as necessary.',
    source_citation: 'Baruch Spinoza, Ethics, Part V, Proposition 6 (trans. R. H. M. Elwes, 1883)',
    source_url: 'https://www.gutenberg.org/ebooks/3800',
  },
  {
    seq: 10,
    id: 'schopenhauer_will_source_of_suffering',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Arthur Schopenhauer',
    year: 1818,
    title: 'The will is the source of suffering',
    prompt: 'Think of the last thing you got that you really wanted. How long did the satisfaction last?',
    plain_face:
      'A hamster wheel: every time you reach the next rung, another one appears. Schopenhauer says wanting is built into us, and wanting is a kind of lack. Get what you want and you are bored; want something and you suffer. Life swings between the two.',
    source_face:
      'All willing arises from want, therefore from deficiency, and therefore from suffering. The satisfaction of a wish ends it; yet for one wish that is satisfied there remain at least ten which are denied.',
    source_citation: 'Arthur Schopenhauer, The World as Will and Idea, Vol. I, Book III, §38 (trans. R. B. Haldane and J. Kemp, 1883)',
    source_url: 'https://www.gutenberg.org/ebooks/38427',
  },
  {
    seq: 11,
    id: 'nietzsche_amor_fati',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Friedrich Nietzsche',
    year: 1888,
    title: 'Amor fati: he who has a why can bear almost any how',
    prompt: 'What is one hard thing in your past you would not change, because of who it made you?',
    plain_face:
      'Schopenhauer saw the hamster wheel and wanted off. Nietzsche, who read him as a young man, turned the other way: love the wheel. A marathon hurts the same whether you run it for a reason or for nothing, but only one is worth it. Pain is not the enemy; pointless pain is.',
    source_face:
      'My formula for greatness in man is amor fati: the fact that a man wishes nothing to be different, either in front of him or behind him, or for all eternity. Not only must the necessary be borne, and on no account concealed—all idealism is falsehood in the face of necessity—but it must also be loved….\n\nHat man sein warum? des Lebens, so verträgt man sich fast mit jedem wie? (If one has one\'s own why of life, one can put up with almost any how.)',
    source_citation: 'Friedrich Nietzsche, Ecce Homo, "Why I Am So Clever" §10 (trans. A. M. Ludovici, 1911); Twilight of the Idols, "Maxims and Arrows" §12 (1888; English is a literal rendering)',
    source_url: 'https://www.gutenberg.org/ebooks/52190',
  },
  {
    seq: 12,
    id: 'beck_cognitive_therapy_stoicism_tested',
    type: 'thinker',
    field: 'science',
    thinker: 'Aaron Beck',
    year: 1979,
    title: 'Cognitive therapy is Stoicism, tested',
    prompt: 'What thought, not event, did the most damage to your mood this week? Is it actually true?',
    plain_face:
      'A psychiatrist in 1960s Philadelphia noticed his depressed patients ran on automatic thoughts ("I always fail") that were often simply false. Catch the thought, check it, and the mood shifts. He said himself the idea was two thousand years old. What was new was testing it in clinical trials, where it held up.',
    source_face:
      'Short quotation (work under copyright): "The philosophical origins of cognitive therapy can be traced back to the Stoic philosophers, particularly Zeno of Citium (fourth century B.C.), Chrysippus, Cicero, Seneca, Epictetus, and Marcus Aurelius."',
    source_citation: 'Aaron T. Beck, A. John Rush, Brian F. Shaw & Gary Emery, Cognitive Therapy of Depression (New York: Guilford Press, 1979), p. 8',
    source_url: null,
  },
  {
    seq: 13,
    id: 'frankl_mans_search_for_meaning',
    type: 'text',
    field: 'science',
    thinker: 'Viktor Frankl',
    year: 1946,
    title: 'Man\'s Search for Meaning',
    prompt: 'What are you doing, or could you do, that will still matter after you are gone?',
    plain_face:
      'Frankl, a psychiatrist, survived Auschwitz and wrote this book in nine days afterwards. He noticed that the prisoners who held on longest often had something waiting for them: a person, a task, a book to finish. He quotes Nietzsche: whoever has a why can bear almost any how. Meaning is found in work, in love, and in the attitude we take to suffering we cannot avoid.',
    source_face:
      'Short quotation (work under copyright; read the full book in a library or bookshop): "Everything can be taken from a man but one thing: the last of the human freedoms—to choose one\'s attitude in any given set of circumstances, to choose one\'s own way."',
    source_citation: 'Viktor E. Frankl, Man\'s Search for Meaning (orig. 1946; English ed. Beacon Press, 1959)',
    source_url: 'https://openlibrary.org/search?q=man%27s+search+for+meaning+frankl',
  },
  {
    seq: 14,
    id: 'nozick_experience_machine',
    type: 'dilemma',
    field: 'philosophy',
    thinker: 'Robert Nozick',
    year: 1974,
    title: 'The experience machine',
    prompt: 'Would you plug in for life, knowing every experience would feel completely real? Why or why not?',
    plain_face:
      'Imagine a machine that feeds you a perfect life: the career, the love, the adventures, all completely convincing, while you float in a tank. If pleasure were all that mattered, as Epicurus thought, everyone should plug in. Most people refuse. Nozick asks: then what else do we want?',
    source_face:
      'Short quotation (work under copyright): "Suppose there were an experience machine that would give you any experience you desired." Nozick argues that we would not plug in because we want to actually do things, to actually be a certain kind of person, and to be in contact with reality, not merely to have the experience of these.',
    source_citation: 'Robert Nozick, Anarchy, State, and Utopia (New York: Basic Books, 1974), pp. 42–45. Second sentence is a summary, not a quotation.',
    source_url: null,
  },

  // Practices: the floor of every walk. One face only (no source), never a daily card in the MVP.
  {
    id: 'practice_examine_daily',
    type: 'practice',
    field: 'practice',
    title: 'Examine yourself daily',
    plain_face: 'Tuesday\'s practice. Before sleep, replay the day honestly: what went well, what you would change, what you will try tomorrow. Two minutes, no judgment, every day.',
  },
  {
    id: 'practice_control_your_response',
    type: 'practice',
    field: 'practice',
    title: 'Control your response',
    plain_face: 'Wednesday\'s practice. When something upsets you, split it in two: the event, and your judgment of it. Work only on the second.',
  },
  {
    id: 'practice_work_that_outlasts_you',
    type: 'practice',
    field: 'practice',
    title: 'Work at something that outlasts you',
    plain_face: 'Friday\'s practice. Spend some part of today on something that will still matter when you are gone: a person, a craft, a cause.',
  },
  {
    id: 'practice_keep_death_in_view',
    type: 'practice',
    field: 'practice',
    title: 'Keep death in view',
    plain_face: 'Sunday\'s practice. Remember, calmly, that this ends. Let that sort what matters today from what does not.',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
// converged is symmetric (no contact); lands_on points from any node to a practice.
export const edges = [
  { from: 'democritus_atoms_and_void', to: 'epicurus_absence_of_pain', relation: 'extended', year: -306, note: 'Epicurus adopted Democritus\'s atoms and built an ethics of calm on them.' },
  { from: 'epicurus_absence_of_pain', to: 'lucretius_death_nothing_to_us', relation: 'extended', year: -55, note: 'Lucretius set Epicurus\'s teaching to Latin verse, two centuries later.' },
  { from: 'epicurus_absence_of_pain', to: 'zeno_live_according_to_nature', relation: 'refuted', year: -300, note: 'Rival schools in the same city: the Stoics held that virtue, not pleasure, is the only good.' },
  { from: 'epicurus_absence_of_pain', to: 'buddha_craving_root_of_suffering', relation: 'converged', note: 'Both trace suffering to unnecessary desire, with no known contact.' },
  { from: 'zeno_live_according_to_nature', to: 'epictetus_up_to_us', relation: 'extended', note: 'Epictetus taught Zeno\'s school four centuries on.' },
  { from: 'zeno_live_according_to_nature', to: 'seneca_evening_review', relation: 'extended', note: 'Seneca writes as a Stoic, citing the school\'s founders often.' },
  { from: 'seneca_evening_review', to: 'marcus_pain_is_your_estimate', relation: 'extended', note: 'Same school and same habit of daily self-address; Marcus never names Seneca.' },
  { from: 'epictetus_up_to_us', to: 'marcus_pain_is_your_estimate', relation: 'extended', note: 'Marcus thanks Rusticus for lending him Epictetus\'s discourses (Meditations I.7).' },
  { from: 'buddha_craving_root_of_suffering', to: 'epictetus_up_to_us', relation: 'converged', note: 'Both teach releasing what is not yours to hold, with no known contact.' },
  { from: 'epictetus_up_to_us', to: 'beck_cognitive_therapy_stoicism_tested', relation: 'measured', year: 1979, note: 'Beck quotes Epictetus as the root of cognitive therapy, then tests it in trials.' },
  { from: 'marcus_pain_is_your_estimate', to: 'beck_cognitive_therapy_stoicism_tested', relation: 'measured', year: 1979, note: 'Beck names Marcus Aurelius among the origins of cognitive therapy.' },
  { from: 'spinoza_freedom_understanding_necessity', to: 'schopenhauer_will_source_of_suffering', relation: 'extended', year: 1818, note: 'Schopenhauer shares Spinoza\'s strict necessity: a man can do what he wills, but cannot will what he wills.' },
  { from: 'schopenhauer_will_source_of_suffering', to: 'nietzsche_amor_fati', relation: 'refuted', year: 1888, note: 'Nietzsche started as Schopenhauer\'s disciple and ended by rejecting his denial of the will.' },
  { from: 'nietzsche_amor_fati', to: 'frankl_mans_search_for_meaning', relation: 'extended', year: 1946, note: 'Frankl quotes the "why ... how" maxim repeatedly.' },
  { from: 'epicurus_absence_of_pain', to: 'nozick_experience_machine', relation: 'refuted', year: 1974, note: 'If pleasure were the only good, we would plug in. Most of us would not.' },
  { from: 'lucretius_death_nothing_to_us', to: 'practice_keep_death_in_view', relation: 'lands_on' },
  { from: 'seneca_evening_review', to: 'practice_examine_daily', relation: 'lands_on' },
  { from: 'beck_cognitive_therapy_stoicism_tested', to: 'practice_control_your_response', relation: 'lands_on' },
  { from: 'frankl_mans_search_for_meaning', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },
  { from: 'nozick_experience_machine', to: 'practice_keep_death_in_view', relation: 'lands_on' },
  { from: 'epictetus_up_to_us', to: 'practice_control_your_response', relation: 'lands_on' },
];
