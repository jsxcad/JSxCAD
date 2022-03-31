import Shape from './Shape.js';
import { loft as loftGeometry } from '@jsxcad/geometry';

export const loft =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      loftGeometry([
        shape.toGeometry(),
        ...shape.toShapes(shapes).map((shape) => shape.toGeometry()),
      ])
    );

Shape.registerMethod('loft', loft);
