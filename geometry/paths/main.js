import { butLast } from './butLast';
import { canonicalize } from './canonicalize';
import { difference } from './difference';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fromScaling } from '@jsxcad/math-mat4';
import { intersection } from './intersection';
import { last } from './last';
import { measureBoundingBox } from './measureBoundingBox';
import { toGeneric } from './toGeneric';
import { toPoints } from './toPoints';
import { toPolygons } from './toPolygons';
import { toZ0Polygons } from './toZ0Polygons';
import { transform } from './transform';
import { union } from './union';

export {
  butLast,
  canonicalize,
  difference,
  eachPoint,
  flip,
  intersection,
  last,
  measureBoundingBox,
  toGeneric,
  toPoints,
  toPolygons,
  toZ0Polygons,
  transform,
  union
};
export const scale = ([x = 1, y = 1, z = 1], paths) => transform(fromScaling([x, y, z]), paths);
