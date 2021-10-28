import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Segments = (...segments) =>
  Shape.fromSegments(...segments.map(([source, target]) => [toCoordinate(source), toCoordinate(target)]));

export default Segments;

Shape.prototype.Segments = Shape.shapeMethod(Segments);
