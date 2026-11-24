// Leaf Lab data and the rules behind Grow Lab.
//
// What this teaches, and where it sits in school science:
//   Kindergarten: plants need water and light to live and grow.
//   Here: a plant makes its own food in its leaves. It makes it out of water and air,
//         sunlight is the power, sugar is the food, and oxygen comes out.
//   Later (about fifth grade): the stuff a plant is built from comes mostly from air and
//         water, not from soil.
// Soil is never called wrong. It holds the water and holds the plant up; it is just not the food.

export const PLANTS = [
  { id: 'sunflower', name: 'Sunflower', ask: 'How tall will it grow?' },
  { id: 'pumpkin', name: 'Pumpkin', ask: 'How heavy will the pumpkin get?' },
  { id: 'tomato', name: 'Tomato', ask: 'How many tomatoes will it grow?' },
  { id: 'oak', name: 'Oak Tree', ask: 'How wide will this year’s ring be?' },
];

export const LEAVES = [
  { id: 1, name: 'Small', tip: 'Small leaves catch a little light. They save water.' },
  { id: 2, name: 'Medium', tip: 'Medium leaves are in between.' },
  { id: 3, name: 'Big', tip: 'Big leaves catch lots of light. They lose more water to the air.' },
];

export const ROOTS = [
  { id: 'shallow', name: 'Shallow', tip: 'Shallow roots spread out near the top. They are quick to grow.' },
  { id: 'deep', name: 'Deep', tip: 'Deep roots reach water far down. They take extra food to grow.' },
];

export const SUMMERS = [
  { id: 'sunny', name: 'Sunny and rainy', blurb: 'Lots of sun, lots of rain', light: 3, rain: 4 },
  { id: 'cloudy', name: 'Cloudy', blurb: 'Rain, but not much sun', light: 1.5, rain: 4 },
  { id: 'dry', name: 'Hot and dry', blurb: 'Lots of sun, not much rain', light: 3, rain: 0.8 },
];

export const PLANT_WORDS = {
  first: ['Mighty', 'Giant', 'Lucky', 'Sunny', 'Tiny', 'Wild', 'Speedy', 'Golden', 'Jolly', 'Super', 'Sneaky', 'Wobbly'],
  second: ['Sprout', 'Stalk', 'Climber', 'Reacher', 'Grower', 'Greenie', 'Bloomer', 'Sunchaser', 'Rootster', 'Whopper', 'Beanpole', 'Leafster'],
};

// How much food the leaves make in one summer, from 1 (very little) to 5 (lots).
//   Light caught goes up with leaf size and with how sunny it is.
//   Water: bigger leaves need more. Rain gives some; deep roots reach more.
//   If the leaves get less than half the water they need, the plant wilts.
//   Deep roots cost some food to grow, so they only pay off when water is hard to find.
//   Best designs: sunny and cloudy summers, big leaves with shallow roots; dry summers, medium leaves with deep roots.
export function season(leaf, roots, summer) {
  const need = [0, 1, 2, 4][leaf];
  const supply = summer.rain + (roots === 'deep' ? 1.4 : 0);
  const water = Math.min(1, supply / need);
  const wilt = water < 0.5;
  let food = summer.light * leaf / 3 * water * (wilt ? 0.6 : 1) - (roots === 'deep' ? 0.6 : 0);
  food = Math.max(0.2, food);
  const jars = food >= 2.5 ? 5 : food >= 1.6 ? 4 : food >= 1.1 ? 3 : food >= 0.6 ? 2 : 1;
  return { jars, wilt, water, food };
}

// One or two short sentences that say why, using only what he chose and what the summer did.
export function why(leaf, roots, summer, res) {
  const deep = roots === 'deep';
  if (summer.id === 'sunny') {
    const first = leaf === 3 ? 'Lots of sun, lots of rain, and big leaves to catch the light. The leaves made tons of food.'
      : leaf === 2 ? 'Good sun and good rain. Bigger leaves could catch even more light.'
        : 'There was plenty of sun, but small leaves could not catch much of it.';
    return first + (deep ? ' It did not need deep roots, and growing them used up food.' : '');
  }
  if (summer.id === 'cloudy') {
    return (leaf === 3 ? 'Clouds hid the sun. Big leaves caught what light there was.'
      : 'Clouds hid the sun, and the leaves could not catch enough light. Try bigger leaves.') + (deep ? ' Deep roots used up some food too.' : '');
  }
  if (res.wilt) return `It was hot and dry. The ${leaf === 3 ? 'big ' : ''}leaves lost water faster than the short roots could find it. The plant wilted.`;
  if (!deep) return 'Small leaves saved water, so the plant stayed green. But small leaves make less food.';
  if (leaf === 1) return 'Deep roots found plenty of water. But small leaves could not make much food, and the roots used some up.';
  if (leaf === 2) return 'Deep roots found water far down, so the leaves kept making food all summer.';
  return 'Deep roots found water, but the big leaves used it up fast.';
}

// What the food turned into. Ranges are per jar count (1 to 5).
const RANGE = {
  sunflower: [[1, 2], [3, 4], [5, 7], [8, 10], [11, 14]],   // feet tall
  pumpkin: [[1, 3], [5, 10], [12, 25], [30, 50], [60, 90]], // pounds
  tomato: [[1, 2], [3, 6], [8, 12], [14, 20], [22, 30]],    // tomatoes
  oak: [[2, 4], [5, 8], [9, 14], [15, 20], [22, 30]],       // inches taller
};
export const RING = ['thin', 'thin', 'medium', 'wide', 'wide'];

export function harvest(kind, jars, rnd = Math.random) {
  const [lo, hi] = RANGE[kind][jars - 1];
  return lo + Math.floor(rnd() * (hi - lo + 1));
}

export function harvestText(kind, value, jars) {
  if (kind === 'sunflower') return `${value} ${value === 1 ? 'foot' : 'feet'} tall!`;
  if (kind === 'pumpkin') return `A ${value}-pound pumpkin!`;
  if (kind === 'tomato') return `${value} tomato${value === 1 ? '' : 'es'}!`;
  return `A ${RING[jars - 1]} ring, and ${value} inches taller!`;
}
export function harvestShort(kind, value, jars) {
  if (kind === 'sunflower') return `${value} ft`;
  if (kind === 'pumpkin') return `${value} lb`;
  if (kind === 'tomato') return `${value}`;
  return `${RING[jars - 1]} ring`;
}

/* ---------- Leaf Life ---------- */

export const GUESSES = [
  { id: 'sun', name: 'Sunlight', pic: 'sun', after: 'Yes! Sunlight gives the leaf power.', right: true },
  { id: 'water', name: 'Water', pic: 'water', after: 'Yes! The leaf makes food out of water.', right: true },
  { id: 'air', name: 'Air', pic: 'air', after: 'Yes! The leaf makes food out of air.', right: true },
  { id: 'soil', name: 'Soil', pic: 'soil', after: 'Soil helps. It holds water and minerals. But it is not the food.' },
  { id: 'rocks', name: 'Rocks', pic: 'rocks', after: 'Rocks do not help a leaf make food.' },
  { id: 'pizza', name: 'Pizza', pic: 'pizza', after: 'Pizza is your food. A plant makes its own!' },
];

// One thing is taken away on each card. tags label what changed in the picture.
export const WHATIFS = [
  { id: 'nosun', q: 'What if there is no sunlight?', st: { sun: false, water: true, air: true, soil: true }, tags: [], makes: false,
    result: 'It stops. Without sunlight, the leaf has no power to make food.' },
  { id: 'nowater', q: 'What if the soil dries up and there is no water?', st: { sun: true, water: false, air: true, soil: true }, tags: [[140, 246, 'no water']], makes: false,
    result: 'It stops. The leaf makes food out of water and air. With no water, it can\u2019t.' },
  { id: 'noair', q: 'What if we cover the plant so no air can get in?', st: { sun: true, water: true, air: false, soil: true, dome: true }, tags: [[352, 60, 'no air']], makes: false,
    result: 'It stops. The leaf makes food out of water and air. With no air, it can\u2019t.' },
  { id: 'nosoil', q: 'What if there is no soil? The roots sit in a jar of water.', st: { sun: true, water: true, air: true, soil: false }, tags: [[330, 250, 'no soil']], makes: true,
    result: 'It still makes food! Soil holds water and holds the plant up. But the food is made in the leaf.' },
];

export const BIG_WORDS = [
  { word: 'Photosynthesis', say: 'foh-toh-SIN-thuh-sis', means: 'How a plant makes food with light. Photo means light. Synthesis means making.' },
  { word: 'Chlorophyll', say: 'KLOR-uh-fill', means: 'The green in a leaf. It catches the sunlight.' },
  { word: 'Carbon dioxide', say: 'KAR-bun dy-OX-ide', means: 'The part of the air a plant uses. You breathe it out!' },
  { word: 'Oxygen', say: 'OX-ih-jen', means: 'The part of the air you breathe in. Leaves give it off.' },
];
