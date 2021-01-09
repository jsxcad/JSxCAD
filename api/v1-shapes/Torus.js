import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { Arc } from './Arc.js';

export const Torus = (
  radius = 1,
  height = 1,
  { segments = 32, sides = 32, rotation = 0 } = {}
) =>
  Arc(height / 2, { sides })
    .rotateZ(rotation)
    .moveY(radius)
    .Loop(360, { sides: segments })
    .rotateY(90)
    .toGraph();

export default Torus;

Shape.prototype.Torus = shapeMethod(Torus);
