import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { union as pathsUnion } from '@jsxcad/geometry-paths';
import { rewrite } from './visit';
import { union as solidUnion } from '@jsxcad/geometry-solid-boolean';
import { union as surfaceUnion } from '@jsxcad/geometry-surface-boolean';
import { union as z0SurfaceUnion } from '@jsxcad/geometry-z0surface-boolean';

// Union is a little more complex, since it can make violate disjointAssembly invariants.

const unionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { solid } of getSolids(geometry)) {
          todo.push(solid);
        }
      }
      return { solid: solidUnion(geometry.solid, ...todo), tags: geometry.tags };
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
      return { surface: surfaceUnion(geometry.surface, ...todo), tags: geometry.tags };
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
        return { surface: surfaceUnion(geometry.z0Surface, ...todoSurfaces, ...todoZ0Surfaces), tags: geometry.tags };
      } else {
        return { surface: z0SurfaceUnion(geometry.z0Surface, ...todoZ0Surfaces), tags: geometry.tags };
      }
    } else if (geometry.paths) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { paths } of getPaths(geometry)) {
          todo.push(paths);
        }
      }
      return { paths: pathsUnion(geometry.paths, ...todo), tags: geometry.tags };
    } else if (geometry.assembly) {
      // Let's consider an assembly to have an implicit Empty() geometry at the end.
      // Then we can implement union over assembly by assemble.
      return { assembly: [...geometry.assembly, ...geometries], tags: geometry.tags };
    } else if (geometry.disjointAssembly) {
      // Likewise for disjointAssembly, but it needs to revert to an assembly, since it is no-longer disjoint.
      return { assembly: [...geometry.disjointAssembly, ...geometries], tags: geometry.tags };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

export const union = cache(unionImpl);
