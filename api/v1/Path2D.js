import { provide } from '@jsxcad/provide';
import { buildCircleArc } from '@jsxcad/algorithm-curve';
import { fromPoints } from '@jsxcad/geometry-path';
import { fromXRotation, fromYRotation, fromZRotation, fromTranslation } from '@jsxcad/math-mat4';
import { X, Y } from './constants';

export class Path2D {
  constructor (points, closed, geometry) {
    if (geometry !== undefined) {
      this.geometry = geometry;
    } else if (points !== undefined) {
      this.geometry = fromPoints({}, points);
    } else {
      this.geometry = fromPoints({}, []);
    }
    if (closed === true) {
      this.geometry = provide(this.geometry).close(this.geometry);
    }
  }

  concat (otherpath) {
    if (this.geometry.isClosed || otherpath.geometry.isClosed) {
      throw new Error('Paths must not be closed');
    }
    return Path2D.fromGeometry(provide(this.geometry).concat(this.geometry, otherpath.geometry));
  }

  /**
   * Get the points that make up the path.
   * note that this is current internal list of points, not an immutable copy.
   * @returns {Vector2[]} array of points the make up the path
   */
  getPoints () {
    return provide(this.geometry).toPoints({}, this.geometry)
        .map(point => [point[0], point[1]]);
  }

  /**
   * Append an point to the end of the path.
   * @param {Vector2D} point - point to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoint (point) {
    if (this.geometry.isClosed) {
      throw new Error('Path must not be closed');
    }
    return Path2D.fromGeometry(provide(this.geometry).appendPoint({}, point, this.geometry));
  }

  /**
   * Append a list of points to the end of the path.
   * @param {Vector2D[]} points - points to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoints (points) {
    if (this.geometry.isClosed) {
      throw new Error('Path must not be closed');
    }
    return Path2D.fromGeometry(provide(this.geometry).concat(this.geometry,
                                                             provide(this.geometry).fromPoints({}, points)));
  }

  close () {
    return Path2D.fromGeometry(provide(this.geometry).close(this.geometry));
  }

  /**
   * Determine if the path is a closed or not.
   * @returns {Boolean} true when the path is closed, otherwise false
   */
  isClosed () {
    return this.geometry.isClosed;
  }

  /**
   * Determine the overall clockwise or anti-clockwise turn of a path.
   * See: http://mathworld.wolfram.com/PolygonArea.html
   * @returns {String} One of ['clockwise', 'counter-clockwise', 'straight'].
   */
  getTurn () {
    const points = provide(this.geometry).toPoints({}, this.geometry);
    let twiceArea = 0;
    let last = points.length - 1;
    for (let current = 0; current < points.length; last = current++) {
      twiceArea += points[last][X] * points[current][Y] - points[last][Y] * points[current][X];
    }
    if (twiceArea > 0) {
      return 'clockwise';
    } else if (twiceArea < 0) {
      return 'counter-clockwise';
    } else {
      return 'straight';
    }
  }

  // Extrude the path by following it with a rectangle (upright, perpendicular to the path direction)
  // Returns a CSG solid
  //   width: width of the extrusion, in the z=0 plane
  //   height: height of the extrusion in the z direction
  //   resolution: number of segments per 360 degrees for the curve in a corner
  rectangularExtrude (width, height, resolution) {
    return Error('Not yet implemented');
  }

  // Expand the path to a CAG
  // This traces the path with a circle with radius pathradius
  expandToCAG (pathradius, resolution) {
    return Error('Not yet implemented');
  }

  innerToCAG () {
    return Error('Not yet implemented');
  }

  rotateX (angle) {
    return this.transform(fromXRotation(angle * 0.017453292519943295));
  }

  rotateY (angle) {
    return this.transform(fromYRotation(angle * 0.017453292519943295));
  }

  rotateZ (angle) {
    return this.transform(fromZRotation(angle * 0.017453292519943295));
  }

  toPaths () {
    return provide(this.geometry).toPaths({}, this.geometry);
  }

  translate ([x = 0, y = 0, z = 0]) {
    return this.transform(fromTranslation([x, y, z]));
  }

  transform (matrix4x4) {
    return Path2D.fromGeometry(provide(this.geometry).transform(matrix4x4, this.geometry));
  }
}

Path2D.arc = (...params) => new Path2D(buildCircleArc(...params));
Path2D.fromGeometry = (geometry) => new Path2D(undefined, undefined, geometry);
