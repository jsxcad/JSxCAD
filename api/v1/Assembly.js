import { fromGeometries } from '@jsxcad/geometry-assembly';
import { toPoints } from '@jsxcad/algorithm-paths';

export class Assembly {
  as (tag) {
    const tags = this.geometry.getProperty('tags', []);
    return Assembly.fromGeometry(this.geometry.withProperty('tags', [tag, ...tags]));
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

  toSolid (options = {}) {
    return this.geometry.toSolid(options);
  }

  toSolids (options = {}) {
    return this.geometry.toSolids(options);
  }

  toZ0Drawing (options = {}) {
    return this.geometry.toZ0Drawing(options);
  }

  toZ0Drawings (options = {}) {
    return this.geometry.toZ0Drawings(options);
  }

  toZ0Surface (options = {}) {
    return this.geometry.toZ0Surface(options);
  }

  toZ0Surfaces (options = {}) {
    return this.geometry.toZ0Surfaces(options);
  }

  toPoints (options = {}) {
    return toPoints(options, this.toPaths(options));
  }

  toPolygons (options = {}) {
    return this.toSolid(options);
  }

  transform (matrix) {
    return Assembly.fromGeometry(this.geometry.transform(matrix));
  }

  union (...shapes) {
    return Assembly.fromGeometry(this.geometry.union(...shapes.map(toAssembly)));
  }
}

const toAssembly = (shape) => (shape instanceof Assembly) ? shape : fromGeometries({}, [shape]);

export const unionLazily = (shape, ...shapes) => {
  if (shapes.some(arg => arg === undefined)) throw Error('die');
  if (shape === undefined) throw Error('die');
  if (shapes[0] === undefined) throw Error(`die: ${shapes.length}`);
  return Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).union(...shapes.map(shape => shape.toGeometry())));
};

export const differenceLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).difference(...shapes.map(shape => shape.toGeometry())));

export const intersectionLazily = (shape, ...shapes) =>
  Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).intersection(...shapes.map(shape => shape.toGeometry())));

// FIX: This needs clear documentation.
Assembly.fromGeometry = (geometry) => new Assembly(geometry);
Assembly.fromGeometries = (geometries) => Assembly.fromGeometry(fromGeometries({}, geometries));
