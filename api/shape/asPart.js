import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item, as a part, from the designator.
export const asPart = Shape.registerMethod2(
  'asPart',
  ['inputGeometry', 'string'],
  (geometry, partName) =>
    Shape.fromGeometry(taggedItem({ tags: [`part:${partName}`] }, geometry))
);

export default asPart;
