---
name: layer-part
description: Create a new layerable avatar part (eyes, mouth, outfit, headgear, accessory, background) as an SVG that fits the shared 800×800 body/head template and works on every character. Use whenever Jason asks to draw, design, or add a new part to the avatar builder. Outfits and headgear have their own skills (outfit-part, headgear-part) that build on this one; load this one first either way.
---

# Creating a layer part

Parts are 800×800 transparent images stacked on a shared canvas. A part fits by being drawn in the right place: nothing positions it in code. Draw parts as hand-authored SVG, verify them numerically and visually against every body, and show Jason previews before anything lands in the repo.

Read `reference/anatomy.md` for measured coordinates (head, face regions, hands, body) before drawing.

## How parts plug in

- **Folder = layer, file name = picker label.** `src/features/builder/characters/base/<layer>/<kebab-name>.svg` shows up for every character. `characters/<character>/<layer>/` adds a part for one character only.
- **Stacking** comes from `LAYER_STACK` in `src/features/builder/services/layers.js`, bottom to top: backgrounds, body, outfits, head, mouths, eyes, accessories, headgear. The stage, PNG export and snapshot thumbnails all read it. The preview scripts import it too, so previews always match the app.
  - Outfits draw *under* the head, so the head hides the neckline (down to y≈504 at the chin).
  - Hands are part of the body layer, so an outfit drawn over them hides them. Keep garments off the hands unless the part is meant to cover them.
- **SVG requirements** (the stage shows parts in `<img>`; export draws them onto a canvas):
  - Root needs `width='800' height='800' viewBox='0 0 800 800'`, or some browsers render nothing or the wrong size on the export canvas.
  - Fully self-contained: no external fonts, images, stylesheets or scripts. Text must be outlined as paths.
  - `<use href>`, `clipPath`, `pattern`, gradients and `fill-opacity` all work.
  - Don't put a PNG and an SVG with the same name in one folder (one silently replaces the other).
- **Size:** a few KB is typical. Repeating patterns written out as many shapes can reach ~25KB, which is fine.

## House style

Match the existing art, not a generic cartoon style. Before drawing, render the existing parts in the same layer (`compose.mjs --part <layer>=<existing-name>`) and look at them.

- **Outlines:** black (`#000`), about 11–12px at 800px, `stroke-linejoin='round'`. Thinner (3–6px) black lines only for interior detail such as seams, lapels and folds.
- **Fills:** flat color plus at most one shade. No highlight streaks or decorative lines unless they follow the form exactly (see lessons).
- **Light comes from above, slightly left.** Shadows are translucent black (`fill='#000' fill-opacity='0.13'`) so they darken any color they fall on. Clip them to the shape they fall on.
- **View:** the figure is seen from slightly above. Horizontal bands (belts, hems, shirt bottoms, brims) curve like a smile: highest at the sides, lowest at the center.
- **Slight tilt** reads as hand-drawn: hats lean a few degrees (`rotate(-3 …)`).
- **No trademarked logos or emblems.** Use "inspired by" shapes and colors only.

## Workflow

1. **Gather references.** Ask for reference images if Jason hasn't given any. Note the colors and the angle he wants.
2. **Measure, don't eyeball.** Use `measure.mjs` and `reference/anatomy.md` for every edge that must meet the body or head. Eyeballing from a grid was off by 5–15px and every miss was visible.
3. **Draft in the scratchpad.** Write the SVG (or a small generator script that writes it) in the session scratchpad. Keep numbered versions so you can go back.
4. **Preview loop** (from the repo root). All scripts accept `--view full|head|torso|legs|hands|x,y,w,h`.
   - Contact sheet on every character: `node .claude/skills/layer-part/scripts/compose.mjs --out <png> --part <layer>=<file-or-name> [--part headgear=bamboo-hat] [--bodies all]`
   - Close-up: the same command with `--view torso` (or another view) and `--cols 1`.
   - Outline check: `node .claude/skills/layer-part/scripts/check.mjs --part <layer>=<file> --out <png> [--body werewolf]`. Magenta is the body and head outline drawn on top. Black peeking out beside the magenta is a misalignment; a hairline is fine.
   - Numeric check: `node .claude/skills/layer-part/scripts/measure.mjs rows|cols <body.png> …` and the same command on your part. Diff the run centers; a good fit is within ±2px.
   - Grid: `node .claude/skills/layer-part/scripts/grid.mjs --image <png-or-svg> … --out <png> --view hands` to read coordinates by eye.
   - Read the PNGs yourself before showing Jason. Fix what you can see first.
5. **Check every body.** Werewolf is the outlier: its head reaches x 97–688 and y 85, with fur tufts outside the standard outline. Zombie variants add marks but share the outline.
6. **Show Jason the sheet and the close-up, and iterate.** His notes are design direction. Fold each one into the lessons below if it generalizes.
7. **Land it.** Copy the SVG to `characters/base/<layer>/<name>.svg` (or a character folder) and run `pnpm build`. Jason verifies in the browser; don't drive the browser yourself. Commit only when he asks.
8. **Record lessons.** Add new general rules to this file and part-specific ones to `outfit-part` or `headgear-part`. Note the date and the part that taught the rule.

## Other layers (no dedicated skill yet)

- **Eyes and mouths** sit in fixed face regions (see anatomy). Keep a new expression's size and position within the range of the existing ones so it fits every head.
- **Accessories held in a hand:**
  - Existing held items: the spoon and firecracker sit in the viewer's right hand (x≈523–621, y≈585–647); the scepter and tron disc sit in the viewer's left.
  - The grip end is notched where fingers would wrap, so the object reads as gripped even though it draws over the whole body.
  - Ask Jason for the hand grip masks before drawing one (see "Assets to request").
- **Face accessories** (glasses, eye patch) draw above eyes and below headgear, so a hat brim covers them.
- **Backgrounds** fill the full 800×800 canvas.

## Assets to request from the Photoshop templates

Jason can export vector edges from his templates. Ask for whichever ones the current part needs, and save them in `reference/templates/` as SVG with their source noted:

- Body outline as vector paths (would replace the measured `body_outline.py` points)
- Head outline per character, including werewolf fur and ears
- Default shadow regions: head-shadow oval, inside-leg shadow, any others
- Face regions for eyes and mouths
- Hand grip masks for held accessories, per hand
- Template palette and line weights, if they're defined there

## Lessons log

Add a dated line whenever a correction generalizes.

- 2026-10-25, bamboo hat: **curved lines on a cone read as a bowl.** Seams and shadow edges on a cone run straight from the apex.
- 2026-10-25, bamboo hat: **remove decorative highlights and accent lines that don't follow the form exactly.** They look wrong, not stylish.
- 2026-10-25, bamboo hat: **textures must read at display size.** The stage shows parts at half scale (400px). Small brick textures looked like steel diamond plate. Woven strips about 24px wide read as bamboo.
- 2026-10-25, Raiden outfit: **eyeballed edges miss by 5–15px.** Measure the body PNG and put edges on the outline's centerline.
- 2026-10-25, Raiden outfit: **Catmull-Rom smoothing overshoots at sharp corners.** Split the path there, or hide the corner under another element.
- 2026-10-25, Raiden outfit: **if one side is covered (for example by a ribbon), keep the visible margins symmetric with the other side.** A few pixels of asymmetry made a leg look misshapen.
- 2026-10-25, Raiden outfit: **things that hang from a belt come out from underneath it.** Draw them before the belt.
