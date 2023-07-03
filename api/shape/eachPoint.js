import Group from './Group.js';
import Shape from './Shape.js';
import { toPointList as op } from '@jsxcad/geometry';

export const eachPoint = Shape.registerMethod3(
  'eachPoint',
  ['inputGeometry', 'function', 'function'],
  op,
  async (
    pointList,
    [geometry, pointOp = (point) => (_shape) => point, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const shapes = [];
    for (const point of pointList) {
      shapes.push(
        await Shape.apply(
          input,
          pointOp,
          Shape.chain(Shape.fromGeometry(point))
        )
      );
    }
    return Shape.apply(Shape.chain(input), groupOp, ...shapes);
  }
);

export default eachPoint;
