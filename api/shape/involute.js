import Shape from './Shape.js';
import { involute as op } from '@jsxcad/geometry';

export const involute = Shape.registerMethod3(
  'involute',
  ['inputGeometry'],
  op
);
