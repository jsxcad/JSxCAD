import Shape from './Shape.js';
import { toPoints } from './toPoints.js';

const square = (a) => a * a;

const distance = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  Math.sqrt(square(ax - bx) + square(ay - by) + square(az - bz));

// This is not efficient.
export const diameter = Shape.registerMethod(
  'diameter',
  (op = (diameter) => (shape) => diameter) =>
    async (shape) => {
      const points = await toPoints()(shape);
      let maximumDiameter = 0;
      for (let a of points) {
        for (let b of points) {
          const diameter = distance(a, b);
          if (diameter > maximumDiameter) {
            maximumDiameter = diameter;
          }
        }
      }
      return op(maximumDiameter);
    }
);
