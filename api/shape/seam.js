import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { seam as seamGeometry } from '@jsxcad/geometry';

export const seam = Shape.chainable((...args) => (shape) => {
  const { shapesAndFunctions: selections } = destructure(args);
  return Shape.fromGeometry(
    seamGeometry(
      shape.toGeometry(),
      shape.toShapes(selections).map((shape) => shape.toGeometry())
    )
  );
});

Shape.registerMethod('seam', seam);