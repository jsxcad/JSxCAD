import Group from './Group.js';
import Shape from './Shape.js';
import { each as op } from '@jsxcad/geometry';

export const each = Shape.registerMethod3(
  'each',
  ['inputGeometry', 'function', 'function'],
  op,
  async (
    leafs,
    [geometry, leafOp = (leaf) => (_shape) => leaf, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const leafShapes = [];
    for (const leaf of leafs) {
      leafShapes.push(
        await Shape.apply(input, leafOp, Shape.chain(Shape.fromGeometry(leaf)))
      );
    }
    return Shape.apply(input, groupOp, ...leafShapes);
  }
);
