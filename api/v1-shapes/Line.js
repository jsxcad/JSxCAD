import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import Path from './Path.js';
import Point from './Point.js';

export const Line = (length) => Path(Point(0), Point(length));
export default Line;

Shape.prototype.Line = shapeMethod(Line);
