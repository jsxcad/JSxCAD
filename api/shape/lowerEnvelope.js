import Shape from './Shape.js';
import { generateLowerEnvelope } from '@jsxcad/geometry';

export const lowerEnvelope = Shape.registerMethod(
  'lowerEnvelope',
  () => async (shape) =>
    Shape.fromGeometry(generateLowerEnvelope(await shape.toGeometry()))
);
