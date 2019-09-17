import { cache } from '@jsxcad/cache';
import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { union as pathsUnion } from '@jsxcad/geometry-paths';
import { union as solidUnion } from '@jsxcad/geometry-solid-boolean';
import { union as surfaceUnion } from '@jsxcad/geometry-surface-boolean';
import { union as z0SurfaceUnion } from '@jsxcad/geometry-z0surface-boolean';

const unionImpl = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: union(baseGeometry.item, ...geometries) };
  }

  const result = { assembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry).map(item => item.solid));
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.assembly.push({ solid: solidUnion(solid, ...solids), tags });
  }
  // Surfaces -- generalize to surface unless specializable upon z0surface.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).map(item => item.z0Surface));
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).map(item => item.surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    if (surfaces.length === 0) {
      result.assembly.push({ z0Surface: z0SurfaceUnion(z0Surface, ...z0Surfaces), tags });
    } else {
      result.assembly.push({ surface: surfaceUnion(z0Surface, ...z0Surfaces, ...surfaces), tags });
    }
  }
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.assembly.push({ surface: surfaceUnion(surface, ...surfaces, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry).map(item => item.paths));
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.assembly.push({ paths: pathsUnion(paths, ...pathsets), tags });
  }
  // FIX: Surfaces, Paths, etc.
  return result;
};

export const union = cache(unionImpl);
