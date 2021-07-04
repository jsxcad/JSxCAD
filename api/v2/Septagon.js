import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Septagon = (x, y, z) => Arc(x, y, z).hasSides(7);

Shape.prototype.Septagon = Shape.shapeMethod(Septagon);

export default Septagon;
