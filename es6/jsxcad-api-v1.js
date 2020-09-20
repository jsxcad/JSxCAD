import { addPending, write, emit, read, getCurrentPath, addSource } from './jsxcad-sys.js';
export { emit, read, write } from './jsxcad-sys.js';
import Shape, { Shape as Shape$1, loadGeometry, log, saveGeometry } from './jsxcad-api-v1-shape.js';
export { Shape, loadGeometry, log, saveGeometry } from './jsxcad-api-v1-shape.js';
import { ensurePages, Page, pack } from './jsxcad-api-v1-layout.js';
export { Page, pack } from './jsxcad-api-v1-layout.js';
import './jsxcad-api-v1-deform.js';
import './jsxcad-api-v1-gcode.js';
import './jsxcad-api-v1-pdf.js';
import './jsxcad-api-v1-plans.js';
import { Peg, Arc, Assembly, Ball, Box, Circle, Cone, Cube, Cylinder, Difference, Empty, Group, Hershey, Hexagon, Icosahedron, Intersection, Layers, Line, Path, Plane, Point, Points, Polygon, Polyhedron, Prism, Rod, Sphere, Spiral, Square, Tetrahedron, Toolpath, Torus, Triangle, Union, Wave } from './jsxcad-api-v1-shapes.js';
export { Arc, Assembly, Ball, Box, Circle, Cone, Cube, Cylinder, Difference, Empty, Group, Hershey, Hexagon, Icosahedron, Intersection, Layers, Line, Path, Peg, Plane, Point, Points, Polygon, Polyhedron, Prism, Rod, Sphere, Spiral, Square, Tetrahedron, Toolpath, Torus, Triangle, Union, Wave } from './jsxcad-api-v1-shapes.js';
import { X, Y, Z } from './jsxcad-api-v1-connector.js';
export { X, Y, Z } from './jsxcad-api-v1-connector.js';
import { ChainedHull, Hull, Loop } from './jsxcad-api-v1-extrude.js';
export { ChainedHull, Hull, Loop } from './jsxcad-api-v1-extrude.js';
import { Line2 } from './jsxcad-api-v1-line2.js';
export { Line2 } from './jsxcad-api-v1-line2.js';
import { Plan } from './jsxcad-api-v1-plan.js';
export { Plan } from './jsxcad-api-v1-plan.js';
import { Shell } from './jsxcad-api-v1-shell.js';
export { Shell } from './jsxcad-api-v1-shell.js';
import { BenchPlane, BenchSaw, DrillPress, HoleRouter, LineRouter, ProfileRouter } from './jsxcad-api-v1-tools.js';
export { BenchPlane, BenchSaw, DrillPress, HoleRouter, LineRouter, ProfileRouter } from './jsxcad-api-v1-tools.js';
import { Item } from './jsxcad-api-v1-item.js';
export { Item } from './jsxcad-api-v1-item.js';
import { Noise, Random, acos, cos, ease, max, min, numbers, sin, sqrt, vec } from './jsxcad-api-v1-math.js';
export { Noise, Random, acos, cos, ease, max, min, numbers, sin, sqrt, vec } from './jsxcad-api-v1-math.js';
import { readSvg } from './jsxcad-api-v1-svg.js';
export { readSvg } from './jsxcad-api-v1-svg.js';
import { readStl } from './jsxcad-api-v1-stl.js';
export { readStl } from './jsxcad-api-v1-stl.js';
import { foot, inch, mm, mil, cm, m, thou, yard } from './jsxcad-api-v1-units.js';
export { cm, foot, inch, m, mil, mm, thou, yard } from './jsxcad-api-v1-units.js';
import { toEcmascript } from './jsxcad-compiler.js';
import { toSvg } from './jsxcad-convert-svg.js';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  { path, width = 1024, height = 512, position = [100, -100, 100] } = {}
) => {
  let nth = 0;
  for (const entry of ensurePages(shape.toDisjointGeometry())) {
    if (path) {
      const nthPath = `${path}_${nth++}`;
      addPending(write(nthPath, entry));
      emit({ view: { width, height, position, path: nthPath } });
    } else {
      emit({ view: { width, height, position, geometry: entry } });
    }
  }
  return shape;
};

Shape.prototype.view = function ({
  path,
  width = 512,
  height = 256,
  position = [100, -100, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallView = function ({
  path,
  width = 256,
  height = 128,
  position = [100, -100, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigView = function ({
  path,
  width = 1024,
  height = 512,
  position = [100, -100, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.topView = function ({
  path,
  width = 512,
  height = 256,
  position = [0, 0, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallTopView = function ({
  path,
  width = 256,
  height = 128,
  position = [0, 0, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigTopView = function ({
  path,
  width = 1024,
  height = 512,
  position = [0, 0, 100],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.frontView = function ({
  path,
  width = 512,
  height = 256,
  position = [0, -100, 0],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallFrontView = function ({
  path,
  width = 256,
  height = 128,
  position = [0, -100, 0],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigFrontView = function ({
  path,
  width = 1024,
  height = 512,
  position = [0, -100, 0],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.sideView = function ({
  path,
  width = 512,
  height = 256,
  position = [100, 0, 0],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.smallSideView = function ({
  path,
  width = 256,
  height = 128,
  position = [100, 0, 0],
} = {}) {
  return view(this, { path, width, height, position });
};

Shape.prototype.bigSideView = function ({
  path,
  width = 1024,
  height = 512,
  position = [100, 0, 0],
} = {}) {
  return view(this, { path, width, height, position });
};

const md = (strings, ...placeholders) => {
  const md = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ md });
  return md;
};

// FIX: This needs to consider the current module.
// FIX: Needs to communicate cache invalidation with other workers.
const getControlValues = async () =>
  (await read(`control/${getCurrentPath()}`, { useCache: false })) || {};

const stringBox = async (label, otherwise) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'stringBox', label, value } });
  return value;
};

const numberBox = async (label, otherwise) =>
  Number(await stringBox(label, otherwise));

const sliderBox = async (
  label,
  otherwise,
  { min = 0, max = 100, step = 1 } = {}
) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'sliderBox', label, value, min, max, step } });
  return Number(value);
};

const checkBox = async (label, otherwise) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'checkBox', label, value } });
  return Boolean(value);
};

const selectBox = async (label, otherwise, options) => {
  const { [label]: value = otherwise } = await getControlValues();
  emit({ control: { type: 'selectBox', label, value, options } });
  return value;
};

const source = (path, source) => addSource(`cache/${path}`, source);

/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

const x = Peg([0, 0, 0], [0, 0, 1], [0, 1, 0]);
const y = Peg([0, 0, 0], [0, 0, 1], [-1, 0, 0]);
const z = Peg([0, 0, 0], [0, 1, 0], [1, 0, 0]);

var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  x: x,
  y: y,
  z: z,
  Page: Page,
  pack: pack,
  md: md,
  checkBox: checkBox,
  numberBox: numberBox,
  selectBox: selectBox,
  sliderBox: sliderBox,
  stringBox: stringBox,
  source: source,
  emit: emit,
  read: read,
  write: write,
  X: X,
  Y: Y,
  Z: Z,
  ChainedHull: ChainedHull,
  Hull: Hull,
  Loop: Loop,
  Shape: Shape$1,
  loadGeometry: loadGeometry,
  log: log,
  saveGeometry: saveGeometry,
  Line2: Line2,
  Plan: Plan,
  Shell: Shell,
  BenchPlane: BenchPlane,
  BenchSaw: BenchSaw,
  DrillPress: DrillPress,
  HoleRouter: HoleRouter,
  LineRouter: LineRouter,
  ProfileRouter: ProfileRouter,
  Arc: Arc,
  Assembly: Assembly,
  Ball: Ball,
  Box: Box,
  Circle: Circle,
  Cone: Cone,
  Cube: Cube,
  Cylinder: Cylinder,
  Difference: Difference,
  Empty: Empty,
  Group: Group,
  Hershey: Hershey,
  Hexagon: Hexagon,
  Icosahedron: Icosahedron,
  Intersection: Intersection,
  Layers: Layers,
  Line: Line,
  Path: Path,
  Peg: Peg,
  Plane: Plane,
  Point: Point,
  Points: Points,
  Polygon: Polygon,
  Polyhedron: Polyhedron,
  Prism: Prism,
  Rod: Rod,
  Sphere: Sphere,
  Spiral: Spiral,
  Square: Square,
  Tetrahedron: Tetrahedron,
  Toolpath: Toolpath,
  Torus: Torus,
  Triangle: Triangle,
  Union: Union,
  Wave: Wave,
  Item: Item,
  Noise: Noise,
  Random: Random,
  acos: acos,
  cos: cos,
  ease: ease,
  max: max,
  min: min,
  numbers: numbers,
  sin: sin,
  sqrt: sqrt,
  vec: vec,
  readSvg: readSvg,
  readStl: readStl,
  foot: foot,
  inch: inch,
  mm: mm,
  mil: mil,
  cm: cm,
  m: m,
  thou: thou,
  yard: yard
});

const DYNAMIC_MODULES = new Map();

const registerDynamicModule = (bare, path) =>
  DYNAMIC_MODULES.set(bare, path);

const buildImportModule = (api) => async (name, { src } = {}) => {
  const internalModule = DYNAMIC_MODULES.get(name);
  if (internalModule !== undefined) {
    const module = await import(internalModule);
    return module;
  }
  let script;
  if (script === undefined) {
    const path = `source/${name}`;
    const sources = [];
    if (src) {
      sources.push(src);
    }
    sources.push(name);
    script = await read(path, { sources, decode: 'utf8' });
  }
  if (script === undefined) {
    throw Error(`Cannot import module ${name}`);
  }
  const ecmascript = await toEcmascript(script);
  const builder = new Function(
    `{ ${Object.keys(api).join(', ')} }`,
    `return async () => { ${ecmascript} };`
  );
  const module = await builder(api);
  const exports = await module();
  return exports;
};

const extendedApi = { ...api, toSvg };

const importModule = buildImportModule(extendedApi);

extendedApi.importModule = importModule;

// Register Dynamic libraries.

const module = (name) => `@jsxcad/api-v1-${name}`;

registerDynamicModule(module('armature'), './jsxcad-api-v1-armature.js');
registerDynamicModule(module('connector'), './jsxcad-api-v1-connector.js');
registerDynamicModule(module('cursor'), './jsxcad-api-v1-cursor.js');
registerDynamicModule(module('deform'), './jsxcad-api-v1-deform.js');
registerDynamicModule(module('dst'), './jsxcad-api-v1-dst.js');
registerDynamicModule(module('dxf'), './jsxcad-api-v1-dxf.js');
registerDynamicModule(module('extrude'), './jsxcad-api-v1-extrude.js');
registerDynamicModule(module('font'), './jsxcad-api-v1-font.js');
registerDynamicModule(module('gcode'), './jsxcad-api-v1-gcode.js');
registerDynamicModule(module('item'), './jsxcad-api-v1-item.js');
registerDynamicModule(module('layout'), './jsxcad-api-v1-layout.js');
registerDynamicModule(module('math'), './jsxcad-api-v1-math.js');
registerDynamicModule(module('pdf'), './jsxcad-api-v1-pdf.js');
registerDynamicModule(module('plan'), './jsxcad-api-v1-plan.js');
registerDynamicModule(module('plans'), './jsxcad-api-v1-plans.js');
registerDynamicModule(module('png'), './jsxcad-api-v1-png.js');
registerDynamicModule(module('shape'), './jsxcad-api-v1-shape.js');
registerDynamicModule(module('shapefile'), './jsxcad-api-v1-shapefile.js');
registerDynamicModule(module('shapes'), './jsxcad-api-v1-shapes.js');
registerDynamicModule(module('shell'), './jsxcad-api-v1-shell.js');
registerDynamicModule(module('stl'), './jsxcad-api-v1-stl.js');
registerDynamicModule(module('svg'), './jsxcad-api-v1-svg.js');
registerDynamicModule(module('threejs'), './jsxcad-api-v1-threejs.js');
registerDynamicModule(module('units'), './jsxcad-api-v1-units.js');

export { checkBox, importModule, md, numberBox, selectBox, sliderBox, source, stringBox, x, y, z };
