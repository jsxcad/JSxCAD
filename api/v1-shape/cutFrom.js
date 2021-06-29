import Shape from './Shape.js';
import { cut } from './cut.js';

// a.cut(b) === b.cutFrom(a)

export const cutFrom = (other) => (shape) => cut(other, shape);
Shape.registerMethod('cutFrom', cutFrom);
