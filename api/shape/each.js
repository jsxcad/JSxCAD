import Shape from './Shape.js';
import { getLeafs } from '@jsxcad/geometry';

export const each =
  (leafOp = (leaf) => leaf, groupOp = Shape.Group) =>
  (shape) => {
    const leafShapes = getLeafs(shape.toGeometry()).map((leaf) =>
      shape.op(leafOp(Shape.fromGeometry(leaf)))
    );
    const grouped = groupOp(leafShapes);
    if (grouped instanceof Function) {
      return grouped(shape);
    } else {
      return grouped;
    }
  };
Shape.registerMethod('each', each);
