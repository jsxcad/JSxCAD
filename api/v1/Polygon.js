import { assert, assertNumber, assertPoints } from './assert';
import { buildRegularPolygon, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

const unitPolygon = (sides = 16) => Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: sides }));

// Note: radius here is circumradius.
const toRadiusFromApothem = (apothem, sides = 16) => apothem / Math.cos(Math.PI / sides);
const toRadiusFromEdge = (edge, sides = 16) => edge * regularPolygonEdgeLengthToRadius(1, sides);

export const fromEdge = (edge, sides = 16) => unitPolygon(sides).scale(toRadiusFromEdge(edge, sides));
export const fromApothem = (apothem, sides = 16) => unitPolygon(sides).scale(toRadiusFromApothem(apothem, sides));
export const fromRadius = (radius, sides = 16) => unitPolygon(sides).scale(radius);
export const fromDiameter = (diameter, sides = 16) => unitPolygon(sides).scale(diameter / 2);
export const fromPoints = (points) => Shape.fromPathToZ0Surface(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

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

export const Polygon = dispatch(
  'Polygon',
  // polygon([0, 0], [3, 0], [3, 3])
  (...points) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => fromPoints(points);
  },
  // polygon({ points: [[0, 0], [3, 0], [3, 3]] })
  ({ points }) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => fromPoints(points);
  },
  // polygon({ edge: 10, sides: 4 })
  ({ edge, sides }) => {
    assertNumber(edge);
    assertNumber(sides);
    return () => fromEdge(edge, sides);
  },
  // polygon({ apothem: 10, sides: 27 })
  ({ apothem, sides }) => {
    assertNumber(apothem);
    assertNumber(sides);
    return () => fromApothem(apothem, sides);
  },
  // polygon({ radius: 10, sides: 8 })
  ({ radius, sides }) => {
    assertNumber(radius);
    assertNumber(sides);
    return () => fromRadius(radius, sides);
  },
  // polygon({ diameter: 10, sides: 7 })
  ({ diameter, sides }) => {
    assertNumber(diameter);
    assertNumber(sides);
    return () => fromDiameter(diameter, sides);
  });

export default Polygon;

Polygon.fromEdge = fromEdge;
Polygon.fromApothem = fromApothem;
Polygon.fromRadius = fromRadius;
Polygon.fromDiameter = fromDiameter;
Polygon.fromPoints = fromPoints;
