import Shape from './Shape.js';
import { hasTypeVoid } from '@jsxcad/geometry';

export const voidFn = Shape.chainable(
  () => (shape) => Shape.fromGeometry(hasTypeVoid(shape.toGeometry()))
);

Shape.registerMethod('void', voidFn);
