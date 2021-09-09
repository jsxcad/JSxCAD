import Shape from './Shape.js';
import { qualifyTag } from './tag.js';
import { rewriteTags } from '@jsxcad/geometry';

export const notAs =
  (...tags) =>
  (shape) =>
    Shape.fromGeometry(
      rewriteTags(
        [],
        tags.map((tag) => qualifyTag(tag)),
        shape.toGeometry()
      )
    );

Shape.registerMethod('notAs', notAs);
