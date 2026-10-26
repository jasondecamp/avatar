# Template anatomy (800×800 canvas)

Measured from the existing PNGs on 2026-10-25 with `measure.mjs bbox|rows|cols`. Viewer's left = L.
Re-measure before relying on a number for a new kind of part. Replace this with Jason's template exports when they arrive.

## Body (all characters share the silhouette)

- Bounding box x 152–621, y 456–750.
- Outline about 10–12px thick. The centerline points are in `.claude/skills/outfit-part/scripts/body_outline.py`.
- **Neck** points at (300,461) L and (481,458) R. The head covers everything above y≈504 at the center.
- **Shoulders** slope from the neck out to the arms. The outer arm edge reaches x≈180 / 604 at y≈547.
- **Arm/torso crease:** a tapering wedge from (288,528) L and (491,522) R down to y≈600, where it becomes the torso side line.
- **Torso sides (hip lines):** L from (271,566) to (217.5,726); R from (509,566) to (554.5,726). At y 636 they're at x 245 / 532.5.
- **Hands:** the rounded ends of the arms. L: x≈152–239, y≈585–652. R: x≈523–621, y≈585–647. Their inner edges sit beside the torso lines at y≈600–645.
- **Legs:** the bottom outline dips to y≈744.5 mid-leg and curves up to the corners (224,734.5) and (551.5,732). The crotch gap is x≈368–408, with its top at (388,687.5).
- **Built-in shading:**
  - a head-shadow oval at x≈340–530, y≈478–517 (offset right)
  - a grey inside-leg region at x≈350–430, y≈655–745
  - grey patches on the hands and in the armpits

## Head

| character | bounding box |
|---|---|
| base, human, vampire, zombie | x 167–616, y 100–504 |
| werewolf | x 97–688, y 85–505 (spiky fur on top, wide pointed ears at y≈295–420) |

- **Crown** at y≈100.
- **Ears** at x≈167–212 and x≈570–616, y≈305–440.
- **Head width at forehead height** (y≈300): x≈205–580.

## Face regions (from existing parts)

- **Eyes:** x 241–543, y 282–406 across all eye parts. Most fall within x 265–525, y 295–395. Brows sit at y≈340–345 and pupils at y≈355.
- **Mouths:** x 324–459, y 397–476, center x≈400.

## Existing parts, for scale

| part | bounding box |
|---|---|
| headgear/knit-hat | x 184–664, y 0–322 |
| headgear/crown | x 124–570, y 0–280 |
| headgear/goku-hair | x 100–639, y 4–346 |
| headgear/bamboo-hat (SVG) | x 34–748, y 30–378 (brim at y≈250–340, shades the brows) |
| accessories/glasses | x 223–562, y 285–424 |
| accessories/firecracker | x 528–799, y 434–644 (held, R hand) |
| accessories/big-spoon | x 527–784, y 250–668 (held, R hand) |
| accessories/scepter | x 23–255, y 405–638 (held, L hand) |
