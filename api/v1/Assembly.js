import { fromGeometry } from '@jsxcad/geometry-assembly';

export class Assembly {
  as (tag) {
    return this.fromGeometry(this.geometry.addTag(tag));
  }

  assemble (...shapes) {
    return this.fromGeometry(this.geometry.assemble(...shapes.map(toGeometry)));
  }

  constructor (geometry = fromGeometry({ assembly: [] })) {
    this.geometry = geometry;
  }

  difference (...shapes) {
    return this.fromGeometry(this.geometry.difference(...shapes.map(toGeometry)));
  }

  fromGeometry (geometry) {
    return Assembly.fromGeometry(geometry);
  }

  intersection (...shapes) {
    return this.fromGeometry(this.geometry.intersection(...shapes.map(toGeometry)));
  }

  toGeometry () {
    return this.geometry;
  }

  toComponents (options = {}) {
    return this.geometry.toComponents(options);
  }

  toPaths (options = {}) {
    return this.geometry.toPaths(options);
  }

  toPoints (options = {}) {
    return this.geometry.toPoints(options);
  }

  toSolid (options = {}) {
    return this.geometry.toSolid(options);
  }

  toZ0Surface (options = {}) {
    return this.geometry.toZ0Surface(options);
  }

  transform (matrix) {
    return this.fromGeometry(this.geometry.transform(matrix));
  }

  union (...shapes) {
    return this.fromGeometry(this.geometry.union(...shapes.map(toGeometry)));
  }
}

const toGeometry = (shape) => shape.toGeometry();

export const assembleLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).assemble(...shapes.map(shape => shape.toGeometry())));

export const unionLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).union(...shapes.map(shape => shape.toGeometry())));

export const differenceLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).difference(...shapes.map(shape => shape.toGeometry())));

export const intersectionLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).intersection(...shapes.map(shape => shape.toGeometry())));

Assembly.fromGeometry = (geometry) => new Assembly(fromGeometry(geometry));
