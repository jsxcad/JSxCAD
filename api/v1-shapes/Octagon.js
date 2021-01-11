import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Octagon = (x, y, z) => Arc(x, y, z).sides(8);

Shape.prototype.Octagon = shapeMethod(Octagon);

export default Octagon;
