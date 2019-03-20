import { fromGeometries } from '@jsxcad/geometry-assembly';
import { canonicalize, toPoints } from '@jsxcad/algorithm-paths';

export class Assembly {
  as (tag) {
    const tags = this.geometry.getProperty('tags', []);
    const result = Assembly.fromGeometry(this.geometry.withProperty('tags', [tag, ...tags]));
    return result;
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

  toGeometry () {
    return this.geometry;
  }

  toPaths (options) {
    return canonicalize(this.geometry.toPaths(options));
  }

  toPoints (options) {
    return toPoints(options, this.toPaths(options));
  }

  toPolygons (options) {
    return this.toPaths(options);
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
  return Assembly.fromGeometry(fromGeometries({}, [shape.toGeometry()]).union(...shapes.map(shape => shape.toGeometry())));
}

// FIX: This needs clear documentation.
Assembly.fromGeometry = (geometry) => new Assembly(geometry);
Assembly.fromGeometries = (geometries) => Assembly.fromGeometry(fromGeometries({}, geometries));
