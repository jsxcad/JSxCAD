import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Circle = (plan = 1) => Arc(plan).fill();

Shape.prototype.Circle = shapeMethod(Circle);

export default Circle;
