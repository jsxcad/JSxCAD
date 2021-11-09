import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Edges = (...segments) =>
  Shape.fromSegments(
    ...segments.map(([source, target]) => [
      toCoordinate(source),
      toCoordinate(target),
    ])
  );

export default Edges;

Shape.prototype.Edges = Shape.shapeMethod(Edges);
