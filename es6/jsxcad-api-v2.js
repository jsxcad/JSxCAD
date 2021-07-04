import Shape$2, { Shape as Shape$1, ensurePages } from './jsxcad-api-v2.js';
import { getModule, generateUniqueId, addPending, write, emit, getControlValue, hash, addOnEmitHandler, read, log as log$1, elapsed, info, pushModule, popModule } from './jsxcad-sys.js';
export { elapsed, emit, info, read, write } from './jsxcad-sys.js';
import './jsxcad-api-v1-extrude.js';
import './jsxcad-api-v1-gcode.js';
import './jsxcad-api-v1-pdf.js';
import './jsxcad-api-v1-tools.js';
import { add as add$1, dot, subtract, scale as scale$1, distance, negate } from './jsxcad-math-vec3.js';
import { fromPoints as fromPoints$2, toXYPlaneTransforms } from './jsxcad-math-plane.js';
import { closePath, concatenatePath, assemble as assemble$1, eachPoint, flip, toConcreteGeometry, toDisplayGeometry, toTransformedGeometry, toPoints, transform, rewriteTags, taggedPaths, taggedGraph, openPath, taggedPoints, fromPolygonsToGraph, registerReifier, getPeg, union, taggedGroup, bend as bend$1, intersection, allTags, fromPointsToGraph, difference, rewrite, extrude as extrude$1, extrudeToPlane as extrudeToPlane$1, fill as fill$1, empty, grow as grow$1, outline as outline$1, inset as inset$1, read as read$1, loft as loft$1, realize, minkowskiDifference as minkowskiDifference$1, minkowskiShell as minkowskiShell$1, minkowskiSum as minkowskiSum$1, isVoid, offset as offset$1, getLeafs, taggedItem, toDisjointGeometry, projectToPlane as projectToPlane$1, push as push$1, remesh as remesh$1, write as write$1, section as section$1, smooth as smooth$1, measureBoundingBox, taggedSketch, split as split$1, test as test$1, twist as twist$1, toPolygonsWithHoles, arrangePolygonsWithHoles, fromPolygonsWithHolesToTriangles, fromTrianglesToGraph, alphaShape, taggedPlan, rotateZPath, convexHullToGraph, translatePaths, fromFunctionToGraph, taggedLayout, visit, isNotVoid, fromPathsToGraph, translatePath } from './jsxcad-geometry.js';
import { identityMatrix, fromTranslation, fromRotation, fromScaling } from './jsxcad-math-mat4.js';
import { toTagsFromName } from './jsxcad-algorithm-color.js';
import { toTagsFromName as toTagsFromName$1 } from './jsxcad-algorithm-material.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';
import { fromRotateXToTransform, fromRotateYToTransform, fromRotateZToTransform } from './jsxcad-algorithm-cgal.js';
import { toTagsFromName as toTagsFromName$2 } from './jsxcad-algorithm-tool.js';
import Shape$4, { Shape as Shape$3 } from './jsxcad-api-v1-shape.js';
import { zag, numbers, Noise, Random, acos, cos, each, ease, max, min, sin, sqrt, vec } from './jsxcad-api-v1-math.js';
export { Noise, Random, acos, cos, each, ease, max, min, numbers, sin, sqrt, vec, zag } from './jsxcad-api-v1-math.js';
import { fromPoints as fromPoints$3 } from './jsxcad-math-poly3.js';
import { readSvg } from './jsxcad-api-v1-svg.js';
export { readSvg } from './jsxcad-api-v1-svg.js';
import { readStl } from './jsxcad-api-v1-stl.js';
export { readStl } from './jsxcad-api-v1-stl.js';
import { readObj } from './jsxcad-api-v1-obj.js';
export { readObj } from './jsxcad-api-v1-obj.js';
import { readOff } from './jsxcad-api-v1-off.js';
export { readOff } from './jsxcad-api-v1-off.js';
import { foot, inch, mm, mil, cm, m, thou, yard } from './jsxcad-api-v1-units.js';
export { cm, foot, inch, m, mil, mm, thou, yard } from './jsxcad-api-v1-units.js';
import { toEcmascript } from './jsxcad-compiler.js';
import { toSvg } from './jsxcad-convert-svg.js';

// FIX: Avoid the extra read-write cycle.
const view = (
  shape,
  {
    size,
    skin = true,
    outline = true,
    wireframe = false,
    prepareView = (x) => x,
    inline,
    width = 1024,
    height = 512,
    position = [100, -100, 100],
    withAxes = false,
    withGrid = false,
  } = {}
) => {
  if (size !== undefined) {
    width = size;
    height = size / 2;
  }
  const viewShape = prepareView(shape);
  for (const entry of ensurePages(
    viewShape.toDisplayGeometry({ skin, outline, wireframe })
  )) {
    const path = `view/${getModule()}/${generateUniqueId()}`;
    addPending(write(path, entry));
    const view = { width, height, position, inline, withAxes, withGrid };
    emit({ hash: generateUniqueId(), path, view });
  }
  return shape;
};

Shape$1.prototype.view = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [100, -100, 100],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape$1.prototype.topView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [0, 0, 100],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape$1.prototype.gridView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [0, 0, 100],
  withAxes,
  withGrid = true,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape$1.prototype.frontView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [0, -100, 0],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

Shape$1.prototype.sideView = function ({
  size = 512,
  skin = true,
  outline = true,
  wireframe = false,
  prepareView,
  path,
  width = 1024,
  height = 512,
  position = [100, 0, 0],
  withAxes,
  withGrid,
} = {}) {
  return view(this, {
    size,
    skin,
    outline,
    wireframe,
    prepareView,
    path,
    width,
    height,
    position,
    withAxes,
    withGrid,
  });
};

class Shape {
  close() {
    const geometry = this.toConcreteGeometry();
    if (!isSingleOpenPath(geometry)) {
      throw Error('Close requires a single open path.');
    }
    return Shape.fromClosedPath(closePath(geometry.paths[0]));
  }

  concat(...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toConcreteGeometry();
      if (!isSingleOpenPath(geometry)) {
        throw Error(
          `Concatenation requires single open paths: ${JSON.stringify(
            geometry
          )}`
        );
      }
      paths.push(geometry.paths[0]);
    }
    return Shape.fromOpenPath(concatenatePath(...paths));
  }

  constructor(geometry = assemble$1(), context) {
    if (geometry.geometry) {
      throw Error('die: { geometry: ... } is not valid geometry.');
    }
    this.geometry = geometry;
    this.context = context;
  }

  eachPoint(operation) {
    eachPoint(operation, this.toConcreteGeometry());
  }

  flip() {
    return fromGeometry(flip(toConcreteGeometry(this)), this.context);
  }

  toDisplayGeometry(options) {
    return toDisplayGeometry(toGeometry(this), options);
  }

  toKeptGeometry(options = {}) {
    return this.toConcreteGeometry();
  }

  toConcreteGeometry(options = {}) {
    return toConcreteGeometry(toGeometry(this));
  }

  toDisjointGeometry(options = {}) {
    return toConcreteGeometry(toGeometry(this));
  }

  toTransformedGeometry(options = {}) {
    return toTransformedGeometry(toGeometry(this));
  }

  getContext(symbol) {
    return this.context[symbol];
  }

  toGeometry() {
    return this.geometry;
  }

  toPoints() {
    return toPoints(this.toConcreteGeometry()).points;
  }

  points() {
    return Shape.fromGeometry(toPoints(this.toTransformedGeometry()));
  }

  transform(matrix) {
    if (matrix === identityMatrix) {
      return this;
    } else {
      return fromGeometry(transform(matrix, this.toGeometry()), this.context);
    }
  }

  // Low level setter for reifiers.
  getTags() {
    return this.toGeometry().tags || [];
  }

  setTags(tags = []) {
    return Shape.fromGeometry(rewriteTags(tags, [], this.toGeometry()));
  }
}

const isSingleOpenPath = ({ paths }) =>
  paths !== undefined && paths.length === 1 && paths[0][0] === null;

Shape.method = {};

const registerShapeMethod = (name, op) => {
  /*
  // FIX: See if we can switch these to dispatching via define?
  if (Shape.prototype.hasOwnProperty(name)) {
    throw Error(`Method ${name} is already in use.`);
  }
*/
  // Make the operation constructor available e.g., Shape.grow(1)(s)
  Shape[name] = op;
  // Make the operation application available e.g., s.grow(1)
  const { [name]: method } = {
    [name]: function (...args) {
      return op(...args)(this);
    },
  };
  Shape.prototype[name] = method;
  return method;
};

const shapeMethod = (build) => {
  return function (...args) {
    return this.peg(build(...args));
  };
};

Shape.shapeMethod = shapeMethod;

Shape.fromClosedPath = (path, context) =>
  fromGeometry(taggedPaths({}, [closePath(path)]), context);
Shape.fromGeometry = (geometry, context) => new Shape(geometry, context);
Shape.fromGraph = (graph, context) =>
  new Shape(taggedGraph({}, graph), context);
Shape.fromOpenPath = (path, context) =>
  fromGeometry(taggedPaths({}, [openPath(path)]), context);
Shape.fromPath = (path, context) =>
  fromGeometry(taggedPaths({}, [path]), context);
Shape.fromPaths = (paths, context) =>
  fromGeometry(taggedPaths({}, paths), context);
Shape.fromPoint = (point, context) =>
  fromGeometry(taggedPoints({}, [point]), context);
Shape.fromPoints = (points, context) =>
  fromGeometry(taggedPoints({}, points), context);
Shape.fromPolygons = (polygons, context) =>
  fromGeometry(fromPolygonsToGraph({}, polygons), context);
Shape.registerMethod = registerShapeMethod;
// Let's consider 'method' instead of 'registerMethod'.
Shape.method = registerShapeMethod;
Shape.reifier = (name, op) => registerReifier(name, op);

const fromGeometry = Shape.fromGeometry;
const toGeometry = (shape) => shape.toGeometry();

const normalizeCoords = ([
  x = 0,
  y = 0,
  z = 0,
  fX = 0,
  fY = 1,
  fZ = 0,
  rX = 1,
  rY = 0,
  rZ = 0,
]) => [x, y, z, fX, fY, fZ, rX, rY, rZ];

const getPegCoords = (shape) => {
  const coords =
    shape.constructor === Shape
      ? getPeg(shape.toTransformedGeometry())
      : normalizeCoords(shape);
  const origin = coords.slice(0, 3);
  const forward = coords.slice(3, 6);
  const right = coords.slice(6, 9);
  // const plane = fromPoints(right, forward, origin);
  const plane = fromPoints$2(origin, forward, right);

  return { coords, origin, forward, right, plane };
};

// See also:
// https://gist.github.com/kevinmoran/b45980723e53edeb8a5a43c49f134724

const orient = (origin, forward, right, shapeToPeg) => {
  console.log(`QQ/orient`);
  console.log(`QQ/right: ${JSON.stringify(right)}`);
  console.log(`QQ/forward: ${JSON.stringify(forward)}`);
  console.log(`QQ/origin: ${JSON.stringify(origin)}`);
  // const plane = fromPoints(right, forward, origin);
  const plane = fromPoints$2(origin, forward, right);
  console.log(`QQ/orient/plane: ${JSON.stringify(plane)}`);
  const d = Math.abs(dot(plane, [0, 0, 1, 0]));
  if (d >= 0.99999) {
    return shapeToPeg.move(...origin);
  }
  const rightDirection = subtract(right, origin);
  console.log(`QQ/orient/rightDirection: ${JSON.stringify(rightDirection)}`);
  const [, from] = toXYPlaneTransforms(plane, rightDirection);
  console.log(`QQ/orient/from: ${JSON.stringify(from)}`);
  return shapeToPeg.transform(from).move(...origin);
};

const peg = (shapeToPeg) => (shape) => {
  const { origin, right, forward } = getPegCoords(shape);
  return orient(origin, right, forward, shapeToPeg);
};

Shape.registerMethod('peg', peg);

const put = (pegShape) => (shape) => peg(shape)(pegShape);

Shape.registerMethod('put', put);

const X$4 = 0;
const Y$4 = 1;
const Z$5 = 2;

const Peg = (
  name,
  origin = [0, 0, 0],
  forward = [0, 1, 0],
  right = [1, 0, 0]
) => {
  const o = origin;
  const f = add$1(origin, forward);
  const r = add$1(origin, right);
  const tags = ['peg'];
  if (name) {
    tags.push(`peg/${name}`);
  }
  return Shape.fromGeometry(
    taggedPoints({ tags }, [
      [o[X$4], o[Y$4], o[Z$5], f[X$4], f[Y$4], f[Z$5], r[X$4], r[Y$4], r[Z$5]],
    ])
  );
};

Shape.prototype.Peg = Shape.shapeMethod(Peg);

function pad (hash, len) {
  while (hash.length < len) {
    hash = '0' + hash;
  }
  return hash;
}

function fold (hash, text) {
  var i;
  var chr;
  var len;
  if (text.length === 0) {
    return hash;
  }
  for (i = 0, len = text.length; i < len; i++) {
    chr = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0;
  }
  return hash < 0 ? hash * -2 : hash;
}

function foldObject (hash, o, seen) {
  return Object.keys(o).sort().reduce(foldKey, hash);
  function foldKey (hash, key) {
    return foldValue(hash, o[key], key, seen);
  }
}

function foldValue (input, value, key, seen) {
  var hash = fold(fold(fold(input, key), toString(value)), typeof value);
  if (value === null) {
    return fold(hash, 'null');
  }
  if (value === undefined) {
    return fold(hash, 'undefined');
  }
  if (typeof value === 'object' || typeof value === 'function') {
    if (seen.indexOf(value) !== -1) {
      return fold(hash, '[Circular]' + key);
    }
    seen.push(value);

    var objHash = foldObject(hash, value, seen);

    if (!('valueOf' in value) || typeof value.valueOf !== 'function') {
      return objHash;
    }

    try {
      return fold(objHash, String(value.valueOf()))
    } catch (err) {
      return fold(objHash, '[valueOf exception]' + (err.stack || err.message))
    }
  }
  return fold(hash, value.toString());
}

function toString (o) {
  return Object.prototype.toString.call(o);
}

function sum (o) {
  return pad(foldValue(0, o, '', []).toString(16), 8);
}

var hashSum = sum;

const define = (tag, data) => {
  const define = { tag, data };
  emit({ define, hash: hashSum(define) });
  return data;
};

const defRgbColor = (name, rgb) => define(`color/${name}`, { rgb });

const defThreejsMaterial = (name, definition) =>
  define(`material/${name}`, { threejsMaterial: definition });

const defTool = (name, definition) => define(`tool/${name}`, definition);

const defGrblSpindle = (
  name,
  { cutDepth = 0.2, rpm, feedRate, drillRate, diameter, jumpZ = 1 } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'spindle',
      cutDepth,
      cutSpeed: rpm,
      feedRate,
      drillRate,
      diameter,
      jumpZ,
    },
  });

const defGrblDynamicLaser = (
  name,
  {
    cutDepth = 0.2,
    diameter = 0.09,
    jumpPower = 0,
    power = 1000,
    speed = 1000,
    warmupDuration,
    warmupPower = 0,
  } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'dynamicLaser',
      cutDepth,
      cutSpeed: -power,
      diameter,
      jumpRate: speed,
      jumpSpeed: -jumpPower,
      feedRate: speed,
      warmupDuration,
      warmupSpeed: -warmupPower,
    },
  });

const defGrblConstantLaser = (
  name,
  {
    cutDepth = 0.2,
    diameter = 0.09,
    jumpPower,
    power = 1000,
    speed = 1000,
    warmupDuration,
    warmupPower = 0,
  } = {}
) =>
  defTool(name, {
    grbl: {
      type: 'constantLaser',
      cutDepth,
      cutSpeed: power,
      diameter,
      jumpRate: speed,
      jumpSpeed: jumpPower,
      feedRate: speed,
      warmupDuration,
      warmupSpeed: warmupPower,
    },
  });

const defGrblPlotter = (name, { feedRate = 1000 } = {}) =>
  defTool(name, { grbl: { type: 'plotter', feedRate, cutSpeed: 1 } });

const md = (strings, ...placeholders) => {
  const md = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ md, hash: hashSum(md) });
  return md;
};

const mdMethod = function (string, ...placeholders) {
  if (string instanceof Function) {
    string = string(this);
  }
  md([string], ...placeholders);
  return this;
};

Shape.prototype.md = mdMethod;

/*
  Options
  slider: { min, max, step }
  select: { options }
*/

const control = (label, value, type, options) => {
  const control = {
    type,
    label,
    value: getControlValue(getModule(), label, value),
    options,
    path: getModule(),
  };
  const hash = hashSum(control);
  emit({ control, hash });
  return value;
};

let notes;

let recording = false;
let handler;

const recordNote = (note, index) => {
  if (recording) {
    notes.push({ note, index });
  }
};

const beginRecordingNotes = (path, id, sourceLocation) => {
  const setContext = { recording: { path, id } };
  emit({ hash: hash(setContext), setContext });

  if (handler === undefined) {
    handler = addOnEmitHandler(recordNote);
  }
  recording = true;
  notes = [];
};

const saveRecordedNotes = (path, id) => {
  let notesToSave = notes;
  notes = undefined;
  recording = false;
  addPending(write(`data/note/${path}/${id}`, notesToSave));
};

const replayRecordedNotes = async (path, id) => {
  const setContext = { recording: { path, id } };
  emit({ hash: hash(setContext), setContext });

  const notes = await read(`data/note/${path}/${id}`);

  if (notes === undefined) {
    return;
  }
  if (notes.length === 0) {
    return;
  }
  for (const { note } of notes) {
    emit(note);
  }
};

const emitSourceLocation = ({ line, column }) => {
  const setContext = { sourceLocation: { line, column } };
  emit({ hash: hash(setContext), setContext });
};

const add =
  (shape, ...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      union(shape.toGeometry(), ...shapes.map((shape) => shape.toGeometry()))
    );

Shape.registerMethod('add', add);

const and =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      taggedGroup(
        {},
        shape.toGeometry(),
        ...shapes.map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('and', and);

const addTo = (other) => (shape) => add(other, shape);
Shape.registerMethod('addTo', addTo);

const X$3 = 0;
const Y$3 = 1;
const Z$4 = 2;

const align =
  (spec = 'xyz', origin = [0, 0, 0]) =>
  (shape) =>
    shape.size(({ max, min, center }, shape) => {
      const offset = [0, 0, 0];

      let index = 0;
      while (index < spec.length) {
        switch (spec[index++]) {
          case 'x': {
            switch (spec[index]) {
              case '>':
                offset[X$3] = -min[X$3];
                index += 1;
                break;
              case '<':
                offset[X$3] = -max[X$3];
                index += 1;
                break;
              default:
                offset[X$3] = -center[X$3];
            }
            break;
          }
          case 'y': {
            switch (spec[index]) {
              case '>':
                offset[Y$3] = -min[Y$3];
                index += 1;
                break;
              case '<':
                offset[Y$3] = -max[Y$3];
                index += 1;
                break;
              default:
                offset[Y$3] = -center[Y$3];
            }
            break;
          }
          case 'z': {
            switch (spec[index]) {
              case '>':
                offset[Z$4] = -min[Z$4];
                index += 1;
                break;
              case '<':
                offset[Z$4] = -max[Z$4];
                index += 1;
                break;
              default:
                offset[Z$4] = -center[Z$4];
            }
            break;
          }
        }
      }
      const moved = shape.move(...add$1(offset, origin));
      return moved;
    });

Shape.registerMethod('align', align);

const as =
  (...tags) =>
  (shape) =>
    Shape.fromGeometry(
      rewriteTags(
        tags.map((tag) => `user/${tag}`),
        [],
        shape.toGeometry()
      )
    );

Shape.registerMethod('as', as);

const bend =
  (degreesPerMm = 1) =>
  (shape) =>
    Shape.fromGeometry(bend$1(shape.toGeometry(), degreesPerMm));

Shape.registerMethod('bend', bend);

const clip =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      intersection(
        shape.toGeometry(),
        ...shapes.map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('clip', clip);

const clipFrom = (other) => (shape) => clip(other, shape);
Shape.registerMethod('clipFrom', clipFrom);

const fromName$1 = (shape, name) =>
  Shape.fromGeometry(rewriteTags(toTagsFromName(name), [], shape.toGeometry()));

// FIX: Have color remove all other color tags.
const color =
  (...args) =>
  (shape) =>
    fromName$1(shape, ...args);

Shape.registerMethod('color', color);

const colors =
  (op = (colors, shape) => colors) =>
  (shape) =>
    op(
      [...allTags(shape.toGeometry())]
        .filter((tag) => tag.startsWith('color/'))
        .map((tag) => tag.substring(6)),
      shape
    );

Shape.registerMethod('colors', colors);

const cloudSolid = () => (shape) => {
  const points = shape.toPoints();
  return Shape$1.fromGeometry(taggedGraph({}, fromPointsToGraph(points)));
};

Shape$1.registerMethod('cloudSolid', cloudSolid);

const withCloudSolid = () => (shape) => shape.with(cloudSolid());

Shape$1.registerMethod('withCloudSolid', withCloudSolid);

const cut =
  (...shapes) =>
  (shape) =>
    Shape.fromGeometry(
      difference(
        shape.toGeometry(),
        ...shapes.map((shape) => shape.toGeometry())
      )
    );

Shape.registerMethod('cut', cut);

// a.cut(b) === b.cutFrom(a)

const cutFrom = (other) => (shape) => cut(other, shape);
Shape.registerMethod('cutFrom', cutFrom);

const selectToKeep = (matchTags, geometryTags) => {
  if (geometryTags === undefined) {
    return false;
  }
  for (const geometryTag of geometryTags) {
    if (matchTags.includes(geometryTag)) {
      return true;
    }
  }
  return false;
};

const selectToDrop = (matchTags, geometryTags) =>
  !selectToKeep(matchTags, geometryTags);

const keepOrDrop = (shape, tags, select) => {
  const matchTags = tags.map((tag) => `user/${tag}`);

  const op = (geometry, descend) => {
    // FIX: Need a more reliable way to detect leaf structure.
    switch (geometry.type) {
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'layout': {
        return descend();
      }
      case 'item':
      // falls through to deal with item as a leaf.
      default: {
        if (select(matchTags, geometry.tags)) {
          return descend();
        } else {
          // Operate on the shape.
          const shape = Shape.fromGeometry(geometry);
          // Note that this transform does not violate geometry disjunction.
          const dropped = shape.void().toGeometry();
          return dropped;
        }
      }
    }
  };

  const rewritten = rewrite(shape.toKeptGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

const keep =
  (...tags) =>
  (shape) => {
    if (tags === undefined) {
      // Dropping no tags is an unconditional keep.
      return keepOrDrop(shape, [], selectToDrop);
    } else {
      return keepOrDrop(shape, tags, selectToKeep);
    }
  };

Shape.registerMethod('keep', keep);

const drop =
  (...tags) =>
  (shape) => {
    if (tags === undefined) {
      // Keeping no tags is an unconditional drop.
      return keepOrDrop(shape, [], selectToKeep);
    } else {
      return keepOrDrop(shape, tags, selectToDrop);
    }
  };

Shape.registerMethod('drop', drop);

const extrude =
  (...heights) =>
  (shape) => {
    if (heights.length % 2 === 1) {
      heights.push(0);
    }
    heights.sort((a, b) => a - b);
    const extrusions = [];
    while (heights.length > 0) {
      const height = heights.pop();
      const depth = heights.pop();
      if (height === depth) {
        // Return unextruded geometry at this height, instead.
        extrusions.push(shape.z(height));
        continue;
      }
      extrusions.push(
        Shape.fromGeometry(extrude$1(shape.toGeometry(), height, depth))
      );
    }
    return Shape.Group(...extrusions);
  };

const ex = extrude;

Shape.registerMethod('extrude', extrude);
Shape.registerMethod('ex', extrude);

const extrudeToPlane =
  (
    highPlane = [0, 0, 1, 1],
    lowPlane = [0, 0, 1, -1],
    direction = [0, 0, 1, 0]
  ) =>
  (shape) =>
    Shape.fromGeometry(
      extrudeToPlane$1(
        shape.toGeometry(),
        highPlane,
        lowPlane,
        direction
      )
    );

Shape.registerMethod('extrudeToPlane', extrudeToPlane);

const fill = () => (shape) =>
  Shape.fromGeometry(fill$1(shape.toGeometry()));

Shape.registerMethod('fill', fill);

const withFill = () => (shape) => shape.group(shape.fill());
Shape.registerMethod('withFill', withFill);

const fuse = () => (shape) => {
  const geometry = shape.toGeometry();
  return fromGeometry(union(empty({ tags: geometry.tags }), geometry));
};
Shape.registerMethod('fuse', fuse);

const grow = (amount) => (shape) =>
  Shape.fromGeometry(grow$1(shape.toGeometry(), amount));

Shape.registerMethod('grow', grow);

const isDefined$1 = (value) => value;

const Group = (...shapes) =>
  Shape.fromGeometry(
    taggedGroup(
      {},
      ...shapes.filter(isDefined$1).map((shape) => shape.toGeometry())
    )
  );

Shape.prototype.Group = Shape.shapeMethod(Group);
Shape.Group = Group;

const outline = () => (shape) =>
  Group(
    ...outline$1(shape.toGeometry()).map((outline) =>
      Shape.fromGeometry(outline)
    )
  );

Shape.registerMethod('outline', outline);

const withOutline =
  (op = (x) => x) =>
  (shape) =>
    shape.and(op(outline()));

Shape.registerMethod('withOutline', withOutline);

const inline = () => (shape) => outline(shape.flip());

Shape$2.registerMethod('inline', inline);

const withInline = () => (shape) => shape.with(inline());

Shape$2.registerMethod('withInline', withInline);

const inset =
  (initial = 1, step, limit) =>
  (shape) =>
    Shape.fromGeometry(inset$1(shape.toGeometry(), initial, step, limit));

// CHECK: Using 'with' for may be confusing, but andInset looks odd.
const withInset = (initial, step, limit) => (shape) =>
  shape.and(shape.inset(initial, step, limit));

Shape.registerMethod('inset', inset);
Shape.registerMethod('withInset', withInset);

const fromUndefined = () => Shape.fromGeometry();

const loadGeometry = async (
  path,
  { otherwise = fromUndefined } = {}
) => {
  const data = await read$1(path);
  if (data === undefined) {
    return otherwise();
  } else {
    return Shape.fromGeometry(data);
  }
};

const loft =
  (...ops) =>
  (shape) =>
    Shape.fromGeometry(
      loft$1(
        /* closed= */ false,
        ...ops.map((op) => op(shape).toGeometry())
      )
    );

Shape.registerMethod('loft', loft);

const loop$1 =
  (...ops) =>
  (shape) =>
    Shape.fromGeometry(
      loft$1(
        /* closed= */ true,
        ...ops.map((op) => op(shape).toGeometry())
      )
    );

Shape.registerMethod('loop', loop$1);

/**
 *
 * # Log
 *
 * Writes a string to the console.
 *
 * ```
 * log("Hello, World")
 * ```
 *
 **/

const toText = (value) => {
  if (typeof value === 'object') {
    return JSON.stringify(value);
  } else {
    return String(value);
  }
};

const log = (value, level) => {
  const text = toText(value);
  const log = { text, level };
  const hash = hashSum(log);
  emit({ log, hash });
  return log$1({ op: 'text', text, level });
};

const logOp = (shape, op) => {
  const text = String(op(shape));
  const level = 'serious';
  const log = { text, level };
  const hash = hashSum(log);
  emit({ log, hash });
  return log$1({ op: 'text', text });
};

const logMethod = function (op = (shape) => JSON.stringify(shape)) {
  logOp(Shape.fromGeometry(realize(this.toGeometry())), op);
  return this;
};
Shape.prototype.log = logMethod;

const loop =
  (...ops) =>
  (shape) =>
    Shape.fromGeometry(
      loft$1(
        /* closed= */ true,
        ...ops.map((op) => op(shape).toGeometry())
      )
    );

Shape.registerMethod('loop', loop);

const material = (name) => (shape) =>
  Shape.fromGeometry(rewriteTags(toTagsFromName$1(name), [], shape.toGeometry()));

Shape.registerMethod('material', material);

const minkowskiDifference = (offset) => (shape) =>
  Shape.fromGeometry(
    minkowskiDifference$1(shape.toGeometry(), offset.toGeometry())
  );

Shape.registerMethod('minkowskiDifference', minkowskiDifference);

const minkowskiShell = (offset) => (shape) =>
  Shape.fromGeometry(
    minkowskiShell$1(shape.toGeometry(), offset.toGeometry())
  );

Shape.registerMethod('minkowskiShell', minkowskiShell);

const minkowskiSum = (offset) => (shape) =>
  Shape.fromGeometry(
    minkowskiSum$1(shape.toGeometry(), offset.toGeometry())
  );

Shape.registerMethod('minkowskiSum', minkowskiSum);

const move =
  (x = 0, y = 0, z = 0) =>
  (shape) => {
    if (!isFinite(x)) {
      x = 0;
    }
    if (!isFinite(y)) {
      y = 0;
    }
    if (!isFinite(z)) {
      z = 0;
    }
    return shape.transform(fromTranslation([x, y, z]));
  };

Shape.registerMethod('move', move);

const noVoid = (tags, select) => (shape) => {
  const op = (geometry, descend) => {
    if (isVoid(geometry)) {
      return taggedGroup({});
    } else {
      return descend();
    }
  };

  const rewritten = rewrite(shape.toDisjointGeometry(), op);
  return Shape.fromGeometry(rewritten);
};

Shape.registerMethod('noVoid', noVoid);

const notAs =
  (...tags) =>
  (shape) =>
    Shape.fromGeometry(
      rewriteTags(
        [],
        tags.map((tag) => `user/${tag}`),
        shape.toGeometry()
      )
    );

Shape.registerMethod('notAs', notAs);

const offset =
  (initial = 1, step, limit) =>
  (shape) =>
    Shape.fromGeometry(
      offset$1(shape.toGeometry(), initial, step, limit)
    );

Shape.registerMethod('offset', offset);

const op = (fn) => (shape) => fn(shape);

const withOp = (fn) => (shape) => shape.with(fn(shape));

Shape.registerMethod('op', op);
Shape.registerMethod('withOp', withOp);

const pack =
  ({
    size,
    pageMargin = 5,
    itemMargin = 1,
    perLayout = Infinity,
    packSize = [],
  } = {}) =>
  (shape) => {
    if (perLayout === 0) {
      // Packing was disabled -- do nothing.
      return shape;
    }

    let todo = [];
    for (const leaf of getLeafs(shape.toKeptGeometry())) {
      todo.push(leaf);
    }
    const packedLayers = [];
    while (todo.length > 0) {
      const input = [];
      while (todo.length > 0 && input.length < perLayout) {
        input.push(todo.shift());
      }
      const [packed, unpacked, minPoint, maxPoint] = pack$1(
        { size, pageMargin, itemMargin },
        ...input
      );
      packSize[0] = minPoint;
      packSize[1] = maxPoint;
      if (packed.length === 0) {
        break;
      } else {
        packedLayers.push(
          taggedItem({}, taggedGroup({}, ...packed.map(toDisjointGeometry)))
        );
      }
      todo.unshift(...unpacked);
    }
    let packedShape = Shape.fromGeometry(taggedGroup({}, ...packedLayers));
    if (size === undefined) {
      packedShape = packedShape.align('xy');
    }
    return packedShape;
  };

Shape.registerMethod('pack', pack);

const projectToPlane =
  (plane = [0, 0, 1, 1], direction = [0, 0, 1, 0]) =>
  (shape) =>
    Shape.fromGeometry(
      projectToPlane$1(shape.toGeometry(), plane, direction)
    );

Shape.registerMethod('projectToPlane', projectToPlane);

const push =
  (force = 0.1, minimumDistance = 1, maximumDistance = 10) =>
  (shape) =>
    Shape.fromGeometry(
      push$1(shape.toGeometry(), {
        force,
        minimumDistance,
        maximumDistance,
      })
    );

Shape.registerMethod('push', push);

const remesh =
  (...lengths) =>
  (shape) =>
    Shape.fromGeometry(remesh$1(shape.toGeometry(), { lengths }));

Shape.registerMethod('remesh', remesh);

const rotate =
  (angle = 0, axis = [0, 0, 1]) =>
  (shape) =>
    shape.transform(fromRotation(angle * 0.017453292519943295, axis));

Shape.registerMethod('rotate', rotate);

// rx is in terms of turns -- 1/2 is a half turn.
const rx$1 =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateXToTransform(angle * 360))
      )
    );

Shape.registerMethod('rx', rx$1);

// ry is in terms of turns -- 1/2 is a half turn.
const ry$1 =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateYToTransform(angle * 360))
      )
    );

Shape.registerMethod('ry', ry$1);

// rz is in terms of turns -- 1/2 is a half turn.
const rz$1 =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateZToTransform(angle * 360))
      )
    );

Shape.registerMethod('rz', rz$1);

const rotateX =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) => shape.transform(fromRotateXToTransform(angle)))
    );

// rx is in terms of turns -- 1/2 is a half turn.
const rx =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateXToTransform(angle * 360))
      )
    );

Shape.registerMethod('rotateX', rotateX);
Shape.registerMethod('rx', rx);

const rotateY =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) => shape.transform(fromRotateYToTransform(angle)))
    );

// ry is in terms of turns -- 1/2 is a half turn.
const ry =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateYToTransform(angle * 360))
      )
    );

Shape.registerMethod('rotateY', rotateY);
Shape.registerMethod('ry', ry);

const rotateZ =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) => shape.transform(fromRotateZToTransform(angle)))
    );

const rz =
  (...angles) =>
  (shape) =>
    Shape.Group(
      ...angles.map((angle) =>
        shape.transform(fromRotateZToTransform(angle * 360))
      )
    );

Shape.registerMethod('rotateZ', rotateZ);
Shape.registerMethod('rz', rz);

const saveGeometry = async (path, shape) =>
  Shape.fromGeometry(await write$1(shape.toGeometry(), path));

const section =
  ({ profile = false }, ...pegs) =>
  (shape) => {
    const planes = [];
    if (pegs.length === 0) {
      planes.push({ plane: [0, 0, 1, 0] });
    } else {
      for (const peg of pegs) {
        const { plane } = getPegCoords(peg);
        planes.push({ plane });
      }
    }
    return Shape.fromGeometry(
      section$1(shape.toGeometry(), planes, { profile })
    );
  };

Shape.registerMethod('section', section);

const sectionProfile = () => (shape) =>
  section({ profile: true })(shape);

Shape.registerMethod('sectionProfile', sectionProfile);

const scale =
  (x = 1, y = x, z = y) =>
  (shape) =>
    shape.transform(fromScaling([x, y, z]));

Shape.registerMethod('scale', scale);

const smooth =
  (options = {}) =>
  (shape) =>
    Shape.fromGeometry(smooth$1(shape.toGeometry(), options));

Shape.registerMethod('smooth', smooth);

const X$2 = 0;
const Y$2 = 1;
const Z$3 = 2;

const size =
  (op = (size, shape) => size) =>
  (shape) => {
    const geometry = shape.toConcreteGeometry();
    const [min, max] = measureBoundingBox(geometry);
    const length = max[X$2] - min[X$2];
    const width = max[Y$2] - min[Y$2];
    const height = max[Z$3] - min[Z$3];
    const center = scale$1(0.5, add$1(min, max));
    const radius = distance(center, max);
    return op(
      {
        length,
        width,
        height,
        max,
        min,
        center,
        radius,
      },
      Shape.fromGeometry(geometry)
    );
  };

Shape.registerMethod('size', size);

const sketch = () => (shape) =>
  Shape.fromGeometry(taggedSketch({}, shape.toGeometry()));

Shape.registerMethod('sketch', sketch);

const split =
  ({
    keepVolumes = true,
    keepCavitiesInVolumes = true,
    keepCavitiesAsVolumes = false,
  } = {}) =>
  (shape) =>
    Shape.fromGeometry(
      split$1(
        shape.toGeometry(),
        keepVolumes,
        keepCavitiesInVolumes,
        keepCavitiesAsVolumes
      )
    );

Shape.registerMethod('split', split);

const tags =
  (op = (tags, shape) => tags) =>
  (shape) =>
    op(
      [...allTags(shape.toGeometry())]
        .filter((tag) => tag.startsWith('user/'))
        .map((tag) => tag.substring(5)),
      shape
    );

Shape.registerMethod('tags', tags);

const test = (md) => (shape) => {
  if (md) {
    shape.md(md);
  }
  test$1(shape.toGeometry());
  return shape;
};

Shape.registerMethod('test', test);

const fromName = (shape, name) =>
  Shape.fromGeometry(rewriteTags(toTagsFromName(name), [], shape.toGeometry()));

// Tint adds another color to the mix.
const tint =
  (...args) =>
  (shape) =>
    fromName(shape, ...args);

Shape.registerMethod('tint', tint);

const tool = (name) => (shape) =>
  Shape.fromGeometry(rewriteTags(toTagsFromName$2(name), [], shape.toGeometry()));

Shape.registerMethod('tool', tool);

const twist =
  (degreesPerMm = 1) =>
  (shape) =>
    Shape.fromGeometry(twist$1(shape.toGeometry(), degreesPerMm));

Shape.registerMethod('twist', twist);

const voidFn = () => (shape) =>
  Shape.fromGeometry(
    rewriteTags(['compose/non-positive'], [], shape.toGeometry())
  );

Shape.registerMethod('void', voidFn);

const weld =
  (...rest) =>
  (first) => {
    const unwelded = [];
    for (const shape of [first, ...rest]) {
      // We lose the tags at this point.
      const result = toPolygonsWithHoles(shape.toGeometry());
      for (const { polygonsWithHoles } of result) {
        unwelded.push(...polygonsWithHoles);
      }
    }
    const welds = [];
    const arrangements = arrangePolygonsWithHoles(unwelded);
    console.log(`QQ/arrangements: ${JSON.stringify(arrangements)}`);
    for (const { polygonsWithHoles } of arrangements) {
      // Keep the planar grouping.
      const triangles = fromPolygonsWithHolesToTriangles(polygonsWithHoles);
      const graph = fromTrianglesToGraph(triangles);
      welds.push(taggedGraph({}, graph));
    }
    // A group of planar welds.
    return Shape.fromGeometry(taggedGroup({}, ...welds));
  };

Shape.registerMethod('weld', weld);

const Weld = (...shapes) => weld(...shapes);

Shape.prototype.Weld = Shape.shapeMethod(Weld);

const assemble = (...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  switch (shapes.length) {
    case 0: {
      return Shape.fromGeometry(assemble$1());
    }
    case 1: {
      return shapes[0];
    }
    default: {
      return fromGeometry(assemble$1(...shapes.map(toGeometry)));
    }
  }
};

const withFn =
  (...shapes) =>
  (shape) =>
    assemble(shape, ...shapes);

Shape.registerMethod('with', withFn);

const x =
  (...x) =>
  (shape) =>
    Shape.Group(...x.map((x) => move(x)(shape)));

Shape.registerMethod('x', x);

const y =
  (...y) =>
  (shape) =>
    Shape.Group(...y.map((y) => move(0, y)(shape)));

Shape.registerMethod('y', y);

const z =
  (...z) =>
  (shape) =>
    Shape.Group(...z.map((z) => move(0, 0, z)(shape)));

Shape.registerMethod('z', z);

const Alpha =
  (componentLimit = 1) =>
  (shape) => {
    const points = [];
    shape.eachPoint((point) => points.push(point));
    return Shape.fromGeometry(
      taggedGraph({}, alphaShape(points, componentLimit))
    );
  };

const alpha =
  (componentLimit = 1) =>
  (shape) =>
    Alpha(shape);

Shape.registerMethod('alpha', alpha);

const eachEntry = (geometry, op, otherwise) => {
  for (let nth = geometry.plan.history.length - 1; nth >= 0; nth--) {
    const result = op(geometry.plan.history[nth]);
    if (result !== undefined) {
      return result;
    }
  }
  return otherwise;
};

const find = (geometry, key, otherwise) =>
  eachEntry(
    geometry,
    (entry) => {
      return entry[key];
    },
    otherwise
  );

const ofPlan = find;

const getAngle = (geometry) => find(geometry, 'angle', {});
const getAt = (geometry) => find(geometry, 'at', [0, 0, 0]);
const getCorner1 = (geometry) => find(geometry, 'corner1', [0, 0, 0]);
const getCorner2 = (geometry) => find(geometry, 'corner2', [0, 0, 0]);
const getFrom = (geometry) => find(geometry, 'from', [0, 0, 0]);
const getMatrix = (geometry) => geometry.matrix || identityMatrix;
const getTo = (geometry) => find(geometry, 'to', [0, 0, 0]);

const defaultZag = 0.01;

const getSides = (geometry, otherwise = 32) => {
  const [scale] = getScale(geometry);
  const [length, width] = scale;
  {
    otherwise = zag(Math.max(length, width) * 2, defaultZag);
  }
  return eachEntry(
    geometry,
    (entry) => {
      if (entry.sides !== undefined) {
        return entry.sides;
      } else if (entry.zag !== undefined) {
        return zag(Math.max(length, width), entry.zag);
      }
    },
    otherwise
  );
};

const getScale = (geometry) => {
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  return [
    scale$1(0.5, subtract(corner1, corner2)),
    scale$1(0.5, add$1(corner1, corner2)),
  ];
};

const Plan = (type) => Shape$3.fromGeometry(taggedPlan({}, { type }));

const Spiral = (
  toPathFromAngle = (angle) => [[angle]],
  { from = 0, to, upto, by, resolution } = {}
) => {
  if (by === undefined && resolution === undefined) {
    by = 1;
  }
  if (to === undefined && upto === undefined) {
    to = 360;
  }
  let path = [null];
  for (const angle of numbers((angle) => angle, {
    from,
    to,
    upto,
    by,
    resolution,
  })) {
    const radians = (-angle * Math.PI) / 180;
    const subpath = toPathFromAngle(angle);
    path = concatenatePath(path, rotateZPath(radians, subpath));
  }
  return Shape.fromPath(path);
};

Shape.prototype.Spiral = Shape.shapeMethod(Spiral);

const Z$2 = 2;

registerReifier('Arc', (geometry) => {
  let { start = 0, end = 360 } = getAngle(geometry);

  while (start > end) {
    start -= 360;
  }

  const [scale, middle] = getScale(geometry);
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  const top = corner2[Z$2];
  const bottom = corner1[Z$2];
  const step = 360 / getSides(geometry, 32);
  const steps = Math.ceil((end - start) / step);
  const effectiveStep = (end - start) / steps;

  // FIX: corner1 is not really right.
  if (end - start === 360) {
    return Spiral((a) => [[1]], {
      from: start - 90,
      upto: end - 90,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .close()
      .fill()
      .ex(top, bottom)
      .orient({
        center: negate(getAt(geometry)),
        from: getFrom(geometry),
        at: getTo(geometry),
      })
      .transform(getMatrix(geometry))
      .setTags(geometry.tags)
      .toGeometry();
  } else {
    return Spiral((a) => [[1]], {
      from: start - 90,
      to: end - 90,
      by: effectiveStep,
    })
      .scale(...scale)
      .move(...middle)
      .move(...getAt(geometry))
      .transform(getMatrix(geometry))
      .setTags(geometry.tags)
      .toGeometry();
  }
});

const Arc = (x = 1, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Arc' })).hasDiameter(x, y, z);

Shape.prototype.Arc = Shape.shapeMethod(Arc);

const isDefined = (value) => value !== undefined;

const Assembly = (...shapes) =>
  Shape.fromGeometry(
    assemble$1(...shapes.filter(isDefined).map((shape) => shape.toGeometry()))
  );

Shape.prototype.Assembly = Shape.shapeMethod(Assembly);

const Empty = (...shapes) => Shape.fromGeometry(taggedGroup({}));

Shape.prototype.Empty = Shape.shapeMethod(Empty);

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

registerReifier('Box', (geometry) => {
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  const left = corner1[X$1];
  const right = corner2[X$1];
  const front = corner1[Y$1];
  const back = corner2[Y$1];
  const top = corner2[Z$1];
  const bottom = corner1[Z$1];

  if (left <= right || front <= back) {
    return Empty().toGeometry();
  }

  const a = Shape.fromPath([
    [left, back, bottom],
    [right, back, bottom],
    [right, front, bottom],
    [left, front, bottom],
  ]);
  const b = a.fill();
  const c = b.ex(top, bottom);
  const d = c.orient({
    center: negate(getAt(geometry)),
    from: getFrom(geometry),
    at: getTo(geometry),
  });
  const e = d.transform(getMatrix(geometry));
  const f = e.setTags(geometry.tags);
  const g = f.toGeometry();
  return g;
});

const Box = (x, y = x, z = 0) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Box' })).hasDiameter(x, y, z);

Shape.prototype.Box = Shape.shapeMethod(Box);

const Hull = (...shapes) => {
  const points = [];
  shapes.forEach((shape) => shape.eachPoint((point) => points.push(point)));
  return Shape.fromGeometry(convexHullToGraph({}, points));
};

const hullMethod = function (...shapes) {
  return Hull(this, ...shapes);
};

Shape.prototype.Hull = Shape.shapeMethod(Hull);
Shape.prototype.hull = hullMethod;

const fromPoints$1 = (...args) =>
  Shape.fromPoints(args.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

const Points = (...args) => fromPoints$1(...args);
Points.fromPoints = fromPoints$1;

Shape.prototype.Points = Shape.shapeMethod(Points);

const ChainedHull = (...shapes) => {
  const pointsets = shapes.map((shape) => shape.toPoints());
  const chain = [];
  for (let nth = 1; nth < pointsets.length; nth++) {
    const points = [...pointsets[nth - 1], ...pointsets[nth]];
    chain.push(Hull(Points(...points)));
  }
  return Group(...chain);
};

const chainHullMethod = function (...shapes) {
  return ChainedHull(this, ...shapes);
};

Shape.prototype.chainHull = chainHullMethod;
Shape.prototype.ChainedHull = Shape.shapeMethod(ChainedHull);

const fromPoint = ([x = 0, y = 0, z = 0]) => Shape.fromPoint([x, y, z]);
const Point = (...args) => fromPoint([...args]);
Point.fromPoint = fromPoint;

Shape.prototype.Point = Shape.shapeMethod(Point);

const Z = 2;

// FIX: This looks wrong.
registerReifier('Cone', (geometry) => {
  const [x, y, z] = getCorner2(geometry);
  return Hull(
    Arc(x, y).hasSides(getSides(geometry, 32)).z(z),
    Point(0, 0, getCorner1(geometry)[Z])
  )
    .orient({
      center: negate(getAt(geometry)),
      from: getFrom(geometry),
      at: getTo(geometry),
    })
    .transform(getMatrix(geometry))
    .setTags(geometry.tags)
    .toGeometry();
});

const Cone = (diameter = 1, top = 1, base = -top) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Cone' }))
    .hasCorner1(0, 0, top)
    .hasCorner2(diameter, diameter, base);

Shape.prototype.Cone = Shape.shapeMethod(Cone);

// Hershey simplex one line font.
// See: http://paulbourke.net/dataformats/hershey/

const hersheyPaths = {
  32: [[null]],
  33: [
    [null, [5, 21, 0], [5, 7, 0]],
    [null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]],
    [null],
  ],
  34: [
    [null, [4, 21, 0], [4, 14, 0]],
    [null, [12, 21, 0], [12, 14, 0]],
    [null],
  ],
  35: [
    [null, [11, 25, 0], [4, -7, 0]],
    [null, [17, 25, 0], [10, -7, 0]],
    [null, [4, 12, 0], [18, 12, 0]],
    [null, [3, 6, 0], [17, 6, 0]],
    [null],
  ],
  36: [
    [null, [8, 25, 0], [8, -4, 0]],
    [null, [12, 25, 0], [12, -4, 0]],
    [
      null,
      [17, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [8, 21, 0],
      [5, 20, 0],
      [3, 18, 0],
      [3, 16, 0],
      [4, 14, 0],
      [5, 13, 0],
      [7, 12, 0],
      [13, 10, 0],
      [15, 9, 0],
      [16, 8, 0],
      [17, 6, 0],
      [17, 3, 0],
      [15, 1, 0],
      [12, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [3, 3, 0],
    ],
    [null],
  ],
  37: [
    [null, [21, 21, 0], [3, 0, 0]],
    [
      null,
      [8, 21, 0],
      [10, 19, 0],
      [10, 17, 0],
      [9, 15, 0],
      [7, 14, 0],
      [5, 14, 0],
      [3, 16, 0],
      [3, 18, 0],
      [4, 20, 0],
      [6, 21, 0],
      [8, 21, 0],
      [10, 20, 0],
      [13, 19, 0],
      [16, 19, 0],
      [19, 20, 0],
      [21, 21, 0],
    ],
    [
      null,
      [17, 7, 0],
      [15, 6, 0],
      [14, 4, 0],
      [14, 2, 0],
      [16, 0, 0],
      [18, 0, 0],
      [20, 1, 0],
      [21, 3, 0],
      [21, 5, 0],
      [19, 7, 0],
      [17, 7, 0],
    ],
    [null],
  ],
  38: [
    [
      null,
      [23, 12, 0],
      [23, 13, 0],
      [22, 14, 0],
      [21, 14, 0],
      [20, 13, 0],
      [19, 11, 0],
      [17, 6, 0],
      [15, 3, 0],
      [13, 1, 0],
      [11, 0, 0],
      [7, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
      [3, 6, 0],
      [4, 8, 0],
      [5, 9, 0],
      [12, 13, 0],
      [13, 14, 0],
      [14, 16, 0],
      [14, 18, 0],
      [13, 20, 0],
      [11, 21, 0],
      [9, 20, 0],
      [8, 18, 0],
      [8, 16, 0],
      [9, 13, 0],
      [11, 10, 0],
      [16, 3, 0],
      [18, 1, 0],
      [20, 0, 0],
      [22, 0, 0],
      [23, 1, 0],
      [23, 2, 0],
    ],
    [null],
  ],
  39: [
    [
      null,
      [5, 19, 0],
      [4, 20, 0],
      [5, 21, 0],
      [6, 20, 0],
      [6, 18, 0],
      [5, 16, 0],
      [4, 15, 0],
    ],
    [null],
  ],
  40: [
    [
      null,
      [11, 25, 0],
      [9, 23, 0],
      [7, 20, 0],
      [5, 16, 0],
      [4, 11, 0],
      [4, 7, 0],
      [5, 2, 0],
      [7, -2, 0],
      [9, -5, 0],
      [11, -7, 0],
    ],
    [null],
  ],
  41: [
    [
      null,
      [3, 25, 0],
      [5, 23, 0],
      [7, 20, 0],
      [9, 16, 0],
      [10, 11, 0],
      [10, 7, 0],
      [9, 2, 0],
      [7, -2, 0],
      [5, -5, 0],
      [3, -7, 0],
    ],
    [null],
  ],
  42: [
    [null, [8, 21, 0], [8, 9, 0]],
    [null, [3, 18, 0], [13, 12, 0]],
    [null, [13, 18, 0], [3, 12, 0]],
    [null],
  ],
  43: [[null, [13, 18, 0], [13, 0, 0]], [null, [4, 9, 0], [22, 9, 0]], [null]],
  44: [
    [
      null,
      [6, 1, 0],
      [5, 0, 0],
      [4, 1, 0],
      [5, 2, 0],
      [6, 1, 0],
      [6, -1, 0],
      [5, -3, 0],
      [4, -4, 0],
    ],
    [null],
  ],
  45: [[null, [4, 9, 0], [22, 9, 0]], [null]],
  46: [[null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]], [null]],
  47: [[null, [20, 25, 0], [2, -7, 0]], [null]],
  48: [
    [
      null,
      [9, 21, 0],
      [6, 20, 0],
      [4, 17, 0],
      [3, 12, 0],
      [3, 9, 0],
      [4, 4, 0],
      [6, 1, 0],
      [9, 0, 0],
      [11, 0, 0],
      [14, 1, 0],
      [16, 4, 0],
      [17, 9, 0],
      [17, 12, 0],
      [16, 17, 0],
      [14, 20, 0],
      [11, 21, 0],
      [9, 21, 0],
    ],
    [null],
  ],
  49: [[null, [6, 17, 0], [8, 18, 0], [11, 21, 0], [11, 0, 0]], [null]],
  50: [
    [
      null,
      [4, 16, 0],
      [4, 17, 0],
      [5, 19, 0],
      [6, 20, 0],
      [8, 21, 0],
      [12, 21, 0],
      [14, 20, 0],
      [15, 19, 0],
      [16, 17, 0],
      [16, 15, 0],
      [15, 13, 0],
      [13, 10, 0],
      [3, 0, 0],
      [17, 0, 0],
    ],
    [null],
  ],
  51: [
    [
      null,
      [5, 21, 0],
      [16, 21, 0],
      [10, 13, 0],
      [13, 13, 0],
      [15, 12, 0],
      [16, 11, 0],
      [17, 8, 0],
      [17, 6, 0],
      [16, 3, 0],
      [14, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
    ],
    [null],
  ],
  52: [
    [null, [13, 21, 0], [3, 7, 0], [18, 7, 0]],
    [null, [13, 21, 0], [13, 0, 0]],
    [null],
  ],
  53: [
    [
      null,
      [15, 21, 0],
      [5, 21, 0],
      [4, 12, 0],
      [5, 13, 0],
      [8, 14, 0],
      [11, 14, 0],
      [14, 13, 0],
      [16, 11, 0],
      [17, 8, 0],
      [17, 6, 0],
      [16, 3, 0],
      [14, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
    ],
    [null],
  ],
  54: [
    [
      null,
      [16, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [10, 21, 0],
      [7, 20, 0],
      [5, 17, 0],
      [4, 12, 0],
      [4, 7, 0],
      [5, 3, 0],
      [7, 1, 0],
      [10, 0, 0],
      [11, 0, 0],
      [14, 1, 0],
      [16, 3, 0],
      [17, 6, 0],
      [17, 7, 0],
      [16, 10, 0],
      [14, 12, 0],
      [11, 13, 0],
      [10, 13, 0],
      [7, 12, 0],
      [5, 10, 0],
      [4, 7, 0],
    ],
    [null],
  ],
  55: [[null, [17, 21, 0], [7, 0, 0]], [null, [3, 21, 0], [17, 21, 0]], [null]],
  56: [
    [
      null,
      [8, 21, 0],
      [5, 20, 0],
      [4, 18, 0],
      [4, 16, 0],
      [5, 14, 0],
      [7, 13, 0],
      [11, 12, 0],
      [14, 11, 0],
      [16, 9, 0],
      [17, 7, 0],
      [17, 4, 0],
      [16, 2, 0],
      [15, 1, 0],
      [12, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 2, 0],
      [3, 4, 0],
      [3, 7, 0],
      [4, 9, 0],
      [6, 11, 0],
      [9, 12, 0],
      [13, 13, 0],
      [15, 14, 0],
      [16, 16, 0],
      [16, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [8, 21, 0],
    ],
    [null],
  ],
  57: [
    [
      null,
      [16, 14, 0],
      [15, 11, 0],
      [13, 9, 0],
      [10, 8, 0],
      [9, 8, 0],
      [6, 9, 0],
      [4, 11, 0],
      [3, 14, 0],
      [3, 15, 0],
      [4, 18, 0],
      [6, 20, 0],
      [9, 21, 0],
      [10, 21, 0],
      [13, 20, 0],
      [15, 18, 0],
      [16, 14, 0],
      [16, 9, 0],
      [15, 4, 0],
      [13, 1, 0],
      [10, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [4, 3, 0],
    ],
    [null],
  ],
  58: [
    [null, [5, 14, 0], [4, 13, 0], [5, 12, 0], [6, 13, 0], [5, 14, 0]],
    [null, [5, 2, 0], [4, 1, 0], [5, 0, 0], [6, 1, 0], [5, 2, 0]],
    [null],
  ],
  59: [
    [null, [5, 14, 0], [4, 13, 0], [5, 12, 0], [6, 13, 0], [5, 14, 0]],
    [
      null,
      [6, 1, 0],
      [5, 0, 0],
      [4, 1, 0],
      [5, 2, 0],
      [6, 1, 0],
      [6, -1, 0],
      [5, -3, 0],
      [4, -4, 0],
    ],
    [null],
  ],
  60: [[null, [20, 18, 0], [4, 9, 0], [20, 0, 0]], [null]],
  61: [[null, [4, 12, 0], [22, 12, 0]], [null, [4, 6, 0], [22, 6, 0]], [null]],
  62: [[null, [4, 18, 0], [20, 9, 0], [4, 0, 0]], [null]],
  63: [
    [
      null,
      [3, 16, 0],
      [3, 17, 0],
      [4, 19, 0],
      [5, 20, 0],
      [7, 21, 0],
      [11, 21, 0],
      [13, 20, 0],
      [14, 19, 0],
      [15, 17, 0],
      [15, 15, 0],
      [14, 13, 0],
      [13, 12, 0],
      [9, 10, 0],
      [9, 7, 0],
    ],
    [null, [9, 2, 0], [8, 1, 0], [9, 0, 0], [10, 1, 0], [9, 2, 0]],
    [null],
  ],
  64: [
    [
      null,
      [18, 13, 0],
      [17, 15, 0],
      [15, 16, 0],
      [12, 16, 0],
      [10, 15, 0],
      [9, 14, 0],
      [8, 11, 0],
      [8, 8, 0],
      [9, 6, 0],
      [11, 5, 0],
      [14, 5, 0],
      [16, 6, 0],
      [17, 8, 0],
    ],
    [
      null,
      [12, 16, 0],
      [10, 14, 0],
      [9, 11, 0],
      [9, 8, 0],
      [10, 6, 0],
      [11, 5, 0],
    ],
    [
      null,
      [18, 16, 0],
      [17, 8, 0],
      [17, 6, 0],
      [19, 5, 0],
      [21, 5, 0],
      [23, 7, 0],
      [24, 10, 0],
      [24, 12, 0],
      [23, 15, 0],
      [22, 17, 0],
      [20, 19, 0],
      [18, 20, 0],
      [15, 21, 0],
      [12, 21, 0],
      [9, 20, 0],
      [7, 19, 0],
      [5, 17, 0],
      [4, 15, 0],
      [3, 12, 0],
      [3, 9, 0],
      [4, 6, 0],
      [5, 4, 0],
      [7, 2, 0],
      [9, 1, 0],
      [12, 0, 0],
      [15, 0, 0],
      [18, 1, 0],
      [20, 2, 0],
      [21, 3, 0],
    ],
    [null, [19, 16, 0], [18, 8, 0], [18, 6, 0], [19, 5, 0]],
  ],
  65: [
    [null, [9, 21, 0], [1, 0, 0]],
    [null, [9, 21, 0], [17, 0, 0]],
    [null, [4, 7, 0], [14, 7, 0]],
    [null],
  ],
  66: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [13, 21, 0],
      [16, 20, 0],
      [17, 19, 0],
      [18, 17, 0],
      [18, 15, 0],
      [17, 13, 0],
      [16, 12, 0],
      [13, 11, 0],
    ],
    [
      null,
      [4, 11, 0],
      [13, 11, 0],
      [16, 10, 0],
      [17, 9, 0],
      [18, 7, 0],
      [18, 4, 0],
      [17, 2, 0],
      [16, 1, 0],
      [13, 0, 0],
      [4, 0, 0],
    ],
    [null],
  ],
  67: [
    [
      null,
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
    ],
    [null],
  ],
  68: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [11, 21, 0],
      [14, 20, 0],
      [16, 18, 0],
      [17, 16, 0],
      [18, 13, 0],
      [18, 8, 0],
      [17, 5, 0],
      [16, 3, 0],
      [14, 1, 0],
      [11, 0, 0],
      [4, 0, 0],
    ],
    [null],
  ],
  69: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [17, 21, 0]],
    [null, [4, 11, 0], [12, 11, 0]],
    [null, [4, 0, 0], [17, 0, 0]],
    [null],
  ],
  70: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [17, 21, 0]],
    [null, [4, 11, 0], [12, 11, 0]],
    [null],
  ],
  71: [
    [
      null,
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
      [18, 8, 0],
    ],
    [null, [13, 8, 0], [18, 8, 0]],
    [null],
  ],
  72: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [18, 21, 0], [18, 0, 0]],
    [null, [4, 11, 0], [18, 11, 0]],
    [null],
  ],
  73: [[null, [4, 21, 0], [4, 0, 0]], [null]],
  74: [
    [
      null,
      [12, 21, 0],
      [12, 5, 0],
      [11, 2, 0],
      [10, 1, 0],
      [8, 0, 0],
      [6, 0, 0],
      [4, 1, 0],
      [3, 2, 0],
      [2, 5, 0],
      [2, 7, 0],
    ],
    [null],
  ],
  75: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [18, 21, 0], [4, 7, 0]],
    [null, [9, 12, 0], [18, 0, 0]],
    [null],
  ],
  76: [[null, [4, 21, 0], [4, 0, 0]], [null, [4, 0, 0], [16, 0, 0]], [null]],
  77: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [12, 0, 0]],
    [null, [20, 21, 0], [12, 0, 0]],
    [null, [20, 21, 0], [20, 0, 0]],
    [null],
  ],
  78: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [4, 21, 0], [18, 0, 0]],
    [null, [18, 21, 0], [18, 0, 0]],
    [null],
  ],
  79: [
    [
      null,
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
      [19, 8, 0],
      [19, 13, 0],
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
    ],
    [null],
  ],
  80: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [13, 21, 0],
      [16, 20, 0],
      [17, 19, 0],
      [18, 17, 0],
      [18, 14, 0],
      [17, 12, 0],
      [16, 11, 0],
      [13, 10, 0],
      [4, 10, 0],
    ],
    [null],
  ],
  81: [
    [
      null,
      [9, 21, 0],
      [7, 20, 0],
      [5, 18, 0],
      [4, 16, 0],
      [3, 13, 0],
      [3, 8, 0],
      [4, 5, 0],
      [5, 3, 0],
      [7, 1, 0],
      [9, 0, 0],
      [13, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 5, 0],
      [19, 8, 0],
      [19, 13, 0],
      [18, 16, 0],
      [17, 18, 0],
      [15, 20, 0],
      [13, 21, 0],
      [9, 21, 0],
    ],
    [null, [12, 4, 0], [18, -2, 0]],
    [null],
  ],
  82: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 21, 0],
      [13, 21, 0],
      [16, 20, 0],
      [17, 19, 0],
      [18, 17, 0],
      [18, 15, 0],
      [17, 13, 0],
      [16, 12, 0],
      [13, 11, 0],
      [4, 11, 0],
    ],
    [null, [11, 11, 0], [18, 0, 0]],
    [null],
  ],
  83: [
    [
      null,
      [17, 18, 0],
      [15, 20, 0],
      [12, 21, 0],
      [8, 21, 0],
      [5, 20, 0],
      [3, 18, 0],
      [3, 16, 0],
      [4, 14, 0],
      [5, 13, 0],
      [7, 12, 0],
      [13, 10, 0],
      [15, 9, 0],
      [16, 8, 0],
      [17, 6, 0],
      [17, 3, 0],
      [15, 1, 0],
      [12, 0, 0],
      [8, 0, 0],
      [5, 1, 0],
      [3, 3, 0],
    ],
    [null],
  ],
  84: [[null, [8, 21, 0], [8, 0, 0]], [null, [1, 21, 0], [15, 21, 0]], [null]],
  85: [
    [
      null,
      [4, 21, 0],
      [4, 6, 0],
      [5, 3, 0],
      [7, 1, 0],
      [10, 0, 0],
      [12, 0, 0],
      [15, 1, 0],
      [17, 3, 0],
      [18, 6, 0],
      [18, 21, 0],
    ],
    [null],
  ],
  86: [[null, [1, 21, 0], [9, 0, 0]], [null, [17, 21, 0], [9, 0, 0]], [null]],
  87: [
    [null, [2, 21, 0], [7, 0, 0]],
    [null, [12, 21, 0], [7, 0, 0]],
    [null, [12, 21, 0], [17, 0, 0]],
    [null, [22, 21, 0], [17, 0, 0]],
    [null],
  ],
  88: [[null, [3, 21, 0], [17, 0, 0]], [null, [17, 21, 0], [3, 0, 0]], [null]],
  89: [
    [null, [1, 21, 0], [9, 11, 0], [9, 0, 0]],
    [null, [17, 21, 0], [9, 11, 0]],
    [null],
  ],
  90: [
    [null, [17, 21, 0], [3, 0, 0]],
    [null, [3, 21, 0], [17, 21, 0]],
    [null, [3, 0, 0], [17, 0, 0]],
    [null],
  ],
  91: [
    [null, [4, 25, 0], [4, -7, 0]],
    [null, [5, 25, 0], [5, -7, 0]],
    [null, [4, 25, 0], [11, 25, 0]],
    [null, [4, -7, 0], [11, -7, 0]],
    [null],
  ],
  92: [[null, [0, 21, 0], [14, -3, 0]], [null]],
  93: [
    [null, [9, 25, 0], [9, -7, 0]],
    [null, [10, 25, 0], [10, -7, 0]],
    [null, [3, 25, 0], [10, 25, 0]],
    [null, [3, -7, 0], [10, -7, 0]],
    [null],
  ],
  94: [
    [null, [6, 15, 0], [8, 18, 0], [10, 15, 0]],
    [null, [3, 12, 0], [8, 17, 0], [13, 12, 0]],
    [null, [8, 17, 0], [8, 0, 0]],
    [null],
  ],
  95: [[null, [0, -2, 0], [16, -2, 0]], [null]],
  96: [
    [
      null,
      [6, 21, 0],
      [5, 20, 0],
      [4, 18, 0],
      [4, 16, 0],
      [5, 15, 0],
      [6, 16, 0],
      [5, 17, 0],
    ],
    [null],
  ],
  97: [
    [null, [15, 14, 0], [15, 0, 0]],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  98: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 11, 0],
      [6, 13, 0],
      [8, 14, 0],
      [11, 14, 0],
      [13, 13, 0],
      [15, 11, 0],
      [16, 8, 0],
      [16, 6, 0],
      [15, 3, 0],
      [13, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [6, 1, 0],
      [4, 3, 0],
    ],
    [null],
  ],
  99: [
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  100: [
    [null, [15, 21, 0], [15, 0, 0]],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  101: [
    [
      null,
      [3, 8, 0],
      [15, 8, 0],
      [15, 10, 0],
      [14, 12, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  102: [
    [null, [10, 21, 0], [8, 21, 0], [6, 20, 0], [5, 17, 0], [5, 0, 0]],
    [null, [2, 14, 0], [9, 14, 0]],
    [null],
  ],
  103: [
    [
      null,
      [15, 14, 0],
      [15, -2, 0],
      [14, -5, 0],
      [13, -6, 0],
      [11, -7, 0],
      [8, -7, 0],
      [6, -6, 0],
    ],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  104: [
    [null, [4, 21, 0], [4, 0, 0]],
    [
      null,
      [4, 10, 0],
      [7, 13, 0],
      [9, 14, 0],
      [12, 14, 0],
      [14, 13, 0],
      [15, 10, 0],
      [15, 0, 0],
    ],
    [null],
  ],
  105: [
    [null, [3, 21, 0], [4, 20, 0], [5, 21, 0], [4, 22, 0], [3, 21, 0]],
    [null, [4, 14, 0], [4, 0, 0]],
    [null],
  ],
  106: [
    [null, [5, 21, 0], [6, 20, 0], [7, 21, 0], [6, 22, 0], [5, 21, 0]],
    [null, [6, 14, 0], [6, -3, 0], [5, -6, 0], [3, -7, 0], [1, -7, 0]],
    [null],
  ],
  107: [
    [null, [4, 21, 0], [4, 0, 0]],
    [null, [14, 14, 0], [4, 4, 0]],
    [null, [8, 8, 0], [15, 0, 0]],
    [null],
  ],
  108: [[null, [4, 21, 0], [4, 0, 0]], [null]],
  109: [
    [null, [4, 14, 0], [4, 0, 0]],
    [
      null,
      [4, 10, 0],
      [7, 13, 0],
      [9, 14, 0],
      [12, 14, 0],
      [14, 13, 0],
      [15, 10, 0],
      [15, 0, 0],
    ],
    [
      null,
      [15, 10, 0],
      [18, 13, 0],
      [20, 14, 0],
      [23, 14, 0],
      [25, 13, 0],
      [26, 10, 0],
      [26, 0, 0],
    ],
    [null],
  ],
  110: [
    [null, [4, 14, 0], [4, 0, 0]],
    [
      null,
      [4, 10, 0],
      [7, 13, 0],
      [9, 14, 0],
      [12, 14, 0],
      [14, 13, 0],
      [15, 10, 0],
      [15, 0, 0],
    ],
    [null],
  ],
  111: [
    [
      null,
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
      [16, 6, 0],
      [16, 8, 0],
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
    ],
    [null],
  ],
  112: [
    [null, [4, 14, 0], [4, -7, 0]],
    [
      null,
      [4, 11, 0],
      [6, 13, 0],
      [8, 14, 0],
      [11, 14, 0],
      [13, 13, 0],
      [15, 11, 0],
      [16, 8, 0],
      [16, 6, 0],
      [15, 3, 0],
      [13, 1, 0],
      [11, 0, 0],
      [8, 0, 0],
      [6, 1, 0],
      [4, 3, 0],
    ],
    [null],
  ],
  113: [
    [null, [15, 14, 0], [15, -7, 0]],
    [
      null,
      [15, 11, 0],
      [13, 13, 0],
      [11, 14, 0],
      [8, 14, 0],
      [6, 13, 0],
      [4, 11, 0],
      [3, 8, 0],
      [3, 6, 0],
      [4, 3, 0],
      [6, 1, 0],
      [8, 0, 0],
      [11, 0, 0],
      [13, 1, 0],
      [15, 3, 0],
    ],
    [null],
  ],
  114: [
    [null, [4, 14, 0], [4, 0, 0]],
    [null, [4, 8, 0], [5, 11, 0], [7, 13, 0], [9, 14, 0], [12, 14, 0]],
    [null],
  ],
  115: [
    [
      null,
      [14, 11, 0],
      [13, 13, 0],
      [10, 14, 0],
      [7, 14, 0],
      [4, 13, 0],
      [3, 11, 0],
      [4, 9, 0],
      [6, 8, 0],
      [11, 7, 0],
      [13, 6, 0],
      [14, 4, 0],
      [14, 3, 0],
      [13, 1, 0],
      [10, 0, 0],
      [7, 0, 0],
      [4, 1, 0],
      [3, 3, 0],
    ],
    [null],
  ],
  116: [
    [null, [5, 21, 0], [5, 4, 0], [6, 1, 0], [8, 0, 0], [10, 0, 0]],
    [null, [2, 14, 0], [9, 14, 0]],
    [null],
  ],
  117: [
    [
      null,
      [4, 14, 0],
      [4, 4, 0],
      [5, 1, 0],
      [7, 0, 0],
      [10, 0, 0],
      [12, 1, 0],
      [15, 4, 0],
    ],
    [null, [15, 14, 0], [15, 0, 0]],
    [null],
  ],
  118: [[null, [2, 14, 0], [8, 0, 0]], [null, [14, 14, 0], [8, 0, 0]], [null]],
  119: [
    [null, [3, 14, 0], [7, 0, 0]],
    [null, [11, 14, 0], [7, 0, 0]],
    [null, [11, 14, 0], [15, 0, 0]],
    [null, [19, 14, 0], [15, 0, 0]],
    [null],
  ],
  120: [[null, [3, 14, 0], [14, 0, 0]], [null, [14, 14, 0], [3, 0, 0]], [null]],
  121: [
    [null, [2, 14, 0], [8, 0, 0]],
    [
      null,
      [14, 14, 0],
      [8, 0, 0],
      [6, -4, 0],
      [4, -6, 0],
      [2, -7, 0],
      [1, -7, 0],
    ],
    [null],
  ],
  122: [
    [null, [14, 14, 0], [3, 0, 0]],
    [null, [3, 14, 0], [14, 14, 0]],
    [null, [3, 0, 0], [14, 0, 0]],
    [null],
  ],
  123: [
    [
      null,
      [9, 25, 0],
      [7, 24, 0],
      [6, 23, 0],
      [5, 21, 0],
      [5, 19, 0],
      [6, 17, 0],
      [7, 16, 0],
      [8, 14, 0],
      [8, 12, 0],
      [6, 10, 0],
    ],
    [
      null,
      [7, 24, 0],
      [6, 22, 0],
      [6, 20, 0],
      [7, 18, 0],
      [8, 17, 0],
      [9, 15, 0],
      [9, 13, 0],
      [8, 11, 0],
      [4, 9, 0],
      [8, 7, 0],
      [9, 5, 0],
      [9, 3, 0],
      [8, 1, 0],
      [7, 0, 0],
      [6, -2, 0],
      [6, -4, 0],
      [7, -6, 0],
    ],
    [
      null,
      [6, 8, 0],
      [8, 6, 0],
      [8, 4, 0],
      [7, 2, 0],
      [6, 1, 0],
      [5, -1, 0],
      [5, -3, 0],
      [6, -5, 0],
      [7, -6, 0],
      [9, -7, 0],
    ],
    [null],
  ],
  124: [[null, [4, 25, 0], [4, -7, 0]], [null]],
  125: [
    [
      null,
      [5, 25, 0],
      [7, 24, 0],
      [8, 23, 0],
      [9, 21, 0],
      [9, 19, 0],
      [8, 17, 0],
      [7, 16, 0],
      [6, 14, 0],
      [6, 12, 0],
      [8, 10, 0],
    ],
    [
      null,
      [7, 24, 0],
      [8, 22, 0],
      [8, 20, 0],
      [7, 18, 0],
      [6, 17, 0],
      [5, 15, 0],
      [5, 13, 0],
      [6, 11, 0],
      [10, 9, 0],
      [6, 7, 0],
      [5, 5, 0],
      [5, 3, 0],
      [6, 1, 0],
      [7, 0, 0],
      [8, -2, 0],
      [8, -4, 0],
      [7, -6, 0],
    ],
    [
      null,
      [8, 8, 0],
      [6, 6, 0],
      [6, 4, 0],
      [7, 2, 0],
      [8, 1, 0],
      [9, -1, 0],
      [9, -3, 0],
      [8, -5, 0],
      [7, -6, 0],
      [5, -7, 0],
    ],
    [null],
  ],
  126: [
    [
      null,
      [3, 6, 0],
      [3, 8, 0],
      [4, 11, 0],
      [6, 12, 0],
      [8, 12, 0],
      [10, 11, 0],
      [14, 8, 0],
      [16, 7, 0],
      [18, 7, 0],
      [20, 8, 0],
      [21, 10, 0],
    ],
    [
      null,
      [3, 8, 0],
      [4, 10, 0],
      [6, 11, 0],
      [8, 11, 0],
      [10, 10, 0],
      [14, 7, 0],
      [16, 6, 0],
      [18, 6, 0],
      [20, 7, 0],
      [21, 10, 0],
      [21, 12, 0],
    ],
    [null],
  ],
};

const hersheyWidth = {
  32: 16,
  33: 10,
  34: 16,
  35: 21,
  36: 20,
  37: 24,
  38: 26,
  39: 10,
  40: 14,
  41: 14,
  42: 16,
  43: 26,
  44: 10,
  45: 26,
  46: 10,
  47: 22,
  48: 20,
  49: 20,
  50: 20,
  51: 20,
  52: 20,
  53: 20,
  54: 20,
  55: 20,
  56: 20,
  57: 20,
  58: 10,
  59: 10,
  60: 24,
  61: 26,
  62: 24,
  63: 18,
  64: 27,
  65: 18,
  66: 21,
  67: 21,
  68: 21,
  69: 19,
  70: 18,
  71: 21,
  72: 22,
  73: 8,
  74: 16,
  75: 21,
  76: 17,
  77: 24,
  78: 22,
  79: 22,
  80: 21,
  81: 22,
  82: 21,
  83: 20,
  84: 16,
  85: 22,
  86: 18,
  87: 24,
  88: 20,
  89: 18,
  90: 20,
  91: 14,
  92: 14,
  93: 14,
  94: 16,
  95: 16,
  96: 10,
  97: 19,
  98: 19,
  99: 18,
  100: 19,
  101: 18,
  102: 12,
  103: 19,
  104: 19,
  105: 8,
  106: 10,
  107: 17,
  108: 8,
  109: 30,
  110: 19,
  111: 19,
  112: 19,
  113: 19,
  114: 13,
  115: 17,
  116: 12,
  117: 19,
  118: 16,
  119: 22,
  120: 17,
  121: 16,
  122: 17,
  123: 14,
  124: 8,
  125: 14,
  126: 24,
};

const toPaths = (letters) => {
  let xOffset = 0;
  const mergedPaths = [];
  for (const letter of letters) {
    const code = letter.charCodeAt(0);
    const paths = hersheyPaths[code] || [];
    mergedPaths.push(...translatePaths([xOffset, 0, 0], paths));
    xOffset += hersheyWidth[code] || 0;
  }
  return Shape.fromGeometry(taggedPaths({}, mergedPaths))
    .scale(1 / 28)
    .wire();
};

const ofSize = (size) => (text) => toPaths(text).scale(size);

const Hershey = (size) => ofSize(size);
Hershey.ofSize = ofSize;
Hershey.toPaths = toPaths;

const Hexagon = (x, y, z) => Arc(x, y, z).hasSides(6);

Shape.prototype.Hexagon = Shape.shapeMethod(Hexagon);

/** @type {function(Point[], Path[]):Triangle[]} */
const fromPointsAndPaths = (points = [], paths = []) => {
  /** @type {Polygon[]} */
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: fromPoints$3(path.map((nth) => points[nth])) });
  }
  return polygons;
};

// Unit icosahedron vertices.
/** @type {Point[]} */
const points = [
  [0.850651, 0.0, -0.525731],
  [0.850651, -0.0, 0.525731],
  [-0.850651, -0.0, 0.525731],
  [-0.850651, 0.0, -0.525731],
  [0.0, -0.525731, 0.850651],
  [0.0, 0.525731, 0.850651],
  [0.0, 0.525731, -0.850651],
  [0.0, -0.525731, -0.850651],
  [-0.525731, -0.850651, -0.0],
  [0.525731, -0.850651, -0.0],
  [0.525731, 0.850651, 0.0],
  [-0.525731, 0.850651, 0.0],
];

// Triangular decomposition structure.
/** @type {Path[]} */
const paths = [
  [1, 9, 0],
  [0, 10, 1],
  [0, 7, 6],
  [0, 6, 10],
  [0, 9, 7],
  [4, 1, 5],
  [9, 1, 4],
  [1, 10, 5],
  [3, 8, 2],
  [2, 11, 3],
  [4, 5, 2],
  [2, 8, 4],
  [5, 11, 2],
  [6, 7, 3],
  [3, 11, 6],
  [3, 7, 8],
  [4, 8, 9],
  [5, 10, 11],
  [6, 11, 10],
  [7, 9, 8],
];

// FIX: Why aren't we computing the convex hull?

/**
 * Computes the polygons of a unit icosahedron.
 * @type {function():Triangle[]}
 */
const buildRegularIcosahedron = () => {
  return fromPointsAndPaths(points, paths);
};

registerReifier('Icosahedron', (geometry) => {
  const [scale, middle] = getScale(geometry);
  const a = Shape.fromPolygons(buildRegularIcosahedron());
  const b = a.scale(...scale);
  const c = b.move(...middle);
  const d = c.orient({
    center: negate(getAt(geometry)),
    from: getFrom(geometry),
    at: getTo(geometry),
  });
  const e = d.transform(getMatrix(geometry));
  const f = e.setTags(geometry.tags);
  const g = f.toGeometry();
  return g;
});

const Icosahedron = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Icosahedron' })).hasDiameter(
    x,
    y,
    z
  );

Shape.prototype.Icosahedron = Shape.shapeMethod(Icosahedron);

// Constructs an item from the designator.
const Item = () => (shape) =>
  Shape.fromGeometry(taggedItem({}, shape.toGeometry()));

Shape.registerMethod('item', Item);

const Implicit = (op, options) =>
  Shape.fromGraph(fromFunctionToGraph(op, options));

Shape.prototype.Implicit = Shape.shapeMethod(Implicit);

const fromVec3 = (...points) =>
  Shape.fromOpenPath(points.map(([x = 0, y = 0, z = 0]) => [x, y, z]));

const fromPoints = (...shapes) => {
  const vec3List = [];
  for (const shape of shapes) {
    shape.eachPoint((vec3) => vec3List.push(vec3));
  }
  return fromVec3(...vec3List);
};

const Path = (...points) => fromPoints(...points);
Path.fromVec3 = fromVec3;

Shape.prototype.Path = Shape.shapeMethod(Path);

const Line = (forward, backward = 0) => {
  if (backward > forward) {
    return Path(Point(forward), Point(backward));
  } else {
    return Path(Point(backward), Point(forward));
  }
};

Shape.prototype.Line = Shape.shapeMethod(Line);

const Octagon = (x, y, z) => Arc(x, y, z).hasSides(8);

Shape.prototype.Octagon = Shape.shapeMethod(Octagon);

// Approximates a UV sphere.
const extrudeSphere = (shape, height = 1, { sides = 20 } = {}) => {
  const lofts = [];

  const getEffectiveSlice = (slice) => {
    if (slice === 0) {
      return 0.5;
    } else if (slice === latitudinalResolution) {
      return latitudinalResolution - 0.5;
    } else {
      return slice;
    }
  };

  const latitudinalResolution = sides;

  for (let slice = 0; slice <= latitudinalResolution; slice++) {
    const angle =
      (Math.PI * 1.0 * getEffectiveSlice(slice)) / latitudinalResolution;
    const z = Math.cos(angle);
    const radius = Math.sin(angle);
    lofts.push((s) => s.scale(radius, radius, 1).z(z * height));
  }
  return shape.loft(...lofts.reverse());
};

Shape.registerMethod('extrudeSphere', extrudeSphere);
Shape.registerMethod('sx', extrudeSphere);

registerReifier('Orb', (geometry) => {
  const [scale, middle] = getScale(geometry);
  const sides = getSides(geometry, 16);
  return extrudeSphere(Arc(2).hasSides(sides * 2), 1, { sides: 2 + sides })
    .scale(...scale)
    .move(...middle)
    .orient({
      center: negate(getAt(geometry)),
      from: getFrom(geometry),
      at: getTo(geometry),
    })
    .transform(getMatrix(geometry))
    .setTags(geometry.tags)
    .toGeometry();
});

const Orb = (x = 1, y = x, z = x) =>
  Shape.fromGeometry(taggedPlan({}, { type: 'Orb' })).hasDiameter(x, y, z);

Shape.prototype.Orb = Shape.shapeMethod(Orb);

const MIN = 0;
const MAX = 1;
const X = 0;
const Y = 1;

const getItemNames = (geometry) => {
  const names = new Set();
  const op = (geometry, descend) => {
    if (
      geometry.type === 'item' &&
      isNotVoid(geometry) &&
      geometry.tags &&
      geometry.tags.some((tag) => tag.startsWith('item/'))
    ) {
      geometry.tags
        .filter((tag) => tag.startsWith('item/'))
        .forEach((tag) => names.add(tag.substring(5)));
    } else {
      descend();
    }
  };
  visit(geometry, op);
  return [...names].sort();
};

const buildLayoutGeometry = ({
  layer,
  packSize,
  pageWidth,
  pageLength,
  margin,
}) => {
  const itemNames = getItemNames(layer).filter((name) => name !== '');
  const labelScale = 0.0125 * 10;
  const size = [pageWidth, pageLength];
  const r = (v) => Math.floor(v * 100) / 100;
  const fontHeight = Math.max(pageWidth, pageLength) * labelScale;
  const font = Hershey(fontHeight);
  const title = [];
  title.push(font(`${r(pageWidth)} x ${r(pageLength)}`));
  for (let nth = 0; nth < itemNames.length; nth++) {
    title.push(font(itemNames[nth]).y((nth + 1) * fontHeight));
  }
  const visualization = Box(
    Math.max(pageWidth, margin),
    Math.max(pageLength, margin)
  )
    .outline()
    .and(
      Group(...title).move(pageWidth / -2, (pageLength * (1 + labelScale)) / 2)
    )
    .color('red')
    .sketch()
    .toGeometry();
  return taggedLayout(
    { size, margin, title, marks: packSize },
    layer,
    visualization
  );
};

const Page = (
  {
    size,
    pageMargin = 5,
    itemMargin = 1,
    itemsPerPage = Infinity,
    pack = true,
  },
  ...shapes
) => {
  const margin = itemMargin;
  const layers = [];
  for (const shape of shapes) {
    for (const leaf of getLeafs(shape.toDisjointGeometry())) {
      layers.push(leaf);
    }
  }
  if (!pack && size) {
    const layer = taggedGroup({}, ...layers);
    const [width, height] = size;
    const packSize = [
      [-width / 2, -height / 2, 0],
      [width / 2, height / 2, 0],
    ];
    const pageWidth =
      Math.max(
        1,
        Math.abs(packSize[MAX][X] * 2),
        Math.abs(packSize[MIN][X] * 2)
      ) +
      pageMargin * 2;
    const pageLength =
      Math.max(
        1,
        Math.abs(packSize[MAX][Y] * 2),
        Math.abs(packSize[MIN][Y] * 2)
      ) +
      pageMargin * 2;
    return Shape$4.fromGeometry(
      buildLayoutGeometry({ layer, packSize, pageWidth, pageLength, margin })
    );
  } else if (!pack && !size) {
    const layer = taggedGroup({}, ...layers);
    const packSize = measureBoundingBox(layer);
    const pageWidth =
      Math.max(
        1,
        Math.abs(packSize[MAX][X] * 2),
        Math.abs(packSize[MIN][X] * 2)
      ) +
      pageMargin * 2;
    const pageLength =
      Math.max(
        1,
        Math.abs(packSize[MAX][Y] * 2),
        Math.abs(packSize[MIN][Y] * 2)
      ) +
      pageMargin * 2;
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      return Shape$4.fromGeometry(
        buildLayoutGeometry({ layer, packSize, pageWidth, pageLength, margin })
      );
    } else {
      return Empty();
    }
  } else if (pack && size) {
    // Content fits to page size.
    const packSize = [];
    const content = Shape$4.fromGeometry(taggedGroup({}, ...layers)).pack({
      size,
      pageMargin,
      itemMargin,
      perLayout: itemsPerPage,
      packSize,
    });
    if (packSize.length === 0) {
      throw Error('Packing failed');
    }
    const pageWidth = Math.max(1, packSize[MAX][X] - packSize[MIN][X]);
    const pageLength = Math.max(1, packSize[MAX][Y] - packSize[MIN][Y]);
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of content.toDisjointGeometry().content[0].content) {
        plans.push(
          buildLayoutGeometry({
            layer,
            packSize,
            pageWidth,
            pageLength,
            margin,
          })
        );
      }
      return Shape$4.fromGeometry(taggedGroup({}, ...plans));
    } else {
      return Empty();
    }
  } else if (pack && !size) {
    const packSize = [];
    // Page fits to content size.
    const content = Shape$4.fromGeometry(taggedGroup({}, ...layers)).pack({
      pageMargin,
      itemMargin,
      perLayout: itemsPerPage,
      packSize,
    });
    if (packSize.length === 0) {
      throw Error('Packing failed');
    }
    // FIX: Using content.size() loses the margin, which is a problem for repacking.
    // Probably page plans should be generated by pack and count toward the size.
    const pageWidth = packSize[MAX][X] - packSize[MIN][X];
    const pageLength = packSize[MAX][Y] - packSize[MIN][Y];
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of content.toDisjointGeometry().content[0].content) {
        const layoutGeometry = buildLayoutGeometry({
          layer,
          packSize,
          pageWidth,
          pageLength,
          margin,
        });
        Shape$4.fromGeometry(layoutGeometry);
        plans.push(layoutGeometry);
      }
      return Shape$4.fromGeometry(taggedGroup({}, ...plans));
    } else {
      return Empty();
    }
  }
};

const page =
  (options = {}) =>
  (shape) =>
    Page(options, shape);
Shape$4.registerMethod('page', page);

const fix =
  (options = {}) =>
  (shape) =>
    Page({ ...options, pack: false }, shape);
Shape$4.registerMethod('fix', fix);

const Pentagon = (x, y, z) => Arc(x, y, z).hasSides(5);

Shape.prototype.Pentagon = Shape.shapeMethod(Pentagon);

const Polygon = (...points) => {
  const path = [];
  for (const point of points) {
    point.eachPoint((p) => path.push(p));
  }
  return Shape.fromGraph(fromPathsToGraph([{ points: path }]));
};

Shape.prototype.Polygon = Shape.shapeMethod(Polygon);

const ofPointPaths = (points = [], paths = []) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: path.map((point) => points[point]) });
  }
  return Shape.fromPolygons(polygons);
};

const Polyhedron = (...args) => ofPointPaths(...args);

Polyhedron.ofPointPaths = ofPointPaths;

Shape.prototype.Polyhedron = Shape.shapeMethod(Polyhedron);

const Septagon = (x, y, z) => Arc(x, y, z).hasSides(7);

Shape.prototype.Septagon = Shape.shapeMethod(Septagon);

const Tetragon = (x, y, z) => Arc(x, y, z).hasSides(4);

Shape.prototype.Tetragon = Shape.shapeMethod(Tetragon);

const Triangle = (x, y, z) => Arc(x, y, z).hasSides(3);

Shape.prototype.Triangle = Shape.shapeMethod(Triangle);

const Wave = (
  toPathFromXDistance = (xDistance) => [[0]],
  { from = 0, to = 360, by, resolution } = {}
) => {
  if (by === undefined && resolution === undefined) {
    by = 1;
  }
  let path = [null];
  for (const xDistance of numbers((distance) => distance, { from, to, by })) {
    const subpath = toPathFromXDistance(xDistance);
    path = concatenatePath(path, translatePath([xDistance, 0, 0], subpath));
  }
  return Shape.fromPath(path);
};

Shape.prototype.Wave = Shape.shapeMethod(Wave);

/**
 *
 * Defines the interface used by the api to access the rest of the system on
 * behalf of a user. e.g., algorithms and geometries.
 *
 * A user can destructively update this mapping in their code to change what
 * the api uses.
 */

const yz = Peg('x', [0, 0, 0], [0, 0, 1], [0, -1, 0]);
const xz = Peg('y', [0, 0, 0], [0, 0, 1], [1, 0, 0]);
const xy = Peg('z', [0, 0, 0], [0, 1, 0], [-1, 0, 0]);

var api = /*#__PURE__*/Object.freeze({
  __proto__: null,
  yz: yz,
  xz: xz,
  xy: xy,
  define: define,
  defGrblConstantLaser: defGrblConstantLaser,
  defGrblDynamicLaser: defGrblDynamicLaser,
  defGrblPlotter: defGrblPlotter,
  defGrblSpindle: defGrblSpindle,
  defRgbColor: defRgbColor,
  defThreejsMaterial: defThreejsMaterial,
  defTool: defTool,
  md: md,
  control: control,
  elapsed: elapsed,
  emit: emit,
  info: info,
  read: read,
  write: write,
  beginRecordingNotes: beginRecordingNotes,
  emitSourceLocation: emitSourceLocation,
  replayRecordedNotes: replayRecordedNotes,
  saveRecordedNotes: saveRecordedNotes,
  Shape: Shape,
  add: add,
  and: and,
  addTo: addTo,
  align: align,
  as: as,
  bend: bend,
  clip: clip,
  clipFrom: clipFrom,
  color: color,
  colors: colors,
  cloudSolid: cloudSolid,
  cut: cut,
  cutFrom: cutFrom,
  drop: drop,
  ex: ex,
  extrude: extrude,
  extrudeToPlane: extrudeToPlane,
  fill: fill,
  withFill: withFill,
  fuse: fuse,
  grow: grow,
  inline: inline,
  inset: inset,
  keep: keep,
  loadGeometry: loadGeometry,
  loft: loft,
  log: log,
  loop: loop,
  material: material,
  minkowskiDifference: minkowskiDifference,
  minkowskiShell: minkowskiShell,
  minkowskiSum: minkowskiSum,
  move: move,
  noVoid: noVoid,
  notAs: notAs,
  offset: offset,
  op: op,
  outline: outline,
  pack: pack,
  projectToPlane: projectToPlane,
  push: push,
  remesh: remesh,
  rotate: rotate,
  rx: rx$1,
  ry: ry$1,
  rz: rz$1,
  rotateX: rotateX,
  rotateY: rotateY,
  rotateZ: rotateZ,
  saveGeometry: saveGeometry,
  section: section,
  sectionProfile: sectionProfile,
  scale: scale,
  smooth: smooth,
  size: size,
  sketch: sketch,
  split: split,
  tags: tags,
  test: test,
  tint: tint,
  tool: tool,
  twist: twist,
  voidFn: voidFn,
  weld: weld,
  withFn: withFn,
  withInset: withInset,
  withOp: withOp,
  x: x,
  y: y,
  z: z,
  Alpha: Alpha,
  Arc: Arc,
  Assembly: Assembly,
  Box: Box,
  ChainedHull: ChainedHull,
  Cone: Cone,
  Empty: Empty,
  Group: Group,
  Hershey: Hershey,
  Hexagon: Hexagon,
  Hull: Hull,
  Icosahedron: Icosahedron,
  Item: Item,
  Implicit: Implicit,
  Line: Line,
  Octagon: Octagon,
  Orb: Orb,
  Page: Page,
  Path: Path,
  Peg: Peg,
  Pentagon: Pentagon,
  Plan: Plan,
  Point: Point,
  Points: Points,
  Polygon: Polygon,
  Polyhedron: Polyhedron,
  Septagon: Septagon,
  Spiral: Spiral,
  Tetragon: Tetragon,
  Triangle: Triangle,
  Wave: Wave,
  Weld: Weld,
  ofPlan: ofPlan,
  Noise: Noise,
  Random: Random,
  acos: acos,
  cos: cos,
  each: each,
  ease: ease,
  max: max,
  min: min,
  numbers: numbers,
  sin: sin,
  sqrt: sqrt,
  vec: vec,
  zag: zag,
  readSvg: readSvg,
  readStl: readStl,
  readObj: readObj,
  readOff: readOff,
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

const buildImportModule = (api) => async (name) => {
  const internalModule = DYNAMIC_MODULES.get(name);
  if (internalModule !== undefined) {
    const module = await import(internalModule);
    return module;
  }
  let script;
  if (script === undefined) {
    const path = `source/${name}`;
    const sources = [];
    sources.push(name);
    script = await read(path, { sources });
  }
  if (script === undefined) {
    throw Error(`Cannot import module ${name}`);
  }
  const scriptText =
    typeof script === 'string'
      ? script
      : new TextDecoder('utf8').decode(script);
  const ecmascript = await toEcmascript(scriptText, { path: name });
  const builder = new Function(
    `{ ${Object.keys(api).join(', ')} }`,
    `return async () => { ${ecmascript} };`
  );
  const module = await builder(api);
  try {
    pushModule(name);
    const exports = await module();
    return exports;
  } finally {
    popModule();
  }
};

const extendedApi = { ...api, toSvg };

const importModule = buildImportModule(extendedApi);

extendedApi.importModule = importModule;

// Register Dynamic libraries.

const module = (name) => `@jsxcad/api-v1-${name}`;

registerDynamicModule(module('armature'), './jsxcad-api-v1-armature.js');
registerDynamicModule(module('cursor'), './jsxcad-api-v1-cursor.js');
registerDynamicModule(module('deform'), './jsxcad-api-v1-deform.js');
registerDynamicModule(module('dst'), './jsxcad-api-v1-dst.js');
registerDynamicModule(module('dxf'), './jsxcad-api-v1-dxf.js');
registerDynamicModule(module('font'), './jsxcad-api-v1-font.js');
registerDynamicModule(module('gcode'), './jsxcad-api-v1-gcode.js');
registerDynamicModule(module('ldraw'), './jsxcad-api-v1-ldraw.js');
registerDynamicModule(module('math'), './jsxcad-api-v1-math.js');
registerDynamicModule(module('pdf'), './jsxcad-api-v1-pdf.js');
registerDynamicModule(module('plan'), './jsxcad-api-v1-plan.js');
registerDynamicModule(module('plans'), './jsxcad-api-v1-plans.js');
registerDynamicModule(module('png'), './jsxcad-api-v1-png.js');
registerDynamicModule(module('shape'), './jsxcad-api-v1-shape.js');
registerDynamicModule(module('shapefile'), './jsxcad-api-v1-shapefile.js');
registerDynamicModule(module('shapes'), './jsxcad-api-v1-shapes.js');
registerDynamicModule(module('stl'), './jsxcad-api-v1-stl.js');
registerDynamicModule(module('svg'), './jsxcad-api-v1-svg.js');
registerDynamicModule(module('threejs'), './jsxcad-api-v1-threejs.js');
registerDynamicModule(module('units'), './jsxcad-api-v1-units.js');

export { Alpha, Arc, Assembly, Box, ChainedHull, Cone, Empty, Group, Hershey, Hexagon, Hull, Icosahedron, Implicit, Item, Line, Octagon, Orb, Page, Path, Peg, Pentagon, Plan, Point, Points, Polygon, Polyhedron, Septagon, Shape, Spiral, Tetragon, Triangle, Wave, Weld, add, addTo, align, and, as, beginRecordingNotes, bend, clip, clipFrom, cloudSolid, color, colors, control, cut, cutFrom, defGrblConstantLaser, defGrblDynamicLaser, defGrblPlotter, defGrblSpindle, defRgbColor, defThreejsMaterial, defTool, define, drop, emitSourceLocation, ex, extrude, extrudeToPlane, fill, fuse, grow, importModule, inline, inset, keep, loadGeometry, loft, log, loop, material, md, minkowskiDifference, minkowskiShell, minkowskiSum, move, noVoid, notAs, ofPlan, offset, op, outline, pack, projectToPlane, push, remesh, replayRecordedNotes, rotate, rotateX, rotateY, rotateZ, rx$1 as rx, ry$1 as ry, rz$1 as rz, saveGeometry, saveRecordedNotes, scale, section, sectionProfile, size, sketch, smooth, split, tags, test, tint, tool, twist, voidFn, weld, withFill, withFn, withInset, withOp, x, xy, xz, y, yz, z };
