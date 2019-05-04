import { addTag, assemble, difference, eachPoint, flip, intersection, toDisjointGeometry, toPaths, toSolid, toZ0Surface, transform, union } from '@jsxcad/geometry-eager';

// FIX: Make it clear this should be lazy.
export class Assembly {
  constructor (geometry = { assembly: [] }) {
    this.geometry = geometry;
    if (geometry instanceof Array) throw Error('die');
    if (geometry.geometry) throw Error('die');
  }

  addTag (tag) {
    return fromGeometry(addTag(tag, toGeometry(this)));
  }

  assemble (...geometries) {
    const assembled = assemble(toGeometry(this), ...geometries.map(toGeometry));
    return fromGeometry(assembled);
  }

  difference (...geometries) {
    return fromGeometry(difference(toGeometry(this), ...geometries.map(toGeometry)));
  }

  flip () {
    return fromGeometry(flip(toGeometry(this)));
  }

  getTags () {
    const tags = this.geometry.tags;
    if (tags === undefined) {
      return [];
    } else {
      return tags;
    }
  }

  intersection (...geometries) {
    return fromGeometry(intersection(toGeometry(this), ...geometries.map(toGeometry)));
  }

  eachPoint (options = {}, operation) {
    return eachPoint(options, operation, toGeometry(this));
  }

  toGeometry (options = {}) {
    return this.geometry;
  }

  toPaths (options = {}) {
    return fromGeometry(toPaths(options, toGeometry(this)));
  }

  toSolid (options = {}) {
    return fromGeometry(toSolid(options, toGeometry(this)));
  }

  toZ0Surface (options = {}) {
    return fromGeometry(toZ0Surface(options, toGeometry(this)));
  }

  toDisjointGeometry () {
    return toDisjointGeometry(toGeometry(this));
  }

  transform (matrix) {
    return fromGeometry(transform(matrix, toGeometry(this)));
  }

  union (...geometries) {
    return fromGeometry(union(toGeometry(this), ...geometries.map(toGeometry)));
  }
}

export const fromGeometry = (geometry) => {
  if (geometry instanceof Array) throw Error('die');
  return new Assembly(geometry);
};

const toGeometry = (assembly) => assembly.toGeometry();
