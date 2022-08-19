import Shape from './Shape.js';
import { computeNormal } from '@jsxcad/geometry';

export const normal = Shape.chainable(
  () => (shape) =>
    Shape.fromGeometry(computeNormal(shape.toGeometry()))
);

Shape.registerMethod('normal', normal);

export default normal;
