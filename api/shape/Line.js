import Edge from './Edge.js';
import Group from './Group.js';
import Point from './Point.js';
import Shape from './Shape.js';

export const Line = (...extents) => {
  const offsets = Shape.toFlatValues(extents);
  if (offsets.length % 2 === 1) {
    offsets.push(0);
  }
  offsets.sort((a, b) => a - b);
  const edges = [];
  for (let nth = 0; nth < offsets.length; nth += 2) {
    const end = offsets[nth];
    const begin = offsets[nth + 1];
    edges.push(Edge(Point(begin), Point(end)));
  }
  return Group(...edges);
};

export default Line;

Shape.prototype.Line = Shape.shapeMethod(Line);
