import { Shape } from './Shape.js';
import { intersection } from './intersection.js';

const clipMethod = function (...shapes) {
  return intersection(this, ...shapes);
};
Shape.prototype.clip = clipMethod;

clipMethod.signature = 'Shape -> clip(...to:Shape) -> Shape';
