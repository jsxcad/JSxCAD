import Shape from './Shape.js';
import { rewriteTags } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-tool';

export const tool = Shape.registerMethod(
  'tool',
  (name) => async (shape) =>
    Shape.fromGeometry(
      rewriteTags(toTagsFromName(name), [], await shape.toGeometry())
    )
);
