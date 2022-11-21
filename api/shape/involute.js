import Shape from './Shape.js';
import { involute as involuteGeometry } from '@jsxcad/geometry';

export const involute = Shape.registerMethod(
  'involute',
  () => async (shape) =>
    Shape.fromGeometry(involuteGeometry(await shape.toGeometry()))
);
