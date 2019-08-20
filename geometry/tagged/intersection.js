import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { intersection as solidIntersection } from '@jsxcad/geometry-solid';
import { intersection as surfaceIntersection } from '@jsxcad/geometry-surface';
import { intersection as z0SurfaceIntersection } from '@jsxcad/geometry-z0surface';

export const intersection = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: intersection(baseGeometry.item, ...geometries) };
  }

  const result = { assembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry).map(item => item.solid));
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.assembly.push({ solid: solidIntersection(solid, ...solids), tags });
  }
  // Surfaces.
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).map(item => item.surface));
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.assembly.push({ surface: surfaceIntersection(surface, ...surfaces), tags });
  }
  // Z0Surfaces.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).map(item => item.z0Surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    result.assembly.push({ z0Surface: z0SurfaceIntersection(z0Surface, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry).map(item => item.paths));
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.assembly.push({ paths: pathsIntersection(paths, ...pathsets), tags });
  }
  // FIX: Surfaces, Paths, etc.
  return result;
};
