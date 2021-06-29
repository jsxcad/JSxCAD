import { Shape } from './Shape.js';

import { allTags } from '@jsxcad/geometry';

export const tags =
  (op = (tags, shape) => tags) =>
  (shape) =>
    op(
      [...allTags(shape.toGeometry())]
        .filter((tag) => tag.startsWith('user/'))
        .map((tag) => tag.substring(5)),
      shape
    );

Shape.registerMethod('tags', tags);
