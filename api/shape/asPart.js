import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item, as a part, from the designator.
export const asPart = Shape.registerMethod(
  'asPart',
  (partName) => async (shape) =>
    Shape.fromGeometry(
      taggedItem({ tags: [`part:${partName}`] }, await shape.toGeometry())
    )
);

export default asPart;
