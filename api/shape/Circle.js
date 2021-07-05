import { Shape, shapeMethod } from './Shape.js';

import { Arc } from './Arc.js';

export const Circle = Arc;

Shape.prototype.Circle = shapeMethod(Circle);

export default Circle;
