import { getLeafs, replacer } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

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
  let shapeGeometry = await shape.toGeometry();
  for (const { selection, op } of entries) {
    const inputLeafs = getLeafs(await selection.toGeometry());
    const outputLeafs = [];
    for (const geometry of inputLeafs) {
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
    shapeGeometry = replacer(inputLeafs, outputLeafs)(shapeGeometry);
  }
  const result = Shape.fromGeometry(shapeGeometry);
  return result;
});
