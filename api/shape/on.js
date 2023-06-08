import { getLeafs, replacer } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { noOp } from './noOp.js';
import { op as opOp } from './op.js';
import { transform as transformOp } from './transform.js';

export const on = Shape.registerMethod2(
  'on',
  ['inputGeometry', 'shape', 'function'],
  async (geometry, selection, op = noOp) => {
    const entries = [];
    entries.push({ selection, op });
    const inputLeafs = [];
    const outputLeafs = [];
    for (const { selection, op } of entries) {
      const leafs = getLeafs(await selection.toGeometry());
      inputLeafs.push(...leafs);
      for (const geometry of leafs) {
        const global = geometry.matrix;
        const local = invertTransform(global);
        const target = Shape.fromGeometry(geometry);
        // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
        console.log(`QQ/on/target: ${JSON.stringify(target)}`);
        console.log(`QQ/on/local: ${JSON.stringify(local)}`);
        const a = await transformOp(local)(target);
        console.log(`QQ/on/a: ${JSON.stringify(a)}`);
        const b = await opOp(op)(a);
        console.log(`QQ/on/b: ${JSON.stringify(b)}`);
        const r = await transformOp(global)(b);
        console.log(`QQ/on/r: ${JSON.stringify(r)}`);
        outputLeafs.push(await r.toGeometry());
      }
    }
    const result = Shape.fromGeometry(
      replacer(inputLeafs, outputLeafs)(geometry)
    );
    return result;
  }
);
