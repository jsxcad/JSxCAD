import { getLeafs, replacer } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { invertTransform } from '@jsxcad/algorithm-cgal';
import { noOp } from './noOp.js';
import { op as opOp } from './op.js';
import { transform as transformOp } from './transform.js';

export const on = Shape.registerMethod2(
  'on',
  ['inputGeometry', 'geometry', 'function'],
  async (geometry, selection, op = noOp) => {
    const entries = [];
    entries.push({ selection, op });
    const inputLeafs = [];
    const outputLeafs = [];
    for (const { selection, op } of entries) {
      const leafs = getLeafs(selection);
      for (const inputLeaf of leafs) {
        const global = inputLeaf.matrix;
        const local = invertTransform(global);
        const target = Shape.fromGeometry(inputLeaf);
        // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
        const a = await transformOp(local)(target);
        const b = await opOp(op)(a);
        const r = await transformOp(global)(b);
        const outputLeaf = await r.toGeometry();
        inputLeafs.push(inputLeaf);
        outputLeafs.push(outputLeaf);
      }
    }
    const result = Shape.fromGeometry(
      replacer(inputLeafs, outputLeafs)(geometry)
    );
    return result;
  }
);
