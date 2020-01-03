import { Circle, Path } from '@jsxcad/api-v1-shapes';

import { Hershey } from '@jsxcad/api-v1-font';
import Plan from '@jsxcad/api-v1-plan';
import { dp2 } from './dp';

export const Diameter = (diameter = 1, center = [0, 0, 0]) => {
  const radius = diameter / 2;
  return Plan({
    plan: { diameter },
    marks: [center],
    visualization:
      Circle.ofDiameter(diameter)
          .outline()
          .add(Path([0, -radius, 0], [0, +radius, 0]))
          .add(Hershey(radius / 10)(`D${dp2(diameter)}`))
          .color('red')
  });
};
Plan.Diameter = Diameter;

export default Diameter;
