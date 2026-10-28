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

Each room has an animal or a constellation and borrows the look of one public-domain artwork. The prompts say "inspired
by", not "copy": we want a new plate in that work's manner. For people, "no faces" still applies; animals are welcome.

| Room id | Room | Background prompt (after the style block) |
|---|---|---|
| `near_east` | The ancient Near East and the Bible | Papyrus reeds at the edge of a calm Nile marsh at dawn; a tawny cat crouched in the reeds at lower left; fish under clear water along the bottom. Inspired by the marsh scene from the Tomb of Nebamun (Egypt, c. 1350 BCE): flat profile shapes, ochre and blue-green. |
| `greece_rome` | Greece and Rome | **Done.** Alternative: a calm sea below marble columns, dolphins leaping at the lower edge, inspired by the Knossos dolphin fresco (c. 1600 BCE). |
| `india` | India and the Buddhist world | Stone river steps going down into still water at dawn, mist, one floating lamp; silver fish turning under the surface at the bottom. Inspired by Pahari (Kangra) miniature painting, 18th century: fine lines, soft washes. |
| `east_asia` | China and Japan | A cat on a wooden windowsill at lower right, seen from behind, looking out over misty rice fields to a distant mountain; a bamboo blind along the top. Inspired by Hiroshige's "Asakusa Ricefields and Torinomachi Festival" (1857): flat woodblock colour. |
| `medieval` | Faith and reason | A tall arched window in a stone library, light across long shelves; a small cat on the sill at the bottom, two mice at the far edge; faint interlace knotwork down one side. Inspired by the cats and mice of the Book of Kells (c. 800). |
| `early_modern` | Renaissance and Enlightenment | A scholar's study by candlelight, a globe and brass telescope at the left edge, an open window at night; a hare sitting on the floorboards in the lower third. Inspired by Albrecht Dürer's "Young Hare" (1502): fine fur, everything else soft. |
| `nineteenth` | The 1800s | City rooftops and chimneys at dusk, a railway viaduct far off, gas lamps coming on; a black cat in silhouette on a chimney pot at top right. Inspired by Steinlen's black cats (1890s) and Whistler's Nocturnes (1870s): blue-grey night. |
| `twentieth` | The 1900s and after | An empty café table by a rain-streaked window at night; beyond the glass, softly glowing fish seem to float among the city lights. Inspired by Paul Klee's "Fish Magic" (1925): dark ground, glowing fish, scratched texture. |
| `africa` | Africa and the diaspora | A baobab on a wide plain at sunrise along one edge, long shadows, a path leading away; faint red-ochre paintings of eland on a granite outcrop at lower left; the last of the Milky Way fading above. Inspired by San rock art of the Drakensberg. |
| `americas` | The Americas | Cedar and birch along a lake in early morning, sweetgrass in the foreground; a trout leaping from still water at lower right, rings spreading. Inspired by Winslow Homer's Adirondack watercolours, such as "Leaping Trout" (1889): loose wet washes. |
| `science` | How we came to know the world | A night sky over a small observatory dome at the bottom; faint engraved constellation figures across the stars, the two fish of Pisces and the lion of Leo clearest; thin arcs of orbits. Inspired by the "Urania's Mirror" star cards (1824). |
| `mind` | The study of the mind | Soft hills at dusk with clouds drifting above, shapes almost like thoughts; in a lower corner a cat asleep, curled tight, on a cushion by an open window. Inspired by John Constable's cloud studies (1820s): loose, luminous sky. |
| `art` | Art and the image | A painter's studio wall with unframed canvases in soft north light; a white cat playing on the floor at lower left. Inspired by Gustave Courbet's "The Painter's Studio" (1855), which has a white cat at the painter's feet: warm brown shadow, one bright window. |
| `culture` | Culture and everyday life | A lantern-lit street market at evening, figures blurred in motion at the edges; at lower right a stall of glass bowls of goldfish glowing in the lantern light. Inspired by Utagawa Kuniyoshi's goldfish prints (1839 to 1840): orange fish, paper lanterns. |
| `law` | Law and the state | Courthouse steps and columns at first light, long column shadows across the stone; a cat asleep in the sun on a low step; in the fading sky, the faint constellation Libra, the scales. Inspired by "Urania's Mirror" (1824) for the stars and Canaletto (18th century) for the stone. |
| `now` | Now | A morning newspaper folded on a table by a window, the street outside in motion; a cat curled asleep beside it; a glass bowl with one goldfish catching the light. Inspired by Vermeer's "Girl Reading a Letter at an Open Window" (c. 1657): light from the left, a still room. |

## Extra plates (tabs and spares)

Not wired in yet: the tab plates go behind the Practice, Journal, Review and Gallery screens once they arrive; the
spares are kept for new rooms or to rotate with a room's own plate.

| Use | Background prompt (after the style block) |
|---|---|
| Practice tab | A single heron standing still in shallow water at dawn, mist on the reeds, perfect reflection. Inspired by Ohara Koson's heron prints (c. 1910s). |
| Journal tab | A writing desk under a window at night, an inkwell and closed notebook, a moth resting near a candle. Inspired by Vilhelm Hammershøi's quiet interiors (c. 1900). |
| Review tab | Koi circling slowly in a dark garden pond seen from above, a few fallen leaves on the surface. Inspired by Japanese woodblock fish prints of the 1800s. |
| Gallery tab | A long gallery corridor with tall windows and empty frames on the walls, a cat walking away down the middle. Inspired by Hubert Robert's gallery paintings (1790s). |
| Spare: stillness | An owl on a bare branch against a deep night sky, the constellation Ursa Major faint behind it. Inspired by the "Urania's Mirror" star cards (1824). |
| Spare: change | A river delta seen from a hill at dusk, braided channels catching the last light, a few fish jumping. Inspired by Thomas Moran's watercolours (1870s). |
| Spare: patience | A spider web heavy with dew between two grass stems at sunrise, a valley soft behind it. Inspired by Albrecht Dürer's "Great Piece of Turf" (1503). |
| Spare: return | A small boat pulled up on a quiet shore at evening, a lantern on its bench, stars appearing. Inspired by Caspar David Friedrich's coastal scenes (c. 1820). |
