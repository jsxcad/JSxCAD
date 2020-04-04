import Shape, { Shape as Shape$1, log, make } from './jsxcad-api-v1-shape.js';
export { Shape, log, make } from './jsxcad-api-v1-shape.js';
import { emit, addSource, read, write, readFile, getSources } from './jsxcad-sys.js';
export { emit, read, write } from './jsxcad-sys.js';
import { ensurePages, Page } from './jsxcad-api-v1-plans.js';
export { Page } from './jsxcad-api-v1-plans.js';
import { getLeafs } from './jsxcad-geometry-tagged.js';
import './jsxcad-api-v1-deform.js';
import { pack } from './jsxcad-api-v1-layout.js';
export { pack } from './jsxcad-api-v1-layout.js';
import './jsxcad-api-v1-pdf.js';
import './jsxcad-api-v1-shell.js';
import './jsxcad-api-v1-svg.js';
import './jsxcad-api-v1-stl.js';
import { Connector, X, Y, Z } from './jsxcad-api-v1-connector.js';
export { Connector, X, Y, Z } from './jsxcad-api-v1-connector.js';
import { ChainedHull, Hull, Loop } from './jsxcad-api-v1-extrude.js';
export { ChainedHull, Hull, Loop } from './jsxcad-api-v1-extrude.js';
import { Line2 } from './jsxcad-api-v1-line2.js';
export { Line2 } from './jsxcad-api-v1-line2.js';
import { Plan } from './jsxcad-api-v1-plan.js';
export { Plan } from './jsxcad-api-v1-plan.js';
import { Arc, Assembly, Circle, Cone, Cube, Cylinder, Difference, Empty, Hexagon, Icosahedron, Intersection, Layers, Line, Path, Point, Points, Polygon, Polyhedron, Prism, Sphere, Spiral, Square, Tetrahedron, Torus, Triangle, Union, Void, Wave } from './jsxcad-api-v1-shapes.js';
export { Arc, Assembly, Circle, Cone, Cube, Cylinder, Difference, Empty, Hexagon, Icosahedron, Intersection, Layers, Line, Path, Point, Points, Polygon, Polyhedron, Prism, Sphere, Spiral, Square, Tetrahedron, Torus, Triangle, Union, Void, Wave } from './jsxcad-api-v1-shapes.js';
import { Item } from './jsxcad-api-v1-item.js';
export { Item } from './jsxcad-api-v1-item.js';
import { WoodScrew } from './jsxcad-api-v1-items.js';
export { WoodScrew } from './jsxcad-api-v1-items.js';
import { Random, acos, cos, ease, max, min, numbers, sin, sqrt, vec } from './jsxcad-api-v1-math.js';
export { Random, acos, cos, ease, max, min, numbers, sin, sqrt, vec } from './jsxcad-api-v1-math.js';
import { foot, inch, mm, mil, cm, m, thou, yard } from './jsxcad-api-v1-units.js';
export { cm, foot, inch, m, mil, mm, thou, yard } from './jsxcad-api-v1-units.js';
import { toEcmascript } from './jsxcad-compiler.js';
import { toSvg } from './jsxcad-convert-svg.js';

// FIX: We shouldn't need to supply a path to this.
const view = (shape, { width = 1024, height = 512, position = [100, -100, 100] } = {}) => {
  for (const entry of ensurePages(shape.toKeptGeometry())) {
    for (let leaf of getLeafs(entry.content)) {
      emit({ geometry: { width, height, position, geometry: leaf } });
    }
  }
  return shape;
};

Shape.prototype.view = function ({ width = 512, height = 256, position = [100, -100, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.smallView = function ({ width = 256, height = 128, position = [100, -100, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.bigView = function ({ width = 1024, height = 512, position = [100, -100, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.topView = function ({ width = 512, height = 256, position = [0, 0, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.smallTopView = function ({ width = 256, height = 128, position = [0, 0, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.bigTopView = function ({ width = 1024, height = 512, position = [0, 0, 100] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.frontView = function ({ width = 512, height = 256, position = [0, -100, 0] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.smallFrontView = function ({ width = 256, height = 128, position = [0, -100, 0] } = {}) {
  return view(this, { width, height, position });
};

Shape.prototype.bigFrontView = function ({ width = 1024, height = 512, position = [0, -100, 0] } = {}) {
  return view(this, { width, height, position });
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

var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  emit: emit,
  read: read,
  write: write,
  source: source,
  Connector: Connector,
  X: X,
  Y: Y,
  Z: Z,
  ChainedHull: ChainedHull,
  Hull: Hull,
  Loop: Loop,
  Shape: Shape$1,
  log: log,
  make: make,
  pack: pack,
  Line2: Line2,
  Plan: Plan,
  Page: Page,
  Arc: Arc,
  Assembly: Assembly,
  Circle: Circle,
  Cone: Cone,
  Cube: Cube,
  Cylinder: Cylinder,
  Difference: Difference,
  Empty: Empty,
  Hexagon: Hexagon,
  Icosahedron: Icosahedron,
  Intersection: Intersection,
  Layers: Layers,
  Line: Line,
  Path: Path,
  Point: Point,
  Points: Points,
  Polygon: Polygon,
  Polyhedron: Polyhedron,
  Prism: Prism,
  Sphere: Sphere,
  Spiral: Spiral,
  Square: Square,
  Tetrahedron: Tetrahedron,
  Torus: Torus,
  Triangle: Triangle,
  Union: Union,
  Void: Void,
  Wave: Wave,
  Item: Item,
  WoodScrew: WoodScrew,
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

const registerDynamicModule = (bare, path) => DYNAMIC_MODULES.set(bare, path);

const buildImportModule = (api) =>
  async (name, { src } = {}) => {
    const internalModule = DYNAMIC_MODULES.get(name);
    if (internalModule !== undefined) {
      const module = await import(internalModule);
      return module;
    }
    let script;
    if (script === undefined) {
      const path = `source/${name}`;
      script = await readFile({ path, as: 'utf8' }, path);
    }
    if (script === undefined) {
      const path = `cache/${name}`;
      const sources = getSources(path);
      if (src) {
        sources.push(src);
      }
      script = await readFile({ path, as: 'utf8', sources }, path);
    }
    const ecmascript = await toEcmascript(script);
    const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, `return async () => { ${ecmascript} };`);
    const module = await builder(api);
    exports = await module();
    return exports;
  };

const md = (strings, ...placeholders) => {
  const md = strings.reduce((result, string, i) => (result + placeholders[i - 1] + string));
  emit({ md });
  return md;
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
registerDynamicModule(module('gear'), './jsxcad-api-v1-gear.js');
registerDynamicModule(module('item'), './jsxcad-api-v1-item.js');
registerDynamicModule(module('jscad'), './jsxcad-api-v1-jscad.js');
registerDynamicModule(module('layout'), './jsxcad-api-v1-layout.js');
registerDynamicModule(module('lego'), './jsxcad-api-v1-lego.js');
registerDynamicModule(module('math'), './jsxcad-api-v1-math.js');
registerDynamicModule(module('motor'), './jsxcad-api-v1-motor.js');
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
registerDynamicModule(module('thread'), './jsxcad-api-v1-thread.js');
registerDynamicModule(module('threejs'), './jsxcad-api-v1-threejs.js');
registerDynamicModule(module('units'), './jsxcad-api-v1-units.js');

export { importModule, md, source };
