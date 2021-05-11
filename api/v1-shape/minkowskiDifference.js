import Shape from './Shape.js';
import { minkowskiDifference as minkowskiDifferenceOfGeometry } from '@jsxcad/geometry-tagged';

export const minkowskiDifference = (shape, offset) =>
  Shape.fromGeometry(
    minkowskiDifferenceOfGeometry(shape.toGeometry(), offset.toGeometry())
  );

Shape.registerMethod('minkowskiDifference', minkowskiDifference);
