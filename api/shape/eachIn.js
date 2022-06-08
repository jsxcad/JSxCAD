import Shape from './Shape.js';
import { getLeafsIn } from '@jsxcad/geometry';

export const eachIn = Shape.chainable(
  (
      leafOp = (leaf) => leaf,
      groupOp = (leafs, shape) => Shape.Group(...leafs)
    ) =>
    (shape) => {
      const leafShapes = getLeafsIn(shape.toGeometry()).map((leaf) =>
        leafOp(Shape.fromGeometry(leaf))
      );
      return groupOp(leafShapes, shape);
    }
);
Shape.registerMethod('eachIn', eachIn);
