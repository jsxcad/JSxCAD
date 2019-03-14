import { difference, intersection, union } from '@jsxcad/algorithm-z0polygons';
import { toZ0Polygons } from '@jsxcad/algorithm-paths';
import { flip, transform } from '@jsxcad/algorithm-polygons';
import { identity, multiply } from '@jsxcad/math-mat4';

export class Surf2Pc {
  constructor ({ paths = [], transforms = identity() }) {
    this.basePaths = toZ0Polygons(paths);
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
console.log(`QQ/surf2pc: ${JSON.stringify(this)}`);
    return this.paths;
  }

  transform (matrix) {
    return new Surf2Pc({ paths: this.basePaths, transforms: multiply(matrix, this.transforms) });
  }

  union (...geometries) {
    return fromPaths({}, union(this.toPaths({}), ...geometries.map(geometry => geometry.toPaths({}))));
  }
}

export const fromPaths = (options = {}, paths) => new Surf2Pc({ paths: paths });
