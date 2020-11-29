import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { getRadius, getSides } from '@jsxcad/geometry-plan';

import Spiral from './Spiral.js';
import { orRadius } from './orRadius.js';

export const Arc = (value = 1, angle = 360, start = 0) => {
  const plan = orRadius(value);
  return Spiral((a) => [[getRadius(plan)]], {
    from: start - 90,
    upto: start + angle - 90,
    by: 360 / getSides(plan),
  }).at(plan.at);
};

Shape.prototype.Arc = shapeMethod(Arc);

export default Arc;
