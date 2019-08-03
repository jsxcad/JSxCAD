/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import { getClock, startClock } from './clock';
import { planeX, planeY, planeZ } from './plane';

import { Armature } from './Armature';
import { Circle } from './Circle';
import { Cube } from './Cube';
import { Cursor } from './Cursor';
import { Cylinder } from './Cylinder';
import { Gear } from './Gear';
import { Lego } from './Lego';
import { MicroGearMotor } from './MicroGearMotor';
import { Point } from './Point';
import { Points } from './Points';
import { Polygon } from './Polygon';
import { Polyhedron } from './Polyhedron';
import { Shape } from './Shape';
import { Sphere } from './Sphere';
import { Square } from './Square';
import { SvgPath } from './SvgPath';
import { Tetrahedron } from './Tetrahedron';
import { Torus } from './Torus';
import { Triangle } from './Triangle';

import { above } from './above';
import { acos } from './acos';
import { as } from './as';
import { assemble } from './assemble';
import { back } from './back';
import { below } from './below';
import { center } from './center';
import { chainHull } from './chainHull';
import { color } from './color';
import { cos } from './cos';
import { cut } from './cut';
import { describe } from './describe';
import { difference } from './difference';
import { divide } from './divide';
import { drop } from './drop';
import { extrude } from './extrude';
import { fillet } from './fillet';
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
import { numbers } from './numbers';
import { outline } from './outline';
import { readDst } from './readDst';
import { readFont } from './readFont';
import { readJscad } from './readJscad';
import { readLDraw } from './readLDraw';
import { readShape } from './readShape';
import { readStl } from './readStl';
import { readSvg } from './readSvg';
import { right } from './right';
import { rotateX } from './rotateX';
import { rotateY } from './rotateY';
import { rotateZ } from './rotateZ';
import { scale } from './scale';
import { section } from './section';
import { sin } from './sin';
import { source } from './source';
import { sqrt } from './sqrt';
import { tags } from './tags';
import { translate } from './translate';
import { union } from './union';
import { voxels } from './voxels';
import { wireframe } from './wireframe';
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
  divide,
  drop,
  extrude,
  fillet,
  front,
  // fuse,
  getPathsets,
  interior,
  left,
  material,
  measureBoundingBox,
  measureCenter,
  move,
  outline,
  right,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  section,
  tags,
  translate,
  keep,
  voxels,
  wireframe,
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
  chainHull,
  Circle,
  cos,
  Cube,
  Cursor,
  Cylinder,
  difference,
  Gear,
  getClock,
  hull,
  importModule,
  intersection,
  lathe,
  Lego,
  log,
  max,
  MicroGearMotor,
  minkowski,
  numbers,
  planeX,
  planeY,
  planeZ,
  Point,
  Points,
  Polygon,
  Polyhedron,
  readDst,
  readFont,
  readJscad,
  readLDraw,
  readShape,
  readStl,
  readSvg,
  sin,
  source,
  Sphere,
  sqrt,
  Square,
  startClock,
  SvgPath,
  Tetrahedron,
  Torus,
  Triangle,
  union
};
