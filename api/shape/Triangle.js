import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Triangle = Shape.registerShapeMethod('Triangle', (x, y, z) => Arc(x, y, z, { sides: 3}));

export default Triangle;
