// Fishing Hole data. Fish facts are kept short so he can read them himself.

export const WATERS = [
  { id: 'pond', name: 'Farm Pond', salt: false, blurb: 'Small, calm, and weedy' },
  { id: 'river', name: 'River', salt: false, blurb: 'Moving water over rocks' },
  { id: 'lake', name: 'Big Lake', salt: false, blurb: 'Wide and deep, with docks and logs' },
  { id: 'ocean', name: 'Ocean', salt: true, blurb: 'Salty water, sand, and reefs' },
];

// look: drawing recipe for fishart.js
export const FISH = [
  {
    id: 'largemouth', name: 'Largemouth Bass', water: 'fresh', homes: ['pond', 'lake', 'river'], zone: 'mid',
    fact: 'Its big jaw goes past its eye. It hides by weeds and logs.',
    need: 'calm fresh water with weeds and logs',
    look: { depth: 0.36, back: '#3e5a2a', side: '#7f9a4a', belly: '#e8e6c8', fin: '#5d7337', pattern: ['band'], mouth: 'big', tail: 'square' },
  },
  {
    id: 'smallmouth', name: 'Smallmouth Bass', water: 'fresh', homes: ['river', 'lake'], zone: 'mid',
    fact: 'It likes clear, rocky water. Look for its up-and-down bars.',
    need: 'clear, rocky rivers and lakes',
    look: { depth: 0.36, back: '#5a4320', side: '#a5803f', belly: '#efe2bd', fin: '#8a6a30', pattern: ['vbars'], eye: '#c9312b', tail: 'square' },
  },
  {
    id: 'spotted', name: 'Spotted Bass', water: 'fresh', homes: ['river', 'lake'], zone: 'mid',
    fact: 'Kentucky’s state fish! It has rows of tiny spots on its belly.',
    need: 'rivers and big lakes',
    look: { depth: 0.35, back: '#3f5a33', side: '#8aa055', belly: '#ece9cf', fin: '#62783c', pattern: ['band', 'spotrows'], tail: 'square' },
  },
  {
    id: 'bluegill', name: 'Bluegill', water: 'fresh', homes: ['pond', 'lake', 'river'], zone: 'mid',
    fact: 'A small, round sunfish with a dark spot by its gill.',
    need: 'calm fresh water',
    look: { depth: 0.56, back: '#3c4a5e', side: '#6f7f6a', belly: '#e9a948', fin: '#4b5a5a', pattern: ['vbars', 'earflap'], mouth: 'small', tail: 'square', short: true },
  },
  {
    id: 'crappie', name: 'Crappie', water: 'fresh', homes: ['pond', 'lake'], zone: 'mid',
    fact: 'Crappie swim in groups near brush piles and docks.',
    need: 'lakes and ponds with brush',
    look: { depth: 0.5, back: '#4f5e52', side: '#c9cfbf', belly: '#f3f2ea', fin: '#7d877a', pattern: ['blotches'], tail: 'square', short: true },
  },
  {
    id: 'catfish', name: 'Channel Catfish', water: 'fresh', homes: ['pond', 'river', 'lake'], zone: 'bottom',
    fact: 'Its whiskers help it taste food in muddy water.',
    need: 'fresh water',
    look: { depth: 0.28, back: '#4c5866', side: '#8f9aa6', belly: '#eef0f2', fin: '#66727e', pattern: ['dots', 'barbels'], tail: 'fork', mouth: 'wide' },
  },
  {
    id: 'trout', name: 'Rainbow Trout', water: 'fresh', homes: ['river'], zone: 'mid',
    fact: 'It needs cold, clean water to live.',
    need: 'cold, rushing river water',
    look: { depth: 0.27, back: '#4c6a52', side: '#b9c4a8', belly: '#f2efe4', fin: '#8a9a7a', pattern: ['pinkstripe', 'dots'], tail: 'square' },
  },
  {
    id: 'walleye', name: 'Walleye', water: 'fresh', homes: ['lake', 'river'], zone: 'bottom',
    fact: 'Its big, shiny eyes help it see in dark water.',
    need: 'big lakes and rivers',
    look: { depth: 0.26, back: '#5e5a2c', side: '#b9a65a', belly: '#f1ead0', fin: '#8c7f42', pattern: ['saddles'], eye: '#d9d7b0', bigEye: true, tail: 'fork' },
  },
  {
    id: 'striper', name: 'Striped Bass', water: 'both', homes: ['lake', 'river', 'ocean'], zone: 'mid',
    fact: 'It can live in the ocean and in big lakes too!',
    need: 'big lakes, rivers, or the ocean',
    look: { depth: 0.3, back: '#4a5866', side: '#c6ccd2', belly: '#f4f5f6', fin: '#7e8a96', pattern: ['hstripes'], tail: 'fork' },
  },
  {
    id: 'muskie', name: 'Muskie', water: 'fresh', homes: ['lake', 'river'], zone: 'mid',
    fact: 'A long hunter with sharp teeth. Anglers call it the fish of 10,000 casts.',
    need: 'big lakes and rivers',
    look: { depth: 0.25, back: '#56632e', side: '#a8ad6a', belly: '#ece8cf', fin: '#8a6a3a', pattern: ['vbars'], tail: 'fork', long: true, snout: true },
  },
  {
    id: 'redfish', name: 'Redfish', water: 'salt', homes: ['ocean'], zone: 'mid',
    fact: 'Look for the black spot on its tail. It helps fool hungry hunters.',
    need: 'salty ocean water',
    look: { depth: 0.3, back: '#8a4e2a', side: '#d08a4c', belly: '#f4e3cf', fin: '#b0703e', pattern: ['tailspot'], tail: 'square' },
  },
  {
    id: 'seatrout', name: 'Speckled Trout', water: 'salt', homes: ['ocean'], zone: 'mid',
    fact: 'Not a real trout! It is a saltwater fish covered in black specks.',
    need: 'salty ocean water',
    look: { depth: 0.26, back: '#5a6a78', side: '#c2ccd4', belly: '#f2f4f6', fin: '#c7b770', pattern: ['dots'], tail: 'square', eye: '#e9c44a' },
  },
  {
    id: 'flounder', name: 'Flounder', water: 'salt', homes: ['ocean'], zone: 'floor',
    fact: 'It lies flat on the sand with both eyes on top of its head.',
    need: 'salty ocean water',
    look: { flat: true, back: '#8a7558', side: '#a99273', fin: '#7a6548', pattern: ['blotches'] },
  },
  {
    id: 'snapper', name: 'Red Snapper', water: 'salt', homes: ['ocean'], zone: 'bottom',
    fact: 'It lives deep down near reefs and old shipwrecks.',
    need: 'salty ocean water',
    look: { depth: 0.4, back: '#c23b3b', side: '#e9706a', belly: '#f8d6cf', fin: '#d95454', pattern: [], tail: 'fork', eye: '#e04a3a' },
  },
  {
    id: 'mahi', name: 'Mahi-mahi', water: 'salt', homes: ['ocean'], zone: 'top',
    fact: 'Bright green and gold. It swims far out in the open ocean.',
    need: 'salty ocean water',
    look: { depth: 0.32, back: '#2f8f6a', side: '#9dc94a', belly: '#f3d34a', fin: '#2a7aa8', pattern: ['dots'], tail: 'deepfork', blunt: true, longDorsal: true },
  },
  {
    id: 'tuna', name: 'Tuna', water: 'salt', homes: ['ocean'], zone: 'mid',
    fact: 'Built like a torpedo. Some tuna swim across whole oceans.',
    need: 'salty ocean water',
    look: { depth: 0.32, back: '#1f3a6a', side: '#8aa0b8', belly: '#eef1f5', fin: '#e8c43a', pattern: ['finlets'], tail: 'deepfork' },
  },
  {
    id: 'tarpon', name: 'Tarpon', water: 'salt', homes: ['ocean'], zone: 'top',
    fact: 'The silver king! It can gulp air from the top of the water.',
    need: 'salty ocean water',
    look: { depth: 0.3, back: '#5d7480', side: '#d6dde2', belly: '#f6f7f8', fin: '#9aa8b0', pattern: ['scales'], tail: 'deepfork', mouth: 'up' },
  },
];

/* ---------- Lure Lab ---------- */

export const BAITS = [
  { id: 'crank', name: 'Crankbait', depth: 'mid', mimics: 'a small fish or a crawfish', targets: ['largemouth', 'spotted', 'walleye'], tip: 'Its plastic lip makes it dive and wiggle.' },
  { id: 'spinner', name: 'Spinnerbait', depth: 'mid', mimics: 'a flashing school of baitfish', targets: ['largemouth', 'spotted', 'smallmouth'], tip: 'Its blades spin and flash in the water.' },
  { id: 'worm', name: 'Soft Plastic Worm', depth: 'bottom', mimics: 'a worm on the bottom', targets: ['largemouth', 'spotted', 'smallmouth'], tip: 'Fish it slow along the bottom.' },
  { id: 'jig', name: 'Jig', depth: 'bottom', mimics: 'a crawfish', targets: ['largemouth', 'smallmouth', 'catfish'], tip: 'Hop it along the bottom like a crawfish.' },
  { id: 'popper', name: 'Topwater Popper', depth: 'top', mimics: 'a frog or bug on top', targets: ['largemouth', 'striper'], tip: 'Pop! It splashes on top of the water.' },
  { id: 'swimbait', name: 'Swimbait', depth: 'mid', mimics: 'a swimming baitfish', targets: ['striper', 'largemouth', 'walleye'], tip: 'Its paddle tail kicks like a real fish.' },
  { id: 'spoon', name: 'Spoon', depth: 'mid', mimics: 'a hurt, shiny minnow', targets: ['striper', 'walleye', 'trout'], tip: 'It wobbles and flashes like a hurt minnow.' },
];

// natural = good in clear water; bright = good in stained or muddy water
export const COLORWAYS = [
  { id: 'shad', name: 'Shad', base: '#c9d1d8', back: '#5d6f80', accent: '#f4f6f8', kind: 'natural' },
  { id: 'greenpumpkin', name: 'Green Pumpkin', base: '#6b6a2e', back: '#3f3f1c', accent: '#9a8a3a', kind: 'natural' },
  { id: 'crawfish', name: 'Crawfish', base: '#a0562a', back: '#5a3018', accent: '#e07a32', kind: 'natural' },
  { id: 'bone', name: 'Bone', base: '#ece4cf', back: '#b9ab8a', accent: '#fffaf0', kind: 'natural' },
  { id: 'chartreuse', name: 'Chartreuse', base: '#c8e632', back: '#6f9a1e', accent: '#f4ff8a', kind: 'bright' },
  { id: 'firetiger', name: 'Firetiger', base: '#b6d63a', back: '#3d7a2a', accent: '#f07a1a', kind: 'bright', stripes: true },
  { id: 'blackblue', name: 'Black & Blue', base: '#23262e', back: '#0c0e12', accent: '#3a6ed8', kind: 'bright' },
];

export const NAME_WORDS = {
  first: ['Thunder', 'River', 'Midnight', 'Muddy', 'Lucky', 'Storm', 'Golden', 'Rusty', 'Rocket', 'Shadow', 'Big', 'Sneaky'],
  second: ['Shaker', 'Wiggler', 'Rattler', 'Popper', 'Diver', 'Slinger', 'Hopper', 'Flash', 'Bomber', 'Twister', 'Chomper', 'Glider'],
};

export const CLARITY = [
  { id: 'clear', name: 'Clear', blurb: 'You can see the bottom', water: '#5fb3d6', haze: 0 },
  { id: 'stained', name: 'Stained', blurb: 'A little green or brown', water: '#5f9a7a', haze: 0.35 },
  { id: 'muddy', name: 'Muddy', blurb: 'Brown after the rain', water: '#8a7350', haze: 0.78 },
];
