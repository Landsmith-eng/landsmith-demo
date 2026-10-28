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
//          credit: 'Who made it, and the licence',   // kept as a record; shown under the picture only for artefacts
//                                                    // e.g. 'Generated with ChatGPT for Continuum'
//                                                    //      'Bust of Democritus, Pushkin Museum. Wikimedia Commons, CC BY-SA 4.0'
//          credit_url: 'https://…' }        // optional: the Commons or museum page
//   3. npm run check, then npm run seed.
//
// Illustrate the analogy, not the thinker: no generated portraits. No likeness of most of these people survives,
// and an invented face sits badly next to a verified source. Use `artefact` for a real bust or page instead.
export const images = {
  democritus_atoms_and_void: {
    file: 'democritus_atoms_and_void.webp',
    kind: 'illustration',
    alt: 'A shaft of hazy sunlight full of drifting motes over dark foliage, glinting into fine grains at the edges.',
    credit: 'Generated with Perplexity for Continuum',
  },
  epicurus_absence_of_pain: {
    file: 'epicurus_absence_of_pain.webp',
    kind: 'illustration',
    alt: 'A blue mug on a table by a window; the left half of the room is grey and dim, the right half the same room in warm light, with nothing added.',
    credit: 'Generated with ChatGPT for Continuum',
  },
  lucretius_death_nothing_to_us: {
    file: 'lucretius_death_nothing_to_us.webp',
    kind: 'illustration',
    alt: 'A starry night sky over a still lake between wooded hills, the stars mirrored in the water.',
    credit: 'Generated with Perplexity for Continuum',
  },
  zeno_live_according_to_nature: {
    file: 'zeno_live_according_to_nature.webp',
    kind: 'illustration',
    alt: 'A sunlit stone colonnade opening onto hazy hills, long shadows of the columns across the floor.',
    credit: 'Generated with Perplexity for Continuum',
  },
  epictetus_up_to_us: {
    file: 'epictetus_up_to_us.webp',
    kind: 'illustration',
    alt: 'Tall grass bending in the wind on both sides of a straight footpath toward a low sun.',
    credit: 'Generated with Perplexity for Continuum',
  },
  seneca_evening_review: {
    file: 'seneca_evening_review.webp',
    kind: 'illustration',
    alt: 'An oil lamp glowing on a wooden desk beside an open notebook, by a dark window at night.',
    credit: 'Generated with Perplexity for Continuum',
  },
  buddha_craving_root_of_suffering: {
    file: 'buddha_craving_root_of_suffering.webp',
    kind: 'illustration',
    alt: 'A still, misty pond with lotus leaves and a single bud at the edges.',
    credit: 'Generated with Perplexity for Continuum',
  },
  marcus_pain_is_your_estimate: {
    file: 'marcus_pain_is_your_estimate.webp',
    kind: 'illustration',
    alt: 'A string-tied brown parcel with a blank tag resting on moss, warm light through a tent wall behind.',
    credit: 'Generated with Perplexity for Continuum',
  },
  spinoza_freedom_understanding_necessity: {
    file: 'spinoza_freedom_understanding_necessity.webp',
    kind: 'illustration',
    alt: 'Rain running down a window, beyond it grey clouds, a wet lane and a cottage light.',
    credit: 'Generated with Perplexity for Continuum',
  },
  schopenhauer_will_source_of_suffering: {
    file: 'schopenhauer_will_source_of_suffering.webp',
    kind: 'illustration',
    alt: 'A wooden mill wheel turning beside a stone building, water spilling into a misty river valley.',
    credit: 'Generated with Perplexity for Continuum',
  },
  nietzsche_amor_fati: {
    file: 'nietzsche_amor_fati.webp',
    kind: 'illustration',
    alt: 'A path zigzagging up a steep green ridge toward a small flag, a river valley in morning haze below.',
    credit: 'Generated with Perplexity for Continuum',
  },
  beck_cognitive_therapy_stoicism_tested: {
    file: 'beck_cognitive_therapy_stoicism_tested.webp',
    kind: 'illustration',
    alt: 'A loose tangle of white thread on a sage-green surface, one end drawn out straight to a small bead.',
    credit: 'Generated with Perplexity for Continuum',
  },
  frankl_mans_search_for_meaning: {
    file: 'frankl_mans_search_for_meaning.webp',
    kind: 'illustration',
    alt: 'A stack of manuscript pages on a table by an open window, warm light falling across them.',
    credit: 'Generated with Perplexity for Continuum',
  },
  nozick_experience_machine: {
    file: 'nozick_experience_machine.webp',
    kind: 'illustration',
    alt: 'A softly lit glass tank of plants in a dim room, beside an open door onto a sunny street.',
    credit: 'Generated with Perplexity for Continuum',
  },
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
