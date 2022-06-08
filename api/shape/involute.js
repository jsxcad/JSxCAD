import Shape from './Shape.js';
import { involute as involuteGeometry } from '@jsxcad/geometry';

export const involute = Shape.chainable(
  () => (shape) => Shape.fromGeometry(involuteGeometry(shape.toGeometry()))
);

Shape.registerMethod('involute', involute);
