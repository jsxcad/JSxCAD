import Shape from './Shape';
import union from './union';

// x.addTo(y) === y.add(x)

const addToMethod = function (shape) { return union(shape, this); };
Shape.prototype.addTo = addToMethod;

addToMethod.signature = 'Shape -> (...Shapes) -> Shape';
