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

const unifySolids = (geometry, ...geometries) => {
  const todo = [];
  for (const geometry of geometries) {
    for (const { solid } of getSolids(geometry)) {
      todo.push(solid);
    }
  }
  return { solid: solidUnion(geometry.solid, ...todo), tags: geometry.tags };
};

const unifySurfaces = (geometry, ...geometries) => {
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
};

const unifyZ0Surfaces = (geometry, ...geometries) => {
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
};

const unifyPaths = (geometry, ...geometries) => {
  const todo = [];
  for (const geometry of geometries) {
    for (const { paths } of getPaths(geometry)) {
      todo.push(paths);
    }
  }
  return { paths: pathsUnion(geometry.paths, ...todo), tags: geometry.tags };
};

const unionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      return unifySolids(geometry, ...geometries);
    } else if (geometry.surface) {
      return unifySurfaces(geometry, ...geometries);
    } else if (geometry.z0Surface) {
      return unifyZ0Surfaces(geometry, ...geometries);
    } else if (geometry.paths) {
      return unifyPaths(geometry, ...geometries);
    } else if (geometry.assembly || geometry.disjointAssembly) {
      const payload = geometry.assembly || geometry.disjointAssembly;
      // We consider assemblies to have an implicit Empty() at the end.
      return {
        assembly: [
          ...payload,
          unifySolids({ solid: [] }, ...geometries),
          unifySurfaces({ surface: [] }, ...geometries),
          unifyPaths({ paths: [] }, ...geometries)
        ],
        tags: geometry.tags
      };
    } else if (geometry.layers) {
      // We consider layers to have an implicit Empty() at the end.
      return {
        layers: [
          ...geometry.layers,
          unifySolids({ solid: [] }, ...geometries),
          unifySurfaces({ surface: [] }, ...geometries),
          unifyPaths({ paths: [] }, ...geometries)
        ],
        tags: geometry.tags
      };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

export const union = cache(unionImpl);
