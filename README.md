# Growth Rings

A calm home base of activities for one curious kid. Five things to do, each one finished in a sitting, and each one ending with a small moment to share with a grown-up.

Built as a plain static site: no accounts, no tracking, no subscriptions, no AI inside. Everything is saved on the device it's used on.

## Activities

| Activity | What it is | Skills |
| --- | --- | --- |
| **Trail Tales** | Four short adventures he reads himself. Obstacles are solved with math and logic. The numbers change every time and adjust to how he's doing, and each picture is drawn from those same numbers, so what he reads is what he sees. | Reading, addition and subtraction, comparing, logic |
| **Field Guide** | Six-step rounds that mix questions, identifying tracks, leaves, and fish, putting the steps of a process in order, and sorting. Every step ends with a fact that goes into his collection, and every round ends with a question to stump a grown-up. | Science, reading, sequencing, classifying |
| **Grove Grid** | Four new pattern puzzles every day: a picture grid, what comes next (pictures and numbers), the missing piece of a 3 × 3 square, and a pattern path across the grove. When all four are solved he builds a pattern with a hidden piece for a grown-up to solve. | Logic, patterns, persistence |
| **Fishing Hole** | Stock a pond, river, lake, or the ocean with the animals that really live there: 17 kinds of fish plus sharks, stingrays, dolphins, frogs, ducks, and more. Wrong choices always come from the other kind of water (salt or fresh). In the Lure Lab, design a bait with real color patterns, name it, and test it in clear, stained, or muddy water. Saved baits get a printable bait card. | Reading, science, cause and effect |
| **Weather Desk** | Two reports. *Right now*: look outside, compare with the real local conditions, choose what to wear, then deliver the report on air. It follows the clock, so after dark it reports on tonight and tomorrow. *Tomorrow*: check the next day's forecast, morning and afternoon, and plan what to wear. | Observation, reading, numbers, presenting, planning |

### One rule for all content

If the words name it, the picture shows it, in that amount. A story page that says "5 logs" draws five logs. When adding or changing content, check the picture against the sentence.

### Parked

Pocket Magic (`js/activities/magic.js`) and Build Lab (`js/activities/build.js`, with Three.js in `vendor/`) are still in the repo but are not on the home screen. Both lead to off-screen activities and are meant to become their own tools later.

## Grown-up area

Tap **Grown-ups** on the home screen and answer the multiplication question. From there you can:

- See which activities get picked, this week and last week, and how often a grown-up joined in
- Set his name, a daily limit, and sound
- Set the town for the weather forecast (uses [Open-Meteo](https://open-meteo.com), free, no key)
- Download or restore a backup

## Pictures

Settings, objects, fish, and anything that has to match a number are drawn in code. Animal characters and the pie are bundled pictures from Noto Emoji (see `art/noto/README.md` for the credit and license), so they look the same on every device and work offline.

## Publishing on GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
3. After a minute or two the site is live at `https://dreamweaverbay.github.io/growth-rings/`.

## Installing on the tablet

Open the site in Chrome, tap the ⋮ menu, and choose **Add to home screen** or **Install app**. It opens full-screen and works offline, except for the live weather forecast.

After an update is pushed, close the app fully and open it again while online to pick up the new version.

## How it's organized

```
index.html              app shell
css/style.css           all styles
js/app.js               home screen, finish screen, grown-up area, activity list
js/store.js             saving to the device
js/sound.js             sound effects (generated, no recordings, no voice)
js/ui.js                shared buttons, overlays, helpers
js/art.js               story scene art and the bundled picture helper
js/fishart.js           fish, lures, and water
js/factart.js           life-cycle pictures, tracks, leaves
js/data/stories.js      Trail Tales pages, numbers, and scenes
js/data/facts.js        Field Guide questions, sequences, sorts, and identification sets
js/data/fish.js         fish species, waters, baits, and colors
js/activities/*.js      one file per activity
art/noto/               bundled animal pictures (Noto Emoji)
fonts/                  Andika and Baloo 2 (SIL Open Font License)
sw.js                   offline support
```

To add an activity, add a file in `js/activities/` that exports `start(ctx)`, then add an entry to the `ACTIVITIES` list in `js/app.js` and to the file list in `sw.js`. Call `ctx.finish({...})` when the child completes it; that shows the finish screen and the grown-up moment.

To add Field Guide content, add entries to `js/data/facts.js`. For multiple-choice questions the first answer listed is the correct one; the app shuffles them.
