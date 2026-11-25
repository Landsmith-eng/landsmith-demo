# Continuum: notes for Claude

## Minutes

`MINUTES.md` is the project's running record: what changed each working day, what was decided and why, suggestions, and open items. Newest day first.

- **Before starting work**: read the "Open items" and "Standing decisions" sections, and search the file for the topic at hand (`grep -n -i "<topic>" continuum/MINUTES.md`) before re-deciding or rebuilding something.
- **At the end of each working day** (or before the last push of a session): add or extend that day's entry at the top of the day list, under these headings as they apply: **Major**, **Minor / fixes**, **Decisions and conversations** (what Jon or a tester asked for, in their words where it matters, and what was decided), **Suggestions / next**. Update the Open items table and Standing decisions. Commit it with the day's last change.
- **The shared page**: after updating the minutes, rebuild the page and republish it to the same link:
  `node scripts/minutes_page.mjs <scratch>/minutes.html`, then publish that file with the Artifact tool, passing
  `url: https://claude.ai/artifact/YFnFobJqTRMMBoWpJh4Zny` (read it first from a new conversation). The page is private to Jon
  until he shares it from its Share menu.
- Keep entries short and plain. Never put keys, personal sign-in links, email addresses or anyone's private content in the minutes.

## Standing rules (see MINUTES.md for the reasons)

- Answer quality is never traded for cost: no cheaper model or lower effort to save money. Cost is managed with prompt caching and the per-person usage governor.
- Keys live only in Render's environment or a local `.env`.
- Run `npm test` (in `continuum/`) before pushing; Render deploys every push, so batch pushes.
