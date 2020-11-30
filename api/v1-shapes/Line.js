import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import Path from './Path.js';
import Point from './Point.js';

export const Line = (forward, backward = 0) => {
  if (backward > forward) {
    return Path(Point(forward), Point(backward));
  } else {
    return Path(Point(backward), Point(forward));
  }
};
export default Line;

Shape.prototype.Line = shapeMethod(Line);
