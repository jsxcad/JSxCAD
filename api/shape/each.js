import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { getLeafs } from '@jsxcad/geometry';

export const each = Shape.registerMethod('each', (...args) => async (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [leafOp = (l) => l, groupOp = Group] = shapesAndFunctions;
  if (leafOp instanceof Shape) {
    const leafShape = leafOp;
    leafOp = (edge) => leafShape.to(edge);
  }
  const leafShapes = getLeafs(shape.toGeometry()).map((leaf) =>
    leafOp(Shape.fromGeometry(leaf))
  );
  const grouped = groupOp(...leafShapes);
  if (grouped instanceof Function) {
    return grouped(shape);
  } else {
    return grouped;
  }
});
