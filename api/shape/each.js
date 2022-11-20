import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { getLeafs } from '@jsxcad/geometry';

export const each = Shape.registerMethod('each', (...args) => async (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [leafOp = (l) => l, groupOp = Group] = shapesAndFunctions;
  if (leafOp instanceof Shape) {
    const leafShape = leafOp;
    leafOp = (edge) => (shape) => leafShape.to(edge);
  }
  const leafShapes = [];
  const leafGeometries = getLeafs(await shape.toGeometry());
  for (const leafGeometry of leafGeometries) {
    leafShapes.push(await leafOp(Shape.fromGeometry(leafGeometry)));
  }
  const grouped = await groupOp(...leafShapes);
  if (Shape.isFunction(grouped)) {
    return grouped(shape);
  } else {
    return grouped;
  }
});
