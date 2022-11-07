import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Octagon = Shape.registerShapeMethod('Octagon', (x, y, z) => Arc(x, y, z, { sides: 8 }));

export default Octagon;
