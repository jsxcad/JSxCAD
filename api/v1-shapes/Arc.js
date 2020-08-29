import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import Spiral from './Spiral.js';

export const ofRadius = (radius, angle = 360, { start = 0, sides = 32 } = {}) =>
  Spiral((a) => [[radius]], {
    from: start,
    to: start + angle,
    resolution: sides,
  });

export const Arc = (...args) => ofRadius(...args);
Arc.ofRadius = ofRadius;

Shape.prototype.Arc = shapeMethod(Arc);

export default Arc;
