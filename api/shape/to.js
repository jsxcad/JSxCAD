import Group from './Group.js';
import Shape from './Shape.js';
import { getLeafs } from '@jsxcad/geometry';
import { invertTransform } from '@jsxcad/algorithm-cgal';

export const to =
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
    const placed = [];
    for (const leaf of getLeafs(selection.toGeometry())) {
      if (leaf.type === 'item') {
        // This is a target.
        const global = leaf.matrix;
        const local = invertTransform(global);
        const target = Shape.fromGeometry(leaf);
        // Perform the operation, then switch to the local coordinate space.
        placed.push(target.op(...ops).transform(local));
      }
    }
    return Group(...placed);
  };

Shape.registerMethod('to', to);
