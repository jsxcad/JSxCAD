// FIX: Get a better way to swap these.
import { fromSolid } from '@jsxcad/geometry-solid3bsp';
// import { fromPaths } from '@jsxcad/geometry-solid3evan';

import { Assembly } from './Assembly';
import { toGeometry } from './toGeometry';
import { fromPolygons, toPoints, toPolygons } from '@jsxcad/algorithm-solid';

export class CSG {
  as (tag) {
    return Assembly.fromGeometries([this.geometry]).as(tag);
  }

  constructor (geometry) {
    this.geometry = geometry || fromSolid({}, []);
  }

  difference (...shapes) {
    return CSG.fromGeometry(this.geometry.difference(...shapes.map(toGeometry)));
  }

  intersection (...shapes) {
    return CSG.fromGeometry(this.geometry.intersection(...shapes.map(toGeometry)));
  }

  material (material) {
    return Assembly.fromGeometries([this.geometry]).material(material);
  }

  transform (matrix) {
    return CSG.fromGeometry(this.geometry.transform(matrix));
  }

  toGeometry () {
    return this.geometry;
  }

  toSolid (options = {}) {
    const solid = this.geometry.toSolid(options);
    return solid;
  }

  toSolids (options = {}) {
    return [this.toSolid(options)];
  }

  toZ0Surfaces (options = {}) {
    return [];
  }

  toPoints (options) {
    return toPoints(options, this.toSolid(options));
  }

  toPolygons (options) {
    return toPolygons({}, this.toSolid(options));
  }

  union (...shapes) {
    return CSG.fromGeometry(this.geometry.union(...shapes.map(toGeometry)));
  }
}

CSG.fromGeometry = (geometry) => new CSG(geometry);
CSG.fromPolygons = (polygons) => CSG.fromGeometry(fromSolid({}, fromPolygons({}, polygons)));
