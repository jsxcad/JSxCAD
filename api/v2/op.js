import Shape from './Shape.js';

export const op = (fn) => (shape) => fn(shape);

export const withOp = (fn) => (shape) => shape.with(fn(shape));

Shape.registerMethod('op', op);
Shape.registerMethod('withOp', withOp);
