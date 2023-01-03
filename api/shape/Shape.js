import { endTime, getSourceLocation, startTime } from '@jsxcad/sys';
import {
  fromPolygons,
  taggedGraph,
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
        // But since target() is async, it returns it as a promise, which will end up getting then'd by the await, and so on.
        // But that won't be this when.
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

// This builds a chain from a constructor, like Box.
const chainConstructor = (op) => {
  // This chain is a constructor that hasn't been applied yet.
  const constructor = {
    get(target, prop, receiver) {
      if (prop === 'isChain') {
        return 'constructor';
      }
    },
    apply(target, obj, args) {
      return new Proxy(async () => {
        const result = await op.apply(null, args);
        return result;
      }, complete);
    },
  };

  return new Proxy(op, constructor);
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
        const result = await op(...args)(terminal);
        return result;
      },
    incomplete
  );
};

// For testing.
export { chain, chainable, incomplete, complete };

export class Shape {
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

  /*
  toPoints() {
    return toPoints(this.toGeometry()).points;
  }
  */

  /*
  eagerTransform(matrix) {
    return fromGeometry(
      eagerTransform(matrix, await this.toGeometry()),
      this.context
    );
  }
  */

  /*
  // Low level setter for reifiers.
  getTags() {
    return this.toGeometry().tags || [];
  }
*/

  toCoordinate(x, y, z) {
    return Shape.toCoordinate(this, x, y, z);
  }

  toCoordinates(...args) {
    return Shape.toCoordinates(this, ...args);
  }

  /*
  toValue(value) {
    return Shape.toValue(value, this);
  }
  */

  /*
  toFlatValues(values) {
    return Shape.toFlatValues(values, this);
  }
  */

  /*
  toNestedValues(values) {
    return Shape.toNestedValues(values, this);
  }
*/
}

export const isShape = (value) =>
  value instanceof Shape ||
  (value !== undefined && value !== null && value.isChain === 'root');
Shape.isShape = isShape;

export const isFunction = (value) => value instanceof Function;
Shape.isFunction = isFunction;

export const isArray = (value) => value instanceof Array;
Shape.isArray = isArray;

export const isObject = (value) =>
  value instanceof Object &&
  !isArray(value) &&
  !isShape(value) &&
  !isFunction(value);
Shape.isObject = isObject;

export const isNumber = (value) => typeof value === 'number';
Shape.isNumber = isNumber;

export const isValue = (value) =>
  (!isObject(value) && !isFunction(value)) || isArray(value);
Shape.isValue = isValue;

Shape.chain = chain;

export const registerMethod = (names, op) => {
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

export const registerShapeMethod = (names, op) => {
  if (typeof names === 'string') {
    names = [names];
  }
  const chainOp = chainConstructor(op);
  for (const name of names) {
    Shape.prototype[name] = chainOp;
    Shape[name] = chainOp;
  }
  return chainOp;
};

Shape.registerShapeMethod = registerShapeMethod;

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

/*
Shape.toValue = (to, from) => {
  if (to instanceof Function) {
    to = to(from);
  }
  return to;
};
*/

/*
Shape.toFlatValues = (to, from) => {
  if (to instanceof Function) {
    to = to(from);
  }
  if (to instanceof Array) {
    return to
      .filter((value) => value !== undefined)
      .flatMap((value) => Shape.toValue(value, from))
      .flatMap((value) => Shape.toValue(value, from));
  } else if (isShape(to) && to.toGeometry().type === 'group') {
    return Shape.toFlatValues(to.toGeometry().content, from);
  } else {
    return [Shape.toValue(to, from)];
  }
};
*/

/*
Shape.toNestedValues = (to, from) => {
  if (to instanceof Function) {
    to = to(from);
  }
  if (to instanceof Array) {
    const expanded = [];
    for (const value of to) {
      if (value instanceof Function) {
        expanded.push(...value(from));
      } else {
        expanded.push(value);
      }
    }
    return expanded;
  } else {
    return to;
  }
};
*/

/*
Shape.toCoordinate = async (shape, x = 0, y = 0, z = 0) => {
  if (x instanceof Function) {
    x = await x(shape);
  }
  if (typeof x === 'string') {
    x = shape.get(x);
  }
  if (isShape(x)) {
    const points = x.toPoints();
    if (points.length >= 1) {
      return points[0];
    } else {
      throw Error(`Unexpected coordinate value: ${JSON.stringify(x)}`);
    }
  } else if (x instanceof Array) {
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
};
*/

/*
Shape.toCoordinates = async (shape, ...args) => {
  const coordinates = [];
  while (args.length > 0) {
    let x = args.shift();
    if (Shape.isFunction(x)) {
      x = await x(shape);
    }
    if (Shape.isShape(x)) {
      if (x.toGeometry().type === 'group') {
        coordinates.push(
          ...Shape.toCoordinates(
            shape,
            ...x
              .toGeometry()
              .content.map((geometry) => Shape.fromGeometry(geometry))
          )
        );
      } else {
        coordinates.push(Shape.toCoordinate(shape, x));
      }
    } else if (Shape.isArray(x)) {
      if (isNaN(x[0]) || isNaN(x[1]) || isNaN(x[2])) {
        for (const element of x) {
          coordinates.push(...Shape.toCoordinates(shape, element));
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
};
*/

Shape.chainable = chainable;
Shape.ops = ops;

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();

export default Shape;
