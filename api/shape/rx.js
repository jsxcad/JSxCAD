import Group from './Group.js';
import Shape from './Shape.js';
import { fromRotateXToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

// rx is in terms of turns -- 1/2 is a half turn.
export const rx = Shape.registerMethod(
  ['rotateX', 'rx'],
  (...turns) =>
    async (shape) => {
      const rotated = [];
      for (const turn of await shape.toFlatValues(turns)) {
        rotated.push(await transform(fromRotateXToTransform(turn))(shape));
      }
      return Group(...rotated);
    }
);

export const rotateX = rx;
