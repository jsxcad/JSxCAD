import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Pentagon = Shape.registerMethod2(
  'Pentagon',
  ['input', 'interval', 'interval', 'interval'],
  (input, x, y, z) => Arc(x, y, z, { sides: 5 })(input)
);

export default Pentagon;
