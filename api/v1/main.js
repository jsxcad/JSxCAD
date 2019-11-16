/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import './add';
import './cut';
import './with';

import * as vec from '@jsxcad/math-vec3';

import { Label, Plan } from './Plan';

import Armature from './Armature';
import Circle from './Circle';
import Cone from './Cone';
import Connector from './Connector';
import Cube from './Cube';
import Cursor from './Cursor';
import { Cylinder } from './Cylinder';
// import { Fastener } from './Fastener';
import { Gear } from './Gear';
import { Hexagon } from './Hexagon';
import { Icosahedron } from './Icosahedron';
import { Lego } from './Lego';
import { MicroGearMotor } from './MicroGearMotor';
import { Nail } from './Nail';
import { Path } from './Path';
import { Point } from './Point';
import { Points } from './Points';
import { Polygon } from './Polygon';
import { Polyhedron } from './Polyhedron';
import { Prism } from './Prism';
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

import above from './above';
import acos from './acos';
import as from './as';
import ask from './ask';
import assemble from './assemble';
import back from './back';
import below from './below';
import center from './center';
import chainHull from './chainHull';
import chop from './chop';
import color from './color';
import connect from './connect';
import connector from './connector';
import connectors from './connectors';
import contract from './contract';
import coordinates from './coordinates';
import cos from './cos';
import difference from './difference';
import drop from './drop';
import ease from './ease';
import expand from './expand';
import extrude from './extrude';
import { flat } from './flat';
import { front } from './front';
import { getPathsets } from './getPathsets';
import { hull } from './hull';
import { importModule } from './importModule';
import { interior } from './interior';
import { intersection } from './intersection';
import { keep } from './keep';
import { kept } from './kept';
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
import { offset } from './offset';
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
import { shell } from './shell';
import { sin } from './sin';
import { source } from './source';
import { specify } from './specify';
import { sqrt } from './sqrt';
import { stretch } from './stretch';
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
  chop,
  color,
  connect,
  connector,
  connectors,
  contract,
  drop,
  ease,
  expand,
  extrude,
  front,
  getPathsets,
  flat,
  interior,
  kept,
  left,
  material,
  measureBoundingBox,
  measureCenter,
  move,
  moveX,
  moveY,
  moveZ,
  nocut,
  offset,
  orient,
  outline,
  right,
  rotate,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  section,
  shell,
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
  ask,
  Armature,
  assemble,
  chainHull,
  Circle,
  Cone,
  Connector,
  coordinates,
  cos,
  Cube,
  Cursor,
  Cylinder,
  difference,
  ease,
  flat,
  // Fastener,
  Gear,
  Hexagon,
  hull,
  Icosahedron,
  importModule,
  intersection,
  lathe,
  Label,
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
  Prism,
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
  shell,
  sin,
  source,
  specify,
  Sphere,
  sqrt,
  stretch,
  Spiral,
  Square,
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
