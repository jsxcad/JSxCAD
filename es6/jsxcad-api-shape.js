import { getSourceLocation, startTime, endTime, emit, computeHash, generateUniqueId, write, isNode, read, logInfo } from './jsxcad-sys.js';
export { elapsed, emit, read, write } from './jsxcad-sys.js';
import * as g$1 from './jsxcad-geometry.js';
import { taggedGroup, taggedGraph, taggedSegments, taggedPoints, fromPolygonSoup, isSeqSpec, seq as seq$1, abstract as abstract$1, approximate as approximate$1, makeAbsolute, and as and$1, joinTo, align as align$1, alignment as alignment$1, measureArea, As as As$1, as as as$1, AsPart as AsPart$1, asPart as asPart$1, And as And$1, at as at$1, base as base$1, bb as bb$1, bend as bend$1, note as note$1, emitNote, tags as tags$1, by as by$1, computeCentroid, ChainConvexHull, chainConvexHull, noGhost, clip as clip$1, clipFrom as clipFrom$1, samplePointCloud, retag, commonVolume as commonVolume$1, copy as copy$1, Curve as Curve$1, curve as curve$1, cut as cut$1, cutFrom as cutFrom$1, cutOut as cutOut$1, deform as deform$1, demesh as demesh$1, computeGeneralizedDiameter, dilateXY as dilateXY$1, disjoint as disjoint$1, drop as drop$1, toDisplayGeometry as toDisplayGeometry$1, ensurePages, each as each$1, toOrientedFaceEdgesList, toPointList, toSegmentList, eagerTransform as eagerTransform$1, exterior as exterior$1, extrudeAlongX, extrudeAlongY, extrudeAlongZ, extrudeAlong as extrudeAlong$1, extrudeAlongNormal, toFaceEdgesList, fair as fair$1, fill as fill$1, fit as fit$1, fitTo as fitTo$1, fix as fix$1, flat as flat$1, origin as origin$1, Fuse as Fuse$1, join as join$1, fuse as fuse$1, getList, gap as gap$1, Gauge, gauge as gauge$1, getAllList, getValue, ghost as ghost$1, getNotList, grow as grow$1, hold as hold$1, separate as separate$1, ConvexHull, convexHull, inItem, inset as inset$1, involute as involute$1, Iron as Iron$1, iron as iron$1, Link as Link$1, Points as Points$1, link as link$1, load as load$1, read as read$1, loft as loft$1, log as log$1, Loop as Loop$1, loop as loop$1, generateLowerEnvelope, computeOrientedBoundingBox, maskedBy as maskedBy$1, masking as masking$1, hasMaterial, minimizeOverhang as minimizeOverhang$1, translate, Group as Group$1, moveAlong as moveAlong$1, moveAlongNormal, computeNormal, on as on$1, get as get$1, Empty as Empty$1, nth as nth$1, obb as obb$1, offset as offset$1, onPre, onPost, outline as outline$1, orient as orient$1, hasShowOverlay, pack as pack$1, computeReliefFromImage, render, toPoints, ref as ref$1, Ref as Ref$1, repair as repair$1, reconstruct as reconstruct$1, refine as refine$1, remesh as remesh$1, rotateXs, rotateYs, rotateZs, Route as Route$1, linearize, store, write as write$1, scale as scale$2, scaleToFit as scaleToFit$1, seam as seam$1, section as section$1, serialize as serialize$1, rewriteTags, cast, shell as shell$1, simplify as simplify$1, measureBoundingBox, ComputeSkeleton, computeSkeleton, taggedSketch, smooth as smooth$1, getLeafs, tag as tag$1, tagMatcher, to as to$1, toCoordinates as toCoordinates$1, computeToolpath, transform as transform$1, trim as trim$1, turnXs, turnYs, turnZs, twist as twist$1, untag as untag$1, generateUpperEnvelope, unfold as unfold$1, measureVolume, toVoxelsFromGeometry, toVoxelsFromCoordinates, Wrap as Wrap$1, wrap as wrap$1, validate as validate$1, Arc as Arc$1, ArcX as ArcX$1, ArcY as ArcY$1, ArcZ as ArcZ$1, Disjoint, Box as Box$1, Edge as Edge$1, Hershey as Hershey$1, Hexagon as Hexagon$1, Icosahedron as Icosahedron$1, computeImplicitVolume, Label as Label$1, Octagon as Octagon$1, Orb as Orb$1, Pentagon as Pentagon$1, Point as Point$1, Segments as Segments$1, rotateZ as rotateZ$1, hash, Triangle as Triangle$1 } from './jsxcad-geometry.js';
import { toTagsFromName } from './jsxcad-algorithm-color.js';
import { fromDxf, toDxf } from './jsxcad-convert-dxf.js';
import { dataUrl } from './jsxcad-ui-threejs.js';
import { toGcode } from './jsxcad-convert-gcode.js';
import { toPdf } from './jsxcad-convert-pdf.js';
import { toPng, fromPng } from './jsxcad-convert-png.js';
import { fromRaster } from './jsxcad-algorithm-contour.js';
import { renderPng } from './jsxcad-convert-threejs.js';
import { fromStl, toStl } from './jsxcad-convert-stl.js';
import { fromSvg, toSvg } from './jsxcad-convert-svg.js';
import { toTagsFromName as toTagsFromName$1 } from './jsxcad-algorithm-tool.js';
import { fromLDraw, fromLDrawPart } from './jsxcad-convert-ldraw.js';
import { fromOff } from './jsxcad-convert-off.js';

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

const isGroupShape = (value) =>
  isShape(value) && value.geometry.type === 'group';
Shape.isGroupShape = isGroupShape;

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
  input = Shape.chain(input);
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

const applyGeometryToValue = async (geometry, op, ...args) =>
  Shape.apply(Shape.fromGeometry(geometry), op, ...args);

const applyGeometryToGeometry = async (geometry, op, ...args) => {
  const result = await Shape.apply(Shape.fromGeometry(geometry), op, ...args);
  try {
    return result.geometry;
  } catch (e) {
    console.log(
      `QQ/applyGeometryToGeometry: ${JSON.stringify(result)} op=${op}`
    );
    throw e;
  }
};

Shape.applyToGeometry = applyGeometryToGeometry;
Shape.applyGeometryToGeometry = applyGeometryToGeometry;
Shape.applyGeometryToValue = applyGeometryToValue;

const registerMethod = (names, op) => {
  if (typeof names === 'string') {
    names = [names];
  }

  let path;
  const sourceLocation = getSourceLocation();
  if (sourceLocation) {
    path = sourceLocation.path;
  }

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
  postOp = (geometry) => Shape.fromGeometry(geometry),
  preOp = (...args) => args
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
        // console.log(`QQ/method3/preOp: ${names} shape=${shape} args=${args}`);
        const processedParameters = await preOp(...parameters);
        // console.log(`QQ/method3/op: ${names} shape=${shape} args=${args}`);
        const r1 = await op(...processedParameters);
        // console.log(`QQ/method3/postOp: ${names} shape=${shape} args=${args}`);
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

// export const registerMethod3Pre = (names, signature, preOp, op, postOp) => registerMethod3(names, signature, op, postOp, preOp);
// Shape.registerMethod3Pre = registerMethod3Pre;

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
Shape.fromPolygons = (polygons) => fromGeometry(fromPolygonSoup(polygons));

Shape.registerMethod = registerMethod;

Shape.chainable = chainable;
Shape.ops = ops;

const fromGeometry = Shape.fromGeometry;

const resolve = async (
  input,
  value,
  specOptions = {},
  { flattenGroups = false } = {}
) => {
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
  } else if (flattenGroups && Shape.isGroupShape(value)) {
    const flattenedElements = [];
    const walk = (elements) => {
      for (const element of elements) {
        if (element.type === 'group') {
          walk(element.content);
        } else {
          flattenedElements.push(Shape.fromGeometry(element));
        }
      }
    };
    const geometry = await value.toGeometry();
    walk(geometry.content);
    return flattenedElements;
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
    const hasSpecOptions = specOptionText !== undefined;
    if (hasSpecOptions) {
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
          throw Error(`Error: malformedGeometry`);
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
        const specs = [];
        for (const arg of args) {
          let value = await resolve(input, arg, specOptions);
          if (Shape.isNumber(value)) {
            out.push(value);
          } else if (isSeqSpec(value)) {
            specs.push(value);
          } else {
            rest.push(arg);
          }
        }
        output.push(out);
        if (specs.length > 0) {
          out.push(...seq$1(...specs).map(([value]) => value));
        }
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
          if (result === undefined) {
            let value = await resolve(input, arg, specOptions);
            if (Shape.isShape(value)) {
              result = await value.toGeometry();
              if (!Shape.isGeometry(result)) {
                throw Error('die');
              }
              continue;
            }
          }
          rest.push(arg);
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
          if (
            typeof arg === 'string' &&
            (!hasSpecOptions || specOptions[arg] === true)
          ) {
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
          let value = await resolve(input, arg, specOptions, {
            flattenGroups: true,
          });
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

const X$1 = Shape.registerMethod3('X', ['numbers'], g$1.X);
const Y$1 = Shape.registerMethod3('Y', ['numbers'], g$1.Y);
const Z$1 = Shape.registerMethod3('Z', ['numbers'], g$1.Z);
const XY = Shape.registerMethod3('XY', ['numbers'], g$1.XY);
const YX = Shape.registerMethod3('YX', ['numbers'], g$1.YX);
const XZ = Shape.registerMethod3('XZ', ['numbers'], g$1.XZ);
const ZX = Shape.registerMethod3('ZX', ['numbers'], g$1.ZX);
const YZ = Shape.registerMethod3('YZ', ['numbers'], g$1.YZ);
const ZY = Shape.registerMethod3('ZY', ['numbers'], g$1.ZY);
const RX = Shape.registerMethod3('RX', ['numbers'], g$1.RX);
const RY = Shape.registerMethod3('RY', ['numbers'], g$1.RY);
const RZ = Shape.registerMethod3('RZ', ['numbers'], g$1.RZ);

const abstract = Shape.registerMethod3(
  'abstract',
  ['inputGeometry', 'strings'],
  abstract$1
);

// These should probably be polymorphic and handle vector operations, etc.

const acos = Shape.registerMethod3(
  'acos',
  ['number'],
  (number) => Math.acos(number) / (Math.PI * 2),
  (value) => value
);

const cos = Shape.registerMethod3(
  'cos',
  ['number'],
  (number) => Math.cos(number * Math.PI * 2),
  (value) => value
);

const lerp = Shape.registerMethod3(
  'lerp',
  ['number', 'number', 'number'],
  (min, max, position) => position * (max - min) + min,
  (value) => value
);

const max = Shape.registerMethod3(
  'max',
  ['numbers'],
  (numbers) => Math.max(...numbers),
  (value) => value
);

const min = Shape.registerMethod3(
  'min',
  ['numbers'],
  (numbers) => Math.min(...numbers),
  (value) => value
);

// e.g., a.x(plus(diameter(), -2))
const plus = Shape.registerMethod3(
  'plus',
  ['numbers'],
  (numbers) => numbers.reduce((a, b) => a + b, 0),
  (value) => value
);

// e.g., a.x(times(diameter(), 1/2))
const times = Shape.registerMethod3(
  'times',
  ['numbers'],
  (numbers) => numbers.reduce((a, b) => a * b, 1),
  (value) => value
);

const sin = Shape.registerMethod3(
  'sin',
  ['number'],
  (number) => Math.sin(number * Math.PI * 2),
  (value) => value
);

const sqrt = Shape.registerMethod3(
  'sqrt',
  ['number'],
  (number) => Math.sqrt(number),
  (value) => value
);

const approximate = Shape.registerMethod3(
  'approximate',
  ['inputGeometry', 'number', 'number'],
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

const As = Shape.registerMethod3('As', ['strings', 'geometries'], As$1);

const as = Shape.registerMethod3(
  'as',
  ['inputGeometry', 'strings', 'geometries'],
  as$1
);

// Constructs an item, as a part, from the designator.
const AsPart = Shape.registerMethod3(
  'AsPart',
  ['strings', 'geometries'],
  AsPart$1
);

// Constructs an item, as a part, from the designator.
const asPart = Shape.registerMethod3(
  'asPart',
  ['inputGeometry', 'strings', 'geometries'],
  asPart$1
);

const Group = Shape.registerMethod3('Group', ['geometries'], And$1);

const op = Shape.registerMethod3(
  'op',
  ['inputGeometry', 'functions'],
  (geometry) => geometry,
  async (geometry, [_, functions]) => {
    const input = Shape.chain(Shape.fromGeometry(geometry));
    const results = [];
    for (const fun of functions) {
      results.push(await Shape.apply(input, fun, input));
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

const base = Shape.registerMethod3(['base'], ['inputGeometry'], base$1);

const bb = Shape.registerMethod3(
  ['bb', 'boundingBox'],
  ['inputGeometry', 'number', 'number', 'number'],
  bb$1
);

const bend = Shape.registerMethod3(
  'bend',
  ['inputGeometry', 'number', 'number'],
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
  ['geometries', 'modes:close'],
  ChainConvexHull
);

const chainHull = Shape.registerMethod3(
  'chainHull',
  ['inputGeometry', 'geometries', 'modes:close'],
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

const cloud = Shape.registerMethod3(
  'cloud',
  ['inputGeometry', 'geometries', 'number'],
  (geometry, geometries, resolution) =>
    samplePointCloud([geometry, ...geometries], resolution)
);

const Cloud = Shape.registerMethod3(
  'Cloud',
  ['geometries', 'number'],
  samplePointCloud
);

const color = Shape.registerMethod3(
  'color',
  ['inputGeometry', 'string'],
  (geometry, name) => retag(geometry, ['color:*'], toTagsFromName(name))
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
  ['cutOut', 'split'],
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

const split = cutOut;

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
  ['inputGeometry', 'modes:exact'],
  disjoint$1
);

const drop = Shape.registerMethod3(
  'drop',
  ['inputGeometry', 'geometry'],
  drop$1
);

const MODES =
  'modes:grid,none,side,top,wireframe,noWireframe,skin,noSkin,outline,noOutline';

const applyModes = (geometry, options, modes) => {
  const tags = [];
  if (modes.wireframe) {
    tags.push('show:wireframe');
  }
  if (modes.noWireframe) {
    tags.push('show:noWireframe');
  }
  if (modes.skin) {
    tags.push('show:skin');
  }
  if (modes.noSkin) {
    tags.push('show:noSkin');
  }
  if (modes.outline) {
    tags.push('show:outline');
  }
  if (modes.noOutline) {
    tags.push('show:noOutline');
  }
  return retag(geometry, [], tags);
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
const baseViewOp = async (
  geometry,
  name,
  op = (_x) => (s) => s,
  {
    download,
    downloadOp,
    size = 256,
    inline,
    width,
    height,
    position = [100, -100, 100],
  } = {}
) => {
  if (size !== undefined) {
    width = size;
    height = size;
  }
  const viewGeometry = await Shape.applyToGeometry(geometry, op);
  const sourceLocation = getSourceLocation();
  if (!sourceLocation) {
    console.log('No sourceLocation');
  }
  const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
  const displayGeometry = toDisplayGeometry$1(viewGeometry);
  for (const pageGeometry of [displayGeometry]) {
    const viewPath = `view/${path}/${id}/${viewId}.view`;
    const hash = generateUniqueId();
    const thumbnailPath = `thumbnail/${path}/${id}/${viewId}.thumbnail`;
    const view = {
      name,
      viewId,
      width,
      height,
      position,
      inline,
      needsThumbnail: isNode,
      thumbnailPath,
      download,
    };
    if (downloadOp) {
      view.download = await downloadOp(pageGeometry, {
        view,
        id,
        path,
      });
    }
    emit({ hash, path: viewPath, view });
    await write(viewPath, pageGeometry);
    if (!isNode) {
      // FIX: dataUrl should operate on geometry.
      await write(
        thumbnailPath,
        dataUrl(Shape.fromGeometry(viewGeometry), view)
      );
    }
  }
  return geometry;
};

const topViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    downloadOp,
    size = 256,
    skin = true,
    outline = true,
    wireframe = true,
    width,
    height,
    position = [0, 0, 100],
  } = {},
  viewId
) => {
  const options = {
    download,
    downloadOp,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

Shape.registerMethod3(
  'topView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  topViewOp
);

const gridViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    downloadOp,
    size = 256,
    skin = true,
    outline = true,
    wireframe = false,
    width,
    height,
    position = [0, 0, 100],
  } = {},
  viewId
) => {
  const options = {
    download,
    downloadOp,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

const gridView = Shape.registerMethod3(
  'gridView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  gridViewOp
);

const frontViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    downloadOp,
    size = 256,
    skin = true,
    outline = true,
    wireframe = false,
    width,
    height,
    position = [0, -100, 0],
  } = {},
  viewId
) => {
  const options = {
    download,
    downloadOp,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

Shape.registerMethod3(
  'frontView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  frontViewOp
);

const sideViewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  {
    download,
    downloadOp,
    size = 256,
    skin = true,
    outline = true,
    wireframe = false,
    width,
    height,
    position = [100, 0, 0],
  } = {},
  viewId
) => {
  const options = {
    download,
    downloadOp,
    size,
    skin,
    outline,
    wireframe,
    width,
    height,
    position,
  };
  return baseViewOp(applyModes(geometry, options, modes), viewId, op, options);
};

Shape.registerMethod3(
  'sideView',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  sideViewOp
);

const viewOp = (
  geometry,
  modes,
  op = (_x) => (s) => s,
  options,
  viewId
) => {
  geometry = applyModes(geometry, options, modes);
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
      return gridViewOp(geometry, modes, op, options, viewId);
    case 'none':
      return geometry;
    case 'side':
      return sideViewOp(geometry, modes, op, options, viewId);
    case 'top':
      return topViewOp(geometry, modes, op, options, viewId);
    default:
      return baseViewOp(geometry, viewId, op, options);
  }
};

const view = Shape.registerMethod3(
  'view',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  viewOp
);

const LoadDxf = Shape.registerMethod3(
  'LoadDxf',
  ['string', 'options'],
  async (path) => {
    let data = await read(`source/${path}`, { doSerialize: false });
    if (data === undefined) {
      data = await read(`cache/${path}`, { sources: [path] });
    }
    return fromDxf(data);
  }
);

const dxf = Shape.registerMethod3(
  'dxf',
  ['inputGeometry', 'string', 'function', 'options'],
  async (geometry, name, op = (_v) => (s) => s, options = {}) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const dxfPath = `download/dxf/${path}/${id}/${viewId}`;
      await write(dxfPath, await toDxf(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const record = {
        path: dxfPath,
        filename: `${name}${suffix}.dxf`,
        type: 'application/dxf',
      };
      await gridView(name, {
        ...options.view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);

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

const exterior = Shape.registerMethod3(
  'exterior',
  ['inputGeometry'],
  exterior$1
);

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

const fair = Shape.registerMethod3(
  'fair',
  ['inputGeometry', 'geometries', 'number', 'options'],
  (
    geometry,
    selections,
    implicitResolution,
    {
      numberOfIterations,
      remeshIterations,
      remeshRelaxationSteps,
      resolution = implicitResolution,
    } = {}
  ) =>
    fair$1(geometry, selections, {
      numberOfIterations,
      remeshIterations,
      remeshRelaxationSteps,
      resolution,
    })
);

const fill = Shape.registerMethod3(
  ['fill', 'f'],
  ['inputGeometry', 'modes:holes'],
  fill$1
);

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

const fix = Shape.registerMethod3('fix', ['inputGeometry'], fix$1);

const flat = Shape.registerMethod3(
  'flat',
  ['inputGeometry', 'geometry'],
  flat$1
);

const gcode = Shape.registerMethod3(
  'gcode',
  ['inputGeometry', 'string', 'function', 'options'],
  async (
    geometry,
    name,
    op = (_v) => (s) => s,
    { speed = 0, feedrate = 0, jumpHeight = 1, view = {} } = {}
  ) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const gcodePath = `download/gcode/${path}/${id}/${viewId}`;
      await write(
        gcodePath,
        await toGcode(entry, { speed, feedrate, jumpHeight })
      );
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.gcode`;
      const record = {
        path: gcodePath,
        filename,
        type: 'application/x+gcode',
      };
      await gridView(name, {
        ...view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);

const origin = Shape.registerMethod3(
  ['origin', 'o'],
  ['inputGeometry'],
  origin$1
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
  ['inputGeometry', 'strings', 'modes:inItem,not,pass', 'function'],
  getList,
  async (results, [geometry, _tags, _mode, groupOp = Group]) => {
    const input = Shape.fromGeometry(geometry);
    const leafShapes = [];
    for (const result of results) {
      leafShapes.push(Shape.fromGeometry(result));
    }
    return Shape.apply(input, groupOp, ...leafShapes);
  }
);

const g = get;

const gap = Shape.registerMethod3(
  ['gap', 'void'],
  ['inputGeometry'],
  gap$1
);

const voidFn = gap;

Shape.registerMethod3(
  'Gauge',
  ['inputGeometry', 'geometries', 'number', 'number', 'string'],
  Gauge
);

const gauge = Shape.registerMethod3(
  'gauge',
  ['inputGeometry', 'geometries', 'number', 'number', 'string'],
  gauge$1
);

// get, ignoring item boundaries.

const getAll = Shape.registerMethod3(
  'getAll',
  ['inputGeometry', 'strings', 'function'],
  getAllList,
  async (results, [geometry, _tags, groupOp = Group]) => {
    const input = Shape.fromGeometry(geometry);
    const leafShapes = [];
    for (const result of results) {
      leafShapes.push(Shape.fromGeometry(result));
    }
    return Shape.apply(input, groupOp, ...leafShapes);
  }
);

const getTag = Shape.registerMethod3(
  ['getTag', 'getValue'],
  ['inputGeometry', 'strings', 'function'],
  getValue,
  (values, [input, _tags, valuesOp = (value) => (_shape) => value]) =>
    Shape.apply(input, valuesOp, ...values)
);

const ghost = Shape.registerMethod3('ghost', ['inputGeometry'], ghost$1);

const getNot = Shape.registerMethod3(
  ['getNot', 'gn'],
  ['inputGeometry', 'strings'],
  getNotList,
  async (results, [geometry, _tags, groupOp = Group]) => {
    const input = Shape.fromGeometry(geometry);
    const leafShapes = [];
    for (const result of results) {
      leafShapes.push(Shape.fromGeometry(result));
    }
    return Shape.apply(input, groupOp, ...leafShapes);
  }
);

const gn = getNot;

const Grow = Shape.registerMethod3('Grow', ['geometry', 'geometry'], grow$1);

const grow = Shape.registerMethod3(
  'grow',
  ['inputGeometry', 'geometry'],
  grow$1
);

const hold = Shape.registerMethod3(
  'hold',
  ['inputGeometry', 'geometries'],
  hold$1
);

const holes = Shape.registerMethod3(
  'holes',
  ['inputGeometry'],
  (geometry) => separate$1(geometry, { noShapes: true, holesAsShapes: true })
);

const Hull = Shape.registerMethod3('Hull', ['geometries'], ConvexHull);

const hull = Shape.registerMethod3(
  'hull',
  ['inputGeometry', 'geometries'],
  convexHull
);

const image = Shape.registerMethod3(
  'image',
  ['inputGeometry', 'string'],
  (geometry, url) => retag(geometry, ['image:*'], [`image:${url}`])
);

const inFn = Shape.registerMethod3('in', ['inputGeometry'], inItem);

const inset = Shape.registerMethod3(
  'inset',
  ['inputGeometry', 'number', 'options'],
  inset$1
);

const involute = Shape.registerMethod3(
  'involute',
  ['inputGeometry'],
  involute$1
);

const Iron = Shape.registerMethod3('Iron', ['geometries', 'number'], Iron$1);

const iron = Shape.registerMethod3(
  'iron',
  ['inputGeometry', 'number', 'geometries'],
  iron$1
);

const Link = Shape.registerMethod3(
  'Link',
  ['geometries', 'coordinates', 'modes:close,reverse'],
  (geometries, coordinates, modes) =>
    Link$1([...geometries, Points$1(coordinates)], modes)
);

const link = Shape.registerMethod3(
  'link',
  ['inputGeometry', 'geometries', 'coordinates', 'modes:close,reverse'],
  (geometry, geometries, coordinates, modes) =>
    link$1(geometry, [...geometries, Points$1(coordinates)], modes)
);

const List = (...values) => values;

const list = Shape.registerMethod3(
  'list',
  ['values'],
  (values) => values,
  (values) => values
);

Shape.List = List;

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

const log = Shape.registerMethod3(
  'log',
  ['inputGeometry', 'string'],
  log$1
);

const Loop = Shape.registerMethod3(
  'Loop',
  ['geometries', 'coordinates', 'modes:close'],
  (geometries, coordinates, modes) =>
    Loop$1([...geometries, Points$1(coordinates)], modes)
);

const loop = Shape.registerMethod3(
  'loop',
  ['inputGeometry', 'geometries', 'coordinates', 'modes:close'],
  (geometry, geometries, coordinates, modes) =>
    loop$1(geometry, [...geometries, Points$1(coordinates)], modes)
);

const lowerEnvelope = Shape.registerMethod3(
  'lowerEnvelope',
  ['inputGeometry', 'modes:face,edge,plan'],
  generateLowerEnvelope
);

// Note: the first three segments are notionally 'length', 'depth', 'height'.
// Really this should probably be some kind of 'diameter at an angle' measurement, like using a set of calipers.

const mark = Shape.registerMethod3(
  'mark',
  ['inputGeometry'],
  computeOrientedBoundingBox
);

const maskedBy = Shape.registerMethod3(
  ['masked', 'maskedBy'],
  ['inputGeometry', 'geometries'],
  maskedBy$1
);

const MaskedBy = Shape.registerMethod3(
  ['MaskedBy'],
  ['geometries'],
  ([geometry, ...masks]) => maskedBy$1(geometry, masks)
);

const masking = Shape.registerMethod3(
  'masking',
  ['inputGeometry', 'geometry'],
  masking$1
);

const material = Shape.registerMethod3(
  'material',
  ['inputGeometry', 'string'],
  hasMaterial
);

const minimizeOverhang = Shape.registerMethod3(
  'minimizeOverhang',
  ['inputGeometry', 'number', 'modes:split'],
  minimizeOverhang$1
);

const move = Shape.registerMethod3(
  ['move', 'xyz'],
  ['inputGeometry', 'number', 'number', 'number', 'coordinates'],
  (geometry, x, y = 0, z = 0, coordinates = []) => {
    const results = [];
    if (x !== undefined) {
      coordinates.push([x || 0, y, z]);
    }
    for (const coordinate of coordinates) {
      results.push(translate(geometry, coordinate));
    }
    return Group$1(results);
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

const normal = Shape.registerMethod3('normal', ['inputGeometry'], computeNormal);

const noGap = Shape.registerMethod3(
  ['noGap', 'noVoid'],
  ['inputGeometry'],
  (geometry) => on$1(geometry, get$1(geometry, ['type:void']), () => Empty$1())
);

const noVoid = noGap;

const noHoles = Shape.registerMethod3(
  'noHoles',
  ['inputGeometry'],
  (geometry) => separate$1(geometry, { noHoles: true })
);

const nth = Shape.registerMethod3(
  ['nth', 'n'],
  ['inputGeometry', 'numbers'],
  nth$1
);

const n = nth;

const obb = Shape.registerMethod3(
  ['obb', 'orientedBoundingBox'],
  ['inputGeometry'],
  obb$1
);

const offset = Shape.registerMethod3(
  'offset',
  ['inputGeometry', 'number', 'options'],
  offset$1
);

const toGeometry = Shape.registerMethod3(
  'toGeometry',
  ['inputGeometry'],
  (geometry) => geometry,
  (geometry) => geometry
);

const on = Shape.registerMethod3(
  'on',
  ['inputGeometry', 'geometry', 'function'],
  onPre,
  async (preResults, [geometry, _selector, op = (_v) => (s) => s]) => {
    const results = [];
    const input = Shape.chain(Shape.fromGeometry(geometry));
    for (const { inputLeaf, localInputLeaf, global } of preResults) {
      const localOutputShape = await Shape.apply(
        input,
        op,
        Shape.chain(Shape.fromGeometry(localInputLeaf))
      );
      const localOutputLeaf = await toGeometry()(localOutputShape);
      results.push({ inputLeaf, localOutputLeaf, global });
    }
    const rewritten = onPost(geometry, results);
    return Shape.fromGeometry(rewritten);
  }
);

const outline = Shape.registerMethod3(
  'outline',
  ['inputGeometry', 'geometries'],
  outline$1
);

const orient = Shape.registerMethod3(
  'orient',
  ['inputGeometry', 'coordinates'],
  orient$1
);

const overlay = Shape.registerMethod3('overlay', ['inputGeometry'], hasShowOverlay);

const pack = Shape.registerMethod3(
  'pack',
  ['inputGeometry', 'geometries', 'numbers', 'options', 'string'],
  pack$1
);

const pdf = Shape.registerMethod3(
  'pdf',
  ['inputGeometry', 'string', 'function', 'options'],
  async (
    geometry,
    name,
    op = (_v) => (s) => s,
    { lineWidth = 0.096, size = [210, 297], definitions } = {}
  ) => {
    const options = { lineWidth, size, definitions };
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const displayGeometry = toDisplayGeometry$1(
      await Shape.applyToGeometry(geometry, op)
    );
    for (const entry of ensurePages(displayGeometry)) {
      const pdfPath = `download/pdf/${path}/${id}/${viewId}`;
      await write(pdfPath, await toPdf(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.pdf`;
      const record = {
        path: pdfPath,
        filename,
        type: 'application/pdf',
      };
      await gridView(name, {
        ...options.view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);

const computeDotProduct = ([x1, y1, z1], [x2, y2, z2]) =>
  x1 * x2 + y1 * y2 + z1 * z2;

const computeLength = (v) => Math.sqrt(computeDotProduct(v, v));

const normalize = (v) => {
  const l = computeLength(v);
  return [v[0] / l, v[1] / l, v[2] / l];
};

const readPngAsRasta = async (path) => {
  let data = await read(`source/${path}`, { sources: [path] });
  if (data === undefined) {
    throw Error(`Cannot read png from ${path}`);
  }
  const raster = await fromPng(data);
  return raster;
};

const LoadPng = Shape.registerMethod3(
  'LoadPng',
  ['function', 'string', 'numbers', 'options'],
  async (op, path, bands, { offset = 0.01 } = {}) => {
    if (bands.length === 0) {
      bands = [0.5, 1.0];
    }
    const { width, height, pixels } = await readPngAsRasta(path);
    const getPixel = (x, y) => {
      const offset = (y * width + x) << 2;
      // FIX: Use a proper color model to generate the monochromatic value.
      return Math.floor(
        (pixels[offset + 0] + pixels[offset + 1] + pixels[offset + 2]) / 3
      );
    };
    const data = Array(height);
    for (let y = 0; y < height; y++) {
      data[y] = Array(width);
      for (let x = 0; x < width; x++) {
        data[y][x] = getPixel(x, y);
      }
    }
    const rawBands = fromRaster(
      data,
      bands.map((band) => band * 256),
      offset
    );
    const processedBands = [];
    for (let nth = 0; nth < rawBands.length; nth++) {
      const contours = rawBands[nth];
      processedBands.push(
        await Shape.applyGeometryToGeometry(
          contours,
          op,
          bands[nth],
          bands[nth + 1]
        )
      );
    }
    return Group$1(processedBands);
  }
);

const LoadPngAsRelief = Shape.registerMethod3(
  'LoadPngAsRelief',
  ['string', 'options', 'modes:close,noClose'],
  async (
    path,
    {
      minimumValue = 0,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound,
      extrusion,
    } = {},
    { close = true, noClose = false } = {}
  ) => {
    const doClose = close && !noClose;
    const { width, height, pixels } = await readPngAsRasta(path);
    // FIX: This uses the red channel for the value.
    const getPixel = (x, y) => pixels[(y * width + x) << 2];
    const storage = new ArrayBuffer(width * height);
    const data = new Uint8Array(storage);
    let i = 0;
    let maxZ = -Infinity;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const z = Math.min(Math.max(getPixel(x, y) - minimumValue, 0), 255);
        if (z > maxZ) {
          maxZ = z;
        }
        data[i++] = z;
      }
    }
    return computeReliefFromImage(
      width,
      height,
      maxZ,
      data,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound,
      extrusion,
      doClose
    );
  }
);

const png = Shape.registerMethod3(
  'png',
  ['inputGeometry', MODES, 'function', 'options', 'value'],
  async (geometry, modes, op = (_x) => (s) => s, options, viewId) => {
    const downloadOp = async (geometry, { view, path, id }) => {
      const { name, height, viewId, width } = view;
      const pngPath = `download/png/${path}/${id}/${viewId}`;
      const renderedPng = await renderPng(
        { geometry, view },
        { offsetWidth: width, offsetHeight: height }
      );
      const data = new Uint8Array(renderedPng);
      await write(pngPath, data);
      const filename = `${name}.png`;
      const record = {
        path: pngPath,
        filename,
        type: 'image/png',
      };
      return { entries: [record] };
    };
    return viewOp(geometry, modes, op, { ...options, downloadOp }, viewId);
  }
);

const raycastPng = Shape.registerMethod3(
  'raycastPng',
  [
    'inputGeometry',
    'string',
    'function',
    'number',
    'number',
    'number',
    'number',
    'options',
  ],
  async (
    geometry,
    name,
    op = (_v) => (s) => s,
    implicitLength,
    implicitWidth,
    implicitHeight,
    implicitResolution,
    {
      length = implicitLength,
      width = implicitWidth,
      height = implicitHeight,
      resolution = implicitResolution,
      view = {},
    } = {}
  ) => {
    const light = [0, 0, 1];
    const color = [1, 1, 1];
    const { path } = getSourceLocation();
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const pngPath = `download/png/${path}/${generateUniqueId()}`;
      const { xSteps, ySteps, points } = render(entry, {
        length,
        width,
        height,
        resolution,
      });
      const pixels = new Uint8Array(points.length);
      let lastPixel = 0;
      for (let nth = 0; nth < points.length; nth += 4) {
        const normal = normalize([
          points[nth + 1],
          points[nth + 2],
          points[nth + 3],
        ]);
        const dot = computeDotProduct(light, normal);
        if (dot < 0) {
          pixels[lastPixel++] = 0;
          pixels[lastPixel++] = 0;
          pixels[lastPixel++] = 0;
          pixels[lastPixel++] = 0;
        } else {
          const cos = Math.abs(dot);
          const r = color[0] * cos;
          const g = color[1] * cos;
          const b = color[2] * cos;
          const i = 1;
          pixels[lastPixel++] = Math.floor(r * 255);
          pixels[lastPixel++] = Math.floor(g * 255);
          pixels[lastPixel++] = Math.floor(b * 255);
          pixels[lastPixel++] = Math.floor(i * 255);
        }
      }
      await write(
        pngPath,
        (
          await toPng({ width: xSteps, height: ySteps, bytes: pixels })
        ).buffer
      );
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.png`;
      const record = {
        path: pngPath,
        filename,
        type: 'image/png',
      };
      // Produce a view of what will be downloaded.
      viewOp(
        entry,
        [],
        undefined,
        { ...view, download: { entries: [record] } },
        view.viewId
      );
    }
    return geometry;
  }
);

const points = Shape.registerMethod3('points', ['inputGeometry'], toPoints);

const put = Shape.registerMethod3(
  'put',
  ['inputGeometry', 'geometries'],
  (geometry, geometries) => on$1(geometry, geometry, () => Group$1(geometries))
);

var Prando = /** @class */ (function () {
    // ================================================================================================================
    // CONSTRUCTOR ----------------------------------------------------------------------------------------------------
    /**
     * Generate a new Prando pseudo-random number generator.
     *
     * @param seed - A number or string seed that determines which pseudo-random number sequence will be created. Defaults to current time.
     */
    function Prando(seed) {
        this._value = NaN;
        if (typeof (seed) === "string") {
            // String seed
            this._seed = this.hashCode(seed);
        }
        else if (typeof (seed) === "number") {
            // Numeric seed
            this._seed = this.getSafeSeed(seed);
        }
        else {
            // Pseudo-random seed
            this._seed = this.getSafeSeed(Prando.MIN + Math.floor((Prando.MAX - Prando.MIN) * Math.random()));
        }
        this.reset();
    }
    // ================================================================================================================
    // PUBLIC INTERFACE -----------------------------------------------------------------------------------------------
    /**
     * Generates a pseudo-random number between a lower (inclusive) and a higher (exclusive) bounds.
     *
     * @param min - The minimum number that can be randomly generated.
     * @param pseudoMax - The maximum number that can be randomly generated (exclusive).
     * @return The generated pseudo-random number.
     */
    Prando.prototype.next = function (min, pseudoMax) {
        if (min === void 0) { min = 0; }
        if (pseudoMax === void 0) { pseudoMax = 1; }
        this.recalculate();
        return this.map(this._value, Prando.MIN, Prando.MAX, min, pseudoMax);
    };
    /**
     * Generates a pseudo-random integer number in a range (inclusive).
     *
     * @param min - The minimum number that can be randomly generated.
     * @param max - The maximum number that can be randomly generated.
     * @return The generated pseudo-random number.
     */
    Prando.prototype.nextInt = function (min, max) {
        if (min === void 0) { min = 10; }
        if (max === void 0) { max = 100; }
        this.recalculate();
        return Math.floor(this.map(this._value, Prando.MIN, Prando.MAX, min, max + 1));
    };
    /**
     * Generates a pseudo-random string sequence of a particular length from a specific character range.
     *
     * Note: keep in mind that creating a random string sequence does not guarantee uniqueness; there is always a
     * 1 in (char_length^string_length) chance of collision. For real unique string ids, always check for
     * pre-existing ids, or employ a robust GUID/UUID generator.
     *
     * @param length - Length of the strting to be generated.
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated string sequence.
     */
    Prando.prototype.nextString = function (length, chars) {
        if (length === void 0) { length = 16; }
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        var str = "";
        while (str.length < length) {
            str += this.nextChar(chars);
        }
        return str;
    };
    /**
     * Generates a pseudo-random string of 1 character specific character range.
     *
     * @param chars - Characters that are used when creating the random string. Defaults to all alphanumeric chars (A-Z, a-z, 0-9).
     * @return The generated character.
     */
    Prando.prototype.nextChar = function (chars) {
        if (chars === void 0) { chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"; }
        this.recalculate();
        return chars.substr(this.nextInt(0, chars.length - 1), 1);
    };
    /**
     * Picks a pseudo-random item from an array. The array is left unmodified.
     *
     * Note: keep in mind that while the returned item will be random enough, picking one item from the array at a time
     * does not guarantee nor imply that a sequence of random non-repeating items will be picked. If you want to
     * *pick items in a random order* from an array, instead of *pick one random item from an array*, it's best to
     * apply a *shuffle* transformation to the array instead, then read it linearly.
     *
     * @param array - Array of any type containing one or more candidates for random picking.
     * @return An item from the array.
     */
    Prando.prototype.nextArrayItem = function (array) {
        this.recalculate();
        return array[this.nextInt(0, array.length - 1)];
    };
    /**
     * Generates a pseudo-random boolean.
     *
     * @return A value of true or false.
     */
    Prando.prototype.nextBoolean = function () {
        this.recalculate();
        return this._value > 0.5;
    };
    /**
     * Skips ahead in the sequence of numbers that are being generated. This is equivalent to
     * calling next() a specified number of times, but faster since it doesn't need to map the
     * new random numbers to a range and return it.
     *
     * @param iterations - The number of items to skip ahead.
     */
    Prando.prototype.skip = function (iterations) {
        if (iterations === void 0) { iterations = 1; }
        while (iterations-- > 0) {
            this.recalculate();
        }
    };
    /**
     * Reset the pseudo-random number sequence back to its starting seed. Further calls to next()
     * will then produce the same sequence of numbers it had produced before. This is equivalent to
     * creating a new Prando instance with the same seed as another Prando instance.
     *
     * Example:
     * let rng = new Prando(12345678);
     * console.log(rng.next()); // 0.6177754114889017
     * console.log(rng.next()); // 0.5784605181725837
     * rng.reset();
     * console.log(rng.next()); // 0.6177754114889017 again
     * console.log(rng.next()); // 0.5784605181725837 again
     */
    Prando.prototype.reset = function () {
        this._value = this._seed;
    };
    // ================================================================================================================
    // PRIVATE INTERFACE ----------------------------------------------------------------------------------------------
    Prando.prototype.recalculate = function () {
        this._value = this.xorshift(this._value);
    };
    Prando.prototype.xorshift = function (value) {
        // Xorshift*32
        // Based on George Marsaglia's work: http://www.jstatsoft.org/v08/i14/paper
        value ^= value << 13;
        value ^= value >> 17;
        value ^= value << 5;
        return value;
    };
    Prando.prototype.map = function (val, minFrom, maxFrom, minTo, maxTo) {
        return ((val - minFrom) / (maxFrom - minFrom)) * (maxTo - minTo) + minTo;
    };
    Prando.prototype.hashCode = function (str) {
        var hash = 0;
        if (str) {
            var l = str.length;
            for (var i = 0; i < l; i++) {
                hash = ((hash << 5) - hash) + str.charCodeAt(i);
                hash |= 0;
                hash = this.xorshift(hash);
            }
        }
        return this.getSafeSeed(hash);
    };
    Prando.prototype.getSafeSeed = function (seed) {
        if (seed === 0)
            return 1;
        return seed;
    };
    Prando.MIN = -2147483648; // Int32 min
    Prando.MAX = 2147483647; // Int32 max
    return Prando;
}());

const random = Shape.registerMethod3(
  'random',
  ['inputGeometry', 'function', 'number', 'number', 'number'],
  (geometry) => geometry,
  async (
    geometry,
    [_, op = () => (s) => s, count = 1, offset = 0, seed = 0xffff]
  ) => {
    const input = Shape.fromGeometry(geometry);
    const values = [];
    const r = new Prando(seed);
    r.skip(offset * count);
    for (let nth = 0; nth < count; nth++) {
      values.push(r.next());
    }
    const result = await op(...values)(input);
    return result;
  }
);

const ref = Shape.registerMethod3(
  'ref',
  [
    'inputGeometry',
    'string',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'coordinate',
  ],
  ref$1
);
const Ref = Shape.registerMethod3(
  'Ref',
  [
    'string',
    'number',
    'number',
    'number',
    'number',
    'number',
    'number',
    'coordinate',
  ],
  Ref$1
);

const repair = Shape.registerMethod3(
  'repair',
  ['inputGeometry', 'strings'],
  repair$1
);

// It's not entirely clear that Clip makes sense, but we set it up to clip the first argument for now.
const reconstruct = Shape.registerMethod3(
  'reconstruct',
  ['inputGeometry', 'options'],
  reconstruct$1
);

const refine = Shape.registerMethod3(
  'refine',
  ['inputGeometry', 'geometries', 'number', 'options'],
  (geometry, selections, implicitDensity, { density = implicitDensity } = {}) =>
    refine$1(geometry, selections, { density })
);

const remesh = Shape.registerMethod3(
  'remesh',
  ['inputGeometry', 'number', 'geometries', 'options'],
  remesh$1
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

// These are unfortunately a bit inconsistent.
// Route(tool, ...geometries) vs geometry.route(tool).

const Route = Shape.registerMethod3(
  'Route',
  ['geometry', 'geometries'],
  Route$1
);

const route = Shape.registerMethod3(
  'route',
  ['inputGeometry', 'geometry'],
  (geometry, tool) => Route$1(tool, [geometry])
);

const square = (a) => a * a;

const distance = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) =>
  Math.sqrt(square(ax - bx) + square(ay - by) + square(az - bz));

const runLength = Shape.registerMethod3(
  'runLength',
  ['inputGeometry', 'function'],
  async (geometry, op = (length) => (_shape) => length) => {
    let total = 0;
    for (const { segments } of linearize(
      geometry,
      ({ type }) => type === 'segments'
    )) {
      for (const [source, target] of segments) {
        total += distance(source, target);
      }
    }
    return Shape.applyToGeometry(geometry, op, total);
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

const scale$1 = Shape.registerMethod3(
  ['scale', 's'],
  ['inputGeometry', 'coordinate', 'number', 'number', 'number'],
  (input, coordinate, dX = 1, dY = dX, dZ = dY) =>
    scale$2(input, coordinate || [dX, dY, dZ])
);

const s = scale$1;

const scaleX = Shape.registerMethod3(
  ['scaleX', 'sx'],
  ['inputGeometry', 'numbers'],
  async (geometry, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(scale$2(geometry, [value, 1, 1]));
    }
    return Group$1(scaled);
  }
);

const sx = scaleX;

const scaleY = Shape.registerMethod3(
  ['scaleY', 'sy'],
  ['inputGeometry', 'numbers'],
  async (geometry, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(scale$2(geometry, [1, value, 1]));
    }
    return Group$1(scaled);
  }
);

const sy = scaleY;

const scaleZ = Shape.registerMethod3(
  ['scaleZ', 'sz'],
  ['inputGeometry', 'numbers'],
  async (geometry, values) => {
    const scaled = [];
    for (const value of values) {
      scaled.push(scale$2(geometry, [1, 1, value]));
    }
    return Group$1(scaled);
  }
);

const sz = scaleZ;

const scaleToFit = Shape.registerMethod3(
  ['scaleToFit'],
  ['inputGeometry', 'coordinate', 'number', 'number', 'number'],
  (input, coordinate, dX, dY, dZ) => scaleToFit$1(input, coordinate || [dX, dY, dZ])
);

const seam = Shape.registerMethod3(
  'seam',
  ['inputGeometry', 'geometries'],
  seam$1
);

const section = Shape.registerMethod3(
  'section',
  ['inputGeometry', 'geometries'],
  section$1
);

const separate = Shape.registerMethod3(
  'separate',
  ['inputGeometry', 'modes:noShapes,noHoles,holesAsShapes'],
  separate$1
);

const toShapesFromSequence = async (
  geometry,
  op = (_n) => (s) => s,
  groupOp = Group,
  specs
) => {
  const input = Shape.fromGeometry(geometry);
  const results = [];
  for (const coordinate of seq$1(...specs)) {
    results.push(await Shape.apply(input, op, ...coordinate));
  }
  return Shape.apply(input, groupOp, ...results);
};

const seq = Shape.registerMethod3(
  'seq',
  ['inputGeometry', 'function', 'function', 'objects'],
  toShapesFromSequence,
  (shape) => shape
);

const Seq = Shape.registerMethod3(
  'Seq',
  ['function', 'function', 'objects'],
  (op = (_n) => (s) => s, groupOp = Group, specs) =>
    toShapesFromSequence(Empty$1(), op, groupOp, specs),
  (shape) => shape
);

const serialize = Shape.registerMethod3(
  'serialize',
  ['inputGeometry', 'function'],
  (geometry, op = (v) => v) =>
    Shape.applyToGeometry(serialize$1(geometry), op)
);

const setTag = Shape.registerMethod3(
  'setTag',
  ['inputGeometry', 'string', 'value'],
  (geometry, tag, value) => retag(geometry, [`${tag}=*`], [`${tag}=${value}`])
);

const setTags = Shape.registerMethod3(
  'setTags',
  ['inputGeometry', 'strings'],
  (geometry, tags = []) => rewriteTags(geometry, tags, [])
);

const shadow = Shape.registerMethod3(
  ['silhouette', 'shadow'],
  ['inputGeometry', 'geometry', 'geometry'],
  (geometry, planeReference, sourceReference) =>
    cast(planeReference, sourceReference, geometry)
);

const shell = Shape.registerMethod3(
  'shell',
  ['inputGeometry', 'interval', 'number', 'number', 'modes:protect', 'options'],
  shell$1
);

const simplify = Shape.registerMethod3(
  'simplify',
  ['inputGeometry', 'number', 'number', 'options'],
  (geometry, cornerThreshold = 20 / 360, eps) =>
    simplify$1(geometry, cornerThreshold, eps)
);

const add = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const scale = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const X = 0;
const Y = 1;
const Z = 2;

const size = Shape.registerMethod3(
  'size',
  [
    'inputGeometry',
    'function',
    'strings:empty,max,min,maxX,maxY,maxZ,minX,minY,minZ,right,left,front,back,top,bottom,length,width,height,center',
    'options',
  ],
  async (geometry, _op, modes, { resolution = 0.01 } = {}) => {
    const round = (value) => {
      if (resolution === 0) {
        return value;
      } else {
        return Math.round(value / resolution) * resolution;
      }
    };
    const bounds = measureBoundingBox(geometry);
    const args = [];
    if (bounds === undefined) {
      for (const mode of modes) {
        switch (mode) {
          case 'empty':
            args.push(true);
            break;
        }
      }
    } else {
      const [min, max] = bounds;
      for (const mode of modes) {
        switch (mode) {
          case 'empty':
            args.push(false);
            break;
          case 'max':
            // CHECK: This is return a vector rather than a scalar.
            args.push(round(max));
            break;
          case 'min':
            // CHECK: This is return a vector rather than a scalar.
            args.push(round(min));
            break;
          case 'maxX':
          case 'right':
            args.push(round(max[X]));
            break;
          case 'minX':
          case 'left':
            args.push(round(min[X]));
            break;
          case 'minY':
          case 'front':
            args.push(round(min[Y]));
            break;
          case 'maxY':
          case 'back':
            args.push(round(max[Y]));
            break;
          case 'maxZ':
          case 'top':
            args.push(round(max[Z]));
            break;
          case 'minZ':
          case 'bottom':
            args.push(round(min[Z]));
            break;
          case 'length':
            args.push(round(max[X] - min[X]));
            break;
          case 'width':
            args.push(round(max[Y] - min[Y]));
            break;
          case 'height':
            args.push(round(max[Z] - min[Z]));
            break;
          case 'center':
            // CHECK: This is return a vector rather than a scalar.
            args.push(scale(0.5, add(min, max)));
            break;
        }
      }
    }
    return args;
  },
  (args, [geometry, op = (value) => (_shape) => value, _modes]) =>
    Shape.applyGeometryToValue(geometry, op, ...args)
);

const Skeleton = Shape.registerMethod3(
  'Skeleton',
  ['geometries'],
  ComputeSkeleton
);

const skeleton = Shape.registerMethod3(
  'skeleton',
  ['inputGeometry', 'geometries'],
  computeSkeleton
);

const sketch = Shape.registerMethod3(
  'sketch',
  ['inputGeometry'],
  (geometry) => taggedSketch({}, geometry)
);

const smooth = Shape.registerMethod3(
  'smooth',
  ['inputGeometry', 'geometries', 'number', 'number', 'options'],
  (
    geometry,
    selections,
    implicitTime,
    implicitResolution,
    {
      iterations,
      time = implicitTime,
      remeshIterations,
      remeshRelaxationSteps,
      resolution = implicitResolution,
    } = {}
  ) =>
    smooth$1(
      geometry,
      selections,
      resolution,
      iterations,
      time,
      remeshIterations,
      remeshRelaxationSteps
    )
);

const sort = Shape.registerMethod3(
  'sort',
  ['inputGeometry', 'function', 'modes:min,max', 'numbers'],
  async (geometry, rankOp = () => 0, mode, tiersToKeep = []) => {
    let predicate = (a, b) => a - b;
    if (mode.max) {
      // Start from the max tier.
      predicate = (a, b) => b - a;
    }
    const leafs = [];
    for (const leaf of getLeafs(geometry)) {
      const rank = await rankOp(Shape.fromGeometry(leaf));
      leafs.push({
        rank,
        leaf,
      });
    }
    leafs.sort((a, b) => predicate(a.rank, b.rank));
    let tier;
    const tiers = [];
    for (const thisLeaf of leafs) {
      {
        tier = [];
        tiers.push(tier);
      }
      tier.push(thisLeaf);
    }
    // Structure the results by rank tiers.
    const keptTiers = [];
    for (let nth = 0; nth < tiers.length; nth++) {
      if (tiersToKeep.length === 0 || tiersToKeep.includes(nth + 1)) {
        keptTiers.push(tiers[nth]);
      }
    }
    return Group$1(keptTiers.map((tier) => Group$1(tier.map(({ leaf }) => leaf))));
  }
);

const LoadStl = Shape.registerMethod3(
  'LoadStl',
  [
    'string',
    'modes:binary,ascii',
    'strings:wrap,patch,auto,close',
    'number',
    'number',
  ],
  async (
    path,
    { binary, ascii },
    strategies,
    faceCountLimit = 0,
    minErrorDrop = 0
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
    return fromStl(data, {
      format,
      faceCountLimit,
      minErrorDrop,
      strategies,
    });
  }
);

const Stl = Shape.registerMethod3(
  'Stl',
  ['string', 'strings:wrap,patch,auto', 'number', 'number'],
  async (text, strategies, faceCountLimit = 0, minErrorDrop = 0) =>
    fromStl(new TextEncoder('utf8').encode(text), {
      format: 'ascii',
      faceCountLimit,
      minErrorDrop,
      strategies,
    })
);

const stl = Shape.registerMethod3(
  'stl',
  ['inputGeometry', 'string', 'function', 'options'],
  async (geometry, name, op = (_v) => (s) => s, options = {}) => {
    const { path } = getSourceLocation();
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
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
      await view(name, { ...options.view, download: { entries: [record] } })(
        Shape.fromGeometry(entry)
      );
    }
    return geometry;
  }
);

const LoadSvg = Shape.registerMethod3(
  'LoadSvg',
  ['string', 'options'],
  async (path, { fill = true, stroke = true } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    if (data === undefined) {
      throw Error(`Cannot read svg from ${path}`);
    }
    return fromSvg(data, { doFill: fill, doStroke: stroke });
  }
);

const Svg = Shape.registerMethod3(
  'Svg',
  ['string', 'options'],
  async (svg, { fill = true, stroke = true } = {}) => {
    const data = new TextEncoder('utf8').encode(svg);
    return fromSvg(data, { doFill: fill, doStroke: stroke });
  }
);

const svg = Shape.registerMethod3(
  'svg',
  ['inputGeometry', 'string', 'function', 'options'],
  async (geometry, name, op = (_v) => (s) => s, options = {}) => {
    const { id, path, viewId } = qualifyViewId(name, getSourceLocation());
    let index = 0;
    const updatedGeometry = await Shape.applyToGeometry(geometry, op);
    for (const entry of ensurePages(updatedGeometry)) {
      const svgPath = `download/svg/${path}/${id}/${viewId}`;
      await write(svgPath, await toSvg(entry, options));
      const suffix = index++ === 0 ? '' : `_${index}`;
      const filename = `${name}${suffix}.svg`;
      const record = {
        path: svgPath,
        filename,
        type: 'image/svg+xml',
      };
      await gridView(name, {
        ...options.view,
        download: { entries: [record] },
      })(Shape.fromGeometry(entry));
    }
    return geometry;
  }
);

const table = Shape.registerMethod3(
  'table',
  ['inputGeometry', 'number', 'number', 'strings'],
  async (geometry, rows, columns, cells) => {
    const uniqueId = generateUniqueId;
    const open = { open: { type: 'table', rows, columns, uniqueId } };
    emit({ open, hash: computeHash(open) });
    for (let cell of cells) {
      emitNote(cell);
    }
    const close = { close: { type: 'table', rows, columns, uniqueId } };
    emit({ close, hash: computeHash(close) });
    return geometry;
  }
);

const tag = Shape.registerMethod3(
  'tag',
  ['inputGeometry', 'strings'],
  tag$1
);

const tags = Shape.registerMethod3(
  'tags',
  ['inputGeometry', 'string', 'function'],
  async (geometry, tag = '*', op = (...tags) => note(`tags: ${tags}`)) => {
    const isMatchingTag = tagMatcher(tag, 'user');
    const collected = [];
    for (const { tags } of getLeafs(geometry)) {
      for (const tag of tags) {
        if (isMatchingTag(tag)) {
          collected.push(tag);
        }
      }
    }
    const result = Shape.applyToGeometry(geometry, op, ...collected);
    return result;
  }
);

// Tint adds another color to the mix.
const tint = Shape.registerMethod3(
  'tint',
  ['inputGeometry', 'string'],
  (geometry, name) => retag(geometry, [], toTagsFromName(name))
);

const To = Shape.registerMethod3(
  'To',
  ['geometry', 'geometry', 'geometry'],
  to$1
);

const to = Shape.registerMethod3(
  'to',
  ['inputGeometry', 'geometry', 'geometry'],
  to$1
);

const toCoordinates = Shape.registerMethod3(
  'toCoordinates',
  ['inputGeometry'],
  toCoordinates$1,
  (result) => result
);

const toDisplayGeometry = Shape.registerMethod3(
  'toDisplayGeometry',
  ['inputGeometry'],
  toDisplayGeometry$1,
  (geometry) => geometry
);

const tool = Shape.registerMethod3(
  'tool',
  ['inputGeometry', 'string'],
  (geometry, name) => retag(geometry, [], toTagsFromName$1(name))
);

const toolpath = Shape.registerMethod3(
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
    'modes:simple',
  ],
  (
    geometry,
    toolSize = 2,
    resolution = toolSize,
    toolCutDepth = toolSize / 2,
    annealingMax,
    annealingMin,
    annealingDecay,
    target,
    modes
  ) =>
    computeToolpath(
      target,
      geometry,
      resolution,
      toolSize,
      toolCutDepth,
      annealingMax,
      annealingMin,
      annealingDecay,
      modes
    )
);

const transform = Shape.registerMethod3(
  'transform',
  ['inputGeometry', 'value'],
  transform$1
);

Shape.registerMethod3('Trim', ['geometry', 'geometry'], trim$1);

const trim = Shape.registerMethod3(
  'trim',
  ['inputGeometry', 'geometry'],
  trim$1
);

const tx = Shape.registerMethod3(
  ['turnX', 'tx'],
  ['inputGeometry', 'numbers'],
  turnXs
);

const turnX = tx;

const ty = Shape.registerMethod3(
  ['turnY', 'ty'],
  ['inputGeometry', 'numbers'],
  turnYs
);

const turnY = ty;

const tz = Shape.registerMethod3(
  ['turnZ', 'tz'],
  ['inputGeometry', 'numbers'],
  turnZs
);

const turnZ = tz;

const twist = Shape.registerMethod3(
  'twist',
  ['inputGeometry', 'number'],
  twist$1
);

const untag = Shape.registerMethod3(
  'untag',
  ['inputGeometry', 'strings'],
  untag$1
);

const upperEnvelope = Shape.registerMethod3(
  'upperEnvelope',
  ['inputGeometry', 'modes:face,edge,plan'],
  generateUpperEnvelope
);

const unfold = Shape.registerMethod3('unfold', ['inputGeometry'], unfold$1);

const volume = Shape.registerMethod3(
  'volume',
  ['inputGeometry', 'function'],
  (geometry, op = (value) => (_shape) => value) =>
    Shape.applyToGeometry(geometry, op, measureVolume(geometry))
);

const voxels = Shape.registerMethod3(
  'voxels',
  ['inputGeometry', 'number'],
  toVoxelsFromGeometry
);

const Voxels = Shape.registerMethod3(
  'Voxels',
  ['coordinates'],
  toVoxelsFromCoordinates
);

const Wrap = Shape.registerMethod3(
  'Wrap',
  ['geometries', 'number', 'number', 'number', 'number'],
  Wrap$1
);

const wrap = Shape.registerMethod3(
  'wrap',
  ['inputGeometry', 'geometries', 'number', 'number', 'number', 'number'],
  wrap$1
);

const x = Shape.registerMethod3(
  'x',
  ['inputGeometry', 'numbers'],
  (geometry, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(translate(geometry, [offset, 0, 0]));
    }
    return Group$1(moved);
  }
);

const y = Shape.registerMethod3(
  'y',
  ['inputGeometry', 'numbers'],
  (geometry, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(translate(geometry, [0, offset, 0]));
    }
    return Group$1(moved);
  }
);

const z = Shape.registerMethod3(
  'z',
  ['inputGeometry', 'numbers'],
  async (geometry, offsets) => {
    const moved = [];
    for (const offset of offsets) {
      moved.push(translate(geometry, [0, 0, offset]));
    }
    return Group$1(moved);
  }
);

// Determines the number of sides required for a circle of diameter such that deviation does not exceed tolerance.
// See: https://math.stackexchange.com/questions/4132060/compute-number-of-regular-polgy-sides-to-approximate-circle-to-defined-precision

// For ellipses, use the major diameter for a convervative result.

const zag = (diameter, tolerance = 1) => {
  const r = diameter / 2;
  const k = tolerance / r;
  const s = Math.ceil(Math.PI / Math.sqrt(k * 2));
  return s;
};

const zagSides = Shape.registerMethod3(
  'zagSides',
  ['number', 'number'],
  (diameter = 1, zag$1 = 0.01) => zag(diameter, zag$1),
  (number) => number
);
const zagSteps = Shape.registerMethod3(
  'zagSteps',
  ['number', 'number'],
  (diameter = 1, zag$1 = 0.25) => 1 / zag(diameter, zag$1),
  (number) => number
);

const version = Shape.registerMethod3(
  ['version', 'v'],
  ['inputGeometry', 'value'],
  (geometry, version = 0) =>
    retag(geometry, [`part:version=*`], [`part:version=${version}`])
);

const v = version;

const validate = Shape.registerMethod3(
  'validate',
  ['inputGeometry', 'strings'],
  validate$1
);

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

const Assembly = Shape.registerMethod3(
  'Assembly',
  ['geometries', 'modes:backward,exact'],
  Disjoint
);

const Box = Shape.registerMethod3('Box', ['intervals', 'options'], Box$1);

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

const Empty = Shape.registerMethod3('Empty', [], Empty$1);

const Polygon = Shape.registerMethod3(
  ['Face', 'Polygon'],
  ['coordinates'],
  (coordinates) => fromPolygonSoup([{ points: coordinates }])
);

const Face = Polygon;

const Geometry = Shape.registerMethod3(
  'Geometry',
  ['rest'],
  ([geometry]) => geometry
);

const Hershey = Shape.registerMethod3(
  'Hershey',
  ['string', 'number'],
  Hershey$1
);

const Hexagon = Shape.registerMethod3(
  'Hexagon',
  ['intervals', 'options'],
  Hexagon$1
);

const Icosahedron = Shape.registerMethod3(
  'Icosahedron',
  ['intervals'],
  Icosahedron$1
);

const Implicit = Shape.registerMethod3(
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
    computeImplicitVolume(
      op,
      radius,
      angularBound,
      radiusBound,
      distanceBound,
      errorBound
    )
);

const LoadLDraw = Shape.registerMethod3(
  'LoadLDraw',
  ['string', 'options'],
  async (path, { override, rebuild = false } = {}) => {
    const data = await read(`source/${path}`, { sources: [path] });
    return fromLDraw(data, { override, rebuild });
  }
);

const LDrawPart = Shape.registerMethod3(
  'LDrawPart',
  ['string', 'options'],
  (part, { override, rebuild = false } = {}) =>
    fromLDrawPart(part, { override, rebuild })
);

const LDraw = Shape.registerMethod3(
  'LDraw',
  ['string', 'options'],
  (text, { override, rebuild = false } = {}) =>
    fromLDraw(new TextEncoder('utf8').encode(text), {
      override,
      rebuild,
    })
);

// Constructs an item, as a part, from the designator.
const Label = Shape.registerMethod3('Label', ['string', 'number'], Label$1);

const Line = Shape.registerMethod3(
  ['Line', 'LineX'],
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge$1([begin, 0, 0], [end, 0, 0]));
    }
    return Group$1(edges);
  }
);

const LineX = Line;

const LineY = Shape.registerMethod3(
  'LineY',
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge$1([0, begin, 0], [0, end, 0]));
    }
    return Group$1(edges);
  }
);

const LineZ = Shape.registerMethod3(
  'LineZ',
  ['intervals'],
  (intervals) => {
    const edges = [];
    for (const [begin, end] of intervals) {
      edges.push(Edge$1([0, 0, begin], [0, 0, end]));
    }
    return Group$1(edges);
  }
);

const Octagon = Shape.registerMethod3(
  'Octagon',
  ['intervals', 'options'],
  Octagon$1
);

const Off = Shape.registerMethod3('Off', ['string'], async (text) =>
  fromOff(new TextEncoder('utf8').encode(text))
);

// TODO: Consider re-enabling caching.

const Orb = Shape.registerMethod3('Orb', ['intervals', 'options'], Orb$1);

const Pentagon = Shape.registerMethod3(
  'Pentagon',
  ['intervals', 'options'],
  Pentagon$1
);

const Point = Shape.registerMethod3(
  'Point',
  ['number', 'number', 'number', 'coordinate'],
  Point$1
);

const Points = Shape.registerMethod3(
  'Points',
  ['coordinateLists', 'coordinates'],
  (coordinateLists, coordinates) => {
    for (const coordinateList of coordinateLists) {
      coordinates.push(...coordinateList);
    }
    return Points$1(coordinates);
  }
);

const Polyhedron = Shape.registerMethod3(
  'Polyhedron',
  ['coordinateLists'],
  (coordinateLists) => {
    const out = [];
    for (const coordinates of coordinateLists) {
      out.push({ points: coordinates });
    }
    return fromPolygonSoup(out);
  }
);

const Segments = Shape.registerMethod3('Segments', ['segments'], Segments$1);

const Spiral = Shape.registerMethod3(
  'Spiral',
  ['inputGeometry', 'function', 'options'],
  async (geometry, particle = Point, options) => {
    let particles = [];
    for (const [turn] of seq$1(options)) {
      particles.push(
        rotateZ$1(await Shape.applyToGeometry(geometry, particle, turn), turn)
      );
    }
    const result = await Link$1(particles);
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

const Triangle = Shape.registerMethod3(
  'Triangle',
  ['intervals', 'options'],
  Triangle$1
);

const Wave = Shape.registerMethod3(
  'Wave',
  ['inputGeometry', 'function', 'options'],
  async (geometry, particle = Point, options) => {
    let particles = [];
    for (const [xDistance] of seq$1(options)) {
      particles.push(
        translate(await Shape.applyToGeometry(geometry, particle, xDistance), [
          xDistance,
          0,
          0,
        ])
      );
    }
    return Link$1(particles);
  }
);

export { And, Arc, ArcX, ArcY, ArcZ, As, AsPart, Assembly, Box, Cached, ChainHull, Clip, Cloud, Curve, Cut, Edge, Empty, Face, Fuse, Geometry, GrblConstantLaser, GrblDynamicLaser, GrblPlotter, GrblSpindle, Group, Grow, Hershey, Hexagon, Hull, Icosahedron, Implicit, Iron, Join, LDraw, LDrawPart, Label, Line, LineX, LineY, LineZ, Link, List, LoadDxf, LoadLDraw, LoadPng, LoadPngAsRelief, LoadStl, LoadSvg, Loft, Loop, MaskedBy, Note, Octagon, Off, Orb, Pentagon, Point, Points, Polygon, Polyhedron, RX, RY, RZ, Ref, Route, Segments, Seq, Shape, Skeleton, Spiral, Stl, SurfaceMesh, Svg, To, Triangle, Voxels, Wave, Wrap, X$1 as X, XY, XZ, Y$1 as Y, YX, YZ, Z$1 as Z, ZX, ZY, absolute, abstract, acos, addTo, align, alignment, and, approximate, area, as, asPart, at, base, bb, bend, billOfMaterials, by, centroid, chainHull, clean, clip, clipFrom, cloud, color, commonVolume, copy, cos, curve, cut, cutFrom, cutOut, defRgbColor, defThreejsMaterial, defTool, define, deform, demesh, diameter, dilateXY, disjoint, drop, dxf, e, each, eachEdge, eachPoint, eachSegment, eagerTransform, edges, ex, exterior, extrudeAlong, extrudeX, extrudeY, extrudeZ, ey, ez, faces, fair, fill, fit, fitTo, fix, flat, fuse, g, gap, gauge, gcode, get, getAll, getNot, getTag, ghost, gn, gridView, grow, hold, holes, hull, image, inFn, input, inset, involute, iron, join, lerp, link, list, load, loadGeometry, loft, log, loop, lowerEnvelope, m, mark, maskedBy, masking, material, max, md, min, minimizeOverhang, move, moveAlong, n, noGap, noHoles, noOp, noVoid, normal, note, nth, o, obb, offset, on, op, orient, origin, outline, overlay, pack, pdf, plus, png, points, put, random, raycastPng, reconstruct, ref, refine, remesh, repair, rotateX, rotateY, rotateZ, route, runLength, rx, ry, rz, s, save, saveGeometry, scale$1 as scale, scaleToFit, scaleX, scaleY, scaleZ, seam, section, self, separate, seq, serialize, setTag, setTags, shadow, shell, simplify, sin, size, skeleton, sketch, smooth, sort, split, sqrt, stl, svg, sx, sy, sz, table, tag, tags, times, tint, to, toCoordinates, toDisplayGeometry, toGeometry, tool, toolpath, transform, trim, turnX, turnY, turnZ, twist, tx, ty, tz, unfold, untag, upperEnvelope, v, validate, version, view, voidFn, volume, voxels, wrap, x, xyz, y, z, zagSides, zagSteps };
