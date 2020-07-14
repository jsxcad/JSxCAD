import {
  fromSolid as fromSolidToBsp,
  removeExteriorPolygonsForSection,
  unifyBspTrees,
} from '@jsxcad/geometry-bsp';
import {
  toPlane as fromSurfaceToPlane,
  makeWatertight as makeWatertightSurface,
} from '@jsxcad/geometry-surface';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { toPolygon as fromPlaneToPolygon } from '@jsxcad/math-plane';
import { fromSurface as fromSurfaceToSolid } from '@jsxcad/geometry-solid';
import { getAnyNonVoidSurfaces } from './getAnyNonVoidSurfaces.js';
import { getNonVoidPaths } from './getNonVoidPaths.js';
import { getNonVoidPoints } from './getNonVoidPoints.js';
import { getNonVoidSolids } from './getNonVoidSolids.js';
import { union as pathsUnion } from '@jsxcad/geometry-paths';
import { union as pointsUnion } from '@jsxcad/geometry-points';
import { rewrite } from './visit.js';
import { union as solidUnion } from '@jsxcad/geometry-solid-boolean';
import { taggedPaths } from './taggedPaths.js';
import { taggedPoints } from './taggedPoints.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';
import { taggedZ0Surface } from './taggedZ0Surface.js';

// Union is a little more complex, since it can violate disjointAssembly invariants.
const unionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'solid': {
        const todo = [];
        for (const geometry of geometries) {
          for (const { solid } of getNonVoidSolids(geometry)) {
            todo.push(solid);
          }
        }
        // No meaningful way to unify with a surface.
        return taggedSolid({ tags }, solidUnion(geometry.solid, ...todo));
      }
      case 'surface': {
        // FIX: This has a problem with trying to union with an empty surface.
        const normalize = createNormalize3();
        let planarPolygon = fromPlaneToPolygon(
          fromSurfaceToPlane(geometry.surface)
        );
        let bsp = fromSolidToBsp(
          fromSurfaceToSolid(geometry.surface, normalize),
          normalize
        );
        for (const geometry of geometries) {
          for (const { solid } of getNonVoidSolids(geometry)) {
            bsp = unifyBspTrees(fromSolidToBsp(solid, normalize), bsp);
          }
          for (const { surface, z0Surface } of getAnyNonVoidSurfaces(
            geometry
          )) {
            bsp = unifyBspTrees(
              fromSolidToBsp(
                fromSurfaceToSolid(surface || z0Surface, normalize),
                normalize
              ),
              bsp
            );
          }
        }
        const clippedSurface = removeExteriorPolygonsForSection(
          bsp,
          [planarPolygon],
          normalize
        );
        return taggedSurface({ tags }, makeWatertightSurface(clippedSurface));
      }
      case 'z0Surface': {
        // FIX: This has a problem with trying to union with an empty surface.
        const normalize = createNormalize3();
        let planarPolygon = fromPlaneToPolygon([0, 0, 1, 0]);
        let bsp = fromSolidToBsp(
          fromSurfaceToSolid(geometry.z0Surface, normalize),
          normalize
        );
        for (const geometry of geometries) {
          for (const { solid } of getNonVoidSolids(geometry)) {
            bsp = unifyBspTrees(fromSolidToBsp(solid, normalize), bsp);
          }
          for (const { surface, z0Surface } of getAnyNonVoidSurfaces(
            geometry
          )) {
            bsp = unifyBspTrees(
              fromSolidToBsp(
                fromSurfaceToSolid(surface || z0Surface, normalize),
                normalize
              ),
              bsp
            );
          }
        }
        const clippedSurface = removeExteriorPolygonsForSection(
          bsp,
          [planarPolygon],
          normalize
        );
        return taggedZ0Surface({ tags }, makeWatertightSurface(clippedSurface));
      }
      case 'paths': {
        const { paths, tags } = geometry;
        const pathsets = [];
        for (const { paths } of getNonVoidPaths(geometry)) {
          pathsets.push(paths);
        }
        return taggedPaths({ tags }, pathsUnion(paths, ...pathsets));
      }
      case 'points': {
        const { points, tags } = geometry;
        const pointsets = [];
        for (const { points } of getNonVoidPoints(geometry)) {
          pointsets.push(points);
        }
        return taggedPoints({ tags }, pointsUnion(points, ...pointsets));
      }
      case 'plan':
      case 'assembly':
      case 'item':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      case 'sketch': {
        // Sketches aren't real for union.
        return geometry;
      }
      default:
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
    }
  };

  return rewrite(geometry, op);
};

export const union = cache(unionImpl);
