import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularPrism } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

const buildCylinder = ({ radius = 1, height = 1, resolution = 32 }) => {
  return Shape.fromPolygonsToSolid(buildRegularPrism({ edges: resolution })).scale([radius, radius, height]);
};

/**
 *
 * # Cylinder
 *
 * Generates cylinders.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * cylinder()
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cylinder(10, 2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cylinder({ radius: 2,
 *            height: 10,
 *            resolution: 8 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cylinder({ diameter: 6,
 *            height: 8,
 *            resolution: 16 })
 * ```
 * :::
 *
 **/

/**
 *
 * ## cylinder.fromValue(radius, height=1, resolution=32)
 *
 * Generate a cylinder of the given radius and height.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cylinder.fromValue(10, 8)
 * ```
 * :::
 *
 **/
export const fromValue = (radius, height = 1, resolution = 32) => buildCylinder({ radius, height, resolution });

/**
 *
 * ## cylinder.fromRadius({ radius, height=1, resolution=32 })
 *
 * Generate a cylinder of the given radius and height.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cylinder.fromRadius({ radius: 8,
 *                       height: 10 })
 * ```
 * :::
 *
 **/
export const fromRadius = ({ radius, height = 1, resolution = 32 }) => buildCylinder({ radius, height, resolution });

/**
 *
 * ## cylinder.fromDiameter({ diameter, height=1, resolution=32 })
 *
 * Generate a cylinder of the given diameter and height.
 *
 * ::: illustration { "view": { "position": [40, 40, 40] } }
 * ```
 * cylinder.fromDiameter({ diameter: 12,
 *                         height: 12 })
 * ```
 * :::
 *
 **/
export const fromDiameter = ({ diameter, height = 1, resolution = 32 }) => buildCylinder({ radius: diameter / 2, height, resolution });

export const cylinder = dispatch(
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
  ({ diameter, height = 1, resolution = 32 }) => {
    assertNumber(diameter);
    assertNumber(height);
    assertNumber(resolution);
    return () => fromDiameter({ diameter, height, resolution });
  });

cylinder.fromValue = fromValue;
cylinder.fromRadius = fromRadius;
cylinder.fromDiameter = fromDiameter;

export default cylinder;
