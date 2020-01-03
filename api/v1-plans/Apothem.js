import { Circle, Path, Polygon } from '@jsxcad/api-v1-shapes';

import { Hershey } from '@jsxcad/api-v1-font';
import Plan from '@jsxcad/api-v1-plan';
import { dp2 } from './dp';

export const Apothem = (apothem = 1, sides = 32, center = [0, 0, 0]) => {
  const radius = Polygon.toRadiusFromApothem(apothem, sides);
  return Plan({
    plan: { apothem },
    marks: [center],
    visualization:
      Circle.ofRadius(radius)
          .outline()
          .add(Path([0, 0, 0], [0, radius, 0]))
          .add(Hershey(radius / 10)(`A${dp2(apothem)}`).moveY(radius / 2))
          .color('red')
  });
};

Plan.Apothem = Apothem;

export default Apothem;
