import { Shape } from './Shape';
import { fromScaling } from '@jsxcad/math-mat4';

/**
 *
 * # Scale
 *
 * Scales an object uniformly or per axis.
 *
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * cube()
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * cube().scale(2)
 * ```
 * :::
 * ::: illustration { "view": { "position": [10, 10, 10] } }
 * ```
 * cube().scale([1, 2, 3])
 * ```
 * :::
 **/

export const scale = (factor, shape) => {
  if (factor.length) {
    const [x = 1, y = 1, z = 1] = factor;
    return shape.transform(fromScaling([x, y, z]));
  } else {
    // scale(4)
    return shape.transform(fromScaling([factor, factor, factor]));
  }
};

const method = function (factor) { return scale(factor, this); };

Shape.prototype.scale = method;
