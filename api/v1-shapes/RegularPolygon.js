import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { getCenter, getRadius } from '@jsxcad/geometry-plan';

import Spiral from './Spiral.js';
import { orRadius } from './orRadius.js';

export const RegularPolygon = (value = 1, sides = 5) => {
  const plan = orRadius(value);
  const spiral = Spiral((a) => [[getRadius(plan)]], {
    upto: 360,
    by: 360 / sides,
  }).at(getCenter(plan));
  return spiral.close();
};

Shape.prototype.RegularPolygon = shapeMethod(RegularPolygon);

export default RegularPolygon;
