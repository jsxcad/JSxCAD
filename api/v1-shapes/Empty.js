import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { taggedGroup } from '@jsxcad/geometry';

export const Empty = (...shapes) => Shape.fromGeometry(taggedGroup({}));

export default Empty;

Shape.prototype.Empty = shapeMethod(Empty);
