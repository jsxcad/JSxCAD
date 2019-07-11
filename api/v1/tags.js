import { Shape } from './Shape';

import { allTags } from '@jsxcad/geometry-tagged';

export const tags = (shape) => allTags(shape.toGeometry());

const method = function () { return tags(this); };

Shape.prototype.tags = method;
