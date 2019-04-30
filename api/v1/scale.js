import { Shape } from './Shape';
import { fromScaling } from '@jsxcad/math-mat4';

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
