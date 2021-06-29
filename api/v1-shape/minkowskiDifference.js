import Shape from './Shape.js';
import { minkowskiDifference as minkowskiDifferenceOfGeometry } from '@jsxcad/geometry';

export const minkowskiDifference = (offset) => (shape) =>
  Shape.fromGeometry(
    minkowskiDifferenceOfGeometry(shape.toGeometry(), offset.toGeometry())
  );

Shape.registerMethod('minkowskiDifference', minkowskiDifference);
