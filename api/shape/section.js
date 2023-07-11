import Shape from './Shape.js';
import { section as op } from '@jsxcad/geometry';

export const section = Shape.registerMethod3(
  'section',
  ['inputGeometry', 'geometries'],
  op
);
