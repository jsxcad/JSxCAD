import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularPrism } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

const buildCylinder = ({ radius = 1, height = 1, resolution = 32 }) => {
  return Shape.fromSolid(buildRegularPrism({ edges: resolution })).scale([radius, radius, height]);
};

/**
 *
 * # Cylinder
 *
 * Generates cylinders.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * Cylinder()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder(10, 2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ radius: 2,
 *            height: 10,
 *            resolution: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ apothem: 2,
 *            height: 10,
 *            resolution: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ diameter: 6,
 *            height: 8,
 *            resolution: 16 })
 * ```
 * :::
 *
 **/

export const fromValue = (radius, height = 1, resolution = 32) => buildCylinder({ radius, height, resolution });

export const fromRadius = ({ radius, height = 1, resolution = 32 }) => buildCylinder({ radius, height, resolution });

const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);
export const fromApothem = ({ apothem, height = 1, resolution = 32 }) => buildCylinder({ radius: toRadiusFromApothem(apothem, resolution), height, resolution });

export const fromDiameter = ({ diameter, height = 1, resolution = 32 }) => buildCylinder({ radius: diameter / 2, height, resolution });

export const Cylinder = dispatch(
  'cylinder',
  // cylinder()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  (radius, height = 1, resolution = 32) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(resolution);
    return () => fromValue(radius, height, resolution);
  },
  ({ radius, height = 1, resolution = 32 }) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(resolution);
    return () => fromRadius({ radius, height, resolution });
  },
  ({ apothem, height = 1, resolution = 32 }) => {
    assertNumber(apothem);
    assertNumber(height);
    assertNumber(resolution);
    return () => fromApothem({ apothem, height, resolution });
  },
  ({ diameter, height = 1, resolution = 32 }) => {
    assertNumber(diameter);
    assertNumber(height);
    assertNumber(resolution);
    return () => fromDiameter({ diameter, height, resolution });
  });

Cylinder.fromValue = fromValue;
Cylinder.fromRadius = fromRadius;
Cylinder.fromDiameter = fromDiameter;

export default Cylinder;
