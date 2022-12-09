import './each.js';

import Empty from './Empty.js';
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
      const group = [];
      for (let nth of ns) {
        if (nth < 0) {
          nth = candidates.length - nth;
        }
        const candidate = candidates[nth];
        if (candidate === undefined) {
          group.push(Empty());
        } else {
          group.push(candidate);
        }
      }
      return Group(...group);
    }
);

export const n = nth;
