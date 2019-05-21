import { assert, assertPoints } from './assert';

import { Shape } from './Shape';
import { dispatch } from './dispatch';

export const fromValue = (points) => Shape.fromPathToZ0Surface(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

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
 *
 **/

export const polygon = dispatch(
  'polygon',
  // polygon([0, 0], [3, 0], [3, 3])
  (...points) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => fromValue(points);
  },
  // polygon({ points: [[0, 0], [3, 0], [3, 3]] })
  ({ points }) => {
    assertPoints(points);
    assert(points, 'Not at least three points', points.length >= 3);
    return () => fromValue(points);
  });

export default polygon;

polygon.fromValue = fromValue;
