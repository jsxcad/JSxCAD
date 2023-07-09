import { onPost as post, onPre as pre } from '@jsxcad/geometry';

import Shape from './Shape.js';
import { toGeometry } from './toGeometry.js';

export const on = Shape.registerMethod3(
  'on',
  ['inputGeometry', 'geometry', 'function'],
  pre,
  async (preResults, [geometry, _selector, op = (_v) => (s) => s]) => {
    const results = [];
    const input = Shape.chain(Shape.fromGeometry(geometry));
    for (const { inputLeaf, localInputLeaf, global } of preResults) {
      const localOutputShape = await Shape.apply(
        input,
        op,
        Shape.chain(Shape.fromGeometry(localInputLeaf))
      );
      const localOutputLeaf = await toGeometry()(localOutputShape);
      results.push({ inputLeaf, localOutputLeaf, global });
    }
    const rewritten = post(geometry, results);
    return Shape.fromGeometry(rewritten);
  }
);
