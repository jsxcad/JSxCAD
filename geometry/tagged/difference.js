import {
  differenceSurface,
  fromSolid as fromSolidToBsp,
  fromSurface as fromSurfaceToBsp,
} from '@jsxcad/geometry-bsp';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSurface as fromSurfaceToSolid } from '@jsxcad/geometry-solid';
import { getAnySurfaces } from './getAnySurfaces.js';
import { getPaths } from './getPaths.js';
import { getSolids } from './getSolids.js';
import { makeWatertight as makeWatertightSurface } from '@jsxcad/geometry-surface';
import { difference as pathsDifference } from '@jsxcad/geometry-paths';
import { rewrite } from './visit.js';
import { difference as solidDifference } from '@jsxcad/geometry-solid-boolean';
import { taggedPaths } from './taggedPaths.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';

const differenceImpl = (geometry, ...geometries) => {
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
        return taggedSolid({ tags }, solidDifference(geometry.solid, ...todo));
      }
      case 'z0Surface':
      case 'surface': {
        const normalize = createNormalize3();
        let thisSurface = geometry.surface || geometry.z0Surface;
        for (const geometry of geometries) {
          for (const { solid } of getSolids(geometry)) {
            const differencedSurface = [];
            differenceSurface(
              fromSolidToBsp(solid, normalize),
              thisSurface,
              normalize,
              (surface) => differencedSurface.push(...surface)
            );
            thisSurface = differencedSurface;
          }
          for (const { surface, z0Surface } of getAnySurfaces(geometry)) {
            const differencedSurface = [];
            differenceSurface(
              fromSurfaceToBsp(surface || z0Surface, normalize),
              thisSurface,
              normalize,
              (surface) => differencedSurface.push(...surface)
            );
            thisSurface = differencedSurface;
          }
        }
        return taggedSurface({ tags }, makeWatertightSurface(thisSurface));
      }
      case 'paths': {
        const todo = [];
        for (const geometry of geometries) {
          for (const { paths } of getPaths(geometry)) {
            todo.push(paths);
          }
        }
        return taggedPaths({ tags }, pathsDifference(geometry.paths, ...todo));
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

/*
const differenceImpl = (geometry, ...geometries) => {
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
        return taggedSolid({ tags }, solidDifference(geometry.solid, ...todo));
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
        return taggedSurface(
          { tags },
          surfaceDifference(geometry.surface, ...todo)
        );
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
          return taggedSurface(
            { tags },
            surfaceDifference(
              geometry.z0Surface,
              ...todoSurfaces,
              ...todoZ0Surfaces
            )
          );
        } else {
          return taggedZ0Surface(
            { tags },
            z0SurfaceDifference(geometry.z0Surface, ...todoZ0Surfaces)
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
        return taggedPaths({ tags }, pathsDifference(geometry.paths, ...todo));
      }
      case 'assembly':
      case 'disjointAssembly':
      case 'layers':
      case 'plan':
      case 'item':
      case 'layout':
      case 'points': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for difference.
        return geometry;
      }
      default: {
        throw Error(`Unknown geometry type ${JSON.stringify(geometry)}`);
      }
    }
  };

  return rewrite(geometry, op);
};
*/

export const difference = cache(differenceImpl);
