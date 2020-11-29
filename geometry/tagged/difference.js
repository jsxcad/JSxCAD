import {
  fromSolid as fromSolidToGraph,
  fromSurface as fromSurfaceToGraph,
  difference as graphDifference,
  toSolid as toSolidFromGraph,
  toSurface as toSurfaceFromGraph,
} from '@jsxcad/geometry-graph';

import { cache } from '@jsxcad/cache';
import { getGraphs } from './getGraphs.js';
import { getSolids } from './getSolids.js';
import { getSurfaces } from './getSurfaces.js';
import { rewrite } from './visit.js';
import { taggedGraph } from './taggedGraph.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';

const differenceImpl = (geometry, ...geometries) => {
  const op = (geometry, descend) => {
    const { tags } = geometry;
    switch (geometry.type) {
      case 'graph': {
        let differenced = geometry.graph;
        for (const geometry of geometries) {
          for (const { graph } of getGraphs(geometry)) {
            differenced = graphDifference(differenced, graph);
          }
          for (const { solid } of getSolids(geometry)) {
            differenced = graphDifference(differenced, fromSolidToGraph(solid));
          }
          for (const { surface } of getSurfaces(geometry)) {
            differenced = graphDifference(
              differenced,
              fromSurfaceToGraph(surface)
            );
          }
        }
        return taggedGraph({ tags }, differenced);
      }
      case 'solid':
        return taggedSolid(
          { tags },
          toSolidFromGraph(
            difference(
              taggedGraph({ tags }, fromSolidToGraph(geometry.solid)),
              ...geometries
            ).graph
          )
        );
      case 'surface':
        return taggedSurface(
          { tags },
          toSurfaceFromGraph(
            difference(
              taggedGraph({ tags }, fromSurfaceToGraph(geometry.surface)),
              ...geometries
            ).graph
          )
        );
      case 'paths':
      case 'points': {
        // Not implemented yet.
        return geometry;
      }
      case 'layout':
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
