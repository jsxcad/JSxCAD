import Link from './Link.js';
import Point from './Point.js';
import Shape from './Shape.js';
import bezier from 'adaptive-bezier-curve';

export const Curve = (start, c1, c2, end) => {
  const p1 = Shape.toCoordinate(undefined, start);
  const p2 = Shape.toCoordinate(undefined, c1);
  const p3 = Shape.toCoordinate(undefined, c2);
  const p4 = Shape.toCoordinate(undefined, end);
  const points = bezier(p1, p2, p3, p4, 10);
  return Link(points.map((point) => Point(point)));
};
