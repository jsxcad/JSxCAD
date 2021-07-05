import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Triangle = (x, y, z) => Arc(x, y, z).hasSides(3);

Shape.prototype.Triangle = Shape.shapeMethod(Triangle);

export default Triangle;
