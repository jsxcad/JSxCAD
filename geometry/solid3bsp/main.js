import { difference, intersection, union } from '@jsxcad/algorithm-bsp';
import { toPolygons } from '@jsxcad/algorithm-paths';
import { flip, transform } from '@jsxcad/algorithm-polygons';
import { identity, multiply } from '@jsxcad/math-mat4';

export class Solid3Bsp {
  constructor ({ paths = [], transforms = identity() }) {
    this.basePaths = toPolygons(paths);
    this.transforms = transforms;
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
      this.paths = transform(this.transforms, this.basePaths);
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

export const fromPaths = (options = {}, paths) => new Solid3Bsp({ paths: paths });
