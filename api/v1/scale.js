import { Assembly } from './Assembly';
import { CAG } from './CAG';
import { CSG } from './CSG';
import { fromScaling } from '@jsxcad/math-mat4';

export const scale = (factor, shape) => {
  if (factor.length) {
    // scale([1, 2, 3])
    return shape.transform(fromScaling(factor));
  } else {
    // scale(4)
    return shape.transform(fromScaling([factor, factor, factor]));
  }
}

const method = function (factor) { return scale(factor, this); }

Assembly.prototype.scale = method;
CAG.prototype.scale = method;
CSG.prototype.scale = method;
