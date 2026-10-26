import { merge } from 'lodash';
import { importDirectoryImages } from '../../services/helpers';
import { getLayerZIndex } from '../../services/layers';

import headImage from './head.png';
import bodyImage from './body.png';

const modules = import.meta.glob('./**/*.{png,svg}', { eager: true, import: 'default' });
const baseLayers = importDirectoryImages(modules, './');

export const base = {
  label: 'base',
  headImage,
  bodyImage,
  layers: baseLayers,
};

const NONE_PART = { label: 'none', image: null };

const layerFromImages = (label, images) => images ? {
  label,
  order: getLayerZIndex(label),
  parts: [NONE_PART, ...Object.keys(images).map(key => ({ label: key, image: images[key] }))],
} : null;

export const getCharacterLayerOptions = (characterLayers) => {
  const layers = merge({}, baseLayers, characterLayers);
  // Picker row order only; stacking comes from LAYER_STACK
  return [
    layerFromImages('eyes',        layers.eyes),
    layerFromImages('mouths',      layers.mouths),
    layerFromImages('outfits',     layers.outfits),
    layerFromImages('headgear',    layers.headgear),
    layerFromImages('accessories', layers.accessories),
    layerFromImages('backgrounds', layers.backgrounds),
  ].filter(Boolean);
};
