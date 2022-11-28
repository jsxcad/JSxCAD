import Group from './Group.js';
import Shape from './Shape.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const masking = Shape.registerMethod(
  'masking',
  (masked) => async (shape) =>
    Group(
      shape.void(),
      Shape.fromGeometry(
        hasTypeMasked(await shape.toShapeGeometry(masked))
      )
    )
);

export default masking;
