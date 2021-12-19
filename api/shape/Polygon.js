import Shape from './Shape.js';

export const Polygon = (...points) =>
  Shape.fromClosedPath(
    points.map((point) => Shape.toCoordinate(undefined, point))
  ).fill();

export default Polygon;

Shape.prototype.Polygon = Shape.shapeMethod(Polygon);
