import Shape from './Shape.js';
import { generateUpperEnvelope } from '@jsxcad/geometry';

export const upperEnvelope = Shape.registerMethod2(
  'upperEnvelope',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(generateUpperEnvelope(geometry))
);
