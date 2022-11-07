import Group from './Group.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { getLeafs } from '@jsxcad/geometry';

export const each = Shape.registerMethod('each', (...args) => async (shape) => {
  console.log(`QQ/each`);
  const { shapesAndFunctions } = destructure(args);
  let [leafOp = (l) => l, groupOp = Group] = shapesAndFunctions;
  if (leafOp instanceof Shape) {
    const leafShape = leafOp;
    leafOp = (edge) => leafShape.to(edge);
  }
  console.log(`QQ/each/2`);
  const leafShapes = getLeafs(shape.toGeometry()).map((leaf) => leafOp(Shape.fromGeometry(leaf)));
  console.log(`QQ/each/3a: ${JSON.stringify(leafShapes)}`);
  const grouped = groupOp(...leafShapes);
  console.log(`QQ/each/3b`);
  if (grouped instanceof Function) {
    console.log(`QQ/each/4`);
    return grouped(shape);
  } else {
    console.log(`QQ/each/5: ${JSON.stringify(grouped)}`);
    return grouped;
  }
});
