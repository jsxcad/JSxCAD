import Shape from './Shape.js';
import { generateLowerEnvelope } from '@jsxcad/geometry';

export const lowerEnvelope = Shape.chainable(
  () => (shape) => Shape.fromGeometry(generateLowerEnvelope(shape.toGeometry()))
);

Shape.registerMethod('lowerEnvelope', lowerEnvelope);
