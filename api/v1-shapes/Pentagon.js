import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';
import { orRadius } from './orRadius.js';

export const Pentagon = (plan = 1) => Arc({ ...orRadius(plan), sides: 5 });

Shape.prototype.Pentagon = shapeMethod(Pentagon);

export default Pentagon;
