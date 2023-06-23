import Shape from './Shape.js';
import { shell as op } from '@jsxcad/geometry';

export const shell = Shape.registerMethod3(
  'shell',
  ['inputGeometry', 'interval', 'number', 'number', 'modes:protect', 'options'],
  op);
