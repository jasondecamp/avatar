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

// Parts that blend with the layers beneath them instead of drawing over them, keyed '<layer>/<part>'.
// Values are CSS mix-blend-mode names (multiply, screen, overlay, color, hue, …). The stage, the PNG
// export and the snapshot thumbnails all apply them.
const PART_BLEND_MODES = {};

export const getBlendMode = (layerLabel, partLabel) => PART_BLEND_MODES[`${layerLabel}/${partLabel}`] ?? 'normal';

// Resolves a selections snapshot to its layers, bottom to top, as { image, blendMode }.
export const resolveLayers = (selections, characters) => {
  const character = characters[selections.character];
  if (!character) return [];

  const selectedBody = character.bodies.find(b => b.label === selections.body);
  const baseImages = {
    body: selectedBody?.bodyImage ?? character.bodyImage,
    head: selectedBody?.headImage ?? character.headImage,
  };

  const getPart = (label) => {
    const layer = character.layers.find(l => l.label === label);
    const partLabel = selections[label];
    if (!layer || !partLabel || partLabel === 'none') return null;
    return layer.parts.find(p => p.label === partLabel) ?? null;
  };

  return LAYER_STACK
    .map(label => label in baseImages ? { image: baseImages[label], blendMode: 'normal' } : getPart(label))
    .filter(layer => layer?.image != null);
};
