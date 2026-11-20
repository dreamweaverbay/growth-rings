// Trail Tales stories. Text is written for an early reader: short sentences, mostly simple words.
// Math pages get fresh numbers every time, sized to the reader's current level.

export const STORIES = [
  {
    id: 'lantern',
    title: 'The Lost Lantern',
    cover: { bg: 'dusk', props: [['pine', 60, 172, 1.1], ['pine', 340, 170, 1.2], ['lantern', 200, 178, 1.8], ['fox', 270, 186, 1.2]] },
    grown: 'Tell a grown-up which way you went, and how you found the lantern.',
    pages: {
      start: {
        scene: { bg: 'dusk', props: [['sun', 330, 138, 1.6], ['barn', 90, 176, 1.1], ['fox', 250, 190, 1.4]] },
        text: 'The sun is going down. Pip the fox runs up to you.',
        next: 'ask',
      },
      ask: {
        scene: { bg: 'dusk', props: [['pine', 50, 170, 1.2], ['pine', 120, 165, 0.9], ['fox', 230, 192, 1.6, true]] },
        text: '“I lost my lantern in the woods,” says Pip. “Can you help me find it?”',
        button: 'Yes! Let’s go.',
        next: 'fork',
      },
      fork: {
        scene: { bg: 'dusk', props: [['pine', 70, 168, 1], ['sign', 200, 186, 1.4], ['rock', 320, 176, 1.1], ['bush', 120, 190, 1]] },
        text: 'The path splits in two. Which way will you go?',
        choices: [
          { label: 'Go down by the creek', icon: 'frog', to: 'creek' },
          { label: 'Go up the hill', icon: 'rock', to: 'hill' },
        ],
      },
      creek: {
        scene: { bg: 'dusk', creek: true, props: [['log', 200, 182, 2.2], ['bush', 50, 172, 1]] },
        math: { type: 'join', item: 'frog', show: { prop: 'frog', x1: 150, x2: 250, y: 152, s: 0.9, perRow: 6, dy: 40 }, text: n => `You see ${n.a} frogs on a log. Then ${n.b} more frogs hop on. How many frogs are on the log now?` },
        next: 'dark',
      },
      hill: {
        scene: { bg: 'dusk', props: [['pine', 370, 156, 0.8], ['pine', 30, 150, 0.7]] },
        math: { type: 'leave', item: 'rock', show: { prop: 'rock', x1: 60, x2: 340, y: 176, s: 0.75, perRow: 7, dy: 26 }, text: n => `There are ${n.a} big rocks on the hill. You climb over ${n.b} of them. How many rocks are left to climb?` },
        next: 'dark',
      },
      dark: {
        scene: { bg: 'night', props: [['moon', 330, 70, 1.2], ['pine', 50, 176, 1.3], ['oak', 130, 180, 1.2], ['pine', 370, 180, 1.1]] },
        count: { what: 'firefly', text: 'It is dark now. Fireflies blink in the trees. Tap each one to count it.' },
        next: 'owl',
      },
      owl: {
        scene: { bg: 'night', props: [['moon', 330, 70, 1.2], ['oak', 200, 180, 1.8], ['owl', 236, 92, 0.9]] },
        logic: { kind: 'notHere' },
        next: 'spark',
      },
      spark: {
        scene: { bg: 'night', props: [['moon', 60, 70, 1], ['bush', 120, 190, 1.1], ['lantern', 210, 186, 2.2], ['fox', 300, 192, 1.3, true]] },
        math: { type: 'part', item: 'spark', text: n => `The lantern is cold. It needs ${n.c} sparks to glow. It has ${n.a} sparks. How many more sparks does it need?` },
        next: 'end',
      },
      end: {
        scene: { bg: 'night', props: [['moon', 330, 60, 1.2], ['lantern', 170, 186, 2.2, false, true], ['fox', 250, 192, 1.4, true], ['pine', 50, 176, 1.1]] },
        text: 'The lantern glows! Pip gives you a big hug. You walk home under the stars.',
        end: true,
      },
    },
  },
  {
    id: 'bridge',
    title: 'Beaver Bridge',
    cover: { bg: 'day', creek: true, props: [['bridge', 200, 186, 1.6], ['beaver', 290, 172, 1.3], ['pine', 50, 166, 1]] },
    grown: 'Build a bridge with a grown-up using blocks, tiles, or books. How long can you make it?',
    pages: {
      start: {
        scene: { bg: 'day', creek: true, props: [['cloud', 90, 50, 1], ['halfbridge', 200, 186, 1.6], ['beaver', 100, 172, 1.4, true], ['pine', 350, 166, 1]] },
        text: 'Bev the beaver is building a bridge over the creek. But the bridge is not done yet.',
        next: 'need',
      },
      need: {
        scene: { bg: 'day', creek: true, props: [['logpile', 120, 170, 1.4], ['beaver', 200, 172, 1.4], ['halfbridge', 320, 186, 1.2]] },
        math: { type: 'part', item: 'log', text: n => `The bridge needs ${n.c} logs. Bev has ${n.a} logs. How many more logs does Bev need?` },
        next: 'fork',
      },
      fork: {
        scene: { bg: 'day', props: [['pine', 80, 170, 1.2], ['pine', 130, 160, 0.9], ['sign', 210, 188, 1.4], ['beaver', 290, 190, 1.2, true]] },
        text: 'Where can you find more logs?',
        choices: [
          { label: 'In the old woods', icon: 'pine', to: 'woods' },
          { label: 'By the big pond', icon: 'fish', to: 'pond' },
        ],
      },
      woods: {
        scene: { bg: 'day', props: [['pine', 50, 168, 1.3], ['stump', 140, 186, 1.2], ['log', 180, 196, 1], ['rock', 270, 184, 1.2], ['log', 310, 198, 1], ['pine', 370, 166, 1.1]] },
        math: { type: 'join', item: 'log', text: n => `You find ${n.a} logs by a stump. You find ${n.b} logs by a rock. How many logs did you find?` },
        next: 'stones',
      },
      pond: {
        scene: { bg: 'day', creek: true, props: [['log', 120, 184, 1], ['log', 240, 186, 1], ['bush', 340, 170, 1.1], ['cloud', 300, 50, 1.1]] },
        math: { type: 'leave', item: 'log', text: n => `There are ${n.a} logs by the pond. Splash! ${n.b} logs float away. How many logs are left?` },
        next: 'stones',
      },
      stones: {
        scene: { bg: 'day', creek: true, props: [['halfbridge', 200, 186, 1.6], ['beaver', 330, 172, 1.2]] },
        logic: { kind: 'pattern' },
        next: 'fish',
      },
      fish: {
        scene: { bg: 'day', creek: true, props: [['bridge', 200, 186, 1.6]] },
        math: { type: 'join', item: 'fish', show: { prop: 'fish', x1: 40, x2: 360, y: 184, s: 0.8, perRow: 10, dy: 12 }, text: n => `${n.a} fish swim under the bridge. ${n.b} more fish come to look. How many fish are there now?` },
        next: 'cross',
      },
      cross: {
        scene: { bg: 'day', creek: true, props: [['bridge', 200, 186, 1.6], ['mole', 70, 170, 1.1], ['fox', 120, 172, 1], ['goat', 330, 172, 1, true]] },
        logic: { kind: 'lightest' },
        next: 'end',
      },
      end: {
        scene: { bg: 'day', creek: true, props: [['bridge', 200, 186, 1.6], ['mole', 160, 158, 0.9], ['fox', 210, 156, 0.9], ['goat', 260, 158, 0.9, true], ['beaver', 330, 172, 1.2, true]] },
        text: 'The bridge is done! One by one, the friends cross the creek. Bev slaps her tail. Good job!',
        end: true,
      },
    },
  },
  {
    id: 'oak',
    title: 'The Oldest Oak',
    cover: { bg: 'day', props: [['oak', 200, 182, 2], ['owl', 236, 74, 0.9], ['sapling', 300, 186, 1.4]] },
    grown: 'Go outside with a grown-up and look for a stump or a cut log. Can you count its rings?',
    pages: {
      start: {
        scene: { bg: 'day', props: [['cloud', 300, 50, 1.2], ['fallenoak', 200, 186, 1.6], ['owl', 330, 186, 1.1]] },
        text: 'Last night a big storm came. The old oak tree fell down. It was Hoot’s home!',
        next: 'rings',
      },
      rings: {
        scene: null,
        rings: { text: 'Look at the stump. Each ring is one year of growing. Tap each ring to count them.' },
        next: 'lived',
      },
      lived: {
        scene: { bg: 'day', props: [['stump', 140, 186, 1.6], ['owl', 230, 186, 1.2], ['acorn', 300, 192, 1.4]] },
        math: { type: 'join', item: 'acorn', text: n => `Hoot lived in the oak for ${n.a} years. Her mom lived there for ${n.b} years before that. How many years did owls live in the oak?` },
        next: 'fork',
      },
      fork: {
        scene: { bg: 'day', props: [['pine', 90, 176, 1.4], ['barn', 300, 180, 1.1], ['owl', 195, 188, 1]] },
        text: 'Hoot needs a new home. Where should she look?',
        choices: [
          { label: 'In a tall pine tree', icon: 'pine', to: 'pine' },
          { label: 'In the old barn', icon: 'barn', to: 'barn' },
        ],
      },
      pine: {
        scene: { bg: 'day', props: [['pine', 200, 190, 2.2], ['owl', 280, 120, 0.8]] },
        math: { type: 'leave', item: 'branch', text: n => `The pine tree has ${n.a} branches. ${n.b} branches are too thin. How many branches are strong enough?` },
        next: 'season', set: { home: 'pine' },
      },
      barn: {
        scene: { bg: 'day', props: [['barn', 200, 186, 1.8], ['owl', 200, 70, 0.8], ['hen', 300, 192, 1]] },
        math: { type: 'join', item: 'beam', text: n => `The barn has ${n.a} beams down low and ${n.b} beams up high. How many beams is that in all?` },
        next: 'season', set: { home: 'barn' },
      },
      season: {
        scene: { bg: 'dusk', props: [['oak', 90, 180, 1.2], ['owl', 220, 188, 1.1], ['bush', 320, 190, 1]] },
        logic: { kind: 'season' },
        next: 'nest',
      },
      nest: {
        scene: { bg: 'day', props: [['sticks', 150, 194, 1.6], ['nest', 240, 186, 1.6], ['owl', 310, 188, 1]] },
        math: { type: 'part', item: 'stick', text: n => `Hoot needs ${n.c} sticks for her nest. She has ${n.a} sticks. How many more sticks does she need?` },
        next: 'end',
      },
      end: {
        scene: { bg: 'day', props: [['stump', 120, 186, 1.4], ['sapling', 170, 190, 1.4], ['owl', 280, 184, 1.1], ['nest', 280, 194, 1.2]] },
        text: v => `Hoot has a new home in the ${v.home || 'pine'}! The old oak was ${v.age || 'many'} years old. You plant an acorn by the stump. One day it will grow rings of its own.`,
        end: true,
      },
    },
  },
  {
    id: 'pie',
    title: 'Who Took the Pie?',
    cover: { bg: 'day', props: [['house', 150, 186, 1.6], ['pie', 290, 184, 1.8], ['crumbs', 330, 190, 1.4]] },
    grown: 'Make up a riddle and ask a grown-up to guess the answer.',
    pages: {
      start: {
        scene: { bg: 'day', props: [['window', 200, 160, 2.2], ['pie', 200, 152, 1.6], ['cloud', 70, 44, 1]] },
        text: 'Gran made a pie. She set it by the window to cool.',
        next: 'gone',
      },
      gone: {
        scene: { bg: 'day', props: [['window', 200, 160, 2.2], ['crumbs', 200, 150, 1.6], ['cloud', 320, 44, 1]] },
        text: 'Later, Gran comes back. The pie is gone! Only crumbs are left. Who took it?',
        next: 'suspects',
      },
      suspects: {
        scene: { bg: 'day', props: [['house', 200, 170, 1.1], ['fox', 70, 196, 1.1], ['hen', 140, 198, 1.2], ['goat', 270, 198, 1.1, true], ['mole', 340, 198, 1.2, true]] },
        text: 'Four friends were near the window: Pip the fox, Hen, Gus the goat, and Mo the mole. Let’s look for clues.',
        button: 'Find the clues',
        next: 'mystery',
      },
      mystery: {
        scene: null,
        mystery: true,
        next: 'slices',
      },
      slices: {
        scene: { bg: 'day', props: [['pie', 200, 186, 2.4]] },
        math: { type: 'part', item: 'slice', text: (n, v) => `The pie had ${n.c} slices. ${v.culprit} left ${n.a} slices. How many slices did ${v.culprit} eat?` },
        next: 'end',
      },
      end: {
        scene: { bg: 'day', props: [['house', 120, 180, 1.2], ['pie', 250, 194, 1.6]] },
        culpritProp: [320, 196, 1.3],
        text: v => `${v.culprit} says sorry. ${v.culprit} helps Gran bake a new pie. Then everyone gets a slice!`,
        end: true,
      },
    },
  },
];

export const SUSPECTS = [
  { id: 'fox', name: 'Pip', prop: 'fox', traits: { feathers: false, horns: false, farm: false, underground: false, fur: true } },
  { id: 'hen', name: 'Hen', prop: 'hen', traits: { feathers: true, horns: false, farm: true, underground: false, fur: false } },
  { id: 'goat', name: 'Gus', prop: 'goat', traits: { feathers: false, horns: true, farm: true, underground: false, fur: true } },
  { id: 'mole', name: 'Mo', prop: 'mole', traits: { feathers: false, horns: false, farm: false, underground: true, fur: true } },
];

export const CLUE_TEXT = {
  feathers: [ 'The pie taker has feathers.', 'The pie taker has no feathers.' ],
  horns: [ 'The pie taker has horns.', 'The pie taker has no horns.' ],
  farm: [ 'The pie taker lives on the farm.', 'The pie taker does not live on the farm.' ],
  underground: [ 'The pie taker lives under the ground.', 'The pie taker does not live under the ground.' ],
  fur: [ 'The pie taker has fur.', 'The pie taker has no fur.' ],
};
