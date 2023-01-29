import Group from './Group.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { getLeafs } from '@jsxcad/geometry';

export const each = Shape.registerMethod('each', (...args) => async (shape) => {
  const [leafOp = (l) => l, groupOp = Group] = await destructure2(
    shape,
    args,
    'function',
    'function'
  );
  const leafShapes = [];
  const leafGeometries = getLeafs(await shape.toGeometry());
  for (const leafGeometry of leafGeometries) {
    leafShapes.push(
      await leafOp(Shape.chain(Shape.fromGeometry(leafGeometry)))
    );
  }
  const grouped = await groupOp(...leafShapes);
  if (Shape.isFunction(grouped)) {
    return grouped(shape);
  } else {
    return grouped;
  }
});
