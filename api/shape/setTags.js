import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';

export const setTags = Shape.registerMethod('setTags',
  (tags = []) =>
    (shape) =>
      Shape.fromGeometry(rewriteTags(tags, [], this.toGeometry())));
