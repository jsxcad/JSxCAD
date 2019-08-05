import { Shape } from './Shape';
import { numbers } from './numbers';

/**
 *
 * # Wave
 *
 * These take a function mapping X distance to Y distance.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Wave({ to: 360 },
 *      angle => sin(angle) * 100);
 * ```
 * :::
 **/

export const Wave = ({ from = 0, to = 360, by = 1 } = {}, toYDistanceFromXDistance = (xDistance) => 0) => {
  const path = [null];
  for (const xDistance of numbers({ from, to, by })) {
    const yDistance = toYDistanceFromXDistance(xDistance);
    path.push([xDistance, yDistance, 0]);
  }
  return Shape.fromPath(path);
};

export default Wave;
