import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';
import { orRadius } from './orRadius.js';

export const Tetragon = (plan = 1) => Arc({ ...orRadius(plan), sides: 4 });

Shape.prototype.Tetragon = shapeMethod(Tetragon);

export default Tetragon;
