import { assertEmpty, assertNumber } from './assert';

import { Polygon } from './Polygon';
import { dispatch } from './dispatch';

/**
 *
 * # Triangle
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Triangle()
 * ```
 * :::
 * ::: illustration
 * ```
 * Triangle(20)
 * ```
 * :::
 * ::: illustration
 * ```
 * Triangle({ radius: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10),
 *          Triangle({ radius: 10 })
 *            .drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Triangle({ apothem: 5 }),
 *          Circle(5).drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Triangle({ radius: 10 })
 *            .rotateZ(180),
 *          Triangle({ diameter: 10 })
 *            .drop())
 * ```
 * :::
 **/

export const Triangle = dispatch(
  'Triangle',
  // Triangle()
  (...rest) => {
    assertEmpty(rest);
    return () => Polygon.fromEdge({ edge: 1, sides: 3 });
  },
  // Triangle(2)
  (value) => {
    assertNumber(value);
    return () => Polygon.fromEdge({ edge: value, sides: 3 });
  },
  // Triangle({ edge: 10 })
  ({ edge }) => {
    assertNumber(edge);
    return () => Polygon.fromEdge({ edge, sides: 3 });
  },
  // Triangle({ apothem: 10 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => Polygon.fromApothem({ apothem, sides: 3 });
  },
  // Triangle({ radius: 10})
  ({ radius }) => {
    assertNumber(radius);
    return () => Polygon.fromRadius({ radius, sides: 3 });
  },
  // Triangle({ diameter: 10})
  ({ diameter }) => {
    assertNumber(diameter);
    return () => Polygon.fromDiameter({ diameter, sides: 3 });
  });

export default Triangle;
