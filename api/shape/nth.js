import './each.js';

import Group from './Group.js';
import Shape from './Shape.js';

const eachOp = Shape.ops.get('each');

export const nth = Shape.registerMethod(
  ['nth', 'n'],
  (...ns) =>
    async (shape) => {
      const candidates = await eachOp(
        (leaf) => leaf,
        (...leafs) =>
          (shape) =>
            leafs
      )(shape);
      return Group(...ns.map((n) => candidates[n]));
    }
);

export const n = nth;
