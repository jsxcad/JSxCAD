import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { buildRegularIcosahedron } from '@jsxcad/algorithm-shape';

const unitIcosahedron = () =>
  Shape.fromPolygonsToSolid(buildRegularIcosahedron({})).toGraph();

export const ofRadius = (radius = 1) => unitIcosahedron().scale(radius);
export const ofDiameter = (diameter = 1) =>
  unitIcosahedron().scale(diameter / 2);
export const Icosahedron = (...args) => ofRadius(...args);

Icosahedron.ofRadius = ofRadius;
Icosahedron.ofDiameter = ofDiameter;

export default Icosahedron;

Shape.prototype.Icosahedron = shapeMethod(Icosahedron);
