import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths.js';
import { getSolids } from './getSolids.js';
import { getSurfaces } from './getSurfaces.js';
import { getZ0Surfaces } from './getZ0Surfaces.js';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { rewrite } from './visit.js';
import { intersection as solidIntersection } from '@jsxcad/geometry-solid-boolean';
import { intersection as surfaceIntersection } from '@jsxcad/geometry-surface-boolean';
import { taggedPaths } from './taggedPaths.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';
import { taggedZ0Surface } from './taggedZ0Surface.js';
import { intersection as z0SurfaceIntersection } from '@jsxcad/geometry-z0surface-boolean';

const intersectionImpl = (geometry, ...geometries) => {
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
        return taggedSolid(
          { tags },
          solidIntersection(geometry.solid, ...todo)
        );
      }
      case 'surface': {
        const todo = [];
        for (const geometry of geometries) {
          for (const { surface } of getSurfaces(geometry)) {
            todo.push(surface);
          }
          for (const { z0Surface } of getZ0Surfaces(geometry)) {
            todo.push(z0Surface);
          }
        }
        return taggedSurface(
          { tags },
          surfaceIntersection(geometry.surface, ...todo)
        );
      }
      case 'z0Surface': {
        const todoSurfaces = [];
        const todoZ0Surfaces = [];
        for (const geometry of geometries) {
          for (const { surface } of getSurfaces(geometry)) {
            todoSurfaces.push(surface);
          }
          for (const { z0Surface } of getZ0Surfaces(geometry)) {
            todoZ0Surfaces.push(z0Surface);
          }
        }
        if (todoSurfaces.length > 0) {
          return taggedSurface(
            { tags },
            surfaceIntersection(
              geometry.z0Surface,
              ...todoSurfaces,
              ...todoZ0Surfaces
            )
          );
        } else {
          return taggedZ0Surface(
            { tags },
            z0SurfaceIntersection(geometry.z0Surface, ...todoZ0Surfaces)
          );
        }
      }
      case 'paths': {
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
