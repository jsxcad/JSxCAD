import Shape from './Shape.js';
import { noGhost } from '@jsxcad/geometry';

export const clean = Shape.chainable(
  () => (shape) => Shape.fromGeometry(noGhost(shape.toGeometry()))
);

Shape.registerMethod('clean', clean);
