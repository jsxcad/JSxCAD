import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { rewrite } from './visit';
import { intersection as solidIntersection } from '@jsxcad/geometry-solid-boolean';
import { intersection as surfaceIntersection } from '@jsxcad/geometry-surface-boolean';
import { intersection as z0SurfaceIntersection } from '@jsxcad/geometry-z0surface-boolean';

const intersectionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { solid } of getSolids(geometry)) {
          todo.push(solid);
        }
      }
      return {
        solid: solidIntersection(geometry.solid, ...todo),
        tags: geometry.tags,
      };
    } else if (geometry.surface) {
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
        surface: surfaceIntersection(geometry.surface, ...todo),
        tags: geometry.tags,
      };
    } else if (geometry.z0Surface) {
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
          surface: surfaceIntersection(
            geometry.z0Surface,
            ...todoSurfaces,
            ...todoZ0Surfaces
          ),
          tags: geometry.tags,
        };
      } else {
        return {
          surface: z0SurfaceIntersection(geometry.z0Surface, ...todoZ0Surfaces),
          tags: geometry.tags,
        };
      }
    } else if (geometry.paths) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { paths } of getPaths(geometry)) {
          todo.push(paths);
        }
      }
      return {
        paths: pathsIntersection(geometry.paths, ...todo),
        tags: geometry.tags,
      };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

export const intersection = cache(intersectionImpl);
