import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Triangle = Shape.registerMethod2(
  'Triangle',
  ['input', 'interval', 'interval', 'interval'],
  (input, x, y, z) => Arc(x, y, z, { sides: 3 })(input)
);

export default Triangle;
