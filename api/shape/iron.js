import { Iron as Op, iron as op } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const Iron = Shape.registerMethod3('Iron', ['geometries', 'number'], Op);

export const iron = Shape.registerMethod3(
  'iron',
  ['inputGeometry', 'number', 'geometries'],
  op
);
