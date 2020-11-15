import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';
import { orRadius } from './orRadius.js';

export const Septagon = (plan = 1) => Arc({ ...orRadius(plan), sides: 7 });

Shape.prototype.Septagon = shapeMethod(Septagon);

export default Septagon;
