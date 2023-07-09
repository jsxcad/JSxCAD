import Group from './Group.js';
import Shape from './Shape.js';
import { getNotList as op } from '@jsxcad/geometry';

export const getNot = Shape.registerMethod3(
  ['getNot', 'gn'],
  ['inputGeometry', 'strings'],
  op,
  async (results, [geometry, _tags, groupOp = Group]) => {
    const input = Shape.fromGeometry(geometry);
    const leafShapes = [];
    for (const result of results) {
      leafShapes.push(Shape.fromGeometry(result));
    }
    return Shape.apply(input, groupOp, ...leafShapes);
  }
);

export const gn = getNot;
