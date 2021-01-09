import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from '@jsxcad/math-mat4';

import { transform } from './transform.js';

export const rotateX = (angle, geometry) =>
  transform(fromXRotation((angle * Math.PI) / 180), geometry);
export const rotateY = (angle, geometry) =>
  transform(fromYRotation((angle * Math.PI) / 180), geometry);
export const rotateZ = (angle, geometry) =>
  transform(fromZRotation((angle * Math.PI) / 180), geometry);
export const translate = (vector, geometry) =>
  transform(fromTranslation(vector), geometry);
export const scale = (vector, geometry) =>
  transform(fromScaling(vector), geometry);

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
export { extrude } from './extrude.js';
export { extrudeToPlane } from './extrudeToPlane.js';
export { flip } from './flip.js';
export { fresh } from './fresh.js';
export { fromSurfaceToPaths } from './fromSurfaceToPaths.js';
export { getAnyNonVoidSurfaces } from './getAnyNonVoidSurfaces.js';
export { getAnySurfaces } from './getAnySurfaces.js';
export { getItems } from './getItems.js';
export { getLayers } from './getLayers.js';
export { getLayouts } from './getLayouts.js';
export { getLeafs } from './getLeafs.js';
export { getNonVoidGraphs } from './getNonVoidGraphs.js';
export { getNonVoidItems } from './getNonVoidItems.js';
export { getNonVoidPaths } from './getNonVoidPaths.js';
export { getNonVoidFaceablePaths } from './getNonVoidFaceablePaths.js';
export { getNonVoidPlans } from './getNonVoidPlans.js';
export { getNonVoidPoints } from './getNonVoidPoints.js';
export { getNonVoidSolids } from './getNonVoidSolids.js';
export { getNonVoidSurfaces } from './getNonVoidSurfaces.js';
export { getNonVoidZ0Surfaces } from './getNonVoidZ0Surfaces.js';
export { getFaceablePaths } from './getFaceablePaths.js';
export { getGraphs } from './getGraphs.js';
export { getPaths } from './getPaths.js';
export { getPeg } from './getPeg.js';
export { getPlans } from './getPlans.js';
export { getPoints } from './getPoints.js';
export { getSolids } from './getSolids.js';
export { getSurfaces } from './getSurfaces.js';
export { getTags } from './getTags.js';
export { getZ0Surfaces } from './getZ0Surfaces.js';
export { hash } from './hash.js';
export { fill } from './fill.js';
export { intersection } from './intersection.js';
export { inset } from './inset.js';
export { keep } from './keep.js';
export { measureArea } from './measureArea.js';
export { measureBoundingBox } from './measureBoundingBox.js';
export { measureHeights } from './measureHeights.js';
export { offset } from './offset.js';
export { outline } from './outline.js';
export { projectToPlane } from './projectToPlane.js';
export { read } from './read.js';
export { realize } from './realize.js';
export { reify } from './reify.js';
export { rewriteTags } from './rewriteTags.js';
export { section } from './section.js';
export { smooth } from './smooth.js';
export { soup } from './soup.js';
export { taggedAssembly } from './taggedAssembly.js';
export { taggedItem } from './taggedItem.js';
export { taggedDisjointAssembly } from './taggedDisjointAssembly.js';
export { taggedGraph } from './taggedGraph.js';
export { taggedGroup } from './taggedGroup.js';
export { taggedLayers } from './taggedLayers.js';
export { taggedLayout } from './taggedLayout.js';
export { taggedPaths } from './taggedPaths.js';
export { taggedPlan } from './taggedPlan.js';
export { taggedPoints } from './taggedPoints.js';
export { taggedSketch } from './taggedSketch.js';
export { taggedSolid } from './taggedSolid.js';
export { taggedSurface } from './taggedSurface.js';
export { taggedTransform } from './taggedTransform.js';
export { taggedZ0Surface } from './taggedZ0Surface.js';
export { toDisjointGeometry } from './toDisjointGeometry.js';
export { toKeptGeometry } from './toKeptGeometry.js';
export { toTransformedGeometry } from './toTransformedGeometry.js';
export { toPoints } from './toPoints.js';
export { transform } from './transform.js';
export { union } from './union.js';
export { update } from './update.js';
export { write } from './write.js';
