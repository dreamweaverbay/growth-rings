// Field Guide content. Each choice entry: first answer is the correct one (order is shuffled on screen).
import { ICONS, TRACKS, LEAVES } from '../factart.js';

export const TOPICS = {
  trees: 'Trees', life: 'Life Cycles', weather: 'Weather', fish: 'Fish & Water',
  animals: 'Animals', sky: 'Sky & Earth', signs: 'Tracks & Leaves',
};

const C = (id, t, q, a, f) => ({ id, t, q, a, f });

export const CHOICE = [
  C('t1', 'trees', 'How can you tell how old a cut tree was?', ['Count its rings', 'Count its leaves', 'Measure its bark'], 'A tree adds one new ring every year. Count the rings on a stump to find its age.'),
  C('t2', 'trees', 'What do leaves use to make food for the tree?', ['Sunlight', 'Moonlight', 'Wind'], 'Leaves make food from sunlight, air, and water. This is called photosynthesis.'),
  C('t3', 'trees', 'What does a wide tree ring mean?', ['A good year for growing', 'A very cold year', 'A year with no rain'], 'In a year with plenty of rain and sun, a tree grows more. So that ring is wide.'),
  C('t4', 'trees', 'Which tree stays green all winter?', ['Pine', 'Oak', 'Maple'], 'Pine trees are evergreens. They keep their needles all year.'),
  C('t5', 'trees', 'What does an acorn grow into?', ['An oak tree', 'A pine tree', 'A bush'], 'An acorn is the seed of an oak tree.'),
  C('t6', 'trees', 'Which part of a tree drinks water from the ground?', ['Roots', 'Leaves', 'Bark'], 'Roots pull water up from the soil. They also hold the tree in place.'),
  C('t7', 'trees', 'What is the tough skin on the outside of a tree called?', ['Bark', 'Shell', 'Peel'], 'Bark protects a tree, like skin protects you.'),
  C('t8', 'trees', 'Why do leaves change color in the fall?', ['The green fades away', 'They get sunburned', 'Bugs paint them'], 'In fall the green in a leaf fades away. Then other colors can show.'),
  C('t9', 'trees', 'Where does maple syrup come from?', ['The sap of maple trees', 'Maple leaves', 'Honeybees'], 'Maple syrup is made by boiling the sweet sap from maple trees.'),
  C('t10', 'trees', 'What do trees give off that we breathe?', ['Oxygen', 'Smoke', 'Steam'], 'Trees and other plants make oxygen. People and animals need it to breathe.'),
  C('t11', 'trees', 'What is Kentucky’s state tree?', ['Tulip poplar', 'Pine', 'Apple tree'], 'The tulip poplar is Kentucky’s state tree. Its flowers look a little like tulips.'),

  C('l1', 'life', 'What is a baby frog called?', ['A tadpole', 'A cub', 'A chick'], 'A tadpole hatches from an egg and lives in water. Later it grows legs and becomes a frog.'),
  C('l2', 'life', 'What does a caterpillar turn into?', ['A butterfly', 'A beetle', 'A worm'], 'A caterpillar changes into a butterfly or a moth.'),
  C('l3', 'life', 'How do tadpoles breathe under water?', ['With gills', 'With a snorkel', 'They hold their breath'], 'Tadpoles have gills, like fish. Grown frogs breathe air with lungs.'),
  C('l4', 'life', 'What does a seed need to start growing?', ['Water', 'Salt', 'Ice'], 'A seed needs water and warmth to sprout.'),
  C('l5', 'life', 'What do bees collect from flowers?', ['Nectar', 'Seeds', 'Leaves'], 'Bees drink sweet nectar from flowers and turn it into honey.'),
  C('l6', 'life', 'About how long does a chick grow inside its egg?', ['3 weeks', '3 days', '3 months'], 'A chick grows inside the egg for about 21 days. That is 3 weeks.'),
  C('l7', 'life', 'What is a baby deer called?', ['A fawn', 'A calf', 'A kid'], 'A baby deer is a fawn. Fawns have white spots that help them hide.'),
  C('l8', 'life', 'What is a baby goat called?', ['A kid', 'A lamb', 'A pup'], 'A baby goat is called a kid, just like you!'),
  C('l9', 'life', 'A butterfly starts its life as…', ['An egg', 'A flower', 'A leaf'], 'A butterfly starts as a tiny egg on a leaf.'),
  C('l10', 'life', 'What is it called when an animal sleeps deeply all winter?', ['Hibernating', 'Migrating', 'Hatching'], 'Groundhogs and some bats hibernate. They sleep deeply until spring.'),

  C('w1', 'weather', 'What are clouds made of?', ['Tiny drops of water', 'Smoke', 'Cotton'], 'A cloud is made of tiny drops of water or bits of ice floating in the air.'),
  C('w2', 'weather', 'What makes thunder?', ['Lightning', 'Clouds bumping', 'Wind'], 'Lightning heats the air so fast that it booms. That boom is thunder.'),
  C('w3', 'weather', 'In a storm, which comes first?', ['You see lightning', 'You hear thunder', 'They come together'], 'Light moves faster than sound. So you see the flash before you hear the boom.'),
  C('w4', 'weather', 'What makes a rainbow?', ['Sunlight shining through raindrops', 'Paint in the sky', 'Colored clouds'], 'Raindrops split sunlight into colors. That makes a rainbow.'),
  C('w5', 'weather', 'What tool tells you how hot or cold it is?', ['A thermometer', 'A ruler', 'A compass'], 'A thermometer measures temperature.'),
  C('w6', 'weather', 'What do we call balls of ice that fall from storm clouds?', ['Hail', 'Fog', 'Dew'], 'Hail is balls of ice. Some are as small as peas. Some are as big as golf balls.'),
  C('w7', 'weather', 'What is wind?', ['Moving air', 'Moving water', 'Moving clouds'], 'Wind is air that is moving. You can feel it, but you cannot see it.'),
  C('w8', 'weather', 'How many sides does a snowflake have?', ['6', '4', '10'], 'Snowflakes grow with six sides or six arms.'),
  C('w9', 'weather', 'What is fog?', ['A cloud near the ground', 'Smoke from fires', 'Dust'], 'Fog is a cloud that sits low, near the ground.'),
  C('w10', 'weather', 'At what temperature does water freeze?', ['32 degrees', '50 degrees', '100 degrees'], 'Water freezes into ice at 32 degrees Fahrenheit.'),
  C('w11', 'weather', 'What are the wet drops on the grass in the morning called?', ['Dew', 'Hail', 'Sleet'], 'Dew forms when the air cools at night and water collects on the grass.'),

  C('f1', 'fish', 'What do fish use to breathe?', ['Gills', 'Lungs', 'Noses'], 'Gills take oxygen out of the water.'),
  C('f2', 'fish', 'What covers the body of most fish?', ['Scales', 'Fur', 'Feathers'], 'Scales protect a fish, like a suit of armor.'),
  C('f3', 'fish', 'What is Kentucky’s state fish?', ['Spotted bass', 'Catfish', 'Bluegill'], 'The Kentucky spotted bass is the state fish.'),
  C('f4', 'fish', 'Which fish has whiskers?', ['Catfish', 'Bluegill', 'Trout'], 'A catfish’s whiskers are called barbels. They help it find food.'),
  C('f5', 'fish', 'How is ocean water different from pond water?', ['It is salty', 'It is sweet', 'It is green'], 'Ocean water is salt water. Ponds and rivers are fresh water.'),
  C('f6', 'fish', 'What do bass like to hide near?', ['Weeds and logs', 'Open sand', 'Bright lights'], 'Bass hide near weeds, logs, and docks. Then they dart out to catch food.'),
  C('f7', 'fish', 'What do fish use to steer and swim?', ['Fins', 'Paws', 'Wings'], 'A fish moves its tail fin to push forward. Other fins help it steer.'),
  C('f8', 'fish', 'What is a baby fish called?', ['A fry', 'A pup', 'A kit'], 'Baby fish are called fry.'),
  C('f9', 'fish', 'What is a big group of fish swimming together called?', ['A school', 'A herd', 'A flock'], 'Fish swim in a school to stay safe.'),
  C('f10', 'fish', 'A largemouth bass is part of which fish family?', ['Sunfish', 'Catfish', 'Trout'], 'Largemouth bass belong to the sunfish family, just like bluegill.'),
  C('f11', 'fish', 'Which of these fish lives in salt water?', ['Redfish', 'Bluegill', 'Crappie'], 'Redfish live in the ocean. Bluegill and crappie live in fresh water.'),

  C('a1', 'animals', 'Where does wool come from?', ['Sheep', 'Cows', 'Chickens'], 'Wool is the thick hair of a sheep. We make yarn from it.'),
  C('a2', 'animals', 'How do earthworms help the soil?', ['They dig tunnels that let in air and water', 'They eat all the plants', 'They make it dry'], 'Worm tunnels let air and water into the soil. That helps plants grow.'),
  C('a3', 'animals', 'Which bird hunts at night?', ['Owl', 'Hen', 'Cardinal'], 'Owls hunt at night. Their big eyes help them see in the dark.'),
  C('a4', 'animals', 'What do beavers build across a creek?', ['A dam', 'A nest', 'A tunnel'], 'Beavers build dams from sticks and mud. The dam makes a pond.'),
  C('a5', 'animals', 'How many legs does an insect have?', ['6', '8', '4'], 'All insects have six legs. Ants, bees, and beetles are insects.'),
  C('a6', 'animals', 'How many legs does a spider have?', ['8', '6', '10'], 'A spider has eight legs, so it is not an insect.'),
  C('a7', 'animals', 'What is a fox’s home called?', ['A den', 'A nest', 'A hive'], 'A fox lives in a den, often dug into the ground.'),
  C('a8', 'animals', 'What is Kentucky’s state bird?', ['Cardinal', 'Blue jay', 'Robin'], 'The bright red cardinal is Kentucky’s state bird.'),
  C('a9', 'animals', 'Where do moles live?', ['In tunnels under the ground', 'In trees', 'In ponds'], 'Moles dig tunnels with their big front feet.'),
  C('a10', 'animals', 'What do honeybees make?', ['Honey', 'Milk', 'Syrup'], 'Honeybees make honey to feed their hive.'),
  C('a11', 'animals', 'What do cows eat most?', ['Grass and hay', 'Fish', 'Acorns'], 'Cows eat grass and hay. Later they chew it again. That is called chewing cud.'),
  C('a12', 'animals', 'Why do many birds fly south in the fall?', ['To find warm weather and food', 'To find snow', 'To see the ocean'], 'Many birds fly south for winter. This long trip is called migration.'),

  C('s1', 'sky', 'Which star is closest to Earth?', ['The Sun', 'The North Star', 'The Moon'], 'The Sun is a star. It is the closest star to Earth.'),
  C('s2', 'sky', 'What makes day and night?', ['Earth spinning', 'The Sun turning off', 'Clouds covering the Sun'], 'Earth spins like a top. When your side faces the Sun, it is day.'),
  C('s3', 'sky', 'How long does Earth take to go around the Sun?', ['One year', 'One day', 'One week'], 'One trip around the Sun takes one year.'),
  C('s4', 'sky', 'Why does the Moon shine?', ['Sunlight bounces off it', 'It is on fire', 'It has lamps'], 'The Moon does not make its own light. It reflects light from the Sun.'),
  C('s5', 'sky', 'What is frozen water called?', ['Ice', 'Steam', 'Mist'], 'Water can be solid ice, liquid water, or a gas called water vapor.'),
  C('s6', 'sky', 'Which season comes after winter?', ['Spring', 'Fall', 'Summer'], 'Winter, spring, summer, fall. Then the seasons start again.'),
];

export const ORDER = [
  { id: 'o-frog', t: 'life', prompt: 'How does a frog grow up? Tap the pictures in order.', fact: 'A frog starts as an egg, hatches into a tadpole, grows legs as a froglet, and then becomes a frog.',
    steps: [['Eggs', ICONS.frogEggs], ['Tadpole', ICONS.tadpole], ['Froglet', ICONS.froglet], ['Frog', ICONS.frog]] },
  { id: 'o-butterfly', t: 'life', prompt: 'How does a butterfly grow up? Tap the pictures in order.', fact: 'A butterfly starts as an egg, hatches into a caterpillar, rests in a chrysalis, and comes out as a butterfly.',
    steps: [['Egg', ICONS.leafEgg], ['Caterpillar', ICONS.caterpillar], ['Chrysalis', ICONS.chrysalis], ['Butterfly', ICONS.butterfly]] },
  { id: 'o-oak', t: 'trees', prompt: 'How does an oak tree grow? Tap the pictures in order.', fact: 'An acorn sprouts, grows into a small sapling, and after many years becomes a big oak tree.',
    steps: [['Acorn', ICONS.acorn], ['Sprout', ICONS.sprout], ['Sapling', ICONS.sapling], ['Oak tree', ICONS.oak]] },
  { id: 'o-chicken', t: 'life', prompt: 'How does a chicken grow up? Tap the pictures in order.', fact: 'A hen lays an egg. A chick hatches from it and grows up to be a hen or a rooster.',
    steps: [['Egg', ICONS.egg], ['Chick', ICONS.chick], ['Hen', ICONS.hen]] },
  { id: 'o-water', t: 'weather', prompt: 'How does rain happen? Tap the pictures in order.', fact: 'The Sun warms water. The water rises into the air, makes clouds, and falls back down as rain. This is the water cycle.',
    steps: [['Sun warms the water', ICONS.sunWater], ['Water rises into the air', ICONS.vapor], ['A cloud forms', ICONS.cloud], ['Rain falls', ICONS.rain]] },
  { id: 'o-seasons', t: 'trees', prompt: 'What happens to a tree in a year? Start with spring.', fact: 'In spring a tree grows buds. In summer its leaves are green. In fall they change color and drop. In winter the branches are bare.',
    steps: [['Spring: new buds', ICONS.treeSpring], ['Summer: green leaves', ICONS.treeSummer], ['Fall: leaves change color', ICONS.treeFall], ['Winter: bare branches', ICONS.treeWinter]] },
  { id: 'o-bass', t: 'fish', prompt: 'How does a bass grow up? Tap the pictures in order.', fact: 'Bass eggs lie in a nest on the bottom. Tiny fry hatch, grow into young bass, and then into big bass.',
    steps: [['Eggs in a nest', ICONS.bassEggs], ['Tiny fry', ICONS.bassFry], ['Young bass', ICONS.bassYoung], ['Big bass', ICONS.bassAdult]] },
];

// E: an animal with a bundled picture (art/noto). F: a fish drawn from its recipe.
const E = (label, art, bin) => ({ label, art, bin });
const F = (fish, bin) => ({ fish, bin });

export const SORT = [
  { id: 's-eggs', t: 'life', prompt: 'How is each animal born?', bins: ['Hatches from an egg', 'Born alive'], fact: 'Birds, frogs, turtles, and most fish hatch from eggs. Dogs, cows, deer, and other mammals are born alive.',
    items: [E('Chicken', 'hen', 0), E('Frog', 'frog', 0), E('Turtle', 'turtle', 0), E('Duck', 'duck', 0), E('Dog', 'dog', 1), E('Cow', 'cow', 1), E('Deer', 'deer', 1), E('Horse', 'horse', 1)] },
  { id: 's-insects', t: 'animals', prompt: 'Is it an insect? Insects have six legs.', bins: ['Insect', 'Not an insect'], fact: 'Insects have six legs. Spiders have eight legs, and snails have none, so they are not insects.',
    items: [E('Ant', 'ant', 0), E('Bee', 'bee', 0), E('Butterfly', 'butterfly', 0), E('Ladybug', 'ladybug', 0), E('Spider', 'spider', 1), E('Snail', 'snail', 1), E('Frog', 'frog', 1), E('Mouse', 'mouse', 1)] },
  { id: 's-water', t: 'fish', prompt: 'Where does each fish live?', bins: ['Fresh water', 'Salt water'], fact: 'Bass, bluegill, catfish, and crappie live in fresh water. Redfish, tuna, flounder, and mahi-mahi live in salt water.',
    items: [F('largemouth', 0), F('bluegill', 0), F('catfish', 0), F('crappie', 0), F('redfish', 1), F('tuna', 1), F('flounder', 1), F('mahi', 1)] },
  { id: 's-home', t: 'animals', prompt: 'Where does each animal live?', bins: ['On a farm', 'In the woods'], fact: 'Cows, chickens, goats, and pigs live on farms. Deer, foxes, owls, and raccoons live in the woods.',
    items: [E('Cow', 'cow', 0), E('Chicken', 'hen', 0), E('Goat', 'goat', 0), E('Pig', 'pig', 0), E('Deer', 'deer', 1), E('Fox', 'fox', 1), E('Owl', 'owl', 1), E('Raccoon', 'raccoon', 1)] },
  { id: 's-night', t: 'animals', prompt: 'When is each animal awake?', bins: ['In the day', 'At night'], fact: 'Owls, bats, and raccoons are awake at night. Chickens, squirrels, and butterflies are awake in the day.',
    items: [E('Chicken', 'hen', 0), E('Squirrel', 'squirrel', 0), E('Butterfly', 'butterfly', 0), E('Owl', 'owl', 1), E('Bat', 'bat', 1), E('Raccoon', 'raccoon', 1)] },
];

const ID = (id, q, img, a, f) => ({ id, t: 'signs', q, img, a, f });

export const IDENT = [
  ID('i-deer', 'Which animal made this track?', TRACKS.deer, ['Deer', 'Dog', 'Duck'], 'A deer has a hoof split into two toes. Its track looks like two teardrops.'),
  ID('i-dog', 'Which animal made this track?', TRACKS.dog, ['Dog', 'Deer', 'Turkey'], 'A dog track has one big pad, four toes, and claw marks.'),
  ID('i-raccoon', 'Which animal made this track?', TRACKS.raccoon, ['Raccoon', 'Dog', 'Deer'], 'A raccoon track looks like a tiny hand with five long fingers.'),
  ID('i-turkey', 'Which animal made this track?', TRACKS.turkey, ['Turkey', 'Raccoon', 'Deer'], 'A turkey track has three long toes pointing forward.'),
  ID('i-duck', 'Which animal made this track?', TRACKS.duck, ['Duck', 'Turkey', 'Dog'], 'A duck has webbed feet for swimming. You can see the web between its toes.'),
  ID('i-oak', 'Which tree did this leaf come from?', LEAVES.oak, ['Oak', 'Maple', 'Pine'], 'Many oak leaves have round, bumpy edges called lobes.'),
  ID('i-maple', 'Which tree did this leaf come from?', LEAVES.maple, ['Maple', 'Oak', 'Pine'], 'A maple leaf has pointed tips, like a star.'),
  ID('i-pine', 'Which tree did these come from?', LEAVES.pine, ['Pine', 'Oak', 'Maple'], 'Pine trees have thin needles instead of flat leaves.'),
];
