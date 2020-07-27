import './types.js';

import { dot } from '@jsxcad/math-vec3';
import { toPlane as toPlaneOfPolygon } from '@jsxcad/math-poly3';

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
 * getPlanesOfPoint
 *
 * @param {Point} point
 * @returns {Plane[]}
 */
const getPlanesOfPoint = (planesOfPoint, point) => {
  let planes = planesOfPoint.get(point);
  if (planes === undefined) {
    planes = [];
    planesOfPoint.set(point, planes);
  }
  return planes;
};

export const fromSolidToJunctions = (solid, normalize) => {
  const polygons = [];
  for (const surface of solid) {
    polygons.push(...surface);
  }
  return fromPolygonsToJunctions(polygons, normalize);
};

export const fromSurfaceToJunctions = (surface, normalize) =>
  fromPolygonsToJunctions(surface, normalize);

export const fromPolygonsToJunctions = (polygons, normalize) => {
  const planesOfPoint = new Map();

  /**
   * considerJunction
   *
   * @param {Point} point
   * @param {Plane} planeOfPath
   * @returns {undefined}
   */
  const considerJunction = (point, planeOfPolygon) => {
    let planes = getPlanesOfPoint(planesOfPoint, point);
    for (const plane of planes) {
      if (equalsPlane(plane, planeOfPolygon)) {
        return;
      }
    }
    planes.push(planeOfPolygon);
    // A point can be at the corner of more than three polygons.
  };

  for (const polygon of polygons) {
    for (const point of polygon) {
      considerJunction(normalize(point), toPlaneOfPolygon(polygon));
    }
  }

  return planesOfPoint;
};

/**
 * junctionSelector
 *
 * @function
 * @param {Solid} solid
 * @param {Normalizer} normalize
 * @returns {PointSelector}
 */
export const junctionSelector = (junctions, normalize) => {
  const select = (point) => getPlanesOfPoint(junctions, point).length >= 3;

  return select;
};
