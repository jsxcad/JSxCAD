import { addTag, assemble, difference, intersection, toPaths, toSolid, toZ0Surface, union } from '@jsxcad/algorithm-assembly';

// FIX: Make it clear this should be lazy.
export class Assembly {
  constructor ({ geometry = [] }) {
    this.geometry = geometry;
  }

  addTag (value) {
    return fromGeometry(addTag(tag, toGeometry(this)));
  }

  assemble (...geometries) {
    return fromGeometry(assemble(toGeometry(this), ...geometries.map(toGeometry)));
  }

  difference (...geometries) {
    return fromGeometry(difference(toGeometry(this), ...geometries.map(toGeometry)));
  }

  flip () {
    return fromGeometry(flip(toGeometry(this)));
  }

  intersection (...geometries) {
    return fromGeometry(difference(toGeometry(this), ...geometries.map(toGeometry)));
  }

  toSolid (options = {}) {
    return toSolid(options, toGeometry(this));
  }

  toGeometry (options = {}) {
    return this.geometry;
  }

  transform (matrix) {
    // Assembly transforms are eager, but the component transforms may be lazy.
    return fromGeometry(transform(matrix, toGeometry(this)));
  }

  union (...geometries) {
    return fromGeometry(union(toGeometry(this), ...geometries.map(toGeometry)));
  }
}

export const fromGeometry = (geometry) => {
  return new Assembly(geometry);
};

const toGeometry = (assembly) => assembly.toGeometry();
