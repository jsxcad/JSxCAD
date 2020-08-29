import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Polygon } from './Polygon.js';

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

export const ofEdge = (edge = 1) => Polygon.ofEdge(edge, { sides: 3 });
export const ofApothem = (apothem = 1) =>
  Polygon.ofApothem(apothem, { sides: 3 });
export const ofRadius = (radius = 1) => Polygon.ofRadius(radius, { sides: 3 });
export const ofDiameter = (diameter = 1) =>
  Polygon.ofDiameter(diameter, { sides: 3 });

export const Triangle = (...args) => ofEdge(...args);

Triangle.ofEdge = ofEdge;
Triangle.ofApothem = ofApothem;
Triangle.ofRadius = ofRadius;
Triangle.ofDiameter = ofDiameter;

export default Triangle;

Shape.prototype.Triangle = shapeMethod(Triangle);
