/**
 * @typedef {import("./types").Plane} Plane
 * @typedef {import("./types").Point} Point
 * @typedef {import("./types").PointSelector} PointSelector
 * @typedef {import("./types").Normalizer} Normalizer
 * @typedef {import("./types").Solid} Solid
 */

import { dot } from '@jsxcad/math-vec3';
import { toPlane as toPlaneOfPath } from '@jsxcad/math-poly3';

const THRESHOLD = 0.99999;

/**
 * equalsPlane
 *
 * @function
 * @param {Plane} a
 * @param {Plane} b
 * @returns {boolean} b
 */
export const equalsPlane = (a, b) => {
  if (a === undefined || b === undefined) {
    return false;
  }
  const t = dot(a, b);
  if (t >= THRESHOLD) {
    return true;
  } else {
    return false;
  }
};

/**
 * junctionSelector
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @returns {PointSelector}
 */
export const junctionSelector = (solid, normalize) => {
  const planesOfPoint = new Map();

  /**
   * getPlanesOfPoint
   *
   * @param {Point} point
   * @returns {Array<Plane>}
   */
  const getPlanesOfPoint = (point) => {
    let planes = planesOfPoint.get(point);
    if (planes === undefined) {
      planes = [];
      planesOfPoint.set(point, planes);
    }
    return planes;
  };

  /**
   * considerJunction
   *
   * @param {Point} point
   * @param {Plane} planeOfPath
   * @returns {undefined}
   */
  const considerJunction = (point, planeOfPath) => {
    let planes = getPlanesOfPoint(point);
    for (const plane of planes) {
      if (equalsPlane(plane, planeOfPath)) {
        return;
      }
    }
    planes.push(planeOfPath);
  };

  for (const surface of solid) {
    for (const path of surface) {
      for (const point of path) {
        considerJunction(normalize(point), toPlaneOfPath(path));
      }
    }
  }

  // A corner is defined as a point of intersection of three distinct planes.
  /** @type {PointSelector} */
  const select = (point) => getPlanesOfPoint(point).length >= 3;

  return select;
};
