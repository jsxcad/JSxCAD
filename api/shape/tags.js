import { Shape } from './Shape.js';

import { allTags } from '@jsxcad/geometry';

export const tags =
  (namespace = 'user', op = (tags, shape) => tags) =>
  (shape) => {
    const prefix = `${namespace}:`;
    return op(
      [...allTags(shape.toGeometry())]
        .filter((tag) => tag.startsWith(prefix))
        .map((tag) => tag.substring(prefix.length)),
      shape
    );
  };

Shape.registerMethod('tags', tags);
