import { fromSolid as fromSolidToBsp, section as intersectionOfSurfaceWithSolid, removeExteriorPolygonsForSection, unifyBspTrees } from '@jsxcad/geometry-bsp';
import { makeWatertight as makeWatertightSurface, toPlane as fromSurfaceToPlane } from '@jsxcad/geometry-surface';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { toPolygon as fromPlaneToPolygon } from '@jsxcad/math-plane';
import { fromSurface as fromSurfaceToSolid } from '@jsxcad/geometry-solid';
import { getAnySurfaces } from './getAnySurfaces.js';
import { getPaths } from './getPaths.js';
import { getPoints } from './getPoints.js';
import { getSolids } from './getSolids.js';
import { union as pathsUnion } from '@jsxcad/geometry-paths';
import { union as pointsUnion } from '@jsxcad/geometry-points';
import { rewrite } from './visit.js';
import { union as solidUnion } from '@jsxcad/geometry-solid-boolean';
import { taggedPaths } from './taggedPaths.js';
import { taggedPoints } from './taggedPoints.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';
import { taggedZ0Surface } from './taggedZ0Surface.js';

// Union is a little more complex, since it can violate disjointAssembly invariants.
const unionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'solid': {
        const todo = [];
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            todo.push(solid);
          }
        }
        // No meaningful way to unify with a surface.
        return taggedSolid(
          { tags },
          solidUnion(geometry.solid, ...todo)
        );
      }
      case 'surface': {
        const normalize = createNormalize3();
        let planeSurface = fromPlaneToPolygon(fromSurfaceToPlane(geometry.surface));
        const clipFaces = [];
        clipFaces.push(...fromSurfaceToSolid(geometry.surface, normalize));
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            clipFaces.push(...solid);
          }
          for (const { surface, z0Surface } of getAnySurfaces(geometry)) {
            clipFaces.push(...fromSurfaceToSolid(surface || z0Surface, normalize));
          }
        }
        const clippedSurface = intersectionOfSurfaceWithSolid(clipFaces, [planeSurface], normalize)[0];
        return taggedSurface({ tags }, makeWatertightSurface(clippedSurface));
      }
      case 'z0Surface': {
        const normalize = createNormalize3();
        let planarPolygon = fromPlaneToPolygon([0, 0, 1, 0]);
        let bsp = fromSolidToBsp(fromSurfaceToSolid(geometry.z0Surface, normalize), normalize);
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            bsp = unifyBspTrees(fromSolidToBsp(solid, normalize), bsp);
          }
          for (const { surface, z0Surface } of getAnySurfaces(geometry)) {
            bsp = unifyBspTrees(fromSolidToBsp(fromSurfaceToSolid(surface || z0Surface, normalize), normalize), bsp);
          }
        }
        const clippedSurface = removeExteriorPolygonsForSection(bsp, [planarPolygon], normalize);
        return taggedZ0Surface({ tags }, makeWatertightSurface(clippedSurface));
      }
      case 'paths': {
        const { paths, tags } = geometry;
        const pathsets = [];
        for (const { paths } of getPaths(geometry)) {
          pathsets.push(paths);
        }
        return taggedPaths({ tags }, pathsUnion(paths, ...pathsets));
      }
      case 'points': {
        const { points, tags } = geometry;
        const pointsets = [];
        for (const { points } of getPoints(geometry)) {
          pointsets.push(points);
        }
        return taggedPoints({ tags }, pointsUnion(points, ...pointsets));
      }
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for union.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(geometry, op);
};

/*
const unionImpl = (geometry, ...geometries) => {
  // Extract the compositional geometries to add.
  const pathsets = [];
  const solids = [];
  const surfaces = [];
  const z0Surfaces = [];
  const pointsets = [];
  for (const geometry of geometries) {
    for (const { surface } of getSurfaces(geometry)) {
      surfaces.push(surface);
    }
    for (const { z0Surface } of getZ0Surfaces(geometry)) {
      z0Surfaces.push(z0Surface);
    }
    for (const { solid } of getSolids(geometry)) {
      solids.push(solid);
    }
    for (const { paths } of getPaths(geometry)) {
      pathsets.push(paths);
    }
    for (const { points } of getPoints(geometry)) {
      pointsets.push(points);
    }
  }

  // For assemblies and layers we effectively compose with each element.
  // This renders disjointAssemblies into assemblies.
  // TODO: Preserve disjointAssemblies by only composing with the last compatible item.

  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'solid': {
        const { solid, tags } = geometry;
        return taggedSolid({ tags }, solidUnion(solid, ...solids));
      }
      case 'surface': {
        const { surface, tags } = geometry;
        return taggedSurface(
          { tags },
          surfaceUnion(surface, ...surfaces, ...z0Surfaces)
        );
      }
      case 'z0Surface': {
        const { z0Surface, tags } = geometry;
        if (surfaces.length === 0) {
          return taggedZ0Surface(
            { tags },
            z0SurfaceUnion(z0Surface, ...z0Surfaces)
          );
        } else {
          return taggedSurface(
            { tags },
            surfaceUnion(z0Surface, ...surfaces, ...z0Surfaces)
          );
        }
      }
      case 'paths': {
        const { paths, tags } = geometry;
        return taggedPaths({ tags }, pathsUnion(paths, ...pathsets));
      }
      case 'points': {
        const { points, tags } = geometry;
        return taggedPoints({ tags }, pointsUnion(points, ...pointsets));
      }
      case 'sketch': {
        // Sketches aren't real for union.
        return geometry;
      }
      case 'assembly':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      default: {
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
      }
    }
  };

  return rewrite(geometry, op);
};
*/

export const union = cache(unionImpl);
