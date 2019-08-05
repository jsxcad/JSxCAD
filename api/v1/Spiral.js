import { Shape } from './Shape';
import { fromZRotation } from '@jsxcad/math-mat4';
import { numbers } from './numbers';
import { transform } from '@jsxcad/math-vec3';

/**
 *
 * # Spiral
 *
 * These take a function mapping angle to radius.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral({ to: 360 * 5 },
 *        angle => angle);
 * ```
 * :::
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral({ to: 360 },
 *        (angle) => 2 + sin(angle * 20))
 *   .close()
 *   .interior()
 * ```
 * :::
 **/

export const Spiral = ({ from = 0, to = 360, by = 1 } = {}, toRadiusFromAngle = (angle) => angle) => {
  const path = [null];
  for (const angle of numbers({ from, to, by })) {
    const radius = toRadiusFromAngle(angle);
    path.push(transform(fromZRotation(angle * Math.PI / 180), [radius, 0, 0]));
  }
  return Shape.fromPath(path);
};

export default Spiral;
