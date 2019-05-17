import { close as closePath, concatenate as concatenatePath, open as openPath } from '@jsxcad/geometry-path';

import { fromGeometry as fromGeometryToLazyGeometry } from '@jsxcad/geometry-lazy';
import { fromPolygons as fromPolygonsToSolid } from '@jsxcad/geometry-solid';

export class Shape {
  as (tag) {
    return this.fromLazyGeometry(toLazyGeometry(this).addTag(tag));
  }

  assemble (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).assemble(...shapes.map(toLazyGeometry)));
  }

  close () {
    const geometry = this.toGeometry();
    if (!isSingleOpenPath(geometry)) {
      throw Error('Close requires a single open path.');
    }
    return Shape.fromClosedPath(closePath(geometry.paths[0]));
  }

  concat (...shapes) {
    const paths = [];
    for (const shape of [this, ...shapes]) {
      const geometry = shape.toGeometry();
      if (!isSingleOpenPath(geometry)) {
        throw Error('Concatenation requires single open paths.');
      }
      paths.push(geometry.paths[0]);
    }
    return Shape.fromOpenPath(concatenatePath(...paths));
  }

  constructor (lazyGeometry = fromGeometryToLazyGeometry({ assembly: [] })) {
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
    return toLazyGeometry(this).toComponents(options).map(Shape.fromLazyGeometry);
  }

  toDisjointGeometry (options = {}) {
    return toLazyGeometry(this).toDisjointGeometry(options);
  }

  toGeometry (options = {}) {
    return toLazyGeometry(this).toGeometry(options);
  }

  toPoints (options = {}) {
    return this.fromLazyGeometry(toLazyGeometry(this).toPoints(options));
  }

  transform (matrix) {
    return this.fromLazyGeometry(toLazyGeometry(this).transform(matrix));
  }

  union (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).union(...shapes.map(toLazyGeometry)));
  }

  withComponents (options = {}) {
    const components = this.toComponents(options);
    return assembleLazily(...components);
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
  Shape.fromLazyGeometry(toLazyGeometry(shape).intersection(...shapes.map(toLazyGeometry)));

Shape.fromClosedPath = (path) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ paths: [closePath(path)] }));
Shape.fromGeometry = (geometry) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry(geometry));
Shape.fromLazyGeometry = (lazyGeometry) => new Shape(lazyGeometry);
Shape.fromOpenPath = (path) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ paths: [openPath(path)] }));
Shape.fromPath = (path) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ paths: [path] }));
Shape.fromPaths = (paths) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ paths: paths }));
Shape.fromPathToZ0Surface = (path) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ z0Surface: [path] }));
Shape.fromPathsToZ0Surface = (paths) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ z0Surface: paths }));
Shape.fromPolygonsToSolid = (polygons) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ solid: fromPolygonsToSolid({}, polygons) }));
Shape.fromPolygonsToZ0Surface = (polygons) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ z0Surface: polygons }));
Shape.fromSurfaces = (surfaces) => Shape.fromLazyGeometry(fromGeometryToLazyGeometry({ solid: surfaces }));
