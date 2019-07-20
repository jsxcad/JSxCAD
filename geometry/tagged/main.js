import { fromScaling, fromTranslation, fromXRotation, fromYRotation, fromZRotation } from '@jsxcad/math-mat4';

import { addTags } from './addTags';
import { allTags } from './allTags';
import { assemble } from './assemble';
import { canonicalize } from './canonicalize';
import { difference } from './difference';
import { divide } from './divide';
import { drop } from './drop';
import { eachItem } from './eachItem';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fuse } from './fuse';
import { getClouds } from './getClouds';
import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getTags } from './getTags';
import { getZ0Surfaces } from './getZ0Surfaces';
import { intersection } from './intersection';
import { keep } from './keep';
import { map } from './map';
import { measureBoundingBox } from './measureBoundingBox';
import { toComponents } from './toComponents';
import { toDisjointGeometry } from './toDisjointGeometry';
import { toKeptGeometry } from './toKeptGeometry';
import { toPoints } from './toPoints';
import { toStandardGeometry } from './toStandardGeometry';
import { toTransformedGeometry } from './toTransformedGeometry';
import { transform } from './transform';
import { union } from './union';

export {
  addTags,
  allTags,
  assemble,
  canonicalize,
  difference,
  divide,
  drop,
  eachItem,
  eachPoint,
  flip,
  fuse,
  getClouds,
  getPaths,
  getSolids,
  getSurfaces,
  getTags,
  getZ0Surfaces,
  intersection,
  keep,
  map,
  measureBoundingBox,
  toComponents,
  toDisjointGeometry,
  toKeptGeometry,
  toPoints,
  toStandardGeometry,
  toTransformedGeometry,
  transform,
  union
};

export const rotateX = (angle, assembly) => transform(fromXRotation(angle), assembly);
export const rotateY = (angle, assembly) => transform(fromYRotation(angle), assembly);
export const rotateZ = (angle, assembly) => transform(fromZRotation(angle), assembly);
export const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
export const scale = (vector, assembly) => transform(fromScaling(vector), assembly);
