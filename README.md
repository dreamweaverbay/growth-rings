# Growth Rings

A calm home base of activities for one curious kid. Each week becomes a ring in a tree cross-section, and every finished activity leaves a colored mark in that week's ring. A gold mark means a grown-up was part of it.

Built as a plain static site: no accounts, no tracking, no subscriptions. Everything is saved on the device it's used on.

## Activities

| Activity | What it is | Skills |
| --- | --- | --- |
| **Trail Tales** | Four short adventures he reads himself. Obstacles are solved with math and logic, and the numbers change every time and adjust to how he's doing. | Reading, addition and subtraction, logic |
| **Grove Grid** | A new picture logic puzzle every day (4 × 4), plus a 6 × 6 puzzle to solve with a grown-up. | Logic, persistence |
| **Pocket Magic** | Eight real tricks using household items, with secret steps, practice, and a showtime stage with drumroll and applause. | Reading, fine motor, performing, some math |
| **Weather Desk** | Look outside, compare with the real local forecast, choose what to wear, then deliver the report on air. | Observation, reading, numbers, presenting |
| **Build Lab** | Spinnable 3D, step-by-step blueprints for magnetic tiles: rocket, gem, truck garage, castle, robot. | Spatial reasoning, following steps, building |

## Grown-up area

Tap **Grown-ups** on the home screen and answer the multiplication question. From there you can:

- See which activities get picked, this week and last week
- Set his name, a daily limit, and sound
- Set the town for the weather forecast (uses [Open-Meteo](https://open-meteo.com), free, no key)
- Download or restore a backup

## Publishing on GitHub Pages

1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**, pick `main` and `/ (root)`, then **Save**.
3. After a minute or two the site is live at `https://dreamweaverbay.github.io/growth-rings/`.

## Installing on the tablet

Open the site in Chrome, tap the ⋮ menu, and choose **Add to home screen** or **Install app**. It opens full-screen and works offline, except for the live weather forecast.

## How it's organized

```
index.html            app shell
css/style.css         all styles
js/app.js             home screen, ring, grown-up area, activity list
js/rings.js           draws the tree rings
js/store.js           saving to the device
js/sound.js           sound effects (generated, no recordings, no voice)
js/ui.js              shared buttons, overlays, helpers
js/art.js             story scene art
js/data/stories.js    Trail Tales text and math frames
js/activities/*.js    one file per activity
vendor/               Three.js (MIT) for Build Lab
fonts/                Andika and Baloo 2 (SIL Open Font License)
sw.js                 offline support
```

To add an activity, add a file in `js/activities/` that exports `start(ctx)`, then add an entry to the `ACTIVITIES` list in `js/app.js`. Call `ctx.finish({...})` when the child completes it; that adds the ring mark and the grown-up moment.
