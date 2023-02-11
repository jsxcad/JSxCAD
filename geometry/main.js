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

export { replacer, rewrite, visit } from './tagged/visit.js';

export { approximate } from './approximate.js';
export { allTags } from './tagged/allTags.js';
export { assemble } from './tagged/assemble.js';
export { bend } from './bend.js';
export { cached } from './tagged/cached.js';
export { cast } from './cast.js';
export { clip } from './clip.js';
export { computeCentroid } from './computeCentroid.js';
export { computeImplicitVolume } from './computeImplicitVolume.js';
export { computeNormal } from './computeNormal.js';
export { computeOrientedBoundingBox } from './computeOrientedBoundingBox.js';
export { computeToolpath } from './computeToolpath.js';
export { convexHull } from './convexHull.js';
export { convertPolygonsToMeshes } from './convertPolygonsToMeshes.js';
export { cut } from './cut.js';
export { deform } from './deform.js';
export { demesh } from './demesh.js';
export { dilateXY } from './dilateXY.js';
export { disjoint } from './disjoint.js';
export { disorientSegment } from './disorientSegment.js';
export { drop } from './tagged/drop.js';
export { eachFaceEdges } from './eachFaceEdges.js';
export { eachItem } from './tagged/eachItem.js';
export { eachPoint } from './eachPoint.js';
export { eachSegment } from './eachSegment.js';
export { eachTriangle } from './eachTriangle.js';
export { eagerTransform } from './eagerTransform.js';
export { extrude } from './extrude.js';
export { fix } from './fix.js';
export { fresh } from './tagged/fresh.js';
export { fromPolygons } from './fromPolygons.js';
export { fromPolygonSoup } from './fromPolygonSoup.js';
export {
  identity,
  fromRotateXToTransform,
  fromRotateYToTransform,
  fromRotateZToTransform,
  fromScaleToTransform,
  fromTranslateToTransform,
} from '@jsxcad/algorithm-cgal';
export { fuse } from './fuse.js';
export { generateLowerEnvelope } from './generateLowerEnvelope.js';
export { generateUpperEnvelope } from './generateUpperEnvelope.js';
export { getAnySurfaces } from './tagged/getAnySurfaces.js';
export { getItems } from './tagged/getItems.js';
export { getInverseMatrices } from './tagged/getInverseMatrices.js';
export { getLayouts } from './tagged/getLayouts.js';
export { getLeafs } from './tagged/getLeafs.js';
export { getLeafsIn } from './tagged/getLeafsIn.js';
export { getGraphs } from './tagged/getGraphs.js';
export { getPlans } from './tagged/getPlans.js';
export { getPoints } from './tagged/getPoints.js';
export { getTags } from './tagged/getTags.js';
export { grow } from './grow.js';
export { hasMaterial } from './hasMaterial.js';
export { hash } from './tagged/hash.js';
export { involute } from './involute.js';
export { fill } from './fill.js';
export { inset } from './inset.js';
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
  isNotTypeGhost,
  isNotTypeMasked,
  isNotTypeReference,
  isNotTypeVoid,
  isType,
  isTypeGhost,
  isTypeMasked,
  isTypeReference,
  isTypeVoid,
  hasNotType,
  hasNotTypeGhost,
  hasNotTypeMasked,
  hasNotTypeReference,
  hasNotTypeVoid,
  hasType,
  hasTypeGhost,
  hasTypeMasked,
  hasTypeReference,
  hasTypeVoid,
  typeGhost,
  typeMasked,
  typeReference,
  typeVoid,
} from './tagged/type.js';
export { join } from './join.js';
export { keep } from './tagged/keep.js';
export { linearize } from './tagged/linearize.js';
export { link } from './link.js';
export { load, loadNonblocking } from './tagged/load.js';
export { loft } from './loft.js';
export { makeAbsolute } from './makeAbsolute.js';
export { measureArea } from './tagged/measureArea.js';
export { measureBoundingBox } from './measureBoundingBox.js';
export { measureVolume } from './tagged/measureVolume.js';
export { noGhost } from './noGhost.js';
export { offset } from './offset.js';
export { op } from './tagged/op.js';
export { outline } from './outline.js';
export { read, readNonblocking } from './tagged/read.js';
export { reify } from './tagged/reify.js';
export { remesh } from './remesh.js';
export { rewriteTags } from './tagged/rewriteTags.js';
export { seam } from './seam.js';
export { section } from './section.js';
export { serialize } from './serialize.js';
export { shell } from './shell.js';
export { simplify } from './simplify.js';
export { smooth } from './smooth.js';
export { separate } from './separate.js';
export { soup } from './tagged/soup.js';
export { store } from './tagged/store.js';
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
export { toConcreteGeometry } from './tagged/toConcreteGeometry.js';
export { toDisplayGeometry } from './tagged/toDisplayGeometry.js';
export { toTransformedGeometry } from './tagged/toTransformedGeometry.js';
export { toPoints } from './toPoints.js';
export { toTriangleArray } from './tagged/toTriangleArray.js';
export { transform } from './tagged/transform.js';
export { twist } from './twist.js';
export { update } from './tagged/update.js';
export { unfold } from './unfold.js';
export { withAabbTreeQuery } from '@jsxcad/algorithm-cgal';
export { wrap } from './wrap.js';
export { write, writeNonblocking } from './tagged/write.js';
