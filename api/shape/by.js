import { getInverseMatrices, getLeafs } from '@jsxcad/geometry';

import Group from './Group.js';
import Shape from './Shape.js';

export const by = Shape.chainable((selection, ...ops) => (shape) => {
  if (ops.length === 0) {
    ops.push((local) => local);
  }
  ops = ops.map((op) => (op instanceof Function ? op : () => op));
  // We've already selected the item for reference, e.g., s.to(g('plate'), ...);
  if (selection instanceof Function) {
    selection = selection(shape);
  }
  const placed = [];
  for (const leaf of getLeafs(selection.toGeometry())) {
    const { global } = getInverseMatrices(leaf);
    // Perform the operation then place the
    // result in the global frame of the reference.
    placed.push(shape.op(...ops).transform(global));
  }
  return Group(...placed);
});

Shape.registerMethod('by', by);
