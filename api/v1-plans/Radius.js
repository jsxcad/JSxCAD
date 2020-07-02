import { Circle, Path } from '@jsxcad/api-v1-shapes';

import { Hershey } from '@jsxcad/api-v1-font';
import Plan from '@jsxcad/api-v1-plan';
import { dp2 } from './dp.js';

// Radius

export const Radius = (radius = 1, center = [0, 0, 0]) =>
  Plan({
    plan: { radius },
    marks: [center],
    visualization: Circle.ofRadius(radius)
      .outline()
      .add(Path([0, 0, 0], [0, radius, 0]))
      .add(Hershey(radius / 10)(`R${dp2(radius)}`).moveY(radius / 2))
      .color('red'),
  });
Plan.Radius = Radius;

export default Radius;
