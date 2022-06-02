import {
  assemble,
  fromPolygons,
  rewriteTags,
  taggedGraph,
  taggedPoints,
  taggedSegments,
  toConcreteGeometry as toConcreteTaggedGeometry,
  toDisplayGeometry,
  toPoints,
  toTransformedGeometry as toTransformedTaggedGeometry,
  transform,
} from '@jsxcad/geometry';

import { endTime, getSourceLocation, startTime } from '@jsxcad/sys';

export class Shape {
  constructor(geometry = assemble(), context) {
    if (geometry.geometry) {
      throw Error('die: { geometry: ... } is not valid geometry.');
    }
    this.geometry = geometry;
    this.context = context;
  }

  toDisplayGeometry(options) {
    return toDisplayGeometry(toGeometry(this), options);
  }

  toKeptGeometry(options = {}) {
    return this.toConcreteGeometry();
  }

  toConcreteGeometry(options = {}) {
    return toConcreteTaggedGeometry(toGeometry(this));
  }

  toDisjointGeometry(options = {}) {
    return toConcreteTaggedGeometry(toGeometry(this));
  }

  toTransformedGeometry(options = {}) {
    return toTransformedTaggedGeometry(toGeometry(this));
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

  transform(matrix) {
    return fromGeometry(transform(matrix, this.toGeometry()), this.context);
  }

  // Low level setter for reifiers.
  getTags() {
    return this.toGeometry().tags || [];
  }

  setTags(tags = []) {
    return Shape.fromGeometry(rewriteTags(tags, [], this.toGeometry()));
  }

  toCoordinate(x, y, z) {
    return Shape.toCoordinate(this, x, y, z);
  }

  toShape(value) {
    return Shape.toShape(value, this);
  }

  toShapes(values) {
    return Shape.toShapes(values, this);
  }

  toValue(value) {
    return Shape.toValue(value, this);
  }

  toFlatValues(values) {
    return Shape.toFlatValues(values, this);
  }

  toNestedValues(values) {
    return Shape.toNestedValues(values, this);
  }
}

Shape.method = {};

export const registerShapeMethod = (name, op) => {
  const path = getSourceLocation()?.path;
  if (Shape.prototype.hasOwnProperty(name)) {
    const { origin } = Shape.prototype[name];
    if (origin !== path) {
      throw Error(
        `Method ${name} is already defined in ${origin} (this is ${path}).`
      );
    }
  }
  // Make the operation constructor available e.g., Shape.grow(1)(s)
  Shape[name] = op;

  // Make the operation application available e.g., s.grow(1)
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
  return method;
};

export const shapeMethod = (build) => {
  return function (...args) {
    return build(...args).to(this);
  };
};

Shape.shapeMethod = shapeMethod;

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
  fromGeometry(fromPolygons({}, polygons), context);

Shape.registerMethod = registerShapeMethod;

Shape.toShape = (to, from) => {
  if (to instanceof Function) {
    to = to(from);
  }
  if (to instanceof Shape) {
    return to;
  } else {
    throw Error(`Expected Function or Shape. Received: ${to.constructor.name}`);
  }
};

Shape.toShapes = (to, from) => {
  if (to instanceof Function) {
    to = to(from);
  }
  if (to instanceof Shape) {
    if (to.toGeometry().type === 'group') {
      to = to
        .toGeometry()
        .content.map((content) => Shape.fromGeometry(content));
    }
  }
  if (to instanceof Array) {
    return to
      .filter((value) => value !== undefined)
      .flatMap((value) => Shape.toShapes(value, from));
  } else {
    return [Shape.toShape(to, from)];
  }
};

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
  } else {
    return [Shape.toValue(to, from)];
  }
};

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

Shape.toCoordinate = (shape, x = 0, y = 0, z = 0) => {
  if (x instanceof Function) {
    x = x(shape);
  }
  if (typeof x === 'string') {
    x = shape.get(x);
  }
  if (x instanceof Shape) {
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

Shape.toCoordinates = (shape, ...args) => {
  const coordinates = [];
  while (args.length > 0) {
    let x = args.shift();
    if (x instanceof Function) {
      x = x(shape);
    }
    if (typeof x === 'string') {
      x = shape.get(x);
    }
    if (x instanceof Shape) {
      const g = x.toTransformedGeometry();
      if (g.type === 'points' && g.points.length === 1) {
        // FIX: Consider how this might be more robust.
        coordinates.push(g.points[0]);
      } else {
        throw Error(`Unexpected coordinate value: ${x}`);
      }
    } else if (x instanceof Array) {
      coordinates.push(x);
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

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();
export const toConcreteGeometry = (shape) => shape.toConcreteGeometry();
export const toDisjointGeometry = (shape) => shape.toConcreteGeometry();
export const toKeptGeometry = (shape) => shape.toConcreteGeometry();

export default Shape;
