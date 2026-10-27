# Continuum (MVP)

One small idea a day. Write your take first, then read the plain face, flip to the authentic source,
and walk the lineage as far as you like: who came before, who extended it, who attacked it, who measured it,
and which practice it lands on.

Spec: Jack's concept doc, "Continuum: a daily journey through human wisdom" (Claude Doc, 2026-10-26).
MVP scope (its first milestone): the 14-node proof-of-concept line (Democritus → Nozick's experience machine),
two faces each, playable on a phone, with a journal. 5 testers, 2 weeks.
The only question is **did they come back?** `/admin` answers it.

Standalone product. It lives under the Landsmith tree for now and is git-ignored there. It will move to its own repo.

## Run

Requires Node ≥ 22.13 (uses built-in `node:sqlite`).

```sh
npm install
npm run seed                                  # load/refresh all content: 14 daily nodes + walk-only branches (keeps journals)
npm run invite -- "Tester Name"               # prints a personal link: http://localhost:8878/?u=<token>
CONTINUUM_ADMIN_KEY=<secret> npm start        # http://localhost:8878
npm run check                                 # content gate: every node and edge obeys the rules
npm test                                      # API + content-integrity tests (in-memory DB)
```

On Windows PowerShell: `$env:CONTINUUM_ADMIN_KEY="<secret>"; npm start`.

For testers: run `cloudflared tunnel --url http://localhost:8878`, then generate invites with the tunnel URL as the base:
`npm run invite -- "Name" https://<random>.trycloudflare.com`. The tunnel URL changes each run, so tokens outlive links;
if the URL changes, resend `<new-url>/?u=<same token>` (tokens are in the `users` table).

## How it behaves

- **Today's card**: type, title, thinker and a question. Nothing else until you write (the doc's "write before you read").
- **Then**: plain face (one analogy) → tap to flip to the source (translator, edition, full-text link where one exists) →
  neighbour bubbles grouped by edge type. Tapping a bubble opens that node; the walk has no bottom and keeps a breadcrumb trail.
- **Daily pick** (doc's rule): an unwritten neighbour of yesterday's node, preferring ones you haven't already read on a walk;
  else the next unwritten node in the line. Saved per day, so walking can't swap today's card. Missed days skip nothing.
- **Practices** are the floor: one face, never a daily card, reachable from every line node.
- **Often misread**: after you write, the plain face adds one short paragraph naming the common misreading of that idea
  (field `misreading`; written for the 14 daily nodes so far).
- **Did the source change your mind?** Yes / A little / No, asked once per node after reading. The answer steers the
  next step: yes → who extended or tested it; no → who argued against it; a little → who reached the same place from
  another tradition. Counts show up in Review.
- **Type**: Lora (self-hosted, `public/fonts/`), a soft, readable serif, for the brand, headings, questions, idea titles and quotations; body text stays sans. Set `--display` to `var(--serif)` in `style.css` to undo.
- **Illustrations** (daily nodes only): one picture per day. Before writing it sits faded and blurred behind the card's
  title as atmosphere; after writing it appears in full on the plain face. Illustrations show no caption; a real artefact (bust, manuscript)
  shows its credit, as its licence usually requires. Every picture's source stays recorded in `content/images.js`.
  Drop the file in `public/img/nodes/` named by node id and fill in alt text, kind and credit in `content/images.js`;
  `npm run check` reports a missing file, alt text or credit. Illustrate the analogy, not the thinker.
- **Keep this line** (☆ on the source face) saves a favourite; kept lines collect at the top of the Journal.
- **Deeper: Stanford Encyclopedia** link on the source face where an SEP entry exists (`content/analysis_links.js`;
  run `node scripts/check-links.js analysis` with network access to confirm every URL answers).
- **Journal**: each answer is pinned to its node, with its reaction.
- **Timeline**: the 14 featured thinkers in date order, grouped by era, or everyone on the map (163 ideas). Tap an
  entry to open it. Daily cards not yet reached show only thinker and year until their day. Every card has a
  "See on the timeline" link that jumps to it in context.
- **Review**: This week (entries, where walks kept landing, who you kept returning to, reaction tally, "What did you
  believe on Monday that you do not on Sunday?") or Everything (adds day-1 vs last-day bookends). Finishing the line
  offers "See where it led".
- **Retention**: `/admin` shows days opened, days written and walk steps per tester.
- **Testing other days:** add `?day=1` to the app's URL to act as if it were tomorrow (`?day=2`, `?day=2026-11-05`
  also work; `?day=clear` returns to the real date). A dashed banner shows while a test date is set. The server
  trusts the client's date, so this is a test aid, not a control.
- Drafts stay in the browser until submitted. Invite token = only credential: fine for 5 known testers, not the public.

## Layout

| Path | What |
|---|---|
| `db.js` | Schema (`nodes`, `edges` + `users`, `responses`, `events`) and content seeding |
| `app.js` | Express API + static files |
| `server.js` | Entrypoint (port 8878, `CONTINUUM_DB` overrides DB path) |
| `content/line_poc.js` | The 14 line nodes, 4 practices, 21 edges |
| `content/branches/*.js` | Walk-only crossovers, added in batches; see `content/BATCHES.md` for how to add one |
| `content/ROSTER.md` | Who belongs on the map, from college curricula, with priorities |
| `scripts/check-content.js` | Content gate (`npm run check`): ids, types, chronology, notes, paths to a practice |
| `scripts/verify-quotes.js` | Matches every quoted passage against downloaded source texts |
| `scripts/find-convergences.js` | `npm run converge`: proposes unlinked pairs that say the same thing, for a researcher to verify |
| `scripts/check-links.js` | HEAD-checks every `source_url` and `analysis_url` (`node scripts/check-links.js [analysis|source]`) |
| `content/ILLUSTRATION_BRIEFS.md` | The 14 daily analogies as picture briefs, with a research prompt |
| `content/images.js` | Illustration per daily node (file, kind, alt, credit); files in `public/img/nodes/` |
| `content/analysis_links.js` | Stanford Encyclopedia entry per node, merged in by `content/index.js` |
| `content/index.js` | Merges the line and every branch file for seeding |
| `content/SOURCES.md` | **Verification checklist for every source passage — do before testers** |
| `public/` | Vanilla HTML/CSS/ES-module frontend, no build step. `admin.html` = retention view |
| `scripts/` | `seed`, `invite` |

## Schema notes

`nodes` follows the doc's two-face model; added `source_citation`, `source_url`, `field`
(philosophy | science | religion | practice, drives the warm/cool colour coding), `thinker`, `year`, `prompt`,
and `seq` (starter-line order; NULL = never a daily card).
`edges(from_id, to_id, relation, year, note)`: A = `from`, B = `to`, read "B <relation> A", with the doc's types:
`taught | extended | refuted | converged | measured | secularized | lands_on`. `converged` is symmetric.
`journal(user_id, node_id, body, local_date)` per the doc. `daily_pick` pins each day's card.
Seeding refuses a non-thinker node without a source face (doc: not published until both faces exist).

Not in this milestone (doc, later): star map / constellation lenses, illustrations, calendar delivery,
force-directed map view, Postgres.

## API

All `/api/*` calls need header `x-continuum-token`.

- `GET /api/today?date=YYYY-MM-DD` → `{ state: write|done_today|complete, done, total, node }`
- `POST /api/respond { node_id, body, date }` → full node (source + lineage). 409 if not today's node or already wrote today.
- `GET /api/node/:id` → any node in full (today's unwritten card returns `{ today: true }` instead)
- `GET /api/journal` → `{ journal, favorites }`: your entries in order (with `reaction`), and kept lines
- `POST /api/favorite { node_id, on }` → `{ favorite }` (omit `on` or `true` to keep, `false` to let go)
- `POST /api/reaction { node_id, value: changed|somewhat|unchanged, date }` → `{ reaction }`. 409 `write_first` until you have written on that node.
- `GET /api/timeline?date=` → `{ nodes }`: every idea in date order with `state` (written, visited, today, upcoming, unseen); upcoming daily ideas have `title: null`
- `GET /api/review?days=7&date=` (`days=0` = everything) → `{ from, to, days_active, entries, walked, practices, reactions, bookends }`
- `POST /api/event { kind: "flip", node_id, date }`
- `GET /admin/api/stats` (header `x-admin-key`) → per tester: open days, response days, `came_back`
