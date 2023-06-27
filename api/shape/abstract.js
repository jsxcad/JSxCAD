import { Shape } from './Shape.js';
import { abstract as op } from '@jsxcad/geometry';

export const abstract = Shape.registerMethod3(
  'abstract',
  ['inputGeometry', 'strings'],
  op
);
