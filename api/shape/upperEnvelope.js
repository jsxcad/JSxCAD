import Shape from './Shape.js';
import { generateUpperEnvelope } from '@jsxcad/geometry';

export const upperEnvelope = () => (shape) =>
  Shape.fromGeometry(generateUpperEnvelope(shape.toGeometry()));

Shape.registerMethod('upperEnvelope', upperEnvelope);
