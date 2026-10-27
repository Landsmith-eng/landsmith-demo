// One illustration per daily node, shown on the plain face after the user has written (never on the closed card:
// a picture primes the answer the same way reading would).
//
// To add one:
//   1. Put the file in public/img/nodes/, named after the node id: democritus_atoms_and_void.webp
//      (.webp, .jpg, .png or .svg; about 1200px wide, under 400 KB).
//   2. Replace that node's `null` below with an entry:
//        { file: 'democritus_atoms_and_void.webp',
//          kind: 'illustration',            // illustration = drawn or generated art of the analogy
//                                           // artefact     = a real object: bust, manuscript, first edition
//          alt: 'What the picture shows, for screen readers (one sentence).',
//          credit: 'Who made it, and the licence',   // e.g. 'Generated with ChatGPT for Continuum'
//                                                    //      'Bust of Democritus, Pushkin Museum. Wikimedia Commons, CC BY-SA 4.0'
//          credit_url: 'https://…' }        // optional: the Commons or museum page
//   3. npm run check, then npm run seed.
//
// Illustrate the analogy, not the thinker: no generated portraits. No likeness of most of these people survives,
// and an invented face sits badly next to a verified source. Use `artefact` for a real bust or page instead.
export const images = {
  democritus_atoms_and_void: null,
  epicurus_absence_of_pain: {
    file: 'epicurus_absence_of_pain.webp',
    kind: 'illustration',
    alt: 'A blue mug on a table by a window; the left half of the room is grey and dim, the right half the same room in warm light, with nothing added.',
    credit: 'Generated with ChatGPT for Continuum',
  },
  lucretius_death_nothing_to_us: null,
  zeno_live_according_to_nature: null,
  epictetus_up_to_us: null,
  seneca_evening_review: null,
  buddha_craving_root_of_suffering: null,
  marcus_pain_is_your_estimate: null,
  spinoza_freedom_understanding_necessity: null,
  schopenhauer_will_source_of_suffering: null,
  nietzsche_amor_fati: null,
  beck_cognitive_therapy_stoicism_tested: null,
  frankl_mans_search_for_meaning: null,
  nozick_experience_machine: null,
};

export const IMAGE_KINDS = ['illustration', 'artefact'];
export const IMAGE_EXT = /\.(webp|jpe?g|png|svg)$/i;
export const IMAGE_DIR = new URL('../public/img/nodes/', import.meta.url);
export const MAX_IMAGE_BYTES = 400 * 1024;

// Problems with one manifest entry, as strings. Shared by the loader (which skips a bad entry) and the content gate
// (which reports it), so a half-added image never breaks the server and never ships silently.
export function imageProblems(id, img, statSize) {
  const out = [];
  if (!img || typeof img !== 'object') return [`${id}: image entry must be an object or null`];
  if (typeof img.file !== 'string' || !IMAGE_EXT.test(img.file) || /[/\\]/.test(img.file)) out.push(`${id}: image file must be a plain filename ending .webp, .jpg, .png or .svg`);
  else {
    const size = statSize(img.file);
    if (size == null) out.push(`${id}: image file public/img/nodes/${img.file} not found`);
    else if (size > MAX_IMAGE_BYTES) out.push(`${id}: image is ${Math.round(size / 1024)} KB; keep it under ${MAX_IMAGE_BYTES / 1024} KB for phones`);
  }
  if (!IMAGE_KINDS.includes(img.kind)) out.push(`${id}: image kind must be one of ${IMAGE_KINDS.join(', ')}`);
  if (typeof img.alt !== 'string' || img.alt.trim().length < 10) out.push(`${id}: image needs alt text (one sentence describing it)`);
  if (typeof img.credit !== 'string' || !img.credit.trim()) out.push(`${id}: image needs a credit (who made it, and the licence)`);
  if (img.credit_url != null && !/^https:\/\//.test(img.credit_url)) out.push(`${id}: credit_url must start with https://`);
  return out;
}
