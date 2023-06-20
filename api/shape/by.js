import { getInverseMatrices, getLeafs } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';
import { transform } from './transform.js';

export const by = Shape.registerMethod2(
  'by',
  ['input', 'geometry'],
  async (input, selection) => {
    const placed = [];
    for (const leaf of getLeafs(selection)) {
      const { global } = getInverseMatrices(leaf);
      // Perform the operation then place the
      // result in the global frame of the reference.
      placed.push(await transform(global)(input));
    }
    return Group(...placed);
  }
);

export default by;
