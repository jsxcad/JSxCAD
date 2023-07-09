import Shape from './Shape.js';
import { masking as op } from '@jsxcad/geometry';

export const masking = Shape.registerMethod3(
  'masking',
  ['inputGeometry', 'geometry'],
  op
);

export default masking;
