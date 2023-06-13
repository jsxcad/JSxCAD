import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Octagon = Shape.registerMethod2(
  'Octagon',
  ['input', 'interval', 'interval', 'interval'],
  (input, x, y, z) => Arc(x, y, z, { sides: 8 })(input)
);

export default Octagon;
