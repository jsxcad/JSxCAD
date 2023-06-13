import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-tool';

export const tool = Shape.registerMethod2(
  'tool',
  ['inputGeometry', 'string'],
  (geometry, name) =>
    Shape.fromGeometry(rewriteTags(toTagsFromName(name), [], geometry))
);
