import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { buildRegularIcosahedron } from '@jsxcad/algorithm-shape';

/**
 *
 * # Icosahedron
 *
 * Generates tetrahedrons.
 *
 * ::: illustration { "view": { "position": [8, 8, 8] } }
 * ```
 * Icosahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Icosahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Icosahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitIcosahedron = () =>
  Shape.fromPolygonsToSolid(buildRegularIcosahedron({}));

export const ofRadius = (radius = 1) => unitIcosahedron().scale(radius);
export const ofDiameter = (diameter = 1) =>
  unitIcosahedron().scale(diameter / 2);
export const Icosahedron = (...args) => ofRadius(...args);

Icosahedron.ofRadius = ofRadius;
Icosahedron.ofDiameter = ofDiameter;

export default Icosahedron;

Shape.prototype.Icosahedron = shapeMethod(Icosahedron);
