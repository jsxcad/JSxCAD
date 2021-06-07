import { Shape } from './Shape.js';

import { allTags } from '@jsxcad/geometry';

export const tags = (shape, op = (tags, shape) => tags) =>
  op(
    [...allTags(shape.toGeometry())]
      .filter((tag) => tag.startsWith('user/'))
      .map((tag) => tag.substring(5)),
    shape
  );

const method = function (op) {
  return tags(this, op);
};

Shape.prototype.tags = method;
