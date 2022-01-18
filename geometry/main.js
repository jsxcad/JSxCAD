import {
  fromScaling,
  fromTranslation,
  fromXRotation,
  fromYRotation,
  fromZRotation,
} from '@jsxcad/math-mat4';

import { transform } from './tagged/transform.js';

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

export { isNotVoid, isVoid } from './tagged/isNotVoid.js';

export { rewrite, visit } from './tagged/visit.js';

export { allTags } from './tagged/allTags.js';
export { alphaShape } from './graph/alphaShape.js';
export { arrangePolygonsWithHoles } from './graph/arrangePolygonsWithHoles.js';
export { assemble } from './tagged/assemble.js';
export { bend } from './tagged/bend.js';
export { cached } from './tagged/cached.js';
export { clip } from './graph/clip.js';
export { close as closePath } from './path/close.js';
export { computeCentroid } from './tagged/computeCentroid.js';
export { computeNormal } from './tagged/computeNormal.js';
export { concatenate as concatenatePath } from './path/concatenate.js';
export { canonicalize } from './tagged/canonicalize.js';
export { canonicalize as canonicalizePath } from './path/canonicalize.js';
export { canonicalize as canonicalizePaths } from './paths/canonicalize.js';
export { convexHull as convexHullToGraph } from './graph/convexHull.js';
export { cut } from './tagged/cut.js';
export { deduplicate as deduplicatePath } from './path/deduplicate.js';
export { demesh } from './tagged/demesh.js';
export { difference } from './tagged/difference.js';
export { disjoint } from './tagged/disjoint.js';
export { doesNotOverlap } from './tagged/doesNotOverlap.js';
export { drop } from './tagged/drop.js';
export { eachItem } from './tagged/eachItem.js';
export { eachPoint } from './tagged/eachPoint.js';
export { eachSegment } from './tagged/eachSegment.js';
export { empty } from './tagged/empty.js';
export { extrude } from './tagged/extrude.js';
export { extrudeToPlane } from './tagged/extrudeToPlane.js';
export { faces } from './tagged/faces.js';
export { flip } from './tagged/flip.js';
export { flip as flipPath } from './path/flip.js';
export { fresh } from './tagged/fresh.js';
export { fromFunction as fromFunctionToGraph } from './graph/fromFunction.js';
export { fromPaths as fromPathsToGraph } from './graph/fromPaths.js';
export { fromPoints as fromPointsToGraph } from './graph/fromPoints.js';
export { fromPolygons as fromPolygonsToGraph } from './graph/fromPolygons.js';
export { fromPolygonsWithHolesToTriangles } from './graph/fromPolygonsWithHolesToTriangles.js';
export { fromSurfaceToPaths } from './tagged/fromSurfaceToPaths.js';
export { fromTriangles as fromTrianglesToGraph } from './graph/fromTriangles.js';
export { fuse } from './tagged/fuse.js';
export { getAnyNonVoidSurfaces } from './tagged/getAnyNonVoidSurfaces.js';
export { getAnySurfaces } from './tagged/getAnySurfaces.js';
export { getItems } from './tagged/getItems.js';
export { getInverseMatrices } from './tagged/getInverseMatrices.js';
export { getLayouts } from './tagged/getLayouts.js';
export { getLeafs } from './tagged/getLeafs.js';
export { getNonVoidGraphs } from './tagged/getNonVoidGraphs.js';
export { getNonVoidItems } from './tagged/getNonVoidItems.js';
export { getNonVoidPaths } from './tagged/getNonVoidPaths.js';
export { getNonVoidFaceablePaths } from './tagged/getNonVoidFaceablePaths.js';
export { getNonVoidPlans } from './tagged/getNonVoidPlans.js';
export { getNonVoidPoints } from './tagged/getNonVoidPoints.js';
export { getNonVoidSegments } from './tagged/getNonVoidSegments.js';
export { getFaceablePaths } from './tagged/getFaceablePaths.js';
export { getGraphs } from './tagged/getGraphs.js';
export { getPaths } from './tagged/getPaths.js';
export { getEdges as getPathEdges } from './path/getEdges.js';
export { getPeg } from './tagged/getPeg.js';
export { getPlans } from './tagged/getPlans.js';
export { getPoints } from './tagged/getPoints.js';
export { getTags } from './tagged/getTags.js';
export { grow } from './tagged/grow.js';
export { hash } from './tagged/hash.js';
export { fill } from './tagged/fill.js';
export { intersection } from './tagged/intersection.js';
export { inset } from './tagged/inset.js';
export { isClockwise as isClockwisePath } from './path/isClockwise.js';
export { isCounterClockwise as isCounterClockwisePath } from './path/isCounterClockwise.js';
export { isClosed as isClosedPath } from './path/isClosed.js';
export {
  isNotShow,
  isNotShowOutline,
  isNotShowOverlay,
  isNotShowSkin,
  isNotShowWireframe,
  isShow,
  isShowOutline,
  isShowOverlay,
  isShowSkin,
  isShowWireframe,
  hasNotShow,
  hasNotShowOutline,
  hasNotShowOverlay,
  hasNotShowSkin,
  hasNotShowWireframe,
  hasShow,
  hasShowOutline,
  hasShowOverlay,
  hasShowSkin,
  hasShowWireframe,
  showOutline,
  showOverlay,
  showSkin,
  showWireframe,
} from './tagged/show.js';
export {
  isNotType,
  isNotTypeMasked,
  isNotTypeVoid,
  isNotTypeWire,
  isType,
  isTypeMasked,
  isTypeVoid,
  isTypeWire,
  hasNotType,
  hasNotTypeMasked,
  hasNotTypeVoid,
  hasNotTypeWire,
  hasType,
  hasTypeMasked,
  hasTypeVoid,
  hasTypeWire,
  typeMasked,
  typeVoid,
  typeWire,
} from './tagged/type.js';
export { join } from './tagged/join.js';
export { keep } from './tagged/keep.js';
export { loft } from './tagged/loft.js';
export { measureBoundingBox } from './tagged/measureBoundingBox.js';
export { minkowskiDifference } from './tagged/minkowskiDifference.js';
export { minkowskiShell } from './tagged/minkowskiShell.js';
export { minkowskiSum } from './tagged/minkowskiSum.js';
export { offset } from './tagged/offset.js';
export { open as openPath } from './path/open.js';
export { outline } from './tagged/outline.js';
export { projectToPlane } from './tagged/projectToPlane.js';
export { prepareForSerialization } from './tagged/prepareForSerialization.js';
export { push } from './tagged/push.js';
export { read, readNonblocking } from './tagged/read.js';
export { realize } from './tagged/realize.js';
export { realizeGraph } from './graph/realizeGraph.js';
export { registerReifier } from './tagged/registerReifier.js';
export { reify } from './tagged/reify.js';
export { remesh } from './tagged/remesh.js';
export { removeSelfIntersections } from './tagged/removeSelfIntersections.js';
export { rewriteTags } from './tagged/rewriteTags.js';
export { rerealizeGraph } from './graph/rerealizeGraph.js';
export { reverseFaceOrientations as reverseFaceOrientationsOfGraph } from './graph/reverseFaceOrientations.js';
export { rotateZ as rotateZPath } from './path/ops.js';
export { scale as scalePath } from './path/ops.js';
export { scale as scalePaths } from './paths/ops.js';
export { section } from './tagged/section.js';
export { serialize } from './tagged/serialize.js';
export { simplify } from './tagged/simplify.js';
export { smooth } from './tagged/smooth.js';
export { separate } from './tagged/separate.js';
export { soup } from './tagged/soup.js';
export { taggedItem } from './tagged/taggedItem.js';
export { taggedDisplayGeometry } from './tagged/taggedDisplayGeometry.js';
export { taggedGraph } from './tagged/taggedGraph.js';
export { taggedGroup } from './tagged/taggedGroup.js';
export { taggedLayout } from './tagged/taggedLayout.js';
export { taggedPaths } from './tagged/taggedPaths.js';
export { taggedPlan } from './tagged/taggedPlan.js';
export { taggedPoints } from './tagged/taggedPoints.js';
export { taggedPolygons } from './tagged/taggedPolygons.js';
export { taggedSegments } from './tagged/taggedSegments.js';
export { taggedSketch } from './tagged/taggedSketch.js';
export { taggedTriangles } from './tagged/taggedTriangles.js';
export { taper } from './tagged/taper.js';
export { test } from './tagged/test.js';
export { translate as translatePath } from './path/ops.js';
export { translate as translatePaths } from './paths/ops.js';
export { toConcreteGeometry } from './tagged/toConcreteGeometry.js';
export {
  toDisjointGeometry,
  toVisiblyDisjointGeometry,
} from './tagged/toDisjointGeometry.js';
export { toDisplayGeometry } from './tagged/toDisplayGeometry.js';
export { toKeptGeometry } from './tagged/toKeptGeometry.js';
export { toTransformedGeometry } from './tagged/toTransformedGeometry.js';
export { toPoints } from './tagged/toPoints.js';
export { toPolygonsWithHoles } from './tagged/toPolygonsWithHoles.js';
export { toTriangleArray } from './tagged/toTriangleArray.js';
export { toTriangles as toTrianglesFromGraph } from './graph/toTriangles.js';
export { transform } from './tagged/transform.js';
export { transform as transformPaths } from './paths/transform.js';
export { twist } from './tagged/twist.js';
export { union } from './tagged/union.js';
export { update } from './tagged/update.js';
export { withQuery } from './tagged/withQuery.js';
export { write, writeNonblocking } from './tagged/write.js';
