import Shape from './Shape.js';
import { measureBoundingBox } from '@jsxcad/geometry';

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const distance = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const X = 0;
const Y = 1;
const Z = 2;

export const size = Shape.chainable(
  (op = (size) => (shape) => size) =>
    (shape) => {
      const geometry = shape.toConcreteGeometry();
      const bounds = measureBoundingBox(geometry);
      if (bounds === undefined) {
        return op({
          length: 0,
          width: 0,
          height: 0,
          max: [0, 0, 0],
          min: [0, 0, 0],
          center: [0, 0, 0],
          radius: 0,
        })(Shape.fromGeometry(geometry));
      }
      const [min, max] = bounds;
      const length = max[X] - min[X];
      const width = max[Y] - min[Y];
      const height = max[Z] - min[Z];
      const center = scale(0.5, add(min, max));
      const radius = distance(center, max);
      return op({
        length,
        width,
        height,
        max,
        min,
        center,
        radius,
      })(Shape.fromGeometry(geometry));
    }
);

Shape.registerMethod('size', size);
