import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Rod = (radius, height, depth) => Arc(radius).pull(height, depth);

Shape.prototype.Rod = shapeMethod(Rod);

export default Rod;
