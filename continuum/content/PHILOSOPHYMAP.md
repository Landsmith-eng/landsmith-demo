# What the Philosophy Map (thephilosophymap.com) adds

Checked 2026-10-26 from the public repo `aslakey/thephilosophymap` (the site itself is blocked from the build
environment). It is one person's map of **107 philosophers**, each with a short `CoreTeachings` summary, historical
context, key works, tags, and `InfluencedBy` / `Influenced` relations (257 pairs). The repo has no licence file, so
its text is all rights reserved: use its **names, relations and structure** as suggestions, never its prose.

## Three ideas worth borrowing

1. **Two layouts from two signals.** Its *Influence* map places thinkers by the influence graph (node2vec, then 2-D).
   Its *Semantic* map embeds each thinker's teaching summary and places them by similarity of ideas. Thinkers who sit
   close on the semantic map but far on the influence map are exactly Continuum's `converged` edges: same idea, no
   contact. We could run the same trick on our plain faces to **propose** cross-tradition convergences for a
   researcher to verify. That would be the first tool that finds the links Wikidata can't see (`WIKIDATA.md`).
2. **Dimensions, not one field.** It tags every thinker on eight axes: era, region, civilization, primary topic,
   epistemological stance, metaphysical stance, ethical orientation, political orientation. Our nodes carry one
   `field` (philosophy | science | religion | practice). For the star map in the concept doc, an `era` and a
   `tradition` (Stoic, Confucian, Sufi…) per node would be the minimum; a `question` axis (what is real / how do we
   know / how to live / how to live together) would make the "overlap lens" possible.
3. **A listen-out per thinker.** It links each philosopher to the matching *Philosophize This!* podcast episode.
   Cheap to add to a source face next to "Read the full text".

## Name cross-check against our graph and roster

Of its 107: about 40 are already nodes in Continuum, about 20 more are on `ROSTER.md`, and about 45 are on neither.
The 45 cluster in three groups, now added to the roster under "From the Philosophy Map":

- **Twentieth-century Western philosophy** (the biggest gap on our map): Leibniz, Peirce, Russell, Husserl,
  Heidegger, Merleau-Ponty, Popper, Adorno, Foucault, Derrida, Rawls, Parfit, Singer, Nussbaum, Nagel, MacIntyre,
  Charles Taylor, Judith Butler.
- **Indian and Chinese schools** we skipped: Patañjali (Yoga Sutras), Śāntideva, Dignāga and Dharmakīrti,
  Rāmānuja, Han Feizi.
- **The global twentieth century**: Fanon, Senghor, Nkrumah, Mariátegui, Octavio Paz, Keiji Nishitani, bell hooks.

What it lacks that we have: scripture and practice (Job, Ecclesiastes, Matthew, the Qur'an, the Gita), the
scientists and psychologists (Darwin, Freud, Beck, Milgram, Kahneman), Indigenous thought, and the seven practices.
That gap is the product.

## Its influence pairs between thinkers we already have

48 of its 257 pairs join two thinkers already on our map; 21 are already edges. The other 27 are listed in
`philosophymap_pairs.txt` as suggestions. None was added without a text: several are loose (Aristotle → Epicurus,
Hume → Nozick), a few are good leads (Kant → Nozick's side-constraints, Nāgārjuna → Schopenhauer via his Buddhist
reading, Zeno → Marcus, Plato → Boethius) and worth a verified note in a later batch.
