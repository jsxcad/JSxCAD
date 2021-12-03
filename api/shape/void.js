import Shape from './Shape.js';
import { hasTypeVoid } from '@jsxcad/geometry';

export const voidFn = () => (shape) =>
  Shape.fromGeometry(hasTypeVoid(shape.toGeometry()));

Shape.registerMethod('void', voidFn);
