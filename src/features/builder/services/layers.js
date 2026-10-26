// The one bottom-to-top stacking order for the stage, the PNG export and snapshot thumbnails.
// body and head come from the selected character/body; every other entry is a selectable part layer.
export const LAYER_STACK = [
  'backgrounds',
  'body',
  'outfits',
  'head',
  'mouths',
  'eyes',
  'accessories',
  'headgear',
];

export const getLayerZIndex = (label) => LAYER_STACK.indexOf(label) + 1;

// Resolves a selections snapshot to its layer images, bottom to top.
export const resolveLayerImages = (selections, characters) => {
  const character = characters[selections.character];
  if (!character) return [];

  const selectedBody = character.bodies.find(b => b.label === selections.body);
  const baseImages = {
    body: selectedBody?.bodyImage ?? character.bodyImage,
    head: selectedBody?.headImage ?? character.headImage,
  };

  const getPartImage = (label) => {
    const layer = character.layers.find(l => l.label === label);
    const partLabel = selections[label];
    if (!layer || !partLabel || partLabel === 'none') return null;
    return layer.parts.find(p => p.label === partLabel)?.image ?? null;
  };

  return LAYER_STACK
    .map(label => label in baseImages ? baseImages[label] : getPartImage(label))
    .filter(Boolean);
};
