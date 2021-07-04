import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Octagon = (x, y, z) => Arc(x, y, z).hasSides(8);

Shape.prototype.Octagon = Shape.shapeMethod(Octagon);

export default Octagon;
