import Shape from './Shape.js';

export const Edge = (source, target) =>
  Shape.fromSegments([
    Shape.toCoordinate(undefined, source),
    Shape.toCoordinate(undefined, target),
  ]);

export default Edge;

Shape.prototype.Edge = Shape.shapeMethod(Edge);
