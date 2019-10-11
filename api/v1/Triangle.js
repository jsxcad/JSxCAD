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

export const ofEdge = (edge) => Polygon.ofEdge(edge, 3);
export const ofApothem = (apothem) => Polygon.ofApothem(apothem, 3);
export const ofRadius = (radius) => Polygon.ofRadius(radius, 3);
export const ofDiameter = (diameter) => Polygon.ofDiameter(diameter, 3);

export const Triangle = dispatch(
  'Triangle',
  // Triangle()
  (...rest) => {
    assertEmpty(rest);
    return () => Polygon.ofEdge(1, 3);
  },
  // Triangle(2)
  (value) => {
    assertNumber(value);
    return () => Polygon.ofEdge(value, 3);
  },
  // Triangle({ edge: 10 })
  ({ edge }) => {
    assertNumber(edge);
    return () => Polygon.ofEdge(edge, 3);
  },
  // Triangle({ apothem: 10 })
  ({ apothem }) => {
    assertNumber(apothem);
    return () => Polygon.ofApothem(apothem, 3);
  },
  // Triangle({ radius: 10})
  ({ radius }) => {
    assertNumber(radius);
    return () => Polygon.ofRadius(radius, 3);
  },
  // Triangle({ diameter: 10})
  ({ diameter }) => {
    assertNumber(diameter);
    return () => Polygon.ofDiameter(diameter, 3);
  });

Triangle.ofEdge = ofEdge;
Triangle.ofApothem = ofApothem;
Triangle.ofRadius = ofRadius;
Triangle.ofDiameter = ofDiameter;

export default Triangle;
