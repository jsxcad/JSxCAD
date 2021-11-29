import Shape from './Shape.js';

export const Points = (...args) =>
  Shape.fromPoints(args.map((arg) => Shape.toCoordinate(undefined, arg)));

Shape.prototype.Points = Shape.shapeMethod(Points);

export default Points;
