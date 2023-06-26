import Empty from './Empty.js';
import Group from './Group.js';
import Shape from './Shape.js';
import { each } from './each.js';

export const nth = Shape.registerMethod2(
  ['nth', 'n'],
  ['input', 'numbers'],
  async (input, nths) => {
    const candidates = await each(
      (leaf) => leaf,
      (...leafs) =>
        (_shape) =>
          leafs
    )(input);
    const group = [];
    for (let nth of nths) {
      if (nth < 0) {
        nth = candidates.length + nth;
      }
      let candidate = candidates[nth];
      if (candidate === undefined) {
        candidate = await Empty();
      }
      group.push(candidate);
    }
    return Group(...group);
  }
);

export const n = nth;
