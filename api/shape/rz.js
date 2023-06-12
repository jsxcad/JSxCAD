import Group from './Group.js';
import Shape from './Shape.js';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

// rz is in terms of turns -- 1/2 is a half turn.
export const rz = Shape.registerMethod2(
  ['rotateZ', 'rz'],
  ['input', 'numbers'],
  async (input, turns) => {
    const rotated = [];
    for (const turn of turns) {
      rotated.push(await transform(fromRotateZToTransform(turn))(input));
    }
    return Group(...rotated);
  }
);

export const rotateZ = rz;
