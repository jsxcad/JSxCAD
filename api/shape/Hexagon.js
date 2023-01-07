import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Hexagon = Shape.registerMethod(
  'Hexagon',
  (x, y, z) => async (shape) => Arc(x, y, z, { sides: 6 })
);

export default Hexagon;
