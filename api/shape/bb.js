import Box from './Box.js';
import Empty from './Empty.js';
import Shape from './Shape.js';
import { measureBoundingBox } from '@jsxcad/geometry';

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

export const bb = Shape.chainable((offset = 1) => (shape) => {
  const geometry = shape.toConcreteGeometry();
  const bounds = measureBoundingBox(geometry);
  if (bounds === undefined) {
    return Empty();
  } else {
    const [min, max] = bounds;
    return Box()
      .hasC2(...add(min, [-offset, -offset, -offset]))
      .hasC1(...add(max, [offset, offset, offset]));
  }
});

Shape.registerMethod('bb', bb);
