import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Tetragon = (x, y, z) => Arc(x, y, z).hasSides(4);

Shape.prototype.Tetragon = shapeMethod(Tetragon);

export default Tetragon;
