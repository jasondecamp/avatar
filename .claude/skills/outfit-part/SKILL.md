---
name: outfit-part
description: Create a new avatar outfit (shirt, gi, tabard, armor, pants, costume) as an SVG that follows the shared body outline exactly on every character. Use when Jason asks for a new outfit or costume for the avatar builder. Load the layer-part skill first; this adds the outfit-specific geometry, rules and tools.
---

# Creating an outfit

Load `layer-part` first for the workflow, preview scripts and house style. This skill covers what's specific to outfits. The worked example is `src/features/builder/characters/base/outfits/raiden.svg`: read it before starting.

## What an outfit is

- **One image** in `characters/base/outfits/`, holding top and bottoms together, as the airbender, tux and Raiden outfits do. There's no separate bottoms layer. A top-only outfit (like gii-red) is fine too.
- **Stacking:** drawn above the body and below the head. The head hides the neckline down to y≈504 at the chin. Hands belong to the body, so anything drawn over them hides them.
- **Clip to below the head.** The outfit picker shows each outfit on a dummy without a head, so anything drawn where the head would cover it shows there. Wrap the whole outfit in `<g clip-path='url(#below-head)'>` with a clipPath of `BELOW_HEAD` from `body_outline.py` (the region below the head's chin outline). All heads share the chin, including the werewolf. Check the outfit both with and without a head.

## Geometry: build from the measured outline

Don't trace by eye. Write a small scratch generator that imports the measured centerlines and writes the SVG:

```python
import sys; sys.path.insert(0, '.claude/skills/outfit-part/scripts')
from body_outline import *   # HEAD_CHIN, BELOW_HEAD, NECK, L/R_SHOULDER, L/R_ARM, L/R_HAND, L/R_TORSO, LEGS, L/R_HEM, SHORT_SLEEVE_SUIT, torso_x, smooth, segs, by_y, lift, P
```

- **Garment silhouette:** build it from those point chains and stroke it 12px, `stroke-linejoin='round'`. Its edge then sits exactly on the body outline. `SHORT_SLEEVE_SUIT` is a ready-made short-sleeve shirt-and-pants silhouette.
- **Elements that end at the hips** (belts, sashes, vests): put their ends on the torso lines. Use `torso_x('L', y)` / `torso_x('R', y)`, and use straight sides there, not smoothed corners.
- **Inner elements** (tabards, panels, lapels): clip them to the silhouette, or keep them inside the hip lines.
- **Corners:** `smooth()` overshoots at sharp corners. Build those paths as open chains joined with straight segments, and hide the straight joins under another element (a tabard's bottom edge under the sash, for example).
- **Verify fit** with `check.mjs` (no black outside the magenta) and the `measure.mjs` column diff (within ±2px) on the legs, hips and shoulders. Check the werewolf too: its shoulder fur pokes out above sleeves, which is expected and accepted.

## Rules

- **Sleeves** follow the gi: short flared caps whose hem meets the armpit line (`L_HEM`/`R_HEM`, a bell curve from tip to armpit). Forearms and hands stay bare so every skin color shows. Long sleeves or gloves would need the `L_HAND`/`R_HAND` outline; re-measure first.
- **Tabard and vest shoulders** follow the body's shoulder line from the neck out, then curve in to the armpit crease.
- **Neck openings** must reach below y≈505 to show past the chin. Raiden uses a rectangular cutout at x 334–446 down to y≈552, with crossed white lapels over a dark undershirt.
- **Belts and sashes** curve like a smile: highest on the hip lines, lowest at the belly center (Raiden: y 606 at the hips, about 15px lower at the center). Shade the bottom half of the band, not a highlight on top.
- **Hanging pieces** (ribbons, belt tails) are drawn before the belt so they come out from underneath. Let them angle outward below the hand rather than dropping straight down over a leg.
- **Skirt and apron panels** below a belt should be nearly hip-width, connected to the garment above, and end above the leg bottoms (y≈704–720) with a smile-curved hem. Keep the margins to the hip lines equal on both sides, even where something covers one side.
- **Shading** (translucent black, `fill-opacity='0.13'`, clipped to the silhouette):
  - a full-width head shadow across the chest and both shoulders (Raiden: ellipse cx 398, cy 490, rx 172, ry 34)
  - an inside-leg shadow arch around the crotch
  - drop shadows just below belts and hems
  - sleeve hem shadows: the hem curve and the same curve lifted 12px
  - no side-shade stripes
- **Colors:** pick from the reference. White garments use `#f6f6f3`, not pure white, so the outline and shading read.

## Lessons log

- 2026-10-25, Raiden: long sleeves with wraps covered the hands. Gi-style sleeves were the fix.
- 2026-10-25, Raiden: a sash curved the wrong way (center high) "betrayed the perspective". Bands must curve like a smile.
- 2026-10-25, Raiden: shadows must follow the same conventions as the other outfits (head oval, inside legs, under belts). Ad-hoc side shading looked inconsistent.
- 2026-10-25, Raiden: an apron that ran to the leg bottoms looked disconnected. A wider skirt ending above the legs reads as part of the tabard.
- 2026-10-26, Raiden: the neck cutout and undershirt poked above the chin on the picker's headless dummy. Clipping the outfit to BELOW_HEAD fixed it.
- 2026-10-25, Raiden: a skirt 7px narrower on the ribbon side made that leg look misshapen. Keep margins symmetric.
