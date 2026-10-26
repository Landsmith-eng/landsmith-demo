# Source verification checklist

All 14 daily nodes are now either verified or labelled in-copyright summaries. Checked on 2026-10-26 by downloading each text and matching the passage word for word.
"Verified" means the passage in `line_poc.js` matches the text at the source link exactly
(an ellipsis marks each cut).

| # | Node | Source used | Status |
|---|---|---|---|
| 1 | democritus_atoms_and_void | **Hicks 1925, D.L. IX.44–45** (was the Greek DK 68 B9 from memory) | Verified (Wikisource) |
| 2 | epicurus_absence_of_pain | Hicks 1925, D.L. X.131, X.125 | Verified (Wikisource) |
| 3 | lucretius_death_nothing_to_us | **Leonard 1916** (was Munro; Munro not reachable) | Verified (Gutenberg 785) |
| 4 | zeno_live_according_to_nature | Hicks 1925, D.L. VII.87 | Verified (Wikisource) |
| 5 | epictetus_up_to_us | **Higginson 1865** (was Long; Long's wording was from memory) | Verified (Gutenberg 45109) |
| 6 | seneca_evening_review | **Stewart 1900** (was Basore; Basore not reachable) | Verified (Wikisource "Of Anger/Book III") |
| 7 | buddha_craving_root_of_suffering | **Dhammapada XXIV "Thirst" 334–336, Müller 1881** (was Rhys Davids sutta; not reachable) | Verified (Gutenberg 2017) |
| 8 | marcus_pain_is_your_estimate | Long 1862, VIII.47 | Verified (Gutenberg 15877); fixed "judgement" to "judgment" |
| 9 | spinoza_freedom_understanding_necessity | Elwes 1883, Ethics V P6 | Verified (Gutenberg 3800) |
| 10 | schopenhauer_will_source_of_suffering | Haldane & Kemp 1883, §38 | Verified (Gutenberg 38427) |
| 11 | nietzsche_amor_fati | Ludovici 1911, Ecce Homo "Clever" §10; German Götzen-Dämmerung §12 | Verified (Gutenberg 52190, 7203). The lead-in "My formula for greatness in man is" is left out because the Gutenberg transcription reads "is! amor fati" (a stray mark; Wikisource was unreachable to compare). The English rendering of the German line now sits in the citation, not the quote |
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

### Batch 2 (ancient.js, east.js, modern2.js), 2026-10-26

15 nodes plus the seventh practice (Care for the body). Every quotation matched word for word by the researcher
and again by `scripts/verify-quotes.js`.

| Node | Source | Status |
|---|---|---|
| heraclitus_same_river | Burnet, Early Greek Philosophy 2nd ed. 1908, frs. 41–42, 81 + his rendering of Cratylus 402a | Verified (Gutenberg 67097) |
| plato_ring_of_gyges | Republic II 359d–360d, Jowett | Verified (Gutenberg 1497) |
| pyrrho_suspend_judgment | Diogenes Laërtius IX.61, IX.107, Hicks | Verified (Wikisource Book IX) |
| job_why_the_righteous_suffer | Job 1:21, 38:4, KJV | Verified (Gutenberg 10) |
| augustine_restless_heart | Confessions I.1, VIII.7, Pusey | Verified (Gutenberg 3296). Pusey reads "chastity and continency, only not yet", not the popular "but not yet" |
| boethius_wheel_of_fortune | Consolation II pr. 2 and 4, H. R. James 1897 | Verified (Gutenberg 14328) |
| avicenna_floating_man | Kitab al-Shifa, al-Nafs I.1 | **Summary**: no public-domain English translation of the passage exists (Gutenberg 58186 lacks it) |
| rumi_reed_flute | Mesnevi Book I proem, Redhouse 1881 | Verified (Gutenberg 61724) |
| mencius_child_at_the_well | Mencius 2A.6, Legge | Verified (Wikisource, Chinese Classics vol. II) |
| zhuangzi_butterfly_dream | Chuang Tzŭ ch. II, Giles 1889 | Verified (Gutenberg 59709) |
| kant_ends_not_means | Groundwork, Second Section, Abbott | Verified (Gutenberg 5682) |
| mill_ask_whether_you_are_happy | Autobiography ch. V | Verified (Gutenberg 10378) |
| thoreau_live_deliberately | Walden, "Where I Lived" and "Higher Laws" | Verified (Gutenberg 205) |
| douglass_learning_to_read | Narrative ch. VI | Verified (Gutenberg 23). Quotes Auld's speech as printed in 1845, slur included; the citation says so. Owner's decision: keep it verbatim |
| tolstoy_a_confession | A Confession ch. IV, Maude | Verified (Wikisource). Stands in for The Death of Ivan Ilyich (no public-domain English translation is reachable); owner approved. The 1921 World's Classics date is from memory |

Edge notes verified against texts in this batch: Nietzsche on Heraclitus (Twilight, Ecce Homo); Epicurus PD 34–35;
Epicurus admired Pyrrho (D.L. IX.64); Montaigne on Pyrrho (Apology for Raymond Sebond); Pascal citing Augustine;
Schopenhauer quoting Augustine (WWI §24); Boethius naming Seneca; al-Ghazali naming Avicenna; Descartes's dream doubt;
Kant's "dogmatic slumber" (Prolegomena); Nietzsche on Kant (Antichrist §11); Mill naming Epicurus (Utilitarianism ch. II);
Thoreau on the "Bhagvat Geeta" (Walden); Tolstoy quoting Schopenhauer and telling the Buddha's story (A Confession ch. VI).

Batch 2 claims resting on memory, not a fetched text: al-Ghazali → Rumi (standard schooling; relation kept `extended`),
Aristotle → Avicenna ("read the Metaphysics forty times", from Avicenna's autobiography), Augustine → Boethius
(De Trinitate preface), Zengzi → Mencius (the traditional Zisi line). Job → Boethius is `converged` because the
Consolation never quotes Job.

### Batch 3 (medieval2.js, global.js, modern3.js), 2026-10-26

18 nodes. Quotations matched word for word by the researcher and again by `scripts/verify-quotes.js`.

| Node | Source | Status |
|---|---|---|
| gilgamesh_siduri_seize_the_day | Jastrow & Clay, Old Babylonian Gilgamesh (1920), Siduri's speech | Verified (Gutenberg 11000) |
| aquinas_unjust_law_is_no_law | Summa I-II q.96 a.4, q.95 a.2, Dominican Fathers | Verified (Gutenberg 17897) |
| averroes_decisive_treatise | Jamil-ur-Rehman 1921, Decisive Discourse | Verified (Gutenberg 65708) |
| maimonides_middle_path | Guide for the Perplexed II.39, III.8, Friedländer | Verified (Gutenberg 73584). The Eight Chapters (Gorfinkle) were not reachable |
| zera_yacob_hatata | Hatata (1667) | **Summary**: English translations (Sumner, Kiros) in copyright |
| ubuntu_person_through_persons | Nguni proverb; Mbiti 1969 cited | **Summary**: Mbiti in copyright; no reliable fetchable source for the proverb |
| haudenosaunee_seventh_generation | Parker, Constitution of the Five Nations (1916) §28 | **Summary, labelled "public-domain text not checked"**: archive.org download blocked; check the wording |
| nagarjuna_emptiness | Suzuki, Outlines of Mahayana Buddhism (1908), MMK ch. 9 and the Eight No's | Verified (Gutenberg 75283) |
| xunzi_human_nature_is_bad | Xunzi ch. 23 | **Summary**: Dubs 1928 not reachable; Hutton 2014 in copyright |
| gandhi_satyagraha | Hind Swaraj ch. XVII, Gandhi's own English (1922 ed.) | Verified (Gutenberg 40461) |
| hobbes_state_of_nature | Leviathan ch. XIII, 1651 spelling | Verified (Gutenberg 3207) |
| hegel_master_and_slave | Phänomenologie des Geistes IV.A, German | Verified German (Gutenberg 6698); the bracketed English is our rendering, Baillie 1910 unreachable |
| goethe_faust_striving | Faust I, Bayard Taylor 1870; German wager line | Verified (Gutenberg 14591, 2229) |
| du_bois_double_consciousness | Souls of Black Folk ch. I | Verified (Gutenberg 408) |
| king_letter_from_birmingham_jail | Letter from Birmingham Jail (1963) | **Summary**: in copyright; no sentence quoted |
| arendt_banality_of_evil | Eichmann in Jerusalem (1963) | **Summary** |
| milgram_obedience | Milgram 1963, JASP 67 | **Summary**; figures checked against the abstract via search only |
| kahneman_peak_end | Redelmeier & Kahneman 1996, Pain 66 | **Summary**; sample size and interval deliberately omitted |

Edge notes verified against texts: Aquinas quoting Augustine and "the Philosopher"; Aquinas on "his Commentator"
and "Rabbi Moses"; Averroes naming al-Ghazali; Jastrow's own footnote on Ecclesiastes 9; Hobbes on Aristotle
(Leviathan XV); Kierkegaard on Hegel (Fear and Trembling preface); Schopenhauer on Goethe's colours; Nietzsche on
Goethe (Twilight §49); Du Bois naming Douglass; Hind Swaraj's appendix listing Tolstoy and Thoreau and its Gita mention.

Batch 3 claims resting on memory: Hobbes → Spinoza (Letter 50); Hegel → Sartre (via Kojève); Socrates, Thoreau and
Gandhi → King (the Letter was not fetchable); Socrates and Augustine → Arendt; Arendt → Milgram's "more than he
expected"; Mencius → Xunzi (ch. 23 names Mencius); Aristotle → Maimonides on the mean; al-Ghazali's Incoherence of
the Incoherence as Averroes's reply. Dropped as too loose: Plato's Gyges → Milgram `measured`, Seventh Generation ↔
Kant `converged`.

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
