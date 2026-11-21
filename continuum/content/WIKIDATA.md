# Wikidata influence links: what they're good for

Pulled 2026-10-26 from the Wikidata Query Service. Two properties were used: P737 "influenced by" and
P1066 "student of". The query covered every thinker in the graph plus the people in `ROSTER.md`
(118 people, each Wikidata ID checked by hand; several automatic matches were wrong, e.g. "Homer"
first matched a painter). Raw result: `wikidata_influence_links.json` (190 links).

Treat these as **suggestions to check, never as content**. Wikidata's influence lists are crowd-edited, and some
entries are wrong: it lists "Epicurus influenced Aristotle", but Aristotle was 43 when Epicurus was born.

## What it showed

- **12 of our edges are confirmed** by Wikidata (e.g. Spinoza → Einstein, Socrates → Zeno, Freud → Frankl).
- **It cannot see Continuum's main idea.** Most of our cross-tradition links are `converged` (the same idea with
  no contact: the Buddha and Epicurus, Laozi and Epicurus, al-Ghazali and Descartes, the Qur'an and Epictetus).
  "Influenced by" can't record those. It also has almost no links for Rumi, Mencius, Zhuangzi
  (one link), Ubuntu or the Indigenous thinkers. So it's useful for the European lineage and nearly empty elsewhere.
- **22 links between people already in the graph are missing from our edges.** Two were verified against texts and
  added: Epictetus → Pascal (Pensées) and Montaigne → Nietzsche (Schopenhauer as Educator). The rest were
  wrong (Epicurus → Aristotle), trivial (Socrates → Aristotle), too vague to attach to a specific idea node
  (Democritus → Spinoza), or not verifiable here (Nietzsche's 1881 "precursor" postcard about Spinoza).

## Roster names with the most links into the current graph

| Links | Name | Into |
|---|---|---|
| 8 | Plato | Socrates, Aristotle, Descartes, Spinoza, Schopenhauer, Nietzsche |
| 7 | Kant | Descartes, Spinoza, Hume, Montaigne, Schopenhauer, Nietzsche, Kierkegaard |
| 6 | Hegel | Aristotle, Descartes, Spinoza, Kierkegaard, Nietzsche, Sartre |
| 4 | Goethe | Spinoza, Schopenhauer, Darwin, Nietzsche |
| 3 | Averroes, Aquinas | al-Ghazali, Aristotle, Spinoza / Descartes |
| 3 | Tolstoy | Aristotle, Schopenhauer, the Buddha |
| 3 | Dostoevsky, Arendt, Newton, Locke | |

Plato, Kant and Tolstoy are already in the proposed next batch. Hegel, Goethe, Aquinas and Averroes would be the
best-connected additions after it. For the non-Western half of the map, use the roster's own crossover column, not
Wikidata.
