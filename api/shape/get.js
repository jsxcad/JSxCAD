import Group from './Group.js';
import Shape from './Shape.js';
import { getList as op } from '@jsxcad/geometry';

export const get = Shape.registerMethod3(
  ['get', 'g'],
  ['inputGeometry', 'strings', 'modes:inItem,not,pass', 'function'],
  op,
  async (results, [geometry, _tags, _mode, groupOp = Group]) => {
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
