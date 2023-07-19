import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';

export const setTags = Shape.registerMethod3(
  'setTags',
  ['inputGeometry', 'strings'],
  (geometry, tags = []) => rewriteTags(geometry, tags, [])
);
