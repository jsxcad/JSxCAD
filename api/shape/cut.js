import Shape from './Shape.js';
import { cut as cutGeometry } from '@jsxcad/geometry';
import { destructure } from './destructure.js';

export const cut = Shape.registerMethod('cut', (...args) => async (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    cutGeometry(
      await shape.toGeometry(),
      await shape.toShapesGeometries(shapes),
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid')
    )
  );
});
