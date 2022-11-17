import { getInverseMatrices, getLeafs } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

export const by = Shape.registerMethod(
  'by',
  (selection, ...ops) =>
    async (shape) => {
      if (ops.length === 0) {
        ops.push((local) => local);
      }
      ops = ops.map((op) => (op instanceof Function ? op : () => op));
      // We've already selected the item for reference, e.g., s.to(g('plate'), ...);
      if (Shape.isFunction(selection)) {
        selection = await selection(shape);
      }
      const placed = [];
      console.log(`QQ/by/selection: ${JSON.stringify(selection)}`);
      for (const leaf of getLeafs((await selection).toGeometry())) {
        const { global } = getInverseMatrices(leaf);
        // Perform the operation then place the
        // result in the global frame of the reference.
        placed.push(await shape.op(...ops).transform(global));
      }
      return Group(...placed);
    }
);
