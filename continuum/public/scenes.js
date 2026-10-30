// What is in each painting, so the visitors on it are plausible: a sailboat only where there is open water, sandpipers
// only on a beach, a spider in a room or a garden. Keys are the picture's path under /img without the extension.
// k: what the scene holds
//   sky     open sky (birds flying over)
//   sea     the sea (sailboats, schools of fish)
//   lake    still or fresh water: a lake, a river, a pond (ducks, a fish, an egret)
//   boats   water wide enough for a sail
//   beach   sand at the water's edge (sandpipers)
//   garden  plants close by: grass, flowers, trees, a forest (caterpillars, inchworms, dragonflies, spiders)
//   out     ground outdoors (a cat, a bird landing)
//   in      a room (a cat, a spider)
//   city    a town's river or quay (no fish there)
//   dark    a dark painting (mean brightness under .35): the visitors show light on it, not dark
// water: [top, bottom] of the water, as fractions of the picture's height (top is the horizon or the far shore);
// shore: where water meets land, for waders and sandpipers; waterX: [x0, x1] when the water fills only part of the
// picture's width (a river to one side).
// paper: a page or open book [x0, y0, x1, y1] where a few lines are written; board: a chalkboard for equations;
// chart: a dark sky or dome where equations and orbits are chalked; rays: where light comes in (x, y) and its
// direction in degrees from straight down (+ leans right).
// live: parts of the painting itself that move a little, at random: r [x0, y0, x1, y1]; m: bob (a boat on the water),
//   sway (branches, laundry, flowers, reeds; p is the fixed point, as fractions of r), breathe (a sleeping or resting
//   animal), peck (a bird's quick dip), flicker (a flame), spin (a whole wheel in view; p its hub); soft: gentler still.
// canopy: trees whose leaves may fall; flowers: where bees and butterflies wander; trunks: dark tree trunks an
// inchworm may climb (x, and the height from y1 up to y0). All read from the paintings.
export const SCENES = {
  // By day: bright plates
  'bright/balloons_dawn': { k: 'sky lake garden out', water: [.73, .88], shore: .86, waterX: [.52, .87] },
  'bright/beach_morning': { k: 'sky sea boats beach out', water: [.63, .79], shore: .8 },
  'bright/birds_lift': { k: 'sky sea boats out', water: [.7, .93], live: [{ r: [.64, .61, .84, .73], m: 'bob' }] },
  'bright/blossom_picnic': { k: 'sky garden out', live: [{ r: [.1, -.02, .52, .17], m: 'sway', p: [0, 0] }], canopy: [.12, 0, .5, .14], flowers: [.14, .02, .48, .16] },
  'bright/bubbles_square': { k: 'sky out' },
  'bright/coast_cyclist': { k: 'sky sea boats garden out', water: [.58, .74], flowers: [.55, .74, .86, .92] },
  'bright/garden_swing': { k: 'sky garden out', live: [{ r: [.12, -.02, .6, .12], m: 'sway', p: [.5, 0] }, { r: [.13, .84, .24, .94], m: 'peck' }, { r: [.64, .85, .73, .93], m: 'peck' }], canopy: [.15, 0, .55, .1], flowers: [.2, .72, .8, .86] },
  'bright/happy_clouds': { k: 'sky garden out', flowers: [.15, .74, .6, .92] },
  'bright/kites_park': { k: 'sky garden out', flowers: [.15, .74, .85, .9] },
  'bright/meadow_morning': { k: 'sky lake garden out', water: [.68, .78], shore: .77, flowers: [.15, .72, .85, .9], waterX: [.66, .87] },
  'bright/sail_bay_noon': { k: 'sky sea boats', water: [.57, 1], live: [{ r: [.12, .56, .29, .73], m: 'bob' }, { r: [.32, .57, .39, .67], m: 'bob' }, { r: [.53, .57, .64, .69], m: 'bob' }, { r: [.75, .57, .84, .67], m: 'bob' }] },
  'bright/sail_river_morning': { k: 'sky lake boats garden', water: [.62, .9], shore: .82, live: [{ r: [.16, .54, .36, .72], m: 'bob' }], waterX: [.13, .8] },
  'bright/sailing_regatta': { k: 'sky sea boats', water: [.57, 1], live: [{ r: [.12, .51, .36, .75], m: 'bob' }, { r: [.31, .56, .44, .71], m: 'bob' }, { r: [.67, .56, .84, .73], m: 'bob' }] },
  'bright/sunflowers_bees': { k: 'sky garden out', live: [{ r: [.63, .73, .88, .97], m: 'sway', p: [.5, 1] }, { r: [.12, .77, .4, .99], m: 'sway', p: [.5, 1] }], flowers: [.15, .72, .85, .95] },
  'bright/sunrise_beach_walk': { k: 'sky sea boats beach out', water: [.62, .74], shore: .76 },
  'bright/sunrise_hills': { k: 'sky lake boats garden', water: [.66, .86], shore: .86, live: [{ r: [.27, .72, .36, .8], m: 'bob' }] },
  'bright/sunrise_mountain_lake': { k: 'sky lake boats garden', water: [.68, .96], shore: .9, live: [{ r: [.67, .61, .77, .73], m: 'bob' }], flowers: [.14, .84, .42, .96] },
  'bright/sunrise_sea_sail': { k: 'sky sea boats', water: [.7, 1], live: [{ r: [.39, .72, .55, .86], m: 'bob' }] },
  // An idea's own picture
  'nodes/beck_cognitive_therapy_stoicism_tested': { k: 'garden out' },
  'nodes/buddha_craving_root_of_suffering': { k: 'lake garden', water: [.72, 1], shore: .8, live: [{ r: [.64, .78, .88, 1], m: 'bob', soft: true }] },
  'nodes/democritus_atoms_and_void': { k: 'garden', rays: { x: .55, y: 0, a: 8 } },
  'nodes/epictetus_up_to_us': { k: 'sky garden out', live: [{ r: [.12, .52, .32, 1], m: 'sway', p: [.5, 1] }, { r: [.71, .52, .88, 1], m: 'sway', p: [.5, 1] }] },
  'nodes/epicurus_absence_of_pain': { k: 'in' },
  'nodes/frankl_mans_search_for_meaning': { k: 'in garden', paper: [.24, .79, .6, .89] },
  'nodes/lucretius_death_nothing_to_us': { k: 'lake', water: [.62, 1] },
  'nodes/marcus_pain_is_your_estimate': { k: 'garden out' },
  'nodes/nietzsche_amor_fati': { k: 'sky garden out' },
  'nodes/nozick_experience_machine': { k: 'in', rays: { x: .88, y: .3, a: -58 } },
  'nodes/schopenhauer_will_source_of_suffering': { k: 'lake garden', water: [.8, 1] },
  'nodes/seneca_evening_review': { k: 'in dark', paper: [.27, .795, .66, .86], rays: { x: .86, y: .62, a: -70 }, live: [{ r: [.71, .56, .84, .67], m: 'flicker' }] },
  'nodes/spinoza_freedom_understanding_necessity': { k: 'lake garden out', water: [.72, 1], shore: .74 },
  'nodes/zeno_live_according_to_nature': { k: 'sky out' },
  // The rooms
  'rooms/africa': { k: 'sky garden out', live: [{ r: [.6, .13, .88, .42], m: 'sway', p: [1, .5] }], canopy: [.62, .15, .87, .35] },
  'rooms/americas': { k: 'lake garden', water: [.5, 1], shore: .9 },
  'rooms/art': { k: 'in' },
  'rooms/culture': { k: 'in' },
  'rooms/early_modern': { k: 'in dark', live: [{ r: [.27, .5, .36, .61], m: 'flicker' }, { r: [.5, .68, .7, .86], m: 'breathe' }] },
  'rooms/east_asia': { k: 'lake garden out', water: [.66, .9], shore: .88, live: [{ r: [.64, .57, .84, .83], m: 'breathe' }] },
  'rooms/greece_rome': { k: 'lake garden out', water: [.6, 1], shore: .8, live: [{ r: [.63, -.02, .88, .27], m: 'sway', p: [1, 0] }, { r: [.64, .54, .84, .81], m: 'breathe' }], canopy: [.65, 0, .87, .25] },
  'rooms/india': { k: 'lake boats garden', water: [.55, 1], shore: .78 },
  'rooms/law': { k: 'sky out', rays: { x: .2, y: .1, a: 22 } },
  'rooms/medieval': { k: 'in', rays: { x: .16, y: .08, a: 32 }, live: [{ r: [.16, .69, .33, .86], m: 'breathe' }] },
  'rooms/mind': { k: 'sky in garden' },
  'rooms/near_east': { k: 'lake garden', water: [.62, 1], shore: .66, live: [{ r: [.12, .48, .4, .96], m: 'sway', p: [.4, 1], soft: true }] },
  'rooms/nineteenth': { k: 'out dark' },
  'rooms/now': { k: 'in', rays: { x: .12, y: .1, a: 38 }, live: [{ r: [.2, .66, .55, .83], m: 'breathe' }] },
  'rooms/science': { k: 'in dark', chart: [.2, .08, .8, .45] },
  'rooms/twentieth': { k: 'out dark' },
  // Pages with a meaning, and the daily-life plates
  'spares/act_kitchen': { k: 'in dark' },
  'spares/change_river': { k: 'sky lake garden', water: [.52, .86], shore: .84 },
  'spares/daily_bakery_window': { k: 'in', rays: { x: .45, y: 0, a: 6 }, live: [{ r: [.12, .69, .29, .86], m: 'breathe' }] },
  'spares/daily_bridge_rain': { k: 'lake out city', water: [.55, 1], shore: .62, live: [{ r: [.69, .64, .84, .81], m: 'breathe' }] },
  'spares/daily_cafe_terrace': { k: 'out dark' },
  'spares/daily_fish_market': { k: 'out' },
  'spares/daily_laundry_yard': { k: 'garden out', rays: { x: .3, y: 0, a: 14 }, live: [{ r: [.12, -.02, .4, .17], m: 'sway', p: [.5, 0] }], canopy: [.5, 0, .87, .2], flowers: [.2, .7, .8, .88] },
  'spares/daily_library_steps': { k: 'out', rays: { x: .75, y: 0, a: -16 } },
  'spares/daily_station': { k: 'out', rays: { x: .6, y: 0, a: 4 }, live: [{ r: [.12, .77, .32, .89], m: 'peck' }] },
  'spares/daily_tram_snow': { k: 'out' },
  'spares/debates_stoa': { k: 'out dark', rays: { x: .88, y: .18, a: -40 } },
  'spares/homework_reading_room': { k: 'in dark', paper: [.58, .775, .82, .84], live: [{ r: [.12, .44, .4, .61], m: 'breathe' }] },
  'spares/map_observatory': { k: 'in dark', chart: [.2, .06, .8, .36] },
  'spares/parthenon_fire_circle': { k: 'garden dark' },
  'spares/patience_web': { k: 'garden', live: [{ r: [.12, .62, .37, 1], m: 'sway', p: [.3, 1] }] },
  'spares/problem_crossroads': { k: 'garden out dark', rays: { x: .68, y: 0, a: -12 }, live: [{ r: [.34, .54, .58, .73], m: 'breathe' }], canopy: [.12, 0, .88, .3], trunks: [{ x: .29, y0: .12, y1: .55 }] },
  'spares/recall_fog_path': { k: 'garden out dark', rays: { x: .72, y: .06, a: -14 }, live: [{ r: [.34, .61, .55, .81], m: 'breathe' }], canopy: [.12, 0, .88, .3], trunks: [{ x: .28, y0: .1, y1: .5 }] },
  'spares/return_boat': { k: 'lake boats out', water: [.45, .82], shore: .82, live: [{ r: [.38, .69, .77, .86], m: 'bob', soft: true }] },
  'spares/stillness_owl': { k: 'garden dark', live: [{ r: [.74, .58, .88, .76], m: 'peck', slow: true }], canopy: [.12, 0, .88, .3] },
  'spares/talk_two_chairs': { k: 'garden out dark', rays: { x: .55, y: .05, a: 6 }, live: [{ r: [.1, -.02, .9, .3], m: 'sway', p: [.2, 0], soft: true }], canopy: [.12, 0, .88, .28], flowers: [.14, .55, .45, .7] },
  'spares/teach_lecture_hall': { k: 'in dark', board: [.15, .31, .67, .46] },
  'spares/weigh_scales': { k: 'in dark', rays: { x: .92, y: .3, a: -55 } },
  // The tabs
  'tabs/gallery': { k: 'in', rays: { x: .2, y: .08, a: 28 } },
  'tabs/gallery_empty': { k: 'in', rays: { x: .2, y: .08, a: 28 } },
  'tabs/journal': { k: 'in dark', live: [{ r: [.56, .58, .69, .76], m: 'flicker' }] },
  'tabs/practice': { k: 'lake garden', water: [.45, 1], shore: .9, live: [{ r: [.12, .78, .32, 1], m: 'sway', p: [.5, 1] }] },
  'tabs/review': { k: 'lake dark', water: [0, 1] },
};
// A picture not listed (a new one): somewhere on the ground, indoors or out.
export const DEFAULT_SCENE = { k: 'out in' };
