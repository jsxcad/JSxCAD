import Shape from './Shape.js';
import { getLeafs } from '@jsxcad/geometry';

export const each =
  (
    leafOp = (leaf) => leaf,
    groupOp = (leafs, shape) => Shape.Group(...leafs)
  ) =>
  (shape) => {
    const leafShapes = getLeafs(shape.toGeometry()).map((leaf) =>
      leafOp(Shape.fromGeometry(leaf))
    );
    return groupOp(leafShapes, shape);
  };
Shape.registerMethod('each', each);
