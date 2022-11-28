import { getLeafs, replacer } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

export const on = Shape.registerMethod(
  'on',
  (selection, ...ops) =>
    async (shape) => {
      ops = ops.map((op) => (Shape.isFunction(op) ? op : () => op));
      // We've already selected the item to replace, e.g., s.on(g('plate'), ...);
      // FIX: This needs to walk through items.
      // selection may or may not have a context. waiting on it will require a context.
      const resolvedSelection = await shape.toShape(selection);
      const selectionGeometry = await resolvedSelection.toGeometry();
      const inputLeafs = getLeafs(selectionGeometry);
      const outputLeafs = [];
      for (const geometry of inputLeafs) {
        const global = geometry.matrix;
        const local = invertTransform(global);
        const target = Shape.fromGeometry(geometry);
        // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
        // FIXME: op may be async.
        const a = transform(local);
        const b = a.op(...ops);
        const c = b.transform(global);
        const r = await c(target);
        outputLeafs.push(await r.toGeometry());
      }
      const result = Shape.fromGeometry(
        replacer(inputLeafs, outputLeafs)(await shape.toGeometry())
      );
      return result;
    }
);
