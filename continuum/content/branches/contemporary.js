// Branch: twentieth-century thought beyond the line: Wittgenstein, Rawls, Parfit, Beauvoir, Seligman.
// Walk-only nodes (no seq). Same shape as content/line_poc.js.
// Public-domain passages (Wittgenstein, Ogden 1922; Laozi, Legge 1891) verified word for word against the texts cited.
// In-copyright works (Rawls, Parfit, Beauvoir, Seligman) carry labelled summaries, or at most one short verified sentence.

export const nodes = [
  {
    id: 'wittgenstein_whereof_one_cannot_speak',
    type: 'quote',
    field: 'philosophy',
    thinker: 'Ludwig Wittgenstein',
    year: 1921,
    title: '"Whereof one cannot speak, thereof one must be silent"',
    prompt: 'What is the most important thing in your life that you have never managed to put into words? What happens when you try?',
    plain_face:
      'A map of a city can show you every street, but no map can tell you whether you should live there. Wittgenstein, writing the Tractatus as a soldier in the First World War, says language and science are like the map: they can picture every fact in the world. What life means, what is good, why anything exists at all, are not facts in the world, so they cannot be said. He does not conclude that they do not matter; he thinks they matter most. They show themselves, and the honest response to them is silence.',
    source_face:
      '6.43 … The world of the happy is quite another than that of the unhappy.\n\n6.52 We feel that even if all possible scientific questions be answered, the problems of life have still not been touched at all. Of course there is then no question left, and just this is the answer.\n\n6.54 My propositions are elucidatory in this way: he who understands me finally recognizes them as senseless, when he has climbed out through them, on them, over them. (He must so to speak throw away the ladder, after he has climbed up on it.)\n\n7 Whereof one cannot speak, thereof one must be silent.\n\n[Wovon man nicht sprechen kann, darüber muss man schweigen.]',
    source_citation: 'Ludwig Wittgenstein, Tractatus Logico-Philosophicus, propositions 6.43, 6.52, 6.54 and 7 (German 1921; trans. C. K. Ogden with F. P. Ramsey, London: Kegan Paul, 1922). German of 7 from the Project Gutenberg edition (#5740).',
    source_url: 'https://en.wikisource.org/wiki/Tractatus_Logico-Philosophicus',
  },
  {
    id: 'rawls_veil_of_ignorance',
    type: 'dilemma',
    field: 'philosophy',
    thinker: 'John Rawls',
    year: 1971,
    title: 'The veil of ignorance',
    prompt: 'If you did not know whether you would be born into the best-off or the worst-off family in your country, which one rule of your society would you change first?',
    plain_face:
      'The fair way to share a cake is to let one person cut it without knowing which slice they will get. Rawls asks you to cut a whole society that way: choose its rules before you know whether you will be born rich or poor, healthy or sick, of which sex, race or talent, with which beliefs. Behind that veil of ignorance, he argues, you would protect equal basic liberties for everyone and allow inequalities of wealth only where they leave the worst-off better than they would otherwise be, because the worst-off might turn out to be you.',
    source_face:
      'Summary (work under copyright): Rawls revives the social contract as a thought experiment. Imagine free and rational persons in an "original position", choosing the principles that will govern their society from behind a "veil of ignorance": no one knows their class, wealth, natural abilities, sex, psychology or even their conception of the good. Rawls argues they would reject utilitarianism, which might sacrifice some for the greater sum, and choose two principles: first, each person has an equal right to the most extensive basic liberties compatible with the same liberties for all; second, social and economic inequalities are permitted only if they are to the greatest benefit of the least advantaged (the "difference principle") and attached to positions open to all under fair equality of opportunity. The first principle has priority over the second. In §40 he calls the whole construction a Kantian interpretation: principles chosen in the original position are the ones we would give ourselves as free and equal rational beings.',
    source_citation: 'John Rawls, A Theory of Justice (Cambridge, MA: Harvard University Press, 1971), §§3–4 (the main idea; the original position), §§11–13 (the two principles), §24 (the veil of ignorance), §40 (the Kantian interpretation). Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'parfit_what_matters',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Derek Parfit',
    year: 1984,
    title: 'Personal identity is not what matters',
    prompt: 'How much of the person you were ten years ago is still here? Which of those threads, if they frayed, would you actually mind losing?',
    plain_face:
      'A club disbands, and years later some of the old members start one with the same name. Is it the same club? Once you know every fact about the members and the meetings, there is nothing more to find out; the question is empty. Parfit says a person is like that: a stream of experiences, memories, intentions and character, held together by connections, with no extra self riding on top. So whether a future person is "really you" is not what matters. What matters is how much is connected, and that comes in degrees. He found this freeing: death cuts some of the connections, not all of them.',
    source_face:
      'Summary (work under copyright): In Part Three Parfit defends a "Reductionist" view of persons: a person\'s existence just consists in the existence of a brain and body and a series of interrelated physical and mental events; there is no further fact, no Cartesian ego, over and above these. He traces the view to Hume\'s bundle of perceptions and argues for it through cases of fission, teletransportation and gradual replacement, in which the question "would that person be me?" has no determinate answer and, he concludes, does not matter. What matters is "Relation R": psychological connectedness and continuity, with any cause, which hold in degrees. In the closing sections of Part Three he reports that the view changed his attitude to his own death: his death will break the more direct relations between his present experiences and future ones, but other relations will remain, and that is all there is to the fact that there will be no one living who is him. In Appendix J, "Buddha\'s View", he collects passages from early Buddhist texts (among them the Visuddhimagga and the Milindapañha) and notes that the Buddha held the same Reductionist view.',
    source_citation: 'Derek Parfit, Reasons and Persons (Oxford: Clarendon Press, 1984), Part Three, "Personal Identity", chs. 10–13, esp. §§79–87, 95; Appendix J, "Buddha\'s View" (pp. 502–503). Summary, not quotation.',
    source_url: null,
  },
  {
    id: 'beauvoir_second_sex',
    type: 'concept',
    field: 'philosophy',
    thinker: 'Simone de Beauvoir',
    year: 1949,
    title: '"One is not born, but rather becomes, a woman"',
    prompt: 'Which part of who you are did you absorb before you were old enough to choose it? Would you choose it now?',
    plain_face:
      'Nobody is born with an accent. You pick it up from everyone around you until it sounds like your own voice. Beauvoir argues that femininity works the same way: what a society calls "a woman", gentle, passive, made for others, is not nature but upbringing, and it serves to cast woman as "the Other", the second sex against which man counts as the default human. Her existentialist conclusion follows: what was made can be remade. A woman, like anyone, is her choices and projects, not a fixed essence.',
    source_face:
      'Short quotation (work under copyright): "One is not born, but rather becomes, a woman." (French: "On ne naît pas femme : on le devient.") This sentence opens Book Two of The Second Sex. In the Introduction Beauvoir sets out the frame for it: humanity is male, and man defines woman not in herself but as relative to him; she is the Other. Beauvoir draws the category of the Other from Hegel\'s account of master and slave, in which each consciousness seeks to be recognised as sovereign by the other, and from the existentialist ethics she shared with Sartre: there is no fixed feminine nature, only a situation, and a freedom that can accept or refuse it.',
    source_citation: 'Simone de Beauvoir, Le Deuxième Sexe (Paris: Gallimard, 1949), vol. II, Part One, "Childhood", opening sentence; trans. H. M. Parshley, The Second Sex (New York: Knopf, 1953), Book Two, ch. XII. The quoted sentence is Parshley\'s wording; the rest is a summary.',
    source_url: null,
  },
  {
    id: 'seligman_learned_helplessness',
    type: 'concept',
    field: 'science',
    thinker: 'Martin Seligman',
    year: 1967,
    title: 'Learned helplessness, and learned optimism',
    prompt: 'Think of the last time you stopped trying. Was the door actually locked, or had you simply stopped testing it?',
    plain_face:
      'A dog that has learned nothing it does makes any difference will lie in a pen and take the shock, even after the gate has been opened. Seligman and Maier saw this in 1967 and called it learned helplessness. The same pattern turned up in people: it is not the setback itself but the belief that nothing you do matters that flattens you. Seligman then turned the finding round. The habit of explaining bad events as temporary, specific and changeable can be taught, and it protects against depression. He called it learned optimism, and it became the seed of positive psychology.',
    source_face:
      'Summary (work under copyright): In the 1967 experiments dogs were first exposed to electric shocks in a hammock. Some could stop the shock by pressing a panel; "yoked" dogs received exactly the same shocks but nothing they did affected them; a third group received no shock. Later, in a shuttle box where a jump over a low barrier would end the shock, the dogs that had been able to control the earlier shocks learned to escape, as did the naive dogs, but most of the yoked dogs sat passively and did not try. Since the shocks were identical, the cause was uncontrollability itself. In 1978 Seligman, with Abramson and Teasdale, reformulated the theory for humans: helplessness becomes depression when a person explains bad events as permanent, pervasive and personal ("explanatory style"). In Learned Optimism (1991) Seligman reports that this style predicts depression, illness and giving up, and that it can be changed by the disputation techniques of cognitive therapy, which he credits to Aaron Beck and Albert Ellis.',
    source_citation: 'Martin E. P. Seligman and Steven F. Maier, "Failure to escape traumatic shock", Journal of Experimental Psychology 74 (1967), 1–9; J. Bruce Overmier and Martin E. P. Seligman, "Effects of inescapable shock upon subsequent escape and avoidance responding", Journal of Comparative and Physiological Psychology 63 (1967), 28–33; L. Y. Abramson, M. E. P. Seligman and J. D. Teasdale, "Learned helplessness in humans: critique and reformulation", Journal of Abnormal Psychology 87 (1978), 49–74; Martin E. P. Seligman, Learned Optimism (New York: Knopf, 1991). Summary, not quotation.',
    source_url: null,
  },
];

// Direction: `from` is the earlier idea; `relation` says what `to` did with it.
export const edges = [
  // Wittgenstein
  { from: 'laozi_sufficiency_of_contentment', to: 'wittgenstein_whereof_one_cannot_speak', relation: 'converged', note: 'The Tao Te Ching opens "The Tao that can be trodden is not the enduring and unchanging Tao. The name that can be named is not the enduring and unchanging name" (Legge, 1891); the Tractatus ends by placing what matters most beyond what can be said. No contact.' },
  { from: 'schopenhauer_will_source_of_suffering', to: 'wittgenstein_whereof_one_cannot_speak', relation: 'extended', year: 1921, note: 'Schopenhauer was the first philosopher Wittgenstein read, as a youth (G. H. von Wright, Biographical Sketch, 1955); Tractatus 6.43, where good or bad willing changes the limits of the world and not its facts so that "the world of the happy is quite another than that of the unhappy", keeps Schopenhauer\'s will as the ground of the world\'s aspect.' },
  { from: 'kierkegaard_fear_and_trembling', to: 'wittgenstein_whereof_one_cannot_speak', relation: 'extended', year: 1921, note: 'Wittgenstein never names Kierkegaard in the Tractatus, but his friend M. O\'C. Drury recorded him calling Kierkegaard the most profound thinker of the nineteenth century, and a saint (Rhees, ed., Recollections of Wittgenstein, 1981); both place the religious and the ethical beyond what argument can state.' },
  { from: 'wittgenstein_whereof_one_cannot_speak', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Rawls
  { from: 'kant_ends_not_means', to: 'rawls_veil_of_ignorance', relation: 'extended', year: 1971, note: 'Rawls titles §40 of A Theory of Justice "The Kantian Interpretation of Justice as Fairness": the principles chosen behind the veil are those free and equal rational persons would legislate for themselves, his reading of Kant\'s autonomy and kingdom of ends.' },
  { from: 'rawls_veil_of_ignorance', to: 'nozick_experience_machine', relation: 'refuted', year: 1974, note: 'Anarchy, State, and Utopia, the same book that holds the experience machine (ch. 3), devotes ch. 7 to Rawls, arguing that the difference principle is unjust because it treats people\'s talents as a common asset and redistributes what they are entitled to.' },
  { from: 'rawls_veil_of_ignorance', to: 'practice_invest_in_people', relation: 'lands_on' },

  // Parfit
  { from: 'hume_bundle_of_perceptions', to: 'parfit_what_matters', relation: 'extended', year: 1984, note: 'Parfit names Hume\'s bundle of perceptions (Treatise I.iv.6) as the ancestor of his Reductionist view of persons in Part Three of Reasons and Persons.' },
  { from: 'buddha_craving_root_of_suffering', to: 'parfit_what_matters', relation: 'converged', note: 'Parfit reached the Reductionist view by argument and then found it stated in early Buddhist texts; Appendix J of Reasons and Persons, "Buddha\'s View", collects the passages. Same conclusion, 2,300 years apart, with no doctrinal descent.' },
  { from: 'parfit_what_matters', to: 'practice_keep_death_in_view', relation: 'lands_on' },

  // Beauvoir
  { from: 'wollstonecraft_reason_has_no_sex', to: 'beauvoir_second_sex', relation: 'extended', year: 1949, note: 'The Second Sex carries on the argument Wollstonecraft began in 1792: that what passes for female nature is the product of education and situation; Beauvoir\'s historical survey in Book One treats the eighteenth-century and nineteenth-century feminist writers as her predecessors.' },
  { from: 'sartre_existence_precedes_essence', to: 'beauvoir_second_sex', relation: 'extended', year: 1949, note: 'Beauvoir applies the existentialist thesis that existence precedes essence to sex: there is no feminine essence, only a situation and a freedom; she states in the Introduction that her perspective is that of existentialist ethics.' },
  { from: 'hegel_master_and_slave', to: 'beauvoir_second_sex', relation: 'extended', year: 1949, note: 'Beauvoir\'s Introduction takes the category of the Other, and the struggle of each consciousness to be recognised as sovereign, explicitly from Hegel\'s master and slave, and applies it to the relation between the sexes.' },
  { from: 'beauvoir_second_sex', to: 'practice_hold_beliefs_loosely', relation: 'lands_on' },

  // Seligman
  { from: 'beck_cognitive_therapy_stoicism_tested', to: 'seligman_learned_helplessness', relation: 'extended', year: 1991, note: 'Seligman\'s Learned Optimism (1991) credits Aaron Beck\'s cognitive therapy, with Albert Ellis\'s, for the disputation technique by which a pessimistic explanatory style is changed; the 1978 reformulation of helplessness in terms of how people explain bad events runs parallel to Beck\'s account of depressive thinking.' },
  { from: 'epictetus_up_to_us', to: 'seligman_learned_helplessness', relation: 'measured', year: 1967, note: 'Seligman and Maier made control the experimental variable: dogs given identical shocks differed only in whether anything they did could stop them, and only those for whom nothing was "up to them" became helpless. The 1978 reformulation found the same in people: it is the judgment that nothing is in your power, not the event, that produces depression.' },
  { from: 'seligman_learned_helplessness', to: 'practice_control_your_response', relation: 'lands_on' },
];
