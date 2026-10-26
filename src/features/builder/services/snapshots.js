const STORAGE_KEY = 'avatar-snapshots';
const MAX_SNAPSHOTS = 4;

export const getSnapshots = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
};

export const saveSnapshot = (selections) => {
  const snapshots = getSnapshots();
  const entry = { selections, createdAt: Date.now() };

  if (snapshots.length < MAX_SNAPSHOTS) {
    snapshots.push(entry);
  } else {
    const oldestIndex = snapshots.reduce(
      (minIdx, snap, idx, arr) => snap.createdAt < arr[minIdx].createdAt ? idx : minIdx,
      0,
    );
    snapshots[oldestIndex] = entry;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshots));
};
