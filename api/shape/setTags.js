import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';

export const setTags = Shape.registerMethod(
  'setTags',
  (tags = []) =>
    async (shape) =>
      Shape.fromGeometry(rewriteTags(tags, [], await shape.toGeometry()))
);
