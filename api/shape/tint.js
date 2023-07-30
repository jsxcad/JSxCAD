import Shape from './Shape.js';
import { retag } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-color';

// Tint adds another color to the mix.
export const tint = Shape.registerMethod3(
  'tint',
  ['inputGeometry', 'string'],
  (geometry, name) => retag(geometry, [], toTagsFromName(name))
);
