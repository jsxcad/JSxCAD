import { add, distance, scale } from '@jsxcad/math-vec3';
import { measureArea, measureBoundingBox } from '@jsxcad/geometry-tagged';

import Shape from './Shape.js';

const X = 0;
const Y = 1;
const Z = 2;

export const size = (shape) => {
  const geometry = shape.toKeptGeometry();
  const [min, max] = measureBoundingBox(geometry);
  const area = measureArea(geometry);
  const length = max[X] - min[X];
  const width = max[Y] - min[Y];
  const height = max[Z] - min[Z];
  const center = scale(0.5, add(min, max));
  const radius = distance(center, max);
  return { area, length, width, height, max, min, center, radius };
};

const sizeMethod = function () {
  return size(this);
};
Shape.prototype.size = sizeMethod;

export default size;

size.signature = 'size(shape:Shape) -> Size';
sizeMethod.signature = 'Shape -> size() -> Size';
