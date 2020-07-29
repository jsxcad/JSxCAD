import Shape from '@jsxcad/api-v1-shape';
import Shell from './Shell.js';

export const shrink = (shape, amount, { resolution = 3 } = {}) => {
  if (amount === 0) {
    return shape;
  } else {
    return shape.cut(Shell(amount, { resolution }, shape));
  }
};

const shrinkMethod = function (amount, { resolution = 3 } = {}) {
  return shrink(this, amount, { resolution });
};
Shape.prototype.shrink = shrinkMethod;

export default shrink;
