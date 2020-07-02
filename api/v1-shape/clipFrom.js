import { Shape } from './Shape.js';
import { intersection } from './intersection.js';

const clipFromMethod = function (shape) {
  return intersection(shape, this);
};
Shape.prototype.clipFrom = clipFromMethod;

clipFromMethod.signature = 'Shape -> clipFrom(...to:Shape) -> Shape';
