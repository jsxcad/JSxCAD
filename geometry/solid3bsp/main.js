import { flip, fromPolygons as solidFromPolygons, transform } from '@jsxcad/algorithm-solid';
import { difference, intersection, union } from '@jsxcad/algorithm-bsp-surfaces';
import { assertCoplanar } from '@jsxcad/algorithm-surface';
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
    for (const surface of this.baseSolid) assertCoplanar(surface);
    if (this.solid === undefined) {
      this.solid = transform(this.transforms, this.baseSolid);
    }
    for (const surface of this.solid) assertCoplanar(surface);
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
export const fromPolygons = (options = {}, polygons) => new Solid3Bsp({ solid: solidFromPolygons({}, polygons) });
