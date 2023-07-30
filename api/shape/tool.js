import Shape from './Shape.js';
import { retag } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-tool';

export const tool = Shape.registerMethod3(
  'tool',
  ['inputGeometry', 'string'],
  (geometry, name) => retag(geometry, [], toTagsFromName(name))
);
