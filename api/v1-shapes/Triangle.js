import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Triangle = (x, y, z) => Arc(x, y, z).hasSides(3);

Shape.prototype.Triangle = shapeMethod(Triangle);

export default Triangle;
