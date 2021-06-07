import Shape from './Shape.js';
import { minkowskiSum as minkowskiSumOfGeometry } from '@jsxcad/geometry';

export const minkowskiSum = (shape, offset) =>
  Shape.fromGeometry(
    minkowskiSumOfGeometry(shape.toGeometry(), offset.toGeometry())
  );

Shape.registerMethod('minkowskiSum', minkowskiSum);