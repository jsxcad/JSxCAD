import Box from './Box.js';
import Empty from './Empty.js';
import Shape from './Shape.js';
import { measureBoundingBox } from '@jsxcad/geometry';

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

export const bb = Shape.registerMethod2(
  'bb',
  ['inputGeometry', 'number', 'number', 'number'],
  (geometry, xOffset = 1, yOffset = xOffset, zOffset = yOffset) => {
    const bounds = measureBoundingBox(geometry);
    if (bounds === undefined) {
      return Empty();
    } else {
      const [min, max] = bounds;
      return Box({
        c2: add(min, [-xOffset, -yOffset, -zOffset]),
        c1: add(max, [xOffset, yOffset, zOffset]),
      });
    }
  }
);
