import Shape from './Shape.js';
import { generateLowerEnvelope } from '@jsxcad/geometry';

export const lowerEnvelope = () => (shape) =>
  Shape.fromGeometry(generateLowerEnvelope(shape.toGeometry()));

Shape.registerMethod('lowerEnvelope', lowerEnvelope);
