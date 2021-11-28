import Shape from './Shape.js';

export const Point = (...args) =>
  Shape.fromPoint(Shape.toCoordinate(undefined, ...args));

Shape.prototype.Point = Shape.shapeMethod(Point);

export default Point;
