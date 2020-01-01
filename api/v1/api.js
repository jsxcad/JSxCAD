/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

import './add';
import './as';
import './back';
import './bom';
import './bottom';
import './canonicalize';
import './center';
import './chop';
import './color';
import './colors';
import './contract';
import './cut';
import './drop';
import './edges';
import './expand';
import './extrude';
import './faces';
import './fill';
import './front';
import './getPathsets';
import './interior';
import './items';
import './keep';
import './kept';
import './left';
import './material';
import './measureBoundingBox';
import './measureCenter';
import './move';
import './moveX';
import './moveY';
import './moveZ';
import './nocut';
import './on';
import './offset';
import './orient';
import './outline';
import './right';
import './rotate';
import './rotateX';
import './rotateY';
import './rotateZ';
import './scale';
import './section';
import './size';
import './solids';
import './sweep';
import './tags';
import './top';
import './toBillOfMaterial';
import './toItems';
import './toolpath';
import './translate';
import './turn';
import './turnX';
import './turnY';
import './turnZ';
import './unfold';
import './void';
import './voxels';
import './wireframe';
import './with';
import './writeDxf';
import './writeGcode';
import './writePdf';
import './writeShape';
import './writeStl';
import './writeSvg';
import './writeSvgPhoto';
import './writeThreejs';

import * as vec from '@jsxcad/math-vec3';

import { Label, Plan } from './Plan';
import { join, joinLeft, rejoin } from './connect';
import { readPng, readPngAsContours } from './readPng';

import Armature from './Armature';
import Circle from './Circle';
import Cone from './Cone';
import { Connector } from './Connector';
import Cube from './Cube';
import Cursor from './Cursor';
import { Cylinder } from './Cylinder';
import { Hexagon } from './Hexagon';
import { Icosahedron } from './Icosahedron';
import { Item } from './Item';
import { Line } from './Line';
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
import { Torus } from './Torus';
import { Triangle } from './Triangle';
import { Wave } from './Wave';
import { X } from './X';
import { Y } from './Y';
import { Z } from './Z';

import acos from './acos';
import ask from './ask';
import assemble from './assemble';
import chainHull from './chainHull';
import cos from './cos';
import difference from './difference';
import ease from './ease';
import { flat } from './flat';
import { hull } from './hull';
import { intersection } from './intersection';
import { lathe } from './lathe';
import { log } from './log';
import { max } from './max';
import { min } from './min';
import { minkowski } from './minkowski';
import { numbers } from './numbers';
import { pack } from './pack';
import { readDst } from './readDst';
import { readDxf } from './readDxf';
import { readFont } from './readFont';
// import { readJscad } from './readJscad';
import { readShape } from './readShape';
import { readShapefile } from './readShapefile';
import { readStl } from './readStl';
import { readSvg } from './readSvg';
import { readSvgPath } from './readSvgPath';
import { shell } from './shell';
import { sin } from './sin';
import { source } from './source';
import { specify } from './specify';
import { sqrt } from './sqrt';
import { stretch } from './stretch';
import { union } from './union';

export * from './units';

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
  cos,
  Cube,
  Cursor,
  Cylinder,
  difference,
  ease,
  flat,
  Hexagon,
  hull,
  Icosahedron,
  Item,
  intersection,
  join,
  joinLeft,
  lathe,
  Label,
  Line,
  log,
  max,
  min,
  minkowski,
  Nail,
  numbers,
  pack,
  Plan,
  Path,
  Point,
  Points,
  Polygon,
  Polyhedron,
  Prism,
  readDst,
  readDxf,
  readFont,
  // readJscad,
  readPng,
  readPngAsContours,
  readShape,
  readShapefile,
  readStl,
  readSvg,
  readSvgPath,
  rejoin,
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
  Torus,
  Triangle,
  union,
  vec,
  Wave,
  X,
  Y,
  Z
};
