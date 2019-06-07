import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { addTags } from './addTags';
import { assemble } from './assemble';
import { canonicalize } from './canonicalize';
import { difference } from './difference';
import { drop } from './drop';
import { eachItem } from './eachItem';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { intersection } from './intersection';
import { keep } from './keep';
import { measureBoundingBox } from './measureBoundingBox';
import { toComponents } from './toComponents';
import { toDisjointGeometry } from './toDisjointGeometry';
import { toKeptGeometry } from './toKeptGeometry';
import { toPaths } from './toPaths';
import { toPoints } from './toPoints';
import { toSolid } from './toSolid';
import { toZ0Surface } from './toZ0Surface';
import { transform } from './transform';
import { union } from './union';

export {
  addTags,
  assemble,
  canonicalize,
  difference,
  drop,
  eachItem,
  eachPoint,
  flip,
  getPaths,
  getSolids,
  getSurfaces,
  getZ0Surfaces,
  intersection,
  keep,
  measureBoundingBox,
  toComponents,
  toDisjointGeometry,
  toKeptGeometry,
  toPaths,
  toPoints,
  toSolid,
  toZ0Surface,
  transform,
  union
};

export const rotateX = (angle, assembly) => transform(fromXRotation(angle), assembly);
export const rotateY = (angle, assembly) => transform(fromYRotation(angle), assembly);
export const rotateZ = (angle, assembly) => transform(fromZRotation(angle), assembly);
export const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
export const scale = (vector, assembly) => transform(fromScaling(vector), assembly);
