import { Link, seq, translate } from '@jsxcad/geometry';

import Point from './Point.js';
import Shape from './Shape.js';

export const Wave = Shape.registerMethod3(
  'Wave',
  ['inputGeometry', 'function', 'options'],
  async (geometry, particle = Point, options) => {
    let particles = [];
    for (const [xDistance] of seq(options)) {
      particles.push(
        translate(await Shape.applyToGeometry(geometry, particle, xDistance), [
          xDistance,
          0,
          0,
        ])
      );
    }
    return Link(particles);
  }
);

export default Wave;
