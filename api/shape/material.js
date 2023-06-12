import Shape from './Shape.js';

import { hasMaterial } from '@jsxcad/geometry';

export const material = Shape.registerMethod2(
  'material',
  ['inputGeometry', 'string'],
  (geometry, name) => Shape.fromGeometry(hasMaterial(geometry, name))
);

export default material;
