import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item from the designator.
export const as = Shape.chainable(
  (...names) =>
    (shape) =>
      Shape.fromGeometry(
        taggedItem(
          { tags: names.map((name) => `item:${name}`) },
          shape.toGeometry()
        )
      )
);

Shape.registerMethod('as', as);

export default as;
