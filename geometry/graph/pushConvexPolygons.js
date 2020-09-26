import {
  flip as flipPolygon,
  toPlane as toPlaneOfPolygon,
} from '@jsxcad/math-poly3';

import { dot } from '@jsxcad/math-vec3';
import { eachLoopEdge } from './graph.js';
import earcut from 'earcut';
import { toPlane } from './toPlane.js';

const X = 0;
const Y = 1;
const Z = 2;

const buildContourXy = (points, contour, graph, loop, selectJunction) => {
  const index = contour.length >>> 1;
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    const point = graph.point[edgeNode.start];
    if (selectJunction(point)) {
      points.push(point);
      contour.push(point[X], point[Y]);
    }
  });
  return index;
};

const buildContourXz = (points, contour, graph, loop, selectJunction) => {
  const index = contour.length >>> 1;
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    const point = graph.point[edgeNode.start];
    if (selectJunction(edgeNode.start)) {
      points.push(point);
      contour.push(point[X], point[Z]);
    }
  });
  return index;
};

const buildContourYz = (points, contour, graph, loop, selectJunction) => {
  const index = contour.length >>> 1;
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    const point = graph.point[edgeNode.start];
    if (selectJunction(edgeNode.start)) {
      points.push(point);
      contour.push(point[Y], point[Z]);
    }
  });
  return index;
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

export const pushConvexPolygons = (
  polygons,
  graph,
  face,
  selectJunction = (any) => true,
  concavePolygons
) => {
  const faceNode = graph.face[face];
  const loop = faceNode.edge;
  const plane = faceNode.plane;
  const buildContour = selectBuildContour(plane);
  const points = [];
  const contour = [];
  buildContour(points, contour, graph, loop, selectJunction);
  if (concavePolygons) {
    concavePolygons.push(...points);
  }
  const holes = [];
  /*
  FIX: Hole construction.
  if (loop.face.holes) {
    for (const hole of loop.face.holes) {
      const index = buildContour(points, contour, graph, hole, selectJunction);
      if (index !== contour.length >>> 1) {
        holes.push(index);
      }
    }
  }
  */
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
