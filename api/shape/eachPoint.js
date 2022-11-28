import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { eachPoint as eachPointOfGeometry } from '@jsxcad/geometry';

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
        points.push(await pointOp(Point().move(x, y, z), nth++));
      }
      const grouped = groupOp(...points);
      if (Shape.isFunction(grouped)) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);
