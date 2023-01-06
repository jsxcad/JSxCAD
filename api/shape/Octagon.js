import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Octagon = Shape.registerMethod(
  'Octagon',
  (x, y, z) => (shape) => Arc(x, y, z, { sides: 8 })(shape)
);

export default Octagon;
