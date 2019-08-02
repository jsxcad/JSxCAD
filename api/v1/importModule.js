import { getClock, startClock } from './clock';
import { getSources, readFile } from '@jsxcad/sys';
import { planeX, planeY, planeZ } from './plane';

import { Shape } from './Shape';
import { above } from './above';
import { acos } from './acos';
import { armature } from './armature';
import { as } from './as';
import { assemble } from './assemble';
import { back } from './back';
import { below } from './below';
import { center } from './center';
import { chainHull } from './chainHull';
import { circle } from './circle';
import { color } from './color';
import { cos } from './cos';
import { cube } from './cube';
import { cursor } from './cursor';
import { cut } from './cut';
import { cylinder } from './cylinder';
import { describe } from './describe';
import { difference } from './difference';
import { divide } from './divide';
import { drop } from './drop';
import { extrude } from './extrude';
import { fillet } from './fillet';
import { front } from './front';
import { fuse } from './fuse';
import { gear } from './gear';
import { getPathsets } from './getPathsets';
import { hull } from './hull';
import { interior } from './interior';
import { intersection } from './intersection';
import { keep } from './keep';
import { lathe } from './lathe';
import { left } from './left';
import { lego } from './lego';
import { log } from './log';
import { material } from './material';
import { max } from './max';
import { measureBoundingBox } from './measureBoundingBox';
import { measureCenter } from './measureCenter';
import { microGearMotor } from './microGearMotor';
import { minkowski } from './minkowski';
import { move } from './move';
import { numbers } from './numbers';
import { outline } from './outline';
import { point } from './point';
import { points } from './points';
import { polygon } from './polygon';
import { polyhedron } from './polyhedron';
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
import { sphere } from './sphere';
import { sqrt } from './sqrt';
import { square } from './square';
import { svgPath } from './svgPath';
import { tags } from './tags';
import { tetrahedron } from './tetrahedron';
import { toEcmascript } from '@jsxcad/compiler';
import { torus } from './torus';
import { translate } from './translate';
import { triangle } from './triangle';
import { union } from './union';
import { wireframe } from './wireframe';
import { writePdf } from './writePdf';
import { writeShape } from './writeShape';
import { writeStl } from './writeStl';
import { writeSvg } from './writeSvg';
import { writeSvgPhoto } from './writeSvgPhoto';
import { writeThreejsPage } from './writeThreejs';

const api = {
  Shape,
  above,
  acos,
  armature,
  as,
  assemble,
  back,
  below,
  center,
  chainHull,
  circle,
  color,
  cos,
  cube,
  cut,
  cursor,
  cylinder,
  describe,
  difference,
  divide,
  drop,
  extrude,
  fillet,
  front,
  fuse,
  gear,
  getClock,
  getPathsets,
  hull,
  importModule,
  interior,
  intersection,
  lathe,
  left,
  lego,
  log,
  material,
  max,
  measureBoundingBox,
  measureCenter,
  microGearMotor,
  minkowski,
  move,
  numbers,
  outline,
  planeX,
  planeY,
  planeZ,
  point,
  points,
  polygon,
  polyhedron,
  readDst,
  readFont,
  readJscad,
  readLDraw,
  readShape,
  readStl,
  readSvg,
  right,
  rotateX,
  rotateY,
  rotateZ,
  scale,
  section,
  sin,
  source,
  sphere,
  sqrt,
  square,
  startClock,
  svgPath,
  tags,
  tetrahedron,
  torus,
  translate,
  triangle,
  union,
  keep,
  wireframe,
  writePdf,
  writeShape,
  writeStl,
  writeSvg,
  writeSvgPhoto,
  writeThreejsPage
};

export const importModule = async (name) => {
  const path = name;
  const sources = getSources(path);
  const script = await readFile({ path, as: 'utf8', sources }, path);
  const ecmascript = toEcmascript({}, script);
  const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
  const constructor = await builder(api);
  const module = await constructor();
  return module;
};
