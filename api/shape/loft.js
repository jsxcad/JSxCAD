import Shape from './Shape.js';
import { destructure } from './destructure.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loft = (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    loftGeometry(
      shapes.map((shape) => shape.toGeometry()),
      !modes.includes('open')
    )
  );
};

Shape.prototype.Loft = Shape.shapeMethod(Loft);
Shape.Loft = Loft;

export const loft = Shape.chainable((...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Loft(...shape.toShapes(shapes), ...modes);
});

Shape.registerMethod('loft', loft);

export default Loft;
