import Shape from './Shape.js';

export const self = Shape.chainable(() => (shape) => shape);

Shape.registerMethod('self', self);
