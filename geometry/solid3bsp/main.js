import { canonicalize, flip, transform } from '@jsxcad/algorithm-polygons';
import { difference, intersection, union } from '@jsxcad/algorithm-bsp';
import { identity, multiply } from '@jsxcad/math-mat4';
// import { isWatertightPolygons } from '@jsxcad/algorithm-watertight';
import { toPolygons } from '@jsxcad/algorithm-paths';
import { toTriangles } from '@jsxcad/algorithm-triangles';

export class Solid3Bsp {
  constructor ({ paths = [], transforms = identity() }) {
    this.basePaths = toPolygons(paths);
    this.transforms = transforms;
    this.isSolid = true;
  }

  difference (...geometries) {
    return fromPaths({}, difference(this.toPaths({}), ...geometries.map(geometry => geometry.toPaths({}))));
  }

  flip () {
    return fromPaths({}, flip(this.toPaths({})));
  }

  intersection (...geometries) {
    return fromPaths({}, intersection(this.toPaths({}), ...geometries.map(geometry => geometry.toPaths({}))));
  }

  toPaths (options = {}) {
    if (this.paths === undefined) {
      this.paths = canonicalize(transform(this.transforms, this.basePaths));
      // if (!isWatertightPolygons(this.paths)) throw Error('Not watertight');
    }
    return this.paths;
  }

  transform (matrix) {
    return new Solid3Bsp({ paths: this.basePaths, transforms: multiply(matrix, this.transforms) });
  }

  union (...geometries) {
    return fromPaths({}, union(this.toPaths({}), ...geometries.map(geometry => geometry.toPaths({}))));
  }
}

export const fromPaths = (options = {}, paths) => {
  paths = toTriangles({}, paths);
  return new Solid3Bsp({ paths: paths });
};
