import { endTime, getSourceLocation, startTime } from '@jsxcad/sys';
import {
  fromPolygons,
  taggedGraph,
  taggedGroup,
  taggedPoints,
  taggedSegments,
} from '@jsxcad/geometry';

export const ops = new Map();

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

// For testing.
export { chain, chainable, incomplete, complete };

export class Shape {
  constructor(geometry = { type: 'Group', tags: [], content: [] }) {
    if (geometry.geometry) {
      throw Error('die: { geometry: ... } is not valid geometry.');
    }
    this.geometry = geometry;
    return this;
  }
}

export const isShape = (value) =>
  value instanceof Shape ||
  (value !== undefined && value !== null && value.isChain !== undefined);
Shape.isShape = isShape;

export const isGeometry = (value) =>
  value &&
  value instanceof Object &&
  value.type !== undefined &&
  value.geometry === undefined;
Shape.isGeometry = isGeometry;

export const isOp = (value) =>
  value !== undefined &&
  value !== null &&
  value.isChain !== undefined &&
  value.isChain !== 'root';
Shape.isOp = isOp;

export const isChainFunction = (value) =>
  value instanceof Function && value.isChain !== undefined;
Shape.isChainFunction = isChainFunction;

// Complete chains are Shapes waiting for an input.
export const isPendingInput = (value) =>
  value instanceof Function &&
  (value.isChain === 'complete' || value.isChain === 'root');
Shape.isPendingInput = isPendingInput;

export const isPendingArguments = (value) =>
  value instanceof Function && value.isChain === 'incomplete';
Shape.isPendingArguments = isPendingArguments;

// Incomplete chains are ordinary functions waiting for arguments.
export const isFunction = (value) =>
  value instanceof Function &&
  (value.isChain === undefined || value.isChain === 'incomplete');
Shape.isFunction = isFunction;

export const isArray = (value) => value instanceof Array;
Shape.isArray = isArray;

export const isGroupShape = (value) =>
  isShape(value) && value.geometry.type === 'group';
Shape.isGroupShape = isGroupShape;

export const isObject = (value) =>
  value instanceof Object &&
  !isArray(value) &&
  !isShape(value) &&
  !isFunction(value);
Shape.isObject = isObject;

export const isNumber = (value) => typeof value === 'number';
Shape.isNumber = isNumber;

export const isIntervalLike = (value) =>
  isNumber(value) ||
  (isArray(value) &&
    isNumber(value[0]) &&
    (isNumber(value[1]) || value[1] === undefined));
Shape.isIntervalLike = isIntervalLike;

export const isInterval = (value) =>
  isNumber(value) &&
  value.length === 2 &&
  isNumber(value[0]) &&
  isNumber(value[1]);
Shape.isInterval = isInterval;

export const normalizeInterval = (value) => {
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

export const isString = (value) => typeof value === 'string';
Shape.isString = isString;

export const isValue = (value) =>
  (!isObject(value) && !isFunction(value)) || isArray(value);
Shape.isValue = isValue;

export const isCoordinate = (value) => isArray(value) && value.every(isNumber);
Shape.isCoordinate = isCoordinate;

export const isSegment = (value) => isArray(value) && value.every(isCoordinate);
Shape.isSegment = isSegment;

Shape.chain = chain;

export const apply = async (input, op, ...args) => {
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

export const applyGeometryToValue = async (geometry, op, ...args) =>
  Shape.apply(Shape.fromGeometry(geometry), op, ...args);

export const applyGeometryToGeometry = async (geometry, op, ...args) => {
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

/*
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
*/

// Shape.registerMethod2 = registerMethod2;

Shape.fromGeometry = (geometry) => {
  if (geometry === undefined) {
    return new Shape(taggedGroup({}));
  }
  if (!Shape.isGeometry(geometry)) {
    throw Error(`die: not geometry: ${JSON.stringify(geometry)}`);
  }
  return new Shape(geometry);
};

export const registerMethod3 = (
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
        const processedParameters = await preOp(...parameters);
        const r1 = await op(...processedParameters);
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
Shape.fromPolygons = (polygons) => fromGeometry(fromPolygons(polygons));

Shape.registerMethod = registerMethod;

Shape.chainable = chainable;
Shape.ops = ops;

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();

export default Shape;
