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

## Beyond philosophy: art, culture, law and the news

The model (`content/model.js`) has four more fields (`art`, `culture`, `law`, `now`), three more node types
(`work` = an artwork, `case` = a court case, `event` = something in the news) and one more link, **`echoes`**:
B (an artwork, a court opinion, a piece of culture, a news story) restates, applies or tests the older idea A,
usually without naming it. The note says whether the link is explicit (B cites A) or ours. `npm run check`
enforces the rules below.

- **Every new node gets a room** in `rooms.js` (`art`, `culture`, `law`, `now`, or an existing one) **and its themes**
  in `themes.js`. A new theme, conflict or dilemma needs a question and at least three ideas.
- **Art (`work`).** `source_url` = the museum or Wikimedia Commons page. Prefer public-domain works: they bring
  their own picture (add it to `images.js` as kind `artefact` with the Commons credit and licence). The plain face
  says what the work shows and which idea it puts in front of the eyes.
- **Court cases (`case`, field `law`).** US federal court opinions are public domain, so every opinion is quoted
  verbatim and verified like any other text. `opinions` lists the majority (or plurality) first, then concurrences
  and dissents: each `{ role, author, gist, quote, echoes }`, where `gist` is our plain-language account of that
  opinion's argument and `echoes` is the node id of the older idea it draws on. The plain face states the
  question and the holding without taking a side; the prompt asks the reader which opinion persuades them and why.
  For current cases, verify against supremecourt.gov slip opinions (see the network note in README).
- **News (`event`, field `now`).** News text is in copyright: the source face is a labelled summary
  (`Summary (outlet, date): …`), `source_url` points to a reputable outlet, and `as_of` dates it. Every news node
  needs an `echoes` link from an older idea, and its prompt must be a question, never a verdict. Present more than
  one side when the story is contested; the point is to think with the older idea, not to tell anyone what to conclude.
- **Proposals.** `/propose` (admin key) queues connections you find. `npm run proposals` writes the open ones to
  `PROPOSALS.md`; or copy them from the page and paste them into a session. Verify, write, run the gate, then mark
  each one added (or declined, with a reason) on the page.

## Batches so far

| Batch | File | Nodes | Theme |
|---|---|---|---|
| 0 | `line_poc.js` | 14 + 4 practices | The daily line from the concept doc |
| 1 | `traditions.js`, `science.js`, `modern.js` | 28 + 2 practices | First crossovers: world traditions, science & psychology, modern philosophy |
| 2 | `ancient.js`, `east.js`, `modern2.js` | 15 + 1 practice | Roster priority A: Heraclitus → Zhuangzi. Graph: 62 nodes, 120 edges, all 7 practices |
| 3 | `medieval2.js`, `global.js`, `modern3.js` | 18 | Gilgamesh to Kahneman; Africa, the Americas and India; the 20th century. Graph: 80 nodes, 177 edges |
| 4 | `ancient2.js`, `modern4.js`, `contemporary.js` | 15 | Plato's cave to Seligman; Yoga and Zen; women's reason (Sor Juana, Wollstonecraft, Beauvoir). Graph: 95 nodes, 229 edges |
| 5 | `classical2.js`, `global2.js`, `convergences1.js` | 15 + 9 edges | Homer to Voltaire; the global 20th century; first verified pass over the convergence-finder's candidates. Graph: 110 nodes, 285 edges |
| 6 | `ancient3.js`, `global3.js`, `science2.js` | 20 | Sappho to Baldwin; Ptahhotep, the oldest text on the map; Shankara, Mozi, Wang Yangming; Galileo, Newton, Kuhn, Popper. Graph: 130 nodes, 348 edges |
| 7 | `classical3.js`, `global4.js`, `modern5.js` | 20 | Herodotus to Tocqueville; the Mahabharata and Rāmānuja; Deloria, Freire, Senghor, Mariátegui, Wiredu; Pavlov to Foucault. Graph: 150 nodes, 407 edges |
| 8 | `classical4.js`, `global5.js`, `modern6.js` | 20 | Thucydides to Wundt (Copernicus and Kepler verified); Kalidasa, Dignāga, Cordova, Martí, Nkrumah, Paz; Husserl to Butler. The roster is empty. Graph: 170 nodes, ~468 edges |

## Not yet decided

- When the line itself should change (a second 14-day line for returning testers, or a longer one).
- Whether to let testers suggest a thinker from inside the app (the admin-only `/propose` page could open up to them).
