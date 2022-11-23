import Group from './Group.js';
import Shape from './Shape.js';
import { fromRotateYToTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

// ry is in terms of turns -- 1/2 is a half turn.
export const ry = Shape.registerMethod(
  ['rotateY', 'ry'],
  (...turns) =>
    async (shape) => {
      const rotated = [];
      for (const turn of await shape.toFlatValues(turns)) {
        rotated.push(await transform(fromRotateYToTransform(turn))(shape));
      }
      return Group(...rotated);
    }
);

export const rotateY = ry;
