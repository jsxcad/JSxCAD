import { getLeafs, replacer } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

// Let's consider removing the parallel operations.
export const on = Shape.registerMethod('on', (...args) => async (shape) => {
  const entries = [];
  while (args.length > 0) {
    const [selection, op, rest] = await destructure2(
      shape,
      args,
      'shape',
      'function',
      'rest'
    );
    entries.push({ selection, op });
    args = rest;
  }
  const inputLeafs = [];
  const outputLeafs = [];
  let shapeGeometry = await shape.toGeometry();
  for (const { selection, op } of entries) {
    const leafs = getLeafs(await selection.toGeometry());
    inputLeafs.push(...leafs);
    for (const geometry of leafs) {
      const global = geometry.matrix;
      const local = invertTransform(global);
      const target = Shape.fromGeometry(geometry);
      // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
      // FIXME: op may be async.
      const a = transform(local);
      const b = a.op(op);
      const c = b.transform(global);
      const r = await c(target);
      outputLeafs.push(await r.toGeometry());
    }
  }
  const result = Shape.fromGeometry(
    replacer(inputLeafs, outputLeafs)(shapeGeometry)
  );
  return result;
});
