import { Link, rotateZ, seq } from '@jsxcad/geometry';

import Point from './Point.js';
import Shape from './Shape.js';

export const Spiral = Shape.registerMethod3(
  'Spiral',
  ['inputGeometry', 'function', 'options'],
  async (geometry, particle = Point, options) => {
    let particles = [];
    for (const [turn] of seq(options)) {
      particles.push(
        rotateZ(await Shape.applyToGeometry(geometry, particle, turn), turn)
      );
    }
    const result = await Link(particles);
    return result;
  }
);

export default Spiral;
