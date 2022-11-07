import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Pentagon = Shape.registerShapeMethod('Pentagon', (x, y, z) => Arc(x, y, z, { sides: 5 }));

export default Pentagon;
