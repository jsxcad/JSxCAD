import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';

export const setTags = Shape.registerMethod2(
  'setTags',
  ['inputGeometry', 'strings'],
  (geometry, tags = []) => Shape.fromGeometry(rewriteTags(tags, [], geometry))
);
