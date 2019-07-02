import { assertEmpty, assertNumber } from './assert';
import { buildRegularPolygon, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';
import { polygon } from './polygon';

/**
 *
 * # Square (rectangle)
 *
 * Properly speaking what is produced here are rectangles.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * square()
 * ```
 * :::
 * ::: illustration
 * ```
 * square(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * square(6, 12)
 * ```
 * :::
 * ::: illustration
 * ```
 * square({ edge: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(circle(10),
 *          square({ radius: 10 })
 *            .drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(square({ apothem: 10 }),
 *          circle(10).drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * square({ diameter: 20 })
 * ```
 * :::
 **/

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);
const unitSquare = () => Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: 4 })).rotateZ(45).scale(edgeScale);

export const fromSize = ({ size }) => unitSquare().scale(size);
export const fromDimensions = ({ width, length }) => unitSquare().scale([width, length, 1]);

export const square = dispatch(
  'square',
  // square()
  (...args) => {
    assertEmpty(args);
    return () => fromSize({ size: 1 });
  },
  // square(4)
  (size, ...rest) => {
    assertNumber(size);
    assertEmpty(rest);
    return () => fromSize({ size });
  },
  // square(4, 6)
  (width, length, ...rest) => {
    assertNumber(width);
    assertNumber(length);
    assertEmpty(rest);
    return () => fromDimensions({ width, length });
  },
  // square({ edge: 10 })
  ({ edge }) => {
    assertNumber(edge);
    return () => polygon.fromEdge({ edge, sides: 4 });
  },
  // polygon({ apothem: 10 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => polygon.fromApothem({ apothem, sides: 4 });
  },
  // polygon({ radius: 10})
  ({ radius }) => {
    assertNumber(radius);
    return () => polygon.fromRadius({ radius, sides: 4 });
  },
  // polygon({ diameter: 10})
  ({ diameter }) => {
    assertNumber(diameter);
    return () => polygon.fromDiameter({ diameter, sides: 4 });
  });

export default square;
