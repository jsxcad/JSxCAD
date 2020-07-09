import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSurface as fromSurfaceToSolid } from '@jsxcad/geometry-solid';
import { getAnySurfaces } from './getAnySurfaces.js';
import { getPaths } from './getPaths.js';
import { getSolids } from './getSolids.js';
import { section as intersectionOfSurfaceWithSolid } from '@jsxcad/geometry-bsp';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { rewrite } from './visit.js';
import { intersection as solidIntersection } from '@jsxcad/geometry-solid-boolean';
import { taggedPaths } from './taggedPaths.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';
import { taggedZ0Surface } from './taggedZ0Surface.js';

const intersectionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'solid': {
        const normalize = createNormalize3();
        const todo = [];
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            todo.push(solid);
          }
          for (const { surface, z0Surface } of getAnySurfaces(geometry)) {
            todo.push(fromSurfaceToSolid(surface || z0Surface, normalize));
          }
        }
        return taggedSolid(
          { tags },
          solidIntersection(geometry.solid, ...todo)
        );
      }
      case 'surface': {
        const normalize = createNormalize3();
        let thisSurface = geometry.surface;
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            thisSurface = intersectionOfSurfaceWithSolid(solid, [thisSurface], normalize)[0];
          }
          for (const { surface, z0Surface } of getAnySurfaces(geometry)) {
            thisSurface = intersectionOfSurfaceWithSolid(fromSurfaceToSolid(surface || z0Surface, normalize), [thisSurface], normalize)[0];
          }
        }
        return taggedSurface({ tags }, thisSurface);
      }
      case 'z0Surface': {
        const normalize = createNormalize3();
        let thisSurface = geometry.z0Surface;
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            thisSurface = intersectionOfSurfaceWithSolid(solid, [thisSurface], normalize)[0];
          }
          for (const { surface, z0Surface } of getAnySurfaces(geometry)) {
            thisSurface = intersectionOfSurfaceWithSolid(fromSurfaceToSolid(surface || z0Surface, normalize), [thisSurface], normalize)[0];
          }
        }
        return taggedZ0Surface({ tags }, thisSurface);
      }
      case 'paths': {
        // FIX: Handle intersection of paths and surfaces/solids.
        const todo = [];
        for (const geometry of geometries) {
          for (const { paths } of getPaths(geometry)) {
            todo.push(paths);
          }
        }
        return taggedPaths(
          { tags },
          pathsIntersection(geometry.paths, ...todo)
        );
      }
      case 'points': {
        // Not implemented yet.
        return geometry;
      }
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for intersection.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(geometry, op);
};

export const intersection = cache(intersectionImpl);
