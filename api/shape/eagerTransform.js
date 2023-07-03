import Shape from './Shape.js';
import { eagerTransform as op } from '@jsxcad/geometry';

export const eagerTransform = Shape.registerMethod3(
  'eagerTransform',
  ['inputGeometry', 'value'],
  op
);

export default eagerTransform;
