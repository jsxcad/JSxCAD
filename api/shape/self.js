import Shape from './Shape.js';

export const self = Shape.registerMethod('self', () => (shape) => shape);
