import { resolveLayers } from './layers';

const STAGE_SIZE = 400;

// Canvas uses the CSS blend mode names, except that plain drawing is 'source-over'
const toCompositeOperation = (blendMode) => blendMode === 'normal' ? 'source-over' : blendMode;

const loadImage = (src) => new Promise((resolve, reject) => {
  const img = new Image();
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = src;
});

export const generateAvatar = async (selections, characters) => {
  const layers = resolveLayers(selections, characters);

  const canvas = document.createElement('canvas');
  canvas.width = STAGE_SIZE;
  canvas.height = STAGE_SIZE;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'transparent';
  ctx.fillRect(0, 0, STAGE_SIZE, STAGE_SIZE);

  for (const { image, blendMode } of layers) {
    const img = await loadImage(image);
    ctx.globalCompositeOperation = toCompositeOperation(blendMode);
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
