import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item, as a part, from the designator.
export const asPart = Shape.registerMethod(
  'asPart',
  (partName) => (shape) =>
    Shape.fromGeometry(
      taggedItem({ tags: [`part:${partName}`] }, shape.toGeometry())
    )
);

export default asPart;
