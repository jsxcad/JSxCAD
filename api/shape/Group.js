import Shape from './Shape.js';

import { And as AndOp } from '@jsxcad/geometry';

export const Group = Shape.registerMethod3(
  'Group',
  ['geometries'],
  AndOp
);

export default Group;
