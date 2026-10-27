import { characters } from '../characters';

const STORAGE_KEY = 'avatar-snapshots';
export const MAX_SNAPSHOTS = 4;

// Stored snapshots outlive the parts they name. Drop ones whose character is gone and reset
// a missing body to 'default' and a missing part to 'none', so a load matches its thumbnail.
const sanitizeSnapshot = (snapshot) => {
  const { selections } = snapshot ?? {};
  const character = characters[selections?.character];
  if (!character) return null;

  const hasBody = character.bodies.some(body => body.label === selections.body);
  return {
    ...snapshot,
    selections: {
      character: character.label,
      body: hasBody ? selections.body : 'default',
      ...Object.fromEntries(character.layers.map(layer => {
        const hasPart = layer.parts.some(part => part.label === selections[layer.label]);
        return [layer.label, hasPart ? selections[layer.label] : 'none'];
      })),
    },
  };
};

const isSameSelections = (a, b) => {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...keys].every(key => a[key] === b[key]);
};

export const getSnapshots = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(stored)) return [];
    return stored.map(sanitizeSnapshot).filter(Boolean).slice(0, MAX_SNAPSHOTS);
  } catch {
    return [];
  }
};

// Newest first. Saving an avatar that's already in the list moves it to the front.
export const saveSnapshot = (selections, snapshots) => {
  const entry = { selections, createdAt: Date.now() };
  const next = [
    entry,
    ...snapshots.filter(snapshot => !isSameSelections(snapshot.selections, selections)),
  ].slice(0, MAX_SNAPSHOTS);

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage full or blocked: the snapshot still shows for this session
  }
  return next;
};
