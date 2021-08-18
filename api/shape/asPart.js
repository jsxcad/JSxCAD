import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item, as a part, from the designator.
export const asPart = (partName) => (shape) =>
  Shape.fromGeometry(
    taggedItem({ tags: [`part:${partName}`] }, shape.toGeometry())
  );

Shape.registerMethod('asPart', asPart);

export default asPart;
