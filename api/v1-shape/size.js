import { add, distance, scale } from '@jsxcad/math-vec3';
import { measureArea, measureBoundingBox } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

const X = 0;
const Y = 1;
const Z = 2;

export const size = (shape, op = (_, size) => size) => {
  const geometry = shape.toDisjointGeometry();
  const [min, max] = measureBoundingBox(geometry);
  const area = measureArea(geometry);
  const length = max[X] - min[X];
  const width = max[Y] - min[Y];
  const height = max[Z] - min[Z];
  const center = scale(0.5, add(min, max));
  const radius = distance(center, max);
  return op(Shape.fromGeometry(geometry), {
    area,
    length,
    width,
    height,
    max,
    min,
    center,
    radius,
  });
};

const sizeMethod = function (op) {
  return size(this, op);
};
Shape.prototype.size = sizeMethod;

export default size;
