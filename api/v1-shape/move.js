import Shape from './Shape.js';
import { fromTranslation } from '@jsxcad/math-mat4';

export const move = (shape, x = 0, y = 0, z = 0) => {
  if (!isFinite(x)) {
    x = 0;
  }
  if (!isFinite(y)) {
    y = 0;
  }
  if (!isFinite(z)) {
    z = 0;
  }
  return shape.transform(fromTranslation([x, y, z]));
};

const moveMethod = function (...params) {
  return move(this, ...params);
};
Shape.prototype.move = moveMethod;
Shape.prototype.xyz = moveMethod;
Shape.prototype.xy = moveMethod;

export default move;
