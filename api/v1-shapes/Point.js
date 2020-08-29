import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

export const fromPoint = ([x = 0, y = 0, z = 0]) => Shape.fromPoint([x, y, z]);
export const Point = (...args) => fromPoint([...args]);
Point.fromPoint = fromPoint;

export default Point;

Shape.prototype.Point = shapeMethod(Point);
