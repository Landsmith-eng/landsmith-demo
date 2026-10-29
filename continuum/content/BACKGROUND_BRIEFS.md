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

The tab plates sit behind the Practice, Journal, Review and Gallery screens (`public/img/tabs/`). The four spares
carry a meaning and replace a tab's plate when the situation fits (`MOOD_BG` in `public/app.js`): the owl once
today's practice is done, the boat when coming back after three days or more, the dewy web on a reluctant stretch,
the braided river when ready for a bigger practice or when a mind changed this week (Review).

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

## Daily life, observed (blurred figures)

The look of the market plate: ordinary places, people softly blurred in motion with no visible faces, one still
animal or object in sharp focus. They take turns, one a day, with the own plates of the 1800s, 1900s, Culture and
Now rooms (`ROOM_ROTATION` in `app.js`; files in `public/img/spares/`).

| Name | Background prompt (after the style block) |
|---|---|
| Station | A railway platform in morning steam, travellers blurred as they hurry past, a pigeon standing still on a bench. After Monet's "Gare Saint-Lazare" (1877). |
| Bridge in rain | A city bridge in rain at dusk, figures with umbrellas blurred in motion, a dog sitting patiently by a lamp post. After Caillebotte's "Paris Street; Rainy Day" (1877). |
| Fish market | A harbour fish market at dawn, sellers and buyers blurred, silver fish on wet stone in the foreground, gulls overhead. After Hiroshige's harbour prints (1850s). |
| Café terrace | A café terrace at night under a striped awning, diners blurred, a cat asleep under one chair, stars over the rooftops. After Van Gogh's "Café Terrace at Night" (1888). |
| Laundry yard | A courtyard of washing lines in sun and wind, figures blurred between the sheets, a cat watching from a step. After Berthe Morisot's "Hanging the Laundry out to Dry" (1875). |
| Tram stop | A tram stop in a snowy street at evening, passengers blurred, a sparrow on the shelter rail. After Hiroshige's snow scenes and Hammershøi's grey light (c. 1900). |
| Library steps | Wide library steps in late afternoon, readers blurred going up and down, a pigeon pecking crumbs in a patch of sun. After Canaletto's city squares (18th century). |
| Bakery window | A bakery window at dawn, the street blurred with early walkers reflected in the glass, loaves and one warm lamp inside, a cat on the sill. After Vermeer's light. |

## Batch 4: a plate for every screen (seen clearly now)

Since the boxes went away, plates are seen almost sharp with light lettering laid straight on them. Add this to
the style block for this batch: *"Clear and detailed, not blurred. Mid-tone to dark in the upper two-thirds, with
no large white or very bright areas where text sits; the brightest light toward the lower edge or one side."*
Save each as `public/img/spares/<file>.webp`; Talk and the debates borrow daily plates until theirs arrive.

| File | Screen | Background prompt (after the style block) |
|---|---|---|
| `talk_two_chairs` | Talk | Two empty garden chairs facing each other under a plane tree, two cups on a small table between them, a cat asleep in the dappled shade. After Corot's garden scenes (1860s). |
| `debates_stoa` | The great debates | A long stone colonnade at dusk, two groups of figures blurred in conversation at either end, an owl on a capital in the middle. After Raphael's "School of Athens" (1511). |
| `weigh_scales` | Weigh an opinion | Brass balance scales on a stone sill by an open window at evening, a sparrow perched on one pan, the pans almost level. After Chardin's still lifes (1700s). |
| `map_observatory` | The Map | An old observatory open to the night sky, a brass telescope, constellation figures drawn faint across the stars, a cat on the iron stair. After Cellarius's "Harmonia Macrocosmica" (1660). |
| `homework_reading_room` | Homework sheets | A long reading-room table under green lamps, open books and pencils, readers blurred far down the room, a cat asleep on a stack of books. After Hammershøi's interiors (c. 1900). |
| `teach_lecture_hall` | Teach it back | An empty lecture hall in morning light, a chalkboard wiped clean with faint smudges (no writing), a pigeon on the high window ledge. After Hammershøi's grey light. |
| `act_kitchen` | Act near you | A community kitchen hall, volunteers blurred serving at long tables, steam rising, a dog waiting patiently by the door. After Pissarro's market and harvest scenes (1880s). |
| `parthenon_fire_circle` | The Parthenon (groups) | A ring of chairs around a small fire in a garden at dusk, figures blurred, lanterns in the trees, fireflies. After Whistler's nocturnes (1870s). |
| `recall_fog_path` | Daily review | A garden path in morning fog, the near stones sharp and the far ones fading into white, a hare stopped on the path. After George Inness's late landscapes (1890s). |
| `problem_crossroads` | A problem to consider | A country crossroads at evening with a wooden signpost (blank arms, no lettering), a fox pausing at the fork. After Constable's lanes (1820s). |

## Batch 5: bright and happy (Carey)

Shown by day (7 a.m. to 5 p.m. on the phone's clock) behind the tabs and plain pages; the calmer plates return in
the evening. Save each as `public/img/bright/<file>.webp`; no code change is needed, each is picked up at once.
Use this style block instead of the usual one:

> A bright, joyful background plate for a phone app, portrait 2:3. Sunlit, warm and clear, painterly (gouache or
> plein-air oil), no text, no lettering, no faces in close-up. Fresh colours: sky blue, sea green, butter yellow,
> coral, white clouds. The upper half is open sky or soft space so text can sit over it; the life of the scene is in
> the lower third. Happy, lively, never busy.

| File | Background prompt (after the style block) |
|---|---|
| `kites_park` | People flying kites in a wide green park on a breezy day, kites high in a blue sky with puffy clouds, children running, a dog leaping. After Monet's summer meadows (1870s). |
| `beach_morning` | A sunny beach in the morning, small waves, bathers and striped umbrellas far off, gulls overhead, a sandcastle in the foreground. After Sorolla's beach scenes (1900s). |
| `happy_clouds` | Big bright cumulus clouds over rolling fields of wheat and poppies, swallows swooping low, a farm track. After Constable's cloud studies (1820s). |
| `birds_lift` | A flock of birds lifting off a sunny harbour wall into a blue sky, sailboats with white sails, bunting on the quay. After Boudin's harbours (1860s). |
| `balloons_dawn` | Hot-air balloons rising at sunrise over a green valley and a river, a few people waving from a hill. Bright and gentle, after Turner's morning light. |
| `blossom_picnic` | A picnic under a tree in full blossom, petals drifting in the air, a blanket and a basket, figures relaxed in the sun. After Hiroshige's cherry-blossom prints. |
| `sunflowers_bees` | A field of sunflowers under a summer sky, bees and a butterfly, a straw hat hung on a fence post. After Van Gogh's summer fields (1888). |
| `bubbles_square` | Children chasing soap bubbles in a sunny town square, a fountain sparkling, pigeons scattering. After Renoir's festive outdoor scenes. |
| `coast_cyclist` | A cyclist on a coastal road above a turquoise sea, wildflowers along the verge, white houses on the hill. After Dufy's bright Riviera views (1920s). |
| `sailing_regatta` | A summer regatta, small sailboats leaning in a brisk wind, flags and clear water, a lighthouse far off. After Monet's regatta at Argenteuil (1872). |
| `garden_swing` | A garden swing under an apple tree on a sunny afternoon, a child mid-swing, hens pecking, washing on a line. After Fragonard's lightness, in a modern key. |
| `meadow_morning` | A dewy meadow at sunrise with a path through tall grass, a hare leaping, larks rising, mist lifting from a stream. Bright, after Corot's early mornings. |
