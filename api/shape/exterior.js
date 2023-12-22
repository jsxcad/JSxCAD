import Shape from './Shape.js';
import { exterior as op } from '@jsxcad/geometry';

export const exterior = Shape.registerMethod3(
  'exterior',
  ['inputGeometry'],
  op
);

export default exterior;
