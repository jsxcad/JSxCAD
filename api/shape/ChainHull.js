import { Hull } from './Hull.js';
import { Join } from './join.js';
import Shape from './Shape.js';

export const ChainHull = Shape.registerMethod(
  'ChainHull',
  (...shapes) =>
    async (shape) => {
      const chain = [];
      for (let nth = 1; nth < shapes.length; nth++) {
        chain.push(await Hull(shapes[nth - 1], shapes[nth])(shape));
      }
      return Join(...chain);
    }
);

export const chainHull = Shape.registerMethod(
  'chainHull',
  (...shapes) =>
    (shape) =>
      ChainHull(shape, ...shapes)(shape)
);

export default ChainHull;
