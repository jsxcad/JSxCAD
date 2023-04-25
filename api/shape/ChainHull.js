import { Hull } from './Hull.js';
import { Join } from './join.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

export const ChainHull = Shape.registerMethod(
  'ChainHull',
  (...args) =>
    async (shape) => {
      const [shapes] = await destructure2(shape, args, 'shapes');
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
