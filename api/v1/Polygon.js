import { assert, assertNumber, assertPoints } from './assert';
import { buildPolygonFromPoints, buildRegularPolygon, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

const unitPolygon = (sides = 16) => Shape.fromGeometry(buildRegularPolygon(sides));

// Note: radius here is circumradius.
const toRadiusFromApothem = (apothem, sides = 16) => apothem / Math.cos(Math.PI / sides);
const toRadiusFromEdge = (edge, sides = 16) => edge * regularPolygonEdgeLengthToRadius(1, sides);

export const ofEdge = (edge, sides = 16) => unitPolygon(sides).scale(toRadiusFromEdge(edge, sides));
export const ofApothem = (apothem, sides = 16) => unitPolygon(sides).scale(toRadiusFromApothem(apothem, sides));
export const ofRadius = (radius, sides = 16) => unitPolygon(sides).scale(radius);
export const ofDiameter = (diameter, sides = 16) => unitPolygon(sides).scale(diameter / 2);
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

export const Polygon = dispatch(
  'Polygon',
  // polygon([0, 0], [3, 0], [3, 3])
  (...points) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => ofPoints(points);
  },
  // polygon({ points: [[0, 0], [3, 0], [3, 3]] })
  ({ points }) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => ofPoints(points);
  },
  // polygon({ edge: 10, sides: 4 })
  ({ edge, sides }) => {
    assertNumber(edge);
    assertNumber(sides);
    return () => ofEdge(edge, sides);
  },
  // polygon({ apothem: 10, sides: 27 })
  ({ apothem, sides }) => {
    assertNumber(apothem);
    assertNumber(sides);
    return () => ofApothem(apothem, sides);
  },
  // polygon({ radius: 10, sides: 8 })
  ({ radius, sides }) => {
    assertNumber(radius);
    assertNumber(sides);
    return () => ofRadius(radius, sides);
  },
  // polygon({ diameter: 10, sides: 7 })
  ({ diameter, sides }) => {
    assertNumber(diameter);
    assertNumber(sides);
    return () => ofDiameter(diameter, sides);
  });

export default Polygon;

Polygon.ofEdge = ofEdge;
Polygon.ofApothem = ofApothem;
Polygon.ofRadius = ofRadius;
Polygon.ofDiameter = ofDiameter;
Polygon.ofPoints = ofPoints;
