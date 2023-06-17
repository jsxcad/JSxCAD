import Group from './Group.js';
import Shape from './Shape.js';
import { fromRotateZToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from '@jsxcad/geometry';

// rz is in terms of turns -- 1/2 is a half turn.
export const rz = Shape.registerMethod2(
  ['rotateZ', 'rz'],
  ['inputGeometry', 'numbers'],
  async (geometry, turns) => {
    const rotated = [];
    for (const turn of turns) {
      rotated.push(
        Shape.fromGeometry(transform(fromRotateZToTransform(turn), geometry))
      );
    }
    return Group(...rotated);
  }
);

export const rotateZ = rz;
