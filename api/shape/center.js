import Shape from './Shape.js';
import { computeCentroid } from '@jsxcad/geometry';

export const center = Shape.chainable(
  () => (shape) => Shape.fromGeometry(computeCentroid(shape.toGeometry()))
);

Shape.registerMethod('center', center);

export default center;
