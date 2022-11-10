import Shape from './Shape.js';
import { generateLowerEnvelope } from '@jsxcad/geometry';

export const lowerEnvelope = Shape.registerMethod(
  'lowerEnvelope',
  () => (shape) => Shape.fromGeometry(generateLowerEnvelope(shape.toGeometry()))
);
