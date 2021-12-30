import Edge from './Edge.js';
import Point from './Point.js';
import Shape from './Shape.js';

export const Line = (forward, backward = 0) =>
  Edge(Point(forward), Point(backward));

export default Line;

Shape.prototype.Line = Shape.shapeMethod(Line);
