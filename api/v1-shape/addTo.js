import Shape from './Shape.js';
import { add } from './add.js';

const addToMethod = function (shape) {
  return add(shape, this);
};
Shape.prototype.addTo = addToMethod;
