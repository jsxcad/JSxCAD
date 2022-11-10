import Shape from './Shape.js';
import { hasShowOverlay } from '@jsxcad/geometry';

export const overlay = Shape.registerMethod(
  'overlay',
  () => (shape) => Shape.fromGeometry(hasShowOverlay(shape.toGeometry()))
);
