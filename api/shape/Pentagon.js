import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Pentagon = Shape.registerMethod(
  'Pentagon',
  (x, y, z) => (shape) => Arc(x, y, z, { sides: 5 })(shape)
);

export default Pentagon;
