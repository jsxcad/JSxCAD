import { eachSegment, taggedSegments } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const edges = Shape.chainable(() => (shape) => {
  const segments = [];
  eachSegment(Shape.toShape(shape, shape).toGeometry(), (segment) =>
    segments.push(segment)
  );
  return Shape.fromGeometry(taggedSegments({}, segments));
});

Shape.registerMethod('edges', edges);
