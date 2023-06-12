import Group from './Group.js';
import Shape from './Shape.js';
import { fromRotateYToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

// ry is in terms of turns -- 1/2 is a half turn.
export const ry = Shape.registerMethod2(
  ['rotateY', 'ry'],
  ['input', 'numbers'],
  async (input, turns) => {
    const rotated = [];
    for (const turn of turns) {
      rotated.push(await transform(fromRotateYToTransform(turn))(input));
    }
    return Group(...rotated);
  }
);

export const rotateY = ry;
