import Shape from './Shape.js';
import { generateLowerEnvelope } from '@jsxcad/geometry';

export const lowerEnvelope = Shape.registerMethod3(
  'lowerEnvelope',
  ['inputGeometry', 'modes:face,edge,plan'],
  generateLowerEnvelope
);
