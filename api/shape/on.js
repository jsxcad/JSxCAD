import { getLeafs, rewrite } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';

export const on =
  (selection, ...ops) =>
  (shape) => {
    ops = ops.map((op) => (op instanceof Function ? op : () => op));
    // We've already selected the item to replace, e.g., s.on(g('plate'), ...);
    if (selection instanceof Function) {
      selection = selection(shape);
    }
    // FIX: This needs to walk through items.
    const leafs = getLeafs(selection.toGeometry());
    const walk = (geometry, descend) => {
      if (geometry.type === 'item' && leafs.includes(geometry)) {
        // This is a target.
        const global = geometry.matrix;
        const local = invertTransform(global);
        const target = Shape.fromGeometry(geometry);
        // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
        return target
          .transform(local)
          .op(...ops)
          .transform(global)
          .toGeometry();
      }
      return descend();
    };
    return Shape.fromGeometry(rewrite(shape.toGeometry(), walk));
  };

Shape.registerMethod('on', on);
