import { provide } from '@jsxcad/provide';
import { fromPolygons } from '@jsxcad/geometry-solid3bsp';
import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { toGeometry } from './toGeometry';
import { writeStl } from './writeStl';

export class CSG {
  constructor (geometry) {
    this.geometry = geometry;
  }

  difference (...shapes) {
    return CSG.fromGeometry(provide(this.geometry).difference(this.geometry, ...shapes.map(toGeometry)));
  }

  dump (tag) {
    console.log(`CSG/dump/${tag}: ${JSON.stringify(this.geometry)}`);
    return this;
  }

  intersect (...shapes) {
    return this.intersection(...shapes);
  }

  intersection (...shapes) {
    return CSG.fromGeometry(provide(this.geometry).intersection(this.geometry, ...shapes.map(toGeometry)));
  }

  rotate (angles) {
    return this.rotateX(angles[0]).rotateY(angles[1]).rotateZ(angles[2]);
  }

  rotateX (angle) {
    // FIX: Magic numbers.
    return CSG.fromGeometry(provide(this.geometry).transform(fromXRotation(angle * 0.017453292519943295),
                                                             this.geometry));
  }

  rotateY (angle) {
    return CSG.fromGeometry(provide(this.geometry).transform(fromYRotation(angle * 0.017453292519943295),
                                                             this.geometry));
  }

  rotateZ (angle) {
    return CSG.fromGeometry(provide(this.geometry).transform(fromZRotation(angle * 0.017453292519943295),
                                                             this.geometry));
  }

  scale (factor) {
    if (factor.length) {
      // scale([1, 2, 3])
      return CSG.fromGeometry(provide(this.geometry).transform(fromScaling(factor),
                                                               this.geometry));
    } else {
      // scale(4)
      return CSG.fromGeometry(provide(this.geometry).transform(fromScaling([factor, factor, factor]),
                                                               this.geometry));
    }
  }

  setColor () {
    // Does nothing for now.
    return this;
  }

  subtract (...shapes) {
    return this.difference(...shapes);
  }

  toGeometry () {
    return this.geometry;
  }

  toPoints (options) {
    return provide(this.geometry).toPoints(options, this.geometry);
  }

  toPolygons (options) {
    return provide(this.geometry).toPolygons(options, this.geometry);
  }

  translate ([x, y, z]) {
    return CSG.fromGeometry(provide(this.geometry).transform(fromTranslation([x, y, z]),
                                                             this.geometry));
  }

  union (...shapes) {
    return CSG.fromGeometry(provide(this.geometry).union(this.geometry, ...shapes.map(toGeometry)));
  }

  writeStl (options = {}) {
    writeStl(options, this);
    return this;
  }
}

CSG.fromGeometry = (geometry) => new CSG(geometry);
CSG.fromPolygons = (polygons) => CSG.fromGeometry(fromPolygons({}, polygons));
