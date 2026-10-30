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
//   dark    a dark painting (mean brightness under .35): the visitors show light on it, not dark
// water: [top, bottom] of the water, as fractions of the picture's height (top is the horizon or the far shore);
// shore: where water meets land, for waders and sandpipers. Read from the paintings themselves.
export const SCENES = {
  // By day: bright plates
  'bright/balloons_dawn': { k: 'sky lake garden out', water: [.73, .88], shore: .86 },
  'bright/beach_morning': { k: 'sky sea boats beach out', water: [.63, .79], shore: .8 },
  'bright/birds_lift': { k: 'sky sea boats out', water: [.7, .93] },
  'bright/blossom_picnic': { k: 'sky garden out' },
  'bright/bubbles_square': { k: 'sky out' },
  'bright/coast_cyclist': { k: 'sky sea boats garden out', water: [.58, .74] },
  'bright/garden_swing': { k: 'sky garden out' },
  'bright/happy_clouds': { k: 'sky garden out' },
  'bright/kites_park': { k: 'sky garden out' },
  'bright/meadow_morning': { k: 'sky lake garden out', water: [.68, .78], shore: .77 },
  'bright/sail_bay_noon': { k: 'sky sea boats', water: [.66, 1] },
  'bright/sail_river_morning': { k: 'sky lake boats garden', water: [.62, .9], shore: .82 },
  'bright/sailing_regatta': { k: 'sky sea boats', water: [.67, 1] },
  'bright/sunflowers_bees': { k: 'sky garden out' },
  'bright/sunrise_beach_walk': { k: 'sky sea boats beach out', water: [.62, .74], shore: .76 },
  'bright/sunrise_hills': { k: 'sky lake boats garden', water: [.66, .86], shore: .86 },
  'bright/sunrise_mountain_lake': { k: 'sky lake boats garden', water: [.68, .96], shore: .9 },
  'bright/sunrise_sea_sail': { k: 'sky sea boats', water: [.7, 1] },
  // An idea's own picture
  'nodes/beck_cognitive_therapy_stoicism_tested': { k: 'garden out' },
  'nodes/buddha_craving_root_of_suffering': { k: 'lake garden', water: [.72, 1] },
  'nodes/democritus_atoms_and_void': { k: 'garden' },
  'nodes/epictetus_up_to_us': { k: 'sky garden out' },
  'nodes/epicurus_absence_of_pain': { k: 'in' },
  'nodes/frankl_mans_search_for_meaning': { k: 'in garden' },
  'nodes/lucretius_death_nothing_to_us': { k: 'lake', water: [.62, 1] },
  'nodes/marcus_pain_is_your_estimate': { k: 'garden out' },
  'nodes/nietzsche_amor_fati': { k: 'sky garden out' },
  'nodes/nozick_experience_machine': { k: 'in' },
  'nodes/schopenhauer_will_source_of_suffering': { k: 'lake garden', water: [.8, 1] },
  'nodes/seneca_evening_review': { k: 'in dark' },
  'nodes/spinoza_freedom_understanding_necessity': { k: 'lake garden out', water: [.72, 1], shore: .74 },
  'nodes/zeno_live_according_to_nature': { k: 'sky out' },
  // The rooms
  'rooms/africa': { k: 'sky garden out' },
  'rooms/americas': { k: 'lake garden', water: [.5, 1], shore: .9 },
  'rooms/art': { k: 'in' },
  'rooms/culture': { k: 'in' },
  'rooms/early_modern': { k: 'in dark' },
  'rooms/east_asia': { k: 'lake garden out', water: [.66, .9], shore: .88 },
  'rooms/greece_rome': { k: 'lake garden out', water: [.6, 1], shore: .8 },
  'rooms/india': { k: 'lake boats garden', water: [.55, 1], shore: .78 },
  'rooms/law': { k: 'sky out' },
  'rooms/medieval': { k: 'in' },
  'rooms/mind': { k: 'sky in garden' },
  'rooms/near_east': { k: 'lake garden', water: [.62, 1], shore: .66 },
  'rooms/nineteenth': { k: 'out dark' },
  'rooms/now': { k: 'in' },
  'rooms/science': { k: 'in dark' },
  'rooms/twentieth': { k: 'out dark' },
  // Pages with a meaning, and the daily-life plates
  'spares/act_kitchen': { k: 'in dark' },
  'spares/change_river': { k: 'sky lake garden', water: [.52, .86], shore: .84 },
  'spares/daily_bakery_window': { k: 'in' },
  'spares/daily_bridge_rain': { k: 'lake out', water: [.55, 1], shore: .62 },
  'spares/daily_cafe_terrace': { k: 'out dark' },
  'spares/daily_fish_market': { k: 'out' },
  'spares/daily_laundry_yard': { k: 'garden out' },
  'spares/daily_library_steps': { k: 'out' },
  'spares/daily_station': { k: 'out' },
  'spares/daily_tram_snow': { k: 'out' },
  'spares/debates_stoa': { k: 'out dark' },
  'spares/homework_reading_room': { k: 'in dark' },
  'spares/map_observatory': { k: 'in dark' },
  'spares/parthenon_fire_circle': { k: 'garden dark' },
  'spares/patience_web': { k: 'garden' },
  'spares/problem_crossroads': { k: 'garden out dark' },
  'spares/recall_fog_path': { k: 'garden out dark' },
  'spares/return_boat': { k: 'lake boats out', water: [.45, .82], shore: .82 },
  'spares/stillness_owl': { k: 'garden dark' },
  'spares/talk_two_chairs': { k: 'garden out dark' },
  'spares/teach_lecture_hall': { k: 'in dark' },
  'spares/weigh_scales': { k: 'in dark' },
  // The tabs
  'tabs/gallery': { k: 'in' },
  'tabs/gallery_empty': { k: 'in' },
  'tabs/journal': { k: 'in dark' },
  'tabs/practice': { k: 'lake garden', water: [.45, 1], shore: .9 },
  'tabs/review': { k: 'lake dark', water: [0, 1] },
};
// A picture not listed (a new one): somewhere on the ground, indoors or out.
export const DEFAULT_SCENE = { k: 'out in' };
