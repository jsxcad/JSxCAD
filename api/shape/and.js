import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const and = Shape.registerMethod(
  'and',
  (...args) =>
    async (shape) =>
      Shape.fromGeometry(
        taggedGroup(
          {},
          await shape.toGeometry(),
          ...await shape.toShapesGeometries(args)
        )
      )
);

export default and;
