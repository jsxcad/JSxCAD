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
  // Extract the compositional geometries to add.
  const pathsets = [];
  const solids = [];
  const surfaces = [];
  const z0Surfaces = [];
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
  }

  // For assemblies and layers we effectively compose with each element.
  // This renders disjointAssemblies into assemblies.
  // TODO: Preserve disjointAssemblies by only composing with the last compatible item.

  const op = (geometry, descend) => {
    switch (geometry.type) {
      case 'solid': {
        const { solid, tags } = geometry;
        return { type: 'solid', solid: solidUnion(solid, ...solids), tags };
      }
      case 'surface': {
        const { surface, tags } = geometry;
        return {
          type: 'surface',
          surface: surfaceUnion(surface, ...surfaces, ...z0Surfaces),
          tags,
        };
      }
      case 'z0Surface': {
        const { z0Surface, tags } = geometry;
        if (surfaces.length === 0) {
          return {
            type: 'z0Surface',
            z0Surface: z0SurfaceUnion(z0Surface, ...z0Surfaces),
            tags,
          };
        } else {
          return {
            type: 'surface',
            surface: surfaceUnion(z0Surface, ...surfaces, ...z0Surfaces),
            tags,
          };
        }
      }
      case 'paths': {
        const { paths, tags } = geometry;
        return { type: 'paths', paths: pathsUnion(paths, ...pathsets), tags };
      }
      case 'assembly': {
        const { content, tags } = geometry;
        return {
          type: 'assembly',
          content: content.map((entry) => rewrite(entry, op)),
          tags,
        };
      }
      case 'disjointAssembly': {
        const { content, tags } = geometry;
        return {
          type: 'disjointAssembly',
          content: content.map((entry) => rewrite(entry, op)),
          tags,
        };
      }
      case 'layers': {
        const { layers, tags } = geometry;
        return {
          type: 'layers',
          layers: layers.map((entry) => rewrite(entry, op)),
          tags,
        };
      }
      default:
        return descend();
    }
  };

  return rewrite(geometry, op);
};

export const union = cache(unionImpl);
