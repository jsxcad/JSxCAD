import { difference } from './difference';
import { eachPoint } from './eachPoint';
import { flip } from './flip';
import { fromPolygons } from './fromPolygons';
import { intersection } from './intersection';
import { toPaths } from './toPaths';
import { toPolygons } from './toPolygons';
import { transform } from './transform';
import { union } from './union';

export class Surf2Pc {
  constructor (geometry) {
    if (geometry.tag) throw Error('tag');
    this.geometry = geometry || fromPolygons({}, []);
    this.tag = 'Surf2Pc';
  }

  difference (...geometries) {
    return new Surf2Pc(difference(this.geometry, ...geometries));
  }

  eachPoint (options = {}, thunk) {
    eachPoint(options, thunk, this.geometry);
  }

  flip () {
    return new Surf2Pc(flip(this.geometry));
  }

  fromPolygons (options = {}) {
    return new Surf2Pc(fromPolygons(options, this.geometry));
  }

  intersection (...geometries) {
    return new Surf2Pc(intersection(this.geometry, ...geometries));
  }

  toPaths (options = {}) {
    return toPaths(options, this.geometry);
  }

  toPolygons (options = {}) {
    return toPolygons(options, this.geometry);
  }

  transform (matrix) {
    return new Surf2Pc(transform(matrix, this.geometry));
  }

  union (...geometries) {
    return new Surf2Pc(union(this.geometry, ...geometries));
  }
}
