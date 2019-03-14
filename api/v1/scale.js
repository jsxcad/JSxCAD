import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { fromScaling } from '@jsxcad/math-mat4';

export const scale = (factor, shape) => {
console.log(`QQ/scale/factor: ${JSON.stringify(factor)}`);
  if (factor.length) {
    const [x = 1, y = 1, z = 1] = factor;
    return shape.transform(fromScaling([x, y, z]));
  } else {
    // scale(4)
    return shape.transform(fromScaling([factor, factor, factor]));
  }
}

const method = function (factor) { return scale(factor, this); }

Assembly.prototype.scale = method;
CAG.prototype.scale = method;
CSG.prototype.scale = method;
