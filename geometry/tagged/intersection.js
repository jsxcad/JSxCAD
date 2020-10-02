import {
  fromSolid as fromSolidToBspTree,
  intersectSurface,
  removeExteriorPaths,
  intersection as solidIntersection,
} from '@jsxcad/geometry-bsp';

import {
  fromSolid as fromSolidToGraph,
  intersection as graphIntersection,
} from '@jsxcad/geometry-graph';

import { cache } from '@jsxcad/cache';
import { createNormalize3 } from '@jsxcad/algorithm-quantize';
import { fromSurface as fromSurfaceToSolid } from '@jsxcad/geometry-solid';
import { getAnyNonVoidSurfaces } from './getAnyNonVoidSurfaces.js';
import { getNonVoidGraphs } from './getNonVoidGraphs.js';
import { getNonVoidSolids } from './getNonVoidSolids.js';
import { makeWatertight as makeWatertightSurface } from '@jsxcad/geometry-surface';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedGroup } from './taggedGroup.js';
import { taggedPaths } from './taggedPaths.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';
import { toBspTree } from './toBspTree.js';

const intersectionImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let intersected = geometry.graph;
        for (const geometry of geometries) {
          for (const { graph } of getNonVoidGraphs(geometry)) {
            intersected = graphIntersection(intersected, graph);
          }
          for (const { solid } of getNonVoidSolids(geometry)) {
            intersected = graphIntersection(
              intersected,
              fromSolidToGraph(solid)
            );
          }
        }
        return taggedGraph({ tags }, intersected);
      }
      case 'solid': {
        const normalize = createNormalize3();
        const otherGeometry = geometries[0];
        const solids = [
          ...getNonVoidSolids(otherGeometry).map(({ solid }) => solid),
          ...getAnyNonVoidSurfaces(
            otherGeometry
          ).map(({ surface, z0Surface }) =>
            fromSurfaceToSolid(surface || z0Surface, normalize)
          ),
        ];
        const intersections = solids
          .map((solid) => solidIntersection(geometry.solid, solid))
          .filter((solid) => solid.length > 0)
          .map((solid) => taggedSolid({ tags }, solid));
        if (intersections.length === 1) {
          return intersections[0];
        } else if (geometries.length === 1) {
          return taggedGroup({}, ...intersections);
        } else {
          return intersection(
            taggedGroup({}, ...intersections),
            ...geometries.slice(1)
          );
        }
      }
      case 'z0Surface':
      case 'surface': {
        const normalize = createNormalize3();
        const thisSurface = geometry.surface || geometry.z0Surface;
        const otherGeometry = geometries[0];
        const solids = [
          ...getNonVoidSolids(otherGeometry).map(({ solid }) => solid),
          ...getAnyNonVoidSurfaces(
            otherGeometry
          ).map(({ surface, z0Surface }) =>
            fromSurfaceToSolid(surface || z0Surface, normalize)
          ),
        ];
        const intersections = solids
          .map((solid) => {
            const intersectedSurface = [];
            intersectSurface(
              fromSolidToBspTree(solid, normalize),
              thisSurface,
              normalize,
              (surface) => intersectedSurface.push(...surface)
            );
            return intersectedSurface;
          })
          .filter((surface) => surface.length > 0)
          .map((surface) =>
            taggedSurface({ tags }, makeWatertightSurface(surface))
          );
        if (intersections.length === 1) {
          return intersections[0];
        } else if (geometries.length === 1) {
          return taggedGroup({}, ...intersections);
        } else {
          return intersection(
            taggedGroup({}, ...intersections),
            ...geometries.slice(1)
          );
        }
      }
      case 'paths': {
        const normalize = createNormalize3();
        let thisPaths = geometry.paths;
        for (const geometry of geometries) {
          const bsp = toBspTree(geometry, normalize);
          const clippedPaths = [];
          removeExteriorPaths(bsp, thisPaths, normalize, (paths) =>
            clippedPaths.push(...paths)
          );
          thisPaths = clippedPaths;
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
