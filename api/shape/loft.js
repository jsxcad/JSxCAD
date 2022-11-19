import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { loft as loftGeometry } from '@jsxcad/geometry';
import { toShapesGeometries } from './toShapesGeometries.js';

export const Loft = Shape.registerShapeMethod('Loft', async (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    loftGeometry(
      await toShapesGeometries(shapes)(null),
      !modes.includes('open')
    )
  );
});

export const loft = Shape.registerMethod('loft', (...args) => async (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Loft(...await shape.toShapes(shapes), ...modes);
});

export default Loft;
