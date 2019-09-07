import { Shape } from './Shape';
import { assertPoints } from './assert';
import { dispatch } from './dispatch';

export const fromPoints = (points) => Shape.fromOpenPath(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

/**
 *
 * # Path
 *
 * ::: illustration { "view": { "position": [0, 0, 5] } }
 * ```
 * Path([0, 1],
 *      [1, 1],
 *      [1, 0],
 *      [0.2, 0.2])
 * ```
 * :::
 *
 **/

export const Path = dispatch(
  'Path',
  // Path([0, 0], [3, 0], [3, 3])
  (...points) => {
    assertPoints(points);
    return () => fromPoints(points);
  });

export default Path;

Path.fromPoints = fromPoints;
