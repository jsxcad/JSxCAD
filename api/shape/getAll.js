import Group from './Group.js';
import Shape from './Shape.js';
import { getAllList as op } from '@jsxcad/geometry';

// get, ignoring item boundaries.

export const getAll = Shape.registerMethod3(
  'getAll',
  ['inputGeometry', 'strings', 'function'],
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

export default getAll;
