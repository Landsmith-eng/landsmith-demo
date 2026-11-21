// Branch: modern thought, part five: the body and the person (Pavlov, Rogers, Merleau-Ponty), the value of asking
// (Russell, Peirce), and two late-twentieth-century accounts of what institutions make of people (Nussbaum, Foucault).
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Public-domain passages (Russell, Peirce) verified word for word against the Project Gutenberg texts cited;
// in-copyright works, and Pavlov's 1927 book (public domain in the US but no full text was reachable), are labelled summaries.

export const nodes = [
  {
    id: 'pavlov_conditioned_reflex',
    type: 'concept',
    field: 'science',
    thinker: 'Ivan Pavlov',
    year: 1927,
    title: 'The conditioned reflex: the body learns before you do',
    prompt: 'What is one thing your body does automatically (a reach for the phone, a tightening in the chest) when a certain sound, place or person appears? When did it learn that?',
    plain_face:
      'Pavlov was studying digestion in dogs when he noticed they began to drool at the footsteps of the person who fed them, before any food appeared. He spent the next thirty years on that. Pair a bell with dinner often enough and the bell alone makes the mouth water: the nervous system has quietly wired one thing to another, with no decision anywhere. It is like a shortcut your phone learns from your typing. The body learns by association, and it is doing so all the time, whether or not you meant to teach it anything.',
    source_face:
      'Summary (no full text could be fetched to verify a quotation; the English edition of 1927 is public domain in the US): In Conditioned Reflexes Pavlov reports the experiments of his St Petersburg laboratory, in which the flow of saliva in dogs was measured through a surgically made opening. An inborn ("unconditioned") reflex, such as salivating at food in the mouth, can be attached to any neutral signal, a metronome, a light, a touch on the skin, by presenting the signal just before the food on repeated occasions, after which the signal alone produces the flow. He calls the new link a conditioned reflex, shows that it fades if the signal is repeated without food ("extinction"), that it transfers to similar signals ("generalisation") and can be narrowed by training ("differentiation"), and that it can be overridden by inhibition. He argues throughout that this is physiology, the ordinary work of the cerebral cortex, and that it is the proper way to study what others call the mind.',
    source_citation: 'I. P. Pavlov, Conditioned Reflexes: An Investigation of the Physiological Activity of the Cerebral Cortex, trans. and ed. G. V. Anrep (London: Oxford University Press, 1927), esp. Lectures I–III and VI. The first public account of the discovery was Pavlov\'s Nobel lecture of 12 December 1904, "Physiology of Digestion". Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'rogers_unconditional_positive_regard',
    type: 'concept',
    field: 'science',
    thinker: 'Carl Rogers',
    year: 1951,
    title: 'Unconditional positive regard: people grow when they are not on trial',
    prompt: 'Who in your life accepts you without first checking whether you have earned it? What are you able to say or try around that person that you cannot elsewhere?',
    plain_face:
      'Rogers, a therapist, noticed that his clients changed most when he stopped diagnosing and advising and simply received them: listening closely, understanding from the inside, and prizing them whatever they said. Think of a plant that was potted in the dark and leans hard toward the one window; given open light it straightens on its own. He believed every person carries that lean, an actualising tendency toward growth, and that what blocks it is the sense of being valued only on conditions. Remove the conditions and the person does the rest.',
    source_face:
      'Summary (work under copyright): In Client-Centered Therapy (1951) Rogers sets out a single motive in the organism, the tendency to actualise, maintain and enhance itself, and traces much distress to "conditions of worth", standards taken over from others under which a person feels valued only when meeting them. In the 1957 paper "The Necessary and Sufficient Conditions of Therapeutic Personality Change" and in On Becoming a Person (1961) he names three attitudes in the helper that release growth: congruence (being genuinely oneself), empathic understanding, and unconditional positive regard, a warm acceptance of each aspect of the client\'s experience without judgement. He reports that when these are present the client moves toward openness to experience, trust in the self and living as a process rather than a fixed product, and he holds that the same conditions govern good relations between parents and children, teachers and students, and friends.',
    source_citation: 'Carl R. Rogers, Client-Centered Therapy (Boston: Houghton Mifflin, 1951), ch. 11; "The Necessary and Sufficient Conditions of Therapeutic Personality Change", Journal of Consulting Psychology 21:2 (1957), 95–103; On Becoming a Person (Boston: Houghton Mifflin, 1961), chs. 2, 3 and 9. Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'russell_value_of_philosophy',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Bertrand Russell',
    year: 1912,
    title: 'Philosophy is studied for the sake of the questions themselves',
    prompt: 'Which question have you lived with longest without an answer? Has carrying it changed you, even unanswered?',
    plain_face:
      'Russell admits at the end of his little book that philosophy has not settled much. Then why bother? Because of what a good question does to you. A child who has only ever lived in one valley thinks the valley is the world; climb the ridge and you may not find a better place to live, but you can never again mistake the valley for everything. Philosophy, he says, is the ridge: it loosens the grip of the certainties you absorbed without choosing them, and leaves you with a wider sense of what might be true.',
    source_face:
      'The man who has no tincture of philosophy goes through life imprisoned in the prejudices derived from common sense, from the habitual beliefs of his age or his nation, and from convictions which have grown up in his mind without the co-operation or consent of his deliberate reason. To such a man the world tends to become definite, finite, obvious; common objects rouse no questions, and unfamiliar possibilities are contemptuously rejected. …\n\nThus, while diminishing our feeling of certainty as to what things are, it greatly increases our knowledge as to what they may be; it removes the somewhat arrogant dogmatism of those who have never travelled into the region of liberating doubt, and it keeps alive our sense of wonder by showing familiar things in an unfamiliar aspect.\n\n… Philosophy is to be studied, not for the sake of any definite answers to its questions, since no definite answers can, as a rule, be known to be true, but rather for the sake of the questions themselves; because these questions enlarge our conception of what is possible, enrich our intellectual imagination and diminish the dogmatic assurance which closes the mind against speculation; but above all because, through the greatness of the universe which philosophy contemplates, the mind also is rendered great, and becomes capable of that union with the universe which constitutes its highest good.',
    source_citation: 'Bertrand Russell, The Problems of Philosophy (London: Williams & Norgate, Home University Library, 1912), ch. XV, "The Value of Philosophy"',
    source_url: 'https://www.gutenberg.org/ebooks/5827',
  },
  {
    id: 'peirce_how_to_make_our_ideas_clear',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Charles Sanders Peirce',
    year: 1878,
    title: 'The pragmatic maxim: an idea means what it would do',
    prompt: 'Pick a belief you hold strongly. What would you do differently if it were false? If the answer is "nothing", what is the belief for?',
    plain_face:
      'Peirce, a working scientist and logician, offered a test for whether two people really disagree or are only using different words. Ask what difference the idea would make in practice, what you would expect to see, feel or be able to do. Two recipes that produce the same cake are the same recipe, however differently they are written. A belief, he says, is a habit of action; its whole meaning lies in the effects we expect from it. William James read this and called it pragmatism, and a whole American philosophy grew from the article.',
    source_face:
      'Our idea of anything is our idea of its sensible effects; and if we fancy that we have any other we deceive ourselves, and mistake a mere sensation accompanying the thought for a part of the thought itself. It is absurd to say that thought has any meaning unrelated to its only function. … It appears, then, that the rule for attaining the third grade of clearness of apprehension is as follows: Consider what effects, which might conceivably have practical bearings, we conceive the object of our conception to have. Then, our conception of these effects is the whole of our conception of the object.\n\n… The essence of belief is the establishment of a habit, and different beliefs are distinguished by the different modes of action to which they give rise. If beliefs do not differ in this respect, if they appease the same doubt by producing the same rule of action, then no mere differences in the manner of consciousness of them can make them different beliefs, any more than playing a tune in different keys is playing different tunes.',
    source_citation: 'Charles S. Peirce, "How to Make Our Ideas Clear", Popular Science Monthly 12 (January 1878), §§ II and III, as reprinted in Chance, Love, and Logic: Philosophical Essays, ed. Morris R. Cohen (New York: Harcourt, Brace, 1923). Peirce\'s italics are not reproduced.',
    source_url: 'https://www.gutenberg.org/ebooks/65274',
  },
  {
    id: 'merleau_ponty_body_subject',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Maurice Merleau-Ponty',
    year: 1945,
    title: 'The body-subject: you do not have a body, you are one',
    prompt: 'Think of a skill you have, such as typing, driving, a sport or an instrument. Where does the knowing live: in your head, or in your hands?',
    plain_face:
      'Descartes left us a picture of a mind steering a body like a pilot in a ship. Merleau-Ponty asked where that picture goes when you catch a ball. You do not calculate; your hand is already there. A blind person\'s cane stops being an object and becomes a place they feel from, the way your fingertips are. Perception, he says, is something the whole body does, before thought and beneath it, and the world shows up for us as a field of things we can reach, climb, grasp or avoid. We are not minds that happen to own bodies; we are our bodies, looking out.',
    source_face:
      'Summary (work under copyright): In Phénoménologie de la perception (1945) Merleau-Ponty argues, against both the empiricist account of perception as a sum of sensations and the intellectualist account of it as judgement, that perception is the work of a living body already at grips with the world. He draws on neurological cases, above all the patient Schneider, who could scratch a mosquito bite but not point to the spot on command, to distinguish bodily "motor intentionality" from reflective thought. The body is not an object among objects but the standpoint from which there are objects at all; it has a "body schema", takes up tools such as the blind man\'s stick into itself, and acquires habits as a new way of inhabiting the world rather than as stored knowledge. The book closes with his claim that the I is a body-subject, and that even thought and speech are gestures of this body.',
    source_citation: 'Maurice Merleau-Ponty, Phénoménologie de la perception (Paris: Gallimard, 1945), Part One, chs. 1 ("The Body as Object and Mechanistic Physiology") and 3 ("The Spatiality of One\'s Own Body and Motility"); English as Phenomenology of Perception, trans. Colin Smith (London: Routledge, 1962) and trans. Donald A. Landes (London: Routledge, 2012). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'nussbaum_capabilities',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Martha Nussbaum',
    year: 2000,
    title: 'The capabilities approach: what is each person actually able to do and be?',
    prompt: 'Name something you are formally free to do but could not actually do tomorrow. What stands in the way: money, health, time, fear, someone else?',
    plain_face:
      'Two countries can have the same income per head while in one of them girls cannot read and in the other they can. Nussbaum, building on the economist Amartya Sen, says the measure of a society is not what it has but what its people are actually able to do and be: live a full life, keep bodily health and safety, think and imagine, love, play, take part in politics, hold property. A seed in a sealed jar is still a seed, but it cannot grow. Each of these capabilities, she argues, must be brought above a threshold for every single person, because each person is an end and not a means to the national average.',
    source_face:
      'Summary (work under copyright): In Women and Human Development (2000) Nussbaum sets out the capabilities approach she had developed with Amartya Sen since the 1980s, now as a theory of basic political entitlements. Taking Aristotle\'s question of what a human being is able to do and be, and Marx\'s demand for truly human functioning, she lists ten central capabilities (life; bodily health; bodily integrity; senses, imagination and thought; emotions; practical reason; affiliation; other species; play; control over one\'s environment) and argues that a decent political order must secure each to every citizen at least to a threshold level, treating each person as an end. In Frontiers of Justice (2006) she argues that the social contract tradition, including Rawls, cannot do justice to people with severe disabilities, to those outside one\'s nation, or to animals, because it imagines the parties as roughly equal and mutually advantaged contractors, and offers the capabilities list as what justice requires instead. Creating Capabilities (2011) is her short restatement.',
    source_citation: 'Martha C. Nussbaum, Women and Human Development: The Capabilities Approach (Cambridge: Cambridge University Press, 2000), ch. 1; Frontiers of Justice: Disability, Nationality, Species Membership (Cambridge, MA: Harvard University Press, 2006); Creating Capabilities: The Human Development Approach (Cambridge, MA: Harvard University Press, 2011). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'foucault_discipline',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Michel Foucault',
    year: 1975,
    title: 'Discipline: power that watches, trains and makes the person it governs',
    prompt: 'Where in your day do you behave as if you were being watched, even when you are not sure you are? Who installed the watcher?',
    plain_face:
      'Jeremy Bentham designed a prison, the Panopticon, where a single guard in a central tower could see every cell, while no prisoner could tell whether the guard was looking. Foucault made it the picture of modern power. You do not need chains if people watch themselves. Timetables, ranks, exams, case files, the drill in the army and the row of desks in the school all work the same way: they do not crush the person, they produce one, trained, graded and known. The categories we sort ourselves into (the delinquent, the normal, the abnormal) were built, and have a history, like the buildings.',
    source_face:
      'Summary (work under copyright): Surveiller et punir (1975) opens with the public torture and execution of Damiens in 1757 and a prison timetable from eighty years later, and asks how punishment moved from the body to the soul. Foucault argues that the change was not simply humanitarian: a new kind of power, discipline, spread through armies, schools, hospitals, workshops and prisons. It works by distributing bodies in space, controlling activity by timetable, grading through the examination, and keeping written records, so that each individual becomes a "case". Bentham\'s Panopticon is its diagram: visibility is a trap, and the person who knows they may be watched takes over the work of guarding themselves. Power and knowledge, he says, imply one another; the human sciences grew in these institutions. The prison "fails" at reform and succeeds at producing the delinquent as a type, and the carceral network reaches far beyond its walls.',
    source_citation: 'Michel Foucault, Surveiller et punir: Naissance de la prison (Paris: Gallimard, 1975), Part Three ("Discipline"), esp. ch. 3 "Panopticism"; English as Discipline and Punish: The Birth of the Prison, trans. Alan Sheridan (New York: Pantheon, 1977). Summary, not a quotation.',
    source_url: null,
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Pavlov
  { from: 'pavlov_conditioned_reflex', to: 'skinner_beyond_freedom', relation: 'extended', year: 1938, note: 'Skinner took Pavlov\'s conditioned reflex as the model of "respondent" behaviour and set his own "operant" conditioning (behaviour shaped by consequences) beside it in The Behavior of Organisms (1938).' },
  { from: 'william_james_habit', to: 'pavlov_conditioned_reflex', relation: 'converged', note: 'Both describe learned behaviour as a pathway worn into the nervous system; Pavlov built on Sechenov\'s reflex physiology, not on James, and reached the same picture from the laboratory rather than the armchair.' },
  { from: 'pavlov_conditioned_reflex', to: 'practice_care_for_the_body', relation: 'lands_on' },
  // Rogers
  { from: 'rogers_unconditional_positive_regard', to: 'hooks_all_about_love', relation: 'converged', note: 'Both make love a practice of care and acceptance rather than a feeling, and both hold that people grow under it; hooks\'s book builds on Fromm and M. Scott Peck, and no citation of Rogers by hooks is known.' },
  { from: 'mencius_child_at_the_well', to: 'rogers_unconditional_positive_regard', relation: 'converged', note: 'Mencius\'s sprout of goodness that grows if watered and Rogers\'s actualising tendency that unfolds when conditions of worth are removed are the same picture, twenty-two centuries apart and with no contact.' },
  { from: 'rogers_unconditional_positive_regard', to: 'practice_invest_in_people', relation: 'lands_on' },
  // Russell
  { from: 'socrates_unexamined_life', to: 'russell_value_of_philosophy', relation: 'extended', note: 'Russell\'s chapter makes the questioning itself, not any answer, the value of philosophy, the Socratic position; he knew Plato\'s Apology well but names Socrates in this book only as the stock example in a syllogism.' },
  { from: 'hume_bundle_of_perceptions', to: 'russell_value_of_philosophy', relation: 'extended', note: 'Problems ch. VII credits Hume with showing, "correctly, as would now be generally admitted", that an effect cannot be deduced from its cause, and ch. VI restates Hume\'s problem of induction as the book\'s central unsolved question.' },
  { from: 'russell_value_of_philosophy', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
  // Peirce
  { from: 'peirce_how_to_make_our_ideas_clear', to: 'william_james_habit', relation: 'extended', year: 1898, note: 'James\'s Pragmatism (1907) says the pragmatic principle "was first introduced into philosophy by Mr. Charles Peirce in 1878" in this very article; James had announced it under Peirce\'s name in his 1898 Berkeley lecture "Philosophical Conceptions and Practical Results".' },
  { from: 'wang_yangming_unity_of_knowing_and_acting', to: 'peirce_how_to_make_our_ideas_clear', relation: 'converged', note: 'Wang holds that knowledge not carried into action is not yet knowledge; Peirce holds that a belief is a habit of action and means nothing beyond its practical effects. Ming China and Gilded Age America, no contact.' },
  { from: 'peirce_how_to_make_our_ideas_clear', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
  // Merleau-Ponty
  { from: 'heidegger_being_toward_death', to: 'merleau_ponty_body_subject', relation: 'extended', year: 1945, note: 'Merleau-Ponty\'s preface places his book in the phenomenology of Husserl and Heidegger, and his "being-in-the-world" (être au monde) is Heidegger\'s In-der-Welt-sein given a body.' },
  { from: 'dogen_just_sitting', to: 'merleau_ponty_body_subject', relation: 'converged', note: 'Dōgen\'s "just sitting" treats the upright body as itself the knowing, not a vehicle for it; Merleau-Ponty reaches the same claim from neurology and phenomenology. No contact; he does not cite Zen.' },
  { from: 'merleau_ponty_body_subject', to: 'practice_care_for_the_body', relation: 'lands_on' },
  // Nussbaum
  { from: 'aristotle_friendship', to: 'nussbaum_capabilities', relation: 'extended', year: 2000, note: 'Nussbaum, a classicist by training, takes the capabilities question from Aristotle\'s account of human functioning and lists affiliation, his philia, among the ten central capabilities; her debt to him is explicit throughout.' },
  { from: 'rawls_veil_of_ignorance', to: 'nussbaum_capabilities', relation: 'refuted', year: 2006, note: 'Frontiers of Justice argues that Rawls\'s contract among roughly equal parties cannot do justice to people with severe disabilities, to those beyond one\'s borders or to animals, and replaces it with the capabilities list; she calls Rawls the greatest political philosopher of the century while doing so.' },
  { from: 'nussbaum_capabilities', to: 'practice_invest_in_people', relation: 'lands_on' },
  // Foucault
  { from: 'nietzsche_amor_fati', to: 'foucault_discipline', relation: 'extended', year: 1971, note: 'Foucault\'s method is Nietzsche\'s genealogy, set out in his essay "Nietzsche, Genealogy, History" (1971); Discipline and Punish is a genealogy of the modern soul in that sense, and Foucault said he was "simply Nietzschean".' },
  { from: 'milgram_obedience', to: 'foucault_discipline', relation: 'converged', note: 'Milgram showed in the laboratory that ordinary people comply under an authority that watches them; Foucault argued from the archives that modern institutions produce such compliance by design. Foucault does not cite Milgram; no contact is known.' },
  { from: 'foucault_discipline', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },
];
