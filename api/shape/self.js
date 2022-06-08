import Shape from './Shape.js';

export const self = Shape.chainable(
  (...args) =>
    (shape) =>
      shape
);

Shape.registerMethod('self', self);

export default self;
