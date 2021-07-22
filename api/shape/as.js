import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item from the designator.
export const as = (name) => (shape) =>
  Shape.fromGeometry(
    taggedItem({ tags: [`item:${name}`] }, shape.toGeometry())
  );

Shape.registerMethod('as', as);

export default as;
