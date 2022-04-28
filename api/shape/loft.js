import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const Loft = (...shapes) =>
  Shape.fromGeometry(loftGeometry(shapes.map((shape) => shape.toGeometry())));

Shape.prototype.Loft = Shape.shapeMethod(Loft);
Shape.Loft = Loft;

export const loft =
  (...shapes) =>
  (shape) =>
    Loft(shape, ...shape.toShapes(shapes));

Shape.registerMethod('loft', loft);

export const OpenLoft = (...shapes) =>
  Shape.fromGeometry(
    loftGeometry(
      shapes.map((shape) => shape.toGeometry()),
      /* close= */ false
    )
  );

Shape.prototype.OpenLoft = Shape.shapeMethod(OpenLoft);
Shape.OpenLoft = OpenLoft;

export const openLoft =
  (...shapes) =>
  (shape) =>
    OpenLoft(shape, ...shape.toShapes(shapes));

Shape.registerMethod('openLoft', openLoft);

export default Loft;
