import Shape from './Shape.js';

import { taggedGroup } from '@jsxcad/geometry';

export const Group = Shape.registerMethod2(
  'Group',
  ['geometries'],
  (geometries) => Shape.fromGeometry(taggedGroup({}, ...geometries))
);

export default Group;
