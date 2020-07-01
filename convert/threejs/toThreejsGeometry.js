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
    for (const triangle of toTriangles({}, surface)) {
      for (const point of triangle) {
        const plane = toPlane(triangle);
        if (plane === undefined) continue;
        const [x, y, z] = plane;
        normals.push(x, y, z);
        positions.push(...point);
      }
    }
  }
  return { normals, positions };
};

const surfaceToThreejsSurface = (surface) => {
  const normals = [];
  const positions = [];
  for (const triangle of toTriangles({}, makeConvex(surface))) {
    for (const point of triangle) {
      const plane = toPlane(triangle);
      if (plane === undefined) continue;
      const [x, y, z] = plane;
      normals.push(x, y, z);
      positions.push(...point);
    }
  }
  return { normals, positions };
};

export const toThreejsGeometry = (geometry, supertags) => {
  const tags = [...(supertags || []), ...(geometry.tags || [])];
  if (geometry.isThreejsGeometry) {
    return geometry;
  }
  switch (geometry.type) {
    case 'assembly':
      return {
        assembly: geometry.content.map((item) => toThreejsGeometry(item, tags)),
        tags,
        isThreejsGeometry: true,
      };
    case 'disjointAssembly': {
      return {
        assembly: geometry.content.map((item) => toThreejsGeometry(item, tags)),
        tags,
        isThreejsGeometry: true,
      };
    }
    case 'layers':
      return {
        assembly: geometry.content.map((item) => toThreejsGeometry(item, tags)),
        tags,
        isThreejsGeometry: true,
      };
    case 'item':
      return {
        item: toThreejsGeometry(geometry.content[0], tags),
        tags,
        isThreejsGeometry: true,
      };
    case 'paths':
      return {
        threejsSegments: pathsToThreejsSegments(geometry.paths),
        tags,
        isThreejsGeometry: true,
      };
    case 'plan':
      return {
        threejsPlan: geometry.plan,
        threejsMarks: geometry.marks,
        threejsVisualization: toThreejsGeometry(geometry.visualization),
        threejsContent: toThreejsGeometry(geometry.content[0]),
        tags,
        isThreejsGeometry: true,
      };
    case 'points':
      return {
        threejsSegments: pointsToThreejsPoints(geometry.points),
        tags,
        isThreejsGeometry: true,
      };
    case 'solid':
      return {
        threejsSolid: solidToThreejsSolid(geometry.solid),
        tags,
        isThreejsGeometry: true,
      };
    case 'surface':
      return {
        threejsSurface: surfaceToThreejsSurface(geometry.surface),
        tags,
        isThreejsGeometry: true,
      };
    case 'z0Surface':
      return {
        threejsSurface: surfaceToThreejsSurface(geometry.z0Surface),
        tags,
        isThreejsGeometry: true,
      };
    default:
      throw Error(
        `Unexpected geometry ${geometry.type} ${JSON.stringify(geometry)}`
      );
  }
};
