import Empty from './Empty.js';
import Shape from './Shape.js';
import get from './get.js';

export const noVoid = Shape.registerMethod2(
  ['noVoid', 'noGap'],
  ['input'],
  (input) => input.on(get('type:void'), Empty())
);

export const noGap = noVoid;
