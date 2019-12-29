import { cache } from '@jsxcad/cache';
import { getConnections } from './getConnections';
import { getItems } from './getItems';
import { getPaths } from './getPaths';
import { getPlans } from './getPlans';
import { getPoints } from './getPoints';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { isNegative } from './nonNegative';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { intersection as solidIntersection } from '@jsxcad/geometry-solid-boolean';
import { intersection as surfaceIntersection } from '@jsxcad/geometry-surface-boolean';
import { intersection as z0SurfaceIntersection } from '@jsxcad/geometry-z0surface-boolean';

const intersectionImpl = (baseGeometry, ...geometries) => {
  if (baseGeometry.item) {
    return { ...baseGeometry, item: intersection(baseGeometry.item, ...geometries) };
  }

  const result = { disjointAssembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry).map(item => item.solid));
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.disjointAssembly.push({ solid: solidIntersection(solid, ...solids), tags });
  }
  // Surfaces -- generalize to surface unless specializable upon z0surface.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).map(item => item.z0Surface));
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).map(item => item.surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    if (surfaces.length === 0) {
      result.disjointAssembly.push({ z0Surface: z0SurfaceIntersection(z0Surface, ...z0Surfaces), tags });
    } else {
      result.disjointAssembly.push({ surface: surfaceIntersection(z0Surface, ...z0Surfaces, ...surfaces), tags });
    }
  }
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.disjointAssembly.push({ surface: surfaceIntersection(surface, ...surfaces, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry)).filter(isNegative).map(item => item.paths);
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.disjointAssembly.push({ paths: pathsIntersection(paths, ...pathsets), tags });
  }
  // Plans are preserved across intersection.
  for (const plan of getPlans(baseGeometry)) {
    result.disjointAssembly.push(plan);
  }
  for (const geometry of geometries) {
    for (const plan of getPlans(geometry)) {
      result.disjointAssembly.push(plan);
    }
  }
  // Connections
  for (const connection of getConnections(baseGeometry)) {
    result.disjointAssembly.push(connection);
  }
  // Items
  for (const item of getItems(baseGeometry)) {
    result.disjointAssembly.push(item);
  }
  // Points
  for (const points of getPoints(baseGeometry)) {
    // FIX: Actually subtract points.
    result.disjointAssembly.push(points);
  }
  // FIX: Surfaces, Paths, etc.
  return result;
};

export const intersection = cache(intersectionImpl);
