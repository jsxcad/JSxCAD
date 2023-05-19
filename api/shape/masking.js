import Group from './Group.js';
import Shape from './Shape.js';
import { destructure2 } from './destructure.js';
import { hasTypeMasked } from '@jsxcad/geometry';
import { hole } from './void.js';

export const masking = Shape.registerMethod(
  'masking',
  (...args) => async (shape) => {
    const [masked] = await destructure2(shape, args, 'geometry');
    return Group(
      await hole()(shape),
      Shape.fromGeometry(hasTypeMasked(masked))
    );
  }
);

export default masking;
