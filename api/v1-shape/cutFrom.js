import Shape from './Shape';
import difference from './difference';

// a.cut(b) === b.cutFrom(a)

const cutFromMethod = function (shape) { return difference(shape, this); };
Shape.prototype.cutFrom = cutFromMethod;

cutFromMethod.signature = 'Shape -> cutFrom(...shapes:Shape) -> Shape';
