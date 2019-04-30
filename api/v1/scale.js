import { Assembly } from './Assembly';
import { Paths } from './Paths';
import { Solid } from './Solid';
import { Z0Surface } from './Z0Surface';

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

Assembly.prototype.scale = method;
Paths.prototype.scale = method;
Solid.prototype.scale = method;
Z0Surface.prototype.scale = method;
