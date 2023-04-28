import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { eachPoint as eachPointOfGeometry } from '@jsxcad/geometry';
import { move } from './move.js';

export const eachPoint = Shape.registerMethod(
  'eachPoint',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions } = destructure(args);
      let [pointOp = (point) => (shape) => point, groupOp = Group] =
        shapesAndFunctions;
      const coordinates = [];
      let nth = 0;
      eachPointOfGeometry(await shape.toGeometry(), ([x = 0, y = 0, z = 0]) =>
        coordinates.push([x, y, z])
      );
      const points = [];
      for (const [x, y, z] of coordinates) {
        const point = await Point();
        const moved = await move(x, y, z)(point);
        const operated = await pointOp(Shape.chain(moved), nth++);
        points.push(operated);
      }
      const grouped = groupOp(...points);
      if (Shape.isFunction(grouped)) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);

export default eachPoint;
