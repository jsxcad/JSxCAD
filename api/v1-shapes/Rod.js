import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Rod = (diameter = 1, top = 1, base = 0) =>
  Arc(diameter).top(top).base(base);

Shape.prototype.Rod = shapeMethod(Rod);

export default Rod;
