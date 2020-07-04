import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths.js';
import { getPoints } from './getPoints.js';
import { getSolids } from './getSolids.js';
import { getSurfaces } from './getSurfaces.js';
import { getZ0Surfaces } from './getZ0Surfaces.js';
import { union as pathsUnion } from '@jsxcad/geometry-paths';
import { union as pointsUnion } from '@jsxcad/geometry-points';
import { rewrite } from './visit.js';
import { union as solidUnion } from '@jsxcad/geometry-solid-boolean';
import { union as surfaceUnion } from '@jsxcad/geometry-surface-boolean';
import { taggedPaths } from './taggedPaths.js';
import { taggedPoints } from './taggedPoints.js';
import { taggedSolid } from './taggedSolid.js';
import { taggedSurface } from './taggedSurface.js';
import { taggedZ0Surface } from './taggedZ0Surface.js';
import { union as z0SurfaceUnion } from '@jsxcad/geometry-z0surface-boolean';

// Union is a little more complex, since it can make violate disjointAssembly invariants.

const unionImpl = (geometry, ...geometries) => {
  // Extract the compositional geometries to add.
  const pathsets = [];
  const solids = [];
  const surfaces = [];
  const z0Surfaces = [];
  const pointsets = [];
  for (const geometry of geometries) {
    for (const { surface } of getSurfaces(geometry)) {
      surfaces.push(surface);
    }
    for (const { z0Surface } of getZ0Surfaces(geometry)) {
      z0Surfaces.push(z0Surface);
    }
    for (const { solid } of getSolids(geometry)) {
      solids.push(solid);
    }
    for (const { paths } of getPaths(geometry)) {
      pathsets.push(paths);
    }
    for (const { points } of getPoints(geometry)) {
      pointsets.push(points);
    }
  }

  // For assemblies and layers we effectively compose with each element.
  // This renders disjointAssemblies into assemblies.
  // TODO: Preserve disjointAssemblies by only composing with the last compatible item.

  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'solid': {
        const { solid, tags } = geometry;
        return taggedSolid({ tags }, solidUnion(solid, ...solids));
      }
      case 'surface': {
        const { surface, tags } = geometry;
        return taggedSurface({ tags }, surfaceUnion(surface, ...surfaces, ...z0Surfaces));
      }
      case 'z0Surface': {
        const { z0Surface, tags } = geometry;
        if (surfaces.length === 0) {
          return taggedZ0Surface({ tags }, z0SurfaceUnion(z0Surface, ...z0Surfaces));
        } else {
          return taggedSurface({ tags }, surfaceUnion(z0Surface, ...surfaces, ...z0Surfaces));
        }
      }
      case 'paths': {
        const { paths, tags } = geometry;
        return taggedPaths({ tags }, pathsUnion(paths, ...pathsets));
      }
      case 'points': {
        const { points, tags } = geometry;
        return taggedPoints({ tags }, pointsUnion(points, ...pointsets));
      }
      case 'sketch': {
        // Sketches aren't real for union.
        return geometry;
      }
      case 'assembly':
      case 'disjointAssembly':
      case 'layers': {
        return descend();
      }
      default: {
        throw Error(`Unexpected geometry: ${JSON.stringify(geometry)}`);
      }
    }
  };

  return rewrite(geometry, op);
};

export const union = cache(unionImpl);
