import { addSource, readFile, getSources } from './jsxcad-sys.js';
import { X, Y, Z } from './jsxcad-api-v1-connector.js';
export { X, Y, Z } from './jsxcad-api-v1-connector.js';
import { Shape, log } from './jsxcad-api-v1-shape.js';
export { Shape, log } from './jsxcad-api-v1-shape.js';
import { pack } from './jsxcad-api-v1-layout.js';
export { pack } from './jsxcad-api-v1-layout.js';
import { Circle, Cone, Cube, Cylinder, Hexagon, Icosahedron, Line, Point, Points, Polygon, Polyhedron, Prism, Sphere, Square, Tetrahedron, Torus, Triangle, Wave } from './jsxcad-api-v1-shapes.js';
export { Circle, Cone, Cube, Cylinder, Hexagon, Icosahedron, Line, Point, Points, Polygon, Polyhedron, Prism, Sphere, Square, Tetrahedron, Torus, Triangle, Wave } from './jsxcad-api-v1-shapes.js';
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
  Circle: Circle,
  Cone: Cone,
  Cube: Cube,
  Cylinder: Cylinder,
  Hexagon: Hexagon,
  Icosahedron: Icosahedron,
  Line: Line,
  Point: Point,
  Points: Points,
  Polygon: Polygon,
  Polyhedron: Polyhedron,
  Prism: Prism,
  Sphere: Sphere,
  Square: Square,
  Tetrahedron: Tetrahedron,
  Torus: Torus,
  Triangle: Triangle,
  Wave: Wave,
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

registerDynamicModule(module('armature'), module('armature'));
registerDynamicModule(module('connector'), module('connector'));
registerDynamicModule(module('cursor'), module('cursor'));
registerDynamicModule(module('dst'), module('dst'));
registerDynamicModule(module('dxf'), module('dxf'));
registerDynamicModule(module('extrude'), module('extrude'));
registerDynamicModule(module('font'), module('font'));
registerDynamicModule(module('gcode'), module('gcode'));
registerDynamicModule(module('gear'), module('gear'));
registerDynamicModule(module('item'), module('item'));
registerDynamicModule(module('jscad'), module('jscad'));
registerDynamicModule(module('layout'), module('layout'));
registerDynamicModule(module('lego'), module('lego'));
registerDynamicModule(module('math'), module('math'));
registerDynamicModule(module('motor'), module('motor'));
registerDynamicModule(module('pdf'), module('pdf'));
registerDynamicModule(module('plan'), module('plan'));
registerDynamicModule(module('plans'), module('plans'));
registerDynamicModule(module('png'), module('png'));
registerDynamicModule(module('shape'), module('shape'));
registerDynamicModule(module('shapefile'), module('shapefile'));
registerDynamicModule(module('shapes'), module('shapes'));
registerDynamicModule(module('shell'), module('shell'));
registerDynamicModule(module('stl'), module('stl'));
registerDynamicModule(module('svg'), module('svg'));
registerDynamicModule(module('thread'), module('thread'));
registerDynamicModule(module('threejs'), module('threejs'));
registerDynamicModule(module('units'), module('units'));

export { importModule, source };
