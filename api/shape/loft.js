import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loft = Shape.registerShapeMethod('Loft', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    loftGeometry(
      shapes.map((shape) => shape.toGeometry()),
      !modes.includes('open')
    )
  );
});

export const loft = Shape.registerMethod('loft', (...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Loft(...shape.toShapes(shapes), ...modes);
});

export default Loft;
