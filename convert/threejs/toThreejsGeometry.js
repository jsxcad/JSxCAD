import { makeConvex } from '@jsxcad/geometry-surface';
import { toPlane } from '@jsxcad/math-poly3';
import { toSegments } from '@jsxcad/geometry-path';
import { toTriangles } from '@jsxcad/geometry-polygons';

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

const solidToThreejsSolid = (solid) => {
  const normals = [];
  const positions = [];
  for (const surface of solid) {
    for (const triangle of toTriangles({}, makeConvex({}, surface))) {
      for (const point of triangle) {
        const [x, y, z] = toPlane(triangle);
        normals.push(x, y, z);
        positions.push(...point);
      }
    }
  }
  return { normals, positions };
};

const z0SurfaceToThreejsSurface = (surface) => {
  const normals = [];
  const positions = [];
  const outputTriangle = (triangle) => {
    for (const point of triangle) {
      const [x, y, z] = toPlane(triangle);
      normals.push(x, y, z);
      positions.push(...point);
    }
  };
  for (const triangle of toTriangles({}, makeConvex({}, surface))) {
    outputTriangle(triangle);
  }
  return { normals, positions };
};

export const toThreejsGeometry = (geometry, supertags) => {
  const tags = [...(supertags || []), ...(geometry.tags || [])];
  if (geometry.isThreejsGeometry) {
    return geometry;
  } else if (geometry.assembly) {
    return {
      assembly: geometry.assembly.map(item => toThreejsGeometry(item, tags)),
      tags: tags,
      isThreejsGeometry: true
    };
  } else if (geometry.paths) {
    return { threejsSegments: pathsToThreejsSegments(geometry.paths), tags: tags, isThreejsGeometry: true };
  } else if (geometry.points) {
    return { threejsSegments: pointsToThreejsPoints(geometry.points), tags: tags, isThreejsGeometry: true };
  } else if (geometry.solid) {
    return { threejsSolid: solidToThreejsSolid(geometry.solid), tags: tags, isThreejsGeometry: true };
  } else if (geometry.z0Surface) {
    return { threejsSurface: z0SurfaceToThreejsSurface(geometry.z0Surface), tags: tags, isThreejsGeometry: true };
  }
};
