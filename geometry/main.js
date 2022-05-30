import {
  fromRotateXToTransform,
  fromRotateYToTransform,
  fromRotateZToTransform,
  fromScaleToTransform,
  fromTranslateToTransform,
} from '@jsxcad/algorithm-cgal';

import { transform } from './tagged/transform.js';

export const rotateX = (turn, geometry) =>
  transform(fromRotateXToTransform(turn), geometry);
export const rotateY = (turn, geometry) =>
  transform(fromRotateYToTransform(turn), geometry);
export const rotateZ = (turn, geometry) =>
  transform(fromRotateZToTransform(turn), geometry);
export const translate = (vector, geometry) =>
  transform(fromTranslateToTransform(...vector), geometry);
export const scale = (vector, geometry) =>
  transform(fromScaleToTransform(...vector), geometry);

export { isNotVoid, isVoid } from './tagged/isNotVoid.js';

export { rewrite, visit } from './tagged/visit.js';

export { allTags } from './tagged/allTags.js';
export { assemble } from './tagged/assemble.js';
export { bend } from './bend.js';
export { cached } from './tagged/cached.js';
export { cast } from './cast.js';
export { clip } from './clip.js';
export { close as closePath } from './path/close.js';
export { computeCentroid } from './computeCentroid.js';
export { computeImplicitVolume } from './computeImplicitVolume.js';
export { computeNormal } from './computeNormal.js';
export { computeToolpath } from './tagged/computeToolpath.js';
export { concatenate as concatenatePath } from './path/concatenate.js';
export { convexHull } from './convexHull.js';
export { cut } from './cut.js';
export { deduplicate as deduplicatePath } from './path/deduplicate.js';
export { deform } from './deform.js';
export { demesh } from './demesh.js';
export { disjoint } from './disjoint.js';
export { drop } from './tagged/drop.js';
export { eachItem } from './tagged/eachItem.js';
export { eachPoint } from './eachPoint.js';
export { eachSegment } from './eachSegment.js';
export { eachTriangle } from './eachTriangle.js';
export { extrude } from './extrude.js';
export { faces } from './faces.js';
export { fix } from './fix.js';
export { flip as flipPath } from './path/flip.js';
export { fresh } from './tagged/fresh.js';
export { fromPolygons } from './fromPolygons.js';
export {
  fromRotateXToTransform,
  fromRotateYToTransform,
  fromRotateZToTransform,
  fromScaleToTransform,
  fromTranslateToTransform,
} from '@jsxcad/algorithm-cgal';
export { fuse } from './fuse.js';
export { generateLowerEnvelope } from './generateLowerEnvelope.js';
export { generateUpperEnvelope } from './generateUpperEnvelope.js';
export { getAnyNonVoidSurfaces } from './tagged/getAnyNonVoidSurfaces.js';
export { getAnySurfaces } from './tagged/getAnySurfaces.js';
export { getItems } from './tagged/getItems.js';
export { getInverseMatrices } from './tagged/getInverseMatrices.js';
export { getLayouts } from './tagged/getLayouts.js';
export { getLeafs } from './tagged/getLeafs.js';
export { getLeafsIn } from './tagged/getLeafsIn.js';
export { getNonVoidGraphs } from './tagged/getNonVoidGraphs.js';
export { getNonVoidItems } from './tagged/getNonVoidItems.js';
export { getNonVoidPolygonsWithHoles } from './tagged/getNonVoidPolygonsWithHoles.js';
export { getNonVoidPlans } from './tagged/getNonVoidPlans.js';
export { getNonVoidPoints } from './tagged/getNonVoidPoints.js';
export { getNonVoidSegments } from './tagged/getNonVoidSegments.js';
export { getGraphs } from './tagged/getGraphs.js';
export { getEdges as getPathEdges } from './path/getEdges.js';
export { getPlans } from './tagged/getPlans.js';
export { getPoints } from './tagged/getPoints.js';
export { getTags } from './tagged/getTags.js';
export { grow } from './grow.js';
export { hash } from './tagged/hash.js';
export { involute } from './involute.js';
export { fill } from './fill.js';
export { inset } from './inset.js';
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
export { join } from './join.js';
export { keep } from './tagged/keep.js';
export { linearize } from './tagged/linearize.js';
export { link } from './link.js';
export { loft } from './loft.js';
export { makeAbsolute } from './makeAbsolute.js';
export { measureArea } from './tagged/measureArea.js';
export { measureBoundingBox } from './measureBoundingBox.js';
export { measureVolume } from './tagged/measureVolume.js';
export { offset } from './offset.js';
export { op } from './tagged/op.js';
export { open as openPath } from './path/open.js';
export { outline } from './outline.js';
export { read, readNonblocking } from './tagged/read.js';
export { registerReifier } from './tagged/registerReifier.js';
export { reify } from './tagged/reify.js';
export { remesh } from './remesh.js';
export { rewriteTags } from './tagged/rewriteTags.js';
export { rotateZ as rotateZPath } from './path/ops.js';
export { seam } from './seam.js';
export { section } from './section.js';
export { serialize } from './serialize.js';
export { simplify } from './simplify.js';
export { smooth } from './smooth.js';
export { separate } from './separate.js';
export { soup } from './tagged/soup.js';
export { taggedItem } from './tagged/taggedItem.js';
export { taggedDisplayGeometry } from './tagged/taggedDisplayGeometry.js';
export { taggedGraph } from './tagged/taggedGraph.js';
export { taggedGroup } from './tagged/taggedGroup.js';
export { taggedLayout } from './tagged/taggedLayout.js';
export { taggedPlan } from './tagged/taggedPlan.js';
export { taggedPoints } from './tagged/taggedPoints.js';
export { taggedPolygons } from './tagged/taggedPolygons.js';
export { taggedPolygonsWithHoles } from './tagged/taggedPolygonsWithHoles.js';
export { taggedSegments } from './tagged/taggedSegments.js';
export { taggedSketch } from './tagged/taggedSketch.js';
export { taggedTriangles } from './tagged/taggedTriangles.js';
export { transformCoordinate, transformingCoordinates } from './transform.js';
export { translate as translatePath } from './path/ops.js';
export { toConcreteGeometry } from './tagged/toConcreteGeometry.js';
export { toDisplayGeometry } from './tagged/toDisplayGeometry.js';
export { toTransformedGeometry } from './tagged/toTransformedGeometry.js';
export { toPoints } from './toPoints.js';
export { toTriangleArray } from './tagged/toTriangleArray.js';
export { transform } from './tagged/transform.js';
export { twist } from './twist.js';
export { update } from './tagged/update.js';
export { withAabbTreeQuery } from '@jsxcad/algorithm-cgal';
export { write, writeNonblocking } from './tagged/write.js';
