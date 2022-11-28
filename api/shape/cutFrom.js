import Shape from './Shape.js';
import { cut } from './cut.js';
import { destructure } from './destructure.js';

export const cutFrom = Shape.registerMethod(
  'cutFrom',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions: others, strings: modes } = destructure(args);
      if (others.length !== 1) {
        throw Error(`cutFrom requires one shape or function.`);
      }
      const [other] = others;
      return cut(shape, ...modes)(await shape.toShape(other));
    }
);
