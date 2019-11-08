import { Polygon } from './Polygon';

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

export const ofEdge = (edge = 1, sides = 32) => Polygon.ofEdge(edge, sides);
export const ofApothem = (apothem = 1, sides = 32) => Polygon.ofApothem(apothem, sides);
export const ofRadius = (radius = 1, sides = 32) => Polygon.ofRadius(radius, sides);
export const ofDiameter = (diameter = 1, sides = 32) => Polygon.ofDiameter(diameter, sides);

export const Circle = (...args) => ofRadius(...args);

Circle.ofEdge = ofEdge;
Circle.ofApothem = ofApothem;
Circle.ofRadius = ofRadius;
Circle.ofDiameter = ofDiameter;

export default Circle;
