import Shape from '@jsxcad/api-v1-shape';
import { numbers } from '@jsxcad/api-v1-math';

/**
 *
 * # Wave
 *
 * These take a function mapping X distance to Y distance.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Wave(angle => sin(angle) * 100,
 *      { to: 360 });
 * ```
 * :::
 **/

export const Wave = (toYDistanceFromXDistance = (xDistance) => 0, { from = 0, to = 360, by = 1 } = {}) => {
  const path = [null];
  for (const xDistance of numbers(distance => distance, { from, to, by })) {
    const yDistance = toYDistanceFromXDistance(xDistance);
    path.push([xDistance, yDistance, 0]);
  }
  return Shape.fromPath(path);
};

export default Wave;