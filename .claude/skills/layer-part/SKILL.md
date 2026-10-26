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
- **Glow and energy effects** (see `accessories/lightning.svg`) are cel-shaded filled shapes, not strokes or gradients:
  - **One energy palette for every piece:** dark rim `#1a63d1`, blue `#2f8ff0`, pale `#9fd8ff`, white core `#effaff`. Auras, bolts and radiating bolts all use it, so they read as one effect.
  - **Aura:** jagged flame-edged bands in those tones around the object, cut out where the object is (`fill-rule='evenodd'` with the object's contour as a hole). For a hand, build the loop from the hand outline plus a rounded cap arcing just above the grip shadow (to y≈557), smoothed with Catmull-Rom. That way it surrounds the hand rather than running up the arm like a glove, and has no sharp corners at the thumb.
  - **The glowing object stays itself.** Over a hand, use translucent flat tones (a pale tint at about 45% opacity, a white highlight region at about 75%, and the grip shadow reproduced in blue at about 55%) so the skin shows through. Redraw its black outline on the measured centerline.
  - **Bolts** are filled ribbons layered rim → blue → pale → core, with big angular zigzags. A bolt connecting two auras is widest where it leaves each aura and narrowest mid-span, so its color bands continue from the aura's bands. Radiating bolts are short tapered versions of the same thing, starting at the aura's edge. Bolts that connect two auras start inside a tapered lobe each aura extends toward the other, so the energy flows out of the aura instead of out from behind it.
  - **Draw tone by tone, not object by object:** every rim shape (aura bands and bolts), then every blue, then every pale, then every white. Same-colored regions then merge, so the aura flows into the bolts. Every band the bolts have (including the white core) must also exist in the aura.
  - **No flat ends.** Every ribbon and branch end gets a jagged point; lightning edges can be chaotic but never stop on a straight cut.
  - **Gradients and blur** are only for the soft glow directly around the bolts.
  - The comic-book reference (glowing eyes in the dark) showed the approach: one jagged edge color, a highlight overlay, and tendrils of light around the shape.
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
- 2026-10-26, lightning: **default to filled, cel-shaded shapes with no gradients.** Thin stroked bolts read as wire, and radial-gradient auras looked generic and didn't follow the hands. Gradients are a special case (the glow right around an arc).
- 2026-10-26, lightning: **map effects to the measured contour of what they surround.** Ray-tracing the hand outline from its center (the center of each dark run) gave an exact contour to offset the aura from and to redraw.
- 2026-10-26, lightning: **check effects against the outfits they'll sit on.** Blue bolts vanished on the blue Raiden tabard until they got a darker edge.
- 2026-10-26, lightning: **an effect around an object shouldn't replace the object.** A solid white hand lost its skin color; translucent tints, highlight and shadow keep it. An aura running to the sleeves read as gloves; keep it centered on the hand.
- 2026-10-26, lightning: **offset shapes inherit their source's corners.** Following the arm crease into a straight wrist closure gave the aura sharp points at the thumbs; a smoothed, rounded loop fixed it.
- 2026-10-26, lightning: **energy flowing out of a source is widest at the source.** Bolts that swelled mid-span and pinched at the auras looked detached; flipping the taper connected them.
- 2026-10-26, lightning: **merging effects must be composited by color, not by object.** Drawing aura then bolt left the bolt's dark rim cutting into the aura's pale band and flat ends showing; drawing all rims, then blues, pales and whites made them one shape.
- 2026-10-26, lightning: **mixed styles look like separate effects.** Thin radiating spikes beside thick bolts didn't belong together; one shared palette and construction made it cohesive.
