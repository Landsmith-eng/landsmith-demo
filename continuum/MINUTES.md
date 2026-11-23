# Continuum: minutes

A running record of how Continuum is being built: what changed each working day (major and minor), what was decided and why, what was suggested, and what is still open. Newest day first. For Jon, John, any developer, and Claude in later sessions: search it (`grep -n -i "caching" continuum/MINUTES.md`) before re-deciding something, and add to it at the end of every working day (see `CLAUDE.md`).

Days before 2026-11-19 are reconstructed from the commit history: they record what was built, not the conversations behind it. From 2026-11-19 on, the minutes also carry the conversations, decisions and suggestions.

People: **Jon** (owner; tests on a Motorola Android phone), testers **John**, **Jack**, **Carey**, **Edwin**. Live at https://continuum-2lg4.onrender.com (Render, deploys on every push to branch `ccr-ac104f91-k3jjpu`; about a minute of 502s per deploy). Draft PR #1 in Landsmith-eng/landsmith-demo.

---

## Open items (kept current)

| Item | Owner | Status |
|---|---|---|
| ElevenLabs key lacks **Speech to Text** permission, so voice typing uses the phone's own recogniser (which beeps when it starts). Fix: enable Speech to Text on the key whose value is `ELEVENLABS_API_KEY` in Render, then restart. | Jon | Open since 2026-11-12 |
| Usage governor allowances (Free $1.50, Plus $8, Deep $25 a month of Claude cost) are placeholders: set them from the alpha measurements on the admin page. | Jon + Claude | Open: measuring since 2026-11-21 |
| Set Jon's own plan to **Unlimited** on the admin page before the governor is switched on. | Jon | Open |
| Payments (e.g. Stripe) so an upgrade happens without the owner moving people by hand. | Later, after alpha | Not started |
| Switch the governor from Measuring to On at the end of alpha. | Jon | Waiting on alpha |
| Read `/api/diag/usage` after a few days of use: confirm caching savings and where the money goes; decide whether the map's cache stays at 1 hour. | Claude | Due ~2026-11-24 |
| Anthropic Console monthly spend limit raised from $20 to $50 on 2026-11-20; revisit once real monthly spend is known (set it to about twice that). | Jon | Watch |
| Passage animations: Jon reported "I don't see any effects" on 2026-11-20. Links now say where to look or why nothing moves; waiting for Jon's report from the phone. | Jon | Waiting |

## Standing decisions

- **Answer quality is never traded for cost** (Jon, 2026-11-21). No cheaper model or lower effort to save money; a call runs in full or does not run. Cost is controlled by caching and by per-person plans.
- **Plans and a usage governor** decide how much Claude each person gets; past the allowance Claude rests for that person and a bigger plan is offered. Everything else in the app always works. Measuring only during alpha.
- **Three tabs**: Trainer, Campus, You (2026-11-17). Text, not buttons, wherever it reads naturally.
- **American spelling** in the app's own words and in Continuum's replies (2026-11-17).
- **Sources first**: a passage or reply opens with its source and synopsis (2026-11-06).
- **The reading voice never changes on its own** (no silent fallback to the phone's voice) (2026-11-17).
- **Visitors on the paintings** are subtle and fit the painting: birds, butterflies, bees, leaves, ripples, a far-off sailboat, spiders only in dark woods. No dragonflies, frogs or inchworms.
- **Secrets** (API keys) live only in Render's environment or a local `.env`, never in the repository. Personal sign-in links are private.

---

## 2026-11-23

**Major**
- **Back works like a phone app.** Every screen is a step in the phone's history: Android's back button returns to the screen before, exactly as it was (the same passage on the same painting), and forward works too. Look and Contemplate close first. At the first screen, back says "Press back again to exit"; a second press within three seconds leaves. An accidental "More, please" is undone with back.
- **A back arrow** at the top of a passage, shown whenever there is somewhere to go back to.
- **Recently read** in You: newest first, each passage once with its thinker, when it was read and a few lines; tapping reopens the exact passage on its painting. A search box finds anything read by a loose keyword (any case, plural or "-ing" forms; every word must match the title, thinker, passage, field, room or citation).
- **Icons under each passage**: Play again, Copy, Share, Save, This landed, Not for me. They are small outlines, quiet until touched, and a choice made shows filled in. Copy and Share include the author, the work (citation) and a link, so a saved quote keeps its source. Save uses the existing favourites (shown in You). The thumbs are kept per passage and weigh on which rooms the trainer brings next. Kept lines in You get Copy and Share too.

**Decisions and conversations**
- From testing (Jon): back must not close the app; an in-app back arrow; a navigation stack so an accidental tap can be undone; a "Recently read" list in You, searchable by loose keyword; Claude-style outline action icons under each passage.

**Suggestions / next**
- Talk replies could carry the same icons (copy, share, thumbs); they have Listen and Repeat today.
- A shared link to a passage (`/?story=…`) opens only for someone signed in; a public read-only view of a passage would make Share friendlier.

## 2026-11-21

**Major**
- **Usage governor and plans.** Every call to Claude is counted to the person whose request made it (monthly, in dollars at list price). Plans: Free, Plus, Deep (and Unlimited, owner-assigned). Two modes on the admin page: *Measuring* (default, for alpha: no limits, testers see nothing) and *On* (after alpha: a heads-up under a Talk reply at 80%; past 100% Claude rests for that person with the renewal date and a link to the plans). New **Your plan** screen (shares of the month, never money) with "Ask for Plus/Deep"; requests appear on the admin page, where the owner sets plans. A Talk message that could not be sent goes back in the box.

- **Minutes** (this file), its shared page (`scripts/minutes_page.mjs`), and `CLAUDE.md` asking every session to read and add to it.

**Minor / fixes**
- **Reading aloud follows the word, in gold.** Everywhere a passage, reply, card or page is read aloud, the word being said is traced letter by letter with stardust (as in Contemplate), and the box behind the sentence is gone. The spoken word is kept near the middle of the screen. **Double-tap a word** to start reading from that exact word (Jon, after ElevenLabs' reader: "begin reading on the word tapped… centers the highlighted word and sentence"). With the natural voice it seeks to the word using each letter's timing; the phone's own voice can only start at the sentence.
- **Listen from here** now also comes from choosing words (press and hold, then drag), not only a tap: the button appears just below the chosen words and reads from there. Jon could not find the feature; choosing words had been ignored on purpose (it was kept for "Keep these words", which only applies on an idea's page).

**Decisions and conversations**
- Jon: "I don't want to compromise the quality of the responses. A usage governor for each should spark a need to upgrade their use package (after we complete alpha testing)." This replaced Claude's suggestion to move background jobs to a cheaper model.
- Jon asked for these minutes (this file), for people and for Claude's own searches.

**Suggestions / next**
- Payments after alpha. Set allowances from measured use.

## 2026-11-20

**Major**
- **Prompt caching for Talk.** The map of ideas (~15,000 tokens) is cached for an hour, the conversation is cached as it grows, and the person's part of the instructions is fixed per conversation per day (it used to change after every message and break the cache). Verified live: a repeat request read ~2,000 tokens from the cache. Expected: Talk's input cost down roughly 60 to 75%.
- **Cost meter**: every Claude call tallied by day and kind (tokens, cache reads and writes, dollars): `/api/diag/usage`; `/api/diag/cache` checks caching works.
- **Passage animations** built into the app, each on a painting that fits: fish rises on the drowning-child pond (one wave surface, so crossing rings add and cancel like real water), the Heraclitus river leaf and reflections, Plato's firelight and shadows, Seneca's lamp dimming over 30 seconds then resting, Zhuangzi's butterfly at the margins, the Nagarjuna knot on a table, Epictetus's reeds and gusts, Sisyphus's stone. Every loop renews with new random values (tested over simulated minutes). `?story=<id>` opens a passage directly and now says where to look, or that the phone is set to remove animations.
- **Keep your place**: leaving the app pins the screen, what you were doing there, and any unsent words; back within two hours, you return to it.
- **Passages met before** say so, are not read out again by themselves, show the choices at once, and offer: Hear it again, Straight to my thoughts, Something new. Moving on from the day's idea stops it coming back that day.
- **Listen on every screen** (the corner button), reading what is on the screen in order, lit as it goes; **Listen from here**: tap any words and a button by the tap reads from there.
- **Unfinished** in You: half-written answers kept on the phone, with Pick it up and Discard; sending clears them.

**Minor / fixes**
- Voice typing on Android no longer restarts at every pause (each restart made Android beep); repeated partial results are merged into clean text.
- Ten paintings' water lines corrected (rings were floating in the sky); a style rule had been pinning the new drawings to the screen's corner (fixed); a passage's animation comes back after the app is hidden or the phone turns.

**Decisions and conversations**
- Jon on animations: "randomize the ring centers and move them around like fish nipping the surface"; then sent Perplexity's designs for the river, cave, lamp, butterfly, knot, wind and Sisyphus, and asked that intersecting rings behave realistically and that they "renew well".
- Talk was resting: the Anthropic Console had a **$20 monthly spend limit** (not a credit problem). Jon raised it to $50; verified working.
- Jon asked for prompt caching and how to keep credits from limiting the app.

**Suggestions**
- Budget guard in the app (superseded by the governor). Cheaper model for background jobs (declined: quality first).

## 2026-11-19

**Major**
- **Thoughts** after every passage: one thing to react to (a question, something to try, or a parallel story), skippable, spoken in voice mode.
- **Source links with fallbacks**: Gutenberg, then its mirrors (the book's readable page), Standard Ebooks, the Internet Archive; checked and cached for 15 minutes; failures logged by site only.
- **The honest push**, in plain words, written for each passage.
- `/api/diag/claude` reports Claude's status; Talk says plainly when Claude's monthly allowance is used up.

**Decisions and conversations**
- John: source material must always be linked at the start (a Harvard Study prompt had no way in and no synopsis).
- "What would it cost you to take this seriously?" was too obtuse: replaced by concrete questions.
- Jon asked for a Perplexity prompt to design passage animations.

## 2026-11-17

**Major**
- **Paths**: commit to a practice: a light path (2 weeks), the month, or the long course (12 weeks), built on the seven practices.
- **The Trainer**: true stories from the map one at a time, each over a different painting; the Campus with every door open; three tabs. Invitations built from the user's own trail; dares asked about next time.
- Three words instead of buttons: Thoughts, Talk, More, please. Stories read aloud on request or always; Contemplate for stories.
- Floating, see-through playback controls that fade and come back on a touch.

**Minor / fixes**
- The reading voice never changes on its own; the day's idea no longer repeats; the kept line rotates daily; speech-to-text checks the key at every start and remembers a refusal through restarts.

**Decisions**: American spelling; "the seven practices that have spanned the last 2,500 years" descriptor; sailboats only far off, spiders only in dark woods.

## 2026-11-13

- **Talk**: spoken in, spoken back, the page following the voice; a running summary of every conversation with threads to pick up; back 15 / pause / forward 15; a calm screen with only the two voices.
- **Depth**: Talk goes as deep as the user chooses (ideas, your life, all the way), in a voice they ask for; past conversations come back; their data is theirs (export); help on screen when there are signs of danger.

## 2026-11-12

- Voice input: a key without speech-to-text no longer fails on every first try; plain messages, no restart loops. Choosing ElevenLabs asks the server afresh.

## 2026-11-09

- **The lure**: a cold open, word reactions, a course that moves on, looking back over the road, and nudges (web push).

## 2026-11-06

- **Sources first**: the daily card opens with its synopsis and source; Talk replies open with theirs.

## 2026-11-05

- From a tester's notes: depth in conversation, silence by default, the map through time. Case sessions open by the request's date, not the server clock.

## 2026-11-02

- **The psychology room**: surveys on where you are now; 18 schools of psychology and 32 more ideas; 29 psychotherapies for 28 kinds of problem; psychotherapy programmes alongside the wisdom traditions in working through a problem; find a therapist (live search) with a summary to send them. Names can be corrected by the user or the admin.

## 2026-10-31

- Toward the testers' draft: a distant bird, a truer candle, butterflies and bees on the words; a settled butterfly folds its wings.

## 2026-10-30

- **Work through a problem**: interview, a plan from the map, a course, check-ins. Reader key, kept words, questions back.
- **Visitors on the paintings** (birds, butterflies, bees, hummingbirds, fish under the surface), fitting each painting, fewer and subtler; the living painting; home-screen shortcuts; every page stands on a painting.
- Follow the words as they are read; Stardust (the spoken word's letters glow); default voice **Jon** at the Calm pace; **Contemplate** (the passage over the painting, a line at a time); "Pick up where you left off".
- Admin: stray spaces in the key ignored; invites say why they failed. (Frogs were tried and removed.)

## 2026-10-29

- Brighter look, pinch for text size; comets and real constellations; Supreme Court cases (Mahmoud v. Taylor and four before the Court).
- A spoken tour; the seven great debates as the opening interview; Bearings every seventh day; Weigh an opinion; act on a practice near you.
- Daily review, problems to consider, calendar check-ins; homework sheets and Teach it back, with free college course links (OpenStax, Open Yale, MIT OCW).
- Answer by voice anywhere (ElevenLabs Scribe); the Parthenon (live group discussions with a moderator); the Map of ideas full screen with journeys.
- 18 bright daytime plates; ready for Render (blueprint, lasting disk, nightly backups); invites from the admin page.

## 2026-10-28

- Each concept staged one part per screen with animated motifs; concept-first rooms, an adaptive compass, the daily practice.
- Background paintings for every daily concept, all 16 rooms, the tabs, and spares with meanings (change, patience, return, stillness, daily life).
- **Listen** (part by part), the Voice chooser, natural voices through ElevenLabs, five reading speeds; the Diary of discovery; the walk continues past the first 14 days.
- **Talk**: a conversation with the map's collected wisdom; speaking through pauses; pause, repeat or start a reply anywhere. Key-handling fixes (.env wins; bearer vs x-api-key).

## 2026-10-27

- The convergence-finder; content batches 4 to 8 (the full roster, Ptahhotep to Butler); review, favourites, reactions, misreadings, deeper-analysis links; illustrations and the Lora display font; a clickable timeline that became the gallery of thought; green palette; the map widened to art, culture, law and the news; the first court case (West Virginia v. Barnette, 1943).

## 2026-10-26

- **Continuum MVP web prototype.** Walk-only crossover branches across traditions, science and modern thought; the master roster drawn from college curricula; Wikidata influence links; a content gate with an in-repo quote verifier; batches 2 and 3 (Gilgamesh to Kahneman); owner decisions on the Douglass and Tolstoy nodes.

## 2026-03-12

- Repository created (Landsmith prototype files; Continuum lives in `continuum/`).
