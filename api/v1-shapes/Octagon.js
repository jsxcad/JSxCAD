import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';
import { orRadius } from './orRadius.js';

export const Octagon = (plan = 1) => Arc({ ...orRadius(plan), sides: 8 });

Shape.prototype.Octagon = shapeMethod(Octagon);

export default Octagon;
