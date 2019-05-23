import { assertEmpty, assertNumber } from './assert';
import { buildRegularPolygon, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

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
 * square({ radius: 10 })
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
export const fromRadius = ({ radius }) => Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: 4 })).rotateZ(45).scale(radius);
export const fromDiameter = ({ diameter }) => Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: 4 })).rotateZ(45).scale(diameter / 2);

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
  // square({ radius: 5 })
  ({ radius }) => {
    assertNumber(radius);
    return () => fromRadius({ radius });
  },
  // square({ diameter: 5 })
  ({ diameter }) => {
    assertNumber(diameter);
    return () => fromDiameter({ diameter });
  });

export default square;
