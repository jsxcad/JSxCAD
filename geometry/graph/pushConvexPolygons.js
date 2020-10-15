import { eachLoopEdge, getFaceNode, getPointNode } from './graph.js';
import {
  flip as flipPolygon,
  toPlane as toPlaneOfPolygon,
} from '@jsxcad/math-poly3';

import { dot } from '@jsxcad/math-vec3';
import earcut from 'earcut';

const X = 0;
const Y = 1;
const Z = 2;

const buildContourXy = (points, contour, graph, loop, selectJunction) => {
  const index = contour.length >>> 1;
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    const point = getPointNode(graph, edgeNode.point);
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
    const point = getPointNode(graph, edgeNode.point);
    if (selectJunction(edgeNode.point)) {
      points.push(point);
      contour.push(point[X], point[Z]);
    }
  });
  return index;
};

const buildContourYz = (points, contour, graph, loop, selectJunction) => {
  const index = contour.length >>> 1;
  eachLoopEdge(graph, loop, (edge, edgeNode) => {
    const point = getPointNode(graph, edgeNode.point);
    if (selectJunction(edgeNode.point)) {
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
    // Best aligned with the Z axis.
    return buildContourXy;
  }
  const tY = dot(plane, [0, 1, 0, 0]);
  if (tY >= 0.5) {
    // Best aligned with the Y axis.
    return buildContourXz;
  } else if (tY <= -0.5) {
    // Best aligned with the Y axis.
    return buildContourXz;
  }
  // Best aligned with the X axis.
  return buildContourYz;
};

export const pushConvexPolygons = (
  polygons,
  graph,
  face,
  selectJunction = (any) => true,
  concavePolygons
) => {
  const faceNode = getFaceNode(graph, face);
  let plane = faceNode.plane;
  if (plane === undefined) {
    return;
  }
  const buildContour = selectBuildContour(plane);
  const points = [];
  const contour = [];
  buildContour(points, contour, graph, faceNode.loop, selectJunction);
  if (points.length === 3) {
    // Triangles are easy.
    polygons.push(points);
    return;
  }
  if (concavePolygons) {
    concavePolygons.push(...points);
  }
  if (dot(toPlaneOfPolygon(points), plane) < 0.9) {
    console.log(`QQ/plane drift`);
  }
  const holes = [];
  if (faceNode.holes) {
    for (const hole of faceNode.holes) {
      const index = buildContour(points, contour, graph, hole, selectJunction);
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
