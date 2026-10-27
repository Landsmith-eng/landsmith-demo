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

### Batch 4 (ancient2.js, modern4.js, contemporary.js), 2026-10-27

15 nodes. Quotations matched word for word by the researcher and again by `scripts/verify-quotes.js`.

| Node | Source | Status |
|---|---|---|
| plato_cave | Republic VII 514a–517b, Jowett | Verified (Gutenberg 1497) |
| plotinus_the_one | Enneads VI.9, Guthrie 1918 | Verified (Gutenberg 42930); MacKenna not reachable |
| shantideva_remedy_or_no_remedy | Bodhicaryāvatāra VI.10 | **Summary**: no public-domain English translation reachable (Barnett 1909 not online) |
| patanjali_stilling_the_mind | Yoga Sutras I.2–3, I.12–14, Johnston 1912 | Verified (Gutenberg 2526); Johnston's "Union, spiritual consciousness" rendering, with the literal gloss in the citation |
| dogen_just_sitting | Dōgen as quoted in Nukariya, The Religion of the Samurai (1913) | Verified (Gutenberg 5173); Genjōkōan only paraphrased |
| wollstonecraft_reason_has_no_sex | Vindication, ch. III–IV | Verified (Gutenberg 3420) |
| sor_juana_reply | Respuesta a Sor Filotea, Spanish, Obras selectas 1872 | Verified (Gutenberg 74087); the bracketed English is ours. This edition reads "estudiar para ignorar menos", not the popular "no estudio para saber más" |
| marx_alienated_labor | Communist Manifesto, Moore 1888 | Verified (Gutenberg 61); Capital not reachable, node dated 1848 |
| william_james_habit | Principles of Psychology I, ch. IV and XI | Verified (Gutenberg 57628) |
| jung_the_shadow | Psychology of the Unconscious, Hinkle 1916 | Verified (Gutenberg 65903); "shadow" is a later, in-copyright term, so the title follows the passage |
| wittgenstein_whereof_one_cannot_speak | Tractatus 6.43, 6.52, 6.54, 7, Ogden 1922; German of 7 | Verified (Wikisource page scans; Gutenberg 5740) |
| rawls_veil_of_ignorance | A Theory of Justice (1971) | **Summary** |
| parfit_what_matters | Reasons and Persons (1984), Appendix J | **Summary**; appendix details from secondary literature |
| beauvoir_second_sex | The Second Sex, Parshley 1953 | **Short quotation**: "One is not born, but rather becomes, a woman", confirmed by search against two scholarly sources, not grep-matched against a fetched text |
| seligman_learned_helplessness | Seligman & Maier 1967; Learned Optimism 1991 | **Summary** |

Edge notes verified against texts: Augustine's "books of the Platonists" (Confessions VII.9); Descartes on the senses
deceiving (Discourse IV); Legge's Tao Te Ching ch. 1; Jung naming Freud and quoting James; James's attention line.

Batch 4 claims resting on memory: Hegel → Marx (Capital's afterword, not fetchable); Marx → Sartre; Upanishads →
Patañjali (Katha 2.3.11); Plotinus → Augustine (the "Platonists" identified with Plotinus); Patañjali and Dōgen →
Kabat-Zinn (his own yoga and Zen training); Kierkegaard → Wittgenstein (Drury's recollection); Schopenhauer →
Wittgenstein (von Wright); Wollstonecraft → Beauvoir (no verified mention by name); Beck → Seligman (Learned
Optimism crediting Beck). Dropped as wrongly `converged` (contact existed): Plato's cave ↔ Descartes, Gyges ↔ Rawls.

### Batch 5 (classical2.js, global2.js, convergences1.js), 2026-10-27

15 nodes and a verified pass over the convergence-finder's candidates (9 edges, no nodes).

| Node | Source | Status |
|---|---|---|
| homer_achilles_choice | Iliad IX, Butler | Verified (Gutenberg 2199) |
| sophocles_antigone | Antigone 450–464, Storr 1912 | Verified (Gutenberg 31) |
| machiavelli_fortune_and_virtu | The Prince XXV, Marriott 1908 | Verified (Gutenberg 1232); Marriott reads "adventurous", not "impetuous"; an inline footnote is cut with an ellipsis |
| locke_blank_slate | Essay II.i.2 | Verified (Gutenberg 10615) |
| rousseau_born_free | Social Contract I.1, Cole 1913 | Verified (Gutenberg 46333) |
| adam_smith_impartial_spectator | Theory of Moral Sentiments III, 1777 printing | Verified (Gutenberg 67363); "tribunal within our own breast" rather than the later "man within the breast" |
| leibniz_best_of_all_possible_worlds | Theodicy I §8, Huggard 1951 | Verified (Gutenberg 17147, which Gutenberg hosts as cleared for the US; a thinker node, so the quote is optional) |
| voltaire_cultivate_our_garden | Candide XXX, anonymous 1918 translation | Verified (Gutenberg 19942) |
| tagore_gitanjali | Gitanjali 73, Tagore's own English 1912 | Verified (Gutenberg 7164) |
| singer_drowning_child | "Famine, Affluence, and Morality" (1972) | **Summary** |
| heidegger_being_toward_death | Sein und Zeit §§46–53 | **Summary**; the German was unreachable |
| han_feizi_two_handles | Han Feizi ch. 7 | **Summary**; no public-domain English reachable |
| fanon_wretched_of_the_earth | Black Skin, White Masks; The Wretched of the Earth | **Summary** |
| hooks_all_about_love | All About Love (2000) | **Summary**; Peck's definition paraphrased, not quoted |
| nishitani_religion_and_nothingness | Religion and Nothingness (1961) | **Summary** |

Convergence edges (convergences1.js): Boethius → Brickman and Mill → Brickman `measured`; Nagarjuna ↔ Sartre,
Job ↔ Socrates, Heraclitus ↔ Hume (Hume's "perpetual flux" verified), Averroes ↔ Zera Yacob, Laozi ↔ Schopenhauer
(verified by absence: WWI vol. I never mentions the Tao), Aquinas ↔ Gandhi (verified by absence: Hind Swaraj's
authorities appendix has no Aquinas) `converged`; Buddha → Schopenhauer `extended` (WWI §68 "In Buddhism also…"
verified). Rejected: Avicenna ↔ Du Bois (opposite answers to one question), Seneca ↔ Gilgamesh (vocabulary only),
Gyges → King (the King summary does not support it).

Edge notes verified against texts in this batch: Apology on Achilles; Hume's footnote on Locke; Rousseau naming
Locke and Hobbes (Discourse on Inequality); Wollstonecraft on Rousseau; Smith quoting Epictetus; the Theodicy naming
Spinoza and citing Job; Candide on Leibniz. Claims resting on memory: Rousseau → Kant ("set me right", unpublished
notes); Hume → Smith (TMS never names Hume); Smith → Marx; Kierkegaard and Tolstoy → Heidegger (footnotes in §40,
§51); Upanishads → Tagore; Dōgen → Nishitani; King → hooks; Gandhi → Tagore `refuted` (the 1921 exchange in
Modern Review and Young India). Dropped: Epicurus ↔ Voltaire `converged` (Voltaire knew Epicurus through Lucretius).

### Batch 6 (ancient3.js, global3.js, science2.js), 2026-10-27

20 nodes.

| Node | Source | Status |
|---|---|---|
| sappho_fragment_31 | Wharton, Sappho (1885; 1908 printing), literal prose of fr. 31 | Verified (Gutenberg 57390) |
| diogenes_the_cynic | Diogenes Laërtius VI.23, 38, 41, 56, Hicks | Verified (Wikisource Book VI); the transcription reads "Metron" for Hicks's "Metroön", so that word is cut |
| anselm_ontological_argument | Proslogion 1–2, Webb 1903 | Verified (Wikisource); broken words in the transcription rejoined |
| dante_midway | Inferno I.1–12, Longfellow | Verified (Gutenberg 1001) |
| ptahhotep_maxims | Gunn 1906, maxims 1–2 | Verified (Gutenberg 30508) |
| ibn_khaldun_asabiyyah | Muqaddimah | **Summary**: Rosenthal 1958 in copyright |
| shankara_rope_and_snake | Brahma-Sutra commentary I.4.6, Thibaut 1890 | Verified (Gutenberg 16295) |
| mozi_impartial_care | Mozi chs. 14–16 | **Summary**: Mei 1929 not reachable; Mencius's attack on Mozi (3B.9) verified for the edge |
| wang_yangming_unity_of_knowing_and_acting | Chuanxilu | **Summary**: Henke 1916 not reachable; Mencius VII.A.15 verified for the edge |
| las_casas_valladolid | MacNutt, Bartholomew de Las Casas (1909), ch. XX | Verified (Gutenberg 23466); a bracketed label separates Sepúlveda's heads from Las Casas's reply |
| kimmerer_braiding_sweetgrass | Braiding Sweetgrass (2013) | **Summary** |
| dostoevsky_grand_inquisitor | Brothers Karamazov V.5, Garnett 1912 | Verified (Gutenberg 28054); Nietzsche on Dostoevsky verified (Twilight §45) |
| galileo_two_books | Letter to the Grand Duchess Christina | **Summary**: Salusbury 1661 only as unproofed OCR; Drake in copyright. Typed `concept` |
| newton_general_scholium | Principia, Motte 1729 (1846 ed.) | Verified (Gutenberg 76404); Newton names Galileo, verified for the edge |
| kuhn_paradigm_shift, popper_falsification, skinner_beyond_freedom, maslow_hierarchy, baldwin_fire_next_time | | **Summaries** |
| woolf_room_of_ones_own | A Room of One's Own, Hogarth 1929 | Verified (Wikisource); Wollstonecraft is not named, so that edge is `converged` |

Batch 6 claims resting on memory: Averroes → Ibn Khaldun (shared tradition only); Boethius → Dante (Convivio II.xii);
Shankara → Schrödinger (via German Vedanta scholarship); Dostoevsky → Sartre (the 1946 lecture); Aquinas → Las
Casas (Thomist argument at Valladolid); Haudenosaunee → Kimmerer; Maslow ↔ Frankl (the 1966 exchange); Newton →
Einstein; Woolf → Beauvoir; Baldwin → hooks; Du Bois → Baldwin; Locke → Skinner.

### Batch 7 (classical3.js, global4.js, modern5.js), 2026-10-27

20 nodes. Two researchers were cut off by a usage limit after writing their files; the files were verified
by `scripts/verify-quotes.js` against their downloaded texts and the researchers sent their reports afterwards.

| Node | Source | Status |
|---|---|---|
| herodotus_call_no_man_happy | Histories I.32, Macaulay 1890 | Verified (Gutenberg 2707) |
| euclid_proof | Elements I, Postulates 1–5 and Prop. 47, Heath 1908 | Verified (Perseus) |
| petrarch_mont_ventoux | Ascent of Mont Ventoux, Robinson 1898 | Verified (Gutenberg 48776) |
| berkeley_esse_est_percipi | Principles I §3 | Verified (Gutenberg 4723); an inline editor's note is cut with an ellipsis |
| milton_mind_is_its_own_place | Paradise Lost I.249–258, 1667 spelling | Verified (Gutenberg 20) |
| tocqueville_individualism | Democracy in America II, Reeve | Verified (Gutenberg 816) |
| mahabharata_yaksha_questions | Vana Parva CCCXII, Ganguli | Verified (Gutenberg 12333) |
| ramanuja_qualified_nondualism | Sri Bhashya I.1.1, Thibaut 1904 | Verified (Gutenberg 7297) |
| deloria_god_is_red, freire_pedagogy_of_the_oppressed, senghor_negritude, wiredu_conceptual_decolonization | | **Summaries** (in copyright) |
| mariategui_seven_essays | Siete ensayos (1928) | **Summary**: es.wikisource blocked; no Gutenberg text |
| russell_value_of_philosophy | Problems of Philosophy ch. XV | Verified (Gutenberg 5827) |
| peirce_how_to_make_our_ideas_clear | "How to Make Our Ideas Clear" (1878), in Chance, Love, and Logic | Verified (Gutenberg 65274); James crediting Peirce verified (Gutenberg 5116) |
| pavlov_conditioned_reflex | Conditioned Reflexes (1927) | **Summary**: no text reachable |
| rogers_unconditional_positive_regard, merleau_ponty_body_subject, nussbaum_capabilities, foucault_discipline | | **Summaries** (in copyright) |

Edge notes verified: Aristotle on Solon (NE I.10, Chase); Descartes on the geometers (Discourse II); Spinoza's
"geometrically"; Hume naming Berkeley; Berkeley quoting Locke; Montaigne quoting Petrarch; Hume named in Russell;
Ramanuja's "that art thou" reading. Claims resting on memory: Euclid → Newton (axiomatic form); Petrarch → Montaigne
(essay locations); Tocqueville → Harvard Study; Freire citing Hegel and Fanon; hooks on Freire; Du Bois → Senghor
(least sure); Fanon on Sartre; Wiredu on Mbiti; Skinner citing Pavlov; James's 1898 lecture; Merleau-Ponty's preface;
Nussbaum on Aristotle and Rawls; Foucault on Nietzsche; the "no contact" claims in the converged edges.

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
