import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Pentagon = (x, y, z) => Arc(x, y, z).hasSides(5);

Shape.prototype.Pentagon = Shape.shapeMethod(Pentagon);

export default Pentagon;
