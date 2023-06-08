import Group from './Group.js';
import Shape from './Shape.js';
import { getLeafs } from '@jsxcad/geometry';

export const each = Shape.registerMethod2(
  'each',
  ['input', 'function', 'function'],
  async (input, leafOp = (l) => l, groupOp = Group) => {
    const leafShapes = [];
    const leafGeometries = getLeafs(await input.toGeometry());
    for (const leafGeometry of leafGeometries) {
      leafShapes.push(
        await leafOp(Shape.chain(Shape.fromGeometry(leafGeometry)))
      );
    }
    const grouped = await groupOp(...leafShapes);
    if (Shape.isFunction(grouped)) {
      return grouped(input);
    } else {
      return grouped;
    }
  }
);
