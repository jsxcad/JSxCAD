import Shape from './Shape.js';

export const Point = (...args) => Shape.fromPoint(Shape.toCoordinate(...args));

Shape.prototype.Point = Shape.shapeMethod(Point);

export default Point;
