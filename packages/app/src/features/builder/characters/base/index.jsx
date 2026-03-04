import { merge } from 'lodash';
import { importDirectoryImages } from '../../services/helpers';

import headImage from './head.png';
import bodyImage from './body.png';

const modules = import.meta.glob('./**/*.png', { eager: true, import: 'default' });
const baseLayers = importDirectoryImages(modules, './');

export const base = {
  label: 'base',
  headImage,
  bodyImage,
  layers: baseLayers,
};

const NONE_PART = { label: 'none', image: null };

const layerFromImages = (label, images, order) => images ? {
  label,
  order,
  parts: [NONE_PART, ...Object.keys(images).map(key => ({ label: key, image: images[key] }))],
} : null;

export const getCharacterLayerOptions = (characterLayers) => {
  const layers = merge({}, baseLayers, characterLayers);
  return [
    layerFromImages('eyes',        layers.eyes, 6),
    layerFromImages('mouths',      layers.mouths, 5),
    layerFromImages('outfits',     layers.outfits, 3),
    layerFromImages('headgear',    layers.headgear, 7),
    layerFromImages('accessories', layers.accessories, 8),
    layerFromImages('backgrounds', layers.backgrounds, 1),
  ].filter(Boolean);
};
