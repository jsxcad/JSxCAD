import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation
} from '@jsxcad/math-mat4';

import { transform } from './transform';

export const rotateX = (angle, assembly) => transform(fromXRotation(angle * Math.PI / 180), assembly);
export const rotateY = (angle, assembly) => transform(fromYRotation(angle * Math.PI / 180), assembly);
export const rotateZ = (angle, assembly) => transform(fromZRotation(angle * Math.PI / 180), assembly);
export const translate = (vector, assembly) => transform(fromTranslation(vector), assembly);
export const scale = (vector, assembly) => transform(fromScaling(vector), assembly);

export {
  findOpenEdges,
  isWatertight,
  makeWatertight,
  reconcile
} from './makeWatertight';

export {
  isNotVoid,
  isVoid
} from './isNotVoid';

export {
  rewrite,
  visit
} from './visit';

export { allTags } from './allTags';
export { assemble } from './assemble';
export { canonicalize } from './canonicalize';
export { difference } from './difference';
export { drop } from './drop';
export { eachItem } from './eachItem';
export { eachPoint } from './eachPoint';
export { flip } from './flip';
export { fresh } from './fresh';
export { fromPathToSurface } from './fromPathToSurface';
export { fromPathToZ0Surface } from './fromPathToZ0Surface';
export { fromPathsToSurface } from './fromPathsToSurface';
export { fromPathsToZ0Surface } from './fromPathsToZ0Surface';
export { fromSurfaceToPaths } from './fromSurfaceToPaths';
export { getAnySurfaces } from './getAnySurfaces';
export { getConnections } from './getConnections';
export { getItems } from './getItems';
export { getLayers } from './getLayers';
export { getLeafs } from './getLeafs';
export { getPaths } from './getPaths';
export { getPlans } from './getPlans';
export { getPoints } from './getPoints';
export { getSolids } from './getSolids';
export { getSurfaces } from './getSurfaces';
export { getTags } from './getTags';
export { getZ0Surfaces } from './getZ0Surfaces';
export { intersection } from './intersection';
export { keep } from './keep';
export { map } from './map';
export { measureArea } from './measureArea';
export { measureBoundingBox } from './measureBoundingBox';
export { nonNegative } from './nonNegative';
export { outline } from './outline';
export { rewriteTags } from './rewriteTags';
export { specify } from './specify';
export { splice } from './splice';
export { toKeptGeometry } from './toKeptGeometry';
export { toPoints } from './toPoints';
export { transform } from './transform';
export { union } from './union';
export { update } from './update';
