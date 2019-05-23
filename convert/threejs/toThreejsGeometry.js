import { canonicalize, toTriangles } from '@jsxcad/geometry-polygons';
import { flip, toPlane } from '@jsxcad/math-poly3';

import { makeConvex } from '@jsxcad/geometry-surface';
import { toPolygons } from '@jsxcad/geometry-solid';
import { toSegments } from '@jsxcad/geometry-path';

const pointsToThreejsPoints = (geometry) => {
  return geometry.points;
};

const pathsToThreejsSegments = (geometry) => {
  const segments = [];
  for (const path of geometry) {
    for (const [start, end] of toSegments({}, path)) {
      segments.push([start, end]);
    }
  }
  return segments;
};

const solidToThreejsSolid = (geometry) => {
  const normals = [];
  const positions = [];
  for (const triangle of canonicalize(toTriangles({}, toPolygons({}, geometry)))) {
    for (const point of triangle) {
      const [x, y, z] = toPlane(triangle);
      normals.push(x, y, z);
      positions.push(...point);
    }
  }
  return { normals, positions };
};

const z0SurfaceToThreejsSurface = (geometry) => {
  const normals = [];
  const positions = [];
  const outputTriangle = (triangle) => {
    for (const point of triangle) {
      const [x, y, z] = toPlane(triangle);
      normals.push(x, y, z);
      positions.push(...point);
    }
  };
  for (const triangle of toTriangles({}, makeConvex({}, geometry))) {
    outputTriangle(triangle);
    outputTriangle(flip(triangle));
  }
  return { normals, positions };
};

export const toThreejsGeometry = (geometry) => {
  if (geometry.isThreejsGeometry) {
    return geometry;
  } else if (geometry.assembly) {
    return { assembly: geometry.assembly.map(toThreejsGeometry), tags: geometry.tags, isThreejsGeometry: true };
  } else if (geometry.paths) {
    return { threejsSegments: pathsToThreejsSegments(geometry.paths), tags: geometry.tags, isThreejsGeometry: true };
  } else if (geometry.points) {
    return { threejsSegments: pointsToThreejsPoints(geometry.points), tags: geometry.tags, isThreejsGeometry: true };
  } else if (geometry.solid) {
    return { threejsSolid: solidToThreejsSolid(geometry.solid), tags: geometry.tags, isThreejsGeometry: true };
  } else if (geometry.z0Surface) {
    return { threejsSurface: z0SurfaceToThreejsSurface(geometry.z0Surface), tags: geometry.tags, isThreejsGeometry: true };
  }
};
