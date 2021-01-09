import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Septagon = (x, y, z) => Arc(x, y, z).sides(7);

Shape.prototype.Septagon = shapeMethod(Septagon);

export default Septagon;
