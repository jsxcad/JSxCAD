import { Arc } from './Arc.js';
import Shape from './Shape.js';

export const Hexagon = Shape.registerShapeMethod('Hexagon', (x, y, z) =>
  Arc(x, y, z, { sides: 6 })
);

export default Hexagon;
