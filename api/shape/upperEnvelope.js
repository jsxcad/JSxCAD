import Shape from './Shape.js';
import { generateUpperEnvelope } from '@jsxcad/geometry';

export const upperEnvelope = Shape.registerMethod(
  'upperEnvelope',
  () => async (shape) => Shape.fromGeometry(generateUpperEnvelope(await shape.toGeometry()))
);
