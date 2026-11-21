// Convergence edges, batch 1. EDGES ONLY: no new nodes.
// Each pair came from content/CONVERGENCE_CANDIDATES.md and was checked against the two nodes' faces and,
// where a public-domain text exists, against the fetched Gutenberg text named in the note.
// Edge fields: { from: earlier idea A, to: B, relation, year?, note }; read "B <relation> A".

export const nodes = [];

export const edges = [
  {
    from: 'boethius_wheel_of_fortune',
    to: 'brickman_lottery_winners',
    relation: 'measured',
    year: 1978,
    note: "Fortune's rule that the high come down and 'every lot is happy if borne with equanimity', measured: Brickman's 1978 Illinois lottery winners were no happier than matched controls, and the paralysed accident victims still rated their happiness well above the scale's midpoint.",
  },
  {
    from: 'mill_ask_whether_you_are_happy',
    to: 'brickman_lottery_winners',
    relation: 'measured',
    year: 1978,
    note: "Mill (Autobiography, 1873) held that happiness aimed at directly recedes; Brickman (1978) measured the adaptation behind it: winners who had received the very thing people aim at were no happier than controls and enjoyed ordinary pleasures less.",
  },
  {
    from: 'nagarjuna_emptiness',
    to: 'sartre_existence_precedes_essence',
    relation: 'converged',
    note: "Both deny an essence that exists before a thing acts: Nagarjuna (ch. 9, Suzuki trans.) rejects a soul that 'existed prior to seeing, feeling, etc.'; Sartre (1945) denies any human nature laid down before one exists and chooses. Sartre's lecture draws on Kierkegaard's Abraham, not on Madhyamaka: no contact.",
  },
  {
    from: 'buddha_craving_root_of_suffering',
    to: 'schopenhauer_will_source_of_suffering',
    relation: 'extended',
    year: 1844,
    note: "Schopenhauer read and praised Buddhism: in The World as Will and Idea vol. I, Book IV, §68 (Haldane–Kemp text, Gutenberg 38427) he writes 'In Buddhism also, there is no lack of expressions of this truth', and in §63 cites the Buddhists' promise 'Thou shalt attain to Nirvâna', a state without 'birth, age, sickness, and death'; the §68 passage cites Abel-Rémusat's 1836 Foe Koue Ki, so it postdates the 1818 first edition.",
  },
  {
    from: 'laozi_sufficiency_of_contentment',
    to: 'schopenhauer_will_source_of_suffering',
    relation: 'converged',
    note: "Laozi: 'no calamity greater than to be discontented with one's lot'; Schopenhauer: 'All willing arises from want ... from suffering.' The fetched Haldane–Kemp text of The World as Will and Idea vol. I (Gutenberg 38427) never mentions Tao or Laozi; Schopenhauer met the Tao Te Ching only through Abel-Rémusat's 1823 memoir, after the 1818 first edition.",
  },
  {
    from: 'averroes_decisive_treatise',
    to: 'zera_yacob_hatata',
    relation: 'converged',
    note: "Both make God-given reason the judge of how scripture is to be taken: Averroes (1179) holds 'truth cannot contradict truth' and reinterprets any verse that collides with a demonstration; Zera Yacob (1667) keeps only the laws that pass examination by the intelligence the Creator gave him. Zera Yacob, thinking in a cave near the Tekeze in the 1630s, had no known access to Averroes.",
  },
  {
    from: 'job_why_the_righteous_suffer',
    to: 'socrates_unexamined_life',
    relation: 'converged',
    note: "In both, the god's reply to a man's demand for a reason is not a doctrine but more questioning: God answers Job 'Where wast thou when I laid the foundations of the earth?' (Job 38:4), and Socrates says the God commands him to go on 'examining myself and others' daily rather than hold his tongue (Apology 38a). Neither text supplies the explanation asked for; no contact between the Hebrew and Greek texts.",
  },
  {
    from: 'heraclitus_same_river',
    to: 'hume_bundle_of_perceptions',
    relation: 'converged',
    note: "Heraclitus' river, where 'fresh waters are ever flowing in upon you', meets Hume's self: perceptions 'in a perpetual flux and movement' (Treatise I.iv.6, verified in Gutenberg 4705). Hume does not cite Heraclitus in that section.",
  },
  {
    from: 'aquinas_unjust_law_is_no_law',
    to: 'gandhi_satyagraha',
    relation: 'converged',
    note: "Both hold that an unjust law does not bind the conscience: Aquinas says such laws 'do not bind in conscience'; Gandhi says of a law repugnant to conscience 'I do not obey the law and accept the penalty'. Hind Swaraj's 'Some Authorities' appendix (Gutenberg 40461) lists Tolstoy, Thoreau, Ruskin, Mazzini and Plato, not Aquinas.",
  },
];
