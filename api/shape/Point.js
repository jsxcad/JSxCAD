import Shape from './Shape.js';
import { toCoordinate } from './toCoordinate.js';

export const Point = Shape.registerMethod(
  'Point',
  (...args) =>
    async (shape) =>
      Shape.fromPoint(await toCoordinate(...args)(shape))
);

export default Point;
