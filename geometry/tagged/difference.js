import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths.js';
import { getSolids } from './getSolids.js';
import { getSurfaces } from './getSurfaces.js';
import { getZ0Surfaces } from './getZ0Surfaces.js';
import { difference as pathsDifference } from '@jsxcad/geometry-paths';
import { rewrite } from './visit.js';
import { difference as solidDifference } from '@jsxcad/geometry-solid-boolean';
import { difference as surfaceDifference } from '@jsxcad/geometry-surface-boolean';
import { difference as z0SurfaceDifference } from '@jsxcad/geometry-z0surface-boolean';

const differenceImpl = (geometry, ...geometries) => {
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
          solid: solidDifference(geometry.solid, ...todo),
          tags: geometry.tags,
        };
      }
      case 'surface': {
        // FIX: Solids should cut surfaces
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
          surface: surfaceDifference(geometry.surface, ...todo),
          tags: geometry.tags,
        };
      }
      case 'z0Surface': {
        // FIX: Solids should cut surfaces
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
            surface: surfaceDifference(
              geometry.z0Surface,
              ...todoSurfaces,
              ...todoZ0Surfaces
            ),
            tags: geometry.tags,
          };
        } else {
          return {
            type: 'z0Surface',
            z0Surface: z0SurfaceDifference(
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
          paths: pathsDifference(geometry.paths, ...todo),
          tags: geometry.tags,
        };
      }
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'plan':
      case 'item':
      case 'layout':
      case 'points':
        return descend();
    }
    throw Error(`Unknown geometry type ${JSON.stringify(geometry)}`);
  };

  return rewrite(geometry, op);
};

export const difference = cache(differenceImpl);
