// Branch: the ancient and late-antique roots the line skips over, Heraclitus to Boethius.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Every passage below was verified word for word against the Project Gutenberg or Wikisource text cited.

export const nodes = [
  {
    id: 'heraclitus_same_river',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Heraclitus',
    year: -500,
    title: '"You cannot step twice into the same river"',
    prompt: 'What in your life do you treat as fixed that is actually a process, quietly changing while you are not looking?',
    plain_face:
      'The name on a river stays the same for centuries, but not one drop of the water does. Heraclitus, a lonely thinker from Ephesus, said everything is like that: the fire, the river, your body, your opinions. What looks solid is only a slow current. He thought most people slept through this, treating the moving world as if it stood still.',
    source_face:
      '(41, 42) You cannot step twice into the same rivers; for fresh waters are ever flowing in upon you.\n\n(81) We step and do not step into the same rivers; we are and are not.\n\n“Herakleitos says somewhere that all things pass and naught abides; and, comparing things to the current of a river, he says that you cannot step twice into the same stream.”',
    source_citation: 'Heraclitus, fragments 41–42 and 81 (Bywater numbering), in John Burnet, Early Greek Philosophy, 2nd ed. (London: A. & C. Black, 1908), ch. III; the Plato passage is Burnet\'s own translation of Cratylus 402a',
    source_url: 'https://www.gutenberg.org/ebooks/67097',
  },
  {
    id: 'plato_ring_of_gyges',
    type: 'dilemma',
    field: 'philosophy',
    thinker: 'Plato',
    year: -380,
    title: 'The ring of Gyges: would you be good if no one could see?',
    prompt: 'What would you do this week if you were certain no one would ever find out?',
    plain_face:
      'A shepherd finds a ring that makes him invisible, and within a chapter he has seduced the queen and killed the king. Plato\'s brother Glaucon tells the story as a challenge to Socrates: strip away being watched and nobody stays honest, so justice is just the fear of being caught. The rest of the Republic is Socrates trying to answer him. It is the same question as an unlocked cash drawer in an empty shop.',
    source_face:
      'Suppose now that there were two such magic rings, and the just put on one of them and the unjust the other; no man can be imagined to be of such an iron nature that he would stand fast in justice. No man would keep his hands off what was not his own when he could safely take what he liked out of the market, or go into houses and lie with any one at his pleasure, or kill or release from prison whom he would, and in all respects be like a God among men. Then the actions of the just would be as the actions of the unjust; they would both come at last to the same point. And this we may truly affirm to be a great proof that a man is just, not willingly or because he thinks that justice is any good to him individually, but of necessity, for wherever any one thinks that he can safely be unjust, there he is unjust.',
    source_citation: 'Plato, Republic, Book II, 359d–360d, Glaucon speaking (trans. Benjamin Jowett, 1871)',
    source_url: 'https://www.gutenberg.org/ebooks/1497',
  },
  {
    id: 'pyrrho_suspend_judgment',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Pyrrho of Elis',
    year: -330,
    title: 'Suspend judgment, and calm follows like a shadow',
    prompt: 'Which opinion are you holding most tightly right now? What would it feel like to set it down for a day?',
    plain_face:
      'Pyrrho travelled to India with Alexander\'s army, came home, and stopped deciding. Not knowing, he found, was restful. Think of letting go of a tug-of-war rope: the pull you were fighting simply disappears. His followers said that if you suspend judgment on what things really are, peace of mind arrives on its own, the way a shadow follows a body.',
    source_face:
      'This led him to adopt a most noble philosophy, to quote Ascanius of Abdera, taking the form of agnosticism and suspension of judgement. He denied that anything was honourable or dishonourable, just or unjust. And so, universally, he held that there is nothing really existent, but custom and convention govern human action; for no single thing is in itself any more this than that.\n\n… The end to be realized they hold to be suspension of judgement, which brings with it tranquillity like its shadow: so Timon and Aenesidemus declare.',
    source_citation: 'Diogenes Laërtius, Lives of Eminent Philosophers IX.61 and IX.107 (trans. R. D. Hicks, Loeb, 1925)',
    source_url: 'https://en.wikisource.org/wiki/Lives_of_the_Eminent_Philosophers/Book_IX',
  },
  {
    id: 'job_why_the_righteous_suffer',
    type: 'text',
    field: 'religion',
    thinker: 'Book of Job',
    year: -500,
    title: 'Job: why do the righteous suffer?',
    prompt: 'When something unfair happened to you, did you need a reason for it, or did you need something else?',
    plain_face:
      'Job is a good man who loses his children, his wealth and his health in a single afternoon. His friends insist he must have deserved it; he insists he did not. When God finally answers, it is not with a reason but with a question: where were you when I built all this? Like a child asking why the sea is salt, Job gets no explanation, only the size of the thing he is asking about. He stops asking, and that, somehow, is the consolation.',
    source_face:
      'And said, Naked came I out of my mother\'s womb, and naked shall I return thither: the LORD gave, and the LORD hath taken away; blessed be the name of the LORD.\n\n… Where wast thou when I laid the foundations of the earth? declare, if thou hast understanding.',
    source_citation: 'Book of Job 1:21 and 38:4, King James Version (1611)',
    source_url: 'https://www.gutenberg.org/ebooks/10',
  },
  {
    id: 'augustine_restless_heart',
    type: 'quote',
    field: 'religion',
    thinker: 'Augustine of Hippo',
    year: 397,
    title: '"Our heart is restless, until it repose in Thee"',
    prompt: 'What have you been chasing lately that did not settle you once you had it? What would?',
    plain_face:
      'Augustine spent his twenties chasing careers, lovers and clever ideas, and wrote the first great autobiography to work out why none of it stuck. His diagnosis: the heart is like a compass needle, spinning and twitching until it finds north. For him north was God. His famous prayer from those years, "give me chastity, only not yet", is the honest sound of a needle that has not settled.',
    source_face:
      'Thou awakest us to delight in Thy praise; for Thou madest us for Thyself, and our heart is restless, until it repose in Thee.\n\n… But I wretched, most wretched, in the very commencement of my early youth, had begged chastity of Thee, and said, "Give me chastity and continency, only not yet." For I feared lest Thou shouldest hear me soon, and soon cure me of the disease of concupiscence, which I wished to have satisfied, rather than extinguished.',
    source_citation: 'Augustine, Confessions I.1 and VIII.7 (trans. E. B. Pusey, 1838)',
    source_url: 'https://www.gutenberg.org/ebooks/3296',
  },
  {
    id: 'boethius_wheel_of_fortune',
    type: 'text',
    field: 'philosophy',
    thinker: 'Boethius',
    year: 524,
    title: 'The wheel of Fortune: nothing is wretched but thinking makes it so',
    prompt: 'Think of what you most fear losing. Was it ever really yours, or was it on loan?',
    plain_face:
      'Boethius was the most powerful civilian in Italy, then, on a false charge, a prisoner waiting to be executed. In his cell he imagined Lady Philosophy visiting him, and Fortune herself explaining the rules: she runs a wheel, and anyone who climbs on agrees to come down. Wealth, honour and health were lent, never owned, like a hotel room you never get to keep. What is still yours is how you take the fall.',
    source_face:
      'This is my art, this the game I never cease to play. I turn the wheel that spins. I delight to see the high come down and the low ascend. Mount up, if thou wilt, but only on condition that thou wilt not think it a hardship to come down when the rules of my game require it.\n\n… So true is it that nothing is wretched, but thinking makes it so, and conversely every lot is happy if borne with equanimity.',
    source_citation: 'Boethius, The Consolation of Philosophy, Book II, Prose II (Fortune speaking) and Prose IV (trans. H. R. James, London: Elliot Stock, 1897)',
    source_url: 'https://www.gutenberg.org/ebooks/14328',
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Heraclitus
  { from: 'heraclitus_same_river', to: 'buddha_craving_root_of_suffering', relation: 'converged', note: 'Both make impermanence the first fact about the world, a generation apart and with no known contact.' },
  { from: 'heraclitus_same_river', to: 'nietzsche_amor_fati', relation: 'extended', year: 1888, note: 'Nietzsche excepts Heraclitus "with a feeling of great reverence" (Twilight of the Idols, "Reason in Philosophy" 2) and in Ecce Homo says he felt warmer in his presence than anywhere else.' },
  { from: 'heraclitus_same_river', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Plato
  { from: 'socrates_unexamined_life', to: 'plato_ring_of_gyges', relation: 'taught', year: -399, note: 'Socrates taught Plato, who wrote nothing in his own voice: the answer to Glaucon in the Republic is put in Socrates\' mouth.' },
  { from: 'plato_ring_of_gyges', to: 'epicurus_absence_of_pain', relation: 'extended', year: -300, note: 'Epicurus, who studied under the Platonist Pamphilus (D.L. X.14), took Glaucon\'s side: Principal Doctrines 34–35 say injustice is bad only for the fear of being found out.' },
  { from: 'plato_ring_of_gyges', to: 'practice_examine_daily', relation: 'lands_on' },

  // Pyrrho
  { from: 'pyrrho_suspend_judgment', to: 'buddha_craving_root_of_suffering', relation: 'converged', note: 'Both find peace by releasing the grip of opinion; Diogenes Laërtius says Pyrrho met Indian ascetics, but no doctrinal link is documented.' },
  { from: 'pyrrho_suspend_judgment', to: 'epicurus_absence_of_pain', relation: 'extended', year: -300, note: 'Nausiphanes said Epicurus "greatly admiring Pyrrho\'s way of life, regularly asked him for information about Pyrrho" (D.L. IX.64).' },
  { from: 'pyrrho_suspend_judgment', to: 'montaigne_to_philosophize_is_to_learn_to_die', relation: 'extended', year: 1580, note: 'Montaigne\'s "Apology for Raymond Sebond" defends Pyrrho against the tale of him "standing the jostle of carts, going upon the edge of precipices", and calls the Pyrrhonians\' profession "to waver, doubt, and inquire".' },
  { from: 'pyrrho_suspend_judgment', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Job
  { from: 'job_why_the_righteous_suffer', to: 'buddha_craving_root_of_suffering', relation: 'converged', note: 'Both begin from suffering that has no visible why, in traditions with no contact.' },
  { from: 'job_why_the_righteous_suffer', to: 'epictetus_up_to_us', relation: 'converged', note: '"The LORD gave, and the LORD hath taken away" and "whatever are not properly our own affairs" draw the same line, with no known contact.' },
  { from: 'job_why_the_righteous_suffer', to: 'boethius_wheel_of_fortune', relation: 'converged', note: 'Boethius, a Christian who knew the scriptures, never quotes Job, but asks Job\'s question from his own prison cell: why the good man suffers while the wicked prosper (Consolation I.4).' },
  { from: 'job_why_the_righteous_suffer', to: 'practice_control_your_response', relation: 'lands_on' },

  // Augustine
  { from: 'augustine_restless_heart', to: 'schopenhauer_will_source_of_suffering', relation: 'extended', year: 1818, note: 'Schopenhauer quotes Augustine\'s City of God at length in The World as Will and Idea (Book II, §24) as having recognised "with a true instinct" that all things will as we do.' },
  { from: 'augustine_restless_heart', to: 'buddha_craving_root_of_suffering', relation: 'converged', note: 'Both diagnose a restless wanting at the root of unhappiness; the cures differ and there was no contact.' },
  { from: 'augustine_restless_heart', to: 'pascal_sit_quietly_in_a_room', relation: 'extended', year: 1670, note: 'Pascal, a Jansenist whose party took its name from a book called Augustinus, cites "Saint Augustine" repeatedly in the Pensées (e.g. 234, 270).' },
  { from: 'augustine_restless_heart', to: 'boethius_wheel_of_fortune', relation: 'extended', year: 524, note: 'Boethius says in the preface to his De Trinitate that his argument grows from seeds sown in Augustine\'s writings.' },
  { from: 'augustine_restless_heart', to: 'practice_examine_daily', relation: 'lands_on' },

  // Boethius
  { from: 'seneca_evening_review', to: 'boethius_wheel_of_fortune', relation: 'extended', year: 524, note: 'Boethius names Seneca twice in the Consolation (I.3, III.5) as a philosopher destroyed for living by his principles; Fortune\'s speech reworks Seneca\'s own consolations.' },
  { from: 'epictetus_up_to_us', to: 'boethius_wheel_of_fortune', relation: 'converged', note: 'Fortune\'s "thou hast no right to complain, as if thou hadst lost what was wholly thine" is Epictetus\'s split between ours and not ours; the Consolation never names him.' },
  { from: 'boethius_wheel_of_fortune', to: 'practice_control_your_response', relation: 'lands_on' },
];
