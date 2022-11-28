import Shape from './Shape.js';

export const noOp = Shape.registerMethod('noOp', () => (shape) => shape);
