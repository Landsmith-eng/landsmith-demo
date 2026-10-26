# Source verification checklist

Checked on 2026-10-26 by downloading each text and matching the passage word for word.
"Verified" means the passage in `line_poc.js` matches the text at the source link exactly
(an ellipsis marks each cut).

| # | Node | Source used | Status |
|---|---|---|---|
| 1 | democritus_atoms_and_void | DK 68 B9 (Greek) + own literal English | **Unverified**: no reachable PD source for the Greek; check against Diels-Kranz |
| 2 | epicurus_absence_of_pain | Hicks 1925, D.L. X.131, X.125 | Verified (Wikisource) |
| 3 | lucretius_death_nothing_to_us | **Leonard 1916** (was Munro; Munro not reachable) | Verified (Gutenberg 785) |
| 4 | zeno_live_according_to_nature | Hicks 1925, D.L. VII.87 | Verified (Wikisource) |
| 5 | epictetus_up_to_us | **Higginson 1865** (was Long; Long's wording was from memory) | Verified (Gutenberg 45109) |
| 6 | seneca_evening_review | **Stewart 1900** (was Basore; Basore not reachable) | Verified (Wikisource "Of Anger/Book III") |
| 7 | buddha_craving_root_of_suffering | **Dhammapada XXIV "Thirst" 334–336, Müller 1881** (was Rhys Davids sutta; not reachable) | Verified (Gutenberg 2017) |
| 8 | marcus_pain_is_your_estimate | Long 1862, VIII.47 | Verified (Gutenberg 15877); fixed "judgement" to "judgment" |
| 9 | spinoza_freedom_understanding_necessity | Elwes 1883, Ethics V P6 | Verified (Gutenberg 3800) |
| 10 | schopenhauer_will_source_of_suffering | Haldane & Kemp 1883, §38 | Verified (Gutenberg 38427) |
| 11 | nietzsche_amor_fati | Ludovici 1911, Ecce Homo "Clever" §10; German Götzen-Dämmerung §12 | Verified (Gutenberg 52190, 7203); fixed "in a man" to "in man" |
| 12 | beck_cognitive_therapy_stoicism_tested | Beck et al. 1979, p. 8 (one sentence) | **Unverified**: in copyright; check a copy |
| 13 | frankl_mans_search_for_meaning | Frankl (one sentence) | **Unverified**: in copyright; check a copy |
| 14 | nozick_experience_machine | Nozick 1974 (one sentence + summary) | **Unverified**: in copyright; check a copy |

## Branch nodes (walk-only, content/branches/)

32 nodes outside the daily line, reached by walking. Every quoted passage below was matched word for word
against a downloaded public-domain text (independent re-check script, 2026-10-26).
The only changes are dropped footnote markers and inline verse numbers.

| File | Verified quotations | Labelled summaries (in copyright; check before testers) |
|---|---|---|
| traditions.js | Bhagavad Gita (Arnold 1885), Chandogya Upanishad VI.13 (Müller 1879), al-Ghazali (Field 1909), Analects I.4 (Legge), Tao Te Ching 46 (Legge 1891), Ecclesiastes 9 & Matthew 6 (KJV), Ohiyesa (Eastman 1911), Qur'an 13:11 & 2:286 (Pickthall 1930) | Dalai Lama, *Beyond Religion* |
| science.js | Aristotle NE VIII (Chase), Darwin, Origin closing (1859), Freud, Beyond the Pleasure Principle (Hubback 1922) | Harvard Study of Adult Development, Brickman lottery study, Kabat-Zinn MBSR, Einstein, Schrödinger |
| modern.js | Plato, Apology 38a (Jowett), Montaigne I.19 (Cotton/Hazlitt), Descartes, Discourse IV (Veitch), Pascal, Pensées 139, Hume, Treatise I.4.6, Kierkegaard, Fear and Trembling (Hollander 1923) | Sartre, Camus |

Edge claims flagged by the researchers as resting on memory rather than a fetched text (check these):
Upanishads → Schrödinger (What Is Life? epilogue), Schopenhauer → Schrödinger and → Einstein,
Kierkegaard → Sartre ("anguish of Abraham"), Nietzsche → Camus and Kierkegaard → Camus ("philosophical suicide"),
the Einstein cable date (NYT, 25 April 1929), and the Brickman and Harvard Study figures in their summaries.
Pascal's translator (Trotter) is cited from knowledge; the Gutenberg file doesn't name it.

## Edges changed from the concept doc (Jack to confirm)

The doc's line table had three edges that cannot be right as written:

- **"Lucretius refuted → Zeno"**: Zeno died about 200 years before Lucretius wrote, so Zeno can't have argued
  against him. Changed to **Epicurus → Zeno, refuted**: they were contemporary rivals in Athens, and the Stoics
  held that virtue, not pleasure, is the only good.
- **"Zeno taught → Epictetus"**: about 400 years apart. "Taught" means directly, so this is changed to **extended**.
- **"Epictetus extended → Seneca"**: Seneca died around 65 CE, when Epictetus was a boy. Changed to
  **Zeno → Seneca, extended**.
- **Kept but weak:** "Seneca extended → Marcus". They belong to the same school and share the habit of
  addressing themselves daily, but Marcus never names Seneca. The edge note says so.

Additions so every node reaches a practice: Epictetus → Control your response, Lucretius → Keep death in view,
Seneca → **Examine yourself daily** (a 4th practice; the doc lists it as the practice example),
Epictetus → Beck measured.
Edge-note claims to check: Meditations I.7 (Rusticus and Epictetus); Beck naming Marcus Aurelius;
Schopenhauer's "can do what he wills, but cannot will what he wills" (Prize Essay on Freedom of the Will, 1839).
