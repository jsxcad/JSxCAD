import * as g from '@jsxcad/geometry';

import Shape from './Shape.js';

export const X = Shape.registerMethod3('X', ['numbers'], g.X);
export const Y = Shape.registerMethod3('Y', ['numbers'], g.Y);
export const Z = Shape.registerMethod3('Z', ['numbers'], g.Z);
export const XY = Shape.registerMethod3('XY', ['numbers'], g.XY);
export const YX = Shape.registerMethod3('YX', ['numbers'], g.YX);
export const XZ = Shape.registerMethod3('XZ', ['numbers'], g.XZ);
export const ZX = Shape.registerMethod3('ZX', ['numbers'], g.ZX);
export const YZ = Shape.registerMethod3('YZ', ['numbers'], g.YZ);
export const ZY = Shape.registerMethod3('ZY', ['numbers'], g.ZY);
export const RX = Shape.registerMethod3('RX', ['numbers'], g.RX);
export const RY = Shape.registerMethod3('RY', ['numbers'], g.RY);
export const RZ = Shape.registerMethod3('RZ', ['numbers'], g.RZ);
