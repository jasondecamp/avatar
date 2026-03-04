export const importDirectoryImages = (modules, prefix = '') => {
  const images = {};
  Object.keys(modules).forEach(key => {
    let name = key.replace(prefix, '').replace(/(\.\/|\.png)/g, '');
    let location = images;
    if (name.includes('/')) {
      const namespace = name.split('/');
      name = namespace.pop();
      namespace.forEach(directory => {
        if (!location[directory]) location[directory] = {};
        location = location[directory];
      });
    }
    location[name] = modules[key];
  });
  return images;
};

// Shortest-path circular distance → position string ('center' | 'next1' | ... | 'hidden').
// Callers resolve to their own CSS module class via CSS[getItemPositionClass(...)].
export const getItemPositionClass = (itemIndex, selectedIndex, length) => {
  let rel = ((itemIndex - selectedIndex) % length + length) % length;
  if (rel > Math.floor(length / 2)) rel -= length;
  switch (rel) {
    case  0: return 'center';
    case  1: return 'next1';
    case  2: return 'next2';
    case  3: return 'next3';
    case -1: return 'prev1';
    case -2: return 'prev2';
    case -3: return 'prev3';
    default: return 'hidden';
  }
};

// Pad by repeating the full list until we have at least 7 items.
export const padItems = (items) => {
  if (items.length >= 7) return items;
  let padded = [...items];
  while (padded.length < 7) padded = padded.concat(items);
  return padded;
};
