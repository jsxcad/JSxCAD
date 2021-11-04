import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Polygon = (...points) =>
  Shape.fromClosedPath(points.map((point) => toCoordinate(point)));

export default Polygon;

Shape.prototype.Polygon = Shape.shapeMethod(Polygon);
