import Shape from './Shape.js';
import { cut } from './cut.js';

// a.cut(b) === b.cutFrom(a)

const cutFromMethod = function (shape) {
  return cut(shape, this);
};
Shape.prototype.cutFrom = cutFromMethod;
