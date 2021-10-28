import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Segment = (source, target) =>
  Shape.fromSegments([toCoordinate(source), toCoordinate(target)]);

export default Segment;

Shape.prototype.Segment = Shape.shapeMethod(Segment);
