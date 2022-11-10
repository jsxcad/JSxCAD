import { getLeafs, replacer } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { transform } from './transform.js';

export const on = Shape.registerMethod('on', (selection, ...ops) => async (shape) => {
  console.log(`QQ/on/1`);
  ops = ops.map((op) => (Shape.isFunction(op) ? op : () => op));
  console.log(`QQ/on/2`);
  // We've already selected the item to replace, e.g., s.on(g('plate'), ...);
  // FIX: This needs to walk through items.
  // selection may or may not have a context. waiting on it will require a context.
  const resolvedSelection = await shape.toShape(selection(shape));
  console.log(`QQ/on/3`);
  const selectionGeometry = resolvedSelection.toGeometry();
  console.log(`QQ/on/3/selectionGeometry: ${JSON.stringify(selectionGeometry)}`);
  const inputLeafs = getLeafs(selectionGeometry);
  console.log(`QQ/on/4`);
  const outputLeafs = [];
  for (const geometry of inputLeafs) {
    const global = geometry.matrix;
    const local = invertTransform(global);
    const target = Shape.fromGeometry(geometry);
    // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
    // FIXME: op may be async.
    console.log(`QQ/on/5: ${JSON.stringify(geometry)}`);
    const a = transform(local);
    const b = a.op(...ops);
    const c = b.transform(global);
    const r = await c(target);
    outputLeafs.push(r.toGeometry());
  };
  console.log(`QQ/on/6: ${JSON.stringify(shape.toGeometry())}`);
  const result = Shape.fromGeometry(replacer(inputLeafs, outputLeafs)(selectionGeometry));
  console.log(`QQ/on/result: ${JSON.stringify(result)}`);
  return result;
});
