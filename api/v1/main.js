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

import Armature from './Armature';
import Circle from './Circle';
import Cone from './Cone';
import { Connector } from './Connector';
import Cube from './Cube';
import Cursor from './Cursor';
import { Cylinder } from './Cylinder';
// import { Fastener } from './Fastener';
import Font from './Font';
import { Gear } from './Gear';
import Hershey from './Hershey';
import { Hexagon } from './Hexagon';
import { Icosahedron } from './Icosahedron';
import { Item } from './Item';
import { Lego } from './Lego';
import { Line } from './Line';
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

import acos from './acos';
import ask from './ask';
import assemble from './assemble';
import chainHull from './chainHull';
import cos from './cos';
import difference from './difference';
import ease from './ease';
import { flat } from './flat';
import { hull } from './hull';
import { importModule } from './importModule';
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
import { readLDraw } from './readLDraw';
import { readPng } from './readPng';
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

const constructors = [
  'Shape',
  'Armature',
  'Circle',
  'Cone',
  'Connector',
  'Cube',
  'Cursor',
  'Cylinder',
  'Font',
  'Gear',
  'Hershey',
  'Hexagon',
  'Icosahedron',
  'Item',
  'Label',
  'Lego',
  'Line',
  'log',
  'MicroGearMotor',
  'Nail',
  'Plan',
  'Path',
  'Point',
  'Points',
  'Polygon',
  'Polyhedron',
  'Prism',
  'Sphere',
  'Spiral',
  'Square',
  'SvgPath',
  'Tetrahedron',
  'ThreadedRod',
  'Torus',
  'Triangle',
  'Wave',
  'X',
  'Y',
  'Z'
];

const shapeMethods = [
  'above',
  'back',
  'below',
  'center',
  'chop',
  'color',
  'connect',
  'connector',
  'connectors',
  'contract',
  'drop',
  'ease',
  'expand',
  'extrude',
  'front',
  'getPathsets',
  'flat',
  'interior',
  'kept',
  'left',
  'material',
  'measureBoundingBox',
  'measureCenter',
  'move',
  'moveX',
  'moveY',
  'moveZ',
  'nocut',
  'offset',
  'orient',
  'outline',
  'right',
  'rotate',
  'rotateX',
  'rotateY',
  'rotateZ',
  'scale',
  'section',
  'shell',
  'solids',
  'specify',
  'sweep',
  'tags',
  'toolpath',
  'toBillOfMaterial',
  'toItems',
  'translate',
  'turn',
  'turnX',
  'turnY',
  'turnZ',
  'keep',
  'voxels',
  'wireframe',
  'writeDxf',
  'writeGcode',
  'writePdf',
  'writeShape',
  'writeStl',
  'writeSvg',
  'writeSvgPhoto',
  'writeThreejsPage'
];

const operators = [
  'acos',
  'ask',
  'assemble',
  'cos',
  'difference',
  'ease',
  'flat',
  'hull',
  'intersection',
  'join',
  'lathe',
  'log',
  'max',
  'min',
  'minkowski',
  'numbers',
  'pack',
  'readDst',
  'readDxf',
  'readFont',
  'readLDraw',
  'readPng',
  'readShape',
  'readShapefile',
  'readStl',
  'readSvg',
  'readSvgPath',
  'rejoin',
  'shell',
  'sin',
  'source',
  'specify',
  'sqrt',
  'stretch',
  'union',
  'vec'
];

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
  // Fastener,
  Font,
  Gear,
  Hershey,
  Hexagon,
  hull,
  Icosahedron,
  Item,
  importModule,
  intersection,
  join,
  joinLeft,
  lathe,
  Label,
  Lego,
  Line,
  log,
  max,
  min,
  MicroGearMotor,
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
  readLDraw,
  readPng,
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

const buildCompletions = () => {
  const completions = [];
  for (const constructor of constructors) {
    completions.push({ completion: constructor });
  }
  for (const operator of operators) {
    completions.push({ completion: operator });
  }
  return completions;
};

const buildShapeMethodCompletions = () => {
  const completions = [];
  for (const shapeMethod of shapeMethods) {
    completions.push({ completion: shapeMethod });
  }
  return completions;
};

const completions = buildCompletions();
const shapeMethodCompletions = buildShapeMethodCompletions();

export const getCompletions = (prefix, { isMethod = false }) => {
  const selectedEntries = [];
  const entries = isMethod ? shapeMethodCompletions : completions;
  for (const entry of entries) {
    if (entry.completion.startsWith(prefix)) {
      selectedEntries.push(entry);
    }
  }
  return selectedEntries;
};
