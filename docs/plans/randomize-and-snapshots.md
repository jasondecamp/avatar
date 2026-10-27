# Randomizer and snapshots

Agreed 2026-10-26. Branch `jd/feat/randomize-and-snapshots`, one PR into `main`. Verify with `pnpm build`; Jason runs the browser check.

## Layout and UI

- Build toward mockup #35: one row of three round icon buttons (shuffle, a larger green "create me", save snapshot), with the recent snapshots strip below. The "+ create snapshot" tab under the stage goes away.
- Add `lucide-react` at an exact version. Icons: `Shuffle`, `SquareUser`, `BookmarkPlus`.
- New compound `Tooltip` in `features/common/components` (`Tooltip`, `Tooltip.Trigger`, `Tooltip.Content`).
  - CSS-only: shows on `:hover` and `:focus-visible` with a `0.2s` transition. No JS state, no positioning library. Touch users get no tooltip.
  - The root makes an id with `useId()` and shares it through context with a safe default.
  - The tooltip text is the button's accessible name: `Tooltip.Trigger` clones its child to add `aria-labelledby={id}`, and `Tooltip.Content` renders `<span role='tooltip' id={id}>`. No separate `aria-label`.
- The buttons are plain `<button>`s in a plain `<div className={CSS.actions}>`. No `IconButton` or `variant` component; primary and secondary differ by class only.
- Snapshot strip follows #35: white tiles, each showing `characters/base/blank.png` underneath, with the dark "recent snapshots" label bar below.
  - Filled tiles are `<button>`s labelled "Load snapshot N", with the snapshot layers drawn over the outline.
  - Empty tiles are `<div>`s; the outline image has `alt=''`.
  - Transitions use `0.2s`.

## Randomizer

- A roll picks a random character, then a random body for that character, then a random part on every layer from that character's own lists.
- `none` is never picked for `eyes`, `mouths` or `backgrounds` (`RANDOM_REQUIRED_LAYERS` in `services/layers.js`). It's an ordinary candidate for `outfits`, `headgear` and `accessories`.
- Pure function `randomizeSelections(characters)` in `services/randomize.js`, using `Math.random`. `Builder` calls `setSelections(randomizeSelections(characters))`.
- No keyboard shortcut.
- Keep the existing carousel transitions; judge them in the browser.

## Snapshots

- Newest first, capped at 4: `[entry, ...rest].slice(0, MAX_SNAPSHOTS)`.
- Saving a duplicate (every `selections` key equal) removes the old copy first, so it moves to the front. The first slot changing is the only feedback.
- `getSnapshots` cleans what it reads: snapshots whose character no longer exists are dropped, a missing body becomes `default`, and a missing part becomes `none`.
- Loading replaces the current avatar without confirmation and doesn't change the snapshot list. No delete.
- `Builder` owns `snapshots` state via `useState(getSnapshots)`. `saveSnapshot(selections, snapshots)` returns the new list. The `snapshotVersion` key goes away; `RecentSnapshots` takes `snapshots` and `onLoad`.

## Groundwork

- `CharacterRow` takes a `selectionIndex` prop and uses the same sync effect as `CarouselRow` and `BodyRow`, so external changes (roll, snapshot load) move it.
- `Builder` stores `activeLayerLabel` instead of an index and derives the index from `layers`. If the label is gone (e.g. `body` after switching to a single-body character), it falls back to `character`.

## Follow-up (separate work)

- Make `CarouselRow`, `BodyRow` and `CharacterRow` fully controlled by `Builder` and share their navigation and key handling, removing the sync effects.
