import Shape from './Shape.js';

export const self =
  (...args) =>
  (shape) =>
    shape;

Shape.registerMethod('self', self);

export default self;
