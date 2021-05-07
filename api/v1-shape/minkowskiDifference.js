import Shape from './Shape.js';
import { minkowskiDifference as minkowskiDifferenceOfGeometry } from '@jsxcad/geometry-tagged';

export const minkowskiDifference = (shape, offset) =>
  Shape.fromGeometry(
    minkowskiDifferenceOfGeometry(shape.toGeometry(), offset.toGeometry())
  );

const minkowskiDifferenceMethod = function (offset) {
  return minkowskiDifference(this, offset);
};

Shape.registerMethod('minkowskiDifference', minkowskiDifferenceMethod);
