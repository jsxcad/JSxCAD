import Shape from './Shape.js';
import { hasTypeGhost } from '@jsxcad/geometry';

export const ghost = Shape.registerMethod(
  'ghost',
  () => (shape) => Shape.fromGeometry(hasTypeGhost(shape.toGeometry()))
);
