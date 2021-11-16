import Shape from './Shape.js';

export const Edge = (source, target) =>
  Shape.fromSegments([Shape.toCoordinate(source), Shape.toCoordinate(target)]);

export default Edge;

Shape.prototype.Edge = Shape.shapeMethod(Edge);
