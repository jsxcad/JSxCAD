import { fromGeometry } from '@jsxcad/geometry-assembly';

export class Assembly {
  as (tag) {
    return this.fromLazyGeometry(toLazyGeometry(this).addTag(tag));
  }

  assemble (...shapes) {
    return this.fromLazyGeometry(toLazyGeometry(this).assemble(...shapes.map(toLazyGeometry)));
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
    return Assembly.fromLazyGeometry(geometry);
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

const toLazyGeometry = (shape) => shape.toLazyGeometry();

export const assembleLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).assemble(...shapes.map(toLazyGeometry)));

export const unionLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).union(...shapes.map(toLazyGeometry)));

export const differenceLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).difference(...shapes.map(toLazyGeometry)));

export const intersectionLazily = (shape, ...shapes) =>
  Assembly.fromLazyGeometry(toLazyGeometry(shape).intersection(...shapes.map(toLazyGeometry())));

Assembly.fromLazyGeometry = (lazyGeometry) => new Assembly(lazyGeometry);
Assembly.fromGeometry = (geometry) => new Assembly(fromGeometry(geometry));
