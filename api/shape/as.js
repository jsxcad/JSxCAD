import { As as AsOp, as as asOp } from '@jsxcad/geometry';

import Shape from './Shape.js';

export const As = Shape.registerMethod3('As', ['strings', 'geometries'], AsOp);

export const as = Shape.registerMethod3(
  'as',
  ['inputGeometry', 'strings', 'geometries'],
  asOp
);

export default as;
