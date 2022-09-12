import Empty from './Empty.js';
import Shape from './Shape.js';
import get from './get.js';

export const noVoid = Shape.chainable(
  () => (shape) => shape.on(get('type:void'), Empty())
);

Shape.registerMethod('noVoid', noVoid);
