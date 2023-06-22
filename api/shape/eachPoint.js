import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { eachPoint as eachPointOfGeometry } from '@jsxcad/geometry';
import { move } from './move.js';

export const eachPoint = Shape.registerMethod2(
  'eachPoint',
  ['input', 'function', 'function'],
  async (input, pointOp = (point) => (shape) => point, groupOp = Group) => {
    const coordinates = [];
    eachPointOfGeometry(await input.toGeometry(), ([x = 0, y = 0, z = 0]) =>
      coordinates.push([x, y, z])
    );
    const points = [];
    for (const [x, y, z] of coordinates) {
      const point = await Point();
      const moved = await move(x, y, z)(point);
      const operated = await Shape.apply(input, pointOp, moved);
      points.push(operated);
    }
    console.log(`QQ/Points: ${JSON.stringify(points)}`);
    return groupOp(...points)(input);
  }
);

export default eachPoint;
