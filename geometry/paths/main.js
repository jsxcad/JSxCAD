import { difference, flip, intersection, transform, union } from '@jsxcad/algorithm-paths';
import { identity, multiply } from '@jsxcad/math-mat4';

export class Paths {
  constructor ({ paths = [], transforms = identity() }) {
    this.basePaths = paths;
    this.transforms = transforms;
    if (!(paths instanceof Array)) throw Error(`Die: ${JSON.stringify(paths)}`);
  }

  difference (...geometries) {
    return fromPaths({}, difference(this.toPaths({}), geometries.map(geometry => geometry.toPaths({}))));
  }

  flip () {
    return fromPaths({}, flip(this.toPaths({})));
  }

  intersection (...geometries) {
    return fromPaths({}, intersection(this.toPaths({}), geometries.map(geometry => geometry.toPaths({}))));
  }

  toPaths (options = {}) {
    if (this.paths === undefined) {
      this.paths = transform(this.transforms, this.basePaths);
    }
    return this.paths;
  }

  transform (matrix) {
    return new Paths({ paths: this.basePaths, transforms: multiply(matrix, this.transforms) });
  }

  union (...geometries) {
    return fromPaths({}, union(this.toPaths({}), geometries.map(geometry => geometry.toPaths({}))));
  }
}

export const fromPaths = (options = {}, paths) => new Paths({ paths: paths });
