import Shape from './Shape.js';
import { generateLowerEnvelope } from '@jsxcad/geometry';

export const lowerEnvelope = Shape.registerMethod2(
  'lowerEnvelope',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(generateLowerEnvelope(geometry))
);
