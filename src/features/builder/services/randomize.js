import { RANDOM_REQUIRED_LAYERS } from './layers';

const pick = (items) => items[Math.floor(Math.random() * items.length)];

const getCandidates = (layer) => {
  if (!RANDOM_REQUIRED_LAYERS.has(layer.label)) return layer.parts;
  const parts = layer.parts.filter(part => part.label !== 'none');
  return parts.length > 0 ? parts : layer.parts;
};

// Character first, so the body and every part are picked from that character's own lists.
export const randomizeSelections = (characters) => {
  const character = pick(Object.values(characters));
  return {
    character: character.label,
    body: pick(character.bodies).label,
    ...Object.fromEntries(character.layers.map(layer => [layer.label, pick(getCandidates(layer)).label])),
  };
};
