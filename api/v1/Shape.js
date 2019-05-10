import { close as closePath, concatenate as concatenatePath, open as openPath } from '@jsxcad/geometry-path';

import { fromGeometry } from '@jsxcad/geometry-lazy';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

export class Shape {
  as (tag) {
    return this.fromLazyGeometry(toLazyGeometry(this).addTag(tag));
  }

  assemble (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).assemble(...shapes.map(toLazyGeometry)));
  }

  close () {
    const geometry = this.toPaths().toDisjointGeometry();
    if (!isSingleOpenPath(geometry)) {
      throw Error('Close requires a single open path.');
    }
    return Shape.fromClosedPath(closePath(geometry.paths[0]));
  }

  concat (...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toPaths().toDisjointGeometry();
      if (!isSingleOpenPath(geometry)) {
        throw Error('Concatenation requires single open paths.');
      }
      paths.push(geometry.paths[0]);
    }
    return Shape.fromOpenPath(concatenatePath(...paths));
  }

  constructor (lazyGeometry = fromGeometry({ assembly: [] })) {
    this.lazyGeometry = lazyGeometry;
  }

  difference (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).difference(...shapes.map(toLazyGeometry)));
  }

  eachPoint (options = {}, operation) {
    toLazyGeometry(this).eachPoint(options, operation);
  }

  fromLazyGeometry (geometry) {
    return Shape.fromLazyGeometry(geometry);
  }

  intersection (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).intersection(...shapes.map(toLazyGeometry)));
  }

  toLazyGeometry () {
    return this.lazyGeometry;
  }

  toComponents (options = {}) {
    return toLazyGeometry(this).toComponents(options);
  }

  toDisjointGeometry (options = {}) {
    return toLazyGeometry(this).toDisjointGeometry(options);
  }

  toGeometry (options = {}) {
    return toLazyGeometry(this).toGeometry(options);
  }

  toPaths (options = {}) {
    return this.fromLazyGeometry(toLazyGeometry(this).toPaths(options));
  }

  toPoints (options = {}) {
    return this.fromLazyGeometry(toLazyGeometry(this).toPoints(options));
  }

  toSolid (options = {}) {
    return this.fromLazyGeometry(toLazyGeometry(this).toSolid(options));
  }

  toZ0Surface (options = {}) {
    return this.fromLazyGeometry(toLazyGeometry(this).toZ0Surface(options));
  }

  transform (matrix) {
    return this.fromLazyGeometry(toLazyGeometry(this).transform(matrix));
  }

  union (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).union(...shapes.map(toLazyGeometry)));
  }
}
const isSingleOpenPath = ({ paths }) => (paths !== undefined) && (paths.length === 1) && (paths[0][0] === null);

const toLazyGeometry = (shape) => shape.toLazyGeometry();

export const assembleLazily = (shape, ...shapes) =>
  Shape.fromLazyGeometry(toLazyGeometry(shape).assemble(...shapes.map(toLazyGeometry)));

export const unionLazily = (shape, ...shapes) =>
  Shape.fromLazyGeometry(toLazyGeometry(shape).union(...shapes.map(toLazyGeometry)));

export const differenceLazily = (shape, ...shapes) =>
  Shape.fromLazyGeometry(toLazyGeometry(shape).difference(...shapes.map(toLazyGeometry)));

export const intersectionLazily = (shape, ...shapes) =>
  Shape.fromLazyGeometry(toLazyGeometry(shape).intersection(...shapes.map(toLazyGeometry())));

Shape.fromClosedPath = (path) => new Shape(fromGeometry({ paths: [closePath(path)] }));
Shape.fromGeometry = (geometry) => new Shape(fromGeometry(geometry));
Shape.fromLazyGeometry = (lazyGeometry) => new Shape(lazyGeometry);
Shape.fromOpenPath = (path) => new Shape(fromGeometry({ paths: [openPath(path)] }));
Shape.fromPaths = (paths) => new Shape(fromGeometry({ paths: paths }));
Shape.fromPathToZ0Surface = (path) => new Shape(fromGeometry({ z0Surface: [path] }));
Shape.fromPathsToZ0Surface = (paths) => new Shape(fromGeometry({ z0Surface: paths }));
Shape.fromPolygonsToSolid = (polygons) => new Shape(fromGeometry({ solid: fromPolygonsToSolid({}, polygons) }));
Shape.fromPolygonsToZ0Surface = (polygons) => new Shape(fromGeometry({ z0Surface: polygons }));
Shape.fromSurfaces = (surfaces) => new Shape(fromGeometry({ solid: surfaces }));
