// FIX: Get a better way to swap these.
import { fromPaths } from '@jsxcad/geometry-solid3bsp';
// import { fromPaths } from '@jsxcad/geometry-solid3evan';

import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { toGeometry } from './toGeometry';
import { canonicalize, toPoints } from '@jsxcad/algorithm-paths';
import { toTriangles } from '@jsxcad/algorithm-triangles';

export class CSG {
  constructor (geometry) {
    this.geometry = geometry || fromPaths({}, []);
  }

  difference (...shapes) {
    return CSG.fromGeometry(this.geometry.difference(...shapes.map(toGeometry)));
  }

  intersection (...shapes) {
    return CSG.fromGeometry(this.geometry.intersection(...shapes.map(toGeometry)));
  }

  transform (matrix) {
    return CSG.fromGeometry(this.geometry.transform(matrix));
  }

  toGeometry () {
    return this.geometry;
  }

  toPaths (options) {
    const paths = this.geometry.toPaths(options);
    // if (!isWatertightPolygons(paths)) throw Error('not watertight');
    return paths;
  }

  toPoints (options) {
    return toPoints(options, this.toPaths(options));
  }

  toPolygons (options) {
    return this.toPaths(options);
  }

  union (...shapes) {
    return CSG.fromGeometry(this.geometry.union(...shapes.map(toGeometry)));
  }
}

CSG.fromGeometry = (geometry) => new CSG(geometry);
CSG.fromPaths = (paths) => {
  const triangles = canonicalize(toTriangles({}, paths));
  // if (!isWatertightPolygons(triangles)) throw Error('not watertight');
  return CSG.fromGeometry(fromPaths({}, triangles));
};
CSG.fromPolygons = CSG.fromPaths;
