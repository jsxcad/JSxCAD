import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loft = (...shapes) =>
  Shape.fromGeometry(loftGeometry(shapes.map((shape) => shape.toGeometry())));

Shape.prototype.Loft = Shape.shapeMethod(Loft);
Shape.Loft = Loft;

export default Loft;

export const loft =
  (...shapes) =>
  (shape) =>
    Loft(shape, ...shape.toShapes(shapes));

Shape.registerMethod('loft', loft);
