import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Hexagon = Shape.registerMethod2(
  'Hexagon',
  ['interval', 'interval', 'interval'],
  (x, y, z) => Arc(x, y, z, { sides: 6 })
);

export default Hexagon;
