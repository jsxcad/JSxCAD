import { addTag, assemble, difference, intersection, toPaths, toSolid, toZ0Surface, union } from '@jsxcad/algorithm-assembly';

export class Assembly {
  constructor ({ geometry = [] }) {
    this.geometry = geometry;
  }

  addTag (value) {
    return fromGeometry(addTag(tag, this.geometry));
  }

  assemble (...geometries) {
    return fromGeometry(assemble(this.geometry, ...geometries));
  }

  difference (...geometries) {
    return fromGeometry(difference(this.geometry, ...geometries));
  }

  flip () {
    return fromGeometry(flip(this.geometry) });
  }

  intersection (...geometries) {
    return fromGeometry(difference(this.geometry, ...geometries));
  }

  toSolid (options) {
    return toSolid(options, this.geometry);
  }

  toGeometry (options) {
    return this.geometry;
  }

  transform (matrix) {
    // Assembly transforms are eager, but the component transforms may be lazy.
    return fromGeometry(transform(matrix, geometry));
  }

  union (...geometries) {
    return fromGeometry(union(this.geometry, ...geometries));
  }
}

export const fromGeometry = (geometry) => {
  return new Assembly(geometry);
};
