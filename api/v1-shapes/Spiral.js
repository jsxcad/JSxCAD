import Shape from '@jsxcad/api-v1-shape';
import { fromZRotation } from '@jsxcad/math-mat4';
import { numbers } from '@jsxcad/api-v1-math';
import { transform } from '@jsxcad/math-vec3';

/**
 *
 * # Spiral
 *
 * These take a function mapping angle to radius.
 *
 * ::: illustration { "view": { "position": [0, 0, 10] } }
 * ```
 * Spiral(angle => angle,
 *        { to: 360 * 5 });
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

export const Spiral = (toRadiusFromAngle = (angle) => angle, { from = 0, to = 360, by = 1 } = {}) => {
  const path = [null];
  for (const angle of numbers(angle => angle, { from, to, by })) {
    const radius = toRadiusFromAngle(angle);
    path.push(transform(fromZRotation(angle * Math.PI / 180), [radius, 0, 0]));
  }
  return Shape.fromPath(path);
};

export default Spiral;
