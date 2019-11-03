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

const toRadiusFromApothem = (apothem) => apothem / Math.cos(Math.PI / 4);

const edgeScale = regularPolygonEdgeLengthToRadius(1, 4);
const unitSquare = () => Shape.fromGeometry(buildRegularPolygon(4)).rotateZ(45).scale(edgeScale);

export const ofEdge = (size) => unitSquare().scale(size);
export const ofEdges = (width, length) => unitSquare().scale([width, length, 1]);
export const ofRadius = (radius) => Shape.fromGeometry(buildRegularPolygon(4)).rotateZ(45).scale(radius);
export const ofApothem = (apothem) => ofRadius(toRadiusFromApothem(apothem));
export const ofDiameter = (diameter) => ofRadius(diameter / 2);

export const fromCorners = (corner1, corner2) => {
  const [c1x, c1y] = corner1;
  const [c2x, c2y] = corner2;
  const length = c2x - c1x;
  const width = c2y - c1y;
  const center = [(c1x + c2x) / 2, (c1y + c2y) / 2];
  return unitSquare().scale([length, width]).translate(center);
};

export const Square = dispatch(
  'Square',
  // square()
  (...args) => {
    assertEmpty(args);
    return () => ofEdge(1);
  },
  // square(4)
  (size, ...rest) => {
    assertNumber(size);
    assertEmpty(rest);
    return () => ofEdge(size);
  },
  // square(4, 6)
  (width, length, ...rest) => {
    assertNumber(width);
    assertNumber(length);
    assertEmpty(rest);
    return () => ofEdges(width, length);
  },
  // square({ edge: 10 })
  ({ edge }) => {
    assertNumber(edge);
    return () => ofEdge(edge);
  },
  // Polygon({ apothem: 10 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => ofApothem(apothem);
  },
  // Polygon({ radius: 10})
  ({ radius }) => {
    assertNumber(radius);
    return () => ofRadius(radius);
  },
  // Polygon({ diameter: 10})
  ({ diameter }) => {
    assertNumber(diameter);
    return () => ofDiameter(diameter);
  });

Square.ofEdge = ofEdge;
Square.ofEdges = ofEdges;
Square.ofRadius = ofRadius;
Square.ofApothem = ofApothem;
Square.ofDiameter = ofDiameter;
Square.fromCorners = fromCorners;

export default Square;
