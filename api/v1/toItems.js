import { Shape, fromGeometry } from './Shape';

import { getItems } from '@jsxcad/geometry-tagged';

export const toItems = (shape) => getItems(shape.toKeptGeometry()).map(fromGeometry);

const method = function (options = {}) { return toItems(this); };

Shape.prototype.toItems = method;
