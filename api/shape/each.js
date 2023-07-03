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
    console.log(`QQ/each/leafOp: ${leafOp}`);
    const leafShapes = [];
    const input = Shape.fromGeometry(geometry);
    for (const leaf of leafs) {
      leafShapes.push(
        await Shape.apply(input, leafOp, Shape.chain(Shape.fromGeometry(leaf)))
      );
    }
    return groupOp(...leafShapes)(input);
  }
);
