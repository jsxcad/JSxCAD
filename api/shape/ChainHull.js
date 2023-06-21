import { Hull } from './Hull.js';
import { Join } from './join.js';
import Shape from './Shape.js';

export const ChainHull = Shape.registerMethod2(
  'ChainHull',
  ['input', 'shapes'],
  async (input, shapes) => {
    const chain = [];
    for (let nth = 1; nth < shapes.length; nth++) {
      chain.push(await Hull(shapes[nth - 1], shapes[nth])(input));
    }
    return Join(...chain);
  }
);

export const chainHull = Shape.registerMethod2(
  'chainHull',
  ['input', 'shapes'],
  (input, shapes) => ChainHull(input, ...shapes)(input)
);

export default ChainHull;
