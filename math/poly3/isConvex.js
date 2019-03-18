import { toPlane } from './toPlane';
import { cross, dot, subtract } from '@jsxcad/math-vec3';

/**
 * Check whether the polygon is convex.
 * @returns {boolean}
 */
const areVerticesConvex = (vertices, plane) => {
  const numvertices = vertices.length;
  if (numvertices > 2) {
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
  // note: plane ~= normal point
  const crossdotnormal = dot(crossproduct, plane);
  return crossdotnormal >= 0;
};

// FIXME: not used anywhere ???
/* const isStrictlyConvexPoint = function (prevpoint, point, nextpoint, normal) {
  let crossproduct = point.minus(prevpoint).cross(nextpoint.minus(point))
  let crossdotnormal = crossproduct.dot(normal)
  return (crossdotnormal >= EPS)
} */

export const isConvex = (polygon) => areVerticesConvex(polygon, toPlane(polygon));
