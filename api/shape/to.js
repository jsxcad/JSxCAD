import Group from './Group.js';
import Shape from './Shape.js';
import { origin } from './origin.js';

export const to = Shape.chainable((...references) => (shape) => {
  const arranged = [];
  for (const reference of shape.toShapes(references)) {
    arranged.push(shape.by(origin()).by(reference));
  }
  return Group(...arranged);
});

Shape.registerMethod('to', to);
