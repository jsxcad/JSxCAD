/* @module */

import { Edge, Path, Plane, PointSelector, Polygons } from './types';

import {
  flip as flipPolygon,
  toPlane as toPlaneOfPolygon
} from '@jsxcad/math-poly3';

import { dot } from '@jsxcad/math-vec3';
import earcut from 'earcut';
import { toPlane } from './toPlane';

const X = 0;
const Y = 1;
const Z = 2;

/**
 * buildContourXy
 *
 * @param {Path} points
 * @param {Array<number>} contour
 * @param {Edge} loop
 * @param {PointSelector} selectJunction
 * @returns {number}
 */
const buildContourXy = (points, contour, loop, selectJunction) => {
  const index = contour.length >>> 1;
  let link = loop;
  do {
    if (link.start !== link.next.start && selectJunction(link.start)) {
      points.push(link.start);
      contour.push(link.start[X], link.start[Y]);
    }
    link = link.next;
  } while (link !== loop);
  return index;
};

/**
 * buildContourXz
 *
 * @param {Path} points
 * @param {Array<number>} contour
 * @param {Edge} loop
 * @param {PointSelector} selectJunction
 * @returns {number}
 */
const buildContourXz = (points, contour, loop, selectJunction) => {
  const index = contour.length >>> 1;
  let link = loop;
  do {
    if (link.start !== link.next.start && selectJunction(link.start)) {
      points.push(link.start);
      contour.push(link.start[X], link.start[Z]);
    }
    link = link.next;
  } while (link !== loop);
  return index;
};

/**
 * buildContourYz
 *
 * @param {Path} points
 * @param {Array<number>} contour
 * @param {Edge} loop
 * @param {PointSelector} selectJunction
 * @returns {number}
 */
const buildContourYz = (points, contour, loop, selectJunction) => {
  const index = contour.length >>> 1;
  let link = loop;
  do {
    if (link.start !== link.next.start && selectJunction(link.start)) {
      points.push(link.start);
      contour.push(link.start[Y], link.start[Z]);
    }
    link = link.next;
  } while (link !== loop);
  return index;
};

/**
 * selectBuildContour
 *
 * @param {Plane} plane
 * @returns {Function}
 */
const selectBuildContour = (plane) => {
  const tZ = dot(plane, [0, 0, 1, 0]);
  if (tZ >= 0.5) {
    // Best aligned with the Z axis.
    return buildContourXy;
  } else if (tZ <= -0.5) {
    return buildContourXy;
  }
  const tY = dot(plane, [0, 1, 0, 0]);
  if (tY >= 0.5) {
    // Best aligned with the Y axis.
    return buildContourXz;
  } else if (tY <= -0.5) {
    return buildContourXz;
  }
  const tX = dot(plane, [1, 0, 0, 0]);
  if (tX >= 0) {
    return buildContourYz;
  } else {
    return buildContourYz;
  }
};

/**
 * pushConvexPolygons
 *
 * @param {Polygons} polygons
 * @param {Edge} loop
 * @param {PointSelector} selectJunction
 * @returns {void}
 */
export const pushConvexPolygons = (polygons, loop, selectJunction) => {
  const plane = toPlane(loop);
  const buildContour = selectBuildContour(plane);
  const points = [];
  const contour = [];
  buildContour(points, contour, loop, selectJunction);
  const holes = [];
  if (loop.face.holes) {
    for (const hole of loop.face.holes) {
      const index = buildContour(points, contour, hole, selectJunction);
      if (index !== contour.length >>> 1) {
        holes.push(index);
      }
    }
  }
  const triangles = earcut(contour, holes);
  for (let i = 0; i < triangles.length; i += 3) {
    const a = triangles[i + 0];
    const b = triangles[i + 1];
    const c = triangles[i + 2];
    const triangle = [points[a], points[b], points[c]];
    const trianglePlane = toPlaneOfPolygon(triangle);
    if (trianglePlane === undefined) {
      // Degenerate.
      continue;
    }
    if (dot(trianglePlane, plane) < 0) {
      polygons.push(flipPolygon(triangle));
    } else {
      polygons.push(triangle);
    }
  }
};

export default pushConvexPolygons;
