import Shape from './Shape.js';

import { hasMaterial as op } from '@jsxcad/geometry';

export const material = Shape.registerMethod3(
  'material',
  ['inputGeometry', 'string'],
  op
);

export default material;
