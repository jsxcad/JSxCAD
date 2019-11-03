import { assertEmpty, assertNumber } from './assert';

import { Polygon } from './Polygon';
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
 * Circle()
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle(10)
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle({ radius: 10,
 *          sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle({ apothem: 10,
 *          sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * assemble(Circle({ apothem: 10, sides: 5 }),
 *          Circle({ radius: 10, sides: 5 }).drop(),
 *          Circle({ radius: 10 }).outline())
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle({ diameter: 20,
 *          sides: 16 })
 * ```
 * :::
 **/

export const ofEdge = (edge, sides = 32) => Polygon.ofEdge(edge, sides);
export const ofApothem = (apothem, sides = 32) => Polygon.ofApothem(apothem, sides);
export const ofRadius = (radius, sides = 32) => Polygon.ofRadius(radius, sides);
export const ofDiameter = (diameter, sides = 32) => Polygon.ofDiameter(diameter, sides);

export const Circle = dispatch(
  'Circle',
  // Circle()
  (...rest) => {
    assertEmpty(rest);
    return () => ofRadius(1);
  },
  // circle(2)
  (value) => {
    assertNumber(value);
    return () => ofRadius(value);
  },
  // circle({ radius: 2, sides: 32 })
  ({ radius, sides = 32 }) => {
    assertNumber(radius);
    return () => ofRadius(radius, sides);
  },
  // circle({ apothem: 2, sides: 32 })
  ({ apothem, sides = 32 }) => {
    assertNumber(apothem);
    assertNumber(sides);
    return () => ofApothem(apothem, sides);
  },
  // circle({ diameter: 2, sides: 32 })
  ({ diameter, sides = 32 }) => {
    assertNumber(diameter);
    assertNumber(sides);
    return () => ofDiameter(diameter, sides);
  });

Circle.ofEdge = ofEdge;
Circle.ofApothem = ofApothem;
Circle.ofRadius = ofRadius;
Circle.ofDiameter = ofDiameter;

export default Circle;
