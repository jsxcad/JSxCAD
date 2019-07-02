import { assertEmpty, assertNumber } from './assert';

import { dispatch } from './dispatch';
import { polygon } from './polygon';

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
 *          sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * circle({ apothem: 10,
 *          sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle({ apothem: 10, sides: 5 }),
 *          circle({ radius: 10, sides: 5 }).drop(),
 *          circle({ radius: 10 }).outline())
 * ```
 * :::
 * ::: illustration
 * ```
 * circle({ diameter: 20,
 *          sides: 16 })
 * ```
 * :::
 **/

export const circle = dispatch(
  'circle',
  // circle()
  (...rest) => {
    assertEmpty(rest);
    return () => polygon.fromRadius({ radius: 1 });
  },
  // circle(2)
  (value) => {
    assertNumber(value);
    return () => polygon.fromRadius({ radius: value, sides: 32 });
  },
  // circle({ radius: 2, sides: 32 })
  ({ radius, sides = 32 }) => {
    assertNumber(radius);
    return () => polygon.fromRadius({ radius, sides });
  },
  // circle({ apothem: 2, sides: 32 })
  ({ apothem, sides = 32 }) => {
    assertNumber(apothem);
    assertNumber(sides);
    return () => polygon.fromApothem({ apothem, sides });
  },
  // circle({ diameter: 2, sides: 32 })
  ({ diameter, sides = 32 }) => {
    assertNumber(diameter);
    assertNumber(sides);
    return () => polygon.fromDiameter({ diameter, sides });
  });

export default circle;
