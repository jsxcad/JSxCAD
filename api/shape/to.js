import { getInverseMatrices, getLeafs } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const to =
  (selection, ...ops) =>
  (shape) => {
    if (ops.length === 0) {
      ops.push((local) => local);
    }
    ops = ops.map((op) => (op instanceof Function ? op : () => op));
    // We've already selected the item for reference, e.g., s.to(g('plate'), ...);
    if (selection instanceof Function) {
      selection = selection(shape);
    }
    const { local } = getInverseMatrices(shape.toGeometry());
    for (const leaf of getLeafs(selection.toGeometry())) {
      const { global } = getInverseMatrices(leaf);
      // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
      shape = shape
        .transform(local)
        .op(...ops)
        .transform(global);
    }
    return shape;
  };

Shape.registerMethod('to', to);
