import {
  toPaths as toPathsFromGraph,
  toSolid as toSolidFromGraph,
  toSurface as toSurfaceFromGraph,
} from '@jsxcad/geometry-graph';

import { toPlane } from '@jsxcad/math-poly3';
import { toTriangles } from '@jsxcad/geometry-polygons';

const pointsToThreejsPoints = (points) => points;

const solidToThreejsSolid = (solid) => {
  const normals = [];
  const positions = [];
  for (const surface of solid) {
    for (const triangle of toTriangles({}, surface)) {
      const plane = toPlane(triangle);
      if (plane === undefined) {
        continue;
      }
      const [px, py, pz] = plane;
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
  for (const triangle of toTriangles({}, surface)) {
    const plane = toPlane(triangle);
    if (plane === undefined) {
      continue;
    }
    const [px, py, pz] = plane;
    for (const [x = 0, y = 0, z = 0] of triangle) {
      normals.push(px, py, pz);
      positions.push(x, y, z);
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
    case 'graph':
      if (geometry.graph.isWireframe) {
        return {
          type: 'paths',
          threejsPaths: toPathsFromGraph(geometry.graph),
          tags,
          isThreejsGeometry: true,
        };
      } else if (geometry.graph.isClosed) {
        return {
          type: 'solid',
          threejsSolid: solidToThreejsSolid(toSolidFromGraph(geometry.graph)),
          tags,
          isThreejsGeometry: true,
        };
      } else {
        return {
          type: 'surface',
          threejsSurface: surfaceToThreejsSurface(
            toSurfaceFromGraph(geometry.graph)
          ),
          tags,
          isThreejsGeometry: true,
        };
      }
    default:
      throw Error(`Unexpected geometry: ${geometry.type}`);
  }
};
