import Shape from './Shape.js';
import { taggedItem } from '@jsxcad/geometry';

// Constructs an item from the designator.
export const as = Shape.registerMethod(
  'as',
  (...names) =>
    async (shape) =>
      Shape.fromGeometry(
        taggedItem(
          { tags: names.map((name) => `item:${name}`) },
          await shape.toGeometry()
        )
      )
);

export default as;
