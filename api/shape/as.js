import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item from the designator.
export const as = Shape.registerMethod(
  'as',
  (...names) =>
    (shape) =>
      Shape.fromGeometry(
        taggedItem(
          { tags: names.map((name) => `item:${name}`) },
          shape.toGeometry()
        )
      )
);

export default as;
