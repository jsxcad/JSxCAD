import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Triangle = Shape.registerMethod(
  'Triangle',
  (x, y, z) => async (shape) => Arc(x, y, z, { sides: 3 })(shape)
);

export default Triangle;
