import Path from './Path.js';
import Point from './Point.js';
import Shape from './Shape.js';

export const Line = (forward, backward = 0) => {
  if (backward > forward) {
    return Path(Point(forward), Point(backward));
  } else {
    return Path(Point(backward), Point(forward));
  }
};
export default Line;

Shape.prototype.Line = Shape.shapeMethod(Line);
