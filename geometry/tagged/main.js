import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation
} from '@jsxcad/math-mat4';

import {
  isWatertight,
  makeWatertight
} from './makeWatertight';

import {
  rewrite,
  visit
} from './visit';

import { allTags } from './allTags';
import { assemble } from './assemble';
import { canonicalize } from './canonicalize';
import { difference } from './difference';
import { drop } from './drop';
import { eachItem } from './eachItem';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fresh } from './fresh';
import { fromPathToSurface } from './fromPathToSurface';
import { fromPathToZ0Surface } from './fromPathToZ0Surface';
import { fromPathsToSurface } from './fromPathsToSurface';
import { fromPathsToZ0Surface } from './fromPathsToZ0Surface';
import { fromSurfaceToPaths } from './fromSurfaceToPaths';
import { getAnySurfaces } from './getAnySurfaces';
import { getConnections } from './getConnections';
import { getItems } from './getItems';
import { getLayers } from './getLayers';
import { getLeafs } from './getLeafs';
import { getPaths } from './getPaths';
import { getPlans } from './getPlans';
import { getPoints } from './getPoints';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getTags } from './getTags';
import { getZ0Surfaces } from './getZ0Surfaces';
import { intersection } from './intersection';
import { keep } from './keep';
import { map } from './map';
import { measureBoundingBox } from './measureBoundingBox';
import { nonNegative } from './nonNegative';
import { outline } from './outline';
import { rewriteTags } from './rewriteTags';
import { specify } from './specify';
import { splice } from './splice';
import { toDisjointGeometry } from './toDisjointGeometry';
import { toKeptGeometry } from './toKeptGeometry';
import { toPoints } from './toPoints';
import { toTransformedGeometry } from './toTransformedGeometry';
import { transform } from './transform';
import { union } from './union';
import { update } from './update';

export {
  allTags,
  assemble,
  canonicalize,
  difference,
  drop,
  eachItem,
  eachPoint,
  flip,
  fresh,
  fromPathToSurface,
  fromPathToZ0Surface,
  fromPathsToSurface,
  fromPathsToZ0Surface,
  fromSurfaceToPaths,
  getAnySurfaces,
  getConnections,
  getPoints,
  getItems,
  getLayers,
  getLeafs,
  getPaths,
  getPlans,
  getSolids,
  getSurfaces,
  getTags,
  getZ0Surfaces,
  intersection,
  isWatertight,
  keep,
  map,
  makeWatertight,
  measureBoundingBox,
  nonNegative,
  outline,
  rewrite,
  rewriteTags,
  specify,
  splice,
  toDisjointGeometry,
  toKeptGeometry,
  toPoints,
  toTransformedGeometry,
  transform,
  update,
  union,
  visit
};

export const rotateX = (angle, assembly) => transform(fromXRotation(angle * Math.PI / 180), assembly);
export const rotateY = (angle, assembly) => transform(fromYRotation(angle * Math.PI / 180), assembly);
export const rotateZ = (angle, assembly) => transform(fromZRotation(angle * Math.PI / 180), assembly);
export const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
export const scale = (vector, assembly) => transform(fromScaling(vector), assembly);
