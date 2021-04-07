import Shape from './Shape.js';
import { minkowskiSum as minkowskiSumOfGeometry } from '@jsxcad/geometry-tagged';

export const minkowskiSum = (shape, offset) =>
  Shape.fromGeometry(
    minkowskiSumOfGeometry(shape.toGeometry(), offset.toGeometry())
  );

const minkowskiSumMethod = function (offset) {
  return minkowskiSum(this, offset);
};

Shape.registerMethod('minkowskiSum', minkowskiSumMethod);
