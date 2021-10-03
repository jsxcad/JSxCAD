import Shape from './Shape.js';
import { computeCentroid } from '@jsxcad/geometry';

export const center = () => (shape) =>
  Shape.fromGeometry(computeCentroid(shape.toGeometry()));

Shape.registerMethod('center', center);

export default center;
