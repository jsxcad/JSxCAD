import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Hexagon = (x, y, z) => Arc(x, y, z).hasSides(6);

Shape.prototype.Hexagon = Shape.shapeMethod(Hexagon);

export default Hexagon;
