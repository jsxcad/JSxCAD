import Shape from './Shape.js';
import { deform as deformGeometry } from '@jsxcad/geometry';
import { destructure } from './destructure.js';

export const deform = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions: selections, object: options } = destructure(args);
  const { iterations, tolerance, alpha } = options;
  return Shape.fromGeometry(
    deformGeometry(
      shape.toGeometry(),
      selections.map((selection) => shape.toShape(selection).toGeometry()),
      iterations,
      tolerance,
      alpha
    )
  );
});

Shape.registerMethod('deform', deform);
