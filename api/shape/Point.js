import Shape from './Shape.js';
import { destructure2 } from './destructure.js';

export const Point = Shape.registerMethod(
  'Point',
  (...args) =>
    async (shape) => {
      const [coordinate, x = 0, y = 0, z = 0] = await destructure2(
        shape,
        args,
        'coordinate',
        'number',
        'number',
        'number'
      );
      return Shape.fromPoint(coordinate || [x, y, z]);
    }
);

export default Point;
