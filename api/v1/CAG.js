// FIX: Add interface to change default surface geometry.

import { canonicalize } from '@jsxcad/algorithm-polygons';
import { fromXRotation, fromYRotation, fromZRotation, fromScaling, fromTranslation } from '@jsxcad/math-mat4';
import { fromPaths } from '@jsxcad/geometry-surf2pc';
import { toGeometry } from './toGeometry';
import { writePdf } from './writePdf';

export class CAG {
  constructor (geometry) {
    this.geometry = geometry || fromPaths({}, []);
  }

  transform (matrix) {
console.log(`QQ/CAG/matrix: ${JSON.stringify(matrix)}`)
    return CAG.fromGeometry(this.geometry.transform(matrix));
  }

  toPaths (options = {}) {
    return this.toPolygons(options);
  }

  toGeometry () {
    return this.geometry;
  }

  toPolygons (options) {
    return this.geometry.toPaths(options);
  }

  writePdf (options = {}) {
    writePdf(options, this);
    return this;
  }
}

CAG.fromGeometry = (geometry) => new CAG(geometry);
CAG.fromPaths = (paths) => CAG.fromGeometry(fromPaths({}, paths));

// BREAKING: Direction was not significant for CAG.fromPoints, but now is.
CAG.fromPoints = (points) => CAG.fromGeometry(fromPaths({}, [points]));
CAG.fromPolygons = (polygons) => CAG.fromPaths;
