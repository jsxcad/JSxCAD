import { cache } from '@jsxcad/cache';
import { getItems } from './getItems';
import { getPaths } from './getPaths';
import { getPlans } from './getPlans';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { isNegative } from './nonNegative';
import { difference as pathsDifference } from '@jsxcad/geometry-paths';
import { difference as solidDifference } from '@jsxcad/geometry-solid-boolean';
import { difference as surfaceDifference } from '@jsxcad/geometry-surface-boolean';
import { difference as z0SurfaceDifference } from '@jsxcad/geometry-z0surface-boolean';

// PROVE: Is the non-negative behavior here correct for difference in general, or only difference when makeing disjoint?

const differenceImpl = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: difference(baseGeometry.item, ...geometries) };
  }

  const result = { disjointAssembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry)).filter(isNegative).map(item => item.solid);
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.disjointAssembly.push({ solid: solidDifference(solid, ...solids), tags });
  }
  // Surfaces -- generalize to surface unless specializable upon z0surface.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).filter(isNegative).map(item => item.z0Surface));
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).filter(isNegative).map(item => item.surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    if (surfaces.length === 0) {
      result.disjointAssembly.push({ z0Surface: z0SurfaceDifference(z0Surface, ...z0Surfaces), tags });
    } else {
      result.disjointAssembly.push({ surface: surfaceDifference(z0Surface, ...z0Surfaces, ...surfaces), tags });
    }
  }
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.disjointAssembly.push({ surface: surfaceDifference(surface, ...surfaces, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry)).filter(isNegative).map(item => item.paths);
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.disjointAssembly.push({ paths: pathsDifference(paths, ...pathsets), tags });
  }
  // Plans
  for (const plan of getPlans(baseGeometry)) {
    result.disjointAssembly.push(plan);
  }
  // Items
  for (const item of getItems(baseGeometry)) {
    result.disjointAssembly.push(item);
  }
  // FIX: Surfaces, Paths, etc.
  return result;
};

export const difference = cache(differenceImpl);
