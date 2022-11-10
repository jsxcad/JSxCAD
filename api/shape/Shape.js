import {
  assemble,
  eagerTransform,
  fromPolygons,
  taggedGraph,
  taggedPoints,
  taggedSegments,
  toPoints,
} from '@jsxcad/geometry';

import { endTime, getSourceLocation, startTime } from '@jsxcad/sys';

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
      console.log(`QQ/incomplete/sync`);
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
      console.log(`QQ/complete/sync`);
      return target;
    }
    if (prop === 'isChain') {
      return 'complete';
    }
    if (prop === 'then') {
      return async (resolve, reject) => {
        resolve(target());
      };
    }
    if (!ops.has(prop)) {
      return Reflect.get(target, prop);
    }
    // console.log(`QQ/complete/get[${prop}]`);
    return new Proxy(
      (...args) =>
        async (terminal) => {
          // console.log(`<<< QQ/complete/exec[${prop}]: target=${'' + target} chain=${target.isChain}`);
          const s = await target(terminal);
          // console.log(`>>> QQ/complete/exec[${prop}]: s=${'' + s} chain=${s.isChain}`);
          if (!(s instanceof Shape) || s.isChain) {
            throw Error(`Expected Shape but received ${'' + s}`);
          }
          // console.log(`QQ/complete/exec[${prop}]/s: ${'' + s}`);
          // const op = s.ops.get(prop);
          // const op = s[prop];
          const op = ops.get(prop);
          if (typeof op !== 'function') {
            throw Error(
              `${s}[${prop}] must be function, not ${typeof op}: ${'' + op}`
            );
          }
          // Note that the op runs over the unchained context.
          // console.log(`QQ/op: ${'' + op}`);
          return op(...args)(s);
        },
      incomplete
    );
  },
};

// This builds a chain from an existing shape value.
chain = (shape) => {
  const root = {
    apply(target, obj, args) {
      // This is wrong -- the chain root should be the constructor, which requires application.
      console.log(`QQ/root/terminal: ${JSON.stringify(target)}`);
      return this;
    },
    get(target, prop, receiver) {
      console.log(`QQ/root/get: ${prop.toString()}`);
      if (prop === 'sync') {
        console.log(`QQ/root/sync: ${JSON.stringify(target)}`);
        return target;
      }
      if (prop === 'isChain') {
        return 'root';
      }
      if (prop === 'then') {
        return async (resolve, reject) => {
          // console.log(`QQ/chain/terminal: ${JSON.stringify(target)}`);
          resolve(target);
        };
      }
      if (!ops.has(prop)) {
        console.log(`QQ/root/get[${prop}]: not method`);
        return Reflect.get(target, prop);
      }
      console.log(`QQ/root/get[${prop}]: target=${JSON.stringify(target)}`);
      return new Proxy(
        (...args) =>
          async () => {
            console.log(`QQ/root/exec`);
            // We don't care about the terminal -- we're the root of the chain.
            if (!(target instanceof Shape) || target.isChain) {
              throw Error(`Expected Shape but received ${'' + target}`);
            }
            // console.log(`QQ/root/exec[${prop}]: target=${JSON.stringify(target)}`);
            // const op = target.ops.get(prop);
            // const op = target[prop];
            const op = ops.get(prop);
            if (typeof op !== 'function') {
              throw Error(`QQ/Op ${op} [${prop}] is not a function.`);
            }
            console.log(`QQ/root/exec[${prop}]: op=${'' + op}`);
            const pop = await op(...args);
            console.log(`QQ/root/exec[${prop}]: pop=${'' + pop}`);
            if (target.isChain) {
              throw Error(`Target should not be chain`);
            }
            console.log(
              `QQ/root/exec[${prop}]: target=${JSON.stringify(target)}`
            );
            const result = await pop(target);
            // console.log(`QQ/root/exec[${prop}]/target.chain: ${target.isChain}`);
            // console.log(`QQ/root/exec[${prop}]/result.chain: ${result.isChain}`);
            console.log(`QQ/root/exec/result: ${result}`);
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
      console.log(`QQ/chainConstructor[${prop.toString()}]`);
      if (prop === 'isChain') {
        return 'constructor';
      }
    },
    apply(target, obj, args) {
      // console.log(`QQ/chainConstructor/apply`);
      return new Proxy(async () => {
        return op.apply(null, args);
      }, complete);
    },
  };

  return new Proxy(op, constructor);
};

const chainable = (op) => {
  return new Proxy(
    (...args) =>
      async (terminal) => {
        // console.log(`QQ/chainable/terminal`);
        if (!(terminal instanceof Shape) && terminal !== null) {
          throw Error(
            `Expected Shape but received ${JSON.stringify(
              terminal
            )} of type ${typeof terminal} or null (isChain=${terminal.isChain})`
          );
        }
        return op(...args)(terminal);
      },
    incomplete
  );
};

export class Shape {
  constructor(geometry = assemble(), context) {
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

  toPoints() {
    return toPoints(this.toGeometry()).points;
  }

  eagerTransform(matrix) {
    return fromGeometry(
      eagerTransform(matrix, this.toGeometry()),
      this.context
    );
  }

  // Low level setter for reifiers.
  getTags() {
    return this.toGeometry().tags || [];
  }

  toCoordinate(x, y, z) {
    return Shape.toCoordinate(this, x, y, z);
  }

  toCoordinates(...args) {
    return Shape.toCoordinates(this, ...args);
  }

  toValue(value) {
    return Shape.toValue(value, this);
  }

  toFlatValues(values) {
    return Shape.toFlatValues(values, this);
  }

/*
  toNestedValues(values) {
    return Shape.toNestedValues(values, this);
  }
*/
}

export const isShape = (value) => value instanceof Shape || value.isChain;
Shape.isShape = isShape;

export const isFunction = (value) => value instanceof Function;
Shape.isFunction = isFunction;

export const isArray = (value) =>
  value instanceof Array;
Shape.isArray = isArray;

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

/*
export const shapeMethod = (build) => {
  return function (...args) {
    return chain(build(...args).to(this));
  };
};
*/

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

Shape.toValue = (to, from) => {
  if (to instanceof Function) {
    to = to(from);
  }
  return to;
};

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
