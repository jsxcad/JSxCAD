import { fromGeometries, fromTaggedGeometries } from '@jsxcad/geometry-assembly';

export class Assembly {
  as (tag) {
    const tags = this.geometry.getProperty('tags', []);
    return Assembly.fromGeometry(this.geometry.withProperty('tags', [tag, ...tags]));
  }

  assemble (...shapes) {
    return Assembly.fromGeometry(this.geometry.assemble(...shapes.map(toAssembly)));
  }

  constructor (geometry) {
    this.geometry = geometry || fromGeometries({}, []);
  }

  difference (...shapes) {
    return Assembly.fromGeometry(this.geometry.difference(...shapes.map(toAssembly)));
  }

  intersection (...shapes) {
    return Assembly.fromGeometry(this.geometry.intersection(...shapes.map(toAssembly)));
  }

  material (material) {
    return Assembly.fromGeometry(this.geometry.withProperty('material', material));
  }

  toGeometry () {
    return this.geometry;
  }

  toComponents (options = {}) {
    return this.geometry.toComponents(options);
  }

  toPoints (options = {}) {
    return this.geometry.toPoints(options);
  }

  toSolid (options = {}) {
    return this.geometry.toSolid(options);
  }

  toZ0Paths (options = {}) {
    return this.geometry.toZ0Drawing(options);
  }

  toZ0Surface (options = {}) {
    return this.geometry.toZ0Surface(options);
  }

  transform (matrix) {
    return Assembly.fromGeometry(this.geometry.transform(matrix));
  }

  union (...shapes) {
    return Assembly.fromGeometry(this.geometry.union(...shapes.map(toAssembly)));
  }
}

const toAssembly = (shape) => (shape instanceof Assembly) ? shape : fromGeometries({}, [shape]);

export const assembleLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).assemble(...shapes.map(shape => shape.toGeometry())));

export const unionLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).union(...shapes.map(shape => shape.toGeometry())));

export const differenceLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).difference(...shapes.map(shape => shape.toGeometry())));

export const intersectionLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).intersection(...shapes.map(shape => shape.toGeometry())));

// FIX: This needs clear documentation.
Assembly.fromGeometry = (geometry) => new Assembly(geometry);
Assembly.fromGeometries = (geometries) => Assembly.fromGeometry(fromGeometries({}, geometries));
Assembly.fromTaggedGeometries = (taggedGeometries) => Assembly.fromGeometry(fromTaggedGeometries({}, taggedGeometries));
