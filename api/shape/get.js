import Group from './Group.js';
import Shape from './Shape.js';
import { get as op } from '@jsxcad/geometry';

export const get = Shape.registerMethod3(
  ['get', 'g'],
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

export const g = get;

export default get;
