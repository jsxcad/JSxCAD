import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { difference as pathsDifference } from '@jsxcad/geometry-paths';
import { difference as solidDifference } from '@jsxcad/algorithm-bsp-surfaces';
import { difference as surfaceDifference } from '@jsxcad/geometry-surface';
import { difference as z0SurfaceDifference } from '@jsxcad/geometry-z0surface';

export const difference = (baseGeometry, ...geometries) => {
  const result = { assembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry).map(item => item.solid));
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.assembly.push({ solid: solidDifference(solid, ...solids), tags });
  }
  // Surfaces.
  // FIX: Needs co-planar grouping.
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).map(item => item.surface));
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.assembly.push({ surface: surfaceDifference(surface, ...surfaces), tags });
  }
  // Z0Surfaces.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).map(item => item.z0Surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    result.assembly.push({ z0Surface: z0SurfaceDifference(z0Surface, ...z0Surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry).map(item => item.paths));
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.assembly.push({ paths: pathsDifference(paths, ...pathsets), tags });
  }
  // FIX: Surfaces, Paths, etc.
  return result;
}

/*
export const difference = (geometry, ...subtractGeometries) => {
  if (subtractGeometries.length === 0) {
    // Nothing to do.
    return geometry;
  } else {
    return map(geometry,
               (item) => {
                 for (const subtractGeometry of subtractGeometries) {
                   eachItem(subtractGeometry,
                            (subtractItem) => {
                              if (item.solid && subtractItem.solid) {
                                item = { ...item, solid: solidDifference(item.solid, subtractItem.solid) };
                              } else if (item.z0Surface && subtractItem.z0Surface) {
                                item = { ...item, z0Surface: z0SurfaceDifference(item.z0Surface, subtractItem.z0Surface) };
                              } else if (item.paths && subtractItem.paths) {
                                item = { ...item, paths: pathsDifference(item.paths, subtractItem.paths) };
                              }
                            });
                 }
                 return item;
               });
  }
};
*/
