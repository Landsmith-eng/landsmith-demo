// Branch: science and psychology, second batch. Walk-only nodes (no `seq`): how science learned to hold its own
// beliefs loosely (Galileo, Newton, Popper, Kuhn), what psychology said about freedom and need (Skinner, Maslow),
// and two twentieth-century essays on the conditions a person needs to think and to love (Woolf, Baldwin).
// Public-domain passages verified word for word against fetched texts (Gutenberg, Wikisource); in-copyright works
// are labelled summaries.

export const nodes = [
  {
    id: 'galileo_two_books',
    type: 'concept',
    field: 'science',
    thinker: 'Galileo Galilei',
    year: 1615,
    title: 'Nature and scripture are two books; a text cannot overrule the sky',
    prompt: 'Is there something you believe that you would keep believing even if what you saw with your own eyes said otherwise?',
    plain_face:
      'Two witnesses in a courtroom cannot both be right if they disagree, so you weigh which one was actually there. Galileo, under pressure for saying the earth moves, told the Grand Duchess Christina that scripture and nature are both God\'s books, and that nature was written in facts you can check. Where a verse seems to say the sun circles the earth, it is our reading of the verse that must give way, because the verse was written for shepherds, not astronomers.',
    source_face:
      'Summary (work under copyright in the standard English version; the 1661 English exists only as an unproofed scan): In the Letter to the Grand Duchess Christina of Lorraine (1615, circulated in manuscript), Galileo argues that scripture and nature both come from God, scripture as the dictation of the Holy Spirit and nature as the obedient executor of God\'s orders. Scripture speaks in the language of ordinary people and often says things that are not literally true, to suit their understanding; nature never breaks its own laws and does not care whether its hidden workings are understood. So, in natural questions that can be settled by sense experience and necessary demonstration, scripture should not be the first authority, and a conclusion proved in nature cannot be made false by a text. He quotes Cardinal Baronio: the Holy Spirit intended to teach us how one goes to heaven, not how heaven goes.',
    source_citation: 'Galileo Galilei, Letter to the Grand Duchess Christina (1615; first printed Strasbourg, 1636). English: Thomas Salusbury, Mathematical Collections and Translations, vol. 1 (London, 1661), as "The Ancient and Modern Doctrine of Holy Fathers…"; Stillman Drake, Discoveries and Opinions of Galileo (1957). Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'newton_general_scholium',
    type: 'quote',
    field: 'science',
    thinker: 'Isaac Newton',
    year: 1713,
    title: '"I frame no hypotheses"',
    prompt: 'Pick something you are sure of. How much of it is what you have actually seen, and how much is a story you added to make the seeing make sense?',
    plain_face:
      'A good detective tells you who was in the room and when, and refuses to guess at motive until the evidence forces it. Newton had shown that one law of gravity runs the tides, the moon and the planets, and everyone wanted to know what gravity was. He answered that he could not find its cause in the facts, so he would not invent one: "I frame no hypotheses." A theory earns its place by fitting the phenomena, and claims no more than they allow.',
    source_face:
      'Hitherto I have laid down such principles as have been received by mathematicians, and are confirmed by abundance of experiments. By the first two Laws and the first two Corollaries, Galileo discovered that the descent of bodies observed the duplicate ratio of the time, and that the motion of projectiles was in the curve of a parabola; experience agreeing with both, unless so far as these motions are a little retarded by the resistance of the air.\n\n… But hitherto I have not been able to discover the cause of those properties of gravity from phænomena, and I frame no hypotheses; for whatever is not deduced from the phænomena is to be called an hypothesis; and hypotheses, whether metaphysical or physical, whether of occult qualities or mechanical, have no place in experimental philosophy. In this philosophy particular propositions are inferred from the phænomena, and afterwards rendered general by induction. Thus it was that the impenetrability, the mobility, and the impulsive force of bodies, and the laws of motion and of gravitation, were discovered. And to us it is enough that gravity does really exist, and act according to the laws which we have explained, and abundantly serves to account for all the motions of the celestial bodies, and of our sea.',
    source_citation: 'Isaac Newton, Mathematical Principles of Natural Philosophy (Principia, 1687; General Scholium added to the 2nd ed., 1713): Scholium to the Laws of Motion, and General Scholium (trans. Andrew Motte, 1729; ed. N. W. Chittenden, New York: Daniel Adee, 1846). "I frame no hypotheses" renders Newton\'s "Hypotheses non fingo"; "I feign no hypotheses" is the modern rendering.',
    source_url: 'https://www.gutenberg.org/ebooks/76404',
  },
  {
    id: 'popper_falsification',
    type: 'concept',
    field: 'science',
    thinker: 'Karl Popper',
    year: 1934,
    title: 'A theory is scientific only if it could be proved wrong',
    prompt: 'Name one belief of yours and one thing that, if it happened, would make you drop it. If you cannot think of a second thing, what does that tell you about the first?',
    plain_face:
      'No number of white swans proves that all swans are white, but one black swan ends the matter. Popper turned this into a test for science itself. A theory that fits every possible outcome, that nothing could ever count against, is not strong but empty. Real theories stick their necks out: they forbid things, and we trust them only as long as we keep trying to catch them out and failing.',
    source_face:
      'Summary (work under copyright): In Logik der Forschung (1934; English, The Logic of Scientific Discovery, 1959) Popper accepts Hume\'s point that no finite run of observations can prove a general law, and concludes that science does not work by induction at all. A statement belongs to empirical science if and only if it is falsifiable: some possible observation would contradict it. Theories are conjectures; scientists should propose bold ones, deduce consequences, and test them as severely as they can. A theory that survives such tests is "corroborated", never verified, and is held provisionally until it fails. Popper applied the criterion against psychoanalysis and Marxist history, which he said explained everything and so forbade nothing, and for Einstein\'s relativity, which risked precise predictions.',
    source_citation: 'Karl Popper, The Logic of Scientific Discovery (London: Hutchinson, 1959; German original Logik der Forschung, Vienna: Springer, 1934), chs. I and IV; Conjectures and Refutations (1963), ch. 1. Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'kuhn_paradigm_shift',
    type: 'concept',
    field: 'science',
    thinker: 'Thomas Kuhn',
    year: 1962,
    title: 'Paradigm shifts: science changes its mind in revolutions, not steps',
    prompt: 'When did you last change your mind about something big? Was it one clean argument, or a slow pile-up of things that no longer fitted?',
    plain_face:
      'Look at the duck-rabbit drawing: you see a duck, then suddenly a rabbit, and nothing on the page has changed. Kuhn said science moves like that. Most of the time researchers solve puzzles inside a shared framework, a "paradigm", and set awkward results aside. Anomalies pile up, a crisis comes, and a new framework replaces the old one all at once, as Copernicus replaced Ptolemy and Einstein replaced Newton. The facts did not simply accumulate; the way of seeing flipped.',
    source_face:
      'Summary (work under copyright): The Structure of Scientific Revolutions describes "normal science" as puzzle-solving within a paradigm, the set of exemplary achievements, methods and assumptions a scientific community shares. Normal science does not aim to test the paradigm; results that will not fit are treated as the researcher\'s failure, not the theory\'s. When anomalies resist too long, the field enters crisis, rival candidates appear, and a scientific revolution installs a new paradigm, which Kuhn compares to a gestalt switch and a conversion. Successive paradigms are "incommensurable": they pose different problems and use old words in new senses, so the choice between them is not settled by logic and data alone. Kuhn cited the Copernican, Newtonian, chemical and Einsteinian revolutions as examples.',
    source_citation: 'Thomas S. Kuhn, The Structure of Scientific Revolutions (Chicago: University of Chicago Press, 1962; 2nd ed. with Postscript, 1970), chs. II–X. Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'skinner_beyond_freedom',
    type: 'concept',
    field: 'science',
    thinker: 'B. F. Skinner',
    year: 1971,
    title: 'Behaviour is shaped by its consequences; "autonomous man" is a fiction',
    prompt: 'Think of a habit you call a choice. What rewards it, and what would happen to it if the reward stopped?',
    plain_face:
      'A river does not decide its course; the land it has run over shapes where it runs next. Skinner said people are like that. Behaviour that is rewarded comes back, behaviour that is not fades, and the "free self" we credit with our choices is a leftover story, like the spirits that once explained the weather. Rather than blame or praise the self, he said, change the surroundings that write it.',
    source_face:
      'Summary (work under copyright): Beyond Freedom and Dignity argues that a scientific account of behaviour has no room for the "autonomous man" of traditional thought, the inner agent credited with free choice and held responsible for it. Behaviour is selected by its consequences (operant conditioning), as species are selected by theirs. What we call feeling free is behaving under positive reinforcement rather than under threat; what we call dignity is the credit we give when the causes of good conduct are hidden. Skinner proposes that the "literature of freedom and dignity", by attacking all control, blocks the deliberate design of environments that would reinforce cooperative, non-destructive behaviour; control is unavoidable, so the question is who designs it and to what end. He ends: a scientific view of man offers exciting possibilities; we have not yet seen what man can make of man.',
    source_citation: 'B. F. Skinner, Beyond Freedom and Dignity (New York: Alfred A. Knopf, 1971), chs. 1–3, 9. Summary, not a quotation.',
    source_url: null,
  },
  {
    id: 'maslow_hierarchy',
    type: 'concept',
    field: 'science',
    thinker: 'Abraham Maslow',
    year: 1943,
    title: 'The hierarchy of needs: hunger first, then safety, love, respect, and becoming yourself',
    prompt: 'Which of your needs is loudest right now: food and rest, safety, belonging, respect, or doing the thing you were made for? Is it the one you are actually feeding?',
    plain_face:
      'You cannot hear the radio while the fire alarm is going. Maslow said human needs work like that, in layers: while you are hungry or unsafe, nothing else gets a hearing; once that is settled, the need for love comes forward, then for respect, and at last the quieter need to become what you are capable of, which he called self-actualisation. A satisfied need, he noticed, stops being a motive at all, which is why the well-fed forget what hunger meant.',
    source_face:
      'Summary (work under copyright unless the 1943 copyright lapsed, which was not verified): In "A Theory of Human Motivation" (Psychological Review, 1943) Maslow proposes that human needs are arranged in a hierarchy of prepotency: physiological needs, then safety, then love and belonging, then esteem, then self-actualisation, the desire to become everything one is capable of becoming. A need that is gratified ceases to dominate behaviour and the next emerges; a person who is chronically hungry lives for bread alone, but once fed wants more. The hierarchy is not rigid: Maslow allows reversals (some people put esteem before love, or creativity before everything), notes that most people are partly satisfied at every level, and treats the orders as degrees rather than steps. The later image of a pyramid is not in the paper.',
    source_citation: 'A. H. Maslow, "A Theory of Human Motivation", Psychological Review 50(4), 1943, pp. 370–396. Summary, not a quotation.',
    source_url: 'https://doi.org/10.1037/h0054346',
  },
  {
    id: 'woolf_room_of_ones_own',
    type: 'text',
    field: 'philosophy',
    thinker: 'Virginia Woolf',
    year: 1929,
    title: 'A Room of One\'s Own: "money and a room of her own"',
    prompt: 'What would you make if you had five hundred a year and a door that locked? What stands between you and that today?',
    plain_face:
      'A seed does not fail for want of ambition; it fails for want of soil, water and a little room to grow. Asked to speak on women and fiction, Woolf gave a blunt answer: a woman must have money and a room of her own if she is to write. She imagined Shakespeare\'s equally gifted sister, who could not go to school, could not act, and died unknown, and concluded that genius is not rare so much as starved. Freedom of mind, she said, rests on plain material things.',
    source_face:
      'All I could do was to offer you an opinion upon one minor point—a woman must have money and a room of her own if she is to write fiction; and that, as you will see, leaves the great problem of the true nature of woman and the true nature of fiction unsolved.\n\n… Intellectual freedom depends upon material things. Poetry depends upon intellectual freedom. And women have always been poor, not for two hundred years merely, but from the beginning of time. Women have had less intellectual freedom than the sons of Athenian slaves. Women, then, have not had a dog\'s chance of writing poetry. That is why I have laid so much stress on money and a room of one\'s own.',
    source_citation: 'Virginia Woolf, A Room of One\'s Own, chs. 1 and 6 (London: Hogarth Press, 1929)',
    source_url: 'https://en.wikisource.org/wiki/A_Room_of_One%27s_Own_(Hogarth_1929)',
  },
  {
    id: 'baldwin_fire_next_time',
    type: 'text',
    field: 'philosophy',
    thinker: 'James Baldwin',
    year: 1963,
    title: 'The Fire Next Time: love as a state of being, "to take off the masks"',
    prompt: 'What mask do you wear because you are afraid of what is under it? Who, if anyone, has seen you without it?',
    plain_face:
      'A suit of armour keeps the blows out, and also keeps everything else out, and gets heavier every year. Baldwin, writing to his fifteen-year-old nephew and then to America, said that white Americans were trapped in a history they did not understand and could not face, and that black Americans could not be free until they loved themselves and even, with clear eyes, their oppressors. Love here is not sentiment but a daring state of growth: the readiness to take off the masks we fear we cannot live without.',
    source_face:
      'Summary (work under copyright): The Fire Next Time holds two essays. "My Dungeon Shook", a letter to Baldwin\'s nephew James on the hundredth anniversary of Emancipation, tells him that he was born into a society that intended him to perish, that the people who set that limit are trapped in a history they do not understand, and that he must accept them with love, because they are his brothers. "Down at the Cross" recounts Baldwin\'s teenage conversion in a Harlem church, his loss of faith, and a dinner with Elijah Muhammad of the Nation of Islam, whose separatism he refuses. Baldwin argues that love, taken not as sentiment but as a state of being and of grace, a tough and universal daring, is what allows people to take off the masks they fear they cannot live without and know they cannot live within; that the price of white liberation is the end of the white self-image; and that the relatively conscious whites and blacks who insist on this may yet avert the fire the spiritual promised to the next time.',
    source_citation: 'James Baldwin, The Fire Next Time (New York: Dial Press, 1963): "My Dungeon Shook" and "Down at the Cross" (the latter first in The New Yorker, 17 November 1962). Summary, not a quotation.',
    source_url: null,
  },
];

// Direction: `from` is the earlier idea A; read "B <relation> A".
export const edges = [
  // Galileo
  { from: 'averroes_decisive_treatise', to: 'galileo_two_books', relation: 'converged', note: 'Averroes said demonstrated truth cannot contradict revealed truth; Galileo said nature cannot be overruled by a text. Galileo did not cite Averroes for this.' },
  { from: 'galileo_two_books', to: 'newton_general_scholium', relation: 'extended', year: 1687, note: 'Newton\'s Scholium to the Laws credits Galileo with discovering, "by the first two Laws", that falling bodies follow the square of the time and projectiles a parabola.' },
  { from: 'galileo_two_books', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Newton
  { from: 'newton_general_scholium', to: 'einstein_spinozas_god', relation: 'extended', year: 1915, note: 'Einstein\'s general relativity replaced Newton\'s force of gravity with curved spacetime, and reduces to Newton\'s law where fields are weak; Einstein called Newton\'s the foundation he built on.' },
  { from: 'newton_general_scholium', to: 'practice_hold_beliefs_loosely', relation: 'lands_on', note: 'Hold a theory only as far as the phenomena carry it: "whatever is not deduced from the phænomena is to be called an hypothesis".' },

  // Popper
  { from: 'hume_bundle_of_perceptions', to: 'popper_falsification', relation: 'extended', year: 1934, note: 'Popper said his whole approach answered Hume\'s problem of induction: since no run of cases proves a law, science must proceed by conjecture and refutation instead.' },
  { from: 'popper_falsification', to: 'kuhn_paradigm_shift', relation: 'refuted', year: 1962, note: 'Kuhn argued that working scientists do not try to falsify their paradigm but solve puzzles inside it; he and Popper debated this at Bedford College, London, in 1965.' },
  { from: 'popper_falsification', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Kuhn
  { from: 'kuhn_paradigm_shift', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Skinner
  { from: 'locke_blank_slate', to: 'skinner_beyond_freedom', relation: 'extended', year: 1971, note: 'Skinner\'s behaviourism carries Locke\'s empiricism to its limit: experience does not just fill the mind, its consequences select every act; the lineage runs through British associationism and Watson.' },
  { from: 'spinoza_freedom_understanding_necessity', to: 'skinner_beyond_freedom', relation: 'converged', note: 'Both deny an uncaused free will and relocate freedom in the causes: for Spinoza, understanding them; for Skinner, being controlled by reward rather than threat. Skinner did not cite Spinoza for this.' },
  { from: 'skinner_beyond_freedom', to: 'beck_cognitive_therapy_stoicism_tested', relation: 'refuted', year: 1979, note: 'Beck\'s cognitive therapy made a patient\'s thoughts and beliefs, not only environmental contingencies, the cause of mood and behaviour, and the thing to change.' },
  { from: 'skinner_beyond_freedom', to: 'practice_control_your_response', relation: 'lands_on', note: 'Skinner\'s version: you cannot will a response, but you can arrange the surroundings that shape it, which is itself a response you control.' },

  // Maslow
  { from: 'maslow_hierarchy', to: 'frankl_mans_search_for_meaning', relation: 'refuted', year: 1966, note: 'Frankl argued that meaning is pursued even in hunger and danger, as he had seen in the camps, so it is not a luxury of satisfied lower needs; Maslow replied in the same journal issue (1966).' },
  { from: 'maslow_hierarchy', to: 'seligman_learned_helplessness', relation: 'extended', year: 2000, note: 'Seligman\'s positive psychology took up Maslow\'s question of what makes a life flourish, while faulting humanistic psychology for its thin empirical base.' },
  { from: 'maslow_hierarchy', to: 'practice_care_for_the_body', relation: 'lands_on', note: 'The base of the hierarchy: while the body is hungry or unrested, nothing higher gets a hearing.' },

  // Woolf
  { from: 'wollstonecraft_reason_has_no_sex', to: 'woolf_room_of_ones_own', relation: 'converged', note: 'Both trace women\'s apparent lack of genius to denied education and means rather than nature; Woolf does not name Wollstonecraft in A Room of One\'s Own.' },
  { from: 'sor_juana_reply', to: 'woolf_room_of_ones_own', relation: 'converged', note: 'Sor Juana, denied schooling, studied alone in a convent cell; Woolf asked for money and a room: both say a woman\'s mind needs a space of its own, with no contact between them.' },
  { from: 'woolf_room_of_ones_own', to: 'beauvoir_second_sex', relation: 'extended', year: 1949, note: 'Beauvoir cites Woolf\'s A Room of One\'s Own in The Second Sex, including the story of Shakespeare\'s sister, when explaining why women have produced fewer great works.' },
  { from: 'woolf_room_of_ones_own', to: 'practice_work_that_outlasts_you', relation: 'lands_on' },

  // Baldwin
  { from: 'du_bois_double_consciousness', to: 'baldwin_fire_next_time', relation: 'extended', year: 1963, note: 'Baldwin\'s account of a black child learning to see himself through the eyes of a country that despises him continues Du Bois\'s double consciousness; Baldwin read Du Bois and often invoked him.' },
  { from: 'king_letter_from_birmingham_jail', to: 'baldwin_fire_next_time', relation: 'converged', note: 'Written months apart in 1963 and independently: King demanded that white moderates act now, Baldwin that white Americans face their history; both insisted love, not hatred, was the way through.' },
  { from: 'baldwin_fire_next_time', to: 'hooks_all_about_love', relation: 'extended', year: 2000, note: 'hooks returned to Baldwin\'s account of love as a daring state of growth, not a sentiment, across her writing on love; All About Love treats love as a practice in just that sense.' },
  { from: 'baldwin_fire_next_time', to: 'practice_invest_in_people', relation: 'lands_on' },
];
