import { getInverseMatrices, getLeafs } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const at =
  (selection, ...ops) =>
  (shape) => {
    if (ops.length === 0) {
      return shape;
    }
    ops = ops.map((op) => (op instanceof Function ? op : () => op));
    // We've already selected the item for reference, e.g., s.on(g('plate'), ...);
    if (selection instanceof Function) {
      selection = selection(shape);
    }
    // Will this have a problem with groups, etc?
    const { global: shapeGlobal, local: shapeLocal } = getInverseMatrices(
      shape.toGeometry()
    );
    for (const leaf of getLeafs(selection.toGeometry())) {
      const { global: leafGlobal, local: leafLocal } = getInverseMatrices(leaf);
      // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
      shape = shape
        .transform(shapeLocal)
        .transform(leafGlobal)
        .op(...ops)
        .transform(leafLocal)
        .transform(shapeGlobal);
    }
    return shape;
  };

Shape.registerMethod('at', at);
