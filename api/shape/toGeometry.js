import Shape from './Shape.js';

export const toGeometry = Shape.registerMethod(
  'toGeometry',
  () => (shape) => shape.geometry
);
