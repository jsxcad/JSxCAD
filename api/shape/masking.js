import Group from './Group.js';
import Shape from './Shape.js';
import { gap } from './void.js';
import { hasTypeMasked } from '@jsxcad/geometry';

export const masking = Shape.registerMethod2(
  'masking',
  ['input', 'geometry'],
  async (input, masked) =>
    Group(await gap()(input), Shape.fromGeometry(hasTypeMasked(masked)))
);

export default masking;
