import Shape from './Shape.js';
import { linearize } from '@jsxcad/geometry';

const square = (a) => a * a;

const distance = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  Math.sqrt(square(ax - bx) + square(ay - by) + square(az - bz));

export const runLength = Shape.registerMethod(
  'runLength',
  (op = (length) => (shape) => length) =>
    async (shape) => {
      let total = 0;
      for (const { segments } of linearize(
        await shape.toGeometry(),
        ({ type }) => type === 'segments'
      )) {
        for (const [source, target] of segments) {
          total += distance(source, target);
        }
      }
      return op(total)(shape);
    }
);
