import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { distance } from '@jsxcad/math-vec3';
import { getEdges } from '@jsxcad/geometry-path';
import { pushWhenValid } from '@jsxcad/geometry-polygons';
import { toPlane } from '@jsxcad/math-poly3';

const THRESHOLD = 1e-5;

// We expect a solid of reconciled triangles.

const X = 0;
const Y = 1;
const Z = 2;

const orderVertices = (a, b) => {
  const dX = a[X] - b[X];
  if (dX !== 0) return dX;
  const dY = a[Y] - b[Y];
  if (dY !== 0) return dY;
  const dZ = a[Z] - b[Z];
  return dZ;
};

export const makeWatertight = (solid, normalize, threshold = THRESHOLD) => {
  if (normalize === undefined) {
    normalize = createNormalize3(1 / threshold);
  }

  const vertices = new Set();

  const reconciledSolid = [];
  for (const surface of solid) {
    const reconciledSurface = [];
    for (const path of surface) {
      const reconciledPath = [];
      for (const point of path) {
        const reconciledPoint = normalize(point);
        reconciledPath.push(reconciledPoint);
        vertices.add(reconciledPoint);
      }
      if (toPlane(reconciledPath) !== undefined) {
        // Filter degenerates.
        reconciledSurface.push(reconciledPath);
      }
    }
    reconciledSolid.push(reconciledSurface);
  }

  const orderedVertices = [...vertices];
  orderedVertices.sort(orderVertices);
  for (let i = 0; i < orderedVertices.length; i++) {
    orderedVertices[i].index = i;
  }

  const watertightSolid = [];
  for (const surface of reconciledSolid) {
    const watertightPaths = [];
    for (const path of surface) {
      const watertightPath = [];
      for (const [start, end] of getEdges(path)) {
        watertightPath.push(start);
        const span = distance(start, end);
        const colinear = [];
        // let limit = Math.max(start.index, end.index);
        // for (let i = Math.min(start.index, end.index); i <= limit; i++) {
        for (let i = 0; i < orderedVertices.length; i++) {
          const vertex = orderedVertices[i];
          // FIX: Threshold
          if (
            Math.abs(distance(start, vertex) + distance(vertex, end) - span) <
            threshold
          ) {
            colinear.push(vertex);
          }
        }
        // Arrange by distance from start.
        colinear.sort((a, b) => distance(start, a) - distance(start, b));
        // Insert into the path.
        watertightPath.push(...colinear);
      }
      pushWhenValid(watertightPaths, watertightPath);
    }
    watertightSolid.push(watertightPaths);
  }

  return watertightSolid;
};

export const isWatertight = (solid) => {
  const edges = new Set();
  for (const surface of solid) {
    for (const path of surface) {
      for (const [start, end] of getEdges(path)) {
        edges.add(`${JSON.stringify([start, end])}`);
      }
    }
  }
  for (const surface of solid) {
    for (const path of surface) {
      for (const [start, end] of getEdges(path)) {
        if (!edges.has(`${JSON.stringify([end, start])}`)) {
          return false;
        }
      }
    }
  }
  return true;
};
