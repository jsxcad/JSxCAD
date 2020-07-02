import { Shape } from './Shape.js';

import { allTags } from '@jsxcad/geometry-tagged';

export const tags = (shape) =>
  [...allTags(shape.toGeometry())]
    .filter((tag) => tag.startsWith('user/'))
    .map((tag) => tag.substring(5));

const method = function () {
  return tags(this);
};

Shape.prototype.tags = method;
