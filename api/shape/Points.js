import Shape from './Shape.js';

export const Points = (points) =>
  Shape.fromPoints(points.map((arg) => Shape.toCoordinate(undefined, arg)));

Shape.prototype.Points = Shape.shapeMethod(Points);

export default Points;
