import Shape from './Shape.js';
import { hasTypeGhost } from '@jsxcad/geometry';

export const ghost = Shape.chainable(
  () => (shape) => Shape.fromGeometry(hasTypeGhost(shape.toGeometry()))
);

Shape.registerMethod('ghost', ghost);
