import { AsPart as AsPartOp, asPart as asPartOp } from '@jsxcad/geometry';

import Shape from './Shape.js';

// Constructs an item, as a part, from the designator.
export const AsPart = Shape.registerMethod3(
  'AsPart',
  ['strings', 'geometries'],
  AsPartOp
);

// Constructs an item, as a part, from the designator.
export const asPart = Shape.registerMethod3(
  'asPart',
  ['inputGeometry', 'strings', 'geometries'],
  asPartOp
);

export default asPart;
