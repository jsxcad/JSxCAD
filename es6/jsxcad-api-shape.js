import { getSourceLocation, startTime, endTime, emit, computeHash, generateUniqueId, write, isNode, logInfo, read, log as log$1 } from './jsxcad-sys.js';
export { elapsed, emit, read, write } from './jsxcad-sys.js';
import { taggedGroup, taggedGraph, taggedSegments, taggedPoints, fromPolygons, Point as Point$1, hasTypeReference, abstract as abstract$1, approximate as approximate$1, makeAbsolute, and as and$1, joinTo, align as align$1, alignment as alignment$1, measureArea, as as as$1, asPart as asPart$1, And as And$1, at as at$1, bb as bb$1, bend as bend$1, note as note$1, emitNote, tags as tags$1, by as by$1, computeCentroid, ChainConvexHull, chainConvexHull, noGhost, clip as clip$1, clipFrom as clipFrom$1, retag, commonVolume as commonVolume$1, copy as copy$1, Curve as Curve$1, curve as curve$1, cut as cut$1, cutFrom as cutFrom$1, cutOut as cutOut$1, deform as deform$1, demesh as demesh$1, computeGeneralizedDiameter, dilateXY as dilateXY$1, disjoint as disjoint$1, hasTypeGhost, transform as transform$1, getLeafs, replacer, Box as Box$1, oneOfTagMatcher, visit, toDisplayGeometry as toDisplayGeometry$1, measureBoundingBox, taggedLayout, getLayouts, each as each$1, toOrientedFaceEdgesList, toPointList, toSegmentList, eagerTransform as eagerTransform$1, extrudeAlongX, extrudeAlongY, extrudeAlongZ, extrudeAlong as extrudeAlong$1, extrudeAlongNormal, toFaceEdgesList, fill as fill$1, fit as fit$1, fitTo as fitTo$1, fix as fix$1, to as to$1, hash, getInverseMatrices, Fuse as Fuse$1, join as join$1, fuse as fuse$1, get as get$1, hasTypeVoid, grow as grow$1, ConvexHull, convexHull, untag as untag$1, inset as inset$1, involute as involute$1, link as link$1, load as load$1, read as read$1, loft as loft$1, loop as loop$1, generateLowerEnvelope, hasShowOverlay, computeOrientedBoundingBox, hasTypeMasked, hasMaterial, moveAlong as moveAlong$1, moveAlongNormal, computeNormal, offset as offset$1, outline as outline$1, taggedItem, toPoints, remesh as remesh$1, rotateXs, rotateYs, rotateZs, linearize, store, write as write$1, fromScaleToTransform, seam as seam$1, section as section$1, separate as separate$1, serialize as serialize$1, rewriteTags, cast, shell as shell$1, simplify as simplify$1, taggedSketch, smooth as smooth$1, Arc as Arc$1, ArcX as ArcX$1, ArcY as ArcY$1, ArcZ as ArcZ$1, tag as tag$1, tagMatcher, toCoordinates as toCoordinates$1, computeToolpath, twist as twist$1, generateUpperEnvelope, unfold as unfold$1, measureVolume, withAabbTreeQuery, wrap as wrap$1, taggedPlan, Disjoint, Edge as Edge$1, computeImplicitVolume } from './jsxcad-geometry.js';
import { toTagsFromName } from './jsxcad-algorithm-color.js';
import { invertTransform, fromTranslateToTransform, setTestMode, makeOcctSphere, makeUnitSphere as makeUnitSphere$1 } from './jsxcad-algorithm-cgal.js';
import { dataUrl } from './jsxcad-ui-threejs.js';
import { toGcode } from './jsxcad-convert-gcode.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';
import { toPdf } from './jsxcad-convert-pdf.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { fromSvg, toSvg } from './jsxcad-convert-svg.js';
import { toTagsFromName as toTagsFromName$1 } from './jsxcad-algorithm-tool.js';
import { zag } from './jsxcad-api-v1-math.js';
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
  get(target, prop, _receiver) {
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
  get(target, prop, _receiver) {
    if (prop === 'sync') {
      // console.log(`QQ/complete/sync`);
      return target;
    }
    if (prop === 'isChain') {
      return 'complete';
    }
    if (prop === 'then') {
      return async (resolve, _reject) => {
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
    apply(_target, _obj, _args) {
      // This is wrong -- the chain root should be the constructor, which requires application.
      // console.log(`QQ/root/terminal: ${JSON.stringify(target)}`);
      return this;
    },
    get(target, prop, _receiver) {
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
        terminal = await terminal;
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
  constructor(geometry = { type: 'Group', tags: [], content: [] }) {
    if (geometry.geometry) {
      throw Error('die: { geometry: ... } is not valid geometry.');
    }
    this.geometry = geometry;
    return this;
  }
}

const isShape = (value) =>
  value instanceof Shape ||
  (value !== undefined && value !== null && value.isChain !== undefined);
Shape.isShape = isShape;

const isGeometry = (value) =>
  value &&
  value instanceof Object &&
  value.type !== undefined &&
  value.geometry === undefined;
Shape.isGeometry = isGeometry;

const isOp = (value) =>
  value !== undefined &&
  value !== null &&
  value.isChain !== undefined &&
  value.isChain !== 'root';
Shape.isOp = isOp;

const isChainFunction = (value) =>
  value instanceof Function && value.isChain !== undefined;
Shape.isChainFunction = isChainFunction;

// Complete chains are Shapes waiting for an input.
const isPendingInput = (value) =>
  value instanceof Function &&
  (value.isChain === 'complete' || value.isChain === 'root');
Shape.isPendingInput = isPendingInput;

const isPendingArguments = (value) =>
  value instanceof Function && value.isChain === 'incomplete';
Shape.isPendingArguments = isPendingArguments;

// Incomplete chains are ordinary functions waiting for arguments.
const isFunction = (value) =>
  value instanceof Function &&
  (value.isChain === undefined || value.isChain === 'incomplete');
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

const isIntervalLike = (value) =>
  isNumber(value) ||
  (isArray(value) &&
    isNumber(value[0]) &&
    (isNumber(value[1]) || value[1] === undefined));
Shape.isIntervalLike = isIntervalLike;

const isInterval = (value) =>
  isNumber(value) &&
  value.length === 2 &&
  isNumber(value[0]) &&
  isNumber(value[1]);
Shape.isInterval = isInterval;

const normalizeInterval = (value) => {
  if (isNumber(value)) {
    value = [value / 2, value / -2];
  }
  const [a = 0, b = 0] = value;
  if (typeof a !== 'number') {
    throw Error(
      `normalizeInterval expected number but received ${a} of type ${typeof a}`
    );
  }
  if (typeof b !== 'number') {
    throw Error(
      `normalizeInterval expected number but received ${b} of type ${typeof b}`
    );
  }
  return a < b ? [a, b] : [b, a];
};
Shape.normalizeInterval = normalizeInterval;

const isString = (value) => typeof value === 'string';
Shape.isString = isString;

const isValue = (value) =>
  (!isObject(value) && !isFunction(value)) || isArray(value);
Shape.isValue = isValue;

const isCoordinate = (value) => isArray(value) && value.every(isNumber);
Shape.isCoordinate = isCoordinate;

const isSegment = (value) => isArray(value) && value.every(isCoordinate);
Shape.isSegment = isSegment;

Shape.chain = chain;

const apply = async (input, op, ...args) => {
  if (op instanceof Promise) {
    op = await op;
  }
  if (Shape.isPendingInput(op)) {
    // Need to write up a proper schema for how this is supposed to work.
    if (args.length > 0) {
      op = op(...args);
    } else {
      op = op(input);
    }
    if (op instanceof Promise) {
      op = await op;
    }
  }
  if (Shape.isFunction(op) || Shape.isPendingArguments(op)) {
    // (v) => (s) => (s)
    op = op(...args);
    if (Shape.isFunction(op)) {
      // (s) => (s)
      op = op(input);
    }
    if (op instanceof Promise) {
      op = await op;
    }
  }
  if (Shape.isPendingInput(op)) {
    op = op(input);
    if (op instanceof Promise) {
      op = await op;
    }
  }
  return op;
};

Shape.apply = apply;

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
      try {
        // console.log(`QQ/method2: ${names} shape=${shape}`);
        const parameters = await Shape.destructure2(
          names,
          shape,
          args,
          ...signature
        );
        return op(...parameters);
      } catch (error) {
        console.log(
          `Method ${names}: error "${'' + error}" args=${JSON.stringify(args)}`
        );
        throw error;
      }
    };
  return registerMethod(names, method);
};

Shape.registerMethod2 = registerMethod2;

Shape.fromGeometry = (geometry) => {
  if (geometry === undefined) {
    return new Shape(taggedGroup({}));
  }
  if (!Shape.isGeometry(geometry)) {
    throw Error(`die: not geometry: ${JSON.stringify(geometry)}`);
  }
  return new Shape(geometry);
};

const registerMethod3 = (
  names,
  signature,
  op,
  postOp = async (geometry) => Shape.fromGeometry(await geometry)
) => {
  const method =
    (...args) =>
    async (shape) => {
      try {
        // console.log(`QQ/method3: ${names} shape=${shape} args=${args}`);
        if (signature.includes('shape') || signature.includes('input')) {
          throw Error('Received unexpected Shape');
        }
        const parameters = await Shape.destructure2(
          names,
          shape,
          args,
          ...signature
        );
        if (
          parameters.some(
            (s) =>
              Shape.isShape(s) &&
              !Shape.isFunction(s) &&
              !Shape.isChainFunction(s)
          )
        ) {
          throw Error(
            `die: Some parameters are shapes: json=${JSON.stringify(
              parameters.filter(
                (s) =>
                  Shape.isShape(s) &&
                  !Shape.isFunction(s) &&
                  !Shape.isChainFunction(s)
              )
            )} raw=${parameters.filter(
              (s) =>
                Shape.isShape(s) &&
                !Shape.isFunction(s) &&
                !Shape.isChainFunction(s)
            )}`
          );
        }
        const r1 = op(...parameters);
        const r2 = await postOp(r1, parameters);
        // console.log(`QQ/method3/done: ${names}`);
        return r2;
      } catch (error) {
        console.log(
          `Method ${names}: error "${'' + error}" args=${JSON.stringify(args)}`
        );
        throw error;
      }
    };
  return registerMethod(names, method);
};

Shape.registerMethod3 = registerMethod3;

Shape.fromGraph = (graph) => new Shape(taggedGraph({}, graph));

Shape.fromClosedPath = (path) => {
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
Shape.fromOpenPath = (path) => {
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
Shape.fromPoint = (point) => fromGeometry(taggedPoints({}, [point]));
Shape.fromPoints = (points) => fromGeometry(taggedPoints({}, points));
Shape.fromPolygons = (polygons) => fromGeometry(fromPolygons(polygons));

Shape.registerMethod = registerMethod;

Shape.chainable = chainable;
Shape.ops = ops;

const fromGeometry = Shape.fromGeometry;

const resolve = async (input, value, specOptions = {}) => {
  while (value instanceof Promise) {
    value = await value;
  }
  if (Shape.isFunction(value)) {
    // Functions being resolved to shapes receive the input.
    value = await value(input);
  }
  while (Shape.isPendingInput(value)) {
    // Complete chains should receive their inputs.
    value = await value(input);
  }
  if (Shape.isArray(value)) {
    const resolvedElements = [];
    for (const element of value) {
      const result = await resolve(input, element);
      resolvedElements.push(result);
    }
    return resolvedElements;
  } else if (Shape.isObject(value)) {
    const resolvedObject = {};
    for (const key of Object.keys(value)) {
      switch (specOptions[key]) {
        case 'geometries': {
          // This should be better integrated with destructuring.
          const geometries = [];
          const values = await resolve(input, value[key]);
          if (Shape.isShape(values)) {
            geometries.push(await values.toGeometry());
          } else if (Shape.isArray(values)) {
            for (const value of values) {
              geometries.push(await value.toGeometry());
            }
          }
          resolvedObject[key] = geometries;
          break;
        }
        default: {
          resolvedObject[key] = await resolve(input, value[key]);
        }
      }
    }
    return resolvedObject;
  } else {
    return value;
  }
};

const getCoordinate = async (value) => {
  if (Shape.isCoordinate(value)) {
    return value;
  }
  if (Shape.isShape(value)) {
    const points = await value.toCoordinates();
    if (points.length >= 1) {
      const [x = 0, y = 0, z = 0] = points[0];
      return [x, y, z];
    }
  }
  return undefined;
};

const getCoordinates = async (value) => {
  const coordinates = [];
  for (const [x = 0, y = 0, z = 0] of await value.toCoordinates()) {
    coordinates.push([x, y, z]);
  }
  return coordinates;
};

const destructure2 = async (names, input, originalArgs, ...specs) => {
  const output = [];
  let args = [];
  for (const arg of originalArgs) {
    if (arg === undefined) {
      continue;
    }
    args.push(arg instanceof Promise ? await arg : arg);
  }
  for (const baseSpec of specs) {
    const [spec, specOptionText] = baseSpec.split(':');
    const specOptions = {};
    if (specOptionText !== undefined) {
      for (const chunk of specOptionText.split(',')) {
        const [key, value] = chunk.split('=');
        if (value === undefined) {
          specOptions[key] = true;
        } else {
          specOptions[key] = value;
        }
      }
    }
    const rest = [];
    switch (spec) {
      case 'input': {
        output.push(input);
        if (input && input.geometry.geometry) {
          throw Error(`QQ: malformedGeometry`);
        }
        rest.push(...args);
        break;
      }
      case 'inputGeometry': {
        if (input === undefined) {
          output.push(undefined);
        } else {
          if (!Shape.isGeometry(input.geometry)) {
            throw Error(
              `Expected geometry but received ${JSON.stringify(input.geometry)}`
            );
          }
          output.push(input.geometry);
        }
        rest.push(...args);
        break;
      }
      case 'objects': {
        const out = [];
        for (const arg of args) {
          if (!Shape.isObject(arg)) {
            // These must be confirmed as objects prior to resolution in order to avoid functions.
            rest.push(arg);
            continue;
          }
          let value = await resolve(input, arg, specOptions);
          if (Shape.isObject(value)) {
            out.push(value);
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
          let value = await resolve(input, arg, specOptions);
          if (number === undefined && Shape.isNumber(value)) {
            number = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(number);
        break;
      }
      case 'value': {
        let number;
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
          if (number === undefined && Shape.isValue(value)) {
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
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
          if (func !== undefined) {
            rest.push(arg);
          } else if (
            Shape.isFunction(value) ||
            Shape.isPendingInput(value) ||
            Shape.isPendingArguments(value)
          ) {
            func = value;
          } else {
            rest.push(arg);
          }
        }
        output.push(func);
        break;
      }
      case 'functions': {
        const functions = [];
        for (const arg of args) {
          const value = arg;
          if (
            Shape.isFunction(value) ||
            Shape.isPendingInput(value) ||
            Shape.isPendingArguments(value)
          ) {
            functions.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(functions);
        break;
      }
      case 'shape': {
        let result;
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
          if (result === undefined && Shape.isShape(value)) {
            result = await value.toGeometry();
            if (!Shape.isGeometry(result)) {
              throw Error('die');
            }
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
          if (result === undefined) {
            let value = await resolve(input, arg, specOptions);
            result = await getCoordinate(value);
            if (result === undefined) {
              rest.push(arg);
            }
          } else if (result !== undefined) {
            rest.push(arg);
          }
        }
        output.push(result);
        break;
      }
      case 'options': {
        const options = {};
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
          if (Shape.isObject(value)) {
            Object.assign(options, value);
          } else {
            rest.push(arg);
          }
        }
        output.push(options);
        break;
      }
      case 'strings': {
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
      case 'modes': {
        const out = {};
        for (const arg of args) {
          if (typeof arg === 'string' && specOptions[arg] === true) {
            out[arg] = true;
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
          if (interval === undefined && Shape.isIntervalLike(value)) {
            interval = Shape.normalizeInterval(value);
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
          let value = await resolve(input, arg, specOptions);
          if (Shape.isIntervalLike(value)) {
            out.push(Shape.normalizeInterval(value));
          } else if (
            Shape.isArray(value) &&
            value.every(Shape.isIntervalLike)
          ) {
            for (const element of value) {
              out.push(Shape.normalizeInterval(element));
            }
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
          let value = await resolve(input, arg, specOptions);
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
          let value = await resolve(input, arg, specOptions);
          if (Shape.isShape(value)) {
            const result = await value.toGeometry();
            out.push(result);
            if (!Shape.isGeometry(result)) {
              throw Error('die');
            }
          } else if (Shape.isArray(value) && value.every(Shape.isShape)) {
            for (const element of value) {
              const result = await element.toGeometry();
              out.push(result);
              if (!Shape.isGeometry(result)) {
                throw Error('die');
              }
            }
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
          let value = await resolve(input, arg, specOptions);
          if (Shape.isShape(value)) {
            const coordinates = await getCoordinates(value);
            if (coordinates.length > 0) {
              out.push(...coordinates);
            } else {
              rest.push(arg);
            }
          } else if (Shape.isArray(value) && Shape.isNumber(value[0])) {
            out.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        break;
      }
      case 'coordinateLists': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
          if (Shape.isShape(value)) {
            const coordinates = await getCoordinates(value);
            if (coordinates.length > 0) {
              out.push(coordinates);
              continue;
            }
          } else if (Shape.isArray(value) && value.every(Shape.isCoordinate)) {
            out.push(value);
            continue;
          }
          // Otherwise
          rest.push(arg);
        }
        output.push(out);
        break;
      }
      case 'segments': {
        const out = [];
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
          if (Shape.isSegment(value)) {
            out.push(value);
          } else if (Shape.isArray(value) && value.every(Shape.isSegment)) {
            out.push(...value);
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
        throw Error(`Unknown destructure2 spec "${spec}"`);
      }
    }
    args = rest;
  }
  if (args.length !== 0) {
    let diagnostic;
    try {
      // Try to format it nicely.
      diagnostic = `Error[${names}] ${
        args.length
      } unused arguments: ${args.join(',')} JSON=${JSON.stringify(
        args
      )} arguments: ${JSON.stringify(originalArgs)} specs: ${JSON.stringify(
        specs
      )} output=${JSON.stringify(output)}`;
    } catch (error) {
      // Otherwise fall back.
      diagnostic = `Error[${names}] ${
        args.length
      } unused arguments: ${args.join(', ')} specs: ${specs.join(',')}`;
    }
    console.log(diagnostic);
    throw Error(diagnostic);
  }
  return output;
};

Shape.destructure2 = destructure2;

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

const Point = Shape.registerMethod3(
  'Point',
  ['number', 'number', 'number', 'coordinate'],
  Point$1
);

const ref = Shape.registerMethod2('ref', ['inputGeometry'], (geometry) =>
  Shape.fromGeometry(hasTypeReference(geometry))
);

const Ref = Shape.registerMethod2(
  'Ref',
  ['input', 'rest'],
  async (input, rest) => {
    const point = await Point(...rest)(input);
    return ref()(point);
  }
);

const X$7 = (x = 0) => Ref().x(x);
const Y$7 = (y = 0) => Ref().y(y);
const Z$6 = (z = 0) => Ref().z(z);
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

const abstract = Shape.registerMethod3(
  'abstract',
  ['inputGeometry', 'strings'],
  abstract$1
);

const approximate = Shape.registerMethod3(
  'approximate',
  ['inputGeometry', 'options'],
  approximate$1
);

const absolute = Shape.registerMethod3(
  'absolute',
  ['inputGeometry'],
  makeAbsolute
);

const And = Shape.registerMethod3(
  'And',
  ['geometry', 'geometries'],
  and$1
);

const and = Shape.registerMethod3(
  'and',
  ['inputGeometry', 'geometries'],
  and$1
);

const addTo = Shape.registerMethod3(
  ['addTo', 'joinTo'],
  ['inputGeometry', 'geometry', 'modes:exact,noVoid'],
  joinTo
);

const align = Shape.registerMethod3(
  'align',
  ['inputGeometry', 'string', 'coordinate'],
  align$1
);

const alignment = Shape.registerMethod3(
  'alignment',
  ['inputGeometry', 'string', 'coordinate'],
  alignment$1
);

const area = Shape.registerMethod3(
  'area',
  ['inputGeometry', 'function'],
  measureArea,
  (result, [geometry, op = (area) => (_shape) => area]) =>
    op(result)(Shape.fromGeometry(geometry))
);

const as = Shape.registerMethod3('as', ['inputGeometry', 'strings'], as$1);

// Constructs an item, as a part, from the designator.
const asPart = Shape.registerMethod3(
  'asPart',
  ['inputGeometry', 'strings'],
  asPart$1
);

const Group = Shape.registerMethod3('Group', ['geometries'], And$1);

const op = Shape.registerMethod2(
  'op',
  ['input', 'functions'],
  async (input, functions = []) => {
    const results = [];
    for (const fun of functions) {
      const result = await fun(Shape.chain(input));
      results.push(result);
    }
    return Group(...results);
  }
);

const at = Shape.registerMethod3(
  'at',
  ['inputGeometry', 'geometry', 'functions'],
  at$1,
  async ([localGeometry, toGlobal], [_geometry, _selector, ops]) => {
    const localShape = Shape.fromGeometry(localGeometry);
    const resultShape = await op(...ops)(localShape);
    return Shape.fromGeometry(toGlobal(await resultShape.toGeometry()));
  }
);

const bb = Shape.registerMethod3(
  'bb',
  ['inputGeometry', 'number', 'number', 'number'],
  bb$1
);

const bend = Shape.registerMethod3(
  'bend',
  ['inputGeometry', 'number'],
  bend$1
);

const Note = emitNote;

const note = Shape.registerMethod3(
  'note',
  ['inputGeometry', 'string'],
  note$1
);

const billOfMaterials = Shape.registerMethod3(
  ['billOfMaterials', 'bom'],
  ['inputGeometry', 'function'],
  (geometry) => tags$1(geometry, 'part:*'),
  (tags, [geometry, op = (...list) => note(`Materials: ${list.join(', ')}`)]) =>
    op(...tags)(Shape.fromGeometry(geometry))
);

const by = Shape.registerMethod3(
  'by',
  ['inputGeometry', 'geometries'],
  by$1
);

const centroid = Shape.registerMethod3(
  'centroid',
  ['inputGeometry'],
  computeCentroid
);

const ChainHull = Shape.registerMethod3(
  'ChainHull',
  ['geometries'],
  ChainConvexHull
);

const chainHull = Shape.registerMethod3(
  'chainHull',
  ['inputGeometry', 'geometries'],
  chainConvexHull
);

const clean = Shape.registerMethod3('clean', ['inputGeometry'], noGhost);

// It's not entirely clear that Clip makes sense, but we set it up to clip the first argument for now.
const Clip = Shape.registerMethod3(
  'Clip',
  ['geometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  clip$1
);

const clip = Shape.registerMethod3(
  'clip',
  ['inputGeometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  clip$1
);

const clipFrom = Shape.registerMethod3(
  'clipFrom',
  ['inputGeometry', 'geometry', 'modes:open,exact,noVoid,noGhost,onlyGraph'],
  clipFrom$1
);

const colorOp = (geometry, name) =>
  retag(geometry, ['color:*'], toTagsFromName(name));

const color = Shape.registerMethod3(
  'color',
  ['inputGeometry', 'string'],
  colorOp
);

// The semantics here are not very clear -- this computes a volume that all volumes in the shape have in common.
const commonVolume = Shape.registerMethod3(
  'commonVolume',
  ['inputGeometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  commonVolume$1
);

const copy = Shape.registerMethod3(
  'copy',
  ['inputGeometry', 'number'],
  copy$1
);

/*
import { CurveInterpolator } from 'curve-interpolator';
import Link from './Link.js';
import Loop from './Loop.js';
import Point from './Point.js';
import Shape from './Shape.js';

export const Curve = Shape.registerMethod2(
  'Curve',
  ['coordinates', 'number', 'options', 'modes:closed'],
  (
    coordinates,
    implicitSteps = 20,
    { steps = implicitSteps } = {},
    { closed }
  ) => {
    const interpolator = new CurveInterpolator(coordinates, {
      closed,
      tension: 0.2,
      alpha: 0.5,
    });
    const points = interpolator.getPoints(steps);
    if (closed) {
      return Loop(...points.map((point) => Point(point)));
    } else {
      return Link(...points.map((point) => Point(point)));
    }
  }
);

export const curve = Shape.registerMethod2(
  'curve',
  ['input', 'rest'],
  (input, rest) => Curve(input, ...rest)
);
*/

const Curve = Shape.registerMethod3(
  'Curve',
  ['coordinates', 'number', 'options', 'modes:closed'],
  Curve$1
);

const curve = Shape.registerMethod3(
  'curve',
  ['inputGeometry', 'coordinates', 'number', 'options', 'modes:closed'],
  curve$1
);

const Cut = Shape.registerMethod3(
  'Cut',
  ['geometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  cut$1
);

const cut = Shape.registerMethod3(
  'cut',
  ['inputGeometry', 'geometries', 'modes:open,exact,noVoid,noGhost'],
  cut$1
);

const cutFrom = Shape.registerMethod3(
  'cutFrom',
  ['inputGeometry', 'geometry', 'modes:open,exact,noVoid,noGhost'],
  cutFrom$1
);

const cutOut = Shape.registerMethod3(
  'cutOut',
  [
    'inputGeometry',
    'geometry',
    'modes:open,exact,noGhost,noVoid',
    'function',
    'function',
    'function',
  ],
  cutOut$1,
  (
    [cutShape, clippedShape],
    [, , , cutOp = (shape) => shape, clipOp = (shape) => shape, groupOp = Group]
  ) =>
    groupOp(
      cutOp(Shape.fromGeometry(cutShape)),
      clipOp(Shape.fromGeometry(clippedShape))
    )
);

const deform = Shape.registerMethod3(
  'deform',
  ['inputGeometry', 'geometries', 'options'],
  deform$1
);

const demesh = Shape.registerMethod3('demesh', ['inputGeometry'], demesh$1);

const diameter = Shape.registerMethod3(
  'diameter',
  ['inputGeometry', 'function'],
  computeGeneralizedDiameter,
  (diameter, [geometry, op = (diameter) => (_shape) => diameter]) =>
    op(diameter)(Shape.fromGeometry(geometry))
);

const dilateXY = Shape.registerMethod3(
  'dilateXY',
  ['inputGeometry', 'number'],
  dilateXY$1
);

const disjoint = Shape.registerMethod3(
  'disjoint',
  ['inputGeometry', 'modes:backward,exact'],
  disjoint$1
);

const ghost = Shape.registerMethod2(
  'ghost',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(hasTypeGhost(geometry))
);

const noOp = Shape.registerMethod3(
  ['input', 'noOp', 'self'],
  ['inputGeometry'],
  (geometry) => geometry
);
const input = noOp;
const self = noOp;

Shape.registerMethod3(
  'value',
  ['value'],
  (value) => value,
  (value) => value
);

const transform = Shape.registerMethod3(
  'transform',
  ['inputGeometry', 'value'],
  transform$1
);

const on = Shape.registerMethod2(
  'on',
  ['inputGeometry', 'geometry', 'function'],
  async (geometry, selection, op$1 = noOp) => {
    const entries = [];
    entries.push({ selection, op: op$1 });
    const inputLeafs = [];
    const outputLeafs = [];
    for (const { selection, op: op$1 } of entries) {
      const leafs = getLeafs(selection);
      for (const inputLeaf of leafs) {
        const global = inputLeaf.matrix;
        const local = invertTransform(global);
        const target = Shape.fromGeometry(inputLeaf);
        // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
        const a = await transform(local)(target);
        const b = await op(op$1)(a);
        const r = await transform(global)(b);
        const outputLeaf = await r.toGeometry();
        inputLeafs.push(inputLeaf);
        outputLeafs.push(outputLeaf);
      }
    }
    const result = Shape.fromGeometry(
      replacer(inputLeafs, outputLeafs)(geometry)
    );
    return result;
  }
);

const drop = Shape.registerMethod2(
  'drop',
  ['input', 'shape'],
  (input, selector) => on(selector, ghost())(input)
);

const List = (...shapes) => shapes;

const list = Shape.registerMethod2(
  'list',
  ['values'],
  (values) => values
);

Shape.List = List;

/*
import './extrude.js';
import './rx.js';
import './ry.js';

import Edge from './Edge.js';
import Geometry from './Geometry.js';
import Loop from './Loop.js';
import Point from './Point.js';
import Shape from './Shape.js';
import { absolute } from './absolute.js';
import { buildCorners } from './Plan.js';
import { makeOcctBox } from './jsxcad-algorithm-cgal.js';

const X = 0;
const Y = 1;
const Z = 2;

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
    const left = corner2[X];
    const right = corner1[X];

    const front = corner2[Y];
    const back = corner1[Y];

    const bottom = corner2[Z];
    const top = corner1[Z];

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

  return absolute()(await build());
};
*/

const Box = Shape.registerMethod3('Box', ['intervals', 'options'], Box$1);

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

const Hershey = Shape.registerMethod2(
  'Hershey',
  ['string', 'number'],
  (text, size) => toSegments(text).scale(size)
);

const getNot = Shape.registerMethod2(
  ['getNot', 'gn'],
  ['inputGeometry', 'strings'],
  (geometry, tags) => {
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

const toDisplayGeometry = Shape.registerMethod3(
  'toDisplayGeometry',
  ['inputGeometry'],
  toDisplayGeometry$1,
  (geometry) => geometry
);

const MIN = 0;
const MAX = 1;
const X$6 = 0;
const Y$6 = 1;

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

const Page = Shape.registerMethod2(
  'Page',
  ['geometries', 'modes:pack,center,a4,individual', 'options'],
  async (
    geometries,
    { pack, center, a4, individual },
    { size, pageMargin = 5, itemMargin = 1, itemsPerPage = Infinity } = {}
  ) => {
    if (a4) {
      size = [210, 297];
    }

    if (individual) {
      pack = true;
      itemsPerPage = 1;
    }

    const margin = itemMargin;
    const layers = [];
    for (const geometry of geometries) {
      for (const leaf of getLeafs(geometry)) {
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
          Math.abs(packSize[MAX][X$6] * 2),
          Math.abs(packSize[MIN][X$6] * 2)
        ) +
        pageMargin * 2;
      const pageLength =
        Math.max(
          1,
          Math.abs(packSize[MAX][Y$6] * 2),
          Math.abs(packSize[MIN][Y$6] * 2)
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
          Math.abs(packSize[MAX][X$6] * 2),
          Math.abs(packSize[MIN][X$6] * 2)
        ) +
        pageMargin * 2;
      const pageLength =
        Math.max(
          1,
          Math.abs(packSize[MAX][Y$6] * 2),
          Math.abs(packSize[MIN][Y$6] * 2)
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
      const content = await Shape.fromGeometry(taggedGroup({}, ...layers)).pack(
        (min, max) => {
          packSize[MIN] = min;
          packSize[MAX] = max;
        },
        {
          size,
          pageMargin,
          itemMargin,
          perLayout: itemsPerPage,
        }
      );
      if (packSize.length === 0) {
        throw Error('Packing failed');
      }
      const pageWidth = Math.max(1, packSize[MAX][X$6] - packSize[MIN][X$6]);
      const pageLength = Math.max(1, packSize[MAX][Y$6] - packSize[MIN][Y$6]);
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
      const contents = await Shape.fromGeometry(
        taggedGroup({}, ...layers)
      ).pack(
        (min, max) => {
          packSize[MIN] = min;
          packSize[MAX] = max;
        },
        {
          pageMargin,
          itemMargin,
          perLayout: itemsPerPage,
        }
      );
      if (packSize.length === 0) {
        throw Error('Packing failed');
      }
      // FIX: Using content.size() loses the margin, which is a problem for repacking.
      // Probably page plans should be generated by pack and count toward the size.
      const pageWidth = packSize[MAX][X$6] - packSize[MIN][X$6];
      const pageLength = packSize[MAX][Y$6] - packSize[MIN][Y$6];
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
  }
);

const page = Shape.registerMethod2(
  'page',
  ['input', 'rest'],
  (input, rest) => Page(input, ...rest)
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

const each = Shape.registerMethod3(
  'each',
  ['inputGeometry', 'function', 'function'],
  each$1,
  async (
    leafs,
    [geometry, leafOp = (leaf) => (_shape) => leaf, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const leafShapes = [];
    for (const leaf of leafs) {
      leafShapes.push(
        await Shape.apply(input, leafOp, Shape.chain(Shape.fromGeometry(leaf)))
      );
    }
    return Shape.apply(input, groupOp, ...leafShapes);
  }
);

const eachEdge = Shape.registerMethod3(
  'eachEdge',
  [
    'inputGeometry',
    'function',
    'function',
    'function',
    'options:select=geometries',
  ],
  toOrientedFaceEdgesList,
  async (
    faceEdgesList,
    [
      geometry,
      edgeOp = (e, _l, _o) => (_s) => e,
      faceOp = (es, _f) => (_s) => es,
      groupOp = Group,
    ]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const resultShapes = [];
    for (const { face, edges } of faceEdgesList) {
      const edgeShapes = [];
      for (const { segment, length, backward } of edges) {
        edgeShapes.push(
          await Shape.apply(
            input,
            edgeOp,
            Shape.chain(Shape.fromGeometry(segment)),
            length,
            Shape.chain(Shape.fromGeometry(backward))
          )
        );
      }
      const resultShape = await Shape.apply(
        input,
        faceOp,
        Group(...edgeShapes),
        Shape.chain(Shape.fromGeometry(face))
      );
      resultShapes.push(resultShape);
    }
    return Shape.apply(input, groupOp, ...resultShapes);
  }
);

const eachPoint = Shape.registerMethod3(
  'eachPoint',
  ['inputGeometry', 'function', 'function'],
  toPointList,
  async (
    pointList,
    [geometry, pointOp = (point) => (_shape) => point, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const shapes = [];
    for (const point of pointList) {
      shapes.push(
        await Shape.apply(
          input,
          pointOp,
          Shape.chain(Shape.fromGeometry(point))
        )
      );
    }
    return Shape.apply(Shape.chain(input), groupOp, ...shapes);
  }
);

const eachSegment = Shape.registerMethod3(
  'eachSegment',
  ['inputGeometry', 'function', 'function'],
  toSegmentList,
  async (
    segments,
    [geometry, segmentOp = (segment) => (_shape) => segment, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const shapes = [];
    for (const segment of segments) {
      shapes.push(
        await Shape.apply(
          input,
          segmentOp,
          Shape.chain(Shape.fromGeometry(segment))
        )
      );
    }
    return Shape.apply(input, groupOp, ...shapes);
  }
);

/*
import { disorientSegment, linearize } from './jsxcad-geometry.js';

import Group from './Group.js';
import Shape from './Shape.js';

export const eachSegment = Shape.registerMethod2(
  'eachSegment',
  ['input', 'function', 'function'],
  async (
    input,
    segmentOp = (segment) => (_shape) => segment,
    groupOp = Group
  ) => {
    const inputs = linearize(
      await input.toGeometry(),
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
          await segmentOp(Shape.chain(Shape.fromGeometry(segment)))(input)
        );
      }
    }
    const grouped = groupOp(...output);
    if (Shape.isFunction(grouped)) {
      return grouped(input);
    } else {
      return grouped;
    }
  }
);
*/

const eagerTransform = Shape.registerMethod3(
  'eagerTransform',
  ['inputGeometry', 'value'],
  eagerTransform$1
);

const edges = Shape.registerMethod3(
  'edges',
  ['inputGeometry', 'function', 'function'],
  toOrientedFaceEdgesList,
  async (
    faceEdgesList,
    [geometry, edgesOp = (edges) => (_shape) => edges, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const shapes = [];
    for (const { edges } of faceEdgesList) {
      shapes.push(
        await Shape.apply(
          input,
          edgesOp,
          ...edges.map(({ segment }) => Shape.fromGeometry(segment))
        )
      );
    }
    return Shape.apply(input, groupOp, ...shapes);
  }
);

/*
import Group from './Group.js';
import Shape from './Shape.js';
import { eachFaceEdges } from './jsxcad-geometry.js';

// TODO: Add an option to include a virtual segment at the target of the last
// edge.

export const length = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

export const subtract = ([ax, ay, az], [bx, by, bz]) => [
  ax - bx,
  ay - by,
  az - bz,
];

export const edges = Shape.registerMethod2(
  'edges',
  ['input', 'geometries', 'function', 'function'],
  async (input, selections, edgesOp = (edges) => edges, groupOp = Group) => {
    const edges = [];
    eachFaceEdges(
      await input.toGeometry(),
      selections,
      (faceGeometry, edgeGeometry) => {
        if (edgeGeometry) {
          edges.push(edgesOp(Shape.chain(Shape.fromGeometry(edgeGeometry))));
        }
      }
    );
    const grouped = groupOp(...edges);
    if (grouped instanceof Function) {
      return grouped(input);
    } else {
      return grouped;
    }
  }
);
*/

const extrudeX = Shape.registerMethod3(
  ['extrudeX', 'ex'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  extrudeAlongX
);

const ex = extrudeX;

const extrudeY = Shape.registerMethod3(
  ['extrudeY', 'ey'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  extrudeAlongY
);

const ey = extrudeY;

const extrudeZ = Shape.registerMethod3(
  ['extrudeZ', 'ez'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  extrudeAlongZ
);

const ez = extrudeZ;

// This interface is a bit awkward.
const extrudeAlong = Shape.registerMethod3(
  'extrudeAlong',
  ['inputGeometry', 'coordinate', 'intervals', 'modes:noVoid'],
  extrudeAlong$1
);

// Note that the operator is applied to each leaf geometry by default.
const e = Shape.registerMethod3(
  ['e', 'extrudeAlongNormal'],
  ['inputGeometry', 'intervals', 'modes:noVoid'],
  extrudeAlongNormal
);

const faces = Shape.registerMethod3(
  'faces',
  ['inputGeometry', 'options', 'function', 'function'],
  toFaceEdgesList,
  async (
    faceEdgesList,
    [geometry, _options, faceOp = (face) => (_s) => face, groupOp = Group]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const results = [];
    for (const { face } of faceEdgesList) {
      const faceShape = await Shape.apply(
        input,
        faceOp,
        Shape.chain(Shape.fromGeometry(face))
      );
      results.push(faceShape);
    }
    return Shape.apply(input, groupOp, ...results);
  }
);

const fill = Shape.registerMethod3(['fill', 'f'], ['inputGeometry'], fill$1);

const fit = Shape.registerMethod3(
  'fit',
  ['inputGeometry', 'geometries', 'modes:exact'],
  fit$1
);

const fitTo = Shape.registerMethod3(
  ['Assembly', 'fitTo'],
  ['inputGeometry', 'geometries', 'modes:exact'],
  fitTo$1
);

const fix = Shape.registerMethod2('fix', ['inputGeometry'], (geometry) =>
  Shape.fromGeometry(fix$1(geometry, /* removeSelfIntersections= */ true))
);

const to = Shape.registerMethod3(
  'to',
  ['inputGeometry', 'geometries'],
  to$1
);

const flat = Shape.registerMethod2('flat', ['input'], (input) =>
  to(XY())(input)
);

const MODES =
  'modes:grid,none,side,top,wireframe,noWireframe,skin,noSkin,outline,noOutline';

const applyModes = async (shape, options, modes) => {
  if (modes.wireframe) {
    shape = await shape.tag('show:wireframe');
  }
  if (modes.noWireframe) {
    shape = await shape.tag('show:noWireframe');
  }
  if (modes.skin) {
    shape = await shape.tag('show:skin');
  }
  if (modes.noSkin) {
    shape = await shape.tag('show:noSkin');
  }
  if (modes.outline) {
    shape = await shape.tag('show:outline');
  }
  if (modes.noOutline) {
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
  (
    name,
    op = (x) => x,
    { size = 512, inline, width, height, position = [100, -100, 100] } = {}
  ) =>
  async (shape) => {
    if (size !== undefined) {
      width = size;
      height = size;
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

Shape.registerMethod2(
  'topView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = true,
      width,
      height,
      position = [0, 0, 100],
    } = {},
    viewId
  ) => {
    const options = { size, skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

const gridView = Shape.registerMethod2(
  'gridView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      width,
      height,
      position = [0, 0, 100],
    } = {},
    viewId
  ) => {
    const options = { size, skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

Shape.registerMethod2(
  'frontView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      width,
      height,
      position = [0, -100, 0],
    } = {},
    viewId
  ) => {
    const options = { size, skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

Shape.registerMethod2(
  'sideView',
  ['input', MODES, 'function', 'options', 'value'],
  async (
    input,
    modes,
    op = (x) => x,
    {
      size = 512,
      skin = true,
      outline = true,
      wireframe = false,
      width,
      height,
      position = [100, 0, 0],
    } = {},
    viewId
  ) => {
    const options = { size, skin, outline, wireframe, width, height, position };
    const shape = await applyModes(input, options, modes);
    return baseView(viewId, op, options)(shape);
  }
);

const view = Shape.registerMethod2(
  'view',
  ['input', MODES, 'function', 'options', 'value'],
  async (input, modes, op = (x) => x, options, viewId) => {
    const shape = await applyModes(input, options, modes);
    if (modes.grid) {
      options.style = 'grid';
    }
    if (modes.none) {
      options.style = 'none';
    }
    if (modes.side) {
      options.style = 'side';
    }
    if (modes.top) {
      options.style = 'top';
    }
    switch (options.style) {
      case 'grid':
        return shape.gridView(viewId, op, options, modes);
      case 'none':
        return shape;
      case 'side':
        return shape.sideView(viewId, op, options, modes);
      case 'top':
        return shape.topView(viewId, op, options, modes);
      default:
        return baseView(viewId, op, options)(shape);
    }
  }
);

const gcode = Shape.registerMethod2(
  'gcode',
  ['input', 'string', 'function', 'options'],
  async (
    input,
    name,
    op = (s) => s,
    { speed = 0, feedrate = 0, jumpHeight = 1 } = {}
  ) => {
    const options = { speed, feedrate, jumpHeight };
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    for (const entry of await ensurePages(op(input))) {
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
    return input;
  }
);

const origin = Shape.registerMethod2(
  ['origin', 'o'],
  ['inputGeometry'],
  (geometry) => {
    const { local } = getInverseMatrices(geometry);
    return Point().transform(local);
  }
);

const o = origin;

const Join = Shape.registerMethod3(
  ['Add', 'Fuse', 'Join'],
  ['geometries', 'modes:exact'],
  Fuse$1
);

const join = Shape.registerMethod3(
  ['add', 'fuse', 'join'],
  ['inputGeometry', 'geometries', 'modes:exact,noVoid'],
  join$1
);

const Fuse = Join;

const fuse = Shape.registerMethod3(
  'fuse',
  ['inputGeometry', 'geometries', 'modes:exact'],
  fuse$1
);

const get = Shape.registerMethod3(
  ['get', 'g'],
  ['inputGeometry', 'strings', 'function'],
  get$1,
  async (results, [geometry, _tags, groupOp = Group]) => {
    const input = Shape.fromGeometry(geometry);
    const leafShapes = [];
    for (const result of results) {
      leafShapes.push(Shape.fromGeometry(result));
    }
    return Shape.apply(input, groupOp, ...leafShapes);
  }
);

const g = get;

const voidFn = Shape.registerMethod2(
  ['void', 'gap'],
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(hasTypeGhost(hasTypeVoid(geometry)))
);

const gap = voidFn;

// get, ignoring item boundaries.

const getAll = Shape.registerMethod2(
  'getAll',
  ['inputGeometry', 'strings', 'function'],
  (geometry, tags, groupOp = Group) => {
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

const getTag = Shape.registerMethod2(
  'getTag',
  ['input', 'strings', 'function'],
  (
    input,
    tags,
    op = (..._values) =>
      (shape) =>
        shape
  ) => {
    const values = [];
    for (const tag of tags) {
      const tags = input.tags(`${tag}=*`, list);
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
    return op(...values)(input);
  }
);

// This should take an op.

const getTags = Shape.registerMethod2(
  'getTags',
  ['inputGeometry'],
  (geometry) => {
    const { tags = [] } = geometry;
    return tags;
  }
);

const grow = Shape.registerMethod2(
  'grow',
  ['inputGeometry', 'number', 'string', 'geometries'],
  async (geometry, amount, axes = 'xyz', selections) =>
    Shape.fromGeometry(
      grow$1(geometry, await Point().z(amount).toGeometry(), selections, {
        x: axes.includes('x'),
        y: axes.includes('y'),
        z: axes.includes('z'),
      })
    )
);

const inFn = Shape.registerMethod2('in', ['input'], async (input) => {
  const geometry = await input.toGeometry();
  if (geometry.type === 'item') {
    return Shape.fromGeometry(geometry.content[0]);
  } else {
    return input;
  }
});

const hold = Shape.registerMethod2(
  'hold',
  ['inputShape', 'shapes'],
  (inputShape, shapes) => inputShape.on(inFn(), inFn().and(...shapes))
);

const Hull = Shape.registerMethod3('Hull', ['geometries'], ConvexHull);

const hull = Shape.registerMethod3(
  'hull',
  ['inputGeometry', 'geometries'],
  convexHull
);

const untag = Shape.registerMethod3(
  'untag',
  ['inputGeometry', 'strings'],
  untag$1
);

const image = Shape.registerMethod2(
  'image',
  ['input', 'string'],
  (input, url) => untag('image:*').tag(`image:${url}`)(input)
);

const inset = Shape.registerMethod3(
  'inset',
  ['inputGeometry', 'number', 'options'],
  inset$1
);

const involute = Shape.registerMethod2(
  'involute',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(involute$1(geometry))
);

const Link = Shape.registerMethod3(
  'Link',
  ['geometry', 'geometries', 'modes:close,reverse'],
  link$1
);

const link = Shape.registerMethod3(
  'link',
  ['inputGeometry', 'geometries', 'modes:close,reverse'],
  link$1
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

const Loft = Shape.registerMethod3(
  'Loft',
  ['geometry', 'geometries', 'modes:open'],
  loft$1
);

const loft = Shape.registerMethod3(
  'loft',
  ['inputGeometry', 'geometries', 'modes:open'],
  loft$1
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

const log = Shape.registerMethod2(
  'log',
  ['input', 'string'],
  async (input, prefix = '') => {
    const text = prefix + JSON.stringify(await input.toGeometry());
    const level = 'serious';
    const log = { text, level };
    const hash = computeHash(log);
    emit({ log, hash });
    log$1({ op: 'text', text });
    console.log(text);
    return input;
  }
);

const Loop = Shape.registerMethod3(
  'Loop',
  ['geometry', 'geometries', 'modes:close'],
  loop$1
);

const loop = Shape.registerMethod3(
  'loop',
  ['inputGeometry', 'geometries', 'modes:close'],
  loop$1
);

const lowerEnvelope = Shape.registerMethod2(
  'lowerEnvelope',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(generateLowerEnvelope(geometry))
);

const overlay = Shape.registerMethod2(
  'overlay',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(hasShowOverlay(geometry))
);

// Note: the first three segments are notionally 'length', 'depth', 'height'.
// Really this should probably be some kind of 'diameter at an angle' measurement, like using a set of calipers.

const mark = Shape.registerMethod2(
  'mark',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(computeOrientedBoundingBox(geometry))
);

const masked = Shape.registerMethod2(
  'masked',
  ['inputGeometry', 'shapes'],
  async (geometry, masks) => {
    const shapes = [];
    for (const mask of masks) {
      shapes.push(await gap()(mask));
    }
    return Group(...shapes, Shape.fromGeometry(hasTypeMasked(geometry)));
  }
);

const masking = Shape.registerMethod2(
  'masking',
  ['input', 'geometry'],
  async (input, masked) =>
    Group(await gap()(input), Shape.fromGeometry(hasTypeMasked(masked)))
);

const material = Shape.registerMethod2(
  'material',
  ['inputGeometry', 'string'],
  (geometry, name) => Shape.fromGeometry(hasMaterial(geometry, name))
);

// TODO: Fix toCoordinates.
const move = Shape.registerMethod2(
  ['move', 'xyz'],
  ['input', 'number', 'number', 'number', 'coordinates'],
  async (input, x, y = 0, z = 0, coordinates = []) => {
    const results = [];
    if (x !== undefined) {
      coordinates.push([x || 0, y, z]);
    }
    for (const coordinate of coordinates) {
      results.push(
        await transform(fromTranslateToTransform(...coordinate))(input)
      );
    }
    return Group(...results);
  }
);

const xyz = move;

const moveAlong = Shape.registerMethod3(
  'moveAlong',
  ['inputGeometry', 'coordinate', 'numbers'],
  moveAlong$1
);

const m = Shape.registerMethod3(
  ['moveAlongNormal', 'm'],
  ['inputGeometry', 'numbers'],
  moveAlongNormal
);

const normal = Shape.registerMethod3('normal', ['inputGeometry'], computeNormal);

const Empty = Shape.registerMethod2('Empty', [], () =>
  Shape.fromGeometry(taggedGroup({}))
);

const noVoid = Shape.registerMethod2(
  ['noVoid', 'noGap'],
  ['input'],
  (input) => input.on(get('type:void'), Empty())
);

const noGap = noVoid;

const nth = Shape.registerMethod2(
  ['nth', 'n'],
  ['input', 'numbers'],
  async (input, nths) => {
    const candidates = await each(
      (leaf) => leaf,
      (...leafs) =>
        (_shape) =>
          leafs
    )(input);
    const group = [];
    for (let nth of nths) {
      if (nth < 0) {
        nth = candidates.length + nth;
      }
      let candidate = candidates[nth];
      if (candidate === undefined) {
        candidate = await Empty();
      }
      group.push(candidate);
    }
    return Group(...group);
  }
);

const n = nth;

const offset = Shape.registerMethod3(
  'offset',
  ['inputGeometry', 'number', 'options'],
  offset$1
);

const outline = Shape.registerMethod2(
  'outline',
  ['inputGeometry', 'geometries'],
  (geometry, selections) =>
    Shape.fromGeometry(outline$1(geometry, selections))
);

const cross = ([ax, ay, az], [bx, by, bz]) => [
  ay * bz - az * by,
  az * bx - ax * bz,
  ax * by - ay * bx,
];

const scale$2 = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const normalize = (a) => {
  const [x, y, z] = a;
  const len = x * x + y * y + z * z;
  if (len > 0) {
    // TODO: evaluate use of glm_invsqrt here?
    return scale$2(1 / Math.sqrt(len), a);
  } else {
    return a;
  }
};

const squaredLength = ([x, y, z]) => x * x + y * y + z * z;

const subtract = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

const X$5 = 0;
const Y$5 = 1;
const Z$5 = 2;

// These are all absolute positions in the world.
// at is where the object's origin should move to.
// to is where the object's axis should point at.
// up rotates around the axis to point a dorsal position toward.

const orient = Shape.registerMethod2(
  'orient',
  ['input', 'options'],
  async (input, { at = [0, 0, 0], to = [0, 0, 1], up = [1, 0, 0] } = {}) => {
    const { local } = getInverseMatrices(await input.toGeometry());
    // Algorithm from threejs Matrix4
    let u = subtract(up, at);
    if (squaredLength(u) === 0) {
      u[Z$5] = 1;
    }
    u = normalize(u);
    let z = subtract(to, at);
    if (squaredLength(z) === 0) {
      z[Z$5] = 1;
    }
    z = normalize(z);
    let x = cross(u, z);
    if (squaredLength(x) === 0) {
      // u and z are parallel
      if (Math.abs(u[Z$5]) === 1) {
        z[X$5] += 0.0001;
      } else {
        z[Z$5] += 0.0001;
      }
      z = normalize(z);
      x = cross(u, z);
    }
    x = normalize(x);
    let y = cross(z, x);
    const lookAt = [
      x[X$5],
      x[Y$5],
      x[Z$5],
      0,
      y[X$5],
      y[Y$5],
      y[Z$5],
      0,
      z[X$5],
      z[Y$5],
      z[Z$5],
      0,
      0,
      0,
      0,
      1,
    ];
    // FIX: Move this to CGAL.
    lookAt.blessed = true;
    return input
      .transform(local)
      .transform(lookAt)
      .move(...at);
  }
);

const pack = Shape.registerMethod2(
  'pack',
  ['input', 'function', 'options'],
  async (
    input,
    adviseSize = (_min, _max) => {},
    { size, pageMargin = 5, itemMargin = 1, perLayout = Infinity } = {}
  ) => {
    if (perLayout === 0) {
      // Packing was disabled -- do nothing.
      return input;
    }

    let todo = [];
    for (const leaf of getLeafs(await input.toGeometry())) {
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
        adviseSize(minPoint, maxPoint);
        if (packed.length === 0) {
          break;
        } else {
          packedLayers.push(
            taggedItem({ tags: ['pack:layout'] }, taggedGroup({}, ...packed))
          );
        }
        todo.unshift(...unpacked);
      }
    }
    // CHECK: Can this distinguish between a set of packed paged, and a single
    // page that's packed?
    let packedShape = Shape.fromGeometry(taggedGroup({}, ...packedLayers));
    if (size === undefined) {
      packedShape = await packedShape.align('xy');
    }
    return packedShape;
  }
);

const pdf = Shape.registerMethod2(
  'pdf',
  ['input', 'string', 'function', 'options'],
  async (
    input,
    name,
    op = (_v) => (s) => s,
    { lineWidth = 0.096, size = [210, 297], definitions } = {}
  ) => {
    const options = { lineWidth, size, definitions };
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    for (const entry of await ensurePages(await Shape.apply(input, op))) {
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
    return input;
  }
);

// These should probably be polymorphic and handle vector operations, etc.

// e.g., a.x(times(diameter(), 1/2))
const times = Shape.registerMethod2('times', ['numbers'], (numbers) =>
  numbers.reduce((a, b) => a * b, 1)
);

// e.g., a.x(plus(diameter(), -2))
const plus = Shape.registerMethod2('plus', ['numbers'], (numbers) =>
  numbers.reduce((a, b) => a + b, 0)
);

const points$1 = Shape.registerMethod3('points', ['inputGeometry'], toPoints);

const put = Shape.registerMethod2(
  'put',
  ['input', 'shapes'],
  (input$1, shapes) => on(input(), shapes)(input$1)
);

const remesh = Shape.registerMethod2(
  'remesh',
  ['inputGeometry', 'number', 'geometries', 'options'],
  (
    geometry,
    resolution = 1,
    selections,
    { iterations = 1, relaxationSteps = 1, targetEdgeLength = resolution } = {}
  ) =>
    Shape.fromGeometry(
      remesh$1(
        geometry,
        selections,
        iterations,
        relaxationSteps,
        targetEdgeLength
      )
    )
);

const rx = Shape.registerMethod3(
  ['rotateX', 'rx'],
  ['inputGeometry', 'numbers'],
  rotateXs
);

const rotateX = rx;

const ry = Shape.registerMethod3(
  ['rotateY', 'ry'],
  ['inputGeometry', 'numbers'],
  rotateYs
);

const rotateY = ry;

const rz = Shape.registerMethod3(
  ['rotateZ', 'rz'],
  ['inputGeometry', 'numbers'],
  rotateZs
);

const rotateZ = rz;

const square = (a) => a * a;

const distance$1 = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  Math.sqrt(square(ax - bx) + square(ay - by) + square(az - bz));

const runLength = Shape.registerMethod2(
  'runLength',
  ['input', 'function'],
  async (input, op = (length) => (_shape) => length) => {
    let total = 0;
    for (const { segments } of linearize(
      await input.toGeometry(),
      ({ type }) => type === 'segments'
    )) {
      for (const [source, target] of segments) {
        total += distance$1(source, target);
      }
    }
    return op(total)(input);
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

const scale$1 = Shape.registerMethod2(
  ['scale', 's'],
  ['input', 'coordinate', 'number', 'number', 'number'],
  async (input, coordinate, dX = 1, dY = dX, dZ = dY) => {
    let [x, y, z] = coordinate || [dX, dY, dZ];
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
      return eagerTransform(fromScaleToTransform(x, y, z)).involute()(input);
    } else {
      return eagerTransform(fromScaleToTransform(x, y, z))(input);
    }
  }
);

const s = scale$1;

const scaleX = Shape.registerMethod2(
  ['scaleX', 'sx'],
  ['input', 'numbers'],
  async (input, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(await scale$1(value, 1, 1)(input));
    }
    return Group(...scaled);
  }
);

const sx = scaleX;

const scaleY = Shape.registerMethod2(
  ['scaleY', 'sy'],
  ['input', 'numbers'],
  async (input, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(await scale$1(1, value, 1)(input));
    }
    return Group(...scaled);
  }
);

const sy = scaleY;

const scaleZ = Shape.registerMethod2(
  ['scaleZ', 'sz'],
  ['input', 'numbers'],
  async (input, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(await scale$1(1, 1, value)(input));
    }
    return Group(...scaled);
  }
);

const sz = scaleZ;

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const distance = ([ax, ay, az], [bx, by, bz]) => {
  const x = bx - ax;
  const y = by - ay;
  const z = bz - az;
  return Math.sqrt(x * x + y * y + z * z);
};

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const X$4 = 0;
const Y$4 = 1;
const Z$4 = 2;

const size = Shape.registerMethod2(
  'size',
  [
    'input',
    'modes:max,min,right,left,front,back,top,bottom,length,width,height,center,radius',
    'function',
  ],
  async (input, modes, op = (value) => (_shape) => value) => {
    const geometry = await input.toGeometry();
    const bounds = measureBoundingBox(geometry);
    const args = [];
    if (bounds !== undefined) {
      const [min, max] = bounds;
      if (modes.max) {
        args.push(max);
      }
      if (modes.min) {
        args.push(min);
      }
      if (modes.right) {
        args.push(max[X$4]);
      }
      if (modes.left) {
        args.push(min[X$4]);
      }
      if (modes.front) {
        args.push(min[Y$4]);
      }
      if (modes.back) {
        args.push(max[Y$4]);
      }
      if (modes.top) {
        args.push(max[Z$4]);
      }
      if (modes.bottom) {
        args.push(min[Z$4]);
      }
      if (modes.length) {
        args.push(max[X$4] - min[X$4]);
      }
      if (modes.width) {
        args.push(max[Y$4] - min[Y$4]);
      }
      if (modes.height) {
        args.push(max[Z$4] - min[Z$4]);
      }
      if (modes.center) {
        args.push(scale(0.5, add(min, max)));
      }
      if (modes.radius) {
        const center = scale(0.5, add(min, max));
        args.push(distance(center, max));
      }
    }
    return op(...args)(input);
  }
);

const scaleToFit = Shape.registerMethod2(
  'scaleToFit',
  ['input', 'number', 'number', 'number'],
  async (input, x = 1, y = x, z = y) =>
    size(
      'length',
      'width',
      'height',
      (length, width, height) => async (input) => {
        const xFactor = x / length;
        const yFactor = y / width;
        const zFactor = z / height;
        // Surfaces may get non-finite factors -- use the unit instead.
        const finite = (factor) => (isFinite(factor) ? factor : 1);
        return input.scale(finite(xFactor), finite(yFactor), finite(zFactor));
      }
    )(input)
);

const seam = Shape.registerMethod2(
  'seam',
  ['inputGeometry', 'geometries'],
  (geometry, selections) =>
    Shape.fromGeometry(seam$1(geometry, selections))
);

const baseSection =
  ({ profile = false } = {}, orientations) =>
  async (geometry) => {
    if (orientations.length === 0) {
      orientations.push(await Point().toGeometry());
    }
    return Shape.fromGeometry(
      section$1(geometry, orientations, { profile })
    );
  };

const section = Shape.registerMethod2(
  'section',
  ['inputGeometry', 'geometries'],
  (input, orientations) => baseSection({ profile: false }, orientations)(input)
);

const sectionProfile = Shape.registerMethod2(
  'sectionProfile',
  ['inputGeometry', 'geometries'],
  (input, orientations) => baseSection({ profile: true }, orientations)(input)
);

const separate = Shape.registerMethod3(
  'separate',
  ['inputGeometry', 'modes:noShapes,noHoles,holesAsShapes'],
  separate$1
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
  ['input', 'function', 'function', 'objects'],
  async (input, op = (_n) => (s) => s, groupOp = Group, specs) => {
    const indexes = [];
    for (const spec of specs) {
      const { from = 0, to = 1, upto, downto, by = 1 } = spec;

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

const serialize = Shape.registerMethod2(
  'serialize',
  ['input', 'function'],
  async (input, op = (v) => v, groupOp = (_v) => (s) => s) =>
    groupOp(op(serialize$1(await input.toGeometry())))(input)
);

const setTag = Shape.registerMethod2(
  'setTag',
  ['input', 'string', 'value'],
  (input, tag, value) => untag(`${tag}=*`).tag(`${tag}=${value}`)(input)
);

const setTags = Shape.registerMethod2(
  'setTags',
  ['inputGeometry', 'strings'],
  (geometry, tags = []) => Shape.fromGeometry(rewriteTags(tags, [], geometry))
);

const shadow = Shape.registerMethod2(
  ['shadow', 'silhouette'],
  ['inputGeometry', 'shape', 'shape'],
  async (geometry, planeReference = XY(0), sourceReference = XY(1)) =>
    Shape.fromGeometry(
      cast(
        await planeReference.toGeometry(),
        await sourceReference.toGeometry(),
        geometry
      )
    )
);

const shell = Shape.registerMethod3(
  'shell',
  ['inputGeometry', 'interval', 'number', 'number', 'modes:protect', 'options'],
  shell$1
);

const simplify = Shape.registerMethod2(
  'simplify',
  ['inputGeometry', 'number', 'number', 'options'],
  (geometry, cornerThreshold = 20 / 360, eps) =>
    Shape.fromGeometry(simplify$1(geometry, cornerThreshold, eps))
);

const sketch = Shape.registerMethod2(
  'sketch',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(taggedSketch({}, geometry))
);

const smooth = Shape.registerMethod2(
  'smooth',
  ['inputGeometry', 'number', 'options', 'geometries'],
  (
    geometry,
    resolution = 1,
    {
      iterations = 1,
      time = 1,
      remeshIterations = 1,
      remeshRelaxationSteps = 1,
    } = {},
    selections
  ) =>
    Shape.fromGeometry(
      smooth$1(
        geometry,
        selections,
        resolution,
        iterations,
        time,
        remeshIterations,
        remeshRelaxationSteps
      )
    )
);

const X$3 = 0;
const Y$3 = 1;
const Z$3 = 2;

const sort = Shape.registerMethod2(
  'sort',
  ['inputGeometry', 'string'],
  async (geometry, spec = 'z<y<x<') => {
    let leafs = [];
    for (const leaf of getLeafs(geometry)) {
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

const LoadStl = Shape.registerMethod2(
  'LoadStl',
  ['string', 'modes:binary,ascii,wrap', 'options'],
  async (
    path,
    { binary, ascii, wrap },
    {
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      cornerThreshold = 20 / 360,
    } = {}
  ) => {
    const data = await read(`source/${path}`, { sources: [path] });
    if (data === undefined) {
      throw Error(`LoadStl cannot read: "${path}"`);
    }
    let format = 'binary';
    if (ascii) {
      format = 'ascii';
    } else if (binary) {
      format = 'binary';
    }
    return Shape.fromGeometry(
      await fromStl(data, {
        format,
        wrapAlways: wrap,
        wrapAbsoluteAlpha,
        wrapAbsoluteOffset,
        wrapRelativeAlpha,
        wrapRelativeOffset,
        cornerThreshold,
      })
    );
  }
);

const Stl = Shape.registerMethod2(
  'Stl',
  ['string', 'modes:wrap', 'options'],
  async (
    text,
    { wrap },
    {
      wrapAbsoluteAlpha,
      wrapAbsoluteOffset,
      wrapRelativeAlpha,
      wrapRelativeOffset,
      cornerThreshold = 20 / 360,
    } = {}
  ) => {
    return Shape.fromGeometry(
      await fromStl(new TextEncoder('utf8').encode(text), {
        format: 'ascii',
        wrapAlways: wrap,
        wrapAbsoluteAlpha,
        wrapAbsoluteOffset,
        wrapRelativeAlpha,
        wrapRelativeOffset,
        cornerThreshold,
      })
    );
  }
);

const stl = Shape.registerMethod2(
  'stl',
  ['input', 'string', 'function', 'options'],
  async (input, name, op = (_v) => (s) => s, options = {}) => {
    const { path } = getSourceLocation();
    let index = 0;
    for (const entry of await ensurePages(
      await Shape.apply(Shape.chain(input), op)
    )) {
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
    return input;
  }
);

/*
import {
  buildCorners,
  computeMiddle,
  computeScale,
  computeSides,
} from './Plan.js';

import Point from './Point.js';
import Shape from './Shape.js';
import Spiral from './Spiral.js';
import { absolute } from './absolute.js';

const toDiameterFromApothem = (apothem, sides = 32) =>
  apothem / Math.cos(Math.PI / sides);

const X = 0;
const Y = 1;
const Z = 2;

const reifyArc =
  (axis = Z) =>
  async ({ c1, c2, start = 0, end = 1, zag, sides }) => {
    while (start > end) {
      start -= 1;
    }

    const scale = computeScale(c1, c2);
    const middle = computeMiddle(c1, c2);

    const left = c1[X];
    const right = c2[X];

    const front = c1[Y];
    const back = c2[Y];

    const bottom = c1[Z];
    const top = c2[Z];

    const step = 1 / computeSides(c1, c2, sides, zag);
    const steps = Math.ceil((end - start) / step);
    const effectiveStep = (end - start) / steps;

    let spiral;

    if (end - start === 1) {
      spiral = Spiral((_t) => Point(0.5), {
        from: start - 1 / 4,
        upto: end - 1 / 4,
        by: effectiveStep,
      })
        .loop()
        .fill();
    } else {
      spiral = Spiral((_t) => Point(0.5), {
        from: start - 1 / 4,
        to: end - 1 / 4,
        by: effectiveStep,
      });
      if (
        (axis === X && left !== right) ||
        (axis === Y && front !== back) ||
        (axis === Z && top !== bottom)
      ) {
        spiral = spiral.loop().fill();
      }
    }

    switch (axis) {
      case X: {
        scale[X] = 1;
        spiral = spiral
          .ry(-1 / 4)
          .scale(scale)
          .move(middle);
        if (left !== right) {
          spiral = spiral.ex([left - middle[X], right - middle[X]]);
        }
        break;
      }
      case Y: {
        scale[Y] = 1;
        spiral = spiral
          .rx(-1 / 4)
          .scale(scale)
          .move(middle);
        if (front !== back) {
          spiral = spiral.ey([front - middle[Y], back - middle[Y]]);
        }
        break;
      }
      case Z: {
        scale[Z] = 1;
        spiral = spiral.scale(scale).move(middle);
        if (top !== bottom) {
          spiral = spiral.ez([top - middle[Z], bottom - middle[Z]]);
        }
        break;
      }
    }

    return absolute()(spiral);
  };

const reifyArcZ = reifyArc(Z);
const reifyArcX = reifyArc(X);
const reifyArcY = reifyArc(Y);

const ArcOp =
  (type) =>
  async (
    [x, y, z],
    { apothem, diameter, radius, start, end, sides, zag } = {}
  ) => {
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
    const result = await reify({ c1, c2, start, end, sides, zag });
    const geometry = await result.toGeometry();
    return geometry;
  };
*/

const Arc = Shape.registerMethod3(
  'Arc',
  ['intervals', 'options'],
  Arc$1
);
const ArcX = Shape.registerMethod3(
  'ArcX',
  ['intervals', 'options'],
  ArcX$1
);
const ArcY = Shape.registerMethod3(
  'ArcY',
  ['intervals', 'options'],
  ArcY$1
);
const ArcZ = Shape.registerMethod3(
  'ArcZ',
  ['intervals', 'options'],
  ArcZ$1
);

const Stroke = Shape.registerMethod2(
  'Stroke',
  ['input', 'shapes', 'number', 'options'],
  async (input, shapes, implicitWidth = 1, { width = implicitWidth } = {}) => {
    return Fuse(
      eachSegment(
        (s) => s.eachPoint((p) => Arc(width).to(p)).hull(),
        List
      )(await Group(input, ...shapes))
    );
  }
);

const stroke = Shape.registerMethod2(
  'stroke',
  ['input', 'rest'],
  (input, rest) => Stroke(input, ...rest)
);

const LoadSvg = Shape.registerMethod2(
  'LoadSvg',
  ['string', 'options'],
  async (path, { fill = true, stroke = true } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    if (data === undefined) {
      throw Error(`Cannot read svg from ${path}`);
    }
    return Shape.fromGeometry(
      await fromSvg(data, { doFill: fill, doStroke: stroke })
    );
  }
);

const Svg = Shape.registerMethod2(
  'Svg',
  ['string', 'options'],
  async (svg, { fill = true, stroke = true } = {}) => {
    const data = new TextEncoder('utf8').encode(svg);
    return Shape.fromGeometry(
      await fromSvg(data, { doFill: fill, doStroke: stroke })
    );
  }
);

const svg = Shape.registerMethod2(
  'svg',
  ['input', 'string', 'function', 'options'],
  async (input, name, op = (s) => s, options = {}) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    for (const entry of await ensurePages(op(input))) {
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
    return input;
  }
);

const table = Shape.registerMethod2(
  'table',
  ['input', 'number', 'number', 'strings'],
  async (input, rows, columns, cells) => {
    const uniqueId = generateUniqueId;
    const open = { open: { type: 'table', rows, columns, uniqueId } };
    emit({ open, hash: computeHash(open) });
    for (let cell of cells) {
      if (cell instanceof Function) {
        cell = cell(input);
      }
      if (typeof cell === 'string') {
        emitNote(cell);
      }
    }
    const close = { close: { type: 'table', rows, columns, uniqueId } };
    emit({ close, hash: computeHash(close) });
    return input;
  }
);

const tag = Shape.registerMethod3(
  'tag',
  ['inputGeometry', 'strings'],
  tag$1
);

const tags = Shape.registerMethod2(
  'tags',
  ['input', 'inputGeometry', 'string', 'function'],
  async (
    input,
    geometry,
    tag = '*',
    op = (...tags) => note(`tags: ${tags}`)
  ) => {
    const isMatchingTag = tagMatcher(tag, 'user');
    const collected = [];
    for (const { tags } of getLeafs(geometry)) {
      for (const tag of tags) {
        if (isMatchingTag(tag)) {
          collected.push(tag);
        }
      }
    }
    const result = op(...collected)(input);
    return result;
  }
);

// Tint adds another color to the mix.
const tint = Shape.registerMethod2(
  'tint',
  ['input', 'string'],
  (input, name) => tag(...toTagsFromName(name))(input)
);

const toCoordinates = Shape.registerMethod3(
  'toCoordinates',
  ['inputGeometry'],
  toCoordinates$1,
  (result) => result
);

const tool = Shape.registerMethod2(
  'tool',
  ['inputGeometry', 'string'],
  (geometry, name) =>
    Shape.fromGeometry(rewriteTags(toTagsFromName$1(name), [], geometry))
);

const toolpath = Shape.registerMethod2(
  'toolpath',
  [
    'inputGeometry',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'geometry',
  ],
  (
    geometry,
    toolSize = 2,
    resolution = toolSize,
    toolCutDepth = toolSize / 2,
    annealingMax,
    annealingMin,
    annealingDecay,
    target
  ) =>
    Shape.fromGeometry(
      computeToolpath(
        target,
        geometry,
        resolution,
        toolSize,
        toolCutDepth,
        annealingMax,
        annealingMin,
        annealingDecay
      )
    )
);

const twist = Shape.registerMethod2(
  'twist',
  ['input', 'number'],
  (input, turnsPerMm = 1) =>
    Shape.fromGeometry(twist$1(input.toGeometry(), turnsPerMm))
);

const upperEnvelope = Shape.registerMethod2(
  'upperEnvelope',
  ['inputGeometry'],
  (geometry) => Shape.fromGeometry(generateUpperEnvelope(geometry))
);

const unfold = Shape.registerMethod3('unfold', ['inputGeometry'], unfold$1);

const volume = Shape.registerMethod2(
  'volume',
  ['input', 'function'],
  async (input, op = (value) => (_shape) => value) =>
    op(measureVolume(await input.toGeometry()))(input)
);

const X$2 = 0;
const Y$2 = 1;
const Z$2 = 2;

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

const voxels = Shape.registerMethod2(
  'voxels',
  ['inputGeometry', 'number'],
  (geometry, resolution = 1) => {
    const offset = resolution / 2;
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
        for (let x = min[X$2] - offset; x <= max[X$2] + offset; x += resolution) {
          for (let y = min[Y$2] - offset; y <= max[Y$2] + offset; y += resolution) {
            for (
              let z = min[Z$2] - offset;
              z <= max[Z$2] + offset;
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

const Voxels = Shape.registerMethod2(
  'Voxels',
  ['coordinates'],
  async (coordinates) => {
    const offset = 0.5;
    const index = new Set();
    const key = (x, y, z) => `${x},${y},${z}`;
    let max = [-Infinity, -Infinity, -Infinity];
    let min = [Infinity, Infinity, Infinity];
    for (const [x, y, z] of coordinates) {
      index.add(key(x, y, z));
      max[X$2] = Math.max(x + 1, max[X$2]);
      max[Y$2] = Math.max(y + 1, max[Y$2]);
      max[Z$2] = Math.max(z + 1, max[Z$2]);
      min[X$2] = Math.min(x - 1, min[X$2]);
      min[Y$2] = Math.min(y - 1, min[Y$2]);
      min[Z$2] = Math.min(z - 1, min[Z$2]);
    }
    const isInteriorPoint = (x, y, z) => index.has(key(x, y, z));
    const polygons = [];
    for (let x = min[X$2]; x <= max[X$2]; x++) {
      for (let y = min[Y$2]; y <= max[Y$2]; y++) {
        for (let z = min[Z$2]; z <= max[Z$2]; z++) {
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

const Wrap = Shape.registerMethod2(
  'Wrap',
  ['input', 'number', 'number', 'geometries'],
  async (input, offset = 1, alpha = 0.1, geometries) =>
    Shape.fromGeometry(wrap$1(geometries, offset, alpha)).setTags(
      ...(await input.getTags())
    )
);

const wrap = Shape.registerMethod2(
  'wrap',
  ['input', 'rest'],
  (input, rest) => Wrap(input, ...rest)(input)
);

const x = Shape.registerMethod2(
  'x',
  ['input', 'numbers'],
  async (input, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(await move([offset, 0, 0])(input));
    }
    return Group(...moved);
  }
);

const y = Shape.registerMethod2(
  'y',
  ['input', 'numbers'],
  async (input, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(await move([0, offset, 0])(input));
    }
    return Group(...moved);
  }
);

const z = Shape.registerMethod2(
  'z',
  ['input', 'numbers'],
  async (input, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(await move([0, 0, offset])(input));
    }
    return Group(...moved);
  }
);

const X$1 = 0;
const Y$1 = 1;
const Z$1 = 2;

const computeScale = (
  [ax = 0, ay = 0, az = 0],
  [bx = 0, by = 0, bz = 0]
) => [ax - bx, ay - by, az - bz];

const computeMiddle = (c1, c2) => [
  (c1[X$1] + c2[X$1]) * 0.5,
  (c1[Y$1] + c2[Y$1]) * 0.5,
  (c1[Z$1] + c2[Z$1]) * 0.5,
];

const zagSides = Shape.registerMethod2(
  'zagSides',
  ['number', 'number'],
  (diameter = 1, zag$1 = 0.01) => zag(diameter, zag$1)
);
const zagSteps = Shape.registerMethod2(
  'zagSteps',
  ['number', 'number'],
  (diameter = 1, zag$1 = 0.25) => 1 / zag(diameter, zag$1)
);

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

const buildCorners = (x, y, z) => async () => {
  const c1 = [0, 0, 0];
  const c2 = [0, 0, 0];
  if (x instanceof Array) {
    while (x.length < 2) {
      x.push(0);
    }
    if (x[0] < x[1]) {
      c1[X$1] = x[1];
      c2[X$1] = x[0];
    } else {
      c1[X$1] = x[0];
      c2[X$1] = x[1];
    }
  } else {
    c1[X$1] = x / 2;
    c2[X$1] = x / -2;
  }
  if (y instanceof Array) {
    while (y.length < 2) {
      y.push(0);
    }
    if (y[0] < y[1]) {
      c1[Y$1] = y[1];
      c2[Y$1] = y[0];
    } else {
      c1[Y$1] = y[0];
      c2[Y$1] = y[1];
    }
  } else {
    c1[Y$1] = y / 2;
    c2[Y$1] = y / -2;
  }
  if (z instanceof Array) {
    while (z.length < 2) {
      z.push(0);
    }
    if (z[0] < z[1]) {
      c1[Z$1] = z[1];
      c2[Z$1] = z[0];
    } else {
      c1[Z$1] = z[0];
      c2[Z$1] = z[1];
    }
  } else {
    c1[Z$1] = z / 2;
    c2[Z$1] = z / -2;
  }
  return [c1, c2];
};

const Plan = (type) => Shape.fromGeometry(taggedPlan({}, { type }));

const Assembly = Shape.registerMethod3(
  'Assembly',
  ['geometries', 'modes:backward,exact'],
  Disjoint
);

// This generates anonymous shape methods.
const Cached = (name, op) =>
  Shape.registerMethod3(
    [],
    ['rest'],
    () => undefined,
    async (_result, [args]) => {
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
    }
  );

const Edge = Shape.registerMethod3(
  'Edge',
  ['coordinate', 'coordinate', 'coordinate'],
  Edge$1
);

const Polygon = Shape.registerMethod2(
  ['Face', 'Polygon'],
  ['coordinates'],
  (coordinates) => Shape.chain(Shape.fromPolygons([{ points: coordinates }]))
);

const Face = Polygon;

const Geometry = Shape.registerMethod2(
  'Geometry',
  ['rest'],
  ([geometry]) => Shape.chain(Shape.fromGeometry(geometry))
);

const Hexagon = Shape.registerMethod2(
  'Hexagon',
  ['interval', 'interval', 'interval'],
  (x, y, z) => Arc(x, y, z, { sides: 6 })
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

const Icosahedron = Shape.registerMethod2(
  'Icosahedron',
  ['input', 'interval', 'interval', 'interval'],
  async (input, x = 1, y = x, z = x) => {
    const [c1, c2] = await buildCorners(x, y, z)(input);
    return reifyIcosahedron(c1, c2);
  }
);

const Implicit = Shape.registerMethod2(
  'Implicit',
  ['number', 'function', 'options'],
  (
    radius = 1,
    op,
    {
      angularBound = 30,
      radiusBound = 0.1,
      distanceBound = 0.1,
      errorBound = 0.001,
    } = {}
  ) =>
    Shape.fromGeometry(
      computeImplicitVolume(
        op,
        radius,
        angularBound,
        radiusBound,
        distanceBound,
        errorBound
      )
    )
);

const Line = Shape.registerMethod2(
  ['Line', 'LineX'],
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge(Point(begin), Point(end)));
    }
    return Group(...edges);
  }
);

const LineX = Line;

const LineY = Shape.registerMethod2(
  'LineY',
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge(Point(0, begin), Point(0, end)));
    }
    return Group(...edges);
  }
);

const LineZ = Shape.registerMethod2(
  'LineZ',
  ['intervals'],
  (intervals) => {
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

const LoadPng = Shape.registerMethod2(
  'LoadPng',
  ['string', 'numbers'],
  async (path, bands) => {
    if (bands.length === 0) {
      bands = [128, 256];
    }
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

const Octagon = Shape.registerMethod2(
  'Octagon',
  ['input', 'interval', 'interval', 'interval'],
  (input, x, y, z) => Arc(x, y, z, { sides: 8 })(input)
);

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;
const X = 0;
const Y = 1;
const Z = 2;

const makeUnitSphere = Cached('orb', (tolerance) =>
  Geometry(makeUnitSphere$1(/* angularBound= */ 30, tolerance, tolerance))
);

const Orb = Shape.registerMethod2(
  'Orb',
  ['input', 'modes:occt', 'intervals', 'options'],
  async (
    input,
    { occt },
    [x = 1, y = x, z = x],
    { zag = DEFAULT_ORB_ZAG } = {}
  ) => {
    const [c1, c2] = await buildCorners(x, y, z)(input);
    const scale = computeScale(c1, c2).map((v) => v * 0.5);
    const middle = computeMiddle(c1, c2);
    const radius = Math.max(...scale);
    const tolerance = zag / radius;
    if (scale[X] === scale[Y] && scale[Y] === scale[Z] && occt) {
      // Occt can't handle non-uniform scaling at present.
      return Geometry(makeOcctSphere(scale[X])).move(middle);
    } else {
      return makeUnitSphere(tolerance).scale(scale).move(middle).absolute();
    }
  }
);

const Pentagon = Shape.registerMethod2(
  'Pentagon',
  ['input', 'interval', 'interval', 'interval'],
  (input, x, y, z) => Arc(x, y, z, { sides: 5 })(input)
);

const Points = Shape.registerMethod2(
  'Points',
  ['coordinateLists', 'coordinates'],
  (coordinateLists = [], coordinates = []) => {
    const coords = [];
    for (const coordinateList of coordinateLists) {
      for (const coordinate of coordinateList) {
        coords.push(coordinate);
      }
    }
    for (const coordinate of coordinates) {
      coords.push(coordinate);
    }
    return Shape.fromPoints(coords);
  }
);

const Polyhedron = Shape.registerMethod2(
  'Polyhedron',
  ['coordinateLists'],
  (coordinateLists) => {
    const out = [];
    for (const coordinates of coordinateLists) {
      out.push({ points: coordinates });
    }
    return Shape.fromPolygons(out);
  }
);

const Segments = Shape.registerMethod2(
  'Segments',
  ['segments'],
  (segments) => Shape.fromSegments(segments)
);

const Spiral = Shape.registerMethod2(
  'Spiral',
  ['function', 'options'],
  async (particle = Point, options) => {
    let particles = [];
    const turns = await Seq(
      options,
      (distance) => (_shape) => distance,
      (...numbers) => numbers
    );
    for (const turn of turns) {
      particles.push(await particle(turn).rz(turn));
    }
    const result = await Link(...particles);
    return result;
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

const Triangle = Shape.registerMethod2(
  'Triangle',
  ['input', 'interval', 'interval', 'interval'],
  (input, x, y, z) => Arc(x, y, z, { sides: 3 })(input)
);

const Wave = Shape.registerMethod2(
  'Wave',
  ['input', 'function', 'options'],
  async (input, particle = Point, options) => {
    let particles = [];
    for (const xDistance of await seq(
      options,
      (distance) => (_shape) => distance,
      (...numbers) => numbers
    )(input)) {
      particles.push(particle(xDistance).x(xDistance));
    }
    return Link(...particles)(input);
  }
);

export { And, Arc, ArcX, ArcY, ArcZ, Assembly, Box, Cached, ChainHull, Clip, Curve, Cut, Edge, Empty, Face, Fuse, Geometry, GrblConstantLaser, GrblDynamicLaser, GrblPlotter, GrblSpindle, Group, Hershey, Hexagon, Hull, Icosahedron, Implicit, Join, Line, LineX, LineY, LineZ, Link, List, LoadPng, LoadStl, LoadSvg, Loft, Loop, Note, Octagon, Orb, Page, Pentagon, Plan, Point, Points, Polygon, Polyhedron, RX, RY, RZ, Ref, Segments, Seq, Shape, Spiral, Stl, Stroke, SurfaceMesh, Svg, Triangle, Voxels, Wave, Wrap, X$7 as X, XY, XZ, Y$7 as Y, YX, YZ, Z$6 as Z, ZX, ZY, absolute, abstract, addTo, align, alignment, and, approximate, area, as, asPart, at, bb, bend, billOfMaterials, by, centroid, chainHull, clean, clip, clipFrom, color, commonVolume, copy, curve, cut, cutFrom, cutOut, defRgbColor, defThreejsMaterial, defTool, define, deform, demesh, diameter, dilateXY, disjoint, drop, e, each, eachEdge, eachPoint, eachSegment, eagerTransform, edges, ensurePages, ex, extrudeAlong, extrudeX, extrudeY, extrudeZ, ey, ez, faces, fill, fit, fitTo, fix, flat, fuse, g, gap, gcode, get, getAll, getNot, getTag, getTags, ghost, gn, gridView, grow, hold, hull, image, inFn, input, inset, involute, join, link, list, load, loadGeometry, loft, log, loop, lowerEnvelope, m, mark, masked, masking, material, md, move, moveAlong, n, noGap, noOp, noVoid, normal, note, nth, o, ofPlan, offset, on, op, orient, origin, outline, overlay, pack, page, pdf, plus, points$1 as points, put, ref, remesh, rotateX, rotateY, rotateZ, runLength, rx, ry, rz, s, save, saveGeometry, scale$1 as scale, scaleToFit, scaleX, scaleY, scaleZ, seam, section, sectionProfile, self, separate, seq, serialize, setTag, setTags, shadow, shell, simplify, size, sketch, smooth, sort, stl, stroke, svg, sx, sy, sz, table, tag, tags, testMode, times, tint, to, toCoordinates, toDisplayGeometry, toGeometry, tool, toolpath, transform, twist, unfold, untag, upperEnvelope, view, voidFn, volume, voxels, wrap, x, xyz, y, z, zagSides, zagSteps };
