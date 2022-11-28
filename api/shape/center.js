import Shape from './Shape.js';
import { computeCentroid } from '@jsxcad/geometry';

export const center = Shape.registerMethod(
  'center',
  () => (shape) => Shape.fromGeometry(computeCentroid(shape.toGeometry()))
);

export default center;
