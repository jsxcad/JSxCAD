import { add, distance, scale } from '@jsxcad/math-vec3';

import Shape from './Shape.js';
import { measureBoundingBox } from '@jsxcad/geometry';

const X = 0;
const Y = 1;
const Z = 2;

export const size =
  (op = size => shape => size) =>
  (shape) => {
    const geometry = shape.toConcreteGeometry();
    try {
    let [min, max] = measureBoundingBox(geometry);
console.log('size');
console.log(min);
console.log(max);
console.log(JSON.stringify(geometry));
    const length = max[X] - min[X];
    const width = max[Y] - min[Y];
    const height = max[Z] - min[Z];
    const center = scale(0.5, add(min, max));
    const radius = distance(center, max);
    return op(
      {
        length,
        width,
        height,
        max,
        min,
        center,
        radius,
      })(Shape.fromGeometry(geometry));
    } catch (e) {
      console.log(JSON.stringify(geometry));
      throw e;
    }
  };

Shape.registerMethod('size', size);
