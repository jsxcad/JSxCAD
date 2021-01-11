import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Hexagon = (x, y, z) => Arc(x, y, z).sides(6);

Shape.prototype.Hexagon = shapeMethod(Hexagon);

export default Hexagon;
