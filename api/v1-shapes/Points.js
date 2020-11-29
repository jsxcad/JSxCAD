import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

export const fromPoints = (...args) =>
  Shape.fromPoints(args.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

export const Points = (...args) => fromPoints(...args);
Points.fromPoints = fromPoints;

export default Points;

Shape.prototype.Points = shapeMethod(Points);
