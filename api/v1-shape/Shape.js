import {
  close as closePath,
  concatenate as concatenatePath,
  open as openPath,
} from '@jsxcad/geometry-path';

import {
  eachPoint,
  flip,
  registerReifier,
  rewriteTags,
  taggedAssembly,
  taggedGraph,
  taggedPaths,
  taggedPoints,
  toDisjointGeometry as toDisjointTaggedGeometry,
  toDisplayGeometry,
  toPoints,
  toTransformedGeometry as toTransformedTaggedGeometry,
  transform,
} from '@jsxcad/geometry-tagged';

import { fromPolygons } from '@jsxcad/geometry-graph';
import { identityMatrix } from '@jsxcad/math-mat4';

export class Shape {
  close() {
    const geometry = this.toDisjointGeometry();
    if (!isSingleOpenPath(geometry.content[0])) {
      throw Error('Close requires a single open path.');
    }
    return Shape.fromClosedPath(closePath(geometry.content[0].paths[0]));
  }

  concat(...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toDisjointGeometry();
      if (!isSingleOpenPath(geometry.content[0])) {
        throw Error(
          `Concatenation requires single open paths: ${JSON.stringify(
            geometry
          )}`
        );
      }
      paths.push(geometry.content[0].paths[0]);
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
    eachPoint(operation, this.toDisjointGeometry());
  }

  flip() {
    return fromGeometry(flip(toDisjointGeometry(this)), this.context);
  }

  toDisplayGeometry(options) {
    return toDisplayGeometry(toGeometry(this), options);
  }

  toKeptGeometry(options = {}) {
    return this.toDisjointGeometry();
  }

  toDisjointGeometry(options = {}) {
    return toDisjointTaggedGeometry(toGeometry(this));
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
    return toPoints(this.toDisjointGeometry()).points;
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
  fromGeometry(taggedGraph({}, fromPolygons(polygons)), context);
Shape.registerMethod = registerShapeMethod;
// Let's consider 'method' instead of 'registerMethod'.
Shape.method = registerShapeMethod;
Shape.reifier = (name, op) => registerReifier(name, op);

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();
export const toDisjointGeometry = (shape) => shape.toDisjointGeometry();
export const toKeptGeometry = (shape) => shape.toDisjointGeometry();

export default Shape;
