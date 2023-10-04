import Shape from './Shape.js';
import { validate as validateGeometry } from '@jsxcad/geometry';

export const validate = Shape.registerMethod3(
  'validate',
  ['inputGeometry', 'strings'],
  validateGeometry
);
