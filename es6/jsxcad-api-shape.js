import { getSourceLocation, startTime, endTime, emit, computeHash, generateUniqueId, write, isNode, logInfo, read, log as log$1 } from './jsxcad-sys.js';
export { elapsed, emit, read, write } from './jsxcad-sys.js';
import { taggedGraph, taggedSegments, taggedPoints, fromPolygons, hasTypeReference, taggedGroup, approximate as approximate$1, makeAbsolute, measureBoundingBox, getLeafs, getInverseMatrices, measureArea, taggedItem, transform as transform$1, computeNormal, extrude, transformCoordinate, link as link$1, taggedPlan, bend as bend$1, rewrite, visit, computeCentroid, convexHull, fuse as fuse$1, join as join$1, noGhost, clip as clip$1, linearize, cut as cut$1, deform as deform$1, demesh as demesh$1, toPoints as toPoints$1, dilateXY as dilateXY$1, disjoint as disjoint$1, hasTypeGhost, replacer, toDisplayGeometry as toDisplayGeometry$1, taggedLayout, getLayouts, eachFaceEdges, disorientSegment, eachPoint as eachPoint$1, eagerTransform as eagerTransform$1, fill as fill$2, fix as fix$1, hash, hasTypeVoid, grow as grow$1, inset as inset$1, involute as involute$1, load as load$1, read as read$1, loft as loft$1, generateLowerEnvelope, hasShowOverlay, computeOrientedBoundingBox, hasTypeMasked, hasMaterial, offset as offset$1, outline as outline$1, remesh as remesh$1, store, write as write$1, fromScaleToTransform, seam as seam$1, section as section$1, separate as separate$1, serialize as serialize$1, rewriteTags, cast, shell as shell$1, simplify as simplify$1, taggedSketch, smooth as smooth$1, computeToolpath, twist as twist$1, generateUpperEnvelope, unfold as unfold$1, measureVolume, withAabbTreeQuery, wrap as wrap$1, computeImplicitVolume } from './jsxcad-geometry.js';
import { fromRotateXToTransform, fromRotateYToTransform, fromSegmentToInverseTransform, invertTransform, makeOcctBox, fromTranslateToTransform, fromRotateZToTransform, setTestMode, makeOcctSphere, makeUnitSphere as makeUnitSphere$1 } from './jsxcad-algorithm-cgal.js';
import { zag } from './jsxcad-api-v1-math.js';
import { toTagsFromName } from './jsxcad-algorithm-color.js';
import { dataUrl } from './jsxcad-ui-threejs.js';
import { toGcode } from './jsxcad-convert-gcode.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';
import { toPdf } from './jsxcad-convert-pdf.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { fromSvg, toSvg } from './jsxcad-convert-svg.js';
import { toTagsFromName as toTagsFromName$1 } from './jsxcad-algorithm-tool.js';
import { fromPng } from './jsxcad-convert-png.js';
import { fromRaster } from './jsxcad-algorithm-contour.js';

const ops = new Map();

// Asynchronous proxy chaining for operators.
let complete, incomplete, chain;

incomplete = {
  apply(target, obj, args) {
    const result = target.apply(obj, args);
    if (typeof result !== 'function') {
      throw Error(
        `Incomplete op must evaluate to function, not ${typeof result}: ${
          '' + target
        }`
      );
    }
    return new Proxy(result, complete);
  },
  get(target, prop, receiver) {
    if (prop === 'sync') {
      // console.log(`QQ/incomplete/sync`);
      return target;
    }
    if (prop === 'isChain') {
      return 'incomplete';
    }
    if (!ops.has(prop)) {
      // console.log(`QQ/incomplete/get[${prop.toString()}]: no method`);
      return Reflect.get(target, prop);
    }
    // console.log(`QQ/incomplete/get[${prop}]`);
  },
};

// This is a complete chain.
complete = {
  apply(target, obj, args) {
    return target.apply(obj, args);
  },
  get(target, prop, receiver) {
    if (prop === 'sync') {
      // console.log(`QQ/complete/sync`);
      return target;
    }
    if (prop === 'isChain') {
      return 'complete';
    }
    if (prop === 'then') {
      return async (resolve, reject) => {
        // This should only happen at the end of a chain.
        // But since target() is async, it returns it as a promise, which will end up getting then'd by the await,
        // and so on, which won't be this when.
        const link = async () => {
          const result = await target();
          if (isShape(result)) {
            return chain(result);
          } else {
            return result;
          }
        };
        resolve(link());
      };
    }
    if (!ops.has(prop)) {
      return Reflect.get(target, prop);
    }
    // console.log(`QQ/complete/get[${prop}]`);
    return new Proxy(
      (...args) =>
        async (terminal) => {
          const s = await target(terminal);
          if (!(s instanceof Shape) && !s.isChain) {
            throw Error(
              `Expected Shape but received ${JSON.stringify(s)} constructor ${
                s.constructor.name
              }`
            );
          }
          let op;
          try {
            op = ops.get(prop);
          } catch (e) {
            console.log(e.stack);
            throw e;
          }
          if (typeof op !== 'function') {
            throw Error(
              `${s}[${prop}] must be function, not ${typeof op}: ${'' + op}`
            );
          }
          const result = await op(...args)(s);
          return result;
        },
      incomplete
    );
  },
};

// This builds a chain from an existing shape value.
chain = (value) => {
  if (!(value instanceof Object) || value.isChain !== undefined) {
    return value;
  }
  const shape = value;

  const root = {
    apply(target, obj, args) {
      // This is wrong -- the chain root should be the constructor, which requires application.
      // console.log(`QQ/root/terminal: ${JSON.stringify(target)}`);
      return this;
    },
    get(target, prop, receiver) {
      // console.log(`QQ/root/get: ${prop.toString()}`);
      if (prop === 'sync') {
        // console.log(`QQ/root/sync: ${JSON.stringify(target)}`);
        return target;
      }
      if (prop === 'isChain') {
        return 'root';
      }
      // This should be the same as just returning the proxy.
      if (prop === 'then') {
        return undefined;
      }
      if (!ops.has(prop)) {
        return Reflect.get(target, prop);
      }
      return new Proxy(
        (...args) =>
          async () => {
            // We don't care about the terminal -- we're the root of the chain.
            if (!(target instanceof Shape)) {
              throw Error(
                `Expected Shape but received ${'' + target}: isChain ${
                  target.isChain
                } ${JSON.stringify(target)}`
              );
            }
            const root = target;
            const op = ops.get(prop);
            if (typeof op !== 'function') {
              throw Error(`QQ/Op ${op} [${prop}] is not a function.`);
            }
            const result = await op(...args)(root);
            return result;
          },
        incomplete
      );
    },
  };

  const result = new Proxy(shape, root);
  return result;
};

// This is the root of an untethered chain.
const chainable = (op) => {
  return new Proxy(
    (...args) =>
      async (terminal) => {
        if (
          !(terminal instanceof Shape) &&
          terminal !== null &&
          terminal !== undefined
        ) {
          throw Error(
            `Expected Shape but received ${JSON.stringify(
              terminal
            )} of type ${typeof terminal} or null (isChain=${terminal.isChain})`
          );
        }
        // console.log(`QQQ/chainable/terminal: ${JSON.stringify(terminal)}`);
        const pop = op(...args);
        const result = await pop(terminal);
        return result;
      },
    incomplete
  );
};

class Shape {
  constructor(geometry = { type: 'Group', tags: [], content: [] }, context) {
    if (geometry.geometry) {
      throw Error('die: { geometry: ... } is not valid geometry.');
    }
    this.geometry = geometry;
    this.context = context;
    return this;
  }

  getContext(symbol) {
    return this.context[symbol];
  }

  toCoordinate(x, y, z) {
    return Shape.toCoordinate(this, x, y, z);
  }

  toCoordinates(...args) {
    return Shape.toCoordinates(this, ...args);
  }
}

const isShape = (value) =>
  value instanceof Shape ||
  (value !== undefined && value !== null && value.isChain === 'root');
Shape.isShape = isShape;

const isOp = (value) =>
  value !== undefined &&
  value !== null &&
  value.isChain !== undefined &&
  value.isChain !== 'root';
Shape.isOp = isOp;

const isFunction = (value) => value instanceof Function;
Shape.isFunction = isFunction;

const isArray = (value) => value instanceof Array;
Shape.isArray = isArray;

const isObject = (value) =>
  value instanceof Object &&
  !isArray(value) &&
  !isShape(value) &&
  !isFunction(value);
Shape.isObject = isObject;

const isNumber = (value) => typeof value === 'number';
Shape.isNumber = isNumber;

const isString = (value) => typeof value === 'string';
Shape.isString = isString;

const isValue = (value) =>
  (!isObject(value) && !isFunction(value)) || isArray(value);
Shape.isValue = isValue;

Shape.chain = chain;

const registerMethod = (names, op) => {
  if (typeof names === 'string') {
    names = [names];
  }
  const path = getSourceLocation()?.path;

  for (const name of names) {
    if (Shape.prototype.hasOwnProperty(name)) {
      const { origin } = Shape.prototype[name];
      if (origin !== path) {
        throw Error(
          `Method ${name} is already defined in ${origin} (this is ${path}).`
        );
      }
    }
    // Make the operation application available e.g., s.grow(1)
    // These methods work directly on unchained shapes, but don't compose when async.
    const { [name]: method } = {
      [name]: function (...args) {
        const timer = startTime(name);
        const result = op(...args)(this);
        endTime(timer);
        return result;
      },
    };
    method.origin = path;
    Shape.prototype[name] = method;

    ops.set(name, op);
  }
  return chainable(op);
};

const registerMethod2 = (names, signature, op) => {
  const method =
    (...args) =>
    async (shape) => {
      const parameters = await Shape.destructure2a(shape, args, ...signature);
      return op(...parameters);
    };
  return registerMethod(names, method);
};

Shape.registerMethod2 = registerMethod2;

Shape.fromGeometry = (geometry, context) => new Shape(geometry, context);
Shape.fromGraph = (graph, context) =>
  new Shape(taggedGraph({}, graph), context);
Shape.fromClosedPath = (path, context) => {
  const segments = [];
  let first;
  let last;
  for (const point of path) {
    if (point === null) {
      continue;
    }
    if (!first) {
      first = point;
    }
    if (last) {
      segments.push([last, point]);
    }
    last = point;
  }
  if (first && last && first !== last) {
    segments.push([last, first]);
  }
  return Shape.fromSegments(segments);
};
Shape.fromOpenPath = (path, context) => {
  const segments = [];
  let last;
  for (const point of path) {
    if (point === null) {
      continue;
    }
    if (last) {
      segments.push([last, point]);
    }
    last = point;
  }
  return Shape.fromSegments(segments);
};
Shape.fromSegments = (segments) => fromGeometry(taggedSegments({}, segments));
Shape.fromPoint = (point, context) =>
  fromGeometry(taggedPoints({}, [point]), context);
Shape.fromPoints = (points, context) =>
  fromGeometry(taggedPoints({}, points), context);
Shape.fromPolygons = (polygons, context) =>
  fromGeometry(fromPolygons(polygons), context);

Shape.registerMethod = registerMethod;

Shape.chainable = chainable;
Shape.ops = ops;

const fromGeometry = Shape.fromGeometry;

const destructure = (
  args,
  {
    shapes = [],
    shapesAndFunctions = [],
    functions = [],
    arrays = [],
    objects = [],
    strings = [],
    values = [],
    object = {},
    func,
    number,
    string,
    value,
  } = {}
) => {
  for (const arg of args) {
    if (Shape.isShape(arg)) {
      shapes.push(arg);
      shapesAndFunctions.push(arg);
    } else if (Shape.isFunction(arg)) {
      functions.push(arg);
      shapesAndFunctions.push(arg);
      func = arg;
    } else if (Shape.isArray(arg)) {
      arrays.push(arg);
    } else if (Shape.isObject(arg)) {
      objects.push(arg);
      object = Object.assign(object, arg);
    }
    if (Shape.isValue(arg)) {
      values.push(arg);
      if (value === undefined) {
        value = arg;
      }
    }
    if (typeof arg === 'number') {
      if (number === undefined) {
        number = arg;
      }
    }
    if (typeof arg === 'string') {
      strings.push(arg);
      if (string === undefined) {
        string = arg;
      }
    }
  }
  return {
    shapes,
    shapesAndFunctions,
    functions,
    func,
    arrays,
    objects,
    values,
    object,
    number,
    string,
    strings,
    value,
  };
};

Shape.destructure = destructure;

const resolve = async (shape, value) => {
  while (Shape.isFunction(value)) {
    value = await value(shape);
  }
  return value;
};

const resolveArray = async (shape, arg) => {
  const value = await resolve(shape, arg);
  if (Shape.isArray(value)) {
    const resolved = [];
    for (const element of value) {
      resolved.push(await resolve(shape, element));
    }
    return resolved;
  }
  return value;
};

const getCoordinate = async (value) => {
  const points = await value.toPoints();
  if (points.length >= 1) {
    return points[0];
  } else {
    throw Error(`Unexpected coordinate value: ${JSON.stringify(value)}`);
  }
};

const getCoordinates = async (value) => {
  const coordinates = [];
  for (const [x = 0, y = 0, z = 0] of await value.toPoints()) {
    coordinates.push([x, y, z]);
  }
  return coordinates;
};

const destructure2 = async (shape, input, ...specs) => {
  const output = [];
  let args = [];
  for (const arg of input) {
    if (arg === undefined) {
      continue;
    }
    args.push(arg instanceof Promise ? await arg : arg);
  }
  for (const spec of specs) {
    const rest = [];
    switch (spec) {
      case 'objects': {
        const out = [];
        for (const arg of args) {
          if (Shape.isObject(arg)) {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'number': {
        let number;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (number === undefined && Shape.isNumber(value)) {
            number = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(number);
        break;
      }
      case 'numbers': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isNumber(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'string': {
        let string;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (string === undefined && Shape.isString(value)) {
            string = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(string);
        break;
      }
      case 'function': {
        let func;
        for (const arg of args) {
          let value = arg;
          if (func === undefined && Shape.isFunction(value)) {
            func = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(func);
        break;
      }
      case 'shape': {
        let result;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (result === undefined && Shape.isShape(value)) {
            result = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'geometry': {
        let result;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (result === undefined && Shape.isShape(value)) {
            result = await value.toGeometry();
          } else {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'coordinate': {
        let result;
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (result === undefined && Shape.isShape(value)) {
            result = await getCoordinate(value);
          } else if (result === undefined && Shape.isArray(value)) {
            result = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'options': {
        const options = {};
        for (const arg of args) {
          if (Shape.isObject(arg)) {
            Object.assign(options, arg);
          } else {
            rest.push(arg);
          }
        }
        output.push(options);
        break;
      }
      case 'modes': {
        const out = [];
        for (const arg of args) {
          if (typeof arg === 'string') {
            out.push(arg);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'values': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isValue(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'interval': {
        let interval;
        for (const arg of args) {
          let value = await resolveArray(shape, arg);
          if (interval === undefined && Shape.isArray(value)) {
            const [a = 0, b = 0] = value;
            interval = a < b ? [a, b] : [b, a];
          } else if (interval === undefined && Shape.isNumber(value)) {
            // A number implies an interval of that size centered on zero.
            interval =
              value > 0 ? [value / -2, value / 2] : [value / 2, value / -2];
          } else {
            rest.push(arg);
          }
        }
        output.push(interval);
        break;
      }
      case 'intervals': {
        const out = [];
        for (const arg of args) {
          let value = await resolveArray(shape, arg);
          if (Shape.isArray(value)) {
            const [a = 0, b = 0] = value;
            out.push(a < b ? [a, b] : [b, a]);
          } else if (Shape.isNumber(value)) {
            // A number implies an interval of that size centered on zero.
            out.push(
              value > 0 ? [value / -2, value / 2] : [value / 2, value / -2]
            );
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'shapes': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isShape(value)) {
            out.push(value);
          } else if (Shape.isArray(value) && value.every(Shape.isShape)) {
            out.push(...value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'geometries': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isShape(value)) {
            out.push(await value.toGeometry());
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'coordinates': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(shape, arg);
          if (Shape.isShape(value)) {
            const coordinates = await getCoordinates(value);
            if (coordinates.length > 0) {
              out.push(...coordinates);
            } else {
              rest.push(arg);
            }
          } else if (Shape.isArray(value)) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'rest': {
        output.push(args);
        break;
      }
      default: {
        throw Error(`Unknown destructure2 spec ${spec}`);
      }
    }
    args = rest;
  }
  if (args.length !== 0) {
    console.log(`QQQ/Error: Unused arguments [${args.join(', ')}]`);
    throw Error(`Unused arguments [${args.join(', ')}]`);
  }
  return output;
};

Shape.destructure2 = destructure2;

const destructure2a = async (shape, args, inputSpec, ...specs) => {
  switch (inputSpec) {
    case 'input':
      return [shape, ...(await destructure2(shape, args, ...specs))];
    case 'inputGeometry':
      return [shape.geometry, ...(await destructure2(shape, args, ...specs))];
    default:
      return destructure2(shape, args, inputSpec, ...specs);
  }
};

Shape.destructure2a = destructure2a;

const define = (tag, data) => {
  const define = { tag, data };
  emit({ define, hash: computeHash(define) });
  return data;
};

const defRgbColor = (name, rgb) => define(`color:${name}`, { rgb });

const defThreejsMaterial = (name, definition) =>
  define(`material:${name}`, { threejsMaterial: definition });

const defTool = (name, definition) => define(`tool:${name}`, definition);

const GrblSpindle = ({
  cutDepth = 0.2,
  rpm,
  feedRate,
  drillRate,
  diameter,
  jumpZ = 1,
} = {}) => ({
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

const GrblDynamicLaser = ({
  cutDepth = 0.2,
  diameter = 0.09,
  jumpPower = 0,
  power = 1000,
  speed = 1000,
  warmupDuration,
  warmupPower = 0,
} = {}) => ({
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

const GrblConstantLaser = ({
  cutDepth = 0.2,
  diameter = 0.09,
  jumpPower,
  power = 1000,
  speed = 1000,
  warmupDuration,
  warmupPower = 0,
} = {}) => ({
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

const GrblPlotter = ({ feedRate = 1000, jumpZ = 1 } = {}) => ({
  grbl: { type: 'plotter', feedRate, jumpZ },
});

const md = (strings, ...placeholders) => {
  const md = strings.reduce(
    (result, string, i) => result + placeholders[i - 1] + string
  );
  emit({ md, hash: computeHash(md) });
  return md;
};

Shape.registerMethod('md', (...chunks) => (shape) => {
  const strings = [];
  for (const chunk of chunks) {
    if (chunk instanceof Function) {
      strings.push(chunk(shape));
    } else {
      strings.push(chunk);
    }
  }
  const md = strings.join('');
  emit({ md, hash: computeHash(md) });
  return shape;
});

const Point = Shape.registerMethod(
  'Point',
  (...args) =>
    async (shape) => {
      const [coordinate, x = 0, y = 0, z = 0] = await destructure2(
        shape,
        args,
        'coordinate',
        'number',
        'number',
        'number'
      );
      return Shape.fromPoint(coordinate || [x, y, z]);
    }
);

const ref = Shape.registerMethod(
  'ref',
  () => async (shape) =>
    Shape.fromGeometry(hasTypeReference(await shape.toGeometry()))
);

const Ref = Shape.registerMethod('Ref', (...args) => async (shape) => {
  const point = await Point(...args)(shape);
  const result = ref()(point);
  return result;
});

const X$a = (x = 0) => Ref().x(x);
const Y$a = (y = 0) => Ref().y(y);
const Z$9 = (z = 0) => Ref().z(z);
const XY = (z = 0) => Ref().z(z);
const YX = (z = 0) =>
  Ref()
    .rx(1 / 2)
    .z(z);
const XZ = (y = 0) =>
  Ref()
    .rx(-1 / 4)
    .y(y);
const ZX = (y = 0) =>
  Ref()
    .rx(1 / 4)
    .y(y);
const YZ = (x = 0) =>
  Ref()
    .ry(-1 / 4)
    .x(x);
const ZY = (x = 0) =>
  Ref()
    .ry(1 / 4)
    .x(x);
const RX = (t = 0) => Ref().rx(t);
const RY = (t = 0) => Ref().ry(t);
const RZ = (t = 0) => Ref().rz(t);

const render = (abstract, shape) => {
  const graph = [];
  graph.push('```mermaid');
  graph.push('graph LR;');

  let id = 0;
  const nextId = () => id++;

  const identify = ({ type, tags, content }) => {
    if (content) {
      return { type, tags, id: nextId(), content: content.map(identify) };
    } else {
      return { type, tags, id: nextId() };
    }
  };

  const render = ({ id, type, tags = [], content = [] }) => {
    graph.push(`  ${id}[${type}<br>${tags.join('<br>')}]`);
    for (const child of content) {
      graph.push(`  ${id} --> ${child.id};`);
      render(child);
    }
  };

  render(identify(abstract));

  graph.push('```');

  return shape.md(graph.join('\n'));
};

const abstract = Shape.registerMethod(
  'abstract',
  (types = ['item'], op = render) =>
    async (shape) => {
      const walk = ({ type, tags, plan, content }) => {
        if (type === 'group') {
          return content.flatMap(walk);
        } else if (content) {
          if (types.includes(type)) {
            return [{ type, tags, content: content.flatMap(walk) }];
          } else {
            return content.flatMap(walk);
          }
        } else if (types.includes(type)) {
          return [{ type, tags }];
        } else {
          return [];
        }
      };
      return op(taggedGroup({}, ...walk(await shape.toGeometry())), shape);
    }
);

const approximate = Shape.registerMethod(
  'approximate',
  (...args) =>
    async (shape) => {
      const [options] = await destructure2(shape, args, 'options');
      const {
        iterations,
        relaxationSteps,
        minimumErrorDrop,
        subdivisionRatio,
        relativeToChord,
        withDihedralAngle,
        optimizeAnchorLocation,
        pcaPlane,
        maxNumberOfProxies,
      } = options;
      return Shape.fromGeometry(
        approximate$1(
          shape.toGeometry(),
          iterations,
          relaxationSteps,
          minimumErrorDrop,
          subdivisionRatio,
          relativeToChord,
          withDihedralAngle,
          optimizeAnchorLocation,
          pcaPlane,
          maxNumberOfProxies
        )
      );
    }
);

const absolute = Shape.registerMethod(
  'absolute',
  () => async (shape) =>
    Shape.fromGeometry(makeAbsolute(await shape.toGeometry()))
);

const And = Shape.registerMethod('And', (...args) => async (shape) => {
  const [geometries] = await destructure2(shape, args, 'geometries');
  return Shape.fromGeometry(taggedGroup({}, ...geometries));
});

const and = Shape.registerMethod(
  'and',
  (...args) =>
    async (shape) =>
      shape.And(shape, ...args)
);

const addTo = Shape.registerMethod(
  'addTo',
  (other) => (shape) => other.add(shape)
);

const add$1 = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const distance$3 = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

const scale$3 = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const X$9 = 0;
const Y$9 = 1;
const Z$8 = 2;

const size = Shape.registerMethod(
  'size',
  (op = (size) => (shape) => size) =>
    async (shape) => {
      const geometry = await shape.toGeometry();
      const bounds = measureBoundingBox(geometry);
      if (bounds === undefined) {
        return op({
          length: 0,
          width: 0,
          height: 0,
          max: [0, 0, 0],
          min: [0, 0, 0],
          center: [0, 0, 0],
          radius: 0,
        })(Shape.chain(Shape.fromGeometry(geometry)));
      }
      const [min, max] = bounds;
      const length = max[X$9] - min[X$9];
      const width = max[Y$9] - min[Y$9];
      const height = max[Z$8] - min[Z$8];
      const center = scale$3(0.5, add$1(min, max));
      const radius = distance$3(center, max);
      return op({
        length,
        width,
        height,
        max,
        min,
        center,
        radius,
      })(Shape.chain(Shape.fromGeometry(geometry)));
    }
);

const X$8 = 0;
const Y$8 = 1;
const Z$7 = 2;

const subtract$2 = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

// Round to the nearest 0.001 mm

const round = (v) => Math.round(v * 1000) / 1000;

const roundCoordinate = ([x, y, z]) => [round(x), round(y), round(z)];

const computeOffset = async (spec = 'xyz', origin = [0, 0, 0], shape) => {
  return size(({ max, min, center }) => (shape) => {
    // This is producing very small deviations.
    // FIX: Try a more principled approach.
    max = roundCoordinate(max);
    min = roundCoordinate(min);
    center = roundCoordinate(center);
    const offset = [0, 0, 0];
    let index = 0;
    while (index < spec.length) {
      switch (spec[index++]) {
        case 'x': {
          switch (spec[index]) {
            case '>':
              offset[X$8] = -min[X$8];
              index += 1;
              break;
            case '<':
              offset[X$8] = -max[X$8];
              index += 1;
              break;
            default:
              offset[X$8] = -center[X$8];
          }
          break;
        }
        case 'y': {
          switch (spec[index]) {
            case '>':
              offset[Y$8] = -min[Y$8];
              index += 1;
              break;
            case '<':
              offset[Y$8] = -max[Y$8];
              index += 1;
              break;
            default:
              offset[Y$8] = -center[Y$8];
          }
          break;
        }
        case 'z': {
          switch (spec[index]) {
            case '>':
              offset[Z$7] = -min[Z$7];
              index += 1;
              break;
            case '<':
              offset[Z$7] = -max[Z$7];
              index += 1;
              break;
            default:
              offset[Z$7] = -center[Z$7];
          }
          break;
        }
      }
    }
    if (!offset.every(isFinite)) {
      throw Error(`Non-finite/offset: ${offset}`);
    }
    return offset;
  })(shape);
};

const alignment = Shape.registerMethod(
  'alignment',
  (spec = 'xyz', origin = [0, 0, 0]) =>
    async (shape) => {
      const offset = await computeOffset(spec, origin, shape);
      const reference = await Point().move(...subtract$2(offset, origin));
      return reference;
    }
);

Shape.registerMethod('alignment', alignment);

const toShape = Shape.registerMethod(
  'toShape',
  (value) => async (shape) => {
    if (Shape.isFunction(value)) {
      value = await value(Shape.chain(shape));
    } else {
      value = await value;
    }
    if (Shape.isShape(value)) {
      return value;
    } else {
      throw Error(
        `Expected Function or Shape. Received: ${value.constructor.name}`
      );
    }
  }
);

const toShapes = Shape.registerMethod(
  'toShapes',
  (value) => async (shape) => {
    if (value instanceof Promise) {
      throw Error('toShapes/promise/1');
    }
    if (Shape.isFunction(value)) {
      value = await value(Shape.chain(shape));
    }
    if (value instanceof Promise) {
      throw Error('toShapes/promise/2');
    }
    if (Shape.isShape(value) && value.toGeometry().type === 'group') {
      const out = [];
      for (const geometry of (await value.toGeometry()).content) {
        const item = Shape.fromGeometry(geometry);
        out.push(item);
        if (item instanceof Promise) {
          throw Error('toShapes/promise/2a');
        }
      }
      value = out;
    }
    if (value instanceof Promise) {
      throw Error('toShapes/promise/3');
    }
    if (Shape.isArray(value)) {
      const out = [];
      for (const item of value) {
        if (item === undefined) {
          continue;
        }
        if (item instanceof Promise) {
          throw Error('toShapes/promise/4');
        }
        out.push(...(await toShapes(item)(shape)));
      }
      return out;
    } else {
      if (value instanceof Promise) {
        throw Error('toShapes/promise/5');
      }
      return [await toShape(value)(shape)];
    }
  }
);

const toShapesGeometries = Shape.registerMethod(
  'toShapesGeometries',
  (value) => async (shape) => {
    const shapes = await toShapes(value)(shape);
    const geometries = [];
    for (const shape of shapes) {
      if (shape instanceof Promise) {
        throw Error('promise');
      }
      geometries.push(await shape.toGeometry());
    }
    return geometries;
  }
);

const Group = Shape.registerMethod(
  'Group',
  (...shapes) =>
    async (shape) => {
      for (const item of shapes) {
        if (item instanceof Promise) {
          throw Error(`Group/promise: ${JSON.stringify(await item)}`);
        }
      }
      return Shape.fromGeometry(
        taggedGroup({}, ...(await toShapesGeometries(shapes)(shape)))
      );
    }
);

const op = Shape.registerMethod('op', (...fns) => async (shape) => {
  const results = [];
  for (const fn of fns) {
    if (fn === undefined) {
      continue;
    }
    if (Shape.isShape(fn)) {
      results.push(fn);
    } else {
      const result = await fn(Shape.chain(shape));
      results.push(result);
    }
  }
  return Group(...results);
});

const by = Shape.registerMethod(
  'by',
  (selection, ...ops) =>
    async (shape) => {
      if (ops.length === 0) {
        ops.push((local) => local);
      }
      ops = ops.map((op) => (Shape.isFunction(op) ? op : () => op));
      // We've already selected the item for reference, e.g., s.to(g('plate'), ...);
      if (Shape.isFunction(selection)) {
        selection = await selection(shape);
      }
      const placed = [];
      for (const leaf of getLeafs(await selection.toGeometry())) {
        const { global } = getInverseMatrices(leaf);
        // Perform the operation then place the
        // result in the global frame of the reference.
        placed.push(await op(...ops).transform(global)(shape));
      }
      return Group(...placed);
    }
);

const align = Shape.registerMethod(
  'align',
  (...args) =>
    async (shape) =>
      by(await alignment(...args)(shape))(shape)
);

Shape.registerMethod('align', align);

const aligned = Shape.registerMethod2(
  'aligned',
  ['input', 'shape', 'rest'],
  async (input, alignedShape, rest) =>
    and(by(await alignment(...rest)(input))(alignedShape))(input)
);

Shape.registerMethod('aligned', aligned);

const area = Shape.registerMethod(
  'area',
  (op = (value) => (shape) => value) =>
    (shape) =>
      op(measureArea(shape.toGeometry()))(shape)
);

// Constructs an item from the designator.
const as = Shape.registerMethod(
  'as',
  (...names) =>
    async (shape) =>
      Shape.fromGeometry(
        taggedItem(
          { tags: names.map((name) => `item:${name}`) },
          await shape.toGeometry()
        )
      )
);

// Constructs an item, as a part, from the designator.
const asPart = Shape.registerMethod(
  'asPart',
  (partName) => async (shape) =>
    Shape.fromGeometry(
      taggedItem({ tags: [`part:${partName}`] }, await shape.toGeometry())
    )
);

const transform = Shape.registerMethod(
  'transform',
  (matrix) => async (shape) =>
    Shape.fromGeometry(transform$1(matrix, await shape.toGeometry()))
);

const at = Shape.registerMethod('at', (...args) => async (shape) => {
  const { shapesAndFunctions: ops } = destructure(args);
  const { local, global } = getInverseMatrices(await shape.toGeometry());
  const selections = await toShapes(ops.shift())(shape);
  for (const selection of selections) {
    const { local: selectionLocal, global: selectionGlobal } =
      getInverseMatrices(await selection.toGeometry());
    shape = transform(local)
      .transform(selectionGlobal)
      .op(...ops)
      .transform(selectionLocal)
      .transform(global)(shape);
  }
  return shape;
});

const normal = Shape.registerMethod('normal', () => async (shape) => {
  const result = Shape.fromGeometry(computeNormal(await shape.toGeometry()));
  return result;
});

// This interface is a bit awkward.
const extrudeAlong = Shape.registerMethod(
  'extrudeAlong',
  (...args) =>
    async (shape) => {
      const [vector, modes, intervals] = await destructure2(
        shape,
        args,
        'coordinate',
        'modes',
        'intervals'
      );
      const extrusions = [];
      for (const [depth, height] of intervals) {
        if (height === depth) {
          // Return unextruded geometry at this height, instead.
          extrusions.push(await shape.moveAlong(vector, height));
          continue;
        }
        extrusions.push(
          Shape.fromGeometry(
            extrude(
              await shape.toGeometry(),
              await Point().moveAlong(vector, height).toGeometry(),
              await Point().moveAlong(vector, depth).toGeometry(),
              modes.includes('noVoid')
            )
          )
        );
      }
      return Group(...extrusions);
    }
);

// Note that the operator is applied to each leaf geometry by default.
const e = Shape.registerMethod(
  'e',
  (...extents) =>
    async (shape) =>
      extrudeAlong(normal(), ...extents)(shape)
);

const extrudeX = Shape.registerMethod(
  ['extrudeX', 'ex'],
  (...extents) =>
    (shape) =>
      extrudeAlong(Point(1, 0, 0), ...extents)(shape)
);

const ex = extrudeX;

const extrudeY = Shape.registerMethod(
  ['extrudeY', 'ey'],
  (...extents) =>
    (shape) =>
      extrudeAlong(Point(0, 1, 0), ...extents)(shape)
);

const ey = extrudeY;

const extrudeZ = Shape.registerMethod(
  ['extrudeZ', 'ez'],
  (...extents) =>
    (shape) =>
      extrudeAlong(Point(0, 0, 1), ...extents)(shape)
);

const ez = extrudeZ;

// rx is in terms of turns -- 1/2 is a half turn.
const rx = Shape.registerMethod(
  ['rotateX', 'rx'],
  (...turns) =>
    async (shape) => {
      const rotated = [];
      for (const turn of await shape.toFlatValues(turns)) {
        rotated.push(await transform(fromRotateXToTransform(turn))(shape));
      }
      return Group(...rotated);
    }
);

const rotateX = rx;

// ry is in terms of turns -- 1/2 is a half turn.
const ry = Shape.registerMethod(
  ['rotateY', 'ry'],
  (...turns) =>
    async (shape) => {
      const rotated = [];
      for (const turn of await shape.toFlatValues(turns)) {
        rotated.push(await transform(fromRotateYToTransform(turn))(shape));
      }
      return Group(...rotated);
    }
);

const rotateY = ry;

const Edge = Shape.registerMethod('Edge', (...args) => async (shape) => {
  const [s = [0, 0, 0], t = [0, 0, 0], n = [1, 0, 0]] = await destructure2(
    shape,
    args,
    'coordinate',
    'coordinate',
    'coordinate'
  );
  const inverse = fromSegmentToInverseTransform([s, t], n);
  const baseSegment = [
    transformCoordinate(s, inverse),
    transformCoordinate(t, inverse),
  ];
  const matrix = invertTransform(inverse);
  return Shape.fromGeometry(taggedSegments({ matrix }, [baseSegment]));
});

const Geometry = Shape.registerMethod(
  'Geometry',
  (geometry) => async (shape) => {
    return Shape.chain(Shape.fromGeometry(geometry));
  }
);

const Loop = Shape.registerMethod2(
  'Loop',
  ['geometries'],
  (geometries) =>
    Shape.fromGeometry(link$1(geometries, /* close= */ true))
);

const loop = Shape.registerMethod2(
  'loop',
  ['input', 'shapes'],
  (input, shapes) => Loop(input, ...shapes)
);

const toValue = Shape.registerMethod(
  'toValue',
  (to) => async (shape) => {
    while (Shape.isFunction(to)) {
      to = await to(shape);
    }
    return to;
  }
);

const X$7 = 0;
const Y$7 = 1;
const Z$6 = 2;

const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];
const subtract$1 = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

const computeScale = (
  [ax = 0, ay = 0, az = 0],
  [bx = 0, by = 0, bz = 0]
) => [ax - bx, ay - by, az - bz];

const computeMiddle = (c1, c2) => [
  (c1[X$7] + c2[X$7]) * 0.5,
  (c1[Y$7] + c2[Y$7]) * 0.5,
  (c1[Z$6] + c2[Z$6]) * 0.5,
];

const computeSides = (c1, c2, sides, zag$1 = 0.01) => {
  if (sides) {
    return sides;
  }
  if (zag$1) {
    const diameter = Math.max(...abs(subtract$1(c1, c2)));
    return zag(diameter, zag$1);
  }
  return 32;
};

Shape.registerMethod(
  'updatePlan',
  (...updates) =>
    (shape) => {
      const geometry = shape.toGeometry();
      if (geometry.type !== 'plan') {
        throw Error(`Shape is not a plan: ${JSON.stringify(geometry)}`);
      }
      return Shape.fromGeometry(
        taggedPlan(
          { tags: geometry.tags },
          {
            ...geometry.plan,
            history: [...(geometry.plan.history || []), ...updates],
          }
        )
      );
    }
);

Shape.registerMethod(
  'hasAngle',
  (start = 0, end = 0) =>
    (shape) =>
      shape
        .updatePlan({ angle: { start: start, end: end } })
        .setTag('plan:angle/start', start)
        .setTag('plan:angle/end', end)
);
Shape.registerMethod(
  ['hasC1', 'hasCorner1'],
  (x = 0, y = x, z = 0) =>
    (shape) => {
      return shape.updatePlan({ corner1: [x, y, z] });
    }
);
Shape.registerMethod(
  ['hasC2', 'hasCorner2'],
  (x = 0, y = x, z = 0) =>
    (shape) =>
      shape.updatePlan({
        corner2: [x, y, z],
      })
);
Shape.registerMethod(
  'hasDiameter',
  (x = 1, y = x, z = 0) =>
    (shape) =>
      shape.updatePlan(
        { corner1: [x / 2, y / 2, z / 2] },
        { corner2: [x / -2, y / -2, z / -2] }
      )
);
Shape.registerMethod(
  'hasRadius',
  (x = 1, y = x, z = 0) =>
    (shape) =>
      shape.updatePlan(
        {
          corner1: [x, y, z],
        },
        {
          corner2: [-x, -y, -z],
        }
      )
);
Shape.registerMethod(
  'hasApothem',
  (x = 1, y = x, z = 0) =>
    (shape) =>
      shape.updatePlan(
        {
          corner1: [x, y, z],
        },
        {
          corner2: [-x, -y, -z],
        },
        { apothem: [x, y, z] }
      )
);
Shape.registerMethod(
  'hasSides',
  (sides = 1) =>
    (shape) =>
      shape.updatePlan({ sides }).setTag('plan:sides', sides)
);
Shape.registerMethod(
  'hasZag',
  (zag) => (shape) => shape.updatePlan({ zag }).setTag('plan:zag', zag)
);

const eachEntry = (geometry, op, otherwise) => {
  if (geometry.plan.history) {
    for (let nth = geometry.plan.history.length - 1; nth >= 0; nth--) {
      const result = op(geometry.plan.history[nth]);
      if (result !== undefined) {
        return result;
      }
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

const buildCorners = (x, y, z) => async (shape) => {
  const c1 = [0, 0, 0];
  const c2 = [0, 0, 0];
  if (x instanceof Array) {
    while (x.length < 2) {
      x.push(0);
    }
    x[0] = await toValue(x[0])(shape);
    x[1] = await toValue(x[1])(shape);
    if (x[0] < x[1]) {
      c1[X$7] = x[1];
      c2[X$7] = x[0];
    } else {
      c1[X$7] = x[0];
      c2[X$7] = x[1];
    }
  } else {
    x = await toValue(x)(shape);
    c1[X$7] = x / 2;
    c2[X$7] = x / -2;
  }
  if (y instanceof Array) {
    while (y.length < 2) {
      y.push(0);
    }
    y[0] = await toValue(y[0])(shape);
    y[1] = await toValue(y[1])(shape);
    if (y[0] < y[1]) {
      c1[Y$7] = y[1];
      c2[Y$7] = y[0];
    } else {
      c1[Y$7] = y[0];
      c2[Y$7] = y[1];
    }
  } else {
    y = await toValue(y)(shape);
    c1[Y$7] = y / 2;
    c2[Y$7] = y / -2;
  }
  if (z instanceof Array) {
    while (z.length < 2) {
      z.push(0);
    }
    z[0] = await toValue(z[0])(shape);
    z[1] = await toValue(z[1])(shape);
    if (z[0] < z[1]) {
      c1[Z$6] = z[1];
      c2[Z$6] = z[0];
    } else {
      c1[Z$6] = z[0];
      c2[Z$6] = z[1];
    }
  } else {
    z = await toValue(z)(shape);
    c1[Z$6] = z / 2;
    c2[Z$6] = z / -2;
  }
  return [c1, c2];
};

const Plan = (type) => Shape.fromGeometry(taggedPlan({}, { type }));

const X$6 = 0;
const Y$6 = 1;
const Z$5 = 2;

let fundamentalShapes;

const buildFs = async () => {
  if (fundamentalShapes === undefined) {
    const f = await Loop(
      Point(1, 0, 0),
      Point(1, 1, 0),
      Point(0, 1, 0),
      Point(0, 0, 0)
    ).fill();
    fundamentalShapes = {
      tlfBox: await Point(),
      tlBox: await Edge(Point(0, 1, 0), Point(0, 0, 0)),
      tfBox: await Edge(Point(0, 0, 0), Point(1, 0, 0)),
      tBox: await f,
      lfBox: await Edge(Point(0, 0, 0), Point(0, 0, 1)),
      lBox: await f
        .ry(1 / 4)
        .rz(1 / 2)
        .rx(-1 / 4),
      fBox: await f
        .rx(1 / 4)
        .rz(1 / 2)
        .ry(-1 / 4),
      box: await f.ez([1]),
    };
  }
  return fundamentalShapes;
};

const reifyBox = async (corner1, corner2, isOcct = false) => {
  const build = async () => {
    const fs = await buildFs();
    const left = corner2[X$6];
    const right = corner1[X$6];

    const front = corner2[Y$6];
    const back = corner1[Y$6];

    const bottom = corner2[Z$5];
    const top = corner1[Z$5];

    if (top === bottom) {
      if (left === right) {
        if (front === back) {
          return fs.tlfBox.move(left, front, bottom);
        } else {
          return fs.tlBox.sy(back - front).move(left, front, bottom);
        }
      } else {
        if (front === back) {
          return fs.tfBox.sx(right - left).move(left, front, bottom);
        } else {
          const v1 = fs;
          const v2 = v1.tBox;
          const v3 = v2.sx(right - left);
          const v4 = v3.sy(back - front);
          const v5 = v4.move(left, front, bottom);
          return v5;
        }
      }
    } else {
      if (left === right) {
        if (front === back) {
          return fs.lfBox.sz(top - bottom).move(left, front, bottom);
        } else {
          return fs.lBox
            .sz(top - bottom)
            .sy(back - front)
            .move(left, front, bottom);
        }
      } else {
        if (front === back) {
          return fs.fBox
            .sz(top - bottom)
            .sx(right - left)
            .move(left, front, bottom);
        } else {
          if (isOcct) {
            return Geometry(
              makeOcctBox(right - left, back - front, top - bottom)
            ).move(left, front, bottom);
          } else {
            return fs.box
              .sz(top - bottom)
              .sx(right - left)
              .sy(back - front)
              .move(left, front, bottom);
          }
        }
      }
    }
  };

  return (await build()).absolute();
};

const Box = Shape.registerMethod('Box', (...args) => async (shape) => {
  const [modes, intervals, options] = await destructure2(
    shape,
    args,
    'modes',
    'intervals',
    'options'
  );
  const [x = 1, y = x, z = 0] = intervals;
  const [computedC1, computedC2] = await buildCorners(x, y, z)(shape);
  let { c1 = computedC1, c2 = computedC2 } = options;
  return reifyBox(c1, c2, modes.includes('occt'));
});

const Empty = Shape.registerMethod(
  'Empty',
  (...shapes) =>
    async (shape) =>
      Shape.fromGeometry(taggedGroup({}))
);

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const bb = Shape.registerMethod(
  'bb',
  (xOffset = 1, yOffset = xOffset, zOffset = yOffset) =>
    async (shape) => {
      const geometry = await shape.toGeometry();
      const bounds = measureBoundingBox(geometry);
      if (bounds === undefined) {
        return Empty();
      } else {
        const [min, max] = bounds;
        return Box({
          c2: add(min, [-xOffset, -yOffset, -zOffset]),
          c1: add(max, [xOffset, yOffset, zOffset]),
        });
      }
    }
);

const bend = Shape.registerMethod(
  'bend',
  (radius = 100) =>
    async (shape) =>
      Shape.fromGeometry(bend$1(await shape.toGeometry(), radius))
);

const qualifyTag = (tag, namespace = 'user') => {
  if (tag.includes(':')) {
    return tag;
  }
  return `${namespace}:${tag}`;
};

const tagMatcher = (tag, namespace = 'user') => {
  let qualifiedTag = qualifyTag(tag, namespace);
  if (qualifiedTag.endsWith('=*')) {
    const [base] = qualifiedTag.split('=');
    const prefix = `${base}=`;
    return (tag) => tag.startsWith(prefix);
  } else if (qualifiedTag.endsWith(':*')) {
    const [namespace] = qualifiedTag.split(':');
    const prefix = `${namespace}:`;
    return (tag) => tag.startsWith(prefix);
  } else {
    return (tag) => tag === qualifiedTag;
  }
};

const oneOfTagMatcher = (tags, namespace = 'user') => {
  const matchers = tags.map((tag) => tagMatcher(tag, namespace));
  const isMatch = (tag) => {
    for (const matcher of matchers) {
      if (matcher(tag)) {
        return true;
      }
    }
    return false;
  };
  return isMatch;
};

const tagGeometry = (geometry, tags) => {
  const tagsToAdd = tags.map((tag) => qualifyTag(tag, 'user'));
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout': {
        return descend();
      }
      default: {
        const tags = [...(geometry.tags || [])];
        for (const tagToAdd of tagsToAdd) {
          if (!tags.includes(tagToAdd)) {
            tags.push(tagToAdd);
          }
        }
        return descend({ tags });
      }
    }
  };
  return rewrite(geometry, op);
};

const tag = Shape.registerMethod(
  'tag',
  (...tags) =>
    async (shape) =>
      Shape.fromGeometry(tagGeometry(await shape.toGeometry(), tags))
);

const get = Shape.registerMethod(
  ['get', 'g'],
  (...args) =>
    async (shape) => {
      const { strings: tags, func: groupOp = Group } = destructure(args);
      const isMatch = oneOfTagMatcher(tags, 'item');
      const picks = [];
      const walk = (geometry, descend) => {
        const { tags, type } = geometry;
        if (type === 'group') {
          return descend();
        }
        if (isMatch(`type:${geometry.type}`)) {
          picks.push(Shape.fromGeometry(geometry));
        } else {
          for (const tag of tags) {
            if (isMatch(tag)) {
              picks.push(Shape.fromGeometry(geometry));
              break;
            }
          }
        }
        if (type !== 'item') {
          return descend();
        }
      };
      const geometry = await shape.toGeometry();
      visit(geometry, walk);
      return groupOp(...picks);
    }
);

const g = get;

const Note = (md) => {
  if (Array.isArray(md)) {
    md = md.join(', ');
  }
  emit({ md, hash: computeHash(md) });
};

const note = Shape.registerMethod('note', (md) => (shape) => {
  Note(md);
  return shape;
});

// Is this better than s.get('part:*').tags('part')?
const billOfMaterials = Shape.registerMethod(
  ['billOfMaterials', 'bom'],
  (op = (...list) => note(`Materials: ${list.join(', ')}`)) =>
    (shape) =>
      get('part:*').tags('part', op)(shape)
);

const center = Shape.registerMethod(
  'center',
  () => (shape) => Shape.fromGeometry(computeCentroid(shape.toGeometry()))
);

const Hull = Shape.registerMethod(
  'Hull',
  (...shapes) =>
    async (shape) =>
      Shape.fromGeometry(convexHull(await toShapesGeometries(shapes)(shape)))
);

const hull = Shape.registerMethod(
  'hull',
  (...shapes) =>
    async (shape) =>
      Hull(shape, ...shapes)(shape)
);

const toShapeGeometry = Shape.registerMethod(
  'toShapeGeometry',
  (value) => async (shape) => {
    const valueShape = await toShape(value)(shape);
    return valueShape.toGeometry();
  }
);

const Join = Shape.registerMethod(
  ['Fuse', 'Join'],
  (...args) =>
    async (shape) => {
      const [modes, shapes] = await destructure2(
        shape,
        args,
        'modes',
        'shapes'
      );
      const group = await Group(...shapes);
      return Shape.fromGeometry(
        fuse$1(await toShapeGeometry(group)(shape), modes.includes('exact'))
      );
    }
);

const join = Shape.registerMethod(
  ['add', 'join'],
  (...args) =>
    async (shape) => {
      const [modes, shapes] = await destructure2(
        shape,
        args,
        'modes',
        'shapes'
      );
      return Shape.fromGeometry(
        join$1(
          await shape.toGeometry(),
          await shape.toShapesGeometries(shapes),
          modes.includes('exact'),
          modes.includes('noVoid')
        )
      );
    }
);

const ChainHull = Shape.registerMethod(
  'ChainHull',
  (...args) =>
    async (shape) => {
      const [shapes] = await destructure2(shape, args, 'shapes');
      const chain = [];
      for (let nth = 1; nth < shapes.length; nth++) {
        chain.push(await Hull(shapes[nth - 1], shapes[nth])(shape));
      }
      return Join(...chain);
    }
);

const chainHull = Shape.registerMethod(
  'chainHull',
  (...shapes) =>
    (shape) =>
      ChainHull(shape, ...shapes)(shape)
);

const clean = Shape.registerMethod(
  'clean',
  () => async (shape) => Shape.fromGeometry(noGhost(await shape.toGeometry()))
);

// It's not entirely clear that Clip makes sense, but we set it up to clip the first argument for now.
const Clip = Shape.registerMethod2(
  'Clip',
  ['modes', 'geometry', 'geometries'],
  async (modes, first, rest) =>
    Shape.fromGeometry(
      clip$1(
        first,
        rest,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

const clip = Shape.registerMethod2(
  'clip',
  ['inputGeometry', 'modes', 'geometries'],
  (inputGeometry, modes, geometries) =>
    Shape.fromGeometry(
      clip$1(
        inputGeometry,
        geometries,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

const clipFrom = Shape.registerMethod(
  'clipFrom',
  (other) => (shape) => other.clip(shape)
);

const untagGeometry = (geometry, tags) => {
  const isMatch = oneOfTagMatcher(tags, 'user');
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'group':
      case 'layout':
        return descend();
      default: {
        const { tags = [] } = geometry;
        const remaining = [];
        for (const tag of tags) {
          if (!isMatch(tag)) {
            remaining.push(tag);
          }
        }
        return descend({ tags: remaining });
      }
    }
  };
  return rewrite(geometry, op);
};

const untag = Shape.registerMethod(
  'untag',
  (...tags) =>
    async (shape) =>
      Shape.fromGeometry(untagGeometry(await shape.toGeometry(), tags))
);

const color = Shape.registerMethod(
  'color',
  (name) => async (shape) =>
    untag('color:*').tag(...toTagsFromName(name))(shape)
);

// The semantics here are not very clear -- this computes a volume that all volumes in the shape have in common.
const commonVolume = Shape.registerMethod(
  'commonVolume',
  (...args) =>
    async (shape) => {
      const [modes, shapes] = await destructure2(
        shape,
        args,
        'modes',
        'shapes'
      );
      const collectedGeometry = await Group(shape, ...shapes).toGeometry();
      const [first, ...rest] = linearize(
        collectedGeometry,
        ({ type }) => type === 'graph'
      );
      return fromGeometry(
        clip$1(
          first,
          rest,
          modes.includes('open'),
          modes.includes('exact'),
          modes.includes('noVoid'),
          modes.includes('noGhost')
        )
      );
    }
);

const copy = Shape.registerMethod('copy', (count) => async (shape) => {
  const copies = [];
  const limit = await shape.toValue(count);
  for (let nth = 0; nth < limit; nth++) {
    copies.push(shape);
  }
  return Group(...copies);
});

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
var extendStatics=function(d,b){return extendStatics=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(d,b){d.__proto__=b;}||function(d,b){for(var p in b)b.hasOwnProperty(p)&&(d[p]=b[p]);},extendStatics(d,b)};function __extends(d,b){function __(){this.constructor=d;}extendStatics(d,b),d.prototype=null===b?Object.create(b):(__.prototype=b.prototype,new __);}var __assign=function(){return __assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++)for(var p in s=arguments[i])Object.prototype.hasOwnProperty.call(s,p)&&(t[p]=s[p]);return t},__assign.apply(this,arguments)};function extrapolateControlPoint(u,v){for(var e=new Array(u.length),i=0;i<u.length;i++)e[i]=2*u[i]-v[i];return e}function getControlPoints(idx,points,closed){var p0,p1,p2,p3,maxIndex=points.length-1;if(closed)p0=points[idx-1<0?maxIndex:idx-1],p1=points[idx%points.length],p2=points[(idx+1)%points.length],p3=points[(idx+2)%points.length];else {if(idx===maxIndex)throw Error("There is no spline segment at this index for a closed curve!");p1=points[idx],p2=points[idx+1],p0=idx>0?points[idx-1]:extrapolateControlPoint(p1,p2),p3=idx<maxIndex-1?points[idx+2]:extrapolateControlPoint(p2,p1);}return [p0,p1,p2,p3]}function getSegmentIndexAndT(ct,points,closed){void 0===closed&&(closed=!1);var nPoints=closed?points.length:points.length-1;if(1===ct)return {index:nPoints-1,weight:1};var p=nPoints*ct,index=Math.floor(p);return {index:index,weight:p-index}}function fill$1(v,val){for(var i=0;i<v.length;i++)v[i]=val;return v}function map(v,func){for(var i=0;i<v.length;i++)v[i]=func(v[i],i);return v}function reduce(v,func,r){void 0===r&&(r=0);for(var i=0;i<v.length;i++)r=func(r,v[i],i);return r}function copyValues(source,target){target=target||new Array(source.length);for(var i=0;i<source.length;i++)target[i]=source[i];return target}function clamp(value,min,max){return void 0===min&&(min=0),void 0===max&&(max=1),value<min?min:value>max?max:value}function binarySearch(targetValue,accumulatedValues){var min=accumulatedValues[0];if(targetValue>=accumulatedValues[accumulatedValues.length-1])return accumulatedValues.length-1;if(targetValue<=min)return 0;for(var left=0,right=accumulatedValues.length-1;left<=right;){var mid=Math.floor((left+right)/2),lMid=accumulatedValues[mid];if(lMid<targetValue)left=mid+1;else {if(!(lMid>targetValue))return mid;right=mid-1;}}return Math.max(0,right)}var EPS=Math.pow(2,-42);function cuberoot(x){var y=Math.pow(Math.abs(x),1/3);return x<0?-y:y}function getQuadRoots(a,b,c){if(Math.abs(a)<EPS)return Math.abs(b)<EPS?[]:[-c/b];var D=b*b-4*a*c;return Math.abs(D)<EPS?[-b/(2*a)]:D>0?[(-b+Math.sqrt(D))/(2*a),(-b-Math.sqrt(D))/(2*a)]:[]}function getCubicRoots(a,b,c,d){if(Math.abs(a)<EPS)return getQuadRoots(b,c,d);var roots,p=(3*a*c-b*b)/(3*a*a),q=(2*b*b*b-9*a*b*c+27*a*a*d)/(27*a*a*a);if(Math.abs(p)<EPS)roots=[cuberoot(-q)];else if(Math.abs(q)<EPS)roots=[0].concat(p<0?[Math.sqrt(-p),-Math.sqrt(-p)]:[]);else {var D=q*q/4+p*p*p/27;if(Math.abs(D)<EPS)roots=[-1.5*q/p,3*q/p];else if(D>0){roots=[(u=cuberoot(-q/2-Math.sqrt(D)))-p/(3*u)];}else {var u=2*Math.sqrt(-p/3),t=Math.acos(3*q/p/u)/3,k=2*Math.PI/3;roots=[u*Math.cos(t),u*Math.cos(t-k),u*Math.cos(t-2*k)];}}for(var i=0;i<roots.length;i++)roots[i]-=b/(3*a);return roots}function dot(v1,v2){if(v1.length!==v2.length)throw Error("Vectors must be of equal length!");for(var p=0,k=0;k<v1.length;k++)p+=v1[k]*v2[k];return p}function cross$1(v1,v2,target){if(!(v1.length>3)){target=target||new Array(3);var ax=v1[0],ay=v1[1],az=v1[2]||0,bx=v2[0],by=v2[1],bz=v2[2]||0;return target[0]=ay*bz-az*by,target[1]=az*bx-ax*bz,target[2]=ax*by-ay*bx,target}}function sumOfSquares(v1,v2){for(var sumOfSquares=0,i=0;i<v1.length;i++)sumOfSquares+=(v1[i]-v2[i])*(v1[i]-v2[i]);return sumOfSquares}function magnitude(v){for(var sumOfSquares=0,i=0;i<v.length;i++)sumOfSquares+=v[i]*v[i];return Math.sqrt(sumOfSquares)}function distance$2(p1,p2){var sqrs=sumOfSquares(p1,p2);return 0===sqrs?0:Math.sqrt(sqrs)}function normalize$1(v,target){var u=target?copyValues(v,target):v,squared=reduce(u,(function(s,c){return s+Math.pow(c,2)})),l=Math.sqrt(squared);return 0===l?fill$1(u,0):map(u,(function(c){return c/l}))}function orthogonal(v,target){if(v.length>2)throw Error("Only supported for 2d vectors");var u=target?copyValues(v,target):v,x=-u[1];return u[1]=u[0],u[0]=x,u}function calcKnotSequence(p0,p1,p2,p3,alpha){if(void 0===alpha&&(alpha=0),0===alpha)return [0,1,2,3];var deltaT=function(u,v){return Math.pow(sumOfSquares(u,v),.5*alpha)},t1=deltaT(p1,p0),t2=deltaT(p2,p1)+t1;return [0,t1,t2,deltaT(p3,p2)+t2]}function calculateCoefficients(p0,p1,p2,p3,options){for(var tension=Number.isFinite(options.tension)?options.tension:.5,alpha=Number.isFinite(options.alpha)?options.alpha:null,knotSequence=alpha>0?calcKnotSequence(p0,p1,p2,p3,alpha):null,coefficientsList=new Array(p0.length),k=0;k<p0.length;k++){var u=0,v=0,v0=p0[k],v1=p1[k],v2=p2[k],v3=p3[k];if(knotSequence){var t0=knotSequence[0],t1=knotSequence[1],t2=knotSequence[2],t3=knotSequence[3];t1-t2!=0&&(t0-t1!=0&&t0-t2!=0&&(u=(1-tension)*(t2-t1)*((v0-v1)/(t0-t1)-(v0-v2)/(t0-t2)+(v1-v2)/(t1-t2))),t1-t3!=0&&t2-t3!=0&&(v=(1-tension)*(t2-t1)*((v1-v2)/(t1-t2)-(v1-v3)/(t1-t3)+(v2-v3)/(t2-t3))));}else u=(1-tension)*(v2-v0)*.5,v=(1-tension)*(v3-v1)*.5;var a=2*v1-2*v2+u+v,b=-3*v1+3*v2-2*u-v,c=u,d=v1;coefficientsList[k]=[a,b,c,d];}return coefficientsList}function valueAtT(t,coefficients){var t2=t*t,t3=t*t2;return coefficients[0]*t3+coefficients[1]*t2+coefficients[2]*t+coefficients[3]}function derivativeAtT(t,coefficients){var t2=t*t;return 3*coefficients[0]*t2+2*coefficients[1]*t+coefficients[2]}function secondDerivativeAtT(t,coefficients){return 6*coefficients[0]*t+2*coefficients[1]}function findRootsOfT(lookup,coefficients){var a=coefficients[0],b=coefficients[1],c=coefficients[2],x=coefficients[3]-lookup;return 0===a&&0===b&&0===c&&0===x?[0]:getCubicRoots(a,b,c,x).filter((function(t){return t>-EPS&&t<=1+EPS})).map((function(t){return clamp(t,0,1)}))}function evaluateForT(func,t,coefficients,target){void 0===target&&(target=null),target=target||new Array(coefficients.length);for(var k=0;k<coefficients.length;k++)target[k]=func(t,coefficients[k]);return target}var AbstractCurveMapper=function(){function AbstractCurveMapper(onInvalidateCache){void 0===onInvalidateCache&&(onInvalidateCache=null),this._alpha=0,this._tension=.5,this._closed=!1,this._onInvalidateCache=null,this._onInvalidateCache=onInvalidateCache,this._cache={arcLengths:null,coefficients:null};}return AbstractCurveMapper.prototype._invalidateCache=function(){this.points&&(this._cache={arcLengths:null,coefficients:null},this._onInvalidateCache&&this._onInvalidateCache());},Object.defineProperty(AbstractCurveMapper.prototype,"alpha",{get:function(){return this._alpha},set:function(alpha){Number.isFinite(alpha)&&alpha!==this._alpha&&(this._invalidateCache(),this._alpha=alpha);},enumerable:!1,configurable:!0}),Object.defineProperty(AbstractCurveMapper.prototype,"tension",{get:function(){return this._tension},set:function(tension){Number.isFinite(tension)&&tension!==this._tension&&(this._invalidateCache(),this._tension=tension);},enumerable:!1,configurable:!0}),Object.defineProperty(AbstractCurveMapper.prototype,"points",{get:function(){return this._points},set:function(points){if(!points||points.length<2)throw Error("At least 2 control points are required!");this._points=points,this._invalidateCache();},enumerable:!1,configurable:!0}),Object.defineProperty(AbstractCurveMapper.prototype,"closed",{get:function(){return this._closed},set:function(closed){closed=!!closed,this._closed!==closed&&(this._invalidateCache(),this._closed=closed);},enumerable:!1,configurable:!0}),AbstractCurveMapper.prototype.reset=function(){this._invalidateCache();},AbstractCurveMapper.prototype.evaluateForT=function(func,t,target){var _a=getSegmentIndexAndT(t,this.points,this.closed),index=_a.index;return evaluateForT(func,_a.weight,this.getCoefficients(index),target)},AbstractCurveMapper.prototype.getCoefficients=function(idx){if(this.points){if(this._cache.coefficients||(this._cache.coefficients=new Map),!this._cache.coefficients.has(idx)){var _a=getControlPoints(idx,this.points,this.closed),coefficients=calculateCoefficients(_a[0],_a[1],_a[2],_a[3],{tension:this.tension,alpha:this.alpha});this._cache.coefficients.set(idx,coefficients);}return this._cache.coefficients.get(idx)}},AbstractCurveMapper}(),SegmentedCurveMapper=function(_super){function SegmentedCurveMapper(subDivisions,onInvalidateCache){void 0===subDivisions&&(subDivisions=300),void 0===onInvalidateCache&&(onInvalidateCache=null);var _this=_super.call(this,onInvalidateCache)||this;return _this._subDivisions=subDivisions,_this}return __extends(SegmentedCurveMapper,_super),Object.defineProperty(SegmentedCurveMapper.prototype,"arcLengths",{get:function(){return this._cache.arcLengths||(this._cache.arcLengths=this.computeArcLengths()),this._cache.arcLengths},enumerable:!1,configurable:!0}),SegmentedCurveMapper.prototype._invalidateCache=function(){_super.prototype._invalidateCache.call(this),this._cache.arcLengths=null;},SegmentedCurveMapper.prototype.computeArcLengths=function(){var current,lengths=[],last=this.evaluateForT(valueAtT,0),sum=0;lengths.push(0);for(var p=1;p<=this._subDivisions;p++)sum+=distance$2(current=this.evaluateForT(valueAtT,p/this._subDivisions),last),lengths.push(sum),last=current;return lengths},SegmentedCurveMapper.prototype.lengthAt=function(u){var arcLengths=this.arcLengths;return u*arcLengths[arcLengths.length-1]},SegmentedCurveMapper.prototype.getT=function(u){var arcLengths=this.arcLengths,il=arcLengths.length,targetArcLength=u*arcLengths[il-1],i=binarySearch(targetArcLength,arcLengths);if(arcLengths[i]===targetArcLength)return i/(il-1);var lengthBefore=arcLengths[i];return (i+(targetArcLength-lengthBefore)/(arcLengths[i+1]-lengthBefore))/(il-1)},SegmentedCurveMapper.prototype.getU=function(t){if(0===t)return 0;if(1===t)return 1;var arcLengths=this.arcLengths,al=arcLengths.length-1,totalLength=arcLengths[al],tIdx=t*al,subIdx=Math.floor(tIdx),l1=arcLengths[subIdx];if(tIdx===subIdx)return l1/totalLength;var t0=subIdx/al;return (l1+distance$2(this.evaluateForT(valueAtT,t0),this.evaluateForT(valueAtT,t)))/totalLength},SegmentedCurveMapper}(AbstractCurveMapper),lut=[[[-.906179845938664,.23692688505618908],[-.5384693101056831,.47862867049936647],[0,.5688888888888889],[.5384693101056831,.47862867049936647],[.906179845938664,.23692688505618908]],[[-.932469514203152,.17132449237917036],[-.6612093864662645,.3607615730481386],[-.2386191860831969,.46791393457269104],[.2386191860831969,.46791393457269104],[.6612093864662645,.3607615730481386],[.932469514203152,.17132449237917036]],[[-.9491079123427585,.1294849661688697],[-.7415311855993945,.27970539148927664],[-.4058451513773972,.3818300505051189],[0,.4179591836734694],[.4058451513773972,.3818300505051189],[.7415311855993945,.27970539148927664],[.9491079123427585,.1294849661688697]],[[-.9602898564975363,.10122853629037626],[-.7966664774136267,.22238103445337448],[-.525532409916329,.31370664587788727],[-.1834346424956498,.362683783378362],[.1834346424956498,.362683783378362],[.525532409916329,.31370664587788727],[.7966664774136267,.22238103445337448],[.9602898564975363,.10122853629037626]],[[-.9681602395076261,.08127438836157441],[-.8360311073266358,.1806481606948574],[-.6133714327005904,.26061069640293544],[-.3242534234038089,.31234707704000286],[0,.3302393550012598],[.3242534234038089,.31234707704000286],[.6133714327005904,.26061069640293544],[.8360311073266358,.1806481606948574],[.9681602395076261,.08127438836157441]],[[-.9739065285171717,.06667134430868814],[-.8650633666889845,.1494513491505806],[-.6794095682990244,.21908636251598204],[-.4333953941292472,.26926671930999635],[-.14887433898163122,.29552422471475287],[.14887433898163122,.29552422471475287],[.4333953941292472,.26926671930999635],[.6794095682990244,.21908636251598204],[.8650633666889845,.1494513491505806],[.9739065285171717,.06667134430868814]],[[-.978228658146056,.0556685671161736],[-.887062599768095,.125580369464904],[-.730152005574049,.186290210927734],[-.519096129206811,.23319376459199],[-.269543155952344,.262804544510246],[0,.2729250867779],[.269543155952344,.262804544510246],[.519096129206811,.23319376459199],[.730152005574049,.186290210927734],[.887062599768095,.125580369464904],[.978228658146056,.0556685671161736]],[[-.981560634246719,.0471753363865118],[-.904117256370474,.106939325995318],[-.769902674194304,.160078328543346],[-.587317954286617,.203167426723065],[-.36783149899818,.233492536538354],[-.125233408511468,.249147045813402],[.125233408511468,.249147045813402],[.36783149899818,.233492536538354],[.587317954286617,.203167426723065],[.769902674194304,.160078328543346],[.904117256370474,.106939325995318],[.981560634246719,.0471753363865118]],[[-.984183054718588,.0404840047653158],[-.917598399222977,.0921214998377284],[-.801578090733309,.138873510219787],[-.64234933944034,.178145980761945],[-.448492751036446,.207816047536888],[-.230458315955134,.226283180262897],[0,.232551553230873],[.230458315955134,.226283180262897],[.448492751036446,.207816047536888],[.64234933944034,.178145980761945],[.801578090733309,.138873510219787],[.917598399222977,.0921214998377284],[.984183054718588,.0404840047653158]],[[-.986283808696812,.0351194603317518],[-.928434883663573,.0801580871597602],[-.827201315069764,.121518570687903],[-.687292904811685,.157203167158193],[-.515248636358154,.185538397477937],[-.319112368927889,.205198463721295],[-.108054948707343,.215263853463157],[.108054948707343,.215263853463157],[.319112368927889,.205198463721295],[.515248636358154,.185538397477937],[.687292904811685,.157203167158193],[.827201315069764,.121518570687903],[.928434883663573,.0801580871597602],[.986283808696812,.0351194603317518]],[[-.987992518020485,.0307532419961172],[-.937273392400705,.0703660474881081],[-.848206583410427,.107159220467171],[-.72441773136017,.139570677926154],[-.570972172608538,.166269205816993],[-.394151347077563,.186161000015562],[-.201194093997434,.198431485327111],[0,.202578241925561],[.201194093997434,.198431485327111],[.394151347077563,.186161000015562],[.570972172608538,.166269205816993],[.72441773136017,.139570677926154],[.848206583410427,.107159220467171],[.937273392400705,.0703660474881081],[.987992518020485,.0307532419961172]],[[-.989400934991649,.027152459411754],[-.944575023073232,.0622535239386478],[-.865631202387831,.0951585116824927],[-.755404408355003,.124628971255533],[-.617876244402643,.149595988816576],[-.458016777657227,.169156519395002],[-.281603550779258,.182603415044923],[-.0950125098376374,.189450610455068],[.0950125098376374,.189450610455068],[.281603550779258,.182603415044923],[.458016777657227,.169156519395002],[.617876244402643,.149595988816576],[.755404408355003,.124628971255533],[.865631202387831,.0951585116824927],[.944575023073232,.0622535239386478],[.989400934991649,.027152459411754]],[[-.990575475314417,.0241483028685479],[-.950675521768767,.0554595293739872],[-.880239153726985,.0850361483171791],[-.781514003896801,.111883847193403],[-.65767115921669,.135136368468525],[-.512690537086476,.15404576107681],[-.351231763453876,.16800410215645],[-.178484181495847,.176562705366992],[0,.179446470356206],[.178484181495847,.176562705366992],[.351231763453876,.16800410215645],[.512690537086476,.15404576107681],[.65767115921669,.135136368468525],[.781514003896801,.111883847193403],[.880239153726985,.0850361483171791],[.950675521768767,.0554595293739872],[.990575475314417,.0241483028685479]],[[-.99156516842093,.0216160135264833],[-.955823949571397,.0497145488949698],[-.892602466497555,.076425730254889],[-.803704958972523,.100942044106287],[-.691687043060353,.122555206711478],[-.559770831073947,.14064291467065],[-.411751161462842,.154684675126265],[-.251886225691505,.164276483745832],[-.0847750130417353,.169142382963143],[.0847750130417353,.169142382963143],[.251886225691505,.164276483745832],[.411751161462842,.154684675126265],[.559770831073947,.14064291467065],[.691687043060353,.122555206711478],[.803704958972523,.100942044106287],[.892602466497555,.076425730254889],[.955823949571397,.0497145488949697],[.99156516842093,.0216160135264833]],[[-.992406843843584,.0194617882297264],[-.96020815213483,.0448142267656996],[-.903155903614817,.0690445427376412],[-.822714656537142,.0914900216224499],[-.720966177335229,.111566645547333],[-.600545304661681,.128753962539336],[-.46457074137596,.142606702173606],[-.316564099963629,.152766042065859],[-.160358645640225,.158968843393954],[0,.161054449848783],[.160358645640225,.158968843393954],[.316564099963629,.152766042065859],[.46457074137596,.142606702173606],[.600545304661681,.128753962539336],[.720966177335229,.111566645547333],[.822714656537142,.0914900216224499],[.903155903614817,.0690445427376412],[.96020815213483,.0448142267656996],[.992406843843584,.0194617882297264]],[[-.993128599185094,.0176140071391521],[-.963971927277913,.0406014298003869],[-.912234428251325,.062672048334109],[-.839116971822218,.0832767415767047],[-.74633190646015,.10193011981724],[-.636053680726515,.118194531961518],[-.510867001950827,.131688638449176],[-.373706088715419,.142096109318382],[-.227785851141645,.149172986472603],[-.0765265211334973,.152753387130725],[.0765265211334973,.152753387130725],[.227785851141645,.149172986472603],[.373706088715419,.142096109318382],[.510867001950827,.131688638449176],[.636053680726515,.118194531961518],[.74633190646015,.10193011981724],[.839116971822218,.0832767415767047],[.912234428251325,.062672048334109],[.963971927277913,.0406014298003869],[.993128599185094,.0176140071391521]],[[-.993752170620389,.0160172282577743],[-.967226838566306,.0369537897708524],[-.9200993341504,.0571344254268572],[-.853363364583317,.0761001136283793],[-.768439963475677,.0934444234560338],[-.667138804197412,.108797299167148],[-.551618835887219,.121831416053728],[-.424342120207438,.132268938633337],[-.288021316802401,.139887394791073],[-.145561854160895,.14452440398997],[0,.14608113364969],[.145561854160895,.14452440398997],[.288021316802401,.139887394791073],[.424342120207438,.132268938633337],[.551618835887219,.121831416053728],[.667138804197412,.108797299167148],[.768439963475677,.0934444234560338],[.853363364583317,.0761001136283793],[.9200993341504,.0571344254268572],[.967226838566306,.0369537897708524],[.993752170620389,.0160172282577743]],[[-.994294585482399,.0146279952982722],[-.970060497835428,.0337749015848141],[-.926956772187174,.0522933351526832],[-.8658125777203,.0697964684245204],[-.787816805979208,.0859416062170677],[-.694487263186682,.10041414444288],[-.587640403506911,.112932296080539],[-.469355837986757,.123252376810512],[-.341935820892084,.131173504787062],[-.207860426688221,.136541498346015],[-.0697392733197222,.139251872855631],[.0697392733197222,.139251872855631],[.207860426688221,.136541498346015],[.341935820892084,.131173504787062],[.469355837986757,.123252376810512],[.587640403506911,.112932296080539],[.694487263186682,.10041414444288],[.787816805979208,.0859416062170677],[.8658125777203,.0697964684245204],[.926956772187174,.0522933351526832],[.970060497835428,.0337749015848141],[.994294585482399,.0146279952982722]],[[-.994769334997552,.0134118594871417],[-.972542471218115,.0309880058569794],[-.932971086826016,.0480376717310846],[-.876752358270441,.0642324214085258],[-.804888401618839,.0792814117767189],[-.71866136313195,.0929157660600351],[-.619609875763646,.104892091464541],[-.509501477846007,.114996640222411],[-.39030103803029,.123049084306729],[-.264135680970344,.128905722188082],[-.133256824298466,.132462039404696],[0,.133654572186106],[.133256824298466,.132462039404696],[.264135680970344,.128905722188082],[.39030103803029,.123049084306729],[.509501477846007,.114996640222411],[.619609875763646,.104892091464541],[.71866136313195,.0929157660600351],[.804888401618839,.0792814117767189],[.876752358270441,.0642324214085258],[.932971086826016,.0480376717310846],[.972542471218115,.0309880058569794],[.994769334997552,.0134118594871417]],[[-.995187219997021,.0123412297999872],[-.974728555971309,.0285313886289336],[-.938274552002732,.0442774388174198],[-.886415527004401,.0592985849154367],[-.820001985973902,.0733464814110803],[-.740124191578554,.0861901615319532],[-.648093651936975,.0976186521041138],[-.545421471388839,.107444270115965],[-.433793507626045,.115505668053725],[-.315042679696163,.121670472927803],[-.191118867473616,.125837456346828],[-.0640568928626056,.127938195346752],[.0640568928626056,.127938195346752],[.191118867473616,.125837456346828],[.315042679696163,.121670472927803],[.433793507626045,.115505668053725],[.545421471388839,.107444270115965],[.648093651936975,.0976186521041138],[.740124191578554,.0861901615319532],[.820001985973902,.0733464814110803],[.886415527004401,.0592985849154367],[.938274552002732,.0442774388174198],[.974728555971309,.0285313886289336],[.995187219997021,.0123412297999872]],[[-.995556969790498,.0113937985010262],[-.976663921459517,.0263549866150321],[-.942974571228974,.0409391567013063],[-.894991997878275,.0549046959758351],[-.833442628760834,.0680383338123569],[-.759259263037357,.080140700335001],[-.673566368473468,.0910282619829636],[-.577662930241222,.10053594906705],[-.473002731445714,.108519624474263],[-.361172305809387,.114858259145711],[-.243866883720988,.119455763535784],[-.12286469261071,.12224244299031],[0,.123176053726715],[.12286469261071,.12224244299031],[.243866883720988,.119455763535784],[.361172305809387,.114858259145711],[.473002731445714,.108519624474263],[.577662930241222,.10053594906705],[.673566368473468,.0910282619829636],[.759259263037357,.080140700335001],[.833442628760834,.0680383338123569],[.894991997878275,.0549046959758351],[.942974571228974,.0409391567013063],[.976663921459517,.0263549866150321],[.995556969790498,.0113937985010262]],[[-.995885701145616,.010551372617343],[-.97838544595647,.0244178510926319],[-.947159066661714,.0379623832943627],[-.902637861984307,.0509758252971478],[-.845445942788498,.0632740463295748],[-.776385948820678,.0746841497656597],[-.696427260419957,.0850458943134852],[-.606692293017618,.0942138003559141],[-.508440714824505,.102059161094425],[-.403051755123486,.108471840528576],[-.292004839485956,.113361816546319],[-.17685882035689,.116660443485296],[-.0592300934293132,.118321415279262],[.0592300934293132,.118321415279262],[.17685882035689,.116660443485296],[.292004839485956,.113361816546319],[.403051755123486,.108471840528576],[.508440714824505,.102059161094425],[.606692293017618,.0942138003559141],[.696427260419957,.0850458943134852],[.776385948820678,.0746841497656597],[.845445942788498,.0632740463295748],[.902637861984307,.0509758252971478],[.947159066661714,.0379623832943627],[.97838544595647,.0244178510926319],[.995885701145616,.010551372617343]],[[-.996179262888988,.00979899605129436],[-.979923475961501,.0226862315961806],[-.950900557814705,.0352970537574197],[-.909482320677491,.047449412520615],[-.856207908018294,.0589835368598335],[-.791771639070508,.0697488237662455],[-.717013473739423,.0796048677730577],[-.632907971946495,.0884231585437569],[-.540551564579456,.0960887273700285],[-.441148251750026,.102501637817745],[-.335993903638508,.107578285788533],[-.226459365439536,.111252488356845],[-.113972585609529,.113476346108965],[0,.114220867378956],[.113972585609529,.113476346108965],[.226459365439536,.111252488356845],[.335993903638508,.107578285788533],[.441148251750026,.102501637817745],[.540551564579456,.0960887273700285],[.632907971946495,.0884231585437569],[.717013473739423,.0796048677730577],[.791771639070508,.0697488237662455],[.856207908018294,.0589835368598336],[.909482320677491,.047449412520615],[.950900557814705,.0352970537574197],[.979923475961501,.0226862315961806],[.996179262888988,.00979899605129436]],[[-.996442497573954,.00912428259309452],[-.981303165370872,.0211321125927712],[-.954259280628938,.0329014277823043],[-.915633026392132,.0442729347590042],[-.865892522574395,.0551073456757167],[-.805641370917179,.0652729239669995],[-.735610878013631,.0746462142345687],[-.656651094038864,.0831134172289012],[-.569720471811401,.0905717443930328],[-.475874224955118,.0969306579979299],[-.376251516089078,.10211296757806],[-.272061627635178,.106055765922846],[-.16456928213338,.108711192258294],[-.0550792898840342,.110047013016475],[.0550792898840342,.110047013016475],[.16456928213338,.108711192258294],[.272061627635178,.106055765922846],[.376251516089078,.10211296757806],[.475874224955118,.0969306579979299],[.569720471811401,.0905717443930328],[.656651094038864,.0831134172289012],[.735610878013631,.0746462142345687],[.805641370917179,.0652729239669995],[.865892522574395,.0551073456757167],[.915633026392132,.0442729347590042],[.954259280628938,.0329014277823043],[.981303165370872,.0211321125927712],[.996442497573954,.00912428259309452]],[[-.996679442260596,.00851690387874641],[-.982545505261413,.0197320850561227],[-.957285595778087,.0307404922020936],[-.921180232953058,.0414020625186828],[-.874637804920102,.0515948269024979],[-.818185487615252,.0612030906570791],[-.752462851734477,.0701179332550512],[-.678214537602686,.0782383271357637],[-.596281797138227,.0854722573661725],[-.507592955124227,.0917377571392587],[-.413152888174008,.0969638340944086],[-.314031637867639,.101091273759914],[-.211352286166001,.104073310077729],[-.106278230132679,.10587615509732],[0,.106479381718314],[.106278230132679,.10587615509732],[.211352286166001,.104073310077729],[.314031637867639,.101091273759914],[.413152888174008,.0969638340944086],[.507592955124227,.0917377571392587],[.596281797138227,.0854722573661725],[.678214537602686,.0782383271357637],[.752462851734477,.0701179332550512],[.818185487615252,.0612030906570791],[.874637804920102,.0515948269024979],[.921180232953058,.0414020625186828],[.957285595778087,.0307404922020936],[.982545505261413,.0197320850561227],[.996679442260596,.00851690387874641]],[[-.996893484074649,.0079681924961666],[-.983668123279747,.0184664683110909],[-.960021864968307,.0287847078833233],[-.926200047429274,.038799192569627],[-.882560535792052,.048402672830594],[-.829565762382768,.057493156217619],[-.767777432104826,.0659742298821805],[-.697850494793315,.0737559747377052],[-.620526182989242,.0807558952294202],[-.536624148142019,.0868997872010829],[-.447033769538089,.0921225222377861],[-.352704725530878,.0963687371746442],[-.254636926167889,.0995934205867952],[-.153869913608583,.101762389748405],[-.0514718425553176,.102852652893558],[.0514718425553176,.102852652893558],[.153869913608583,.101762389748405],[.254636926167889,.0995934205867952],[.352704725530878,.0963687371746442],[.447033769538089,.0921225222377861],[.536624148142019,.0868997872010829],[.620526182989242,.0807558952294202],[.697850494793315,.0737559747377052],[.767777432104826,.0659742298821805],[.829565762382768,.057493156217619],[.882560535792052,.048402672830594],[.926200047429274,.038799192569627],[.960021864968307,.0287847078833233],[.983668123279747,.0184664683110909],[.996893484074649,.0079681924961666]]],maxOrder=lut.length+5;var NumericalCurveMapper=function(_super){function NumericalCurveMapper(nQuadraturePoints,nInverseSamples,onInvalidateCache){void 0===nQuadraturePoints&&(nQuadraturePoints=24),void 0===nInverseSamples&&(nInverseSamples=21);var _this=_super.call(this,onInvalidateCache)||this;return _this._nSamples=21,_this._gauss=function(order){if(order<5||order>maxOrder)throw Error("Order for Gaussian Quadrature must be in the range of ".concat(5," and ").concat(maxOrder,"."));return lut[order-5]}(nQuadraturePoints),_this._nSamples=nInverseSamples,_this}return __extends(NumericalCurveMapper,_super),NumericalCurveMapper.prototype._invalidateCache=function(){_super.prototype._invalidateCache.call(this),this._cache.arcLengths=null,this._cache.samples=null;},Object.defineProperty(NumericalCurveMapper.prototype,"arcLengths",{get:function(){return this._cache.arcLengths||(this._cache.arcLengths=this.computeArcLengths()),this._cache.arcLengths},enumerable:!1,configurable:!0}),NumericalCurveMapper.prototype.getSamples=function(idx){if(this.points){if(this._cache.samples||(this._cache.samples=new Map),!this._cache.samples.has(idx)){for(var samples=this._nSamples,lengths=[],slopes=[],coefficients=this.getCoefficients(idx),i=0;i<samples;++i){var ti=i/(samples-1);lengths.push(this.computeArcLength(idx,0,ti));var dtln=magnitude(evaluateForT(derivativeAtT,ti,coefficients)),slope=0===dtln?0:1/dtln;this.tension>.95&&(slope=clamp(slope,-1,1)),slopes.push(slope);}var nCoeff=samples-1,dis=[],cis=[],li_prev=lengths[0],tdi_prev=slopes[0],step=1/nCoeff;for(i=0;i<nCoeff;++i){var li=li_prev,lDiff=(li_prev=lengths[i+1])-li,tdi=tdi_prev,tdi_next=slopes[i+1];tdi_prev=tdi_next;var si=step/lDiff,di=(tdi+tdi_next-2*si)/(lDiff*lDiff),ci=(3*si-2*tdi-tdi_next)/lDiff;dis.push(di),cis.push(ci);}this._cache.samples.set(idx,[lengths,slopes,cis,dis]);}return this._cache.samples.get(idx)}},NumericalCurveMapper.prototype.computeArcLength=function(index,t0,t1){if(void 0===t0&&(t0=0),void 0===t1&&(t1=1),t0===t1)return 0;for(var coefficients=this.getCoefficients(index),z=.5*(t1-t0),sum=0,i=0;i<this._gauss.length;i++){var _a=this._gauss[i],T=_a[0];sum+=_a[1]*magnitude(evaluateForT(derivativeAtT,z*T+z+t0,coefficients));}return z*sum},NumericalCurveMapper.prototype.computeArcLengths=function(){if(this.points){var lengths=[];lengths.push(0);for(var nPoints=this.closed?this.points.length:this.points.length-1,tl=0,i=0;i<nPoints;i++){tl+=this.computeArcLength(i),lengths.push(tl);}return lengths}},NumericalCurveMapper.prototype.inverse=function(idx,len){var step=1/(this._nSamples-1),_a=this.getSamples(idx),lengths=_a[0],slopes=_a[1],cis=_a[2],dis=_a[3];if(len>=lengths[lengths.length-1])return 1;if(len<=0)return 0;var i=Math.max(0,binarySearch(len,lengths)),ti=i*step;if(lengths[i]===len)return ti;var tdi=slopes[i],di=dis[i],ci=cis[i],ld=len-lengths[i];return ((di*ld+ci)*ld+tdi)*ld+ti},NumericalCurveMapper.prototype.lengthAt=function(u){return u*this.arcLengths[this.arcLengths.length-1]},NumericalCurveMapper.prototype.getT=function(u){var arcLengths=this.arcLengths,il=arcLengths.length,targetArcLength=u*arcLengths[il-1],i=binarySearch(targetArcLength,arcLengths),ti=i/(il-1);if(arcLengths[i]===targetArcLength)return ti;var len=targetArcLength-arcLengths[i];return (i+this.inverse(i,len))/(il-1)},NumericalCurveMapper.prototype.getU=function(t){if(0===t)return 0;if(1===t)return 1;var arcLengths=this.arcLengths,al=arcLengths.length-1,totalLength=arcLengths[al],tIdx=t*al,subIdx=Math.floor(tIdx),l1=arcLengths[subIdx];if(tIdx===subIdx)return l1/totalLength;var t0=tIdx-subIdx;return (l1+this.computeArcLength(subIdx,0,t0))/totalLength},NumericalCurveMapper}(AbstractCurveMapper),CurveInterpolator=function(){function CurveInterpolator(points,options){void 0===options&&(options={});var _this=this;this._cache=new Map;var curveMapper=(options=__assign({tension:.5,alpha:0,closed:!1},options)).arcDivisions?new SegmentedCurveMapper(options.arcDivisions,(function(){return _this._invalidateCache()})):new NumericalCurveMapper(options.numericalApproximationOrder,options.numericalInverseSamples,(function(){return _this._invalidateCache()}));curveMapper.alpha=options.alpha,curveMapper.tension=options.tension,curveMapper.closed=options.closed,curveMapper.points=points,this._lmargin=options.lmargin||1-curveMapper.tension,this._curveMapper=curveMapper;}return CurveInterpolator.prototype.getTimeFromPosition=function(position,clampInput){return void 0===clampInput&&(clampInput=!1),this._curveMapper.getT(clampInput?clamp(position,0,1):position)},CurveInterpolator.prototype.getPositionFromTime=function(t,clampInput){return void 0===clampInput&&(clampInput=!1),this._curveMapper.getU(clampInput?clamp(t,0,1):t)},CurveInterpolator.prototype.getPositionFromLength=function(length,clampInput){void 0===clampInput&&(clampInput=!1);var l=clampInput?clamp(length,0,this.length):length;return this._curveMapper.getU(l/this.length)},CurveInterpolator.prototype.getLengthAt=function(position,clampInput){return void 0===position&&(position=1),void 0===clampInput&&(clampInput=!1),this._curveMapper.lengthAt(clampInput?clamp(position,0,1):position)},CurveInterpolator.prototype.getTimeAtKnot=function(index){if(index<0||index>this.points.length-1)throw Error("Invalid index!");return 0===index?0:this.closed||index!==this.points.length-1?index/(this.closed?this.points.length:this.points.length-1):1},CurveInterpolator.prototype.getPositionAtKnot=function(index){return this.getPositionFromTime(this.getTimeAtKnot(index))},CurveInterpolator.prototype.getPointAtTime=function(t,target){return 0===(t=clamp(t,0,1))?copyValues(this.points[0],target):1===t?copyValues(this.closed?this.points[0]:this.points[this.points.length-1],target):this._curveMapper.evaluateForT(valueAtT,t,target)},CurveInterpolator.prototype.getPointAt=function(position,target){return this.getPointAtTime(this.getTimeFromPosition(position),target)},CurveInterpolator.prototype.getTangentAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this.getTangentAtTime(t,target)},CurveInterpolator.prototype.getTangentAtTime=function(t,target){return normalize$1(this._curveMapper.evaluateForT(derivativeAtT,t,target))},CurveInterpolator.prototype.getNormalAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this.getNormalAtTime(t,target)},CurveInterpolator.prototype.getNormalAtTime=function(t,target){var dt=normalize$1(this._curveMapper.evaluateForT(derivativeAtT,t));if(!(dt.length<2||dt.length>3)){var normal=target||new Array(dt.length);if(2===dt.length)return normal[0]=-dt[1],normal[1]=dt[0],normal;var ddt=normalize$1(this._curveMapper.evaluateForT(secondDerivativeAtT,t));return normalize$1(cross$1(cross$1(dt,ddt),dt),normal)}},CurveInterpolator.prototype.getCurvatureAt=function(position){var t=clamp(this.getTimeFromPosition(position),0,1);return this.getCurvatureAtTime(t)},CurveInterpolator.prototype.getCurvatureAtTime=function(t){var dt=this._curveMapper.evaluateForT(derivativeAtT,t),ddt=this._curveMapper.evaluateForT(secondDerivativeAtT,t),tangent=normalize$1(dt,[]),curvature=0,direction=void 0;if(2===dt.length){if(0!==(denominator=Math.pow(dt[0]*dt[0]+dt[1]*dt[1],1.5))){var signedCurvature=(dt[0]*ddt[1]-dt[1]*ddt[0])/denominator;direction=signedCurvature<0?[tangent[1],-tangent[0]]:[-tangent[1],tangent[0]],curvature=Math.abs(signedCurvature);}}else if(3===dt.length){var a=magnitude(dt),cp=cross$1(dt,ddt);direction=normalize$1(cross$1(cp,dt)),0!==a&&(curvature=magnitude(cp)/Math.pow(a,3));}else {a=magnitude(dt);var b=magnitude(ddt),denominator=Math.pow(a,3),dotProduct=dot(dt,ddt);0!==denominator&&(curvature=Math.sqrt(Math.pow(a,2)*Math.pow(b,2)-Math.pow(dotProduct,2))/denominator);}return {curvature:curvature,radius:0!==curvature?1/curvature:0,tangent:tangent,direction:direction}},CurveInterpolator.prototype.getDerivativeAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this._curveMapper.evaluateForT(derivativeAtT,t,target)},CurveInterpolator.prototype.getSecondDerivativeAt=function(position,target){var t=clamp(this.getTimeFromPosition(position),0,1);return this._curveMapper.evaluateForT(secondDerivativeAtT,t,target)},CurveInterpolator.prototype.getBoundingBox=function(from,to){if(void 0===from&&(from=0),void 0===to&&(to=1),0===from&&1===to&&this._cache.has("bbox"))return this._cache.get("bbox");for(var min=[],max=[],t0=this.getTimeFromPosition(from),t1=this.getTimeFromPosition(to),start=this.getPointAtTime(t0),end=this.getPointAtTime(t1),nPoints=this.closed?this.points.length:this.points.length-1,i0=Math.floor(nPoints*t0),i1=Math.ceil(nPoints*t1),c=0;c<start.length;c++)min[c]=Math.min(start[c],end[c]),max[c]=Math.max(start[c],end[c]);for(var _loop_1=function(i){var p2=getControlPoints(i-1,this_1.points,this_1.closed)[2];if(i<i1)for(var c=0;c<p2.length;c++)p2[c]<min[c]&&(min[c]=p2[c]),p2[c]>max[c]&&(max[c]=p2[c]);if(this_1.tension<1){var w0_1=nPoints*t0-(i-1),w1_1=nPoints*t1-(i-1),valid=function(t){return t>-EPS&&t<=1+EPS&&(i-1!==i0||t>w0_1)&&(i!==i1||t<w1_1)},coefficients_1=this_1._curveMapper.getCoefficients(i-1),_loop_2=function(c){var _b=coefficients_1[c];getQuadRoots(3*_b[0],2*_b[1],_b[2]).filter(valid).forEach((function(t){var v=valueAtT(t,coefficients_1[c]);v<min[c]&&(min[c]=v),v>max[c]&&(max[c]=v);}));};for(c=0;c<coefficients_1.length;c++)_loop_2(c);}},this_1=this,i=i0+1;i<=i1;i++)_loop_1(i);var bbox={min:min,max:max};return 0===from&&1===to&&this._cache.set("bbox",bbox),bbox},CurveInterpolator.prototype.getPoints=function(segments,returnType,from,to){if(void 0===segments&&(segments=100),void 0===from&&(from=0),void 0===to&&(to=1),!segments||segments<=0)throw Error("Invalid arguments passed to getPoints(). You must specify at least 1 sample/segment.");if(!(from<0||to>1||to<from)){for(var pts=[],d=0;d<=segments;d++){var u=0===from&&1===to?d/segments:from+d/segments*(to-from);pts.push(this.getPointAt(u,returnType&&new returnType));}return pts}},CurveInterpolator.prototype.getNearestPosition=function(point,threshold){var _this=this;if(void 0===threshold&&(threshold=1e-5),threshold<=0||!Number.isFinite(threshold))throw Error("Invalid threshold. Must be a number greater than zero!");var samples=10*this.points.length-1,pu=new Array(point.length),minDist=1/0,minU=0,lut=this.createLookupTable(samples);Array.from(lut.keys()).forEach((function(key){var c=lut.get(key),dist=distance$2(point,c);if(dist<minDist)return minDist=dist,minU=key,!0}));for(var minT=this.getTimeFromPosition(minU),bisect=function(t){if(t>=0&&t<=1){_this.getPointAtTime(t,pu);var dist=distance$2(point,pu);if(dist<minDist)return minDist=dist,minT=t,!0}},step=.005;step>threshold;)bisect(minT-step)||bisect(minT+step)||(step/=2);return {u:minU=this._curveMapper.getU(minT),distance:minDist,point:pu}},CurveInterpolator.prototype.getIntersects=function(v,axis,max,margin){var _this=this;void 0===axis&&(axis=0),void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin);var solutions=this.getIntersectsAsTime(v,axis,max,margin).map((function(t){return _this.getPointAtTime(t)}));return 1===Math.abs(max)?1===solutions.length?solutions[0]:null:solutions},CurveInterpolator.prototype.getIntersectsAsPositions=function(v,axis,max,margin){var _this=this;return void 0===axis&&(axis=0),void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin),this.getIntersectsAsTime(v,axis,max,margin).map((function(t){return _this.getPositionFromTime(t)}))},CurveInterpolator.prototype.getIntersectsAsTime=function(v,axis,max,margin){void 0===axis&&(axis=0),void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin);for(var k=axis,solutions=new Set,nPoints=this.closed?this.points.length:this.points.length-1,i=0;i<nPoints&&(0===max||solutions.size<Math.abs(max));i+=1){var idx=max<0?nPoints-(i+1):i,_a=getControlPoints(idx,this.points,this.closed),p1=_a[1],p2=_a[2],coefficients=this._curveMapper.getCoefficients(idx),vmin=void 0,vmax=void 0;if(p1[k]<p2[k]?(vmin=p1[k],vmax=p2[k]):(vmin=p2[k],vmax=p1[k]),v-margin<=vmax&&v+margin>=vmin){var ts=findRootsOfT(v,coefficients[k]);max<0?ts.sort((function(a,b){return b-a})):max>=0&&ts.sort((function(a,b){return a-b}));for(var j=0;j<ts.length;j++){var nt=(ts[j]+idx)/nPoints;if(solutions.add(nt),0!==max&&solutions.size===Math.abs(max))break}}}return Array.from(solutions)},CurveInterpolator.prototype.createLookupTable=function(samples,from,to){if(void 0===from&&(from=0),void 0===to&&(to=1),!samples||samples<=1)throw Error("Invalid arguments passed to createLookupTable(). You must specify at least 2 samples.");if(!(from<0||to>1||to<from)){var cacheKey="lut_".concat(samples,"_").concat(from,"_").concat(to);if(!this._cache.has(cacheKey)){for(var lut=new Map,d=0;d<samples;d++){var u=0===from&&1===to?d/(samples-1):from+d/(samples-1)*(to-from),point=this.getPointAt(u);lut.set(u,point);}this._cache.set(cacheKey,lut);}return this._cache.get(cacheKey)}},CurveInterpolator.prototype.forEach=function(func,samples,from,to){var _this=this;void 0===from&&(from=0),void 0===to&&(to=1);var positions=[];if(Number.isFinite(samples)){if(samples<=1)throw Error("Invalid arguments passed to forEach(). You must specify at least 2 samples.");for(var nSamples=samples,i=0;i<samples;i++){var u=0===from&&1===to?i/(nSamples-1):from+i/(nSamples-1)*(to-from);positions.push(u);}}else Array.isArray(samples)&&(positions=samples);var prev=null;positions.forEach((function(u,i){if(!Number.isFinite(u)||u<0||u>1)throw Error("Invalid position (u) for sample in forEach!");var t=_this.getTimeFromPosition(u),current=func({u:u,t:t,i:i,prev:prev});prev={u:u,t:t,i:i,value:current};}));},CurveInterpolator.prototype.map=function(func,samples,from,to){var _this=this;void 0===from&&(from=0),void 0===to&&(to=1);var positions=[];if(Number.isFinite(samples)){if(samples<=1)throw Error("Invalid arguments passed to map(). You must specify at least 2 samples.");for(var nSamples=samples,i=0;i<samples;i++){var u=0===from&&1===to?i/(nSamples-1):from+i/(nSamples-1)*(to-from);positions.push(u);}}else Array.isArray(samples)&&(positions=samples);var prev=null;return positions.map((function(u,i){if(!Number.isFinite(u)||u<0||u>1)throw Error("Invalid position (u) for sample in map()!");var t=_this.getTimeFromPosition(u),current=func({u:u,t:t,i:i,prev:prev});return prev={u:u,t:t,i:i,value:current},current}))},CurveInterpolator.prototype.reduce=function(func,initialValue,samples,from,to){var _this=this;void 0===from&&(from=0),void 0===to&&(to=1);var positions=[];if(Number.isFinite(samples)){if(samples<=1)throw Error("Invalid arguments passed to map(). You must specify at least 2 samples.");for(var nSamples=samples,i=0;i<samples;i++){var u=0===from&&1===to?i/(nSamples-1):from+i/(nSamples-1)*(to-from);positions.push(u);}}else Array.isArray(samples)&&(positions=samples);return positions.reduce((function(acc,u,i){if(!Number.isFinite(u)||u<0||u>1)throw Error("Invalid position (u) for sample in map()!");var t=_this.getTimeFromPosition(u);return func({acc:acc,u:u,t:t,i:i})}),initialValue)},CurveInterpolator.prototype._invalidateCache=function(){return this._cache=new Map,this},CurveInterpolator.prototype.reset=function(){this._curveMapper.reset();},Object.defineProperty(CurveInterpolator.prototype,"points",{get:function(){return this._curveMapper.points},set:function(pts){this._curveMapper.points=pts;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"tension",{get:function(){return this._curveMapper.tension},set:function(t){this._curveMapper.tension=t;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"alpha",{get:function(){return this._curveMapper.alpha},set:function(a){this._curveMapper.alpha=a;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"closed",{get:function(){return this._curveMapper.closed},set:function(isClosed){this._curveMapper.closed=isClosed;},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"length",{get:function(){return this._curveMapper.lengthAt(1)},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"minX",{get:function(){return this.getBoundingBox().min[0]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"maxX",{get:function(){return this.getBoundingBox().max[0]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"minY",{get:function(){return this.getBoundingBox().min[1]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"maxY",{get:function(){return this.getBoundingBox().max[1]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"minZ",{get:function(){return this.getBoundingBox().min[2]},enumerable:!1,configurable:!0}),Object.defineProperty(CurveInterpolator.prototype,"maxZ",{get:function(){return this.getBoundingBox().max[2]},enumerable:!1,configurable:!0}),CurveInterpolator}();(function(_super){function CurveInterpolator2D(points,tension,arcDivisions,closed,alpha){return void 0===tension&&(tension=.5),void 0===arcDivisions&&(arcDivisions=300),void 0===closed&&(closed=!1),void 0===alpha&&(alpha=0),_super.call(this,points.map((function(p){return [p[0],p[1]]})),{tension:tension,alpha:alpha,arcDivisions:arcDivisions,closed:closed})||this}return __extends(CurveInterpolator2D,_super),CurveInterpolator2D.prototype.x=function(y,max,margin){void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin);var res=this.getIntersects(y,1,max,margin);return 1===Math.abs(max)?res[0]:res.map((function(d){return d[0]}))},CurveInterpolator2D.prototype.y=function(x,max,margin){void 0===max&&(max=0),void 0===margin&&(margin=this._lmargin);var res=this.getIntersects(x,0,max,margin);return 1===Math.abs(max)?res[1]:res.map((function(d){return d[1]}))},CurveInterpolator2D.prototype.getNormalAt=function(position,target){return normalize$1(orthogonal(this.getTangentAt(position,target)))},CurveInterpolator2D.prototype.getAngleAt=function(position){var tan=this.getTangentAt(position);return Math.atan2(tan[1],tan[0])},CurveInterpolator2D.prototype.getBoundingBox=function(from,to){void 0===from&&(from=0),void 0===to&&(to=1);var bbox=_super.prototype.getBoundingBox.call(this,from,to);return {x1:bbox.min[0],x2:bbox.max[0],y1:bbox.min[1],y2:bbox.max[1],min:bbox.min,max:bbox.max}},CurveInterpolator2D})(CurveInterpolator);

const Link = Shape.registerMethod('Link', (...args) => async (shape) => {
  const [modes, geometries] = await destructure2(
    shape,
    args,
    'modes',
    'geometries'
  );
  return Shape.fromGeometry(
    link$1(geometries, modes.includes('close'), modes.includes('reverse'))
  );
});

const link = Shape.registerMethod(
  'link',
  (...args) =>
    async (shape) =>
      Link(shape, ...args)(shape)
);

const Curve = Shape.registerMethod(
  'Curve',
  (...args) =>
    async (shape) => {
      const [coordinates, implicitSteps = 20, options, modes] =
        await destructure2(
          shape,
          args,
          'coordinates',
          'number',
          'options',
          'modes'
        );
      const { steps = implicitSteps } = options;
      const isClosed = modes.includes('closed');
      const interpolator = new CurveInterpolator(coordinates, {
        closed: isClosed,
        tension: 0.2,
        alpha: 0.5,
      });
      const points = interpolator.getPoints(steps);
      if (isClosed) {
        return Loop(...points.map((point) => Point(point)));
      } else {
        return Link(...points.map((point) => Point(point)));
      }
    }
);

const curve = Shape.registerMethod(
  'curve',
  (...args) =>
    async (shape) =>
      Curve(shape, ...args)
);

const Cut = Shape.registerMethod2(
  'Cut',
  ['geometry', 'geometries', 'modes'],
  (first, rest, modes) =>
    Shape.fromGeometry(
      cut$1(
        first,
        rest,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

const cut = Shape.registerMethod2(
  'cut',
  ['inputGeometry', 'geometries', 'modes'],
  async (inputGeometry, geometries, modes) =>
    Shape.fromGeometry(
      cut$1(
        inputGeometry,
        geometries,
        modes.includes('open'),
        modes.includes('exact'),
        modes.includes('noVoid'),
        modes.includes('noGhost')
      )
    )
);

const cutFrom = Shape.registerMethod(
  'cutFrom',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions: others, strings: modes } = destructure(args);
      if (others.length !== 1) {
        throw Error(`cutFrom requires one shape or function.`);
      }
      const [other] = others;
      return cut(shape, ...modes)(await toShape(other)(shape));
    }
);

const cutOut = Shape.registerMethod(
  'cutOut',
  (...args) =>
    async (shape) => {
      const [
        other,
        cutOp = (shape) => shape,
        clipOp = (shape) => shape,
        groupOp = Group,
        modes,
      ] = await destructure2(
        shape,
        args,
        'shape',
        'function',
        'function',
        'function',
        'modes'
      );
      const cutShape = await cut(other, ...modes, 'noGhost')(shape);
      const clipShape = await clip(other, ...modes, 'noGhost')(shape);
      return groupOp(await op(cutOp)(cutShape), await op(clipOp)(clipShape));
    }
);

const deform = Shape.registerMethod(
  'deform',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions: selections, object: options } =
        destructure(args);
      const { iterations, tolerance, alpha } = options;
      return Shape.fromGeometry(
        deform$1(
          await shape.toGeometry(),
          await shape.toShapesGeometries(selections),
          iterations,
          tolerance,
          alpha
        )
      );
    }
);

// TODO: Rename clean at the lower levels.
const demesh = Shape.registerMethod(
  'demesh',
  (options) => (shape) =>
    Shape.fromGeometry(demesh$1(shape.toGeometry(), options))
);

const toPoints = Shape.registerMethod(
  'toPoints',
  () => async (shape) => {
    const points = toPoints$1(await shape.toGeometry()).points;
    return points;
  }
);

const square$1 = (a) => a * a;

const distance$1 = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  Math.sqrt(square$1(ax - bx) + square$1(ay - by) + square$1(az - bz));

// This is not efficient.
const diameter = Shape.registerMethod(
  'diameter',
  (op = (diameter) => (shape) => diameter) =>
    async (shape) => {
      const points = await toPoints()(shape);
      let maximumDiameter = 0;
      for (let a of points) {
        for (let b of points) {
          const diameter = distance$1(a, b);
          if (diameter > maximumDiameter) {
            maximumDiameter = diameter;
          }
        }
      }
      return op(maximumDiameter)(shape);
    }
);

const dilateXY = Shape.registerMethod(
  'dilateXY',
  (...args) =>
    async (shape) => {
      const [amount = 1] = await destructure2(shape, args, 'number');
      return Shape.fromGeometry(
        dilateXY$1(await shape.toGeometry(), amount)
      );
    }
);

const disjoint = Shape.registerMethod(
  'disjoint',
  (...args) =>
    async (shape) => {
      const { strings: modes } = destructure(args);
      return fromGeometry(
        disjoint$1(
          [await shape.toGeometry()],
          modes.includes('backward') ? 0 : 1,
          modes.includes('exact')
        )
      );
    }
);

const ghost = Shape.registerMethod('ghost', () => async (shape) => {
  const result = Shape.fromGeometry(hasTypeGhost(await shape.toGeometry()));
  return result;
});

// Let's consider removing the parallel operations.
const on = Shape.registerMethod('on', (...args) => async (shape) => {
  const entries = [];
  while (args.length > 0) {
    const [selection, op, rest] = await destructure2(
      shape,
      args,
      'shape',
      'function',
      'rest'
    );
    entries.push({ selection, op });
    args = rest;
  }
  const inputLeafs = [];
  const outputLeafs = [];
  let shapeGeometry = await shape.toGeometry();
  for (const { selection, op } of entries) {
    const leafs = getLeafs(await selection.toGeometry());
    inputLeafs.push(...leafs);
    for (const geometry of leafs) {
      const global = geometry.matrix;
      const local = invertTransform(global);
      const target = Shape.fromGeometry(geometry);
      // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
      // FIXME: op may be async.
      const a = transform(local);
      const b = a.op(op);
      const c = b.transform(global);
      const r = await c(target);
      outputLeafs.push(await r.toGeometry());
    }
  }
  const result = Shape.fromGeometry(
    replacer(inputLeafs, outputLeafs)(shapeGeometry)
  );
  return result;
});

const drop = Shape.registerMethod(
  'drop',
  (selector) => async (shape) => on(selector, ghost())(await shape)
);

const List = (...shapes) => shapes;

const list =
  (...shapes) =>
  (shape) =>
    List(...shapes);

Shape.registerMethod('list', list);

Shape.List = List;

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

const hersheySegments = [];

for (const key of Object.keys(hersheyPaths)) {
  const segments = [];
  hersheySegments[key] = segments;
  for (const path of hersheyPaths[key]) {
    let last;
    for (const point of path) {
      if (point === null) {
        continue;
      }
      if (last) {
        segments.push([last, point]);
      }
      last = point;
    }
  }
}

const toSegments = (letters) => {
  let xOffset = 0;
  const rendered = [];
  for (const letter of letters) {
    const code = letter.charCodeAt(0);
    const segments = hersheySegments[code];
    if (segments) {
      rendered.push(Shape.chain(Shape.fromSegments(segments)).x(xOffset));
    }
    xOffset += hersheyWidth[code] || 0;
  }
  return Group(...rendered).scale(1 / 28);
};

const Hershey = Shape.registerMethod(
  'Hershey',
  (text, size) => async (shape) => toSegments(text).scale(size)
);

const getNot = Shape.registerMethod(
  ['getNot', 'gn'],
  (...tags) =>
    async (shape) => {
      const isMatch = oneOfTagMatcher(tags, 'item');
      const picks = [];
      const walk = (geometry, descend) => {
        const { tags, type } = geometry;
        if (type === 'group') {
          return descend();
        }
        let discard = false;
        if (isMatch(`type:${geometry.type}`)) {
          discard = true;
        } else {
          for (const tag of tags) {
            if (isMatch(tag)) {
              discard = true;
              break;
            }
          }
        }
        if (!discard) {
          picks.push(Shape.fromGeometry(geometry));
        }
        if (type !== 'item') {
          return descend();
        }
      };
      const geometry = await shape.toGeometry();
      if (geometry.type === 'item') {
        // FIX: Can we make this less magical?
        // This allows constructions like s.get('a').get('b')
        visit(geometry.content[0], walk);
      } else {
        visit(geometry, walk);
      }
      return Group(...picks);
    }
);

const gn = getNot;

const toDisplayGeometry = Shape.registerMethod(
  'toDisplayGeometry',
  () => async (shape) => {
    return toDisplayGeometry$1(await shape.toGeometry());
  }
);

const MIN = 0;
const MAX = 1;
const X$5 = 0;
const Y$5 = 1;

const buildLayout = async ({
  layer,
  pageWidth,
  pageLength,
  margin,
  center = false,
}) => {
  const itemNames = (await getNot('type:ghost').tags('item', list)(layer))
    .filter((name) => name !== '')
    .flatMap((name) => name)
    .sort();
  const labelScale = 0.0125 * 10;
  const size = [pageWidth, pageLength];
  const r = (v) => Math.floor(v * 100) / 100;
  const fontHeight = Math.max(pageWidth, pageLength) * labelScale;
  const title = [];
  if (isFinite(pageWidth) && isFinite(pageLength)) {
    // CHECK: Even when this is only called once we're getting a duplication of the
    // 'x' at the start. If we replace it with 'abc', we get the 'b' at the start.
    const text = `${r(pageWidth)} x ${r(pageLength)}`;
    title.push(await Hershey(text, fontHeight));
  }
  for (let nth = 0; nth < itemNames.length; nth++) {
    title.push(
      await Hershey(itemNames[nth], fontHeight).y((nth + 1) * fontHeight)
    );
  }
  const visualization = await Box(
    Math.max(pageWidth, margin),
    Math.max(pageLength, margin)
  )
    .outline()
    .and(
      Group(...title).move(pageWidth / -2, (pageLength * (1 + labelScale)) / 2)
    )
    .color('red')
    .ghost();
  let layout = Shape.chain(
    Shape.fromGeometry(
      taggedLayout(
        { size, margin },
        await layer.toDisplayGeometry(),
        await visualization.toDisplayGeometry()
      )
    )
  );
  if (center) {
    layout = layout.by(align());
  }
  return layout;
};

const Page = Shape.registerMethod('Page', (...args) => async (shape) => {
  const [options, modes, shapes] = await destructure2(
    shape,
    args,
    'options',
    'modes',
    'shapes'
  );
  let {
    size,
    pageMargin = 5,
    itemMargin = 1,
    itemsPerPage = Infinity,
  } = options;
  let pack = modes.includes('pack');
  const center = modes.includes('center');

  if (modes.includes('a4')) {
    size = [210, 297];
  }

  if (modes.includes('individual')) {
    pack = true;
    itemsPerPage = 1;
  }

  const margin = itemMargin;
  const layers = [];
  for (const shape of shapes) {
    for (const leaf of getLeafs(await shape.toGeometry())) {
      layers.push(leaf);
    }
  }
  if (!pack && size) {
    const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
    const [width, height] = size;
    const packSize = [
      [-width / 2, -height / 2, 0],
      [width / 2, height / 2, 0],
    ];
    const pageWidth =
      Math.max(
        1,
        Math.abs(packSize[MAX][X$5] * 2),
        Math.abs(packSize[MIN][X$5] * 2)
      ) +
      pageMargin * 2;
    const pageLength =
      Math.max(
        1,
        Math.abs(packSize[MAX][Y$5] * 2),
        Math.abs(packSize[MIN][Y$5] * 2)
      ) +
      pageMargin * 2;
    return buildLayout({
      layer,
      pageWidth,
      pageLength,
      margin,
      center,
    });
  } else if (!pack && !size) {
    const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
    const packSize = measureBoundingBox(await layer.toGeometry());
    if (packSize === undefined) {
      return Group();
    }
    const pageWidth =
      Math.max(
        1,
        Math.abs(packSize[MAX][X$5] * 2),
        Math.abs(packSize[MIN][X$5] * 2)
      ) +
      pageMargin * 2;
    const pageLength =
      Math.max(
        1,
        Math.abs(packSize[MAX][Y$5] * 2),
        Math.abs(packSize[MIN][Y$5] * 2)
      ) +
      pageMargin * 2;
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      return buildLayout({
        layer,
        pageWidth,
        pageLength,
        margin,
        center,
      });
    } else {
      return buildLayout({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  } else if (pack && size) {
    // Content fits to page size.
    const packSize = [];
    const content = await Shape.fromGeometry(taggedGroup({}, ...layers)).pack({
      size,
      pageMargin,
      itemMargin,
      perLayout: itemsPerPage,
      packSize,
    });
    if (packSize.length === 0) {
      throw Error('Packing failed');
    }
    const pageWidth = Math.max(1, packSize[MAX][X$5] - packSize[MIN][X$5]);
    const pageLength = Math.max(1, packSize[MAX][Y$5] - packSize[MIN][Y$5]);
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of await content.get('pack:layout', List)) {
        plans.push(
          await buildLayout({
            layer,
            pageWidth,
            pageLength,
            margin,
            center,
          })
        );
      }
      return Group(...plans);
    } else {
      const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
      return buildLayout({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  } else if (pack && !size) {
    const packSize = [];
    // Page fits to content size.
    const contents = await Shape.fromGeometry(taggedGroup({}, ...layers)).pack({
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
    const pageWidth = packSize[MAX][X$5] - packSize[MIN][X$5];
    const pageLength = packSize[MAX][Y$5] - packSize[MIN][Y$5];
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      for (const layer of await contents.get('pack:layout', List)) {
        const layout = await buildLayout({
          layer,
          packSize,
          pageWidth,
          pageLength,
          margin,
          center,
        });
        plans.push(layout);
      }
      return Group(...plans);
    } else {
      const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
      return buildLayout({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  }
});

const page = Shape.registerMethod(
  'page',
  (...args) =>
    (shape) =>
      Page(Shape.chain(shape), ...args)
);

const ensurePages = async (shape, depth = 0) => {
  if (shape instanceof Promise) {
    throw Error(`ensurePages/shape/promise`);
  }
  const pages = getLayouts(await toDisplayGeometry()(shape));
  if (pages.length === 0 && depth === 0) {
    return ensurePages(await Page({ pack: false }, shape), depth + 1);
  } else {
    return pages;
  }
};

const each = Shape.registerMethod('each', (...args) => async (shape) => {
  const [leafOp = (l) => l, groupOp = Group] = await destructure2(
    shape,
    args,
    'function',
    'function'
  );
  const leafShapes = [];
  const leafGeometries = getLeafs(await shape.toGeometry());
  for (const leafGeometry of leafGeometries) {
    leafShapes.push(
      await leafOp(Shape.chain(Shape.fromGeometry(leafGeometry)))
    );
  }
  const grouped = await groupOp(...leafShapes);
  if (Shape.isFunction(grouped)) {
    return grouped(shape);
  } else {
    return grouped;
  }
});

// TODO: Add an option to include a virtual segment at the target of the last
// edge.

const length = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

const SOURCE = 0;
const TARGET = 1;

const eachEdge = Shape.registerMethod(
  'eachEdge',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions, object: options = {} } = destructure(args);
      const { selections = [] } = options;
      let [
        edgeOp = (e, l, o) => (s) => e,
        faceOp = (es, f) => (s) => es,
        groupOp = Group,
      ] = shapesAndFunctions;
      const faces = [];
      const faceEdges = [];
      eachFaceEdges(
        await shape.toShapeGeometry(shape),
        await shape.toShapesGeometries(selections),
        (faceGeometry, edgeGeometry) => {
          faceEdges.push({ faceGeometry, edgeGeometry });
        }
      );
      for (const { faceGeometry, edgeGeometry } of faceEdges) {
        const { matrix, segments, normals } = edgeGeometry;
        const edges = [];
        if (segments) {
          for (let nth = 0; nth < segments.length; nth++) {
            const segment = segments[nth];
            /*
            const absoluteSegment = [
              transformCoordinate(segment[SOURCE], matrix),
              transformCoordinate(segment[TARGET], matrix),
            ];
            const absoluteOppositeSegment = [
              transformCoordinate(segment[TARGET], matrix),
              transformCoordinate(segment[SOURCE], matrix),
            ];
            const absoluteNormal = normals
              ? subtract(
                  transformCoordinate(normals[nth], matrix),
                  absoluteSegment[SOURCE]
                )
              : [0, 0, 1];
            const inverse = fromSegmentToInverseTransform(
              absoluteSegment,
              absoluteNormal
            );
            const oppositeInverse = fromSegmentToInverseTransform(
              absoluteOppositeSegment,
              absoluteNormal
            );
            const baseSegment = [
              transformCoordinate(absoluteSegment[SOURCE], inverse),
              transformCoordinate(absoluteSegment[TARGET], inverse),
            ];
            const oppositeSegment = [
              transformCoordinate(absoluteSegment[TARGET], oppositeInverse),
              transformCoordinate(absoluteSegment[SOURCE], oppositeInverse),
            ];
            const inverseMatrix = invertTransform(inverse);
            const oppositeInverseMatrix = invertTransform(oppositeInverse);
            // We get a pair of absolute coordinates from eachSegment.
            // We need a segment from [0,0,0] to [x,0,0] in its local space.
            edges.push(
              await edgeOp(
                Shape.chain(
                  Shape.fromGeometry(
                    taggedSegments({ matrix: inverseMatrix }, [baseSegment])
                  )
                ),
                length(segment[SOURCE], segment[TARGET]),
                Shape.chain(
                  Shape.fromGeometry(
                    taggedSegments({ matrix: oppositeInverseMatrix }, [
                      oppositeSegment,
                    ])
                  )
                )
              )(shape)
            );
            */
            const [forward, backward] = disorientSegment(
              segment,
              matrix,
              normals ? normals[nth] : undefined
            );
            edges.push(
              await edgeOp(
                Shape.chain(Shape.fromGeometry(forward)),
                length(segment[SOURCE], segment[TARGET]),
                Shape.chain(Shape.fromGeometry(backward))
              )(shape)
            );
          }
        }
        faces.push(
          await faceOp(
            await Group(...edges),
            Shape.chain(Shape.fromGeometry(faceGeometry))
          )
        );
      }
      const grouped = groupOp(...faces);
      if (Shape.isFunction(grouped)) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);

const toCoordinate = Shape.registerMethod(
  'toCoordinate',
  (x = 0, y = 0, z = 0) =>
    async (shape) => {
      if (Shape.isFunction(x)) {
        x = await x(shape);
      }
      if (Shape.isShape(x)) {
        const points = await x.toPoints();
        if (points.length >= 1) {
          const point = points[0];
          return point;
        } else {
          throw Error(`Unexpected coordinate value: ${JSON.stringify(x)}`);
        }
      } else if (Shape.isArray(x)) {
        return x;
      } else if (typeof x === 'number') {
        if (typeof y !== 'number') {
          throw Error(`Unexpected coordinate value: ${JSON.stringify(y)}`);
        }
        if (typeof z !== 'number') {
          throw Error(`Unexpected coordinate value: ${JSON.stringify(z)}`);
        }
        return [x, y, z];
      } else {
        throw Error(`Unexpected coordinate value: ${JSON.stringify(x)}`);
      }
    }
);

const toCoordinateOp$1 = Shape.ops.get('toCoordinate');
let toCoordinatesOp$1;

const toCoordinates = Shape.registerMethod(
  'toCoordinates',
  (...args) =>
    async (shape) => {
      const coordinates = [];
      while (args.length > 0) {
        let x = args.shift();
        if (Shape.isFunction(x)) {
          x = await x(shape);
        }
        if (Shape.isShape(x)) {
          if (x.toGeometry().type === 'group') {
            coordinates.push(
              ...(await toCoordinatesOp$1(
                ...x
                  .toGeometry()
                  .content.map((geometry) => Shape.fromGeometry(geometry))
              )(shape))
            );
          } else {
            coordinates.push(await toCoordinateOp$1(x)(shape));
          }
        } else if (Shape.isArray(x)) {
          if (isNaN(x[0]) || isNaN(x[1]) || isNaN(x[2])) {
            for (const element of x) {
              coordinates.push(...(await toCoordinatesOp$1(element)(shape)));
            }
          } else {
            coordinates.push(x);
          }
        } else if (typeof x === 'number') {
          let y = args.shift();
          let z = args.shift();
          if (y === undefined) {
            y = 0;
          }
          if (z === undefined) {
            z = 0;
          }
          if (typeof y !== 'number') {
            throw Error(`Unexpected coordinate value: ${y}`);
          }
          if (typeof z !== 'number') {
            throw Error(`Unexpected coordinate value: ${z}`);
          }
          coordinates.push([x, y, z]);
        } else {
          throw Error(`Unexpected coordinate value: ${JSON.stringify(x)}`);
        }
      }
      return coordinates;
    }
);

toCoordinatesOp$1 = Shape.ops.get('toCoordinates');

const toCoordinatesOp = Shape.ops.get('toCoordinates');

// TODO: Fix toCoordinates.
const move = Shape.registerMethod(
  ['move', 'xyz'],
  (...args) =>
    async (shape) => {
      const results = [];
      for (const coordinate of await toCoordinatesOp(...args)(shape)) {
        results.push(
          await transform(fromTranslateToTransform(...coordinate))(shape)
        );
      }
      return Group(...results);
    }
);

const xyz = move;

const eachPoint = Shape.registerMethod(
  'eachPoint',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions } = destructure(args);
      let [pointOp = (point) => (shape) => point, groupOp = Group] =
        shapesAndFunctions;
      const coordinates = [];
      let nth = 0;
      eachPoint$1(await shape.toGeometry(), ([x = 0, y = 0, z = 0]) =>
        coordinates.push([x, y, z])
      );
      const points = [];
      for (const [x, y, z] of coordinates) {
        const point = await Point();
        const moved = await move(x, y, z)(point);
        const operated = await pointOp(Shape.chain(moved), nth++);
        points.push(operated);
      }
      const grouped = groupOp(...points);
      if (Shape.isFunction(grouped)) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);

const eachSegment = Shape.registerMethod(
  'eachSegment',
  (...args) =>
    async (shape) => {
      const [segmentOp = (segment) => (shape) => segment, groupOp = Group] =
        await destructure2(shape, args, 'function', 'function');
      const inputs = linearize(
        await shape.toGeometry(),
        ({ type }) => type === 'segments'
      );
      const output = [];
      for (const { matrix, segments, normals } of inputs) {
        for (let nth = 0; nth < segments.length; nth++) {
          const [segment] = disorientSegment(
            segments[nth],
            matrix,
            normals ? normals[nth] : undefined
          );
          output.push(
            await segmentOp(Shape.chain(Shape.fromGeometry(segment)))(shape)
          );
        }
      }
      const grouped = groupOp(...output);
      if (Shape.isFunction(grouped)) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);

const eagerTransform = Shape.registerMethod(
  'eagerTransform',
  (matrix) => async (shape) =>
    Shape.fromGeometry(eagerTransform$1(matrix, await shape.toGeometry()))
);

// TODO: deprecate.
const edit = Shape.registerMethod(
  'edit',
  (editId) => (shape) => shape.untag('editId:*').tag(`editId:${editId}`)
);

const edges = Shape.registerMethod(
  'edges',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions, object: options = {} } = destructure(args);
      const { selections = [] } = options;
      let [edgesOp = (edges) => edges, groupOp = Group] = shapesAndFunctions;
      if (edgesOp instanceof Shape) {
        const edgesShape = edgesOp;
        edgesOp = (edges) => edgesShape.to(edges);
      }
      const edges = [];
      eachFaceEdges(
        await shape.toGeometry(),
        await shape.toShapesGeometries(selections),
        (faceGeometry, edgeGeometry) => {
          if (edgeGeometry) {
            edges.push(edgesOp(Shape.chain(Shape.fromGeometry(edgeGeometry))));
          }
        }
      );
      const grouped = groupOp(...edges);
      if (grouped instanceof Function) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);

const faces = Shape.registerMethod(
  'faces',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions } = destructure(args);
      let [faceOp = (face) => (shape) => face, groupOp = Group] =
        shapesAndFunctions;
      return eachEdge(
        (e, l, o) => (s) => e,
        (e, f) => (s) => faceOp(f),
        groupOp
      )(shape);
    }
);

const fill = Shape.registerMethod(
  ['fill', 'f'],
  () => async (shape) =>
    Shape.fromGeometry(fill$2(await shape.toGeometry()))
);

const fit = Shape.registerMethod('fit', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return async (shape) =>
    Shape.fromGeometry(
      disjoint$1(
        [...(await shape.toShapesGeometries(shapes)), await shape.toGeometry()],
        undefined,
        modes.includes('exact')
      )
    );
});

const fitTo = Shape.registerMethod('fitTo', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return async (shape) =>
    Shape.fromGeometry(
      disjoint$1(
        [await shape.toGeometry(), ...(await shape.toShapesGeometries(shapes))],
        undefined,
        modes.includes('exact')
      )
    );
});

const fix = Shape.registerMethod(
  'fix',
  () => (shape) =>
    Shape.fromGeometry(
      fix$1(shape.toGeometry(), /* removeSelfIntersections= */ true)
    )
);

const origin = Shape.registerMethod(
  ['origin', 'o'],
  () => async (shape) => {
    const { local } = getInverseMatrices(await shape.toGeometry());
    return Point().transform(local);
  }
);

const o = origin;

const to = Shape.registerMethod('to', (...args) => async (shape) => {
  const { shapesAndFunctions: references } = destructure(args);
  const arranged = [];
  for (const reference of await shape.toShapes(references)) {
    arranged.push(await by(origin()).by(reference)(shape));
  }
  return Group(...arranged);
});

const flat = Shape.registerMethod(
  'flat',
  () => async (shape) => to(XY())(shape)
);

const applyModes = async (shape, options, modes) => {
  if (modes.includes('wireframe')) {
    shape = await shape.tag('show:wireframe');
  }
  if (modes.includes('noWireframe')) {
    shape = await shape.tag('show:noWireframe');
  }
  if (modes.includes('skin')) {
    shape = await shape.tag('show:skin');
  }
  if (modes.includes('noSkin')) {
    shape = await shape.tag('show:noSkin');
  }
  if (modes.includes('Outline')) {
    shape = await shape.tag('show:outline');
  }
  if (modes.includes('noOutline')) {
    shape = await shape.tag('show:noOutline');
  }
  return shape;
};

const qualifyViewId = (viewId, { id, path, nth }) => {
  if (viewId) {
    // We can't put spaces into viewId since that would break dom classname requirements.
    viewId = `${id}_${String(viewId).replace(/ /g, '_')}`;
  } else if (nth) {
    viewId = `${id}_${nth}`;
  } else {
    viewId = `${id}`;
  }
  return { id, path, viewId };
};

// FIX: Avoid the extra read-write cycle.
const baseView =
  (name, op = (x) => x, options = {}) =>
  async (shape) => {
    let {
      size,
      inline,
      width = 512,
      height = 512,
      position = [100, -100, 100],
    } = options;

    if (size !== undefined) {
      width = size;
      height = size / 2;
    }
    const viewShape = await op(shape);
    const sourceLocation = getSourceLocation();
    if (!sourceLocation) {
      console.log('No sourceLocation');
    }
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    const displayGeometry = await viewShape.toDisplayGeometry();
    for (const pageGeometry of await ensurePages(
      Shape.fromGeometry(displayGeometry),
      0)) {
      const viewPath = `view/${path}/${id}/${viewId}.view`;
      const hash = generateUniqueId();
      const thumbnailPath = `thumbnail/${path}/${id}/${viewId}.thumbnail`;
      const view = {
        viewId,
        width,
        height,
        position,
        inline,
        needsThumbnail: isNode,
        thumbnailPath,
      };
      emit({ hash, path: viewPath, view });
      await write(viewPath, pageGeometry);
      if (!isNode) {
        await write(thumbnailPath, dataUrl(viewShape, view));
      }
    }
    return shape;
  };

Shape.registerMethod(
  'topView',
  (...args) =>
    async (shape) => {
      const {
        value: viewId,
        func: op = (x) => x,
        object: options,
        strings: modes,
      } = Shape.destructure(args, {
        object: {
          size: 512,
          skin: true,
          outline: true,
          wireframe: false,
          width: 512,
          height: 512,
          position: [0, 0, 100],
        },
      });
      shape = await applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

const gridView = Shape.registerMethod(
  'gridView',
  (...args) =>
    async (shape) => {
      const {
        value: viewId,
        func: op = (x) => x,
        object: options,
        strings: modes,
      } = Shape.destructure(args, {
        object: {
          size: 512,
          skin: true,
          outline: true,
          wireframe: false,
          width: 512,
          height: 512,
          position: [0, 0, 100],
        },
      });
      shape = await applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

Shape.registerMethod(
  'frontView',
  (...args) =>
    async (shape) => {
      const {
        value: viewId,
        func: op = (x) => x,
        object: options,
        strings: modes,
      } = Shape.destructure(args, {
        object: {
          size: 512,
          skin: true,
          outline: true,
          wireframe: false,
          width: 512,
          height: 512,
          position: [0, -100, 0],
        },
      });
      shape = await applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

Shape.registerMethod(
  'sideView',
  (...args) =>
    async (shape) => {
      const {
        value: viewId,
        func: op = (x) => x,
        object: options,
        strings: modes,
      } = Shape.destructure(args, {
        object: {
          size: 512,
          skin: true,
          outline: true,
          wireframe: false,
          width: 512,
          height: 512,
          position: [100, 0, 0],
        },
      });
      shape = await applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

const view = Shape.registerMethod('view', (...args) => async (shape) => {
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args);
  shape = await applyModes(shape, options, modes);
  if (modes.includes('grid')) {
    options.style = 'grid';
  }
  if (modes.includes('none')) {
    options.style = 'none';
  }
  if (modes.includes('side')) {
    options.style = 'side';
  }
  if (modes.includes('top')) {
    options.style = 'top';
  }
  switch (options.style) {
    case 'grid':
      return shape.gridView(viewId, op, options, ...modes);
    case 'none':
      return shape;
    case 'side':
      return shape.sideView(viewId, op, options, ...modes);
    case 'top':
      return shape.topView(viewId, op, options, ...modes);
    default:
      return baseView(viewId, op, options)(shape);
  }
});

const gcode = Shape.registerMethod(
  'gcode',
  (...args) =>
    async (shape) => {
      const {
        value: name,
        func: op = (s) => s,
        object: options = {},
      } = destructure(args);
      const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
      let index = 0;
      for (const entry of await ensurePages(op(shape))) {
        const gcodePath = `download/gcode/${path}/${id}/${viewId}`;
        await write(gcodePath, await toGcode(entry, {}, options));

        const suffix = index++ === 0 ? '' : `_${index}`;
        const filename = `${name}${suffix}.gcode`;
        const record = {
          path: gcodePath,
          filename,
          type: 'application/x-gcode',
        };
        // Produce a view of what will be downloaded.
        const hash$1 = computeHash({ filename, options }) + hash(entry);
        await gridView(name, options.view)(Shape.fromGeometry(entry));
        emit({ download: { entries: [record] }, hash: hash$1 });
      }
      return shape;
    }
);

const Fuse = Join;

const fuse = Shape.registerMethod('fuse', (...args) => async (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return fromGeometry(
    fuse$1(
      await Group(shape, ...shapes).toGeometry(),
      modes.includes('exact')
    )
  );
});

const voidFn = Shape.registerMethod(
  ['void', 'gap'],
  () => async (shape) =>
    Shape.fromGeometry(hasTypeGhost(hasTypeVoid(await shape.toGeometry())))
);

const gap = voidFn;

// get, ignoring item boundaries.

const getAll = Shape.registerMethod(
  'getAll',
  (...args) =>
    async (shape) => {
      const { strings: tags, func: groupOp = Group } = destructure(args);
      const isMatch = oneOfTagMatcher(tags, 'item');
      const picks = [];
      const walk = (geometry, descend) => {
        const { tags, type } = geometry;
        if (type === 'group') {
          return descend();
        }
        if (isMatch(`type:${geometry.type}`)) {
          picks.push(Shape.fromGeometry(geometry));
        } else {
          for (const tag of tags) {
            if (isMatch(tag)) {
              picks.push(Shape.fromGeometry(geometry));
              break;
            }
          }
        }
        return descend();
      };
      const geometry = await shape.toGeometry();
      visit(geometry, walk);
      return groupOp(...picks);
    }
);

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var parseNumber = createCommonjsModule(function (module) {
/**
 * More correct array check
 */
var parser = module.exports = function(str) {
  if (Array.isArray(str)) return NaN;
  return parser.str(str);
};

/**
 * Simple check, assumes non-array inputs
 */
parser.str = function(str) {
  if (str == null || str === "") return NaN;
  return +str;
};
});

const getTag = Shape.registerMethod('getTag', (...args) => (shape) => {
  const {
    strings: tags,
    func: op = (...values) =>
      (shape) =>
        shape,
  } = destructure(args);
  const values = [];
  for (const tag of tags) {
    const tags = shape.tags(`${tag}=*`, list);
    if (tags.length === 0) {
      values.push(undefined);
      continue;
    }
    const [, value] = tags[0].split('=');
    const number = parseNumber(value);
    if (isFinite(number)) {
      values.push(value);
      continue;
    }
    values.push(value);
  }
  return op(...values)(shape);
});

const getTags = Shape.registerMethod(
  'getTags',
  (tags = []) =>
    async (shape) => {
      const { tags = [] } = await shape.toGeometry();
      return tags;
    }
);

const grow = Shape.registerMethod('grow', (...args) => async (shape) => {
  const {
    number: amount,
    string: axes = 'xyz',
    shapesAndFunctions: selections,
  } = destructure(args);
  return Shape.fromGeometry(
    grow$1(
      await shape.toGeometry(),
      await Point().z(amount).toGeometry(),
      await shape.toShapesGeometries(selections),
      {
        x: axes.includes('x'),
        y: axes.includes('y'),
        z: axes.includes('z'),
      }
    )
  );
});

const inFn = Shape.registerMethod('in', () => async (shape) => {
  const geometry = await shape.toGeometry();
  if (geometry.type === 'item') {
    return Shape.fromGeometry(geometry.content[0]);
  } else {
    return shape;
  }
});

const hold = Shape.registerMethod2(
  'hold',
  ['inputShape', 'shapes'],
  (inputShape, shapes) => inputShape.on(inFn(), inFn().and(...shapes))
);

const image = Shape.registerMethod(
  'image',
  (url) => (shape) => untag('image:*').tag(`image:${url}`)(shape)
);

const inset = Shape.registerMethod(
  'inset',
  (initial = 1, { segments = 16, step, limit } = {}) =>
    async (shape) =>
      Shape.fromGeometry(
        inset$1(await shape.toGeometry(), initial, step, limit, segments)
      )
);

const involute = Shape.registerMethod(
  'involute',
  () => async (shape) =>
    Shape.fromGeometry(involute$1(await shape.toGeometry()))
);

const load = async (path) => {
  logInfo('api/shape/load', path);

  const walk = async (data) => {
    if (typeof data !== 'object') {
      return data;
    }
    if (data instanceof Array) {
      const walked = [];
      for (let nth = 0; nth < data.length; nth++) {
        walked[nth] = await walk(data[nth]);
      }
      return walked;
    }
    if (data.geometry) {
      return Shape.fromGeometry(await load$1(data.geometry));
    }
    const walked = {};
    for (const key of Object.keys(data)) {
      walked[key] = await walk(data[key]);
    }
    return walked;
  };
  const rawData = await read(path);
  const data = await walk(rawData);
  return data;
};

const fromUndefined = () => undefined;

const loadGeometry = async (
  path,
  { otherwise = fromUndefined } = {}
) => {
  logInfo('api/shape/loadGeometry', path);
  const geometry = await read$1(path);
  if (geometry === undefined) {
    return otherwise();
  } else {
    return Shape.fromGeometry(geometry);
  }
};

const Loft = Shape.registerMethod('Loft', (...args) => async (shape) => {
  const [modes, shapes] = await destructure2(shape, args, 'modes', 'shapes');
  return Shape.fromGeometry(
    loft$1(
      await toShapesGeometries(shapes)(shape),
      !modes.includes('open')
    )
  );
});

const loft = Shape.registerMethod(
  'loft',
  (...args) =>
    async (shape) =>
      Loft(shape, ...args)(shape)
);

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

const log = Shape.registerMethod(
  'log',
  (prefix = '') =>
    async (shape) => {
      const text = prefix + JSON.stringify(await shape.toGeometry());
      const level = 'serious';
      const log = { text, level };
      const hash = computeHash(log);
      emit({ log, hash });
      log$1({ op: 'text', text });
      console.log(text);
      return shape;
    }
);

const lowerEnvelope = Shape.registerMethod(
  'lowerEnvelope',
  () => async (shape) =>
    Shape.fromGeometry(generateLowerEnvelope(await shape.toGeometry()))
);

const overlay = Shape.registerMethod(
  'overlay',
  () => (shape) => Shape.fromGeometry(hasShowOverlay(shape.toGeometry()))
);

// Note: the first three segments are notionally 'length', 'depth', 'height'.

const mark = Shape.registerMethod('mark', () => async (shape) => {
  return Shape.fromGeometry(
    computeOrientedBoundingBox(await shape.toGeometry())
  );
});

const masked = Shape.registerMethod(
  'masked',
  (...args) =>
    async (shape) => {
      const [masks] = await destructure2(shape, args, 'shapes');
      const shapes = [];
      for (const mask of masks) {
        shapes.push(await gap()(mask));
      }
      return Group(
        ...shapes,
        Shape.fromGeometry(hasTypeMasked(await shape.toGeometry()))
      );
    }
);

const masking = Shape.registerMethod(
  'masking',
  (...args) =>
    async (shape) => {
      const [masked] = await destructure2(shape, args, 'geometry');
      return Group(
        await gap()(shape),
        Shape.fromGeometry(hasTypeMasked(masked))
      );
    }
);

const material = Shape.registerMethod(
  'material',
  (name) => async (shape) =>
    Shape.fromGeometry(hasMaterial(await shape.toGeometry(), name))
);

const scale$2 = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const moveAlong = Shape.registerMethod(
  'moveAlong',
  (...args) =>
    async (shape) => {
      const [direction, deltas] = await destructure2(
        shape,
        args,
        'coordinate',
        'numbers'
      );
      const moves = [];
      for (const delta of deltas) {
        moves.push(await shape.move(scale$2(delta, direction)));
      }
      return Group(...moves);
    }
);

const m = Shape.registerMethod(
  'm',
  (...offsets) =>
    (shape) =>
      shape.moveAlong(normal(), ...offsets)
);

const noOp = Shape.registerMethod('noOp', () => (shape) => shape);

const noVoid = Shape.registerMethod(
  ['noVoid', 'noGap'],
  () => (shape) => shape.on(get('type:void'), Empty())
);

const noGap = noVoid;

const eachOp = Shape.ops.get('each');

const nth = Shape.registerMethod(
  ['nth', 'n'],
  (...ns) =>
    async (shape) => {
      const candidates = await eachOp(
        (leaf) => leaf,
        (...leafs) =>
          (shape) =>
            leafs
      )(shape);
      const group = [];
      for (let nth of ns) {
        if (nth < 0) {
          nth = candidates.length - nth;
        }
        const candidate = candidates[nth];
        if (candidate === undefined) {
          group.push(Empty());
        } else {
          group.push(candidate);
        }
      }
      return Group(...group);
    }
);

const n = nth;

const offset = Shape.registerMethod(
  'offset',
  (initial = 1, { segments = 16, step, limit } = {}) =>
    async (shape) =>
      Shape.fromGeometry(
        offset$1(await shape.toGeometry(), initial, step, limit, segments)
      )
);

const outline = Shape.registerMethod(
  'outline',
  (...args) =>
    async (shape) => {
      const { shapesAndFunctions: selections } = destructure(args);
      return Shape.fromGeometry(
        outline$1(
          await shape.toGeometry(),
          await shape.toShapesGeometries(selections)
        )
      );
    }
);

const cross = ([ax, ay, az], [bx, by, bz]) => [
  ay * bz - az * by,
  az * bx - ax * bz,
  ax * by - ay * bx,
];

const scale$1 = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const normalize = (a) => {
  const [x, y, z] = a;
  const len = x * x + y * y + z * z;
  if (len > 0) {
    // TODO: evaluate use of glm_invsqrt here?
    return scale$1(1 / Math.sqrt(len), a);
  } else {
    return a;
  }
};

const squaredLength = ([x, y, z]) => x * x + y * y + z * z;

const subtract = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

const X$4 = 0;
const Y$4 = 1;
const Z$4 = 2;

// These are all absolute positions in the world.
// at is where the object's origin should move to.
// to is where the object's axis should point at.
// up rotates around the axis to point a dorsal position toward.

const orient = Shape.registerMethod(
  'orient',
  ({ at = [0, 0, 0], to = [0, 0, 1], up = [1, 0, 0] } = {}) =>
    async (shape) => {
      const { local } = getInverseMatrices(await shape.toGeometry());
      // Algorithm from threejs Matrix4
      let u = subtract(up, at);
      if (squaredLength(u) === 0) {
        u[Z$4] = 1;
      }
      u = normalize(u);
      let z = subtract(to, at);
      if (squaredLength(z) === 0) {
        z[Z$4] = 1;
      }
      z = normalize(z);
      let x = cross(u, z);
      if (squaredLength(x) === 0) {
        // u and z are parallel
        if (Math.abs(u[Z$4]) === 1) {
          z[X$4] += 0.0001;
        } else {
          z[Z$4] += 0.0001;
        }
        z = normalize(z);
        x = cross(u, z);
      }
      x = normalize(x);
      let y = cross(z, x);
      const lookAt = [
        x[X$4],
        x[Y$4],
        x[Z$4],
        0,
        y[X$4],
        y[Y$4],
        y[Z$4],
        0,
        z[X$4],
        z[Y$4],
        z[Z$4],
        0,
        0,
        0,
        0,
        1,
      ];
      // FIX: Move this to CGAL.
      lookAt.blessed = true;
      return shape
        .transform(local)
        .transform(lookAt)
        .move(...at);
    }
);

const pack = Shape.registerMethod(
  'pack',
  ({
      size,
      pageMargin = 5,
      itemMargin = 1,
      perLayout = Infinity,
      packSize = [],
    } = {}) =>
    async (shape) => {
      if (perLayout === 0) {
        // Packing was disabled -- do nothing.
        return shape;
      }

      let todo = [];
      for (const leaf of getLeafs(await shape.toGeometry())) {
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
        if (minPoint.every(isFinite) && maxPoint.every(isFinite)) {
          // CHECK: Why is this being overwritten by each pass?
          packSize[0] = minPoint;
          packSize[1] = maxPoint;
          if (packed.length === 0) {
            break;
          } else {
            packedLayers.push(
              taggedItem(
                { tags: ['pack:layout'] },
                taggedGroup({}, ...packed) // .map(shape => shape.toGeometry())
              )
            );
          }
          todo.unshift(...unpacked);
        }
      }
      // CHECK: Can this distinguish between a set of packed paged, and a single
      // page that's packed?
      let packedShape = Shape.fromGeometry(taggedGroup({}, ...packedLayers));
      if (size === undefined) {
        packedShape = packedShape.by(align('xy'));
      }
      return packedShape;
    }
);

const pdf = Shape.registerMethod('pdf', (...args) => async (shape) => {
  const {
    value: name,
    func: op = (s) => s,
    object: options = {},
  } = Shape.destructure(args);
  const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
  let index = 0;
  for (const entry of await ensurePages(await op(shape))) {
    const pdfPath = `download/pdf/${path}/${id}/${viewId}`;
    await write(pdfPath, await toPdf(entry, options));
    const suffix = index++ === 0 ? '' : `_${index}`;
    const filename = `${name}${suffix}.pdf`;
    const record = {
      path: pdfPath,
      filename,
      type: 'application/pdf',
    };
    const hash$1 = computeHash({ filename, options }) + hash(entry);
    await gridView(name, options.view)(Shape.fromGeometry(entry));
    emit({ download: { entries: [record] }, hash: hash$1 });
  }
  return shape;
});

const points$1 = Shape.registerMethod('points', () => async (shape) => {
  const points = [];
  eachPoint$1(await shape.toGeometry(), ([x = 0, y = 0, z = 0, exact]) =>
    points.push([x, y, z, exact])
  );
  return Shape.fromGeometry(taggedPoints({}, points));
});

const self = Shape.registerMethod('self', () => (shape) => shape);

const put = Shape.registerMethod(
  'put',
  (...shapes) =>
    async (shape) =>
      on(self(), shapes)(shape)
);

const remesh = Shape.registerMethod(
  'remesh',
  (...args) =>
    async (shape) => {
      const {
        number: resolution = 1,
        shapesAndFunctions: selections,
        object: options,
      } = Shape.destructure(args);
      const {
        iterations = 1,
        relaxationSteps = 1,
        targetEdgeLength = resolution,
      } = options;
      return Shape.fromGeometry(
        remesh$1(
          await shape.toGeometry(),
          await shape.toShapesGeometries(selections),
          iterations,
          relaxationSteps,
          targetEdgeLength
        )
      );
    }
);

// rz is in terms of turns -- 1/2 is a half turn.
const rz = Shape.registerMethod(
  ['rotateZ', 'rz'],
  (...turns) =>
    async (shape) => {
      const rotated = [];
      for (const turn of await shape.toFlatValues(turns)) {
        rotated.push(await transform(fromRotateZToTransform(turn))(shape));
      }
      return Group(...rotated);
    }
);

const rotateZ = rz;

const square = (a) => a * a;

const distance = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  Math.sqrt(square(ax - bx) + square(ay - by) + square(az - bz));

const runLength = Shape.registerMethod(
  'runLength',
  (op = (length) => (shape) => length) =>
    async (shape) => {
      let total = 0;
      for (const { segments } of linearize(
        await shape.toGeometry(),
        ({ type }) => type === 'segments'
      )) {
        for (const [source, target] of segments) {
          total += distance(source, target);
        }
      }
      return op(total)(shape);
    }
);

const save = async (path, data) => {
  const walk = async (data) => {
    if (data instanceof Function) {
      throw Error('Cannot save functions');
    }
    if (typeof data !== 'object') {
      return data;
    }
    if (data instanceof Array) {
      const walked = [];
      for (let nth = 0; nth < data.length; nth++) {
        walked[nth] = await walk(data[nth]);
      }
      return walked;
    }
    if (data instanceof Shape) {
      return { geometry: await store(await data.toGeometry()) };
    }
    const walked = {};
    for (const key of Object.keys(data)) {
      walked[key] = await walk(data[key]);
    }
    return walked;
  };
  const walked = await walk(data);
  await write(path, walked);
};

const saveGeometry = async (path, shape) =>
  Shape.fromGeometry(await write$1(path, await shape.toGeometry()));

const scale = Shape.registerMethod(
  ['scale', 's'],
  (x = 1, y = x, z = y) =>
    async (shape) => {
      [x = 1, y = x, z = y] = await shape.toCoordinate(x, y, z);
      if (x === 0) {
        x = 1;
      }
      if (y === 0) {
        y = 1;
      }
      if (z === 0) {
        z = 1;
      }
      const negatives = (x < 0) + (y < 0) + (z < 0);
      if (!isFinite(x)) {
        throw Error(`scale received non-finite x: ${x}`);
      }
      if (!isFinite(y)) {
        throw Error(`scale received non-finite y: ${y}`);
      }
      if (!isFinite(z)) {
        throw Error(`scale received non-finite z: ${z}`);
      }
      if (negatives % 2) {
        // Compensate for inversion.
        return eagerTransform(fromScaleToTransform(x, y, z)).involute()(shape);
      } else {
        return eagerTransform(fromScaleToTransform(x, y, z))(shape);
      }
    }
);

const s = scale;

const scaleX = Shape.registerMethod(
  ['scaleX', 'sx'],
  (...x) =>
    async (shape) => {
      const scaled = [];
      for (const value of await shape.toFlatValues(x)) {
        scaled.push(await scale(value, 1, 1)(shape));
      }
      return Group(...scaled);
    }
);

const sx = scaleX;

const scaleY = Shape.registerMethod(
  ['scaleY', 'sy'],
  (...y) =>
    async (shape) => {
      const scaled = [];
      for (const value of await shape.toFlatValues(y)) {
        scaled.push(await scale(1, value, 1)(shape));
      }
      return Group(...scaled);
    }
);

const sy = scaleY;

const scaleZ = Shape.registerMethod(
  ['scaleZ', 'sz'],
  (...z) =>
    async (shape) => {
      const scaled = [];
      for (const value of await shape.toFlatValues(z)) {
        scaled.push(await scale(1, 1, value)(shape));
      }
      return Group(...scaled);
    }
);

const sz = scaleZ;

const scaleToFit = Shape.registerMethod(
  'scaleToFit',
  (x = 1, y = x, z = y) =>
    async (shape) => {
      return size(({ length, width, height }) => (shape) => {
        const xFactor = x / length;
        const yFactor = y / width;
        const zFactor = z / height;
        // Surfaces may get non-finite factors -- use the unit instead.
        const finite = (factor) => (isFinite(factor) ? factor : 1);
        return shape.scale(finite(xFactor), finite(yFactor), finite(zFactor));
      })(shape);
    }
);

const seam = Shape.registerMethod('seam', (...args) => async (shape) => {
  const { shapesAndFunctions: selections } = destructure(args);
  return Shape.fromGeometry(
    seam$1(
      await shape.toGeometry(),
      await shape.toShapesGeometries(selections)
    )
  );
});

const baseSection =
  ({ profile = false } = {}, orientations) =>
  async (shape) => {
    orientations = await shape.toShapesGeometries(orientations);
    if (orientations.length === 0) {
      orientations.push(await Point().toGeometry());
    }
    return Shape.fromGeometry(
      section$1(await shape.toGeometry(), orientations, { profile })
    );
  };

const section = Shape.registerMethod(
  'section',
  (...orientations) =>
    (shape) =>
      baseSection({ profile: false }, orientations)(shape)
);

const sectionProfile = Shape.registerMethod(
  'sectionProfile',
  (...orientations) =>
    (shape) =>
      baseSection({ profile: true }, orientations)(shape)
);

const separate = Shape.registerMethod(
  'separate',
  (...args) =>
    (shape) => {
      const { strings: modes = [] } = destructure(args);
      return Shape.fromGeometry(
        separate$1(
          shape.toGeometry(),
          !modes.includes('noShapes'),
          !modes.includes('noHoles'),
          modes.includes('holesAsShapes')
        )
      );
    }
);

const EPSILON = 1e-5;

const maybeApply = (value, input) => {
  if (Shape.isFunction(value)) {
    return value(input);
  } else {
    return value;
  }
};

const seq = Shape.registerMethod2(
  'seq',
  ['input', 'objects', 'function', 'function'],
  async (input, specs, op = (n) => (s) => s, groupOp = Group) => {
    const indexes = [];
    for (const spec of specs) {
      let { from = 0, to = 1, upto, downto, by = 1 } = spec;

      from = await toValue(from)(input);
      to = await toValue(to)(input);
      upto = await toValue(upto)(input);
      downto = await toValue(downto)(input);
      by = await toValue(by)(input);

      let consider;

      if (by > 0) {
        if (upto !== undefined) {
          consider = (value) => value < upto - EPSILON;
        } else {
          consider = (value) => value <= to + EPSILON;
        }
      } else if (by < 0) {
        if (downto !== undefined) {
          consider = (value) => value > downto + EPSILON;
        } else {
          consider = (value) => value >= to - EPSILON;
        }
      } else {
        throw Error('seq: Expects by != 0');
      }
      const numbers = [];
      for (let number = from, nth = 0; consider(number); number += by, nth++) {
        numbers.push(number);
      }
      indexes.push(numbers);
    }
    const results = [];
    const index = indexes.map(() => 0);
    for (;;) {
      const args = index.map((nth, index) => indexes[index][nth]);
      if (args.some((value) => value === undefined)) {
        break;
      }
      const result = await op(...args)(input);
      results.push(maybeApply(result, input));
      let nth;
      for (nth = 0; nth < index.length; nth++) {
        if (++index[nth] < indexes[nth].length) {
          break;
        }
        index[nth] = 0;
      }
      if (nth === index.length) {
        break;
      }
    }
    return groupOp(...results);
  }
);

const Seq = Shape.registerMethod2(
  'Seq',
  ['input', 'rest'],
  (input = Empty(), rest) => input.seq(...rest)
);

const serialize = Shape.registerMethod(
  'serialize',
  (op = (v) => v, groupOp = (v, s) => s) =>
    (shape) =>
      groupOp(op(serialize$1(shape.toGeometry())), shape)
);

const setTag = Shape.registerMethod(
  'setTag',
  (tag, value) => (shape) => untag(`${tag}=*`).tag(`${tag}=${value}`)(shape)
);

const setTags = Shape.registerMethod(
  'setTags',
  (tags = []) =>
    async (shape) =>
      Shape.fromGeometry(rewriteTags(tags, [], await shape.toGeometry()))
);

const shadow = Shape.registerMethod(
  'shadow',
  (planeReference = XY(0), sourceReference = XY(1)) =>
    async (shape) =>
      Shape.fromGeometry(
        cast(
          await toShapeGeometry(planeReference)(shape),
          await toShapeGeometry(sourceReference)(shape),
          await shape.toGeometry()
        )
      )
);

const shell = Shape.registerMethod(
  'shell',
  (...args) =>
    async (shape) => {
      const [
        modes,
        interval = [1 / -2, 1 / 2],
        sizingFallback,
        approxFallback,
        options = {},
      ] = await destructure2(
        shape,
        args,
        'modes',
        'interval',
        'number',
        'options'
      );
      // Application of angle and edgeLength is unclear.
      const {
        angle,
        sizing = sizingFallback,
        approx = approxFallback,
        edgeLength,
      } = options;
      const [innerOffset, outerOffset] = interval;
      return Shape.fromGeometry(
        shell$1(
          await shape.toGeometry(),
          innerOffset,
          outerOffset,
          modes.includes('protect'),
          angle,
          sizing,
          approx,
          edgeLength
        )
      );
    }
);

const simplify = Shape.registerMethod(
  'simplify',
  (...args) =>
    async (shape) => {
      const { object: options = {}, number: eps } = destructure(args);
      const { ratio = 1.0 } = options;
      return Shape.fromGeometry(
        simplify$1(await shape.toGeometry(), ratio, eps)
      );
    }
);

const sketch = Shape.registerMethod(
  'sketch',
  () => async (shape) =>
    Shape.fromGeometry(taggedSketch({}, await shape.toGeometry()))
);

const smooth = Shape.registerMethod(
  'smooth',
  (...args) =>
    async (shape) => {
      const {
        number: resolution = 1,
        object: options = {},
        shapesAndFunctions: selections,
      } = destructure(args);
      const {
        iterations = 1,
        time = 1,
        remeshIterations = 1,
        remeshRelaxationSteps = 1,
      } = options;
      return Shape.fromGeometry(
        smooth$1(
          await shape.toGeometry(),
          await shape.toShapesGeometries(selections),
          resolution,
          iterations,
          time,
          remeshIterations,
          remeshRelaxationSteps
        )
      );
    }
);

const X$3 = 0;
const Y$3 = 1;
const Z$3 = 2;

const sort = Shape.registerMethod(
  'sort',
  (spec = 'z<y<x<') =>
    async (shape) => {
      let leafs = [];
      for (const leaf of getLeafs(await shape.toGeometry())) {
        const [min, max] = measureBoundingBox(leaf);
        const shape = await Shape.fromGeometry(leaf);
        leafs.push({ min, max, shape });
      }
      const ops = [];
      while (spec) {
        const found = spec.match(/([xyz])([<>])([0-9.])?(.*)/);
        if (found === null) {
          throw Error(`Bad sort spec ${spec}`);
        }
        const [, dimension, order, limit, rest] = found;
        // console.log(`dimension: ${dimension}`);
        // console.log(`order: ${order}`);
        // console.log(`limit: ${limit}`);
        // console.log(`rest: ${rest}`);
        // We apply the sorting ops in reverse.
        ops.unshift({ dimension, order, limit });
        spec = rest;
      }
      for (const { dimension, order, limit } of ops) {
        let axis;
        switch (dimension) {
          case 'x':
            axis = X$3;
            break;
          case 'y':
            axis = Y$3;
            break;
          case 'z':
            axis = Z$3;
            break;
        }
        if (limit !== undefined) {
          switch (order) {
            case '>':
              leafs = leafs.filter(({ min }) => min[axis] > limit);
              break;
            case '<':
              leafs = leafs.filter(({ max }) => max[axis] < limit);
              break;
          }
        }
        switch (order) {
          case '>':
            leafs = leafs.sort((a, b) => b.min[axis] - a.min[axis]);
            break;
          case '<':
            leafs = leafs.sort((a, b) => a.max[axis] - b.max[axis]);
            break;
        }
      }
      return Group(...leafs.map(({ shape }) => shape));
    }
);

const LoadStl = Shape.registerMethod(
  'LoadStl',
  (...args) =>
    async (shape) => {
      const [path, modes] = await await destructure2(
        shape,
        args,
        'string',
        'modes'
      );
      const data = await read(`source/${path}`, { sources: [path] });
      const format = modes.includes('binary') ? 'binary' : 'ascii';
      return Shape.fromGeometry(await fromStl(data, { format }));
    }
);

const stl = Shape.registerMethod('stl', (...args) => async (shape) => {
  const [name, op = (s) => s, options] = await destructure2(
    shape,
    args,
    'string',
    'function',
    'options'
  );
  const { path } = getSourceLocation();
  let index = 0;
  for (const entry of await ensurePages(await op(Shape.chain(shape)))) {
    const stlPath = `download/stl/${path}/${generateUniqueId()}`;
    await write(stlPath, await toStl(entry, options));
    const suffix = index++ === 0 ? '' : `_${index}`;
    const filename = `${name}${suffix}.stl`;
    const record = {
      path: stlPath,
      filename,
      type: 'application/sla',
    };
    // Produce a view of what will be downloaded.
    const hash$1 = computeHash({ filename, options }) + hash(entry);
    await view(name, options.view)(Shape.fromGeometry(entry));
    emit({ download: { entries: [record] }, hash: hash$1 });
  }
  return shape;
});

const Spiral = Shape.registerMethod(
  'Spiral',
  (...args) =>
    async (shape) => {
      const [particle = Point, options] = await destructure2(
        shape,
        args,
        'function',
        'options'
      );
      let particles = [];
      for (const turn of await Seq(
        options,
        (distance) => (shape) => distance,
        (...numbers) => numbers
      )) {
        particles.push(await particle(turn).rz(turn));
      }
      const result = await Link(...particles);
      return result;
    }
);

const toDiameterFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

const X$2 = 0;
const Y$2 = 1;
const Z$2 = 2;

const reifyArc =
  (axis = Z$2) =>
  async ({ c1, c2, start = 0, end = 1, zag, sides }) => {
    while (start > end) {
      start -= 1;
    }

    const scale = computeScale(c1, c2);
    const middle = computeMiddle(c1, c2);

    const left = c1[X$2];
    const right = c2[X$2];

    const front = c1[Y$2];
    const back = c2[Y$2];

    const bottom = c1[Z$2];
    const top = c2[Z$2];

    const step = 1 / computeSides(c1, c2, sides, zag);
    const steps = Math.ceil((end - start) / step);
    const effectiveStep = (end - start) / steps;

    let spiral;

    if (end - start === 1) {
      spiral = Spiral((t) => Point(0.5), {
        from: start - 1 / 4,
        upto: end - 1 / 4,
        by: effectiveStep,
      })
        .loop()
        .fill();
    } else {
      spiral = Spiral((t) => Point(0.5), {
        from: start - 1 / 4,
        to: end - 1 / 4,
        by: effectiveStep,
      });
      if (
        (axis === X$2 && left !== right) ||
        (axis === Y$2 && front !== back) ||
        (axis === Z$2 && top !== bottom)
      ) {
        spiral = spiral.loop().fill();
      }
    }

    switch (axis) {
      case X$2: {
        scale[X$2] = 1;
        spiral = spiral
          .ry(-1 / 4)
          .scale(scale)
          .move(middle);
        if (left !== right) {
          spiral = spiral.ex([left - middle[X$2], right - middle[X$2]]);
        }
        break;
      }
      case Y$2: {
        scale[Y$2] = 1;
        spiral = spiral
          .rx(-1 / 4)
          .scale(scale)
          .move(middle);
        if (front !== back) {
          spiral = spiral.ey([front - middle[Y$2], back - middle[Y$2]]);
        }
        break;
      }
      case Z$2: {
        scale[Z$2] = 1;
        spiral = spiral.scale(scale).move(middle);
        if (top !== bottom) {
          spiral = spiral.ez([top - middle[Z$2], bottom - middle[Z$2]]);
        }
        break;
      }
    }

    return spiral.absolute();
  };

const reifyArcZ = reifyArc(Z$2);
const reifyArcX = reifyArc(X$2);
const reifyArcY = reifyArc(Y$2);

const ArcOp =
  (type) =>
  (...args) =>
  async (shape) => {
    const [intervals, options] = await destructure2(
      shape,
      args,
      'intervals',
      'options'
    );
    let [x, y, z] = intervals;
    let { apothem, diameter, radius, start, end, sides = 32, zag } = options;
    if (apothem !== undefined) {
      diameter = toDiameterFromApothem(apothem, sides);
    }
    if (radius !== undefined) {
      diameter = radius * 2;
    }
    if (diameter !== undefined) {
      x = diameter;
    }
    let reify;
    switch (type) {
      case 'Arc':
      case 'ArcZ':
        if (x === undefined) {
          x = 1;
        }
        if (y === undefined) {
          y = x;
        }
        if (z === undefined) {
          z = 0;
        }
        reify = reifyArcZ;
        break;
      case 'ArcX':
        if (y === undefined) {
          y = 1;
        }
        if (z === undefined) {
          z = y;
        }
        if (x === undefined) {
          x = 0;
        }
        reify = reifyArcX;
        break;
      case 'ArcY':
        if (x === undefined) {
          x = 1;
        }
        if (z === undefined) {
          z = x;
        }
        if (y === undefined) {
          y = 0;
        }
        reify = reifyArcY;
        break;
    }
    const [c1, c2] = await buildCorners(x, y, z)(null);
    const result = reify({ c1, c2, start, end, sides, zag });
    return result;
  };

const Arc = Shape.registerMethod('Arc', ArcOp('Arc'));
const ArcX = Shape.registerMethod('ArcX', ArcOp('ArcX'));
const ArcY = Shape.registerMethod('ArcY', ArcOp('ArcY'));
const ArcZ = Shape.registerMethod('ArcZ', ArcOp('ArcZ'));

const Stroke = Shape.registerMethod(
  'Stroke',
  (...args) =>
    async (shape) => {
      const [shapes, implicitWidth = 1, options = {}] = await destructure2(
        shape,
        args,
        'shapes',
        'number',
        'options'
      );
      const { width = implicitWidth } = options;
      // return ChainHull( eachPoint(Arc(width).to, List)(await Group(shape, ...shapes)));
      return Fuse(
        eachSegment(
          (s) => s.eachPoint(Arc(width).to).hull(),
          List
        )(await Group(shape, ...shapes))
      );
    }
);

const stroke = Shape.registerMethod(
  'stroke',
  (...args) =>
    async (shape) =>
      Stroke(shape, ...args)
);

const LoadSvg = Shape.registerMethod(
  'LoadSvg',
  (path, { fill = true, stroke = true } = {}) =>
    async (shape) => {
      const data = await read(`source/${path}`, { sources: [path] });
      if (data === undefined) {
        throw Error(`Cannot read svg from ${path}`);
      }
      return Shape.fromGeometry(
        await fromSvg(data, { doFill: fill, doStroke: stroke })
      );
    }
);

const Svg = Shape.registerMethod(
  'Svg',
  (svg, { fill = true, stroke = true } = {}) =>
    async (shape) => {
      const data = new TextEncoder('utf8').encode(svg);
      return Shape.fromGeometry(
        await fromSvg(data, { doFill: fill, doStroke: stroke })
      );
    }
);

const svg = Shape.registerMethod('svg', (...args) => async (shape) => {
  const {
    value: name,
    func: op = (s) => s,
    object: options = {},
  } = destructure(args);
  const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
  let index = 0;
  for (const entry of await ensurePages(op(shape))) {
    const svgPath = `download/svg/${path}/${id}/${viewId}`;
    await write(svgPath, await toSvg(entry, options));
    const suffix = index++ === 0 ? '' : `_${index}`;
    const filename = `${name}${suffix}.svg`;
    const record = {
      path: svgPath,
      filename,
      type: 'image/svg+xml',
    };
    const hash$1 = computeHash({ filename, options }) + hash(entry);
    await gridView(name, options.view)(Shape.fromGeometry(entry));
    emit({ download: { entries: [record] }, hash: hash$1 });
  }
  return shape;
});

const table = Shape.registerMethod(
  'table',
  (rows, columns, ...cells) =>
    (shape) => {
      const uniqueId = generateUniqueId;
      const open = { open: { type: 'table', rows, columns, uniqueId } };
      emit({ open, hash: computeHash(open) });
      for (let cell of cells) {
        if (cell instanceof Function) {
          cell = cell(shape);
        }
        if (typeof cell === 'string') {
          md(cell);
        }
      }
      const close = { close: { type: 'table', rows, columns, uniqueId } };
      emit({ close, hash: computeHash(close) });
      return shape;
    }
);

const tags = Shape.registerMethod('tags', (...args) => async (shape) => {
  const { string: tag = '*', func: op = (...tags) => note(`tags: ${tags}`) } =
    destructure(args);
  const isMatchingTag = tagMatcher(tag, 'user');
  const collected = [];
  for (const { tags } of getLeafs(await shape.toGeometry())) {
    for (const tag of tags) {
      if (isMatchingTag(tag)) {
        collected.push(tag);
      }
    }
  }
  const result = op(...collected)(shape);
  return result;
});

// Tint adds another color to the mix.
const tint = Shape.registerMethod(
  'tint',
  (name) => (shape) => tag(...toTagsFromName(name))(shape)
);

const toFlatValues = Shape.registerMethod(
  'toFlatValues',
  (to) => async (shape) => {
    if (Shape.isFunction(to)) {
      to = await to(shape);
    }
    if (Shape.isArray(to)) {
      const flat = [];
      for (const element of to) {
        if (element === undefined) {
          continue;
        }
        flat.push(await toValue(element)(shape));
      }
      return flat;
    } else if (Shape.isShape(to) && to.toGeometry().type === 'group') {
      return toFlatValues((await to.toGeometry()).content)(shape);
    } else {
      return [await toValue(to)(shape)];
    }
  }
);

const toNestedValues = Shape.registerMethod(
  'toNestedValues',
  (to) => async (shape) => {
    if (Shape.isFunction(to)) {
      to = await to(shape);
    }
    if (Shape.isArray(to)) {
      const expanded = [];
      for (const value of to) {
        if (Shape.isFunction(value)) {
          expanded.push(...(await value(shape)));
        } else {
          expanded.push(value);
        }
      }
      return expanded;
    } else {
      return to;
    }
  }
);

const tool = Shape.registerMethod(
  'tool',
  (name) => async (shape) =>
    Shape.fromGeometry(
      rewriteTags(toTagsFromName$1(name), [], await shape.toGeometry())
    )
);

// import { computeToolpath, measureBoundingBox, taggedGroup, } from './jsxcad-geometry.js';

// const Z = 2;

const toolpath = Shape.registerMethod(
  'toolpath',
  (...args) =>
    async (shape) => {
      const [
        toolSize = 2,
        resolution = toolSize,
        toolCutDepth = toolSize / 2,
        annealingMax,
        annealingMin,
        annealingDecay,
        target,
      ] = await destructure2(
        shape,
        args,
        'number',
        'number',
        'number',
        'number',
        'number',
        'number',
        'geometry'
      );
      return Shape.fromGeometry(
        computeToolpath(
          target,
          await shape.toGeometry(),
          resolution,
          toolSize,
          toolCutDepth,
          annealingMax,
          annealingMin,
          annealingDecay
        )
      );
    }
);

/*
export const toolpath = Shape.registerMethod(
  'toolpath',
  (...args) =>
    async (shape) => {
      const [toolDiameter = 1, options] = await destructure2(
        shape,
        args,
        'number',
        'options'
      );
      const {
        feedrate,
        speed,
        jumpHeight = 1,
        stepCost = toolDiameter * -2,
        turnCost = -2,
        neighborCost = -2,
        stopCost = 30,
        candidateLimit = 1,
        subCandidateLimit = 1,
        layerHeight = 1,
        radialCutDepth = toolDiameter / 4,
      } = options;
      const geometry = await shape.toGeometry();
      const bounds = measureBoundingBox(geometry);
      const [min, max] = bounds;
      const toolpaths = [];
      for (let z = max[Z]; z >= min[Z]; z -= layerHeight) {
        const toolpath = computeToolpath(geometry, {
          speed,
          feedrate,
          toolDiameter,
          jumpHeight,
          stepCost,
          turnCost,
          neighborCost,
          stopCost,
          candidateLimit,
          radialCutDepth,
          subCandidateLimit,
          z,
        });
        toolpaths.push(toolpath);
      }
      return Shape.fromGeometry(taggedGroup({}, ...toolpaths));
    }
);
*/

const twist = Shape.registerMethod(
  'twist',
  (turnsPerMm = 1) =>
    (shape) =>
      Shape.fromGeometry(twist$1(shape.toGeometry(), turnsPerMm))
);

const upperEnvelope = Shape.registerMethod(
  'upperEnvelope',
  () => async (shape) =>
    Shape.fromGeometry(generateUpperEnvelope(await shape.toGeometry()))
);

const unfold = Shape.registerMethod(
  'unfold',
  () => async (shape) =>
    Shape.fromGeometry(unfold$1(await shape.toGeometry()))
);

const volume = Shape.registerMethod(
  'volume',
  (op = (value) => (shape) => value) =>
    (shape) =>
      op(measureVolume(shape.toGeometry()))(shape)
);

const toCoordinateOp = Shape.ops.get('toCoordinate');

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

const floor = (value, resolution) =>
  Math.floor(value / resolution) * resolution;
const ceil = (value, resolution) => Math.ceil(value / resolution) * resolution;

const floorPoint = ([x, y, z], resolution) => [
  floor(x, resolution),
  floor(y, resolution),
  floor(z, resolution),
];
const ceilPoint = ([x, y, z], resolution) => [
  ceil(x, resolution),
  ceil(y, resolution),
  ceil(z, resolution),
];

const voxels = Shape.registerMethod(
  'voxels',
  (resolution = 1) =>
    async (shape) => {
      const offset = resolution / 2;
      const geometry = await shape.toGeometry();
      const [boxMin, boxMax] = measureBoundingBox(geometry);
      const min = floorPoint(boxMin, resolution);
      const max = ceilPoint(boxMax, resolution);
      const polygons = [];
      withAabbTreeQuery(
        linearize(geometry, ({ type }) =>
          ['graph', 'polygonsWithHoles'].includes(type)
        ),
        (query) => {
          const isInteriorPoint = (x, y, z) =>
            query.isIntersectingPointApproximate(x, y, z);
          for (let x = min[X$1] - offset; x <= max[X$1] + offset; x += resolution) {
            for (
              let y = min[Y$1] - offset;
              y <= max[Y$1] + offset;
              y += resolution
            ) {
              for (
                let z = min[Z$1] - offset;
                z <= max[Z$1] + offset;
                z += resolution
              ) {
                const state = isInteriorPoint(x, y, z);
                if (state !== isInteriorPoint(x + resolution, y, z)) {
                  const face = [
                    [x + offset, y - offset, z - offset],
                    [x + offset, y + offset, z - offset],
                    [x + offset, y + offset, z + offset],
                    [x + offset, y - offset, z + offset],
                  ];
                  polygons.push({ points: state ? face : face.reverse() });
                }
                if (state !== isInteriorPoint(x, y + resolution, z)) {
                  const face = [
                    [x - offset, y + offset, z - offset],
                    [x + offset, y + offset, z - offset],
                    [x + offset, y + offset, z + offset],
                    [x - offset, y + offset, z + offset],
                  ];
                  polygons.push({ points: state ? face.reverse() : face });
                }
                if (state !== isInteriorPoint(x, y, z + resolution)) {
                  const face = [
                    [x - offset, y - offset, z + offset],
                    [x + offset, y - offset, z + offset],
                    [x + offset, y + offset, z + offset],
                    [x - offset, y + offset, z + offset],
                  ];
                  polygons.push({ points: state ? face : face.reverse() });
                }
              }
            }
          }
        }
      );
      return Shape.fromPolygons(polygons);
    }
);

const Voxels = Shape.registerMethod(
  'Voxels',
  (...points) =>
    async (shape) => {
      const offset = 0.5;
      const index = new Set();
      const key = (x, y, z) => `${x},${y},${z}`;
      let max = [-Infinity, -Infinity, -Infinity];
      let min = [Infinity, Infinity, Infinity];
      for (const point of points) {
        const [x, y, z] = await toCoordinateOp(point)(shape);
        index.add(key(x, y, z));
        max[X$1] = Math.max(x + 1, max[X$1]);
        max[Y$1] = Math.max(y + 1, max[Y$1]);
        max[Z$1] = Math.max(z + 1, max[Z$1]);
        min[X$1] = Math.min(x - 1, min[X$1]);
        min[Y$1] = Math.min(y - 1, min[Y$1]);
        min[Z$1] = Math.min(z - 1, min[Z$1]);
      }
      const isInteriorPoint = (x, y, z) => index.has(key(x, y, z));
      const polygons = [];
      for (let x = min[X$1]; x <= max[X$1]; x++) {
        for (let y = min[Y$1]; y <= max[Y$1]; y++) {
          for (let z = min[Z$1]; z <= max[Z$1]; z++) {
            const state = isInteriorPoint(x, y, z);
            if (state !== isInteriorPoint(x + 1, y, z)) {
              const face = [
                [x + offset, y - offset, z - offset],
                [x + offset, y + offset, z - offset],
                [x + offset, y + offset, z + offset],
                [x + offset, y - offset, z + offset],
              ];
              polygons.push({ points: state ? face : face.reverse() });
            }
            if (state !== isInteriorPoint(x, y + 1, z)) {
              const face = [
                [x - offset, y + offset, z - offset],
                [x + offset, y + offset, z - offset],
                [x + offset, y + offset, z + offset],
                [x - offset, y + offset, z + offset],
              ];
              polygons.push({ points: state ? face.reverse() : face });
            }
            if (state !== isInteriorPoint(x, y, z + 1)) {
              const face = [
                [x - offset, y - offset, z + offset],
                [x + offset, y - offset, z + offset],
                [x + offset, y + offset, z + offset],
                [x - offset, y + offset, z + offset],
              ];
              polygons.push({ points: state ? face : face.reverse() });
            }
          }
        }
      }
      return Shape.fromPolygons(polygons).tag('editType:Voxels');
    }
);

// rx is in terms of turns -- 1/2 is a half turn.
const testMode = Shape.registerMethod(
  'testMode',
  (mode = true, op) =>
    (s) => {
      try {
        setTestMode(mode);
        return op(s);
      } finally {
        setTestMode(false);
      }
    }
);

const toGeometry = Shape.registerMethod(
  'toGeometry',
  () => (shape) => shape.geometry
);

const Wrap = Shape.registerMethod('Wrap', (...args) => async (shape) => {
  const [offset = 1, alpha = 0.1, shapes] = await destructure2(
    shape,
    args,
    'number',
    'number',
    'shapes'
  );
  return Shape.fromGeometry(
    wrap$1(await shape.toShapesGeometries(shapes), offset, alpha)
  ).setTags(...(await shape.getTags()));
});

const wrap = Shape.registerMethod(
  'wrap',
  (...args) =>
    async (shape) =>
      Wrap(shape, ...args)(shape)
);

const x = Shape.registerMethod('x', (...x) => async (shape) => {
  const moved = [];
  for (const offset of await shape.toFlatValues(x)) {
    moved.push(await move([offset, 0, 0])(shape));
  }
  return Group(...moved);
});

const y = Shape.registerMethod('y', (...y) => async (shape) => {
  const moved = [];
  for (const offset of await shape.toFlatValues(y)) {
    moved.push(await move([0, offset, 0])(shape));
  }
  return Group(...moved);
});

const z = Shape.registerMethod('z', (...z) => async (shape) => {
  const moved = [];
  for (const offset of await shape.toFlatValues(z)) {
    moved.push(await move([0, 0, offset])(shape));
  }
  return Group(...moved);
});

const Assembly = Shape.registerMethod(
  'Assembly',
  (...args) =>
    async (shape) => {
      const [modes, shapes] = await destructure2(
        shape,
        args,
        'modes',
        'shapes'
      );
      const [first, ...rest] = shapes;
      return fitTo(modes, ...rest)(first);
    }
);

// This generates anonymous shape methods.
const Cached = (name, op, enable = true) =>
  Shape.registerMethod([], (...args) => async (shape) => {
    const path = `cached/${name}/${JSON.stringify(args)}`;
    // The first time we hit this, we'll schedule a read and throw, then wait for the read to complete, and retry.
    const cached = await loadGeometry(path);
    if (cached) {
      return cached;
    }
    // The read we scheduled last time produced undefined, so we fall through to here.
    const constructedShape = await op(...args);
    // This will schedule a write and throw, then wait for the write to complete, and retry.
    await saveGeometry(path, constructedShape);
    return constructedShape;
  });

const Edges = Shape.registerMethod('Edges', (arg) => async (shape) => {
  const segments = [];
  for (const [source, target] of await toNestedValues(arg)(shape)) {
    segments.push([
      await toCoordinate(source)(shape),
      await toCoordinate(target)(shape),
    ]);
  }
  return Shape.fromSegments(segments);
});

const Face = Shape.registerMethod('Face', (...args) => async (shape) => {
  const [coordinates] = await destructure2(shape, args, 'coordinates');
  return Shape.chain(Shape.fromPolygons([{ points: coordinates }]));
});

const Hexagon = Shape.registerMethod(
  'Hexagon',
  (x, y, z) => async (shape) => Arc(x, y, z, { sides: 6 })
);

const fromPointsAndPaths = (points = [], paths = []) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: path.map((nth) => points[nth]) });
  }
  return polygons;
};

// Unit icosahedron vertices.
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

const reifyIcosahedron = async (c1, c2) => {
  const scale = computeScale(c1, c2);
  const middle = computeMiddle(c1, c2);
  return Shape.chain(Shape.fromPolygons(buildRegularIcosahedron()))
    .scale(...scale)
    .move(...middle)
    .absolute();
};

const Icosahedron = Shape.registerMethod(
  'Icosahedron',
  (x = 1, y = x, z = x) =>
    async (shape) => {
      const [c1, c2] = await buildCorners(x, y, z)(shape);
      return reifyIcosahedron(c1, c2);
    }
);

const Implicit = Shape.registerMethod(
  'Implicit',
  (...args) =>
    async (shape) => {
      const [radius = 1, op, options] = await destructure2(
        shape,
        args,
        'number',
        'function',
        'options'
      );
      const {
        angularBound = 30,
        radiusBound = 0.1,
        distanceBound = 0.1,
        errorBound = 0.001,
      } = options;
      return Shape.fromGeometry(
        computeImplicitVolume(
          op,
          radius,
          angularBound,
          radiusBound,
          distanceBound,
          errorBound
        )
      );
    }
);

const Line = Shape.registerMethod(
  ['Line', 'LineX'],
  (...args) =>
    async (shape) => {
      const [intervals] = await destructure2(shape, args, 'intervals');
      const edges = [];
      for (const [begin, end] of intervals) {
        edges.push(Edge(Point(begin), Point(end)));
      }
      return Group(...edges);
    }
);

const LineX = Line;

const LineY = Shape.registerMethod(
  'LineY',
  (...args) =>
    async (shape) => {
      const [intervals] = await destructure2(shape, args, 'intervals');
      const edges = [];
      for (const [begin, end] of intervals) {
        edges.push(Edge(Point(0, begin), Point(0, end)));
      }
      return Group(...edges);
    }
);

const LineZ = Shape.registerMethod(
  'LineZ',
  (...args) =>
    async (shape) => {
      const [intervals] = await destructure2(shape, args, 'intervals');
      const edges = [];
      for (const [begin, end] of intervals) {
        edges.push(Edge(Point(0, 0, begin), Point(0, 0, end)));
      }
      return Group(...edges);
    }
);

const readPngAsRasta = async (path) => {
  let data = await read(`source/${path}`, { sources: [path] });
  if (data === undefined) {
    throw Error(`Cannot read png from ${path}`);
  }
  const raster = await fromPng(data);
  return raster;
};

const LoadPng = Shape.registerMethod(
  'LoadPng',
  (path, bands = [128, 256]) =>
    async (shape) => {
      const { width, height, pixels } = await readPngAsRasta(path);
      // FIX: This uses the red channel for the value.
      const getPixel = (x, y) => pixels[(y * width + x) << 2];
      const data = Array(height);
      for (let y = 0; y < height; y++) {
        data[y] = Array(width);
        for (let x = 0; x < width; x++) {
          data[y][x] = getPixel(x, y);
        }
      }
      const contours = await fromRaster(data, bands);
      return Shape.fromGeometry(taggedGroup({}, ...contours));
    }
);

const Octagon = Shape.registerMethod(
  'Octagon',
  (x, y, z) => (shape) => Arc(x, y, z, { sides: 8 })(shape)
);

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;
const X = 0;
const Y = 1;
const Z = 2;

const makeUnitSphere = Cached('orb', (tolerance) =>
  Geometry(makeUnitSphere$1(/* angularBound= */ 30, tolerance, tolerance))
);

const Orb = Shape.registerMethod('Orb', (...args) => async (shape) => {
  const [modes, intervals, options] = await destructure2(
    shape,
    args,
    'modes',
    'intervals',
    'options'
  );
  let [x = 1, y = x, z = x] = intervals;
  const { zag = DEFAULT_ORB_ZAG } = options;
  const [c1, c2] = await buildCorners(x, y, z)(shape);
  const scale = computeScale(c1, c2).map((v) => v * 0.5);
  const middle = computeMiddle(c1, c2);
  const radius = Math.max(...scale);
  const tolerance = zag / radius;
  if (
    scale[X] === scale[Y] &&
    scale[Y] === scale[Z] &&
    modes.includes('occt')
  ) {
    // Occt can't handle non-uniform scaling at present.
    return Geometry(makeOcctSphere(scale[X])).move(middle);
  } else {
    return makeUnitSphere(tolerance).scale(scale).move(middle).absolute();
  }
});

const Pentagon = Shape.registerMethod(
  'Pentagon',
  (x, y, z) => (shape) => Arc(x, y, z, { sides: 5 })(shape)
);

const Points = Shape.registerMethod(
  'Points',
  (points) => async (shape) => {
    const coordinates = [];
    for (const point of points) {
      coordinates.push(await toCoordinate(point)(shape));
    }
    return Shape.fromPoints(coordinates);
  }
);

const Polygon = Shape.registerMethod(
  'Polygon',
  (...points) =>
    async (shape) =>
      Face(...points)(shape)
);

const Polyhedron = Shape.registerMethod(
  'Polyhedron',
  (...polygons) =>
    async (shape) => {
      const out = [];
      for (const polygon of polygons) {
        if (polygon instanceof Array) {
          out.push({ points: polygon });
        } else if (polygon instanceof Shape) {
          out.push({ points: polygon.toPoints().reverse() });
        }
      }
      return Shape.fromPolygons(out);
    }
);

const Segments = Shape.registerMethod(
  'Segments',
  (segments = []) =>
    async (shape) => {
      const coordinates = [];
      for (const [source, target] of await toNestedValues(segments)(shape)) {
        coordinates.push([
          await toCoordinate(source)(shape),
          await toCoordinate(target)(shape),
        ]);
      }
      return Shape.fromSegments(coordinates);
    }
);

const SurfaceMesh = (
  serializedSurfaceMesh,
  { isClosed = true, matrix } = {}
) => {
  const geometry = taggedGraph(
    { tags: [], matrix },
    { serializedSurfaceMesh, isClosed }
  );
  geometry.graph.hash = computeHash(geometry.graph);
  hash(geometry);
  return Shape.fromGeometry(geometry);
};

const Triangle = Shape.registerMethod(
  'Triangle',
  (x, y, z) => async (shape) => Arc(x, y, z, { sides: 3 })(shape)
);

const Wave = Shape.registerMethod('Wave', (...args) => async (shape) => {
  const [particle = Point, options] = await destructure2(
    shape,
    args,
    'function',
    'options'
  );
  let particles = [];
  for (const xDistance of await seq(
    options,
    (distance) => (shape) => distance,
    (...numbers) => numbers
  )(shape)) {
    particles.push(particle(xDistance).x(xDistance));
  }
  return Link(...particles)(shape);
});

export { And, Arc, ArcX, ArcY, ArcZ, Assembly, Box, Cached, ChainHull, Clip, Curve, Cut, Edge, Edges, Empty, Face, Fuse, Geometry, GrblConstantLaser, GrblDynamicLaser, GrblPlotter, GrblSpindle, Group, Hershey, Hexagon, Hull, Icosahedron, Implicit, Join, Line, LineX, LineY, LineZ, Link, List, LoadPng, LoadStl, LoadSvg, Loft, Loop, Note, Octagon, Orb, Page, Pentagon, Plan, Point, Points, Polygon, Polyhedron, RX, RY, RZ, Ref, Segments, Seq, Shape, Spiral, Stroke, SurfaceMesh, Svg, Triangle, Voxels, Wave, Wrap, X$a as X, XY, XZ, Y$a as Y, YX, YZ, Z$9 as Z, ZX, ZY, absolute, abstract, addTo, align, aligned, alignment, and, approximate, area, as, asPart, at, bb, bend, billOfMaterials, by, center, chainHull, clean, clip, clipFrom, color, commonVolume, copy, curve, cut, cutFrom, cutOut, defRgbColor, defThreejsMaterial, defTool, define, deform, demesh, destructure, diameter, dilateXY, disjoint, drop, e, each, eachEdge, eachPoint, eachSegment, eagerTransform, edges, edit, ensurePages, ex, extrudeAlong, extrudeX, extrudeY, extrudeZ, ey, ez, faces, fill, fit, fitTo, fix, flat, fuse, g, gap, gcode, get, getAll, getNot, getTag, getTags, ghost, gn, gridView, grow, hold, hull, image, inFn, inset, involute, join, link, list, load, loadGeometry, loft, log, loop, lowerEnvelope, m, mark, masked, masking, material, md, move, moveAlong, n, noGap, noOp, noVoid, normal, note, nth, o, ofPlan, offset, on, op, orient, origin, outline, overlay, pack, page, pdf, points$1 as points, put, ref, remesh, rotateX, rotateY, rotateZ, runLength, rx, ry, rz, s, save, saveGeometry, scale, scaleToFit, scaleX, scaleY, scaleZ, seam, section, sectionProfile, self, separate, seq, serialize, setTag, setTags, shadow, shell, simplify, size, sketch, smooth, sort, stl, stroke, svg, sx, sy, sz, table, tag, tags, testMode, tint, to, toCoordinate, toCoordinates, toDisplayGeometry, toFlatValues, toGeometry, toNestedValues, toPoints, toShape, toShapeGeometry, toShapes, toShapesGeometries, toValue, tool, toolpath, transform, twist, unfold, untag, upperEnvelope, view, voidFn, volume, voxels, wrap, x, xyz, y, z };
