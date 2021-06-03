import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { taggedDisjointAssembly } from '@jsxcad/geometry';

export const Empty = (...shapes) =>
  Shape.fromGeometry(taggedDisjointAssembly({}));

export default Empty;

Shape.prototype.Empty = shapeMethod(Empty);
