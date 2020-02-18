import {
  close as closePath,
  concatenate as concatenatePath,
  open as openPath
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
  toDisjointGeometry,
  toKeptGeometry as toKeptTaggedGeometry,
  toPoints,
  toTransformedGeometry as toTransformedTaggedGeometry,
  transform
} from '@jsxcad/geometry-tagged';

import {
  fromPolygons as fromPolygonsToSolid
} from '@jsxcad/geometry-solid';

export class Shape {
  close () {
    const geometry = this.toKeptGeometry();
    if (!isSingleOpenPath(geometry)) {
      throw Error('Close requires a single open path.');
    }
    return Shape.fromClosedPath(closePath(geometry.paths[0]));
  }

  concat (...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toKeptGeometry();
      if (!isSingleOpenPath(geometry)) {
        throw Error('Concatenation requires single open paths.');
      }
      paths.push(geometry.paths[0]);
    }
    return Shape.fromOpenPath(concatenatePath(...paths));
  }

  constructor (geometry = { assembly: [] },
               context) {
    if (geometry.geometry) {
      throw Error('die');
    }
    this.geometry = geometry;
    this.context = context;
  }

  eachPoint (operation) {
    eachPoint(operation, this.toKeptGeometry());
  }

  flip () {
    return fromGeometry(flip(toKeptGeometry(this)), this.context);
  }

  setTags (tags) {
    return fromGeometry({ ...toGeometry(this), tags }, this.context);
  }

  toDisjointGeometry (options = {}) {
    return toDisjointGeometry(toGeometry(this));
  }

  toKeptGeometry (options = {}) {
    return toKeptTaggedGeometry(toGeometry(this));
  }

  getContext (symbol) {
    return this.context[symbol];
  }

  toGeometry () {
    return this.geometry;
  }

  toTransformedGeometry () {
    return toTransformedTaggedGeometry(this.toGeometry());
  }

  toPoints () {
    return toPoints(this.toKeptGeometry()).points;
  }

  transform (matrix) {
    if (matrix.some(item => typeof item !== 'number' || isNaN(item))) {
      throw Error('die');
    }
    return fromGeometry(transform(matrix, this.toGeometry()), this.context);
  }

  assertWatertight () {
    if (!this.isWatertight()) {
      throw Error('not watertight');
    }
    return this;
  }

  isWatertight () {
    return isWatertight(this.toKeptGeometry());
  }

  makeWatertight (onFixed = (_ => _)) {
    return fromGeometry(makeWatertight(this.toKeptGeometry(), undefined));
  }
}

const isSingleOpenPath = ({ paths }) => (paths !== undefined) && (paths.length === 1) && (paths[0][0] === null);

Shape.fromClosedPath = (path, context) => fromGeometry({ paths: [closePath(path)] }, context);
Shape.fromGeometry = (geometry, context) => new Shape(geometry, context);
Shape.fromOpenPath = (path, context) => fromGeometry({ paths: [openPath(path)] }, context);
Shape.fromPath = (path, context) => fromGeometry({ paths: [path] }, context);
Shape.fromPaths = (paths, context) => fromGeometry({ paths: paths }, context);
Shape.fromPathToSurface = (path, context) => fromGeometry(fromPathToSurface(path), context);
Shape.fromPathToZ0Surface = (path, context) => fromGeometry(fromPathToZ0Surface(path), context);
Shape.fromPathsToSurface = (paths, context) => fromGeometry(fromPathsToSurface(paths), context);
Shape.fromPathsToZ0Surface = (paths, context) => fromGeometry(fromPathsToZ0Surface(paths), context);
Shape.fromPoint = (point, context) => fromGeometry({ points: [point] }, context);
Shape.fromPoints = (points, context) => fromGeometry({ points: points }, context);
Shape.fromPolygonsToSolid = (polygons, context) => fromGeometry({ solid: fromPolygonsToSolid({}, polygons) }, context);
Shape.fromPolygonsToZ0Surface = (polygons, context) => fromGeometry({ z0Surface: polygons }, context);
Shape.fromSurfaces = (surfaces, context) => fromGeometry({ solid: surfaces }, context);
Shape.fromSolid = (solid, context) => fromGeometry({ solid: solid }, context);

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();
export const toKeptGeometry = (shape) => shape.toKeptGeometry();

export default Shape;
