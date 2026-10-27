# To do

- **Make the picker rows fully controlled.** `CarouselRow`, `BodyRow` and `CharacterRow` each keep their own padded index and sync it to `selectionIndex` with an effect, and they repeat the same navigation and key handling. Have `Builder` own the positions and share the navigation code, then drop the sync effects.
- **Replace the goku hair** (`headgear/goku-hair.png`) with an SVG in a cel-shaded anime style: large swept spikes with a flat base color, one shade tone and a few interior strand lines, instead of the current flat black shape. Jason has a reference image (white and grey spikes with purple side spikes).
- **Keep adding parts until every layer has at least 10 good options.** Use the `layer-part`, `outfit-part` and `headgear-part` skills. Counts on 2026-10-26, base parts shared by every character (plus character-only extras):

  | layer | base | character-only |
  |---|---|---|
  | backgrounds | 10 | — |
  | outfits | 12 | — |
  | headgear | 7 | human +2, zombie +2 |
  | accessories | 8 | — |
  | eyes | 9 | werewolf +1, zombie +1 |
  | mouths | 6 | vampire +1, werewolf +1 |

  Mouths, headgear, accessories and eyes are short. Some existing parts may not count as "good" yet.

  Part ideas (2026-10-26). Themed items are "inspired by" shapes and colors only, with no trademarked logos:

  - **Accessories:** sunglasses, over-ear headphones (Bose style), magic wand, flying broomstick, Quidditch gear
  - **Harry Potter inspired:** a house scarf accessory and a wizard robes outfit for each house
  - **Themed sets** (pick items per theme): Avengers, Doctor Who, Teenage Mutant Ninja Turtles, Dungeon Crawler Carl
