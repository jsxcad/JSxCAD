import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';
import { orRadius } from './orRadius.js';

export const Hexagon = (plan = 1) => Arc({ ...orRadius(plan), sides: 6 });

Shape.prototype.Hexagon = shapeMethod(Hexagon);

export default Hexagon;
