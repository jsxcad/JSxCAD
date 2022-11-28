import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { seam as seamGeometry } from '@jsxcad/geometry';

export const seam = Shape.registerMethod('seam', (...args) => async (shape) => {
  const { shapesAndFunctions: selections } = destructure(args);
  return Shape.fromGeometry(
    seamGeometry(
      await shape.toGeometry(),
      await shape.toShapesGeometries(selections)
    )
  );
});
