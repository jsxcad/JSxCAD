import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularPrism } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

const buildCylinder = ({ radius = 1, height = 1, sides = 32 }) => {
  return Shape.fromSolid(buildRegularPrism({ edges: sides })).scale([radius, radius, height]);
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
 *            sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ apothem: 2,
 *            height: 10,
 *            sides: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * Cylinder({ diameter: 6,
 *            height: 8,
 *            sides: 16 })
 * ```
 * :::
 *
 **/

export const fromValue = (radius, height = 1, sides = 32) => buildCylinder({ radius, height, sides });

export const fromRadius = ({ radius, height = 1, sides = 32 }) => buildCylinder({ radius, height, sides });

const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);
export const fromApothem = ({ apothem, height = 1, sides = 32 }) => buildCylinder({ radius: toRadiusFromApothem(apothem, sides), height, sides });

export const fromDiameter = ({ diameter, height = 1, sides = 32 }) => buildCylinder({ radius: diameter / 2, height, sides });

export const Cylinder = dispatch(
  'cylinder',
  // cylinder()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  (radius, height = 1, sides = 32) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(sides);
    return () => fromValue(radius, height, sides);
  },
  ({ radius, height = 1, sides = 32 }) => {
    assertNumber(radius);
    assertNumber(height);
    assertNumber(sides);
    return () => fromRadius({ radius, height, sides });
  },
  ({ apothem, height = 1, sides = 32 }) => {
    assertNumber(apothem);
    assertNumber(height);
    assertNumber(sides);
    return () => fromApothem({ apothem, height, sides });
  },
  ({ diameter, height = 1, sides = 32 }) => {
    assertNumber(diameter);
    assertNumber(height);
    assertNumber(sides);
    return () => fromDiameter({ diameter, height, sides });
  });

Cylinder.fromValue = fromValue;
Cylinder.fromRadius = fromRadius;
Cylinder.fromDiameter = fromDiameter;

export default Cylinder;
