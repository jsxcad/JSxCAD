import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRingSphere } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

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
  const shape = Shape.fromPolygonsToSolid(buildRingSphere({ resolution }));
  // Make convex.
  shape.toGeometry().solid.isConvex = true;
  return shape;
};

export const fromValue = (value) => unitSphere().scale(value);

export const fromRadius = ({ radius, resolution = 16 }) => unitSphere({ resolution }).scale(radius);

export const fromDiameter = ({ diameter, resolution = 16 }) => unitSphere({ resolution }).scale(diameter / 2);

export const Sphere = dispatch(
  'Sphere',
  // sphere()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // sphere(2)
  (value) => {
    assertNumber(value);
    return () => fromValue(value);
  },
  // sphere({ radius: 2, resolution: 5 })
  ({ radius, resolution = 16 }) => {
    assertNumber(radius);
    assertNumber(resolution);
    return () => fromRadius({ radius, resolution });
  },
  // sphere({ diameter: 2, resolution: 25 })
  ({ diameter, resolution = 16 }) => {
    assertNumber(diameter);
    assertNumber(resolution);
    return () => fromDiameter({ diameter, resolution });
  });

Sphere.fromValue = fromValue;
Sphere.fromRadius = fromRadius;
Sphere.fromDiameter = fromDiameter;

export default Sphere;
