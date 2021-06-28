import Shape from './Shape.js';
import { grow as growGeometry } from '@jsxcad/geometry';

const growMethod = (shape, amount) =>
  Shape.fromGeometry(growGeometry(shape.toGeometry(), amount));

Shape.registerMethod('grow', growMethod);

// FIX: How can we do this automatically via registerMethod
export const grow = (amount) => (shape) => growMethod(shape, amount);
