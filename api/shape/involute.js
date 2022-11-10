import Shape from './Shape.js';
import { involute as involuteGeometry } from '@jsxcad/geometry';

export const involute = Shape.registerMethod(
  'involute',
  () => (shape) => Shape.fromGeometry(involuteGeometry(shape.toGeometry()))
);
