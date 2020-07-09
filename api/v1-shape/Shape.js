import {
  close as closePath,
  concatenate as concatenatePath,
  open as openPath,
} from '@jsxcad/geometry-path';

import {
  eachPoint,
  flip,
  fromPathToSurface,
  fromPathToZ0Surface,
  fromPathsToSurface,
  fromPathsToZ0Surface,
  isWatertight,
  makeWatertight,
  reconcile,
  taggedAssembly,
  toDisjointGeometry as toDisjointTaggedGeometry,
  toPoints,
  transform,
} from '@jsxcad/geometry-tagged';

import { addReadDecoder } from '@jsxcad/sys';

import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

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

  getContext(symbol) {
    return this.context[symbol];
  }

  toGeometry() {
    return this.geometry;
  }

  toPoints() {
    return toPoints(this.toDisjointGeometry()).points;
  }

  transform(matrix) {
    if (matrix.some((item) => typeof item !== 'number' || isNaN(item))) {
      throw Error('die: matrix is malformed');
    }
    return fromGeometry(transform(matrix, this.toGeometry()), this.context);
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
  fromGeometry({ type: 'paths', paths: [closePath(path)] }, context);
Shape.fromGeometry = (geometry, context) => new Shape(geometry, context);
Shape.fromOpenPath = (path, context) =>
  fromGeometry({ type: 'paths', paths: [openPath(path)] }, context);
Shape.fromPath = (path, context) =>
  fromGeometry({ type: 'paths', paths: [path] }, context);
Shape.fromPaths = (paths, context) =>
  fromGeometry({ type: 'paths', paths: paths }, context);
Shape.fromPathToSurface = (path, context) =>
  fromGeometry(fromPathToSurface(path), context);
Shape.fromPathToZ0Surface = (path, context) =>
  fromGeometry(fromPathToZ0Surface(path), context);
Shape.fromPathsToSurface = (paths, context) =>
  fromGeometry(fromPathsToSurface(paths), context);
Shape.fromPathsToZ0Surface = (paths, context) =>
  fromGeometry(fromPathsToZ0Surface(paths), context);
Shape.fromPoint = (point, context) =>
  fromGeometry({ type: 'points', points: [point] }, context);
Shape.fromPoints = (points, context) =>
  fromGeometry({ type: 'points', points: points }, context);
Shape.fromPolygonsToSolid = (polygons, context) =>
  fromGeometry(
    { type: 'solid', solid: fromPolygonsToSolid({}, polygons) },
    context
  );
Shape.fromPolygonsToZ0Surface = (polygons, context) =>
  fromGeometry({ type: 'z0Surface', z0Surface: polygons }, context);
Shape.fromSurfaces = (surfaces, context) =>
  fromGeometry({ type: 'solid', solid: surfaces }, context);
Shape.fromSolid = (solid, context) =>
  fromGeometry({ type: 'solid', solid }, context);

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();
export const toDisjointGeometry = (shape) => shape.toDisjointGeometry();
export const toKeptGeometry = (shape) => shape.toDisjointGeometry();

addReadDecoder(
  (data) => data && data.geometry !== undefined,
  (data) => Shape.fromGeometry(data.geometry)
);

export default Shape;
