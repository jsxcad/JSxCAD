import {
  close as closePath,
  concatenate as concatenatePath,
  open as openPath,
} from '@jsxcad/geometry-path';

import {
  eachPoint,
  flip,
  //  fromPathToSurface,
  //  fromPathsToSurface,
  isWatertight,
  makeWatertight,
  reconcile,
  taggedAssembly,
  taggedGraph,
  taggedPaths,
  taggedPoints,
  taggedSolid,
  taggedSurface,
  toDisjointGeometry as toDisjointTaggedGeometry,
  toPoints,
  toTransformedGeometry as toTransformedTaggedGeometry,
  transform,
} from '@jsxcad/geometry-tagged';

import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';
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

  setTags(tags) {
    return fromGeometry({ ...toGeometry(this), tags }, this.context);
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

  reconcile() {
    return fromGeometry(reconcile(this.toDisjointGeometry()));
  }

  assertWatertight() {
    if (!this.isWatertight()) {
      throw Error('not watertight');
    }
    return this;
  }

  isWatertight() {
    return isWatertight(this.toDisjointGeometry());
  }

  makeWatertight(threshold) {
    return fromGeometry(
      makeWatertight(this.toDisjointGeometry(), undefined, undefined, threshold)
    );
  }
}

const isSingleOpenPath = ({ paths }) =>
  paths !== undefined && paths.length === 1 && paths[0][0] === null;

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
// Shape.fromPathToSurface = (path, context) =>
//  fromGeometry(fromPathToSurface(path), context);
// Shape.fromPathsToSurface = (paths, context) =>
//  fromGeometry(fromPathsToSurface(paths), context);
Shape.fromPoint = (point, context) =>
  fromGeometry(taggedPoints({}, [point]), context);
Shape.fromPoints = (points, context) =>
  fromGeometry(taggedPoints({}, points), context);
Shape.fromPolygonsToSolid = (polygons, context) =>
  fromGeometry(taggedSolid({}, fromPolygonsToSolid(polygons)), context);
Shape.fromPolygonsToSurface = (polygons, context) =>
  fromGeometry(taggedSurface({}, polygons), context);
Shape.fromSurfaces = (surfaces, context) =>
  fromGeometry(taggedSolid({}, surfaces), context);
Shape.fromSolid = (solid, context) =>
  fromGeometry(taggedSolid({}, solid), context);

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();
export const toDisjointGeometry = (shape) => shape.toDisjointGeometry();
export const toKeptGeometry = (shape) => shape.toDisjointGeometry();

export default Shape;
