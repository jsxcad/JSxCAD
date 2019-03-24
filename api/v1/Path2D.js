// import { buildCircleArc } from '@jsxcad/algorithm-curve';
import { concatenate, isClosed, measureArea } from '@jsxcad/algorithm-path';
import { canonicalize, butLast, last } from '@jsxcad/algorithm-paths';
import { fromPaths } from '@jsxcad/geometry-paths';

// FIX: Incorrectly named.
export class Path2D {
  as (tag) {
    return this.union().as(tag);
  }

  constructor (points = [], closed = false, geometry) {
    if (geometry !== undefined) {
      this.geometry = geometry;
    } else {
      if (closed) {
        this.geometry = fromPaths({}, [[points]]);
      } else {
        this.geometry = fromPaths({}, [[null, ...points]]);
      }
    }
  }

  concat (otherpath) {
    if (this.isClosed() || otherpath.isClosed()) {
      throw new Error('Paths must not be closed');
    }
    // Rewrite the last of the paths.
    return Path2D.fromPaths([...butLast(this.toPaths()),
                             concatenate(this.toPath(), otherpath.toPath())]);
  }

  /**
   * Get the points that make up the path.
   * note that this is current internal list of points, not an immutable copy.
   * @returns {Vector2[]} array of points the make up the path
   */
  getPoints () {
    const points = [];
    this.toPath().forEach((point, index) => {
      if (point !== null || index !== 0) {
        points.push([point[0], point[1]]);
      }
    });
    return points;
  }

  /**
   * Append an point to the end of the path.
   * @param {Vector2D} point - point to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoint (point) {
    return this.concat(new Path2D([point]));
  }

  /**
   * Append a list of points to the end of the path.
   * @param {Vector2D[]} points - points to append
   * @returns {Path2D} new Path2D object (not closed)
   */
  appendPoints (points) {
    return this.concat(new Path2D(points));
  }

  close () {
    return Path2D.fromPaths([...butLast(this.toPaths()), this.getPoints()]);
  }

  /**
   * Determine if the path is a closed or not.
   * @returns {Boolean} true when the path is closed, otherwise false
   */
  isClosed () {
    return isClosed(last(this.toPaths()));
  }

  /**
   * Determine the overall clockwise or anti-clockwise turn of a path.
   * See: http://mathworld.wolfram.com/PolygonArea.html
   * @returns {String} One of ['clockwise', 'counter-clockwise', 'straight'].
   */
  getTurn () {
    const area = measureArea(this.toPath());
    if (area > 0) {
      return 'clockwise';
    } else if (area < 0) {
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

  material (material) {
    return Assembly.fromGeometries([this.geometry]).material(material);
  }

  toSurface () {
    return Error('Not yet implemented');
  }

  toGeometry () {
    return this.geometry;
  }

  toPath () {
    return last(this.toPaths());
  }

  toPaths () {
    return this.geometry.toPaths({});
  }

  transform (matrix4x4) {
    return Path2D.fromGeometry(this.geometry.transform(matrix4x4));
  }
}

// Path2D.arc = (...params) => new Path2D(buildCircleArc(...params));
Path2D.fromGeometry = (geometry) => new Path2D(undefined, undefined, geometry);
Path2D.fromPaths = (paths) => new Path2D(undefined, undefined, fromPaths({}, canonicalize(paths)));
