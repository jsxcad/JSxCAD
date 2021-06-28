import {
  closePath,
  concatenatePath,
  eachPoint,
  flip,
  fromPolygonsToGraph,
  openPath,
  registerReifier,
  rewriteTags,
  taggedAssembly,
  taggedGraph,
  taggedPaths,
  taggedPoints,
  toConcreteGeometry as toConcreteTaggedGeometry,
  toDisplayGeometry,
  toPoints,
  toTransformedGeometry as toTransformedTaggedGeometry,
  transform,
} from '@jsxcad/geometry';

import { identityMatrix } from '@jsxcad/math-mat4';

export class Shape {
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

  constructor(geometry = taggedAssembly({}), context) {
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
    return fromGeometry(flip(toConcreteTaggedGeometry(this)), this.context);
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

export const registerShapeMethod = (name, op) => {
  /*
  // FIX: See if we can switch these to dispatching via define?
  if (Shape.prototype.hasOwnProperty(name)) {
    throw Error(`Method ${name} is already in use.`);
  }
*/
  const { [name]: method } = {
    [name]: function (...args) {
      // FIX: Switch to return op(...args)(this); to support curryable methods.
      return op(this, ...args);
    },
  };
  Shape.prototype[name] = method;
  return method;
};

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

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();
export const toConcreteGeometry = (shape) => shape.toConcreteGeometry();
export const toDisjointGeometry = (shape) => shape.toConcreteGeometry();
export const toKeptGeometry = (shape) => shape.toConcreteGeometry();

export default Shape;
