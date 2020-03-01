import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { difference as pathsDifference } from '@jsxcad/geometry-paths';
import { rewrite } from './visit';
import { difference as solidDifference } from '@jsxcad/geometry-solid-boolean';
import { difference as surfaceDifference } from '@jsxcad/geometry-surface-boolean';
import { difference as z0SurfaceDifference } from '@jsxcad/geometry-z0surface-boolean';

/*
const differenceImplOld = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: difference(baseGeometry.item, ...geometries) };
  }

  const result = { disjointAssembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry)).filter(isNegative).map(item => item.solid);
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.disjointAssembly.push({ solid: solidDifference(solid, ...solids), tags });
  }
  // Surfaces -- generalize to surface unless specializable upon z0surface.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).filter(isNegative).map(item => item.z0Surface));
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).filter(isNegative).map(item => item.surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    if (surfaces.length === 0) {
      result.disjointAssembly.push({ z0Surface: z0SurfaceDifference(z0Surface, ...z0Surfaces), tags });
    } else {
      result.disjointAssembly.push({ surface: surfaceDifference(z0Surface, ...z0Surfaces, ...surfaces), tags });
    }
  }
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.disjointAssembly.push({ surface: surfaceDifference(surface, ...surfaces, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry)).filter(isNegative).map(item => item.paths);
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.disjointAssembly.push({ paths: pathsDifference(paths, ...pathsets), tags });
  }
  // Plans are preserved over difference.
  for (const plan of getPlans(baseGeometry)) {
    result.disjointAssembly.push(plan);
  }
  for (const geometry of geometries) {
    for (const plan of getPlans(geometry)) {
      result.disjointAssembly.push(plan);
    }
  }
  // Connections
  for (const connection of getConnections(baseGeometry)) {
    result.disjointAssembly.push(connection);
  }
  // Items
  for (const item of getItems(baseGeometry)) {
    result.disjointAssembly.push(item);
  }
  // Points
  for (const points of getPoints(baseGeometry)) {
    // FIX: Actually subtract points.
    result.disjointAssembly.push(points);
  }
  return result;
};
*/

const differenceImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    if (geometry.solid) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { solid } of getSolids(geometry)) {
          todo.push(solid);
        }
      }
      return { solid: solidDifference(geometry.solid, ...todo), tags: geometry.tags };
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
      return { surface: surfaceDifference(geometry.surface, ...todo), tags: geometry.tags };
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
        return { surface: surfaceDifference(geometry.z0Surface, ...todoSurfaces, ...todoZ0Surfaces), tags: geometry.tags };
      } else {
        return { surface: z0SurfaceDifference(geometry.z0Surface, ...todoZ0Surfaces), tags: geometry.tags };
      }
    } else if (geometry.paths) {
      const todo = [];
      for (const geometry of geometries) {
        for (const { paths } of getPaths(geometry)) {
          todo.push(paths);
        }
      }
      return { paths: pathsDifference(geometry.paths, ...todo), tags: geometry.tags };
    } else {
      return descend();
    }
  };

  return rewrite(geometry, op);
};

export const difference = cache(differenceImpl);
