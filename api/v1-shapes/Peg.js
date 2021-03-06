import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { add } from '@jsxcad/math-vec3';
import { taggedPoints } from '@jsxcad/geometry-tagged';

const X = 0;
const Y = 1;
const Z = 2;

export const Peg = (
  origin = [0, 0, 0],
  forward = [0, 1, 0],
  right = [1, 0, 0]
) => {
  const o = origin;
  const f = add(origin, forward);
  const r = add(origin, right);
  return Shape.fromGeometry(
    taggedPoints({ tags: ['peg'] }, [
      [o[X], o[Y], o[Z], f[X], f[Y], f[Z], r[X], r[Y], r[Z]],
    ])
  );
};

export default Peg;

Shape.prototype.Peg = shapeMethod(Peg);
