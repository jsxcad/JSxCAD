// FIX: Get a better way to swap these.
import { fromPaths } from '@jsxcad/geometry-solid3bsp';
// import { fromPaths } from '@jsxcad/geometry-solid3evan';

import { Assembly } from './Assembly';
import { canonicalize, toPoints } from '@jsxcad/algorithm-paths';
import { toGeometry } from './toGeometry';
import { toTriangles } from '@jsxcad/algorithm-polygons';

export class CSG {
  as (tag) {
    return Assembly.fromGeometries([this.geometry]).as(tag);
  }

  constructor (geometry) {
    this.geometry = geometry || fromPaths({}, []);
  }

  difference (...shapes) {
    return CSG.fromGeometry(this.geometry.difference(...shapes.map(toGeometry)));
  }

  intersection (...shapes) {
    return CSG.fromGeometry(this.geometry.intersection(...shapes.map(toGeometry)));
  }

  material (material) {
    return Assembly.fromGeometries([this.geometry]).material(material);
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
  return CSG.fromGeometry(fromPaths({}, triangles));
};
CSG.fromPolygons = CSG.fromPaths;
