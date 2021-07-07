import Shape from './Shape.js';

export const cutFrom = (other) => (shape) => other.cut(shape);
Shape.registerMethod('cutFrom', cutFrom);
