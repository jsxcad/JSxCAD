import { assert, assertNumber, assertPoints } from './assert';
import { buildRegularPolygon, regularPolygonEdgeLengthToRadius } from '@jsxcad/algorithm-shape';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

const unitPolygon = (sides) => Shape.fromPathToZ0Surface(buildRegularPolygon({ edges: sides }));

// Note: radius here is circumradius.
const toRadiusFromApothem = (apothem, sides) => apothem / Math.cos(Math.PI / sides);
const toRadiusFromEdge = (edge, sides) => edge * regularPolygonEdgeLengthToRadius(1, sides);

export const fromEdge = ({ edge, sides }) => unitPolygon(sides).scale(toRadiusFromEdge(edge, sides));
export const fromApothem = ({ apothem, sides }) => unitPolygon(sides).scale(toRadiusFromApothem(apothem, sides));
export const fromRadius = ({ radius, sides }) => unitPolygon(sides).scale(radius);
export const fromDiameter = ({ diameter, sides }) => unitPolygon(sides).scale(diameter / 2);
export const fromPoints = (points) => Shape.fromPathToZ0Surface(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

/**
 *
 * # Polygon
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * polygon([0, 1],
 *         [1, 1],
 *         [1, 0],
 *         [0.2, 0.2])
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * polygon({ edge: 10, sides: 6 })
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * assemble(
 *   polygon({ apothem: 10, sides: 5 }),
 *   circle(10).drop())
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * assemble(
 *   circle(10),
 *   polygon({ radius: 10, sides: 5 }).drop())
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, -1, 50] } }
 * ```
 * polygon({ diameter: 20, sides: 3 })
 * ```
 * :::
 *
 **/

export const polygon = dispatch(
  'polygon',
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
    return () => fromEdge({ edge, sides });
  },
  // polygon({ apothem: 10, sides: 27 })
  ({ apothem, sides }) => {
    assertNumber(apothem);
    assertNumber(sides);
    return () => fromApothem({ apothem, sides });
  },
  // polygon({ radius: 10, sides: 8 })
  ({ radius, sides }) => {
    assertNumber(radius);
    assertNumber(sides);
    return () => fromRadius({ radius, sides });
  },
  // polygon({ diameter: 10, sides: 7 })
  ({ diameter, sides }) => {
    assertNumber(diameter);
    assertNumber(sides);
    return () => fromDiameter({ diameter, sides });
  });

export default polygon;

polygon.fromEdge = fromEdge;
polygon.fromApothem = fromApothem;
polygon.fromRadius = fromRadius;
polygon.fromDiameter = fromDiameter;
polygon.fromPoints = fromPoints;
