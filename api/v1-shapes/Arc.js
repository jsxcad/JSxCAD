import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { getCenter, getRadius, getSides } from '@jsxcad/geometry-plan';

import Spiral from './Spiral.js';

export const Arc = (plan, angle = 360, start = 0) =>
  Spiral((a) => [[getRadius(plan)]], {
    from: start - 90,
    to: start + angle - 90,
    by: 360 / getSides(plan),
  }).move(...getCenter(plan));

Shape.prototype.Arc = shapeMethod(Arc);

export default Arc;
