import Shape from './Shape.js';
import { alignment as op } from '@jsxcad/geometry';

export const alignment = Shape.registerMethod3(
  'alignment',
  ['inputGeometry', 'string', 'coordinate'],
  op
);
