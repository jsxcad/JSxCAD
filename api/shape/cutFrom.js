import Shape from './Shape.js';
import { destructure } from './destructure.js';

export const cutFrom = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions: others, strings: modes } = destructure(args);
  if (others.length !== 1) {
    throw Error(`cutFrom requires one shape or function.`);
  }
  const [other] = others;
  return Shape.toShape(other, shape).cut(shape, ...modes);
});

Shape.registerMethod('cutFrom', cutFrom);
