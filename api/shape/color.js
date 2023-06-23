import Shape from './Shape.js';
import { toTagsFromName } from '@jsxcad/algorithm-color';
import { retagOp } from './untag.js';

const colorOp = (geometry, name) => retagOp(geometry, ['color:*'], toTagsFromName(name));

export const color = Shape.registerMethod3(
  'color',
  ['inputGeometry', 'string'],
  colorOp
);
