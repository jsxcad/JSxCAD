import { makeConvex } from '@jsxcad/geometry-surface';
import { toPlane } from '@jsxcad/math-poly3';
import { toSegments } from '@jsxcad/geometry-path';
import { toTriangles } from '@jsxcad/geometry-polygons';

const pointsToThreejsPoints = (points) => points;

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
    // These should already be convex.
    for (const triangle of toTriangles({}, surface)) {
      for (const point of triangle) {
        const plane = toPlane(triangle);
        if (plane === undefined) {
          continue;
        }
        const [x, y, z] = toPlane(triangle);
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
      if (plane === undefined) {
        continue;
      }
      const [x, y, z] = toPlane(triangle);
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
  } else if (geometry.assembly) {
    return {
      assembly: geometry.assembly.map(item => toThreejsGeometry(item, tags)),
      tags,
      isThreejsGeometry: true
    };
  } else if (geometry.disjointAssembly) {
    const items = geometry.disjointAssembly;
    return {
      assembly: items.map(item => toThreejsGeometry(item, tags)),
      tags,
      isThreejsGeometry: true
    };
  } else if (geometry.layers) {
    return {
      assembly: geometry.layers.map(item => toThreejsGeometry(item, tags)),
      tags,
      isThreejsGeometry: true
    };
  } else if (geometry.item) {
    return {
      item: toThreejsGeometry(geometry.item, tags),
      tags,
      isThreejsGeometry: true
    };
  } else if (geometry.paths) {
    return { threejsSegments: pathsToThreejsSegments(geometry.paths), tags, isThreejsGeometry: true };
  } else if (geometry.plan) {
    return {
      threejsPlan: geometry.plan,
      threejsMarks: geometry.marks,
      threejsVisualization: toThreejsGeometry(geometry.visualization),
      threejsContent: toThreejsGeometry(geometry.content),
      tags,
      isThreejsGeometry: true
    };
  } else if (geometry.points) {
    return { threejsPoints: pointsToThreejsPoints(geometry.points), tags, isThreejsGeometry: true };
  } else if (geometry.solid) {
    return { threejsSolid: solidToThreejsSolid(geometry.solid), tags, isThreejsGeometry: true };
  } else if (geometry.surface) {
    return { threejsSurface: surfaceToThreejsSurface(geometry.surface), tags, isThreejsGeometry: true };
  } else if (geometry.z0Surface) {
    return { threejsSurface: surfaceToThreejsSurface(geometry.z0Surface), tags, isThreejsGeometry: true };
  }
};
