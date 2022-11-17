import './toShapes.js';

import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { getInverseMatrices } from '@jsxcad/geometry';
import { transform } from './transform.js';

const toShapesOp = Shape.ops.get('toShapes');

export const at = Shape.registerMethod('at', (...args) => async (shape) => {
  const { shapesAndFunctions: ops } = destructure(args);
  const { local, global } = getInverseMatrices(await shape.toGeometry());
  const selections = await toShapesOp(ops.shift())(shape);
  for (const selection of selections) {
    const { local: selectionLocal, global: selectionGlobal } =
      getInverseMatrices(await selection.toGeometry());
    shape =
      await transform(local)
      .transform(selectionGlobal)
      .op(...ops)
      .transform(selectionLocal)
      .transform(global)(shape);
  }
  return shape;
});
