import { fromGeometries } from '@jsxcad/geometry-assembly';
import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { toPoints } from '@jsxcad/algorithm-paths';

export class Assembly {
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
    return this.geometry.toPaths(options);
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

const toAssembly = (shape) => (shape instanceof Assembly) ? shape : fromGeometries([shape]);

export const unionLazily = (...shapes) => Assembly.fromGeometry(fromGeometries([]).union(...shapes.map(toAssembly)));

Assembly.fromGeometry = (geometry) => new Assembly(geometry);
Assembly.fromPaths = (paths) => Assembly.fromGeometry(fromPaths({}, paths));
