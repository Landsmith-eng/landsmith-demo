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
- **Journal**: each answer is pinned to its node.
- **Retention**: `/admin` shows days opened, days written and walk steps per tester.
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
- `GET /api/journal` → your entries in order
- `POST /api/event { kind: "flip", node_id, date }`
- `GET /admin/api/stats` (header `x-admin-key`) → per tester: open days, response days, `came_back`
