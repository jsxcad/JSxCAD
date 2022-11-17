import { assemble as assemble$1, toPoints, eagerTransform, taggedGraph, taggedSegments, taggedPoints, fromPolygons, taggedPlan, hasTypeReference, taggedGroup, join as join$1, makeAbsolute, measureArea, taggedItem, transform as transform$1, getInverseMatrices, computeNormal, extrude, transformCoordinate, link as link$1, measureBoundingBox, bend as bend$1, getLeafs, computeCentroid, convexHull, fuse as fuse$1, noGhost, clip as clip$1, rewrite, cut as cut$1, deform as deform$1, demesh as demesh$1, disjoint as disjoint$1, hasTypeGhost, replacer, taggedLayout, getLayouts, eachFaceEdges, eachPoint as eachPoint$1, fill as fill$1, fix as fix$1, visit, grow as grow$1, inset as inset$1, involute as involute$1, load as load$1, read as read$1, readNonblocking, loft as loft$1, generateLowerEnvelope, hasShowOverlay, hasTypeMasked, hasMaterial, offset as offset$1, outline as outline$1, remesh as remesh$1, store, write as write$1, writeNonblocking, fromScaleToTransform, seam as seam$1, section as section$1, separate as separate$1, serialize as serialize$1, rewriteTags, cast, simplify as simplify$1, taggedSketch, smooth as smooth$1, toDisplayGeometry as toDisplayGeometry$1, computeToolpath, twist as twist$1, generateUpperEnvelope, hasTypeVoid, measureVolume, withAabbTreeQuery, linearize, wrap as wrap$1, computeImplicitVolume, hash } from './jsxcad-geometry.js';
import { getSourceLocation, startTime, endTime, emit, computeHash, logInfo, read, log as log$1, write, ErrorWouldBlock, generateUniqueId, isNode } from './jsxcad-sys.js';
export { elapsed, emit, read, write } from './jsxcad-sys.js';
import { zag } from './jsxcad-api-v1-math.js';
import { fromRotateXToTransform, fromRotateYToTransform, fromSegmentToInverseTransform, invertTransform, fromTranslateToTransform, fromRotateZToTransform, setTestMode, makeUnitSphere as makeUnitSphere$1 } from './jsxcad-algorithm-cgal.js';
import { toTagsFromName } from './jsxcad-algorithm-color.js';
import { pack as pack$1 } from './jsxcad-algorithm-pack.js';
import { toTagsFromName as toTagsFromName$1 } from './jsxcad-algorithm-tool.js';
import { dataUrl } from './jsxcad-ui-threejs.js';

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
          // console.log(`<<< QQ/complete/exec[${prop}]: target=${'' + target} chain=${target.isChain}`);
          const s = await target(terminal);
          // console.log(`>>> QQ/complete/exec[${prop}]: s=${'' + s} ${JSON.stringify(s)} chain=${s.isChain}`);
          if (!(s instanceof Shape) && !s.isChain) {
            throw Error(`Expected Shape but received ${JSON.stringify(s)} constructor ${s.constructor.name}`);
          }
          // console.log(`QQ/complete/exec[${prop}]/s: ${'' + s}`);
          // const op = s.ops.get(prop);
          // const op = s[prop];
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
          // Note that the op runs over the unchained context.
          // console.log(`QQ/op: ${'' + op}`);
          const result = await op(...args)(s);
          return result;
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
        /*
        return async (resolve, reject) => {
          resolve(target);
        };
        */
        return undefined;
      }
      if (!ops.has(prop)) {
        // console.log(`QQ/root/get[${prop.toString()}]: not method`);
        return Reflect.get(target, prop);
      }
      // console.log(`QQ/root/get[${prop}]: target=${JSON.stringify(target)}`);
      return new Proxy(
        (...args) =>
          async () => {
            // console.log(`QQ/root/exec`);
            // We don't care about the terminal -- we're the root of the chain.
            if (!(target instanceof Shape)) {
              throw Error(`Expected Shape but received ${'' + target}: isChain ${target.isChain} ${JSON.stringify(target)}`);
            }
            const root = await target;
            // console.log(`QQ/root/exec[${prop}]: root=${JSON.stringify(root)}`);
            // const op = root.ops.get(prop);
            // const op = root[prop];
            const op = ops.get(prop);
            if (typeof op !== 'function') {
              throw Error(`QQ/Op ${op} [${prop}] is not a function.`);
            }
            // console.log(`QQ/root/exec[${prop}]: op=${'' + op}`);
            const pop = await op(...args);
            // console.log(`QQ/root/exec[${prop}]: pop=${'' + pop}`);
            // if (root.isChain) {
            //   throw Error(`Target should not be chain`);
            // }
            console.log(`QQ/root/exec[${prop}]: root=${JSON.stringify(root)}`);
            let result;
            try {
              result = await pop(root);
            } catch (e) {
              console.log(e.stack);
              throw e;
            }
            // console.log(`QQ/root/exec[${prop}]/root.chain: ${root.isChain}`);
            // console.log(`QQ/root/exec[${prop}]/result.chain: ${result.isChain}`);
            // console.log(`QQ/root/exec/result: ${result}`);
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
      // console.log(`QQ/chainConstructor[${prop.toString()}]`);
      if (prop === 'isChain') {
        return 'constructor';
      }
    },
    apply(target, obj, args) {
      // console.log(`QQ/chainConstructor/apply`);
      return new Proxy(async () => {
        const result = await op.apply(null, args);
        return result;
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
        if (!(terminal instanceof Shape) && terminal !== null && terminal !== undefined) {
          throw Error(
            `Expected Shape but received ${JSON.stringify(
              terminal
            )} of type ${typeof terminal} or null (isChain=${terminal.isChain})`
          );
        }
        const result = await op(...args)(terminal);
        return result;
      },
    incomplete
  );
};

class Shape {
  constructor(geometry = assemble$1(), context) {
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
    console.log(`QQ/eagerTransform: ${JSON.stringify(this)} ${this.isChain}`);
    console.log(`QQ/geometry: ${JSON.stringify(this.toGeometry())}`);
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

const isShape = (value) => value instanceof Shape || value.isChain;
Shape.isShape = isShape;

const isFunction = (value) => value instanceof Function;
Shape.isFunction = isFunction;

const isArray = (value) =>
  value instanceof Array;
Shape.isArray = isArray;

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

const registerShapeMethod = (names, op) => {
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

const fromGeometry = Shape.fromGeometry;
const toGeometry$1 = (shape) => shape.toGeometry();

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
    if (arg instanceof Shape) {
      shapes.push(arg);
      shapesAndFunctions.push(arg);
    } else if (arg instanceof Function) {
      functions.push(arg);
      shapesAndFunctions.push(arg);
      func = arg;
    } else if (arg instanceof Array) {
      arrays.push(arg);
    } else if (arg instanceof Object) {
      objects.push(arg);
      object = Object.assign(object, arg);
    }
    if (typeof arg !== 'object' && typeof arg !== 'function') {
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

const X$9 = 0;
const Y$9 = 1;
const Z$8 = 2;

const abs = ([x, y, z]) => [Math.abs(x), Math.abs(y), Math.abs(z)];
const add$2 = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];
const scale$4 = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];
const subtract$3 = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

const computeScale = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [ax - bx, ay - by, az - bz];

const computeMiddle = (c1, c2) => [(c1[X$9] + c2[X$9]) * 0.5, (c1[Y$9] + c2[Y$9]) * 0.5, (c1[Z$8] + c2[Z$8]) * 0.5];

const computeSides = (c1, c2, sides, zag$1 = 0.01) => {
  if (sides) {
    return sides;
  }
  if (zag$1) {
    const diameter = Math.max(...abs(subtract$3(c1, c2)));
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
      // console.log(`QQ/updatePlan/shape.chain: ${shape.chain}`);
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
      // console.log(`QQ/hasCorner1/shape: ${JSON.stringify(shape)}`);
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
const getCorner1 = (geometry) => find(geometry, 'corner1', [0, 0, 0]);
const getCorner2 = (geometry) => find(geometry, 'corner2', [0, 0, 0]);
const getZag = (geometry, otherwise = defaultZag) =>
  find(geometry, 'zag', otherwise);

const defaultZag = 0.01;

const getScale = (geometry) => {
  const corner1 = getCorner1(geometry);
  const corner2 = getCorner2(geometry);
  return [
    scale$4(0.5, subtract$3(corner1, corner2)),
    scale$4(0.5, add$2(corner1, corner2)),
  ];
};

const buildCorners = (x, y, z) => {
  const c1 = [0, 0, 0];
  const c2 = [0, 0, 0];
  if (x instanceof Array) {
    if (x[0] < x[1]) {
      c1[X$9] = x[1];
      c2[X$9] = x[0];
    } else {
      c1[X$9] = x[0];
      c2[X$9] = x[1];
    }
  } else {
    c1[X$9] = x / 2;
    c2[X$9] = x / -2;
  }
  if (y instanceof Array) {
    if (y[0] < y[1]) {
      c1[Y$9] = y[1];
      c2[Y$9] = y[0];
    } else {
      c1[Y$9] = y[0];
      c2[Y$9] = y[1];
    }
  } else {
    c1[Y$9] = y / 2;
    c2[Y$9] = y / -2;
  }
  if (z instanceof Array) {
    if (z[0] < z[1]) {
      c1[Z$8] = z[1];
      c2[Z$8] = z[0];
    } else {
      c1[Z$8] = z[0];
      c2[Z$8] = z[1];
    }
  } else {
    c1[Z$8] = z / 2;
    c2[Z$8] = z / -2;
  }
  return [c1, c2];
};

const Plan = (type) => Shape.fromGeometry(taggedPlan({}, { type }));

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

const toCoordinate = Shape.registerMethod('toCoordinate', (x = 0, y = 0, z = 0) => async (shape) => {
  if (Shape.isFunction(x)) {
    x = await x(shape);
  }
  if (Shape.isShape(x)) {
    const points = x.toPoints();
    if (points.length >= 1) {
      return points[0];
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
});

const toCoordinateOp$5 = Shape.ops.get('toCoordinate');

const Point = Shape.registerShapeMethod('Point', async (...args) =>
  Shape.fromPoint(await toCoordinateOp$5(...args)())
);

const Ref = Shape.registerShapeMethod('Ref', (...args) =>
  Point(...args).ref()
);

const ref = Shape.registerMethod(
  'ref',
  () => (shape) => Shape.fromGeometry(hasTypeReference(shape.toGeometry()))
);

const X$8 = (x = 0) => Ref().x(x);
const Y$8 = (y = 0) => Ref().y(y);
const Z$7 = (z = 0) => Ref().z(z);
const XY = (z = 0) => Ref().z(z);
const XZ = (y = 0) =>
  Ref()
    .rx(-1 / 4)
    .y(y);
const YZ = (x = 0) =>
  Ref()
    .ry(-1 / 4)
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
    (shape) => {
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
      return op(taggedGroup({}, ...walk(shape.toGeometry())), shape);
    }
);

const join = Shape.registerMethod(
  ['add', 'join'],
  (...args) =>
    async (shape) => {
      const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
      return Shape.fromGeometry(
        join$1(
          shape.toGeometry(),
          await shape.toShapesGeometries(shapes),
          modes.includes('exact'),
          modes.includes('noVoid')
        )
      );
    }
);

const absolute = Shape.registerMethod(
  'absolute',
  () => (shape) => Shape.fromGeometry(makeAbsolute(shape.toGeometry()))
);

const and = Shape.registerMethod(
  'and',
  (...args) =>
    async (shape) =>
      Shape.fromGeometry(
        taggedGroup(
          {},
          await shape.toGeometry(),
          ...(await shape.toShapesGeometries(args))
        )
      )
);

const addTo = Shape.registerMethod(
  'addTo',
  (other) => (shape) => other.add(shape)
);

const X$7 = 0;
const Y$7 = 1;
const Z$6 = 2;

const subtract$2 = ([ax, ay, az], [bx, by, bz]) => [ax - bx, ay - by, az - bz];

// Round to the nearest 0.001 mm

const round = (v) => Math.round(v * 1000) / 1000;

const roundCoordinate = ([x, y, z]) => [round(x), round(y), round(z)];

const computeOffset = (spec = 'xyz', origin = [0, 0, 0], shape) =>
  shape.size(({ max, min, center }) => (shape) => {
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
              offset[X$7] = -min[X$7];
              index += 1;
              break;
            case '<':
              offset[X$7] = -max[X$7];
              index += 1;
              break;
            default:
              offset[X$7] = -center[X$7];
          }
          break;
        }
        case 'y': {
          switch (spec[index]) {
            case '>':
              offset[Y$7] = -min[Y$7];
              index += 1;
              break;
            case '<':
              offset[Y$7] = -max[Y$7];
              index += 1;
              break;
            default:
              offset[Y$7] = -center[Y$7];
          }
          break;
        }
        case 'z': {
          switch (spec[index]) {
            case '>':
              offset[Z$6] = -min[Z$6];
              index += 1;
              break;
            case '<':
              offset[Z$6] = -max[Z$6];
              index += 1;
              break;
            default:
              offset[Z$6] = -center[Z$6];
          }
          break;
        }
      }
    }
    if (!offset.every(isFinite)) {
      console.log(JSON.stringify(shape.toGeometry));
      throw Error(`Non-finite/offset: ${offset}`);
    }
    return offset;
  });

const align = Shape.registerMethod(
  'align',
  (spec = 'xyz', origin = [0, 0, 0]) =>
    (shape) => {
      console.log(`QQ/align: ${spec} ${origin} ${JSON.stringify(shape)}`);
      const offset = computeOffset(spec, origin, shape);
      console.log(`QQ/align/offset: ${offset}`);
      const reference = Point().move(...subtract$2(offset, origin));
      return reference;
    }
);

Shape.registerMethod('align', align);

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
    (shape) =>
      Shape.fromGeometry(
        taggedItem(
          { tags: names.map((name) => `item:${name}`) },
          shape.toGeometry()
        )
      )
);

// Constructs an item, as a part, from the designator.
const asPart = Shape.registerMethod(
  'asPart',
  (partName) => (shape) =>
    Shape.fromGeometry(
      taggedItem({ tags: [`part:${partName}`] }, shape.toGeometry())
    )
);

const toShape = Shape.registerMethod('toShape', (value) => async (shape) => {
  // console.log(`QQ/toShape/1`);
  value = await value;
  // console.log(`QQ/toShape/2`);
  if (Shape.isFunction(value)) {
    value = await value(shape);
  }
  // console.log(`QQ/toShape/3`);
  if (Shape.isShape(value)) {
    return value;
  } else {
    throw Error(`Expected Function or Shape. Received: ${value.constructor.name}`);
  }
});

const toShapeOp$1 = Shape.ops.get('toShape');
let toShapesOp$2;

const toShapes$1 = Shape.registerMethod('toShapes', (value) => async (shape) => {
  // console.log(`QQ/toShapes: ${'' + value}`);
  if (Shape.isFunction(value)) {
    // console.log(`QQ/toShapes/0: ${'' + value}`);
    value = await value(shape);
  }
  if (Shape.isShape(value)) {
    if (value.toGeometry().type === 'group') {
      const out = [];
      for (const geometry of value.toGeometry().content) {
        out.push(Shape.fromGeometry(geometry));
      }
      return out;
    }
  }
  if (Shape.isArray(value)) {
    const out = [];
    for (const item of value) {
      if (item === undefined) {
        continue;
      }
      out.push(...(await toShapesOp$2(item)(shape)));
    }
    return out;
  } else {
    return [await toShapeOp$1(value)(shape)];
  }
});

toShapesOp$2 = Shape.ops.get('toShapes');

const transform = Shape.registerMethod(
  'transform',
  (matrix) => async (shape) =>
    Shape.fromGeometry(transform$1(matrix, await shape.toGeometry()))
);

const toShapesOp$1 = Shape.ops.get('toShapes');

const at = Shape.registerMethod('at', (...args) => async (shape) => {
  const { shapesAndFunctions: ops } = destructure(args);
  const { local, global } = getInverseMatrices(shape.toGeometry());
  const selections = await toShapesOp$1(ops.shift())(shape);
  for (const selection of selections) {
    const { local: selectionLocal, global: selectionGlobal } =
      getInverseMatrices(selection.toGeometry());
    shape =
      await transform(local)
      .transform(selectionGlobal)
      .op(...ops)
      .transform(selectionLocal)
      .transform(global)(shape);
  }
  return shape;
});

const normal = Shape.registerMethod(
  'normal',
  () => async (shape) => Shape.fromGeometry(computeNormal((await shape).toGeometry()))
);

const isNotString = (value) => typeof value !== 'string';

const toCoordinateOp$4 = Shape.ops.get('toCoordinate');

// This interface is a bit awkward.
const extrudeAlong = Shape.registerMethod(
  'extrudeAlong',
  (direction, ...args) =>
    async (shape) => {
      console.log(`QQ/extrudeAlong/shape: ${JSON.stringify(shape)}`);
      const { strings: modes, values: extents } = destructure(args);
      let vector;
      try {
        // This will fail on ghost geometry.
        vector = await toCoordinateOp$4(direction)(shape);
      } catch (e) {
        console.log(`QQ/extrudeAlong/error: ${e.stack}`);
        throw e;
        // TODO: Be more selective.
        // return Shape.Group();
      }
      const heights = extents
        .filter(isNotString)
        .map((extent) => Shape.toValue(extent, shape));
      if (heights.length % 2 === 1) {
        heights.push(0);
      }
      heights.sort((a, b) => a - b);
      console.log(`QQ/extrudeAlong/heights: ${JSON.stringify(heights)}`);
      const extrusions = [];
      while (heights.length > 0) {
        const height = heights.pop();
        const depth = heights.pop();
        if (height === depth) {
          // Return unextruded geometry at this height, instead.
          extrusions.push(await shape.moveAlong(vector, height));
          continue;
        }
        console.log(`QQ/shape: ${shape}`);
        console.log(`QQ/shape.isChain: ${shape.isChain}`);
        const g1 = (await Point().moveAlong(vector, height)).toGeometry();
        console.log(`QQ/g1.isChain: ${g1.isChain}`);
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
      return Shape.Group(...extrusions);
    }
);

// Note that the operator is applied to each leaf geometry by default.
const e = (...extents) =>
  Shape.registerMethod('e', extrudeAlong(normal(), ...extents));

const extrudeX = Shape.registerMethod(['extrudeX', 'ex'], (...extents) => (shape) =>
  extrudeAlong(Point(1, 0, 0), ...extents)(shape)
);

const ex = extrudeX;

const extrudeY = Shape.registerMethod(['extrudeY', 'ey'], (...extents) => (shape) =>
  extrudeAlong(Point(0, 1, 0), ...extents)(shape)
);

const ey = extrudeY;

const extrudeZ = Shape.registerMethod(['extrudeZ', 'ez'], (...extents) => (shape) =>
  extrudeAlong(Point(0, 0, 1), ...extents)(shape)
);

const ez = extrudeZ;

// rx is in terms of turns -- 1/2 is a half turn.
const rx = Shape.registerMethod(
  ['rotateX', 'rx'],
  (...turns) =>
    (shape) =>
      Shape.Group(
        ...shape
          .toFlatValues(turns)
          .map((turn) => shape.transform(fromRotateXToTransform(turn)))
      )
);

const rotateX = rx;

// ry is in terms of turns -- 1/2 is a half turn.
const ry = Shape.registerMethod(
  ['rotateY', 'ry'],
  (...turns) =>
    (shape) =>
      Shape.Group(
        ...shape
          .toFlatValues(turns)
          .map((turn) => shape.transform(fromRotateYToTransform(turn)))
      )
);

const rotateY = ry;

const toCoordinateOp$3 = Shape.ops.get('toCoordinate');

const Edge = Shape.registerShapeMethod(
  'Edge',
  async (source = 0, target = [0, 0, 1], normal = [1, 0, 0]) => {
    const s = await toCoordinateOp$3(source)();
    const t = await toCoordinateOp$3(target)();
    const n = await toCoordinateOp$3(normal)();
    const inverse = fromSegmentToInverseTransform([s, t], n);
    const baseSegment = [
      transformCoordinate(s, inverse),
      transformCoordinate(t, inverse),
    ];
    const matrix = invertTransform(inverse);
    return Shape.fromGeometry(taggedSegments({ matrix }, [baseSegment]));
  }
);

const toShapesOp = Shape.ops.get('toShapes');

const toShapesGeometries = Shape.registerMethod('toShapesGeometries', (value) => async (shape) => {
  const shapes = await toShapesOp(value)(shape);
  const geometries = [];
  for (const shape of shapes) {
    geometries.push(await shape.toGeometry());
  }
  return geometries;
});

const toShapesGeometriesOp$2 = Shape.ops.get('toShapesGeometries');

const Loop = Shape.registerShapeMethod('Loop', async (...shapes) =>
  Shape.fromGeometry(
    link$1(await toShapesGeometriesOp$2(shapes)(null), /* close= */ true)
  )
);

const loop = Shape.registerMethod(
  'loop',
  (...shapes) =>
    async (shape) =>
      Loop(shape, ...(await shape.toShapes(shapes)))
);

const X$6 = 0;
const Y$6 = 1;
const Z$5 = 2;

let fundamentalShapes;

const buildFs = async () => {
  if (fundamentalShapes === undefined) {
    // console.log(`QQ/fs/Loop.isChain: ${Loop.isChain}`);
    const f = await Loop(
      Point(1, 0, 0),
      Point(1, 1, 0),
      Point(0, 1, 0),
      Point(0, 0, 0)
    ).fill();
    // console.log(`QQ/fs/fq: ${'' + fq}`);
    // console.log(`QQ/fs/fq.isChain: ${fq.isChain}`);
    // console.log(`QQ/f: ${JSON.stringify(f)} isChain: ${f.isChain}`);
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
      box: await f.ez(1),
    };
  }
  return fundamentalShapes;
};

const reifyBox = async (corner1, corner2) => {
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
          console.log(`QQQQ/tlf`);
          return fs.tlfBox.move(left, front, bottom);
        } else {
          console.log(`QQQQ/tl`);
          return fs
            .tlBox.sy(back - front)
            .move(left, front, bottom);
        }
      } else {
        if (front === back) {
          console.log(`QQQQ/tf`);
          return fs
            .tfBox.sx(right - left)
            .move(left, front, bottom);
        } else {
          console.log(`QQQQ/t`);
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
          console.log(`QQQQ/lf`);
          return fs
            .lfBox.sz(top - bottom)
            .move(left, front, bottom);
        } else {
          return fs
            .lBox.sz(top - bottom)
            .sy(back - front)
            .move(left, front, bottom);
        }
      } else {
        if (front === back) {
          console.log(`QQQQ/f`);
          return fs
            .fBox.sz(top - bottom)
            .sx(right - left)
            .move(left, front, bottom);
        } else {
          console.log(`QQQQ/x`);
          return fs
            .box.sz(top - bottom)
            .sx(right - left)
            .sy(back - front)
            .move(left, front, bottom);
        }
      }
    }
  };

  return (await build()).absolute();
};

// Shape.registerReifier('Box', reifyBox);

const Box = Shape.registerShapeMethod('Box', async (x = 1, y = x, z = 0) => {
  const [c1, c2] = buildCorners(x, y, z);
  return reifyBox(c1, c2);
});

const Empty = Shape.registerShapeMethod('Empty', (...shapes) =>
  Shape.fromGeometry(taggedGroup({}))
);

const add$1 = ([ax = 0, ay = 0, az = 0], [bx = 0, by = 0, bz = 0]) => [
  ax + bx,
  ay + by,
  az + bz,
];

const bb = Shape.registerMethod(
  'bb',
  (xOffset = 1, yOffset = xOffset, zOffset = yOffset) =>
    (shape) => {
      const geometry = shape.toGeometry();
      const bounds = measureBoundingBox(geometry);
      if (bounds === undefined) {
        return Empty();
      } else {
        const [min, max] = bounds;
        return Box()
          .hasC2(...add$1(min, [-xOffset, -yOffset, -zOffset]))
          .hasC1(...add$1(max, [xOffset, yOffset, zOffset]));
      }
    }
);

const bend = Shape.registerMethod(
  'bend',
  (radius = 100) =>
    (shape) =>
      Shape.fromGeometry(bend$1(shape.toGeometry(), radius))
);

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
      shape.get('part:*').tags('part', op)
);

const toShapesGeometriesOp$1 = Shape.ops.get('toShapesGeometries');

const Group = Shape.registerShapeMethod('Group', async (...shapes) =>
  Shape.fromGeometry(
    taggedGroup({}, ...(await toShapesGeometriesOp$1(shapes)(null)))
  )
);

const by = Shape.registerMethod(
  'by',
  (selection, ...ops) =>
    async (shape) => {
      if (ops.length === 0) {
        ops.push((local) => local);
      }
      ops = ops.map((op) => (op instanceof Function ? op : () => op));
      // We've already selected the item for reference, e.g., s.to(g('plate'), ...);
      if (Shape.isFunction(selection)) {
        selection = selection(shape);
      }
      const placed = [];
      console.log(`QQ/by/selection: ${JSON.stringify(selection)}`);
      for (const leaf of getLeafs((await selection).toGeometry())) {
        const { global } = getInverseMatrices(leaf);
        // Perform the operation then place the
        // result in the global frame of the reference.
        placed.push(await shape.op(...ops).transform(global));
      }
      return Group(...placed);
    }
);

const center = Shape.registerMethod(
  'center',
  () => (shape) => Shape.fromGeometry(computeCentroid(shape.toGeometry()))
);

const Hull = Shape.registerShapeMethod('Hull', (...shapes) =>
  Shape.fromGeometry(
    convexHull(shapes.map((other) => Shape.toShape(other).toGeometry()))
  )
);

const hull = Shape.registerMethod(
  'hull',
  (...shapes) =>
    (shape) =>
      Hull(...shape.toShapes(shapes))
);

const Join = Shape.registerShapeMethod('Join', (...shapes) =>
  Shape.fromGeometry(fuse$1(Group(...shapes).toGeometry()))
);

const ChainHull = Shape.registerShapeMethod('ChainHull', (...shapes) => {
  const chain = [];
  for (let nth = 1; nth < shapes.length; nth++) {
    chain.push(Hull(shapes[nth - 1], shapes[nth]));
  }
  return Join(...chain);
});

const chainHull = Shape.registerMethod(
  'chainHull',
  (...shapes) =>
    (shape) =>
      ChainHull(...Shape.toShapes(shapes, shape))
);

const clean = Shape.registerMethod(
  'clean',
  () => (shape) => Shape.fromGeometry(noGhost(shape.toGeometry()))
);

const Clip = Shape.registerShapeMethod('Clip', (shape, ...shapes) =>
  shape.clip(...shapes)
);

const clip = Shape.registerMethod('clip', (...args) => async (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    clip$1(
      shape.toGeometry(),
      await shape.toShapesGeometries(shapes),
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid')
    )
  );
});

const clipFrom = Shape.registerMethod(
  'clipFrom',
  (other) => (shape) => other.clip(shape)
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
  (name) => async (shape) => await untag('color:*').tag(...toTagsFromName(name))(shape)
);

const copy = Shape.registerMethod('copy', (count) => (shape) => {
  const copies = [];
  const limit = shape.toValue(count);
  for (let nth = 0; nth < limit; nth++) {
    copies.push(shape);
  }
  return Group(...copies);
});

const cut = Shape.registerMethod('cut', (...args) => async (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    cut$1(
      shape.toGeometry(),
      await shape.toShapesGeometries(shapes),
      modes.includes('open'),
      modes.includes('exact'),
      modes.includes('noVoid')
    )
  );
});

const cutFrom = Shape.registerMethod('cutFrom', (...args) => async (shape) => {
  const { shapesAndFunctions: others, strings: modes } = destructure(args);
  if (others.length !== 1) {
    throw Error(`cutFrom requires one shape or function.`);
  }
  const [other] = others;
  return cut(shape, ...modes)(await shape.toShape(other));
});

const cutOut = Shape.registerMethod('cutOut', (...args) => (shape) => {
  const {
    shapesAndFunctions: others,
    functions,
    strings: modes,
  } = destructure(args);
  const [cutOp = (shape) => shape, clipOp = (shape) => shape, groupOp = Group] =
    functions;
  const other = shape.toShape(others[0]);
  return groupOp(
    shape.cut(other, ...modes).op(cutOp),
    shape.clip(other, ...modes).op(clipOp)
  );
});

const deform = Shape.registerMethod('deform', (...args) => (shape) => {
  const { shapesAndFunctions: selections, object: options } = destructure(args);
  const { iterations, tolerance, alpha } = options;
  return Shape.fromGeometry(
    deform$1(
      shape.toGeometry(),
      selections.map((selection) => shape.toShape(selection).toGeometry()),
      iterations,
      tolerance,
      alpha
    )
  );
});

// TODO: Rename clean at the lower levels.
const demesh = Shape.registerMethod(
  'demesh',
  (options) => (shape) =>
    Shape.fromGeometry(demesh$1(shape.toGeometry(), options))
);

const disjoint = Shape.registerMethod(
  'disjoint',
  (...args) =>
    (shape) => {
      const { strings: modes } = destructure(args);
      return fromGeometry(
        disjoint$1(
          [shape.toGeometry()],
          modes.includes('backward') ? 0 : 1,
          modes.includes('exact')
        )
      );
    }
);

const ghost = Shape.registerMethod(
  'ghost',
  () => async (shape) => {
    console.log(`QQ/ghost/before: ${JSON.stringify(shape)}`);
    const result = Shape.fromGeometry(hasTypeGhost(await shape.toGeometry()));
    console.log(`QQ/ghost/after: ${JSON.stringify(result)}`);
    return result;
  }
);

const on = Shape.registerMethod('on', (selection, ...ops) => async (shape) => {
  console.log(`QQ/on/1`);
  ops = ops.map((op) => (Shape.isFunction(op) ? op : () => op));
  console.log(`QQ/on/2`);
  // We've already selected the item to replace, e.g., s.on(g('plate'), ...);
  // FIX: This needs to walk through items.
  // selection may or may not have a context. waiting on it will require a context.
  const resolvedSelection = await shape.toShape(selection(shape));
  console.log(`QQ/on/3`);
  const selectionGeometry = resolvedSelection.toGeometry();
  console.log(`QQ/on/3/selectionGeometry: ${JSON.stringify(selectionGeometry)}`);
  const inputLeafs = getLeafs(selectionGeometry);
  console.log(`QQ/on/4`);
  const outputLeafs = [];
  for (const geometry of inputLeafs) {
    const global = geometry.matrix;
    const local = invertTransform(global);
    const target = Shape.fromGeometry(geometry);
    // Switch to the local coordinate space, perform the operation, and come back to the global coordinate space.
    // FIXME: op may be async.
    console.log(`QQ/on/5: ${JSON.stringify(geometry)}`);
    const a = transform(local);
    const b = a.op(...ops);
    const c = b.transform(global);
    const r = await c(target);
    outputLeafs.push(r.toGeometry());
  }  console.log(`QQ/on/6: ${JSON.stringify(shape.toGeometry())}`);
  const result = Shape.fromGeometry(replacer(inputLeafs, outputLeafs)(selectionGeometry));
  console.log(`QQ/on/result: ${JSON.stringify(result)}`);
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
      rendered.push(Shape.fromSegments(segments).x(xOffset));
    }
    xOffset += hersheyWidth[code] || 0;
  }
  return Group(...rendered).scale(1 / 28);
};

const Hershey = Shape.registerShapeMethod('Hershey', (text, size) => toSegments(text).scale(size));

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
  console.log(`QQ/buildLayout: ${JSON.stringify(layer)}`);
  const itemNames = (await layer.getNot('type:ghost').tags('item', list))
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
    .and(Group(...title).move(pageWidth / -2, (pageLength * (1 + labelScale)) / 2))
    .color('red')
    .ghost();
  let layout = Shape.chain(Shape.fromGeometry(
    taggedLayout(
      { size, margin },
      await layer.toDisplayGeometry(),
      await visualization.toDisplayGeometry()
    )
  ));
  if (center) {
    layout = layout.by(align());
  }
  return layout;
};

const Page = Shape.registerShapeMethod('Page', async (...args) => {
  const {
    object: options,
    strings: modes,
    shapesAndFunctions: shapes,
  } = destructure(args);
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
  console.log(`QQ/shapes.length: ${shapes.length}`);
  console.log(`QQ/shapes: ${JSON.stringify(shapes)}`);
  console.log(`QQ/shapes.then: ${shapes.then}`);
  for (const shape of shapes) {
    console.log(`QQ/shapes/shape: ${JSON.stringify(shape)}`);
    for (const leaf of getLeafs(await shape.toGeometry())) {
      layers.push(leaf);
    }
  }
  console.log(`QQ/layers.length: ${layers.length}`);
  if (!pack && size) {
    console.log(`QQ/Page/00`);
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
    console.log(`QQ/Page/01`);
    const layer = Shape.fromGeometry(taggedGroup({}, ...layers));
    console.log(`QQ/Page/layer: ${JSON.stringify(layer)}`);
    const packSize = measureBoundingBox(await layer.toGeometry());
    if (packSize === undefined) {
      console.log(`QQ/Page/01/a`);
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
      console.log(`QQ/Page/01/b`);
      return buildLayout({
        layer,
        pageWidth,
        pageLength,
        margin,
        center,
      });
    } else {
      console.log(`QQ/Page/01/c`);
      return buildLayout({
        layer,
        pageWidth: 0,
        pageLength: 0,
        margin,
        center,
      });
    }
  } else if (pack && size) {
    console.log(`QQ/Page/02`);
    // Content fits to page size.
    const packSize = [];
    const content = Shape.fromGeometry(taggedGroup({}, ...layers)).pack({
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
      for (const layer of content.get('pack:layout', List)) {
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
    console.log(`QQ/Page/03`);
    const packSize = [];
    // Page fits to content size.
    const contents = await Shape.fromGeometry(taggedGroup({}, ...layers)).pack({
      pageMargin,
      itemMargin,
      perLayout: itemsPerPage,
      packSize,
    });
    if (packSize.length === 0) {
      console.log(`QQ/layers.length/2: ${layers.length}`);
      throw Error('Packing failed');
    }
    // FIX: Using content.size() loses the margin, which is a problem for repacking.
    // Probably page plans should be generated by pack and count toward the size.
    const pageWidth = packSize[MAX][X$5] - packSize[MIN][X$5];
    const pageLength = packSize[MAX][Y$5] - packSize[MIN][Y$5];
    if (isFinite(pageWidth) && isFinite(pageLength)) {
      const plans = [];
      console.log(`QQ/contents: ${contents}`);
      for (const layer of contents.get('pack:layout', List)) {
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
      Page(shape, ...args)
);

const ensurePages = async (shape, depth = 0) => {
  console.log(`QQ/ensurePages: ${JSON.stringify(shape)}`);
  const pages = getLayouts(await shape.toDisplayGeometry());
  if (pages.length === 0 && depth === 0) {
    console.log(`QQ/ensurePages/0`);
    return ensurePages(await Page({ pack: false }, shape), depth + 1);
  } else {
    console.log(`QQ/ensurePages/1: ${pages.length} ${depth}`);
    return pages;
  }
};

const each = Shape.registerMethod('each', (...args) => async (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [leafOp = (l) => l, groupOp = Group] = shapesAndFunctions;
  if (leafOp instanceof Shape) {
    const leafShape = leafOp;
    leafOp = (edge) => leafShape.to(edge);
  }
  const leafShapes = getLeafs(shape.toGeometry()).map((leaf) =>
    leafOp(Shape.fromGeometry(leaf))
  );
  const grouped = groupOp(...leafShapes);
  if (grouped instanceof Function) {
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

const subtract$1 = ([ax, ay, az], [bx, by, bz]) => [
  ax - bx,
  ay - by,
  az - bz,
];

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
        faceOp = (e, f) => (s) => e,
        groupOp = Group,
      ] = shapesAndFunctions;
      if (Shape.isShape(edgeOp)) {
        const edgeShape = edgeOp;
        edgeOp = (edge) => (shape) => edgeShape.to(edge);
      }
      const faces = [];
      const faceEdges = [];
      eachFaceEdges(
        await shape.toShapeGeometry(shape),
        await shape.toShapesGeometries(selections),
        (faceGeometry, edgeGeometry) => {
          faceEdges.push({ faceGeometry, edgeGeometry });
        });
      for (const { faceGeometry, edgeGeometry } of faceEdges) {
          const { matrix, segments, normals } = edgeGeometry;
          const edges = [];
          if (segments) {
            for (let nth = 0; nth < segments.length; nth++) {
              const segment = segments[nth];
              const absoluteSegment = [
                transformCoordinate(segment[SOURCE], matrix),
                transformCoordinate(segment[TARGET], matrix),
              ];
              const absoluteOppositeSegment = [
                transformCoordinate(segment[TARGET], matrix),
                transformCoordinate(segment[SOURCE], matrix),
              ];
              const absoluteNormal = normals
                ? subtract$1(
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
                  Shape.fromGeometry(
                    taggedSegments({ matrix: inverseMatrix }, [baseSegment])
                  ),
                  length(segment[SOURCE], segment[TARGET]),
                  Shape.fromGeometry(
                    taggedSegments({ matrix: oppositeInverseMatrix }, [
                      oppositeSegment,
                    ])
                  )
                )(shape)
              );
            }
          }
          faces.push(
            await faceOp(await Group(...edges), Shape.fromGeometry(faceGeometry))(shape)
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

const eachPoint = Shape.registerMethod(
  'eachPoint',
  (...args) =>
    (shape) => {
      const { shapesAndFunctions } = destructure(args);
      let [pointOp = (point) => (shape) => point, groupOp = Group] =
        shapesAndFunctions;
      if (pointOp instanceof Shape) {
        const pointShape = pointOp;
        pointOp = (point) => (shape) => pointShape.by(point);
      }
      const points = [];
      let nth = 0;
      eachPoint$1(shape.toGeometry(), ([x = 0, y = 0, z = 0]) =>
        points.push(pointOp(Point().move(x, y, z), nth++)(shape))
      );
      const grouped = groupOp(...points);
      if (grouped instanceof Function) {
        return grouped(shape);
      } else {
        return grouped;
      }
    }
);

// TODO: deprecate.
const edit = Shape.registerMethod(
  'edit',
  (editId) => (shape) => shape.untag('editId:*').tag(`editId:${editId}`)
);

const edges = Shape.registerMethod('edges', (...args) => (shape) => {
  const { shapesAndFunctions, object: options = {} } = destructure(args);
  const { selections = [] } = options;
  let [edgesOp = (edges) => edges, groupOp = Group] = shapesAndFunctions;
  if (edgesOp instanceof Shape) {
    const edgesShape = edgesOp;
    edgesOp = (edges) => edgesShape.to(edges);
  }
  const edges = [];
  eachFaceEdges(
    Shape.toShape(shape, shape).toGeometry(),
    shape.toShapes(selections).map((selection) => selection.toGeometry()),
    (faceGeometry, edgeGeometry) => {
      if (edgeGeometry) {
        edges.push(edgesOp(Shape.fromGeometry(edgeGeometry)));
      }
    }
  );
  const grouped = groupOp(...edges);
  if (grouped instanceof Function) {
    return grouped(shape);
  } else {
    return grouped;
  }
});

const eachEdgeOp = Shape.ops.get('eachEdge');

const faces = Shape.registerMethod('faces', (...args) => async (shape) => {
  const { shapesAndFunctions } = destructure(args);
  let [faceOp = (face) => face, groupOp = Group] = shapesAndFunctions;
  if (Shape.isShape(faceOp)) {
    const faceShape = faceOp;
    faceOp = (face) => faceShape.to(face);
  }
  return eachEdgeOp(
    (e, l) => (s) => e,
    (e, f) => (s) => faceOp(f),
    groupOp
  )(shape);
});

const fill = Shape.registerMethod(
  ['fill', 'f'],
  () => (shape) => Shape.fromGeometry(fill$1(shape.toGeometry()))
);

const assemble = async (modes, ...shapes) => {
  shapes = shapes.filter((shape) => shape !== undefined);
  return fromGeometry(
    disjoint$1(shapes.map(toGeometry$1), undefined, modes.includes('exact'))
  );
};

const fit = Shape.registerMethod('fit', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return (shape) =>
    assemble(
      modes,
      ...shapes.map((other) => Shape.toShape(other, shape)),
      shape
    );
});

const fitTo = Shape.registerMethod('fitTo', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return async (shape) =>
    assemble(
      modes,
      shape,
      ...await shape.toShapes(shapes)
    );
});

const fix = Shape.registerMethod(
  'fix',
  () => (shape) =>
    Shape.fromGeometry(
      fix$1(shape.toGeometry(), /* removeSelfIntersections= */ true)
    )
);

const flat = Shape.registerMethod(
  'flat',
  () => (shape) => shape.to(XY())
);

const origin = Shape.registerMethod(['origin', 'o'], () => (shape) => {
  const { local } = getInverseMatrices(shape.toGeometry());
  return Point().transform(local);
});

const o = origin;

const fuse = Shape.registerMethod('fuse', (...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return fromGeometry(
    fuse$1(Group(shape, ...shapes).toGeometry(), modes.includes('exact'))
  );
});

const get = Shape.registerMethod(['get', 'g'], (...args) => (shape) => {
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
  const geometry = shape.toGeometry();
  visit(geometry, walk);
  return groupOp(...picks);
});

const g = get;

// get, ignoring item boundaries.

const getAll = Shape.registerMethod('getAll', (...args) => (shape) => {
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
  const geometry = shape.toGeometry();
  visit(geometry, walk);
  return groupOp(...picks);
});

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

const getNot = Shape.registerMethod(
  ['getNot', 'gn'],
  (...tags) =>
    (shape) => {
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
      console.log(`QQ/getNot/1`);
      const geometry = shape.toGeometry();
      console.log(`QQ/getNot/2`);
      if (geometry.type === 'item') {
        // FIX: Can we make this less magical?
        // This allows constructions like s.get('a').get('b')
        visit(geometry.content[0], walk);
      } else {
        visit(geometry, walk);
      }
      console.log(`QQ/getNot/3`);
      return Group(...picks);
    }
);

const gn = getNot;

const grow = Shape.registerMethod('grow', (...args) => (shape) => {
  const {
    number: amount,
    string: axes = 'xyz',
    shapesAndFunctions: selections,
  } = destructure(args);
  return Shape.fromGeometry(
    grow$1(
      shape.toGeometry(),
      Point().z(amount).toGeometry(),
      shape.toShapes(selections).map((shape) => shape.toGeometry()),
      {
        x: axes.includes('x'),
        y: axes.includes('y'),
        z: axes.includes('z'),
      }
    )
  );
});

const image = Shape.registerMethod(
  'image',
  (url) => (shape) => shape.untag('image:*').tag(`image:${url}`)
);

const inFn = Shape.registerMethod('in', () => (shape) => {
  const geometry = shape.toGeometry();
  if (geometry.type === 'item') {
    return Shape.fromGeometry(geometry.content[0]);
  } else {
    return shape;
  }
});

const inset = Shape.registerMethod(
  'inset',
  (initial = 1, { segments = 16, step, limit } = {}) =>
    (shape) =>
      Shape.fromGeometry(
        inset$1(shape.toGeometry(), initial, step, limit, segments)
      )
);

const involute = Shape.registerMethod(
  'involute',
  () => (shape) => Shape.fromGeometry(involute$1(shape.toGeometry()))
);

const toShapesGeometriesOp = Shape.ops.get('toShapesGeometries');

const Link = Shape.registerShapeMethod('Link', async (...shapes) =>
  Shape.fromGeometry(link$1(await toShapesGeometriesOp(shapes)(null)))
);

const link = Shape.registerMethod(
  'link',
  (...shapes) =>
    (shape) =>
      Link([shape, ...shape.toShapes(shapes)])
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

const fromUndefined = () => Shape.fromGeometry();

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

const loadGeometryNonblocking = (path, options) => {
  logInfo('api/shape/loadGeometryNonblocking', path);
  const geometry = readNonblocking(path, options);
  if (geometry) {
    return Shape.fromGeometry(geometry);
  }
};

const Loft = Shape.registerShapeMethod('Loft', (...args) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Shape.fromGeometry(
    loft$1(
      shapes.map((shape) => shape.toGeometry()),
      !modes.includes('open')
    )
  );
});

const loft = Shape.registerMethod('loft', (...args) => (shape) => {
  const { strings: modes, shapesAndFunctions: shapes } = destructure(args);
  return Loft(...shape.toShapes(shapes), ...modes);
});

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

const log = Shape.registerMethod('log', (text) => async (shape) => {
  if (!text) {
    text = JSON.stringify(await shape.toGeometry());
  }
  const level = 'serious';
  const log = { text, level };
  const hash = computeHash(log);
  console.log(`QQQQ/log: ${text}`);
  emit({ log, hash });
  log$1({ op: 'text', text });
  return shape;
});

const lowerEnvelope = Shape.registerMethod(
  'lowerEnvelope',
  () => (shape) => Shape.fromGeometry(generateLowerEnvelope(shape.toGeometry()))
);

const overlay = Shape.registerMethod(
  'overlay',
  () => (shape) => Shape.fromGeometry(hasShowOverlay(shape.toGeometry()))
);

const mask = Shape.registerMethod(
  'mask',
  (...args) =>
    (shape) =>
      Group(
        ...args.map((arg) => Shape.toShape(arg, shape).void()),
        Shape.fromGeometry(hasTypeMasked(shape.toGeometry()))
      )
);

const masking = Shape.registerMethod(
  'masking',
  (masked) => (shape) =>
    Group(
      shape.void(),
      Shape.fromGeometry(
        hasTypeMasked(Shape.toShape(masked, shape).toGeometry())
      )
    )
);

const material = Shape.registerMethod(
  'material',
  (name) => (shape) => Shape.fromGeometry(hasMaterial(shape.toGeometry(), name))
);

const toCoordinateOp$2 = Shape.ops.get('toCoordinate');
let toCoordinatesOp$1;

const toCoordinates = Shape.registerMethod('toCoordinates', (...args) => async (shape) => {
    const coordinates = [];
    while (args.length > 0) {
      let x = args.shift();
      if (Shape.isFunction(x)) {
        x = await x(shape);
      }
      if (Shape.isShape(x)) {
        if (x.toGeometry().type === 'group') {
          coordinates.push(
            ...await toCoordinatesOp$1(
              ...x
                .toGeometry()
                .content.map((geometry) => Shape.fromGeometry(geometry))
            )(shape)
          );
        } else {
          coordinates.push(await toCoordinateOp$2(x)(shape));
        }
      } else if (Shape.isArray(x)) {
        if (isNaN(x[0]) || isNaN(x[1]) || isNaN(x[2])) {
          for (const element of x) {
            coordinates.push(...await toCoordinatesOp$1(element)(shape));
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
});

toCoordinatesOp$1 = Shape.ops.get('toCoordinates');

const toCoordinatesOp = Shape.ops.get('toCoordinates');

// TODO: Fix toCoordinates.
const move = Shape.registerMethod(
  ['move', 'xyz'],
  (...args) =>
    async (shape) => {
      const results = [];
      for (const coordinate of await toCoordinatesOp(...args)(shape)) {
        results.push(await transform(fromTranslateToTransform(...coordinate))(shape));
      }
      return Group(...results);
    }
);

const xyz = move;

const scale$3 = (amount, [x = 0, y = 0, z = 0]) => [
  x * amount,
  y * amount,
  z * amount,
];

const moveAlong = Shape.registerMethod(
  'moveAlong',
  (direction, ...offsets) =>
    async (shape) => {
      direction = await shape.toCoordinate(direction);
      offsets = offsets.map((extent) => Shape.toValue(extent, shape));
      offsets.sort((a, b) => a - b);
      const moves = [];
      while (offsets.length > 0) {
        const offset = offsets.pop();
        moves.push(shape.move(scale$3(offset, direction)));
      }
      return Shape.Group(...moves);
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
  'noVoid',
  () => (shape) => shape.on(get('type:void'), Empty())
);

const eachOp = Shape.ops.get('each');

const nth = Shape.registerMethod(['nth', 'n'], (...ns) => async (shape) => {
  const candidates = await eachOp(
    (leaf) => leaf,
    (...leafs) =>
      (shape) =>
        leafs
  )(shape);
  return Group(...ns.map((n) => candidates[n]));
});

const n = nth;

const offset = Shape.registerMethod(
  'offset',
  (initial = 1, { segments = 16, step, limit } = {}) =>
    (shape) =>
      Shape.fromGeometry(
        offset$1(shape.toGeometry(), initial, step, limit, segments)
      )
);

const op = Shape.registerMethod(
  'op',
  (...fns) =>
    (shape) =>
      Group(
        ...fns
          .filter((fn) => fn)
          .map((fn) => (fn instanceof Function ? fn(shape) : fn))
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
    (shape) => {
      const { local } = getInverseMatrices(shape.toGeometry());
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
    (shape) => {
      if (perLayout === 0) {
        // Packing was disabled -- do nothing.
        console.log(`QQ/packed/early: ${JSON.stringify(shape)}`);
        return shape;
      }

      let todo = [];
      for (const leaf of getLeafs(shape.toGeometry())) {
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
            console.log(`QQ/packed: ${JSON.stringify(packed)}`);
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
      console.log(
        `QQ/packed: ${JSON.stringify(packedShape)} ${packedShape.isChain}`
      );
      return packedShape;
    }
);

const points$1 = Shape.registerMethod('points', () => (shape) => {
  const points = [];
  eachPoint$1(
    Shape.toShape(shape, shape).toGeometry(),
    ([x = 0, y = 0, z = 0, exact]) => points.push([x, y, z, exact])
  );
  return Shape.fromGeometry(taggedPoints({}, points));
});

const remesh = Shape.registerMethod('remesh', (...args) => (shape) => {
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
      shape.toGeometry(),
      shape.toShapes(selections).map((selection) => selection.toGeometry()),
      iterations,
      relaxationSteps,
      targetEdgeLength
    )
  );
});

// rz is in terms of turns -- 1/2 is a half turn.
const rz = Shape.registerMethod(
  ['rotateZ', 'rz'],
  (...turns) =>
    (shape) =>
      Shape.Group(
        ...shape
          .toFlatValues(turns)
          .map((turn) => shape.transform(fromRotateZToTransform(turn)))
      )
);

const rotateZ = rz;

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
      return { geometry: await store(data.toGeometry()) };
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
  Shape.fromGeometry(await write$1(path, shape.toGeometry()));

const saveGeometryNonblocking = (path, shape) => {
  Shape.fromGeometry(writeNonblocking(path, shape.toGeometry()));
  throw new ErrorWouldBlock('Save Geometry');
};

const scale$1 = Shape.registerMethod(
  'scale',
  (x = 1, y = x, z = y) =>
    async (shape) => {
      [x = 1, y = x, z] = await shape.toCoordinate(x, y, z);
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
      if (negatives % 2) {
        // Compensate for inversion.
        return (await shape).eagerTransform(fromScaleToTransform(x, y, z)).involute();
      } else {
        return (await shape).eagerTransform(fromScaleToTransform(x, y, z));
      }
    }
);

const scaleX = Shape.registerMethod(
  ['scaleX', 'sx'],
  (...x) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(x).map((x) => scale$1(x, 1, 1)(shape)))
);

const sx = scaleX;

const scaleY = Shape.registerMethod(
  ['scaleY', 'sy'],
  (...y) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(y).map((y) => scale$1(1, y, 1)(shape)))
);

const sy = scaleY;

const scaleZ = Shape.registerMethod(
  ['scaleZ', 'sz'],
  (...z) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(z).map((z) => scale$1(1, 1, z)(shape)))
);

const sz = scaleZ;

const scaleToFit = Shape.registerMethod(
  'scaleToFit',
  (x = 1, y = x, z = y) =>
    (shape) => {
      const { length, width, height } = shape.size();
      const xFactor = x / length;
      const yFactor = y / width;
      const zFactor = z / height;
      // Surfaces may get non-finite factors -- use the unit instead.
      const finite = (factor) => (isFinite(factor) ? factor : 1);
      return shape.scale(finite(xFactor), finite(yFactor), finite(zFactor));
    }
);

const seam = Shape.registerMethod('seam', (...args) => (shape) => {
  const { shapesAndFunctions: selections } = destructure(args);
  return Shape.fromGeometry(
    seam$1(
      shape.toGeometry(),
      shape.toShapes(selections).map((shape) => shape.toGeometry())
    )
  );
});

const baseSection =
  ({ profile = false } = {}, orientations) =>
  (shape) => {
    orientations = orientations
      .flatMap((orientation) => Shape.toShapes(orientation, shape))
      .flatMap((orientation) => Shape.toShapes(orientation, shape));
    if (orientations.length === 0) {
      orientations.push(Point());
    }
    return Shape.fromGeometry(
      section$1(
        shape.toGeometry(),
        orientations.map((orientation) => orientation.toGeometry()),
        { profile }
      )
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

const self = Shape.registerMethod('self', () => (shape) => shape);

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

const maybeApply = (value, shape) => {
  if (value instanceof Function) {
    return value(shape);
  } else {
    return value;
  }
};

// This is getting a bit excessively magical.
const seq = Shape.registerMethod('seq', (...args) => (shape) => {
  let op;
  let groupOp;
  let specs = [];
  for (const arg of args) {
    if (arg instanceof Function) {
      if (!op) {
        op = arg;
      } else if (!groupOp) {
        groupOp = arg;
      }
    } else if (arg instanceof Object) {
      specs.push(arg);
    }
  }
  if (!op) {
    op = (n) => n;
  }
  if (!groupOp) {
    groupOp = Group;
  }

  const indexes = [];
  for (const spec of specs) {
    let { from = 0, to = 1, upto, downto, by = 1 } = spec;

    from = Shape.toValue(from, shape);
    to = Shape.toValue(to, shape);
    upto = Shape.toValue(upto, shape);
    downto = Shape.toValue(downto, shape);
    by = Shape.toValue(by, shape);

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
    results.push(maybeApply(op(...args), shape));
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
});

const Seq = Shape.registerShapeMethod('Seq', (...args) =>
  Empty().seq(...args)
);

const serialize = Shape.registerMethod(
  'serialize',
  (op = (v) => v, groupOp = (v, s) => s) =>
    (shape) =>
      groupOp(op(serialize$1(shape.toGeometry())), shape)
);

const setTag = Shape.registerMethod(
  'setTag',
  (tag, value) => (shape) => shape.untag(`${tag}=*`).tag(`${tag}=${value}`)
);

const setTags = Shape.registerMethod(
  'setTags',
  (tags = []) =>
    (shape) =>
      Shape.fromGeometry(rewriteTags(tags, [], undefined.toGeometry()))
);

const shadow = Shape.registerMethod(
  'shadow',
  (planeReference = XY(0), sourceReference = XY(1)) =>
    (shape) =>
      Shape.fromGeometry(
        cast(
          Shape.toShape(planeReference, shape).toGeometry(),
          Shape.toShape(sourceReference, shape).toGeometry(),
          shape.toGeometry()
        )
      )
);

const simplify = Shape.registerMethod(
  'simplify',
  (...args) =>
    (shape) => {
      const { object: options = {}, number: eps } = destructure(args);
      const { ratio = 1.0 } = options;
      return Shape.fromGeometry(
        simplify$1(shape.toGeometry(), ratio, eps)
      );
    }
);

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

const X$3 = 0;
const Y$3 = 1;
const Z$3 = 2;

const size = Shape.registerMethod(
  'size',
  (op = (size) => (shape) => size) =>
    (shape) => {
      const geometry = shape.toGeometry();
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
        })(Shape.fromGeometry(geometry));
      }
      const [min, max] = bounds;
      const length = max[X$3] - min[X$3];
      const width = max[Y$3] - min[Y$3];
      const height = max[Z$3] - min[Z$3];
      const center = scale(0.5, add(min, max));
      const radius = distance(center, max);
      return op({
        length,
        width,
        height,
        max,
        min,
        center,
        radius,
      })(Shape.fromGeometry(geometry));
    }
);

const sketch = Shape.registerMethod(
  'sketch',
  () => (shape) => Shape.fromGeometry(taggedSketch({}, shape.toGeometry()))
);

const smooth = Shape.registerMethod('smooth', (...args) => (shape) => {
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
      shape.toGeometry(),
      shape.toShapes(selections).map((selection) => selection.toGeometry()),
      resolution,
      iterations,
      time,
      remeshIterations,
      remeshRelaxationSteps
    )
  );
});

const X$2 = 0;
const Y$2 = 1;
const Z$2 = 2;

const sort = Shape.registerMethod(
  'sort',
  (spec = 'z<y<x<') =>
    (shape) => {
      let leafs = getLeafs(shape.toGeometry()).map((leaf) => {
        const [min, max] = measureBoundingBox(leaf);
        const shape = Shape.fromGeometry(leaf);
        return { min, max, shape };
      });
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
            axis = X$2;
            break;
          case 'y':
            axis = Y$2;
            break;
          case 'z':
            axis = Z$2;
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

const tags = Shape.registerMethod('tags', (...args) => (shape) => {
  const { string: tag = '*', func: op = (...tags) => note(`tags: ${tags}`) } =
    destructure(args);
  const isMatchingTag = tagMatcher(tag, 'user');
  const collected = [];
  for (const { tags } of getLeafs(shape.toGeometry())) {
    for (const tag of tags) {
      if (isMatchingTag(tag)) {
        collected.push(tag);
      }
    }
  }
  const result = op(...collected)(shape);
  console.log(`QQ/tags/result: ${JSON.stringify(result)}`);
  return result;
});

// Tint adds another color to the mix.
const tint = Shape.registerMethod(
  'tint',
  (name) => (shape) => shape.tag(...toTagsFromName(name))
);

const to = Shape.registerMethod('to', (...references) => async (shape) => {
  const arranged = [];
  console.log(`QQ/to/0`);
  for (const reference of await shape.toShapes(references)) {
    console.log(`QQ/to/1`);
    arranged.push(await by(origin()).by(reference)(shape));
    console.log(`QQ/to/2`);
  }
  return Group(...arranged);
});

const toDisplayGeometry = Shape.registerMethod(
  'toDisplayGeometry',
  () => async (shape) => {
    console.log(`QQ/toDisplayGeometry: ${shape.isChain} geometry ${JSON.stringify(shape.geometry.isChain)}`);
    return toDisplayGeometry$1(await shape.toGeometry());
  }
);

const toShapeOp = Shape.ops.get('toShape');

const toShapeGeometry = Shape.registerMethod('toShapeGeometry', (value) => async (shape) => {
  const valueShape = await toShapeOp(value)(shape);
  return valueShape.toGeometry();
});

const tool = Shape.registerMethod(
  'tool',
  (name) => (shape) =>
    Shape.fromGeometry(
      rewriteTags(toTagsFromName$1(name), [], shape.toGeometry())
    )
);

Shape.registerMethod('toNestedValues', (to) => async (shape) => {
  if (Shape.isFunction(to)) {
    to = await to(shape);
  }
  if (Shape.isArray(to)) {
    const expanded = [];
    for (const value of to) {
      if (Shape.isFunction(value)) {
        expanded.push(...await value(shape));
      } else {
        expanded.push(value);
      }
    }
    return expanded;
  } else {
    return to;
  }
});

const toNestedValuesOp = Shape.ops.get('toNestedValues');
const toCoordinateOp$1 = Shape.ops.get('toCoordinate');

const Edges = Shape.registerShapeMethod('Edges', async (arg) => {
  const segments = [];
  for (const [source, target] of await toNestedValuesOp(arg)(null)) {
    segments.push([await toCoordinateOp$1(source)(null), await toCoordinateOp$1(target)(null)]);
  }
  return Shape.fromSegments(segments);
});

const Points = Shape.registerShapeMethod('Points', (points) =>
  Shape.fromPoints(points.map((arg) => Shape.toCoordinate(undefined, arg)))
);

const lerp = (t, [ax, ay, az], [bx, by, bz]) => [
  ax + t * (bx - ax),
  ay + t * (by - ay),
  az + t * (bz - az),
];

const toolpath = Shape.registerMethod(
  'toolpath',
  ({
      diameter = 1,
      jumpHeight = 1,
      stepCost = diameter * -2,
      turnCost = -2,
      neighborCost = -2,
      stopCost = 30,
      candidateLimit = 1,
      subCandidateLimit = 1,
    } = {}) =>
    (shape) => {
      const toolpath = computeToolpath(shape.toGeometry(), {
        diameter,
        jumpHeight,
        stepCost,
        turnCost,
        neighborCost,
        stopCost,
        candidateLimit,
        subCandidateLimit,
      });
      const cuts = [];
      const jumpEnds = [];
      const cutEnds = [];
      const jumps = [];
      // console.log(JSON.stringify(shape));
      // console.log(JSON.stringify(toolpath));
      for (const { op, from, to } of toolpath.toolpath) {
        if (!from.every(isFinite)) {
          // This is from an unknown position.
          continue;
        }
        switch (op) {
          case 'cut':
            cuts.push([lerp(0.2, from, to), to]);
            cutEnds.push(to);
            break;
          case 'jump':
            jumps.push([lerp(0.2, from, to), to]);
            jumpEnds.push(to);
            break;
        }
      }
      return Group(
        Points(cutEnds).color('red'),
        Edges(cuts).color('red'),
        Points(jumpEnds).color('blue'),
        Edges(jumps).color('blue'),
        Shape.fromGeometry(toolpath)
      );
    }
);

const twist = Shape.registerMethod(
  'twist',
  (turnsPerMm = 1) =>
    (shape) =>
      Shape.fromGeometry(twist$1(shape.toGeometry(), turnsPerMm))
);

const upperEnvelope = Shape.registerMethod(
  'upperEnvelope',
  () => (shape) => Shape.fromGeometry(generateUpperEnvelope(shape.toGeometry()))
);

const applyModes = (shape, options, modes) => {
  if (modes.includes('wireframe')) {
    shape = shape.tag('show:wireframe');
  }
  if (modes.includes('noWireframe')) {
    shape = shape.tag('show:noWireframe');
  }
  if (modes.includes('skin')) {
    shape = shape.tag('show:skin');
  }
  if (modes.includes('noSkin')) {
    shape = shape.tag('show:noSkin');
  }
  if (modes.includes('Outline')) {
    shape = shape.tag('show:outline');
  }
  if (modes.includes('noOutline')) {
    shape = shape.tag('show:noOutline');
  }
  return shape;
};

// FIX: Avoid the extra read-write cycle.
const baseView =
  (viewId, op = (x) => x, options = {}) =>
  async (shape) => {
    console.log(`QQ/baseView`);
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
    const { id, path, nth } = sourceLocation;
    if (viewId === undefined) {
      viewId = nth;
    }
    const displayGeometry = await viewShape.toDisplayGeometry();
    console.log(
      `QQ/baseView/displayGeometry: ${JSON.stringify(displayGeometry)}`
    );
    const pages = await ensurePages(Shape.fromGeometry(displayGeometry));
    console.log(`QQ/baseView/pages: ${JSON.stringify(pages)}`);
    for (const entry of pages) {
      const geometry = await entry;
      const viewPath = `view/${path}/${id}/${viewId}.view`;
      const hash = generateUniqueId();
      const thumbnailPath = `thumbnail/${hash}`;
      const view = {
        viewId,
        width,
        height,
        position,
        inline,
        needsThumbnail: isNode,
      };
      emit({ hash, path: viewPath, view });
      console.log(`QQ/baseView/write: ${viewPath}`);
      console.log(`QQ/baseView/geometry: ${geometry}`);
      console.log(`QQ/baseView/geometry.isChain: ${geometry.isChain}`);
      await write(viewPath, displayGeometry);
      if (!isNode) {
        await write(thumbnailPath, dataUrl(viewShape, view));
      }
    }
    return shape;
  };

Shape.registerMethod('topView', (...args) => (shape) => {
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
  shape = applyModes(shape, options, modes);
  return baseView(viewId, op, options)(shape);
});

Shape.registerMethod(
  'gridView',
  (...args) =>
    (shape) => {
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
      shape = applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

Shape.registerMethod(
  'frontView',
  (...args) =>
    (shape) => {
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
      shape = applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

Shape.registerMethod(
  'sideView',
  (...args) =>
    (shape) => {
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
      shape = applyModes(shape, options, modes);
      return baseView(viewId, op, options)(shape);
    }
);

const view = Shape.registerMethod('view', (...args) => async (shape) => {
  console.log(`QQ/view: ${JSON.stringify(shape)}`);
  const {
    value: viewId,
    func: op = (x) => x,
    object: options,
    strings: modes,
  } = Shape.destructure(args);
  console.log(`QQ/view/shape: ${JSON.stringify(shape)}`);
  shape = applyModes(shape, options, modes);
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

const voidFn = Shape.registerMethod(
  'void',
  () => (shape) =>
    Shape.fromGeometry(hasTypeGhost(hasTypeVoid(shape.toGeometry())))
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
    (shape) => {
      const offset = resolution / 2;
      const geometry = shape.toGeometry();
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

const Voxels = Shape.registerShapeMethod('Voxels', async (...points) => {
  const offset = 0.5;
  const index = new Set();
  const key = (x, y, z) => `${x},${y},${z}`;
  let max = [-Infinity, -Infinity, -Infinity];
  let min = [Infinity, Infinity, Infinity];
  for (const point of points) {
    const [x, y, z] = await toCoordinateOp(point)(null);
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
});

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

const Wrap = Shape.registerShapeMethod(
  'Wrap',
  (offset = 1, alpha = 0.1) =>
    (...shapes) =>
      Group(...shapes).wrap(offset, alpha)
);

const wrap = Shape.registerMethod(
  'wrap',
  (offset = 1, alpha = 0.1) =>
    (shape) =>
      Shape.fromGeometry(
        wrap$1(shape.toGeometry(), shape.getTags(), offset, alpha)
      )
);

const x = Shape.registerMethod(
  'x',
  (...x) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(x).map((x) => move([x, 0, 0])(shape)))
);

const y = Shape.registerMethod(
  'y',
  (...y) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(y).map((y) => move([0, y, 0])(shape)))
);

const z = Shape.registerMethod(
  'z',
  (...z) =>
    (shape) =>
      Shape.Group(...shape.toFlatValues(z).map((z) => move([0, 0, z])(shape)))
);

const Spiral = Shape.registerShapeMethod('Spiral', async (...args) => {
  const { func: particle = Point, object: options } = Shape.destructure(args);
  let particles = [];
  for (const turn of await Seq(
    options,
    (distance) => distance,
    (...numbers) => numbers
  )) {
    particles.push(await particle(turn).rz(turn));
  }
  return Link(particles);
});

const X = 0;
const Y = 1;
const Z = 2;

const reifyArc =
  (axis = Z) =>
  ({ c1, c2, start = 0, end = 1, zag, sides }) => {
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
      spiral = Spiral((t) => Point(1), {
        from: start - 1 / 4,
        upto: end - 1 / 4,
        by: effectiveStep,
      })
        .loop()
        .fill();
    } else {
      spiral = Spiral((t) => Point(1), {
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
          spiral = spiral.ex(left - middle[X], right - middle[X]);
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
          spiral = spiral.ey(front - middle[Y], back - middle[Y]);
        }
        break;
      }
      case Z: {
        scale[Z] = 1;
        spiral = spiral.scale(scale).move(middle);
        if (top !== bottom) {
          spiral = spiral.ez(top - middle[Z], bottom - middle[Z]);
        }
        break;
      }
    }

    return spiral.absolute();
  };

const reifyArcZ = reifyArc(Z);
const reifyArcX = reifyArc(X);
const reifyArcY = reifyArc(Y);

const ArcOp = (type) => (...args) => {
  const { values, object: options } = destructure(args);
  let [x, y, z] = values;
  const { start, end, sides, zag } = options;
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
  const [c1, c2] = buildCorners(x, y, z);
  return reify({ c1, c2, start, end, sides, zag });
};

const Arc = Shape.registerShapeMethod('Arc', ArcOp('Arc'));
const ArcX = Shape.registerShapeMethod('ArcX', ArcOp('ArcX'));
const ArcY = Shape.registerShapeMethod('ArcY', ArcOp('ArcY'));
const ArcZ = Shape.registerShapeMethod('ArcZ', ArcOp('ArcZ'));

const toShapes = Shape.ops.get('toShapes');

const Assembly = Shape.registerShapeMethod('Assembly', async (...args) => {
  const { strings: modes, shapesAndFunctions: unresolvedShapes } =
    destructure(args);
  const [shape, ...shapes] = await toShapes(unresolvedShapes)();
  return fitTo(...modes, ...shapes)(shape);
});

const Cached = (name, thunk, enable = true) => {
  const op = (...args) => {
    if (!enable) {
      return thunk();
    }
    const path = `cached/${name}/${JSON.stringify(args)}`;
    // The first time we hit this, we'll schedule a read and throw, then wait for the read to complete, and retry.
    const cached = loadGeometryNonblocking(path, { errorOnMissing: true });
    if (cached) {
      return cached;
    }
    // The read we scheduled last time produced undefined, so we fall through to here.
    const shape = thunk(...args);
    // This will schedule a write and throw, then wait for the write to complete, and retry.
    saveGeometryNonblocking(path, shape);
    return shape;
  };
  return op;
};

function clone(point) { //TODO: use gl-vec2 for this
    return [point[0], point[1]]
}

function vec2(x, y) {
    return [x, y]
}

var _function = function createBezierBuilder(opt) {
    opt = opt||{};

    var RECURSION_LIMIT = typeof opt.recursion === 'number' ? opt.recursion : 8;
    var FLT_EPSILON = typeof opt.epsilon === 'number' ? opt.epsilon : 1.19209290e-7;
    var PATH_DISTANCE_EPSILON = typeof opt.pathEpsilon === 'number' ? opt.pathEpsilon : 1.0;

    var curve_angle_tolerance_epsilon = typeof opt.angleEpsilon === 'number' ? opt.angleEpsilon : 0.01;
    var m_angle_tolerance = opt.angleTolerance || 0;
    var m_cusp_limit = opt.cuspLimit || 0;

    return function bezierCurve(start, c1, c2, end, scale, points) {
        if (!points)
            points = [];

        scale = typeof scale === 'number' ? scale : 1.0;
        var distanceTolerance = PATH_DISTANCE_EPSILON / scale;
        distanceTolerance *= distanceTolerance;
        begin(start, c1, c2, end, points, distanceTolerance);
        return points
    }


    ////// Based on:
    ////// https://github.com/pelson/antigrain/blob/master/agg-2.4/src/agg_curves.cpp

    function begin(start, c1, c2, end, points, distanceTolerance) {
        points.push(clone(start));
        var x1 = start[0],
            y1 = start[1],
            x2 = c1[0],
            y2 = c1[1],
            x3 = c2[0],
            y3 = c2[1],
            x4 = end[0],
            y4 = end[1];
        recursive(x1, y1, x2, y2, x3, y3, x4, y4, points, distanceTolerance, 0);
        points.push(clone(end));
    }

    function recursive(x1, y1, x2, y2, x3, y3, x4, y4, points, distanceTolerance, level) {
        if(level > RECURSION_LIMIT) 
            return

        var pi = Math.PI;

        // Calculate all the mid-points of the line segments
        //----------------------
        var x12   = (x1 + x2) / 2;
        var y12   = (y1 + y2) / 2;
        var x23   = (x2 + x3) / 2;
        var y23   = (y2 + y3) / 2;
        var x34   = (x3 + x4) / 2;
        var y34   = (y3 + y4) / 2;
        var x123  = (x12 + x23) / 2;
        var y123  = (y12 + y23) / 2;
        var x234  = (x23 + x34) / 2;
        var y234  = (y23 + y34) / 2;
        var x1234 = (x123 + x234) / 2;
        var y1234 = (y123 + y234) / 2;

        if(level > 0) { // Enforce subdivision first time
            // Try to approximate the full cubic curve by a single straight line
            //------------------
            var dx = x4-x1;
            var dy = y4-y1;

            var d2 = Math.abs((x2 - x4) * dy - (y2 - y4) * dx);
            var d3 = Math.abs((x3 - x4) * dy - (y3 - y4) * dx);

            var da1, da2;

            if(d2 > FLT_EPSILON && d3 > FLT_EPSILON) {
                // Regular care
                //-----------------
                if((d2 + d3)*(d2 + d3) <= distanceTolerance * (dx*dx + dy*dy)) {
                    // If the curvature doesn't exceed the distanceTolerance value
                    // we tend to finish subdivisions.
                    //----------------------
                    if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
                        points.push(vec2(x1234, y1234));
                        return
                    }

                    // Angle & Cusp Condition
                    //----------------------
                    var a23 = Math.atan2(y3 - y2, x3 - x2);
                    da1 = Math.abs(a23 - Math.atan2(y2 - y1, x2 - x1));
                    da2 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - a23);
                    if(da1 >= pi) da1 = 2*pi - da1;
                    if(da2 >= pi) da2 = 2*pi - da2;

                    if(da1 + da2 < m_angle_tolerance) {
                        // Finally we can stop the recursion
                        //----------------------
                        points.push(vec2(x1234, y1234));
                        return
                    }

                    if(m_cusp_limit !== 0.0) {
                        if(da1 > m_cusp_limit) {
                            points.push(vec2(x2, y2));
                            return
                        }

                        if(da2 > m_cusp_limit) {
                            points.push(vec2(x3, y3));
                            return
                        }
                    }
                }
            }
            else {
                if(d2 > FLT_EPSILON) {
                    // p1,p3,p4 are collinear, p2 is considerable
                    //----------------------
                    if(d2 * d2 <= distanceTolerance * (dx*dx + dy*dy)) {
                        if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push(vec2(x1234, y1234));
                            return
                        }

                        // Angle Condition
                        //----------------------
                        da1 = Math.abs(Math.atan2(y3 - y2, x3 - x2) - Math.atan2(y2 - y1, x2 - x1));
                        if(da1 >= pi) da1 = 2*pi - da1;

                        if(da1 < m_angle_tolerance) {
                            points.push(vec2(x2, y2));
                            points.push(vec2(x3, y3));
                            return
                        }

                        if(m_cusp_limit !== 0.0) {
                            if(da1 > m_cusp_limit) {
                                points.push(vec2(x2, y2));
                                return
                            }
                        }
                    }
                }
                else if(d3 > FLT_EPSILON) {
                    // p1,p2,p4 are collinear, p3 is considerable
                    //----------------------
                    if(d3 * d3 <= distanceTolerance * (dx*dx + dy*dy)) {
                        if(m_angle_tolerance < curve_angle_tolerance_epsilon) {
                            points.push(vec2(x1234, y1234));
                            return
                        }

                        // Angle Condition
                        //----------------------
                        da1 = Math.abs(Math.atan2(y4 - y3, x4 - x3) - Math.atan2(y3 - y2, x3 - x2));
                        if(da1 >= pi) da1 = 2*pi - da1;

                        if(da1 < m_angle_tolerance) {
                            points.push(vec2(x2, y2));
                            points.push(vec2(x3, y3));
                            return
                        }

                        if(m_cusp_limit !== 0.0) {
                            if(da1 > m_cusp_limit)
                            {
                                points.push(vec2(x3, y3));
                                return
                            }
                        }
                    }
                }
                else {
                    // Collinear case
                    //-----------------
                    dx = x1234 - (x1 + x4) / 2;
                    dy = y1234 - (y1 + y4) / 2;
                    if(dx*dx + dy*dy <= distanceTolerance) {
                        points.push(vec2(x1234, y1234));
                        return
                    }
                }
            }
        }

        // Continue subdivision
        //----------------------
        recursive(x1, y1, x12, y12, x123, y123, x1234, y1234, points, distanceTolerance, level + 1); 
        recursive(x1234, y1234, x234, y234, x34, y34, x4, y4, points, distanceTolerance, level + 1); 
    }
};

var adaptiveBezierCurve = _function();

const DEFAULT_CURVE_ZAG = 1;

const reifyCurve = (plan) => {
  const { controlPoints } = plan.toGeometry().plan;
  const { start, c1, c2, end } = controlPoints;
  const p1 = Shape.toCoordinate(undefined, start);
  const p2 = Shape.toCoordinate(undefined, c1);
  const p3 = Shape.toCoordinate(undefined, c2);
  const p4 = Shape.toCoordinate(undefined, end);
  const zag = getZag(plan.toGeometry(), DEFAULT_CURVE_ZAG);
  const points = adaptiveBezierCurve(p1, p2, p3, p4, 10 / zag);
  return Link(points.map((point) => Point(point)));
};

// Shape.registerReifier('Curve', reifyCurve);

const Curve = (start, c1, c2, end) =>
  reifyCurve(
    Shape.fromGeometry(
      taggedPlan({}, { type: 'Curve', controlPoints: { start, c1, c2, end } })
    )
  );

const Face = Shape.registerShapeMethod('Face', (...points) =>
  Shape.fromPolygons([{ points: Shape.toCoordinates(undefined, points) }])
);

const Hexagon = Shape.registerShapeMethod('Hexagon', (x, y, z) =>
  Arc(x, y, z, { sides: 6 })
);

/** @type {function(Point[], Path[]):Triangle[]} */
const fromPointsAndPaths = (points = [], paths = []) => {
  /** @type {Polygon[]} */
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: path.map((nth) => points[nth]) });
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

const reifyIcosahedron = async (c1, c2) => {
  const scale = computeScale(c1, c2);
  const middle = computeMiddle(c1, c2);
  return Shape.chain(Shape.fromPolygons(buildRegularIcosahedron())).scale(...scale).move(...middle).absolute();
};

const Icosahedron = Shape.registerShapeMethod(
  'Icosahedron',
  async (x = 1, y = x, z = x) => {
    const [c1, c2] = buildCorners(x, y, z);
    return reifyIcosahedron(c1, c2);
  }
);

const Implicit = Shape.registerShapeMethod('Implicit', (...args) => {
  const {
    func: op,
    object: options = {},
    number: radius = 1,
  } = destructure(args);
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
});

const Line = Shape.registerShapeMethod('Line', (...extents) => {
  const offsets = Shape.toFlatValues(extents);
  if (offsets.length % 2 === 1) {
    offsets.push(0);
  }
  offsets.sort((a, b) => a - b);
  const edges = [];
  for (let nth = 0; nth < offsets.length; nth += 2) {
    const end = offsets[nth];
    const begin = offsets[nth + 1];
    edges.push(Edge(Point(begin), Point(end)));
  }
  return Group(...edges);
});

const Octagon = Shape.registerShapeMethod('Octagon', (x, y, z) =>
  Arc(x, y, z, { sides: 8 })
);

// 1mm seems reasonable for spheres.
const DEFAULT_ORB_ZAG = 1;

const makeUnitSphere = Cached('orb', (tolerance) =>
  Shape.fromGeometry(
    makeUnitSphere$1(/* angularBound= */ 30, tolerance, tolerance)
  )
);

const reifyOrb = (plan) => {
  const [scale, middle] = getScale(plan.toGeometry());
  const radius = Math.max(...scale);

  // const angularBound = 30;
  // const radiusBound = getZag(plan.toGeometry(), DEFAULT_ORB_ZAG) / radius;
  // const distanceBound = getZag(plan.toGeometry(), DEFAULT_ORB_ZAG) / radius;
  const tolerance = getZag(plan.toGeometry(), DEFAULT_ORB_ZAG) / radius;

  return makeUnitSphere(tolerance).scale(scale).move(middle).absolute();
};

const Orb = Shape.registerShapeMethod('Orb', (x = 1, y = x, z = x) => {
  const [c1, c2] = buildCorners(x, y, z);
  return reifyOrb(
    Shape.fromGeometry(taggedPlan({}, { type: 'Orb' }))
      .hasC1(...c1)
      .hasC2(...c2)
  );
});

const Pentagon = Shape.registerShapeMethod('Pentagon', (x, y, z) =>
  Arc(x, y, z, { sides: 5 })
);

const Polygon = Shape.registerShapeMethod('Polygon', (...points) =>
  Face(...points)
);

/*
export const ofPointPaths = (points = [], paths = []) => {
  const polygons = [];
  for (const path of paths) {
    polygons.push({ points: path.map((point) => points[point]) });
  }
  return Shape.fromPolygons(polygons);
};
*/

const ofPolygons = (...polygons) => {
  const out = [];
  for (const polygon of polygons) {
    if (polygon instanceof Array) {
      out.push({ points: polygon });
    } else if (polygon instanceof Shape) {
      out.push({ points: polygon.toPoints().reverse() });
    }
  }
  return Shape.fromPolygons(out);
};

const Polyhedron = Shape.registerShapeMethod('Polyhedron', (...args) =>
  ofPolygons(...args)
);

const Segments = Shape.registerShapeMethod('Segments', (segments = []) =>
  Shape.fromSegments(
    Shape.toNestedValues(segments).map(([source, target]) => [
      Shape.toCoordinate(undefined, source),
      Shape.toCoordinate(undefined, target),
    ])
  )
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

const Triangle = Shape.registerShapeMethod('Triangle', (x, y, z) =>
  Arc(x, y, z, { sides: 3 })
);

const Wave = Shape.registerShapeMethod('Wave', (...args) => {
  const { func: particle = Point, object: options } = Shape.destructure(args);
  let particles = [];
  for (const xDistance of seq(
    options,
    (distance) => distance,
    (...numbers) => numbers
  )()) {
    particles.push(particle(xDistance).x(xDistance));
  }
  return Link(particles);
});

export { Arc, ArcX, ArcY, ArcZ, Assembly, Box, Cached, ChainHull, Clip, Curve, Edge, Edges, Empty, Face, GrblConstantLaser, GrblDynamicLaser, GrblPlotter, GrblSpindle, Group, Hershey, Hexagon, Hull, Icosahedron, Implicit, Join, Line, Link, List, Loft, Loop, Note, Octagon, Orb, Page, Pentagon, Plan, Point, Points, Polygon, Polyhedron, RX, RY, RZ, Ref, Segments, Seq, Shape, Spiral, SurfaceMesh, Triangle, Voxels, Wave, Wrap, X$8 as X, XY, XZ, Y$8 as Y, YZ, Z$7 as Z, absolute, abstract, addTo, align, and, area, as, asPart, at, bb, bend, billOfMaterials, by, center, chainHull, clean, clip, clipFrom, color, copy, cut, cutFrom, cutOut, defRgbColor, defThreejsMaterial, defTool, define, deform, demesh, destructure, disjoint, drop, e, each, eachEdge, eachPoint, edges, edit, ensurePages, ex, extrudeAlong, extrudeX, extrudeY, extrudeZ, ey, ez, faces, fill, fit, fitTo, fix, flat, fuse, g, get, getAll, getNot, getTag, ghost, gn, grow, hull, image, inFn, inset, involute, join, link, list, load, loadGeometry, loft, log, loop, lowerEnvelope, m, mask, masking, material, md, move, moveAlong, n, noOp, noVoid, normal, note, nth, o, ofPlan, offset, on, op, orient, origin, outline, overlay, pack, page, points$1 as points, ref, remesh, rotateX, rotateY, rotateZ, rx, ry, rz, save, saveGeometry, scale$1 as scale, scaleToFit, scaleX, scaleY, scaleZ, seam, section, sectionProfile, self, separate, seq, serialize, setTag, setTags, shadow, simplify, size, sketch, smooth, sort, sx, sy, sz, table, tag, tags, testMode, tint, to, toCoordinate, toCoordinates, toDisplayGeometry, toGeometry, toShape, toShapeGeometry, toShapes$1 as toShapes, toShapesGeometries, tool, toolpath, transform, twist, untag, upperEnvelope, view, voidFn, volume, voxels, wrap, x, xyz, y, z };
