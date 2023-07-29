import { Group, on } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const put = Shape.registerMethod3(
  'put',
  ['inputGeometry', 'geometries'],
  (geometry, geometries) => on(geometry, geometry, () => Group(geometries))
);
