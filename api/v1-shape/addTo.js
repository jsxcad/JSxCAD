import Shape from './Shape.js';
import union from './union.js';

// x.addTo(y) === y.add(x)

const addToMethod = function (shape) {
  return union(shape, this);
};
Shape.prototype.addTo = addToMethod;

addToMethod.signature = 'Shape -> (...Shapes) -> Shape';
