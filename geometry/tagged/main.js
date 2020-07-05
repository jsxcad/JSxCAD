import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from '@jsxcad/math-mat4';

import { transform } from './transform.js';

export const rotateX = (angle, assembly) =>
  transform(fromXRotation((angle * Math.PI) / 180), assembly);
export const rotateY = (angle, assembly) =>
  transform(fromYRotation((angle * Math.PI) / 180), assembly);
export const rotateZ = (angle, assembly) =>
  transform(fromZRotation((angle * Math.PI) / 180), assembly);
export const translate = (vector, assembly) =>
  transform(fromTranslation(vector), assembly);
export const scale = (vector, assembly) =>
  transform(fromScaling(vector), assembly);

export {
  findOpenEdges,
  isWatertight,
  makeWatertight,
  reconcile,
} from './makeWatertight.js';

export { isNotVoid, isVoid } from './isNotVoid.js';

export { rewrite, visit } from './visit.js';

export { allTags } from './allTags.js';
export { assemble } from './assemble.js';
export { canonicalize } from './canonicalize.js';
export { difference } from './difference.js';
export { drop } from './drop.js';
export { eachItem } from './eachItem.js';
export { eachPoint } from './eachPoint.js';
export { flip } from './flip.js';
export { fresh } from './fresh.js';
export { fromPathToSurface } from './fromPathToSurface.js';
export { fromPathToZ0Surface } from './fromPathToZ0Surface.js';
export { fromPathsToSurface } from './fromPathsToSurface.js';
export { fromPathsToZ0Surface } from './fromPathsToZ0Surface.js';
export { fromSurfaceToPaths } from './fromSurfaceToPaths.js';
export { getAnyNonVoidSurfaces } from './getAnyNonVoidSurfaces.js';
export { getAnySurfaces } from './getAnySurfaces.js';
export { getItems } from './getItems.js';
export { getLayers } from './getLayers.js';
export { getLayouts } from './getLayouts.js';
export { getLeafs } from './getLeafs.js';
export { getNonVoidItems } from './getNonVoidItems.js';
export { getNonVoidPaths } from './getNonVoidPaths.js';
export { getNonVoidPlans } from './getNonVoidPlans.js';
export { getNonVoidPoints } from './getNonVoidPoints.js';
export { getNonVoidSolids } from './getNonVoidSolids.js';
export { getNonVoidSurfaces } from './getNonVoidSurfaces.js';
export { getNonVoidZ0Surfaces } from './getNonVoidZ0Surfaces.js';
export { getPaths } from './getPaths.js';
export { getPlans } from './getPlans.js';
export { getPoints } from './getPoints.js';
export { getSolids } from './getSolids.js';
export { getSurfaces } from './getSurfaces.js';
export { getTags } from './getTags.js';
export { getZ0Surfaces } from './getZ0Surfaces.js';
export { intersection } from './intersection.js';
export { keep } from './keep.js';
export { measureArea } from './measureArea.js';
export { measureBoundingBox } from './measureBoundingBox.js';
export { outline } from './outline.js';
export { rewriteTags } from './rewriteTags.js';
export { taggedAssembly } from './taggedAssembly.js';
export { taggedItem } from './taggedItem.js';
export { taggedDisjointAssembly } from './taggedDisjointAssembly.js';
export { taggedLayers } from './taggedLayers.js';
export { taggedLayout } from './taggedLayout.js';
export { taggedPaths } from './taggedPaths.js';
export { taggedPoints } from './taggedPoints.js';
export { taggedSketch } from './taggedSketch.js';
export { taggedSolid } from './taggedSolid.js';
export { taggedSurface } from './taggedSurface.js';
export { taggedZ0Surface } from './taggedZ0Surface.js';
export { toDisjointGeometry } from './toDisjointGeometry.js';
export { toKeptGeometry } from './toKeptGeometry.js';
export { toPoints } from './toPoints.js';
export { transform } from './transform.js';
export { union } from './union.js';
export { update } from './update.js';
