import { assertEmpty, assertNumber } from './assert';
import { buildRegularPolygon, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Polygon } from './Polygon';
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
 * Square()
 * ```
 * :::
 * ::: illustration
 * ```
 * Square(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * Square(6, 12)
 * ```
 * :::
 * ::: illustration
 * ```
 * Square({ edge: 10 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle(10),
 *          Square({ radius: 10 })
 *            .drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Square({ apothem: 10 }),
 *          Circle(10).drop())
 * ```
 * :::
 * ::: illustration
 * ```
 * Square({ diameter: 20 })
 * ```
 * :::
 **/

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);
const unitSquare = () => Shape.fromPathToZ0Surface(buildRegularPolygon(4)).rotateZ(45).scale(edgeScale);

export const fromSize = (size) => unitSquare().scale(size);
export const fromDimensions = (width, length) => unitSquare().scale([width, length, 1]);

export const Square = dispatch(
  'Square',
  // square()
  (...args) => {
    assertEmpty(args);
    return () => fromSize(1);
  },
  // square(4)
  (size, ...rest) => {
    assertNumber(size);
    assertEmpty(rest);
    return () => fromSize(size);
  },
  // square(4, 6)
  (width, length, ...rest) => {
    assertNumber(width);
    assertNumber(length);
    assertEmpty(rest);
    return () => fromDimensions(width, length);
  },
  // square({ edge: 10 })
  ({ edge }) => {
    assertNumber(edge);
    return () => Polygon.fromEdge(edge, 4);
  },
  // Polygon({ apothem: 10 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => Polygon.fromApothem(apothem, 4);
  },
  // Polygon({ radius: 10})
  ({ radius }) => {
    assertNumber(radius);
    return () => Polygon.fromRadius(radius, 4);
  },
  // Polygon({ diameter: 10})
  ({ diameter }) => {
    assertNumber(diameter);
    return () => Polygon.fromDiameter(diameter, 4);
  });

export default Square;
