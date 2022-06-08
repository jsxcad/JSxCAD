import Shape from './Shape.js';
import { hasShowOverlay } from '@jsxcad/geometry';

export const overlay = Shape.chainable(
  () => (shape) => Shape.fromGeometry(hasShowOverlay(shape.toGeometry()))
);

Shape.registerMethod('overlay', overlay);
