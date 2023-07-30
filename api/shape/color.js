import Shape from './Shape.js';
import { retag } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-color';

export const color = Shape.registerMethod3(
  'color',
  ['inputGeometry', 'string'],
  (geometry, name) => retag(geometry, ['color:*'], toTagsFromName(name))
);
