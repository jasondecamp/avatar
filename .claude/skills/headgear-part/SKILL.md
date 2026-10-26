---
name: headgear-part
description: Create a new avatar hat, helmet, hair or other headgear as an SVG that fits every character's head, including the werewolf's fur and ears. Use when Jason asks for a new hat, hairstyle, crown, helmet or headwear for the avatar builder. Load the layer-part skill first; this adds headgear-specific rules and tools.
---

# Creating headgear

Load `layer-part` first for the workflow, preview scripts and house style. The worked example is `src/features/builder/characters/base/headgear/bamboo-hat.svg`: read it before starting.

## Placement

- **Stacking:** headgear is the top layer, above eyes, mouths and accessories, so it covers glasses and eye patches.
- **Fit every head.** Most heads span x 167–616, y 100–504, with the crown of the head at y≈100. The werewolf is wider and taller: fur up to y≈85, ears out to x≈97–688 at y≈295–420. Whatever should cover the top of the head must also cover the werewolf's fur (check its silhouette at the top and the upper slopes).
- **Height of the front edge:** brows sit at y≈340–345 and pupils at y≈355.
  - A brim ending above y≈300 leaves the forehead clear.
  - The bamboo hat's front brim dips to y≈340 at the center to shade the brows, which reads as tilted forward.
- **Shadow on the face:** a translucent black lens (`fill-opacity='0.16–0.2'`) under the front edge, kept inside the head width at that height (about x 214–570 at y≈330–378).

## Shapes and perspective

- **Tilt:** lean the whole hat a few degrees, `rotate(-3 cx cy)`, to match the existing hats' slightly off-center lean.
- **Forward tilt:** a flatter, wider shape with a deeper front arc and the apex sitting lower relative to the brim tips.
- **Cones:** keep the silhouette sides straight to a sharp apex, with a knob over the point. Seams, stripes and shadow edges must run straight from the apex to the brim. Curved sides or curved lines on the surface make it read as a bowl.
- **Shadow side:** flat light comes from the upper left, so the right side gets one translucent shade region with a straight edge from the apex.
- **Trim:** a brim binding is a wide stroke of the front rim path, clipped to the silhouette, under the 11px outline.

## Textures

- **Readability:** the stage shows parts at 400px (half scale), so detail must be bold. Lines thinner than about 3px, or repeats smaller than about 20px, turn to noise or read as metal.
- **Woven material:** use a `<pattern>` of flat strips going over and under each other (the bamboo hat uses a herringbone twill with a 24px strip unit). Write a throwaway generator in the scratchpad if the repeat is fiddly. Light and dark strips alternate direction, with a darker gap color and thin edge strokes.
- **Applying a texture:** fill the clipped silhouette with the pattern, then lay the shade region and trim on top.

## Lessons log

- 2026-10-25, bamboo hat: a convex-sided cone read as a bowl. Straight sides and a sharp apex fixed it.
- 2026-10-25, bamboo hat: curved seam and shadow lines on the cone also read as a bowl. They must be straight from the apex.
- 2026-10-25, bamboo hat: brick and fine herringbone line textures looked like diamond-plate steel. Wide woven strips going over and under read as thatched bamboo.
- 2026-10-25, bamboo hat: decorative highlight lines and a badge added noise. Removing them improved it.
- 2026-10-25, bamboo hat: steep cones let werewolf fur poke out along the upper slopes. Widen or raise the shape and re-check the werewolf.
- 2026-10-26, halo: Jason drew `headgear/halo.png` himself after a flat gold-hoop SVG missed. **Glowing or holy objects get a gradient fill, a soft glow, and translucency where they cross the head.** The outline stays black; the translucency is what makes it look grey. Opaque flat gold read as a metal ring or coin.
- 2026-10-26, halo: **a floating ring sits low and tilted, overlapping the top of the head,** not in the thin gap between the crown and the canvas edge. His spans x≈163–528, y≈6–176, leans strongly and is shifted left, so the opening is clearly visible. A ring squeezed above the crown came out too flat and small.
- 2026-10-26, laurel wreath: Jason drew `headgear/laurel.png` himself after the generated versions missed. **Wrapping headgear doesn't need a back half.** His wreath has none and stays inside the head outline (x≈182–597, y≈166–310), so it needs no clipping and one file fits every character, the werewolf included. Each branch hugs the side of the head and rises toward the forehead, with the tips pointing up and in and a wide gap at the top. Try that before reaching for a perspective ring with a masked back half and a separate werewolf file (the crown's back points are the exception, not the default).
- 2026-10-26, laurel wreath: **fewer, bigger, hand-varied leaves** (about six per side) with a soft drop shadow on the head beat a dense, evenly generated ring.
- 2026-10-26, laurel wreath: laurel leaves point toward the branch tips, which meet at the front; the branches start at the back.
- 2026-10-26, laurel wreath: a later pass (lower ring, perspective-flattened side leaves, leaves tapering toward the back, a forward tip leaf) came out worse than the first draft, and Jason took the part over himself. What went wrong:
  - **A tip leaf has to sit at the very end of the branch, beyond the others.** Adding it at the first leaf station squeezed it in among the leaves around it.
  - **Generated leaves need variation** in size, angle and spacing. Uniform repeats looked mechanical.
  - **Too many leaves ran sideways around the outside of the head.** Flattening the side leaves didn't fix that; there should be fewer of them.
  - When a revision loses what made the earlier draft work, go back to the earlier draft and change only what was asked.
