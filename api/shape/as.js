import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item from the designator.
export const as = Shape.registerMethod2(
  'as',
  ['inputGeometry', 'strings'],
  (geometry, names) =>
    Shape.fromGeometry(
      taggedItem({ tags: names.map((name) => `item:${name}`) }, geometry)
    )
);

export default as;
