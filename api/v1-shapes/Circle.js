import Polygon from "./Polygon";

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
 * Circle.ofRadius(10, { sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofApothem(10, { sides: 8 })
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofApothem(10, { sides: 5 })
 *       .with(Circle.ofRadius(10, { sides: 5 }).drop(),
 *             Circle.ofRadius(10).outline().moveZ(0.01))
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofDiameter(20, { sides: 16 })
 * ```
 * :::
 * ::: illustration
 * ```
 * Circle.ofEdge(5, { sides: 5 })
 * ```
 * :::
 **/

export const ofEdge = (edge = 1, { sides = 32 } = {}) =>
  Polygon.ofEdge(edge, { sides });

export const ofRadius = (radius = 1, { sides = 32 } = {}) =>
  Polygon.ofRadius(radius, { sides });

export const ofApothem = (apothem = 1, { sides = 32 } = {}) =>
  Polygon.ofApothem(apothem, { sides });

export const ofDiameter = (diameter = 1, { sides = 32 } = {}) =>
  Polygon.ofDiameter(diameter, { sides });

export const Circle = (...args) => ofRadius(...args);

Circle.ofEdge = ofEdge;
Circle.ofApothem = ofApothem;
Circle.ofRadius = ofRadius;
Circle.ofDiameter = ofDiameter;
Circle.toRadiusFromApothem = (radius = 1, sides = 32) =>
  Polygon.toRadiusFromApothem(radius, sides);

Circle.signature = "Circle(radius:number = 1, { sides:number = 32 }) -> Shape";
ofEdge.signature =
  "Circle.ofEdge(edge:number = 1, { sides:number = 32 }) -> Shape";
ofRadius.signature =
  "Circle.ofRadius(radius:number = 1, { sides:number = 32 }) -> Shape";
ofApothem.signature =
  "Circle.ofApothem(apothem:number = 1, { sides:number = 32 }) -> Shape";
ofDiameter.signature =
  "Circle.ofDiameter(diameter:number = 1, { sides:number = 32 }) -> Shape";

export default Circle;
