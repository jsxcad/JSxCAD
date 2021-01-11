import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Box } from './Box.js';

export const Block = (diameter = 1, top = 1, base = 0) =>
  Box(diameter).top(top).base(base);

Shape.prototype.Block = shapeMethod(Block);

export default Block;
