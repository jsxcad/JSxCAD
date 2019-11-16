import { buildRingSphere, toRadiusFromApothem } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';

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

const unitSphere = ({ resolution = 16 } = {}) => {
  const shape = Shape.fromGeometry(buildRingSphere(resolution));
  // Make convex.
  shape.toGeometry().solid.isConvex = true;
  return shape;
};

export const ofApothem = (apothem = 1, resolution = 16) => ofRadius(toRadiusFromApothem(apothem), resolution);
export const ofRadius = (radius = 1, resolution = 16) => unitSphere({ resolution }).scale(radius);
export const ofDiameter = (diameter = 1, resolution = 16) => unitSphere({ resolution }).scale(diameter / 2);

export const Sphere = (...args) => ofRadius(...args);

Sphere.ofRadius = ofRadius;
Sphere.ofDiameter = ofDiameter;

export default Sphere;
