import { getInverseMatrices, getLeafs } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

export const at =
  (selection, ...ops) =>
  (shape) => {
    if (ops.length === 0) {
      ops.push(() => shape);
    }
    ops = ops.map((op) => (op instanceof Function ? op : () => op));
    // We've already selected the item for reference, e.g., s.on(g('plate'), ...);
    if (selection instanceof Function) {
      selection = selection(shape);
    }
    for (const leaf of getLeafs(selection.toGeometry())) {
      const { global, local } = getInverseMatrices(leaf);
      // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
      shape = shape
        .transform(local)
        .op(...ops)
        .transform(global);
    }
    return shape;
  };

Shape.registerMethod('at', at);
