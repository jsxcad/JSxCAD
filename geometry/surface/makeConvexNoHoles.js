import {
  flip as flipPolygon,
  toPlane as toPlaneOfPolygon,
} from "@jsxcad/math-poly3";

import { createNormalize3 } from "@jsxcad/algorithm-quantize";
import { dot } from "@jsxcad/math-vec3";
import earcut from "earcut";
import { toPlane } from "./toPlane";

const X = 0;
const Y = 1;
const Z = 2;

const buildContourXy = (polygon) => {
  const contour = [];
  for (const point of polygon) {
    contour.push(point[X], point[Y]);
  }
  return contour;
};

const buildContourXz = (polygon) => {
  const contour = [];
  for (const point of polygon) {
    contour.push(point[X], point[Z]);
  }
  return contour;
};

const buildContourYz = (polygon) => {
  const contour = [];
  for (const point of polygon) {
    contour.push(point[Y], point[Z]);
  }
  return contour;
};

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

export const makeConvexNoHoles = (
  surface,
  normalize3 = createNormalize3(),
  plane
) => {
  if (surface.length === undefined) {
    throw Error("die");
  }
  if (surface.length === 0) {
    // An empty surface is not non-convex.
    return surface;
  }
  if (surface.length === 1) {
    const polygon = surface[0];
    if (polygon.length === 3) {
      // A triangle is already convex.
      return surface;
    }
  }
  if (plane === undefined) {
    plane = toPlane(surface);
    if (plane === undefined) {
      return [];
    }
  }

  const convexSurface = [];
  const buildContour = selectBuildContour(plane);
  for (const polygon of surface) {
    const contour = buildContour(polygon);
    const triangles = earcut(contour);
    for (let i = 0; i < triangles.length; i += 3) {
      const a = triangles[i + 0];
      const b = triangles[i + 1];
      const c = triangles[i + 2];
      const triangle = [polygon[a], polygon[b], polygon[c]];
      const trianglePlane = toPlaneOfPolygon(triangle);
      if (trianglePlane === undefined) {
        // Degenerate.
        continue;
      }
      if (dot(trianglePlane, plane) < 0) {
        convexSurface.push(flipPolygon(triangle));
      } else {
        convexSurface.push(triangle);
      }
    }
  }

  return convexSurface;
};

export default makeConvexNoHoles;
