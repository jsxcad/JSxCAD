/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import './Shape.js';

// We need destructure available via Shape.
// eslint-disable-next-line sort-imports
import './destructure.js';

// We need Plan.js to add Shape.registerReifier before later imports call it.
// eslint-disable-next-line sort-imports
import './Plan.js';

import Point from './Point.js';

export {
  GrblConstantLaser,
  GrblDynamicLaser,
  GrblPlotter,
  GrblSpindle,
  define,
  defRgbColor,
  defThreejsMaterial,
  defTool,
} from './define.js';

export const X = (x = 0) => Point().x(x);
export const Y = (y = 0) => Point().y(y);
export const Z = (z = 0) => Point().z(z);
export const XY = (z = 0) => Point().z(z);
export const XZ = (y = 0) =>
  Point()
    .rx(-1 / 4)
    .y(y);
export const YZ = (x = 0) =>
  Point()
    .ry(-1 / 4)
    .x(x);
export const RX = (t = 0) => Point().rx(t);
export const RY = (t = 0) => Point().ry(t);
export const RZ = (t = 0) => Point().rz(t);

export { md } from './md.js';

export { elapsed, emit, read, write } from '@jsxcad/sys';

export { Shape } from './Shape.js';
export { abstract } from './abstract.js';
export { join } from './join.js';
export { absolute } from './absolute.js';
export { and } from './and.js';
export { addTo } from './addTo.js';
export { align } from './align.js';
export { area } from './area.js';
export { as } from './as.js';
export { asPart } from './asPart.js';
export { at } from './at.js';
export { bend } from './bend.js';
export { billOfMaterials } from './billOfMaterials.js';
export { by } from './by.js';
export { cast } from './cast.js';
export { center } from './center.js';
export { chainHull } from './ChainHull.js';
export { clean } from './clean.js';
export { clip } from './clip.js';
export { clipopen } from './clipopen.js';
export { clipfrom } from './clipfrom.js';
export { color } from './color.js';
export { colors } from './colors.js';
export { cut } from './cut.js';
export { cutFrom } from './cutFrom.js';
export { cutopen } from './cutopen.js';
export { cutout } from './cutout.js';
export { deform } from './deform.js';
export { demesh } from './demesh.js';
export { disjoint } from './disjoint.js';
export { drop } from './drop.js';
export { ensurePages } from './Page.js';
export { each } from './each.js';
export { eachIn } from './eachIn.js';
export { eachPoint } from './eachPoint.js';
export { edit } from './edit.js';
export { edges } from './edges.js';
export { extrudeX, extrudeY, extrudeZ, ex, ey, ez } from './extrude.js';
export { extrudeAlong, e } from './extrudeAlong.js';
export { faces } from './faces.js';
export { fill } from './fill.js';
export { fit } from './fit.js';
export { fitTo } from './fitTo.js';
export { fix } from './fix.js';
export { o, origin } from './origin.js';
export { fuse } from './fuse.js';
export { g, get } from './get.js';
export { ghost } from './ghost.js';
export { gn, getNot } from './getNot.js';
export { grow } from './grow.js';
export { hull } from './Hull.js';
export { inFn } from './in.js';
export { inline } from './inline.js';
export { inset } from './inset.js';
export { involute } from './involute.js';
export { keep } from './keep.js';
export { link } from './Link.js';
export { loadGeometry } from './loadGeometry.js';
export { loft } from './loft.js';
export { log } from './log.js';
export { loop } from './Loop.js';
export { lowerEnvelope } from './lowerEnvelope.js';
export { overlay } from './overlay.js';
export { mask } from './mask.js';
export { masking } from './masking.js';
export { material } from './material.js';
export { move, xyz } from './move.js';
export { moveAlong } from './moveAlong.js';
export { moveTo } from './moveTo.js';
export { noop } from './noop.js';
export { normal } from './normal.js';
export { noVoid } from './noVoid.js';
export { notColor } from './notColor.js';
export { n, nth } from './nth.js';
export { offset } from './offset.js';
export { on } from './on.js';
export { op } from './op.js';
export { outline } from './outline.js';
export { orient } from './orient.js';
export { pack } from './pack.js';
export { points } from './points.js';
export { reify } from './reify.js';
export { remesh } from './remesh.js';
export { rotateX, rx } from './rx.js';
export { rotateY, ry } from './ry.js';
export { rotateZ, rz } from './rz.js';
export { saveGeometry } from './saveGeometry.js';
export { scale } from './scale.js';
export { scaleX, sx } from './sx.js';
export { scaleY, sy } from './sy.js';
export { scaleZ, sz } from './sz.js';
export { scaleToFit } from './scaleToFit.js';
export { seam } from './seam.js';
export { section, sectionProfile } from './section.js';
export { self } from './self.js';
export { separate } from './separate.js';
export { seq } from './seq.js';
export { serialize } from './serialize.js';
export { simplify } from './simplify.js';
export { size } from './size.js';
export { sketch } from './sketch.js';
export { smooth } from './smooth.js';
export { sort } from './sort.js';
export { table } from './table.js';
export { tag } from './tag.js';
export { tags } from './tags.js';
export { tint } from './tint.js';
export { to } from './to.js';
export { tool } from './tool.js';
export { toolpath } from './toolpath.js';
export { top } from './top.js';
export { twist } from './twist.js';
export { untag } from './untag.js';
export { upperEnvelope } from './upperEnvelope.js';
export { view } from './view.js';
export { voidFn } from './void.js';
export { voidIn } from './voidIn.js';
export { volume } from './volume.js';
export { voxels } from './voxels.js';
export { wrap } from './wrap.js';
export { x } from './x.js';
export { y } from './y.js';
export { z } from './z.js';

export { Arc, ArcX, ArcY, ArcZ } from './Arc.js';
export { Assembly } from './Assembly.js';
export { Box } from './Box.js';
export { Cached } from './Cached.js';
export { ChainHull } from './ChainHull.js';
export { Curve } from './Curve.js';
export { Edge } from './Edge.js';
export { Edges } from './Edges.js';
export { Empty } from './Empty.js';
export { Face } from './Face.js';
export { Group } from './Group.js';
export { Hershey } from './Hershey.js';
export { Hexagon } from './Hexagon.js';
export { Hull } from './Hull.js';
export { Icosahedron } from './Icosahedron.js';
export { Implicit } from './Implicit.js';
export { Join } from './Join.js';
export { Line } from './Line.js';
export { Link } from './Link.js';
export { Loft } from './loft.js';
export { Loop } from './Loop.js';
export { Octagon } from './Octagon.js';
export { Orb } from './Orb.js';
export { Page } from './Page.js';
export { Path } from './Path.js';
export { Pentagon } from './Pentagon.js';
export { Plan } from './Plan.js';
export { Point } from './Point.js';
export { Points } from './Points.js';
export { Polygon } from './Polygon.js';
export { Polyhedron } from './Polyhedron.js';
export { Segments } from './Segments.js';
export { Septagon } from './Septagon.js';
export { Spiral } from './Spiral.js';
export { SurfaceMesh } from './SurfaceMesh.js';
export { Tetragon } from './Tetragon.js';
export { Triangle } from './Triangle.js';
export { Voxels } from './voxels.js';
export { Wave } from './Wave.js';
export { ofPlan } from './Plan.js';

export { foot, inch, mm, mil, cm, m, thou, yard } from '@jsxcad/api-v1-units';
