import * as g from '@jsxcad/geometry';

import Shape from './Shape.js';

export const X = Shape.registerMethod3('X', ['number'], g.X);
export const Y = Shape.registerMethod3('Y', ['number'], g.Y);
export const Z = Shape.registerMethod3('Z', ['number'], g.Z);
export const XY = Shape.registerMethod3('XY', ['number'], g.XY);
export const YX = Shape.registerMethod3('YX', ['number'], g.YX);
export const XZ = Shape.registerMethod3('XZ', ['number'], g.XZ);
export const ZX = Shape.registerMethod3('ZX', ['number'], g.ZX);
export const YZ = Shape.registerMethod3('YZ', ['number'], g.YZ);
export const ZY = Shape.registerMethod3('ZY', ['number'], g.ZY);
export const RX = Shape.registerMethod3('RX', ['number'], g.RX);
export const RY = Shape.registerMethod3('RY', ['number'], g.RY);
export const RZ = Shape.registerMethod3('RZ', ['number'], g.RZ);
