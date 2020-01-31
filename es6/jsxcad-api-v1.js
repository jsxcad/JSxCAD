import { X, Y, Z } from './jsxcad-api-v1-connector.js';
export { X, Y, Z } from './jsxcad-api-v1-connector.js';
import './jsxcad-api-v1-deform.js';
import './jsxcad-api-v1-extrude.js';
import { pack } from './jsxcad-api-v1-layout.js';
export { pack } from './jsxcad-api-v1-layout.js';
import './jsxcad-api-v1-shell.js';
import './jsxcad-api-v1-view.js';
import { addSource, readFile, getSources } from './jsxcad-sys.js';
import { Shape, log } from './jsxcad-api-v1-shape.js';
export { Shape, log } from './jsxcad-api-v1-shape.js';
import { Plan } from './jsxcad-api-v1-plan.js';
export { Plan } from './jsxcad-api-v1-plan.js';
import { Page } from './jsxcad-api-v1-plans.js';
export { Page } from './jsxcad-api-v1-plans.js';
import { Arc, Assembly, Circle, Cone, Cube, Cylinder, Empty, Hexagon, Icosahedron, Layers, Line, Path, Point, Points, Polygon, Polyhedron, Prism, Sphere, Spiral, Square, Tetrahedron, Torus, Triangle, Wave } from './jsxcad-api-v1-shapes.js';
export { Arc, Assembly, Circle, Cone, Cube, Cylinder, Empty, Hexagon, Icosahedron, Layers, Line, Path, Point, Points, Polygon, Polyhedron, Prism, Sphere, Spiral, Square, Tetrahedron, Torus, Triangle, Wave } from './jsxcad-api-v1-shapes.js';
import { Item } from './jsxcad-api-v1-item.js';
export { Item } from './jsxcad-api-v1-item.js';
import { WoodScrew } from './jsxcad-api-v1-items.js';
export { WoodScrew } from './jsxcad-api-v1-items.js';
import { acos, cos, ease, max, min, numbers, sin, sqrt, vec } from './jsxcad-api-v1-math.js';
export { acos, cos, ease, max, min, numbers, sin, sqrt, vec } from './jsxcad-api-v1-math.js';
import { foot, inch, mm, mil, cm, m, thou, yard } from './jsxcad-api-v1-units.js';
export { cm, foot, inch, m, mil, mm, thou, yard } from './jsxcad-api-v1-units.js';
import { toEcmascript } from './jsxcad-compiler.js';

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
  source: source,
  X: X,
  Y: Y,
  Z: Z,
  Shape: Shape,
  log: log,
  pack: pack,
  Plan: Plan,
  Page: Page,
  Arc: Arc,
  Assembly: Assembly,
  Circle: Circle,
  Cone: Cone,
  Cube: Cube,
  Cylinder: Cylinder,
  Empty: Empty,
  Hexagon: Hexagon,
  Icosahedron: Icosahedron,
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
  Wave: Wave,
  Item: Item,
  WoodScrew: WoodScrew,
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
  async (name) => {
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
      script = await readFile({ path, as: 'utf8', sources }, path);
    }
    const ecmascript = toEcmascript({}, script);
    const builder = new Function(`{ ${Object.keys(api).join(', ')} }`, ecmascript);
    const constructor = await builder(api);
    const module = await constructor();
    return module;
  };

// Bootstrap importModule.

const extendedApi = { ...api };

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

export { importModule, source };
