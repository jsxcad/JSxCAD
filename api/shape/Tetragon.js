import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Tetragon = (x, y, z) => Arc(x, y, z).hasSides(4);

Shape.prototype.Tetragon = Shape.shapeMethod(Tetragon);

export default Tetragon;
