import Shape from './Shape.js';
import { generateUpperEnvelope } from '@jsxcad/geometry';

export const upperEnvelope = Shape.registerMethod(
  'upperEnvelope',
  () => (shape) => Shape.fromGeometry(generateUpperEnvelope(shape.toGeometry()))
);
