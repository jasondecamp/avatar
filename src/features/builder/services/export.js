const STAGE_SIZE = 400;

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

export const generateAvatar = async (selections, characters) => {
  const character = characters[selections.character];

  // Resolve body/head images accounting for body selection
  const selectedBody = character.bodies.find(b => b.label === selections.body);
  const bodyImage = selectedBody?.bodyImage ?? character.bodyImage;
  const headImage = selectedBody?.headImage ?? character.headImage;

  // Look up the selected image for a given layer label
  const getLayerImage = (label) => {
    const layer = character.layers.find(l => l.label === label);
    if (!layer) return null;
    const partLabel = selections[label];
    if (!partLabel || partLabel === 'none') return null;
    const part = layer.parts.find(p => p.label === partLabel);
    return part?.image ?? null;
  };

  // Composite order matches the stage z-index stacking:
  //   backgrounds (z1) → body (z2) → outfits (z3) →
  //   head (z4) → mouths (z5) →
  //   eyes (z6) → headgear (z7) → accessories (z8)
  const orderedImages = [
    getLayerImage('backgrounds'),
    bodyImage,
    getLayerImage('outfits'),
    headImage,
    getLayerImage('mouths'),
    getLayerImage('eyes'),
    getLayerImage('headgear'),
    getLayerImage('accessories'),
  ].filter(Boolean);

  const canvas = document.createElement('canvas');
  canvas.width = STAGE_SIZE;
  canvas.height = STAGE_SIZE;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, STAGE_SIZE, STAGE_SIZE);

  for (const src of orderedImages) {
    const img = await loadImage(src);
    ctx.drawImage(img, 0, 0, STAGE_SIZE, STAGE_SIZE);
  }

  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avatar.png';
    a.click();
    URL.revokeObjectURL(url);
  }, 'image/png');
};
