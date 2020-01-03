import {
  buildPolygonFromPoints,
  buildRegularPolygon,
  regularPolygonEdgeLengthToRadius,
  toRadiusFromApothem
} from '@jsxcad/algorithm-shape';

import Shape from '@jsxcad/api-v1-shape';

const unitPolygon = (sides = 16) => Shape.fromGeometry(buildRegularPolygon(sides));

// Note: radius here is circumradius.
const toRadiusFromEdge = (edge, sides) => edge * regularPolygonEdgeLengthToRadius(1, sides);

export const ofRadius = (radius, { sides = 16 } = {}) => unitPolygon(sides).scale(radius);
export const ofEdge = (edge, { sides = 16 }) => ofRadius(toRadiusFromEdge(edge, sides), { sides });
export const ofApothem = (apothem, { sides = 16 }) => ofRadius(toRadiusFromApothem(apothem, sides), { sides });
export const ofDiameter = (diameter, ...args) => ofRadius(diameter / 2, ...args);
export const ofPoints = (points) => Shape.fromGeometry(buildPolygonFromPoints(points));

/**
 *
 * # Polygon
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Polygon([0, 1],
 *         [1, 1],
 *         [1, 0],
 *         [0.2, 0.2])
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * Polygon({ edge: 10, sides: 6 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * assemble(
 *   Polygon({ apothem: 10, sides: 5 }),
 *   Circle(10).drop())
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * assemble(
 *   Circle(10),
 *   Polygon({ radius: 10, sides: 5 }).drop())
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * Polygon({ diameter: 20, sides: 3 })
 * ```
 * :::
 *
 **/

export const Polygon = (...args) => ofRadius(...args);

Polygon.ofEdge = ofEdge;
Polygon.ofApothem = ofApothem;
Polygon.ofRadius = ofRadius;
Polygon.ofDiameter = ofDiameter;
Polygon.ofPoints = ofPoints;
Polygon.toRadiusFromApothem = toRadiusFromApothem;

export default Polygon;
