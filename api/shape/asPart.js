import Shape from './Shape.js';
import { asPart as op } from '@jsxcad/geometry';

// Constructs an item, as a part, from the designator.
export const asPart = Shape.registerMethod3(
  'asPart',
  ['inputGeometry', 'strings'],
  op
);

export default asPart;
