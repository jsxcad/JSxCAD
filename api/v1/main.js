/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import * as vec from '@jsxcad/math-vec3';

import { getClock, startClock } from './clock';

import { Armature } from './Armature';
import { Board } from './Board';
import { Circle } from './Circle';
import { Cube } from './Cube';
import { Cursor } from './Cursor';
import { Cylinder } from './Cylinder';
import { Fastener } from './Fastener';
import { Gear } from './Gear';
import { Icosahedron } from './Icosahedron';
import { Lego } from './Lego';
import { MicroGearMotor } from './MicroGearMotor';
import { Nail } from './Nail';
import { Path } from './Path';
import { Plan } from './Plan';
import { Point } from './Point';
import { Points } from './Points';
import { Polygon } from './Polygon';
import { Polyhedron } from './Polyhedron';
import { Shape } from './Shape';
import { Sphere } from './Sphere';
import { Spiral } from './Spiral';
import { Square } from './Square';
import { SvgPath } from './SvgPath';
import { Tetrahedron } from './Tetrahedron';
import { ThreadedRod } from './ThreadedRod';
import { Torus } from './Torus';
import { Triangle } from './Triangle';
import { Wave } from './Wave';
import { X } from './X';
import { Y } from './Y';
import { Z } from './Z';

import { above } from './above';
import { acos } from './acos';
import { as } from './as';
import { assemble } from './assemble';
import { back } from './back';
import { below } from './below';
import { center } from './center';
import { chainHull } from './chainHull';
import { color } from './color';
import { coordinates } from './coordinates';
import { cos } from './cos';
import { cut } from './cut';
import { describe } from './describe';
import { difference } from './difference';
// import { divide } from './divide';
import { drop } from './drop';
import { ease } from './ease';
import { extrude } from './extrude';
import { fillet } from './fillet';
import { flat } from './flat';
import { front } from './front';
// import { fuse } from './fuse';
import { getPathsets } from './getPathsets';
import { hull } from './hull';
import { importModule } from './importModule';
import { interior } from './interior';
import { intersection } from './intersection';
import { keep } from './keep';
import { lathe } from './lathe';
import { left } from './left';
import { log } from './log';
import { material } from './material';
import { max } from './max';
import { measureBoundingBox } from './measureBoundingBox';
import { measureCenter } from './measureCenter';
import { minkowski } from './minkowski';
import { move } from './move';
import { moveX } from './moveX';
import { moveY } from './moveY';
import { moveZ } from './moveZ';
import { nocut } from './nocut';
import { numbers } from './numbers';
import { orient } from './orient';
import { outline } from './outline';
import { readDst } from './readDst';
import { readFont } from './readFont';
import { readJscad } from './readJscad';
import { readLDraw } from './readLDraw';
import { readPng } from './readPng';
import { readShape } from './readShape';
import { readShapefile } from './readShapefile';
import { readStl } from './readStl';
import { readSvg } from './readSvg';
import { readSvgPath } from './readSvgPath';
import { right } from './right';
import { rotate } from './rotate';
import { rotateX } from './rotateX';
import { rotateY } from './rotateY';
import { rotateZ } from './rotateZ';
import { scale } from './scale';
import { section } from './section';
import { sin } from './sin';
import { source } from './source';
import { specify } from './specify';
import { sqrt } from './sqrt';
import { sweep } from './sweep';
import { tags } from './tags';
import { toBillOfMaterial } from './toBillOfMaterial';
import { toItems } from './toItems';
import { toolpath } from './toolpath';
import { translate } from './translate';
import { union } from './union';
import { voxels } from './voxels';
import { wireframe } from './wireframe';
import { writeDxf } from './writeDxf';
import { writeGcode } from './writeGcode';
import { writePdf } from './writePdf';
import { writeShape } from './writeShape';
import { writeStl } from './writeStl';
import { writeSvg } from './writeSvg';
import { writeSvgPhoto } from './writeSvgPhoto';
import { writeThreejsPage } from './writeThreejs';

const methods = [
  above,
  as,
  back,
  below,
  center,
  color,
  cut,
  describe,
  // divide,
  drop,
  ease,
  extrude,
  fillet,
  front,
  // fuse,
  getPathsets,
  flat,
  interior,
  left,
  material,
  measureBoundingBox,
  measureCenter,
  move,
  moveX,
  moveY,
  moveZ,
  nocut,
  orient,
  outline,
  right,
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  section,
  specify,
  sweep,
  tags,
  toolpath,
  toBillOfMaterial,
  toItems,
  translate,
  keep,
  voxels,
  wireframe,
  writeDxf,
  writeGcode,
  writePdf,
  writeShape,
  writeStl,
  writeSvg,
  writeSvgPhoto,
  writeThreejsPage
];

if (methods.includes(undefined)) {
  throw Error('die');
}

export {
  Shape,
  acos,
  Armature,
  assemble,
  Board,
  chainHull,
  Circle,
  coordinates,
  cos,
  Cube,
  Cursor,
  Cylinder,
  difference,
  ease,
  flat,
  Fastener,
  Gear,
  getClock,
  hull,
  Icosahedron,
  importModule,
  intersection,
  lathe,
  Lego,
  log,
  max,
  MicroGearMotor,
  minkowski,
  Nail,
  numbers,
  Plan,
  Path,
  Point,
  Points,
  Polygon,
  Polyhedron,
  readDst,
  readFont,
  readJscad,
  readLDraw,
  readPng,
  readShape,
  readShapefile,
  readStl,
  readSvg,
  readSvgPath,
  sin,
  source,
  specify,
  Sphere,
  sqrt,
  Spiral,
  Square,
  startClock,
  SvgPath,
  Tetrahedron,
  ThreadedRod,
  Torus,
  Triangle,
  union,
  vec,
  Wave,
  X,
  Y,
  Z
};
