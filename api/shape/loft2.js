import Shape from './Shape.js';
import { loft2 as loftGeometry2 } from '@jsxcad/geometry';

export const loft2 =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      loftGeometry2(
        shape.toGeometry(),
        ...shape.toFlatValues(shapes).map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('loft2', loft2);
