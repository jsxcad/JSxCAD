import { cross, dot, subtract } from "@jsxcad/math-vec3";

import { toPlane } from "./toPlane";

/**
 * Check whether the polygon is convex.
 * @returns {boolean}
 */
const areVerticesConvex = (vertices, plane) => {
  if (plane === undefined) {
    return false;
  }
  const numvertices = vertices.length;
  if (numvertices > 3) {
    let prevprevpos = vertices[numvertices - 2];
    let prevpos = vertices[numvertices - 1];
    for (let i = 0; i < numvertices; i++) {
      const pos = vertices[i];
      if (!isConvexPoint(prevprevpos, prevpos, pos, plane)) {
        return false;
      }
      prevprevpos = prevpos;
      prevpos = pos;
    }
  }
  return true;
};

// calculate whether three points form a convex corner
//  prevpoint, point, nextpoint: the 3 coordinates (Vector3D instances)
//  normal: the normal vector of the plane
const isConvexPoint = (prevpoint, point, nextpoint, plane) => {
  const crossproduct = cross(
    subtract(point, prevpoint),
    subtract(nextpoint, point)
  );
  // The plane of a polygon is structurally equivalent to its normal.
  const crossdotnormal = dot(crossproduct, plane);
  // CHECK: 0 or EPS?
  return crossdotnormal >= 0;
};

export const isConvex = (polygon) =>
  areVerticesConvex(polygon, toPlane(polygon));
