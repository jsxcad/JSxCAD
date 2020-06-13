import { Hershey } from '@jsxcad/api-v1-font';
import { Path } from '@jsxcad/api-v1-shapes';
import Plan from '@jsxcad/api-v1-plan';
import { dp2 } from './dp';

export const Length = (length) => {
  return Plan({
    plan: { length },
    visualization: Path([0, 0, 0], [0, length, 0])
      .add(Hershey(length / 10)(`L${dp2(length)}`).moveY(length / 2))
      .color('red'),
  });
};
Plan.Length = Length;

export default Length;
