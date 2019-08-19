import { difference, intersection, union } from '@jsxcad/algorithm-bsp-surfaces';
import { rotateX, rotateY, rotateZ, scale, multiply as transform, translate } from './ops';

import { alignVertices } from './alignVertices';
import { assertGood } from './assertGood';
import { canonicalize } from './canonicalize';
import { cut } from './cut';
import { divide } from './divide';
import { doesNotOverlap } from './doesNotOverlap';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fromPolygons } from './fromPolygons';
import { makeSurfacesConvex } from './makeSurfacesConvex';
import { makeSurfacesSimple } from './makeSurfacesSimple';
import { measureBoundingBox } from './measureBoundingBox';
import { measureBoundingSphere } from './measureBoundingSphere';
import { toGeneric } from './toGeneric';
import { toPoints } from './toPoints';
import { toPolygons } from './toPolygons';

export {
  alignVertices,
  assertGood,
  canonicalize,
  cut,
  difference,
  divide,
  doesNotOverlap,
  eachPoint,
  flip,
  fromPolygons,
  intersection,
  makeSurfacesConvex,
  makeSurfacesSimple,
  measureBoundingBox,
  measureBoundingSphere,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  toGeneric,
  toPoints,
  toPolygons,
  transform,
  translate,
  union,
};
