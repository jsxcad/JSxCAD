import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Box } from './Box.js';

export const Block = (radius, height, depth) => Box(radius).pull(height, depth);

Shape.prototype.Block = shapeMethod(Block);

export default Block;
