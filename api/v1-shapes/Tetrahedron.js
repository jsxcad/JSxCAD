import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';
import { buildRegularTetrahedron } from '@jsxcad/algorithm-shape';
import { taggedSolid } from '@jsxcad/geometry-tagged';

/**
 *
 * # Tetrahedron
 *
 * Generates tetrahedrons.
 *
 * ::: illustration { "view": { "position": [8, 8, 8] } }
 * ```
 * Tetrahedron()
 * ```
 * :::
 * ::: illustration { "view": { "position": [80, 80, 80] } }
 * ```
 * Tetrahedron(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Tetrahedron({ radius: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Tetrahedron({ diameter: 16 })
 * ```
 * :::
 *
 **/

const unitTetrahedron = () =>
  Shape.fromGeometry(taggedSolid({}, buildRegularTetrahedron({})));

export const ofRadius = (radius = 1) => unitTetrahedron().scale(radius);
export const ofDiameter = (diameter = 1) =>
  unitTetrahedron().scale(diameter / 2);

export const Tetrahedron = (...args) => ofRadius(...args);

Tetrahedron.ofRadius = ofRadius;
Tetrahedron.ofDiameter = ofDiameter;

export default Tetrahedron;

Shape.prototype.Tetrahedron = shapeMethod(Tetrahedron);
