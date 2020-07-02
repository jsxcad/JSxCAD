import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths.js';
import { getSolids } from './getSolids.js';
import { getSurfaces } from './getSurfaces.js';
import { getZ0Surfaces } from './getZ0Surfaces.js';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { rewrite } from './visit.js';
import { intersection as solidIntersection } from '@jsxcad/geometry-solid-boolean';
import { intersection as surfaceIntersection } from '@jsxcad/geometry-surface-boolean';
import { intersection as z0SurfaceIntersection } from '@jsxcad/geometry-z0surface-boolean';

const intersectionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'solid': {
        const todo = [];
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            todo.push(solid);
          }
        }
        return {
          type: 'solid',
          solid: solidIntersection(geometry.solid, ...todo),
          tags: geometry.tags,
        };
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
        return {
          type: 'surface',
          surface: surfaceIntersection(geometry.surface, ...todo),
          tags: geometry.tags,
        };
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
          return {
            type: 'surface',
            surface: surfaceIntersection(
              geometry.z0Surface,
              ...todoSurfaces,
              ...todoZ0Surfaces
            ),
            tags: geometry.tags,
          };
        } else {
          return {
            type: 'surface',
            surface: z0SurfaceIntersection(
              geometry.z0Surface,
              ...todoZ0Surfaces
            ),
            tags: geometry.tags,
          };
        }
      }
      case 'paths': {
        const todo = [];
        for (const geometry of geometries) {
          for (const { paths } of getPaths(geometry)) {
            todo.push(paths);
          }
        }
        return {
          type: 'paths',
          paths: pathsIntersection(geometry.paths, ...todo),
          tags: geometry.tags,
        };
      }
      default:
        return descend();
    }
  };

  return rewrite(geometry, op);
};

export const intersection = cache(intersectionImpl);
