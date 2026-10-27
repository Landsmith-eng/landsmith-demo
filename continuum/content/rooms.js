// The gallery's rooms: wings of a museum of thought. Most are a region or tradition; a few are an era or a theme.
// Every idea node belongs to exactly one room (`npm run check` enforces it). A new branch node needs a line here.
export const rooms = [
  { id: 'near_east', name: 'The ancient Near East and the Bible', blurb: 'The oldest voices on the map: advice from an Egyptian vizier, a Babylonian tavern-keeper, and the books that argued with God.' },
  { id: 'greece_rome', name: 'Greece and Rome', blurb: 'From Homer to the Stoic emperor: the questions about the good life that the West kept asking for two thousand years.' },
  { id: 'india', name: 'India and the Buddhist world', blurb: 'Self, suffering and release, from the Upanishads and the Buddha to Gandhi and the Dalai Lama.' },
  { id: 'east_asia', name: 'China and Japan', blurb: 'Confucians, Daoists, Mohists and Legalists arguing over human nature, then Zen sitting with it.' },
  { id: 'medieval', name: 'Faith and reason', blurb: 'Christian, Jewish and Muslim thinkers asking how revelation and philosophy fit together, from Augustine to Ibn Khaldun.' },
  { id: 'early_modern', name: 'Renaissance and Enlightenment', blurb: 'Doubt, method, the social contract and the rights of the individual, from Machiavelli to Kant.' },
  { id: 'nineteenth', name: 'The 1800s', blurb: 'History, will, faith and revolution: the century that unsettled every certainty.' },
  { id: 'twentieth', name: 'The 1900s and after', blurb: 'Existence, language, justice and the self, from Russell and Heidegger to Rawls and Nussbaum.' },
  { id: 'africa', name: 'Africa and the diaspora', blurb: 'Reason, freedom and personhood, from an Ethiopian cave to Birmingham jail and the idea of Ubuntu.' },
  { id: 'americas', name: 'The Americas', blurb: 'Indigenous philosophy and Latin American thought: the seventh generation, conquest, and what the land teaches.' },
  { id: 'science', name: 'How we came to know the world', blurb: 'Proof, observation and revolution in science, from Euclid to Kuhn.' },
  { id: 'mind', name: 'The study of the mind', blurb: 'Psychology puts the old questions to the test: habit, meaning, happiness and how we fool ourselves.' },
];

const R = {
  near_east: ['ptahhotep_maxims', 'gilgamesh_siduri_seize_the_day', 'job_why_the_righteous_suffer', 'ecclesiastes_no_work_in_the_grave', 'jesus_no_thought_for_the_morrow'],
  greece_rome: ['homer_achilles_choice', 'sappho_fragment_31', 'heraclitus_same_river', 'sophocles_antigone', 'herodotus_call_no_man_happy',
    'democritus_atoms_and_void', 'thucydides_melian_dialogue', 'socrates_unexamined_life', 'plato_ring_of_gyges', 'plato_cave',
    'diogenes_the_cynic', 'aristotle_friendship', 'pyrrho_suspend_judgment', 'epicurus_absence_of_pain', 'zeno_live_according_to_nature',
    'lucretius_death_nothing_to_us', 'seneca_evening_review', 'plutarch_lives_parallel', 'epictetus_up_to_us',
    'marcus_pain_is_your_estimate', 'plotinus_the_one'],
  india: ['upanishads_tat_tvam_asi', 'buddha_craving_root_of_suffering', 'mahabharata_yaksha_questions', 'gita_act_without_attachment_to_fruits',
    'nagarjuna_emptiness', 'patanjali_stilling_the_mind', 'kalidasa_shakuntala', 'dignaga_perception_and_inference',
    'shantideva_remedy_or_no_remedy', 'shankara_rope_and_snake', 'ramanuja_qualified_nondualism', 'gandhi_satyagraha',
    'tagore_gitanjali', 'dalai_lama_ethics_beyond_religion'],
  east_asia: ['zengzi_three_daily_examinations', 'mozi_impartial_care', 'laozi_sufficiency_of_contentment', 'mencius_child_at_the_well',
    'zhuangzi_butterfly_dream', 'xunzi_human_nature_is_bad', 'han_feizi_two_handles', 'dogen_just_sitting',
    'wang_yangming_unity_of_knowing_and_acting', 'nishitani_religion_and_nothingness'],
  medieval: ['augustine_restless_heart', 'boethius_wheel_of_fortune', 'quran_change_what_is_in_hearts', 'avicenna_floating_man',
    'anselm_ontological_argument', 'ghazali_crisis_of_doubt', 'maimonides_middle_path', 'averroes_decisive_treatise',
    'rumi_reed_flute', 'aquinas_unjust_law_is_no_law', 'dante_midway', 'petrarch_mont_ventoux', 'ibn_khaldun_asabiyyah',
    'chaucer_pardoners_tale'],
  early_modern: ['machiavelli_fortune_and_virtu', 'montaigne_to_philosophize_is_to_learn_to_die', 'descartes_i_think_therefore_i_am',
    'hobbes_state_of_nature', 'milton_mind_is_its_own_place', 'pascal_sit_quietly_in_a_room', 'spinoza_freedom_understanding_necessity',
    'locke_blank_slate', 'leibniz_best_of_all_possible_worlds', 'berkeley_esse_est_percipi', 'hume_bundle_of_perceptions',
    'adam_smith_impartial_spectator', 'voltaire_cultivate_our_garden', 'rousseau_born_free', 'kant_ends_not_means',
    'burke_little_platoon', 'wollstonecraft_reason_has_no_sex'],
  nineteenth: ['hegel_master_and_slave', 'goethe_faust_striving', 'schopenhauer_will_source_of_suffering', 'tocqueville_individualism',
    'kierkegaard_fear_and_trembling', 'marx_alienated_labor', 'thoreau_live_deliberately', 'mill_ask_whether_you_are_happy',
    'peirce_how_to_make_our_ideas_clear', 'dostoevsky_grand_inquisitor', 'tolstoy_a_confession', 'nietzsche_amor_fati'],
  twentieth: ['russell_value_of_philosophy', 'husserl_back_to_the_things', 'wittgenstein_whereof_one_cannot_speak', 'heidegger_being_toward_death',
    'woolf_room_of_ones_own', 'camus_myth_of_sisyphus', 'merleau_ponty_body_subject', 'sartre_existence_precedes_essence',
    'beauvoir_second_sex', 'adorno_minima_moralia', 'arendt_banality_of_evil', 'derrida_differance', 'rawls_veil_of_ignorance',
    'singer_drowning_child', 'nozick_experience_machine', 'nagel_what_is_it_like', 'foucault_discipline', 'macintyre_after_virtue',
    'parfit_what_matters', 'taylor_sources_of_the_self', 'butler_gender_performativity', 'nussbaum_capabilities'],
  africa: ['zera_yacob_hatata', 'douglass_learning_to_read', 'du_bois_double_consciousness', 'senghor_negritude', 'fanon_wretched_of_the_earth',
    'king_letter_from_birmingham_jail', 'baldwin_fire_next_time', 'nkrumah_consciencism', 'ubuntu_person_through_persons',
    'wiredu_conceptual_decolonization', 'hooks_all_about_love'],
  americas: ['haudenosaunee_seventh_generation', 'las_casas_valladolid', 'sor_juana_reply', 'marti_our_america', 'ohiyesa_silence_cornerstone_of_character',
    'mariategui_seven_essays', 'paz_labyrinth_of_solitude', 'freire_pedagogy_of_the_oppressed', 'deloria_god_is_red',
    'cordova_native_american_philosophy', 'kimmerer_braiding_sweetgrass'],
  science: ['euclid_proof', 'copernicus_de_revolutionibus', 'galileo_two_books', 'kepler_harmony', 'newton_general_scholium',
    'darwin_grandeur_of_life', 'einstein_spinozas_god', 'popper_falsification', 'schrodinger_atman_brahman', 'kuhn_paradigm_shift'],
  mind: ['wundt_first_laboratory', 'william_james_habit', 'jung_the_shadow', 'freud_pleasure_principle', 'pavlov_conditioned_reflex',
    'harvard_study_adult_development', 'maslow_hierarchy', 'frankl_mans_search_for_meaning', 'rogers_unconditional_positive_regard',
    'milgram_obedience', 'seligman_learned_helplessness', 'skinner_beyond_freedom', 'brickman_lottery_winners',
    'beck_cognitive_therapy_stoicism_tested', 'kabat_zinn_mbsr', 'kahneman_peak_end'],
};

export const roomOf = {};
for (const [room, ids] of Object.entries(R)) for (const id of ids) {
  if (roomOf[id]) throw new Error(`rooms.js: ${id} is in two rooms (${roomOf[id]}, ${room})`);
  roomOf[id] = room;
}
