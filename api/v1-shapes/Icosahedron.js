import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { buildRegularIcosahedron } from '@jsxcad/algorithm-shape';
import { getRadius } from '@jsxcad/geometry-plan';
import { orRadius } from './orRadius.js';

const unitIcosahedron = () =>
  Shape.fromPolygonsToSolid(buildRegularIcosahedron({})).toGraph();

export const Icosahedron = (value = 1) => {
  const plan = orRadius(value);
  return unitIcosahedron().scale(getRadius(plan)).at(plan.at);
};

export default Icosahedron;

Shape.prototype.Icosahedron = shapeMethod(Icosahedron);
