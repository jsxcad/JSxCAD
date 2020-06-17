import { makeConvex } from '@jsxcad/geometry-surface';
import { toPlane } from '@jsxcad/math-poly3';
import { toTriangles } from '@jsxcad/geometry-polygons';

const pointsToThreejsPoints = (points) => points;

const solidToThreejsSolid = (solid) => {
  const normals = [];
  const positions = [];
  for (const surface of solid) {
    // for (const convex of makeConvex(surface)) {
    for (const triangle of toTriangles({}, surface)) {
      const plane = toPlane(triangle);
      if (plane === undefined) {
        continue;
      }
      const [px, py, pz] = toPlane(triangle);
      for (const [x = 0, y = 0, z = 0] of triangle) {
        normals.push(px, py, pz);
        positions.push(x, y, z);
      }
    }
  }
  return { normals, positions };
};

const surfaceToThreejsSurface = (surface) => {
  const normals = [];
  const positions = [];
  for (const convex of makeConvex(surface)) {
    const plane = toPlane(convex);
    if (plane === undefined) {
      continue;
    }
    const [x, y, z] = toPlane(convex);
    for (const point of convex) {
      normals.push(x, y, z);
      positions.push(...point);
    }
  }
  return { normals, positions };
};

export const toThreejsGeometry = (geometry, supertags) => {
  const tags = [...(supertags || []), ...(geometry.tags || [])];
  if (tags.includes('compose/non-positive')) {
    return;
  }
  if (geometry.isThreejsGeometry) {
    return geometry;
  } else if (geometry.assembly) {
    return {
      assembly: geometry.assembly.map((item) => toThreejsGeometry(item, tags)),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.disjointAssembly) {
    const items = geometry.disjointAssembly;
    return {
      assembly: items.map((item) => toThreejsGeometry(item, tags)),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.layers) {
    return {
      assembly: geometry.layers.map((item) => toThreejsGeometry(item, tags)),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.item) {
    return {
      item: toThreejsGeometry(geometry.item, tags),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.paths) {
    return {
      threejsPaths: geometry.paths,
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.plan) {
    return {
      threejsPlan: geometry.plan,
      threejsMarks: geometry.marks,
      threejsVisualization: toThreejsGeometry(geometry.visualization),
      threejsContent: toThreejsGeometry(geometry.content),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.points) {
    return {
      threejsPoints: pointsToThreejsPoints(geometry.points),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.solid) {
    return {
      threejsSolid: solidToThreejsSolid(geometry.solid),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.surface) {
    return {
      threejsSurface: surfaceToThreejsSurface(geometry.surface),
      tags,
      isThreejsGeometry: true,
    };
  } else if (geometry.z0Surface) {
    return {
      threejsSurface: surfaceToThreejsSurface(geometry.z0Surface),
      tags,
      isThreejsGeometry: true,
    };
  }
};
