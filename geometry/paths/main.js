import { difference, flip, intersection, transform, union } from '@jsxcad/algorithm-paths';
import { isClosed } from '@jsxcad/algorithm-path';
import { identity, multiply } from '@jsxcad/math-mat4';

export class Paths {
  constructor ({ paths = [], transforms = identity() }) {
    this.basePaths = paths;
    this.transforms = transforms;
    this.isPath = true;
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

  toZ0Drawing (options = {}) {
    return this.toPaths(options);
  }

  toZ0Drawings (options = {}) {
    return [this.toPaths(options)];
  }

  toZ0Surface (options = {}) {
    return this.toPaths(options).filter(isClosed);
  }

  toZ0Surfaces (options = {}) {
    return [this.toSurface(options)];
  }

  toSolid (options = {}) {
    return [];
  }

  toSolids (options = {}) {
    return [this.toSolid(options)];
  }

  transform (matrix) {
    return new Paths({ paths: this.basePaths, transforms: multiply(matrix, this.transforms) });
  }

  union (...geometries) {
    return fromPaths({}, union(this.toPaths({}), geometries.map(geometry => geometry.toPaths({}))));
  }
}

export const fromPaths = (options = {}, paths) => new Paths({ paths: paths });
