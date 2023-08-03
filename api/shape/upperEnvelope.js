import Shape from './Shape.js';
import { generateUpperEnvelope } from '@jsxcad/geometry';

export const upperEnvelope = Shape.registerMethod3(
  'upperEnvelope',
  ['inputGeometry'],
  generateUpperEnvelope
);
