import { canonicalize, flip, transform } from '@jsxcad/algorithm-polygons';
import { identity, multiply } from '@jsxcad/math-mat4';

import { difference } from './difference';
import { intersection } from './intersection';
import { toPolygons } from '@jsxcad/algorithm-paths';
import { union } from './union';

export class Solid3Evan {
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
    return new Solid3Evan({ paths: this.basePaths, transforms: multiply(matrix, this.transforms) });
  }

  union (...geometries) {
    return fromPaths({}, union(this.toPaths({}), ...geometries.map(geometry => geometry.toPaths({}))));
  }
}

export const fromPaths = (options = {}, paths) => {
  return new Solid3Evan({ paths: paths });
};
