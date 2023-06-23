import Shape from './Shape.js';
import { retag as retagOp } from '@jsxcad/geometry';
import { toTagsFromName } from '@jsxcad/algorithm-color';

const colorOp = (geometry, name) =>
  retagOp(geometry, ['color:*'], toTagsFromName(name));

export const color = Shape.registerMethod3(
  'color',
  ['inputGeometry', 'string'],
  colorOp
);
