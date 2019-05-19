import { assertEmpty, assertNumber } from './assert';

import { Shape } from './Shape';
import { buildRegularPolygon } from '@jsxcad/algorithm-shape';
import { dispatch } from './dispatch';

/**
 *
 * # Circle (disc)
 *
 * Circles are approximated as surfaces delimeted by regular polygons.
 *
 * Properly speaking what is produced here are discs.
 * The circle perimeter can be extracted via outline().
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * circle()
 * ```
 * :::
 * ::: illustration
 * ```
 * circle(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * circle({ radius: 10,
 *          resolution: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * circle({ diameter: 20,
 *          resolution: 16 })
 * ```
 * :::
 **/

// FIX: This uses the circumradius rather than apothem, so that the produced polygon will fit into the specified circle.
// Is this the most useful measure?

const unitCircle = ({ resolution = 32 }) =>
  Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: resolution }));

/**
 *
 * ## circle.fromValue(value)
 *
 * Generate a circle from the radius in mm with a resolution of 32 segments.
 *
 * ::: illustration
 * ```
 * circle.fromValue(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * circle.fromValue(10).outline()
 * ```
 * :::
 *
 **/

export const fromValue = (radius) => unitCircle({ resolution: 32 }).scale(radius);

/**
 *
 * ## circle.fromRadius({ radius, resolution=32 })
 *
 * Generate a circle given a radius and resolution.
 * ::: illustration { "view": { "position": [0, 0, 50] } }
 * ```
 * circle.fromRadius({ radius: 5 })
 * ```
 * :::
 * ::: illustration
 * ```
 * circle.fromRadius({ radius: 10,
 *                     resolution: 16 })
 * ```
 * :::
 *
 **/

export const fromRadius = ({ radius, resolution = 32 }) => unitCircle({ resolution }).scale(radius);

/**
 *
 * ## circle.fromDiameter({ diameter, resolution=32 })
 *
 * Generate a circle given a diameter and resolution.
 *
 * ::: illustration
 * ```
 * circle.fromDiameter({ diameter: 5 })
 * ```
 * :::
 * ::: illustration
 * ```
 * circle.fromDiameter({ diameter: 10,
 *                       resolution: 8 })
 * ```
 * :::
 *
 **/
export const fromDiameter = ({ diameter, resolution = 32 }) => unitCircle({ resolution }).scale(diameter / 2);

export const circle = dispatch(
  'circle',
  // circle()
  (...rest) => {
    assertEmpty(rest);
    return () => fromValue(1);
  },
  // circle(2)
  (value) => {
    assertNumber(value);
    return () => fromValue(value);
  },
  // circle({ radius: 2, resolution: 32 })
  ({ radius, resolution }) => {
    assertNumber(radius);
    return () => fromRadius({ radius, resolution });
  },
  // circle({ diameter: 2, resolution: 32 })
  ({ diameter, resolution }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter, resolution });
  });

circle.fromValue = fromValue;
circle.fromRadius = fromRadius;
circle.fromDiameter = fromDiameter;

export default circle;
