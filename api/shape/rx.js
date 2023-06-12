import Group from './Group.js';
import Shape from './Shape.js';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

// rx is in terms of turns -- 1/2 is a half turn.
export const rx = Shape.registerMethod2(
  ['rotateX', 'rx'],
  ['input', 'numbers'],
  async (input, turns) => {
    const rotated = [];
    for (const turn of turns) {
      rotated.push(await transform(fromRotateXToTransform(turn))(input));
    }
    return Group(...rotated);
  }
);

export const rotateX = rx;
