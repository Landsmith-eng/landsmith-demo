// The content model in one place: which kinds of node, field and link exist. Read by the content gate
// (scripts/check-content.js), by seeding (db.js) and by the propose-a-connection page.

// Node types. work = an artwork; case = a court case (with its opinions); event = something in the news.
export const TYPES = ['thinker', 'concept', 'quote', 'dilemma', 'puzzle', 'text', 'practice', 'work', 'case', 'event'];

// Fields colour the map. art, culture, law and now arrived with the move beyond philosophy, religion and science.
export const FIELDS = ['philosophy', 'science', 'religion', 'practice', 'art', 'culture', 'law', 'now'];

// Links. Each runs from the earlier idea A to the later B; `note` says what B did with A.
//   echoes: B (an artwork, a court opinion, a news event, a piece of culture) restates, applies or tests A, often
//           without naming it. The note says whether the link is explicit (B cites A) or ours.
export const RELS = ['taught', 'extended', 'refuted', 'converged', 'measured', 'secularized', 'lands_on', 'echoes'];
export const DIRECTED = ['taught', 'extended', 'refuted', 'measured', 'secularized', 'echoes'];

// Plain-language descriptions, used on the propose page.
export const REL_HELP = {
  taught: 'A taught B directly (teacher and student, or B read A and followed).',
  extended: 'B built on A and took it further.',
  refuted: 'B argued against A.',
  converged: 'Same idea, no contact: B reached it without having read A.',
  measured: 'B tested A with evidence (an experiment, a study).',
  secularized: 'B kept A\'s practice without the deity.',
  lands_on: 'A lands on this practice (B must be a practice).',
  echoes: 'B (art, law, culture, the news) restates, applies or tests A.',
};

// Court opinions: who wrote what. A case's plain face carries the holding; each opinion here is one voice:
// { role, author, gist (our plain account), quote (verbatim), echoes (older node id), echo_note (why; cited or ours) }.
export const OPINION_ROLES = ['majority', 'plurality', 'concurrence', 'dissent'];
