import { assertEmpty, assertNumber } from './assert';

import { dispatch } from './dispatch';
import { polygon } from './polygon';

/**
 *
 * # Triangle
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * triangle()
 * ```
 * :::
 * ::: illustration
 * ```
 * triangle(20)
 * ```
 * :::
 * ::: illustration
 * ```
 * triangle({ radius: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle(10),
 *          triangle({ radius: 10 })
 *            .drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(triangle({ apothem: 5 }),
 *          circle(5).drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(triangle({ radius: 10 })
 *            .rotateZ(180),
 *          triangle({ diameter: 10 })
 *            .drop())
 * ```
 * :::
 **/

export const triangle = dispatch(
  'triangle',
  // triangle()
  (...rest) => {
    assertEmpty(rest);
    return () => polygon.fromEdge({ edge: 1, sides: 3 });
  },
  // triangle(2)
  (value) => {
    assertNumber(value);
    return () => polygon.fromEdge({ edge: value, sides: 3 });
  },
  // triangle({ edge: 10 })
  ({ edge }) => {
    assertNumber(edge);
    return () => polygon.fromEdge({ edge, sides: 3 });
  },
  // triangle({ apothem: 10 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => polygon.fromApothem({ apothem, sides: 3 });
  },
  // triangle({ radius: 10})
  ({ radius }) => {
    assertNumber(radius);
    return () => polygon.fromRadius({ radius, sides: 3 });
  },
  // triangle({ diameter: 10})
  ({ diameter }) => {
    assertNumber(diameter);
    return () => polygon.fromDiameter({ diameter, sides: 3 });
  });

export default triangle;
