# Background briefs

Backgrounds sit behind a concept while it is on stage. They are **blurred and dim while you read** and **come into
focus as you scroll between parts**, so they are environments, not illustrations: a place the idea lives in, with a
calm middle where text will sit. Every idea uses its own background once revealed (the 14 daily concepts), otherwise
its room's background (all other ideas).

- Daily concepts: save as `public/img/nodes/<node id>.webp` and add an entry in `content/images.js` (kind
  `illustration`). Shown faded behind the closed card, never fully in focus until the user has written.
- Rooms: save as `public/img/rooms/<room id>.webp`. No manifest needed; picked up when the server starts.

## Style block (paste before every prompt)

> A quiet, atmospheric background plate for a phone app, portrait 2:3. Soft gouache texture, gentle late light,
> low contrast, no text, no lettering, no faces. Muted palette of sage, deep forest green, warm stone and cream,
> with one small warm amber accent. The middle of the frame is calm and uncluttered so text can sit over it; the
> subject lives toward the edges and lower third. It must still read as a mood when heavily blurred.

Export portrait, about 1024 × 1536, WebP under 400 KB.

## The 14 daily concepts

| Node id | Concept | Background prompt (after the style block) |
|---|---|---|
| `democritus_atoms_and_void` | Everything is atoms and void | Sunlight through a high window full of suspended dust motes; toward the edges the light breaks into fine grains, like a picture turning into pixels. |
| `epicurus_absence_of_pain` | Pleasure is the absence of pain | **Done** (the mug picture). Alternative: a still garden at dusk, a stone bench, the air perfectly calm. |
| `lucretius_death_nothing_to_us` | Death is nothing to us | Two night skies meeting at a calm horizon of still water, the stars above mirrored exactly below. |
| `zeno_live_according_to_nature` | Live according to nature | A painted colonnade (a stoa) seen at an angle in morning light, long shadows across open stone. |
| `epictetus_up_to_us` | Some things are up to us | Tall grass bending in a steady wind across a wide field; one straight footpath runs through it unmoved. |
| `seneca_evening_review` | The evening review | A desk by a dark window at night, one lamp's warm pool of light, an open notebook, the room in shadow. |
| `buddha_craving_root_of_suffering` | Craving is the root of suffering | A still pond after rain, rings of ripples fading outward, lotus leaves at the edges. |
| `marcus_pain_is_your_estimate` | The pain is your estimate | A brown-paper parcel with a blank tag on a table in the lower third, dawn light, a military tent's canvas behind. |
| `spinoza_freedom_understanding_necessity` | Freedom is understanding necessity | Rain on a tall window; beyond it, clearly, the clouds that make it and a puddle catching the drops. |
| `schopenhauer_will_source_of_suffering` | The will is the source of suffering | A great wooden mill wheel in shadow along one edge, water spilling from its paddles, turning. |
| `nietzsche_amor_fati` | Amor fati | A mountain path climbing in switchbacks toward a ridge at first light, a small flag at the top. |
| `beck_cognitive_therapy_stoicism_tested` | Cognitive therapy is Stoicism, tested | A tangle of thread on a table, one end drawn out into a single straight line toward a window. |
| `frankl_mans_search_for_meaning` | Man's Search for Meaning | An unfinished manuscript on a table by an open window, a pen on the last page, warm light falling across it. |
| `nozick_experience_machine` | The experience machine | A softly glowing glass tank in a dim room along one side; an open door on the other shows a plain, real street in daylight. |

## The rooms (backgrounds for every other idea)

| Room id | Room | Background prompt (after the style block) |
|---|---|---|
| `near_east` | The ancient Near East and the Bible | A desert dawn over a river valley, reeds at the water, clay tablets half-buried in sand. |
| `greece_rome` | Greece and Rome | Weathered marble columns and olive trees on a hillside above the sea, late afternoon. |
| `india` | India and the Buddhist world | River steps leading down to still water at dawn, mist, a single floating lamp. |
| `east_asia` | China and Japan | Ink-wash mountains in mist, a pine on a rock, a small bridge over a stream. |
| `medieval` | Faith and reason | Light through a tall arched window into a stone library, dust in the air, books on long shelves. |
| `early_modern` | Renaissance and Enlightenment | A scholar's study by candlelight: a globe, an open window, a brass telescope. |
| `nineteenth` | The 1800s | A city of chimneys and a railway at dusk, seen from a hill, gas lamps coming on. |
| `twentieth` | The 1900s and after | An empty café table by a rain-streaked window in a city at night. |
| `africa` | Africa and the diaspora | A baobab on a wide plain at sunrise, long shadows, a path leading away. |
| `americas` | The Americas | Cedar and birch by a lake in the morning, sweetgrass in the foreground. |
| `science` | How we came to know the world | A star-filled night sky with faint arcs of orbits above an observatory dome. |
| `mind` | The study of the mind | Clouds drifting over soft hills at dusk, their shapes almost like thoughts. |
| `art` | Art and the image | A painter's studio wall with unframed canvases in soft north light. |
| `culture` | Culture and everyday life | A lantern-lit street market at evening, figures softly blurred in motion. |
| `law` | Law and the state | The steps and columns of a courthouse in morning light, long column shadows across the stone. |
| `now` | Now | A morning newspaper folded on a table by a window, the street outside in motion. |
