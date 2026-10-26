# To do

- **Finish snapshots.** `services/snapshots.js` saves and reads them, but the "+ create snapshot" button in `Builder.jsx` is commented out, so there's no way to save one yet.
- **Add a randomize option** that picks a random part for every layer.
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
