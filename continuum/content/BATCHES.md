# Adding content to Continuum

The graph grows in batches of walk-only nodes. The 14-day line in `line_poc.js` stays fixed for the tester run;
everything else lives in `content/branches/*.js` and is reached by walking. Any file you drop into `branches/`
is loaded automatically (`content/index.js` merges them; the first copy of a practice node wins, duplicate
idea ids are an error).

## The loop

1. **Pick names** from `ROSTER.md` (priority A first) or from a new discovery. For new *edges* between nodes already
   on the map, run `npm run converge`: it lists unlinked pairs whose faces talk about the same thing
   (`CONVERGENCE_CANDIDATES.md`), ranked; each still needs a verified note before it becomes an edge. Add new discoveries to the roster
   with a curriculum tag or `*added*`, and say what crossover they bring. `WIKIDATA.md` says how to pull
   influence links as suggestions for Western thinkers.
2. **Write the file** `content/branches/<batch>.js` exporting `nodes` and `edges` in the shape of the existing
   files. Rules that matter:
   - Two faces on every idea node: `plain_face` (one analogy, no jargon, one screen) and `source_face`
     (the authentic passage, translator, edition). `thinker` and `practice` nodes may omit the source.
   - Edges are typed and directed: `from` = the earlier idea A, `to` = B, read "B *relation* A".
     `taught` = direct student; `extended` and `refuted` need real contact; `converged` = same idea, no contact;
     `measured` = science tested it; `secularized` = kept the practice, dropped the deity; `lands_on` → a practice.
   - Every edge carries a one-line `note` that is a true, specific claim. Unsure of the history → `converged` or leave it out.
   - Every node must be able to reach a practice by walking.
3. **Verify every quotation word for word** against a downloaded text. Public-domain translations only
   (Gutenberg, Wikisource, Perseus); cite translator and year; `source_url` = the page you checked against.
   An original in another language may be quoted with our own rendering after it in a paragraph wrapped in
   [square brackets]; the verifier skips bracketed paragraphs, and the citation must say whose rendering it is.
   In-copyright works get at most one short verified sentence, or a face that starts
   `Summary (work under copyright): …`. Never quote from memory; famous misattributions are common.
4. **Run the gate:** `npm run check -- <batch>` must print `content OK`. Then
   `node scripts/verify-quotes.js <dir-of-downloaded-texts> <batch>` must report every quoted passage matched.
   Then `npm test`.
5. **Record it** in `SOURCES.md` (what was verified against what; what is still a summary; which edge claims
   rest on memory), and tick the names off in `ROSTER.md`.
6. `npm run seed` reloads content without touching journals. Node ids are permanent once a tester has
   written on them; edit text freely, never rename an id.

## Batches so far

| Batch | File | Nodes | Theme |
|---|---|---|---|
| 0 | `line_poc.js` | 14 + 4 practices | The daily line from the concept doc |
| 1 | `traditions.js`, `science.js`, `modern.js` | 28 + 2 practices | First crossovers: world traditions, science & psychology, modern philosophy |
| 2 | `ancient.js`, `east.js`, `modern2.js` | 15 + 1 practice | Roster priority A: Heraclitus → Zhuangzi. Graph: 62 nodes, 120 edges, all 7 practices |
| 3 | `medieval2.js`, `global.js`, `modern3.js` | 18 | Gilgamesh to Kahneman; Africa, the Americas and India; the 20th century. Graph: 80 nodes, 177 edges |

## Not yet decided

- When the line itself should change (a second 14-day line for returning testers, or a longer one).
- Whether to let testers suggest a thinker from inside the app (a "who's missing?" box feeding the roster).
