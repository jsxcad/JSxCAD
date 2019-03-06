import { provide } from '@jsxcad/provide';

// Set up default surface geometry.
// provide('@jsxcad/geometry/surface', '', () => require('@jsxcad/geometry-surf2pc'));

import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { fromPolygons } from '@jsxcad/geometry-surf2pc';
import { toGeometry } from './toGeometry';
import { writePdf } from './writePdf';

export class CAG {
  constructor (geometry) {
    this.geometry = geometry;
  }

  translate ([x, y]) {
    return CAG.fromGeometry(provide(this.geometry)
        .transform(fromTranslation([x, y, 0]), this.geometry));
  }

  rotate (angles) {
    return this.rotateX(angles[0]).rotateY(angles[1]).rotateZ(angles[2]);
  }

  rotateX (angle) {
    // FIX: magic numbers.
    return CAG.fromGeometry(provide(this.geometry).transform(fromXRotation(angle * 0.017453292519943295),
                                                             this.geometry));
  }

  rotateY (angle) {
    return CAG.fromGeometry(provide(this.geometry).transform(fromYRotation(angle * 0.017453292519943295),
                                                             this.geometry));
  }

  rotateZ (angle) {
    return CAG.fromGeometry(provide(this.geometry).transform(fromZRotation(angle * 0.017453292519943295),
                                                             this.geometry));
  }

  scale (factor) {
    if (factor.length) {
      const [x = 1, y = 1, z = 1] = factor;
      return CAG.fromGeometry(provide(this.geometry).transform(fromScaling([x, y, z]),
                                                               this.geometry));
    } else {
      // scale(4)
      return CAG.fromGeometry(provide(this.geometry).transform(fromScaling([factor, factor, factor]),
                                                               this.geometry));
    }
  }

  toGeometry () {
    return this.geometry;
  }

  toPolygons (options) {
    return provide(this.geometry).toPolygons(options, this.geometry);
  }

  union (...shapes) {
    return CAG.fromGeometry(provide(this.geometry).union(this.geometry, ...shapes.map(toGeometry)));
  }

  writePdf (options = {}) {
    writePdf(options, this);
    return this;
  }
}

CAG.fromGeometry = (geometry) => new CAG(geometry);

// BREAKING: Direction was not significant for CAG.fromPoints, but now is.
CAG.fromPoints = (points) => CAG.fromGeometry(fromPolygons({}, [points]));
CAG.fromPolygons = (polygons) => CAG.fromGeometry(fromPolygons({}, polygons));
