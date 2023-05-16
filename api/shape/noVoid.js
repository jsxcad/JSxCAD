import Empty from './Empty.js';
import Shape from './Shape.js';
import get from './get.js';

export const noVoid = Shape.registerMethod(
  ['noVoid', 'noHole'],
  () => (shape) => shape.on(get('type:void'), Empty())
);

export const noHole = noVoid;
