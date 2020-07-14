import {
  fromSolid as fromSolidToBsp,
  section as intersectionOfSurfaceWithSolid,
  removeExteriorPaths,
} from '@jsxcad/geometry-bsp';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSurface as fromSurfaceToSolid } from '@jsxcad/geometry-solid';
import { getAnyNonVoidSurfaces } from './getAnyNonVoidSurfaces.js';
import { getNonVoidSolids } from './getNonVoidSolids.js';

import { makeWatertight as makeWatertightSurface } from '@jsxcad/geometry-surface';
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
          for (const { solid } of getNonVoidSolids(geometry)) {
            todo.push(solid);
          }
          for (const { surface, z0Surface } of getAnyNonVoidSurfaces(
            geometry
          )) {
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
          for (const { solid } of getNonVoidSolids(geometry)) {
            thisSurface = intersectionOfSurfaceWithSolid(
              solid,
              [thisSurface],
              normalize
            )[0];
          }
          for (const { surface, z0Surface } of getAnyNonVoidSurfaces(
            geometry
          )) {
            thisSurface = intersectionOfSurfaceWithSolid(
              fromSurfaceToSolid(surface || z0Surface, normalize),
              [thisSurface],
              normalize
            )[0];
          }
        }
        return taggedSurface({ tags }, makeWatertightSurface(thisSurface));
      }
      case 'z0Surface': {
        const normalize = createNormalize3();
        let thisSurface = geometry.z0Surface;
        for (const geometry of geometries) {
          for (const { solid } of getNonVoidSolids(geometry)) {
            thisSurface = intersectionOfSurfaceWithSolid(
              solid,
              [thisSurface],
              normalize
            )[0];
          }
          for (const { surface, z0Surface } of getAnyNonVoidSurfaces(
            geometry
          )) {
            thisSurface = intersectionOfSurfaceWithSolid(
              fromSurfaceToSolid(surface || z0Surface, normalize),
              [thisSurface],
              normalize
            )[0];
          }
        }
        return taggedZ0Surface({ tags }, makeWatertightSurface(thisSurface));
      }
      case 'paths': {
        const normalize = createNormalize3();
        let thisPaths = geometry.paths;
        for (const geometry of geometries) {
          for (const { solid } of getNonVoidSolids(geometry)) {
            const clippedPaths = [];
            removeExteriorPaths(
              fromSolidToBsp(solid, normalize),
              thisPaths,
              normalize,
              (paths) => clippedPaths.push(...paths)
            );
            thisPaths = clippedPaths;
          }
        }
        return taggedPaths({ tags }, thisPaths);
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
