import { canonicalize, flip, fromPolygons as fromPolygonsASolid, transform } from '@jsxcad/algorithm-solid';
import { difference, intersection, union } from '@jsxcad/algorithm-bsp-surfaces';
import { identity, multiply } from '@jsxcad/math-mat4';

export class Solid3Bsp {
  constructor ({ solid = [], transforms = identity() }) {
    this.baseSolid = solid;
    this.transforms = transforms;
    this.isSolid = true;
  }

  difference (...geometries) {
    return fromSolid({}, difference(this.toSolid({}), ...geometries.map(geometry => geometry.toSolid({}))));
  }

  flip () {
    return fromSolid({}, flip(this.toSolid({})));
  }

  intersection (...geometries) {
    return fromSolid({}, intersection(this.toSolid({}), ...geometries.map(geometry => geometry.toSolid({}))));
  }

  toSolid (options = {}) {
    if (this.solid === undefined) {
      this.solid = canonicalize(transform(this.transforms, this.baseSolid));
    }
    return this.solid;
  }

  toSolids (options = {}) {
    return [this.toSolid(options)];
  }

  toZ0Drawing (options = {}) {
    return [];
  }

  toZ0Drawings (options = {}) {
    return [];
  }

  toZ0Surface (options = {}) {
    return [];
  }

  toZ0Surfaces (options = {}) {
    return [];
  }

  transform (matrix) {
    return new Solid3Bsp({ solid: this.baseSolid, transforms: multiply(matrix, this.transforms) });
  }

  union (...geometries) {
    return fromSolid({}, union(this.toPaths({}), ...geometries.map(geometry => geometry.toPaths({}))));
  }
}

export const fromSolid = (options = {}, solid) => new Solid3Bsp({ solid: solid });
export const fromPolygons = (options = {}, polygons) => new Solid3Bsp({ solid: fromPolygonsASolid({}, polygons) });
