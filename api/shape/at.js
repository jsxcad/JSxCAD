import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { getInverseMatrices } from '@jsxcad/geometry';

export const at = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions: ops } = destructure(args);
  const selections = shape.toShapes(ops.shift());
  for (const selection of selections) {
    const { local, global } = getInverseMatrices(selection.toGeometry());
    shape = shape
      .transform(global)
      .op(...ops)
      .transform(local);
  }
  return shape;
});

Shape.registerMethod('at', at);
