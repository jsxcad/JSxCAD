import { assertGood as assertGoodSolid, fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';
import { close as closePath, concatenate as concatenatePath, open as openPath } from '@jsxcad/geometry-path';
import { eachPoint, flip, fromPathToSurface, fromPathToZ0Surface, fromPathsToSurface, fromPathsToZ0Surface, toDisjointGeometry, toKeptGeometry as toKeptTaggedGeometry, toPoints,
         transform } from '@jsxcad/geometry-tagged';

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

  constructor (geometry = fromGeometry({ assembly: [] })) {
    if (geometry.geometry) {
      throw Error('die');
    }
    this.geometry = geometry;
  }

  eachPoint (options = {}, operation) {
    eachPoint(options, operation, this.toKeptGeometry());
  }

  flip () {
    return fromGeometry(flip(toKeptGeometry(this)));
  }

  getTags () {
    return toGeometry(this).tags;
  }

  op (op, ...args) {
    return op(this, ...args);
  }

  setTags (tags) {
    return fromGeometry({ ...toGeometry(this), tags });
  }

  toDisjointGeometry (options = {}) {
    return toDisjointGeometry(toGeometry(this));
  }

  toKeptGeometry (options = {}) {
    return toKeptTaggedGeometry(toGeometry(this));
  }

  toGeometry (options = {}) {
    return this.geometry;
  }

  toPoints (options = {}) {
    return toPoints(options, this.toKeptGeometry()).points;
  }

  transform (matrix) {
    if (matrix.some(item => item === -Infinity)) {
      throw Error('die');
    }
    return fromGeometry(transform(matrix, this.toGeometry()));
  }
}
const isSingleOpenPath = ({ paths }) => (paths !== undefined) && (paths.length === 1) && (paths[0][0] === null);

Shape.fromClosedPath = (path) => fromGeometry({ paths: [closePath(path)] });
Shape.fromGeometry = (geometry) => new Shape(geometry);
Shape.fromOpenPath = (path) => fromGeometry({ paths: [openPath(path)] });
Shape.fromPath = (path) => fromGeometry({ paths: [path] });
Shape.fromPaths = (paths) => fromGeometry({ paths: paths });
Shape.fromPathToSurface = (path) => fromGeometry(fromPathToSurface(path));
Shape.fromPathToZ0Surface = (path) => fromGeometry(fromPathToZ0Surface(path));
Shape.fromPathsToSurface = (paths) => fromGeometry(fromPathsToSurface(paths));
Shape.fromPathsToZ0Surface = (paths) => fromGeometry(fromPathsToZ0Surface(paths));
Shape.fromPoint = (point) => fromGeometry({ points: [point] });
Shape.fromPoints = (points) => fromGeometry({ points: points });
Shape.fromPolygonsToSolid = (polygons) => {
  const solid = fromPolygonsToSolid({}, polygons);
  assertGoodSolid(solid);
  return fromGeometry({ solid });
};
Shape.fromPolygonsToZ0Surface = (polygons) => fromGeometry({ z0Surface: polygons });
Shape.fromSurfaces = (surfaces) => fromGeometry({ solid: surfaces });
Shape.fromSolid = (solid) => {
  assertGoodSolid(solid);
  return fromGeometry({ solid: solid });
};

export const fromGeometry = Shape.fromGeometry;
export const toGeometry = (shape) => shape.toGeometry();
export const toKeptGeometry = (shape) => shape.toKeptGeometry();
