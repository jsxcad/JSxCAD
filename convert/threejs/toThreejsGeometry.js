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
  }
  switch (geometry.type) {
    case 'layout':
    case 'assembly':
    case 'disjointAssembly':
    case 'layers':
      return {
        type: 'assembly',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'sketch':
      return {
        type: 'sketch',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'item':
      return {
        type: 'item',
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'paths':
      return {
        type: 'paths',
        threejsPaths: geometry.paths,
        tags,
        isThreejsGeometry: true,
      };
    case 'plan':
      return {
        type: 'plan',
        threejsPlan: geometry.plan,
        threejsMarks: geometry.marks,
        content: geometry.content.map((content) =>
          toThreejsGeometry(content, tags)
        ),
        tags,
        isThreejsGeometry: true,
      };
    case 'points':
      return {
        type: 'points',
        threejsPoints: pointsToThreejsPoints(geometry.points),
        tags,
        isThreejsGeometry: true,
      };
    case 'solid':
      return {
        type: 'solid',
        threejsSolid: solidToThreejsSolid(geometry.solid),
        tags,
        isThreejsGeometry: true,
      };
    case 'surface':
      return {
        type: 'surface',
        threejsSurface: surfaceToThreejsSurface(geometry.surface),
        tags,
        isThreejsGeometry: true,
      };
    case 'z0Surface':
      return {
        type: 'surface',
        threejsSurface: surfaceToThreejsSurface(geometry.z0Surface),
        tags,
        isThreejsGeometry: true,
      };
    default:
      throw Error(`Unexpected geometry: ${geometry.type}`);
  }
};
