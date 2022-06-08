import Shape from './Shape.js';
import { taggedGroup } from '@jsxcad/geometry';

export const and = Shape.chainable(
  (...args) =>
    (shape) =>
      Shape.fromGeometry(
        taggedGroup(
          {},
          shape.toGeometry(),
          ...shape.toShapes(args).map((shape) => shape.toGeometry())
        )
      )
);

Shape.registerMethod('and', and);

export default and;
