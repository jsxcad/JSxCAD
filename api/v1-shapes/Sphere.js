import { buildRingSphere, toRadiusFromApothem } from '@jsxcad/algorithm-shape';

import Shape from '@jsxcad/api-v1-shape';

/**
 *
 * # Sphere
 *
 * Generates spheres.
 *
 * ::: illustration { "view": { "position": [5, 5, 5] } }
 * ```
 * Sphere()
 * ```
 * :::
 * ::: illustration { "view": { "position": [60, 60, 60] } }
 * ```
 * Sphere(10)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere({ radius: 8, resolution: 5 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Sphere({ diameter: 16, resolution: 64 })
 * ```
 * :::
 *
 **/

const unitSphere = (resolution = 16) => {
  const shape = Shape.fromGeometry(buildRingSphere(resolution));
  // Make convex.
  shape.toGeometry().solid.isConvex = true;
  return shape;
};

export const ofRadius = (radius = 1, { resolution = 16 } = {}) =>
  unitSphere(resolution).scale(radius);
export const ofApothem = (apothem = 1, { resolution = 16 } = {}) =>
  ofRadius(toRadiusFromApothem(apothem), { resolution });
export const ofDiameter = (diameter = 1, { resolution = 16 } = {}) =>
  ofRadius(diameter / 2, { resolution });

export const Sphere = (...args) => ofRadius(...args);

Sphere.ofApothem = ofApothem;
Sphere.ofRadius = ofRadius;
Sphere.ofDiameter = ofDiameter;

export default Sphere;
