import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { getInverseMatrices } from '@jsxcad/geometry';

export const at = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions: ops } = destructure(args);
  const { local, global } = getInverseMatrices(shape.toGeometry());
  const selections = shape.toShapes(ops.shift());
  for (const selection of selections) {
    const { local: selectionLocal, global: selectionGlobal } =
      getInverseMatrices(selection.toGeometry());
    shape = shape
      .transform(local)
      .transform(selectionGlobal)
      .op(...ops)
      .transform(selectionLocal)
      .transform(global);
  }
  return shape;
});

Shape.registerMethod('at', at);
