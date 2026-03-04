import { importDirectoryImages } from '../../services/helpers';
import { getCharacterLayerOptions } from '../base';

const modules = import.meta.glob('./**/*.png', { eager: true, import: 'default' });
const layers = importDirectoryImages(modules, './');

const bodies = Object.keys(layers.bodies).map(key => ({
  label: key,
  bodyImage: layers.bodies[key].body,
  headImage: layers.bodies[key].head,
}));

export const zombie = {
  label: 'zombie',
  headImage: layers.bodies.default.head,
  bodyImage: layers.bodies.default.body,
  bodies,
  layers: getCharacterLayerOptions(layers),
};
