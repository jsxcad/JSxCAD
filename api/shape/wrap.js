import { Wrap as WrapOp, wrap as wrapOp } from '@jsxcad/geometry';

import { Shape } from './Shape.js';

export const Wrap = Shape.registerMethod3(
  'Wrap',
  ['geometries', 'number', 'number', 'number', 'number'],
  WrapOp
);

export const wrap = Shape.registerMethod3(
  'wrap',
  ['inputGeometry', 'geometries', 'number', 'number', 'number', 'number'],
  wrapOp
);

export default wrap;
