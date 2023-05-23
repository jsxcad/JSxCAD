import Group from './Group.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { gap } from './void.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const masking = Shape.registerMethod(
  'masking',
  (...args) =>
    async (shape) => {
      const [masked] = await destructure2(shape, args, 'geometry');
      return Group(
        await gap()(shape),
        Shape.fromGeometry(hasTypeMasked(masked))
      );
    }
);

export default masking;
