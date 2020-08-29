import { Shape, shapeMethod } from '@jsxcad/api-v1-shape';

import { taggedPoints } from '@jsxcad/geometry-tagged';

export const fromPoint = ([x = 0, y = 0, z = 0], [u = 0, v = 0, d = 1]) =>
  Shape.fromGeometry(taggedPoints({ tags: ['peg'] }, [[x, y, z, u, v, d]]));
export const Peg = (x = 0, y = 0, z = 0, u = 0, v = 0, d = 1) =>
  fromPoint([x, y, z], [u, v, d]);
Peg.fromPoint = fromPoint;

export default Peg;

Shape.prototype.Peg = shapeMethod(Peg);
