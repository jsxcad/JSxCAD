import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Pentagon = (x, y, z) => Arc(x, y, z).hasSides(5);

Shape.prototype.Pentagon = shapeMethod(Pentagon);

export default Pentagon;
