import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Edge = (source, target) =>
  Shape.fromSegments([toCoordinate(source), toCoordinate(target)]);

export default Edge;

Shape.prototype.Edge = Shape.shapeMethod(Edge);
