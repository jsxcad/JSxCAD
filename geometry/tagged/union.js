import { getPaths } from './getPaths';
import { getSolids } from './getSolids';
import { getSurfaces } from './getSurfaces';
import { getZ0Surfaces } from './getZ0Surfaces';
import { union as pathsUnion } from '@jsxcad/geometry-paths';
import { union as solidUnion } from '@jsxcad/algorithm-bsp-surfaces';
import { union as z0SurfaceUnion } from '@jsxcad/geometry-z0surface';
import { union as surfaceUnion } from '@jsxcad/geometry-surface';

export const union = (baseGeometry, ...geometries) => {
  const result = { assembly: [] };
  // Solids.
  const solids = geometries.flatMap(geometry => getSolids(geometry).map(item => item.solid));
  for (const { solid, tags } of getSolids(baseGeometry)) {
    result.assembly.push({ solid: solidUnion(solid, ...solids), tags });
  }
  // Z0Surfaces.
  const z0Surfaces = geometries.flatMap(geometry => getZ0Surfaces(geometry).map(item => item.z0Surface));
  for (const { z0Surface, tags } of getZ0Surfaces(baseGeometry)) {
    result.assembly.push({ z0Surface: z0SurfaceUnion(z0Surface, ...z0Surfaces), tags });
  }
  // Surfaces.
  const surfaces = geometries.flatMap(geometry => getSurfaces(geometry).map(item => item.surface));
  for (const { surface, tags } of getSurfaces(baseGeometry)) {
    result.assembly.push({ surface: surfaceUnion(surface, ...surfaces), tags });
  }
  // Paths.
  const pathsets = geometries.flatMap(geometry => getPaths(geometry).map(item => item.paths));
  for (const { paths, tags } of getPaths(baseGeometry)) {
    result.assembly.push({ paths: pathsUnion(paths, ...pathsets), tags });
  }
  // FIX: Surfaces, Paths, etc.
  return result;
}

/*
// FIX: Due to disjointedness, it should be correct to only extend the most recently added items in an assembly.
export const union = (geometry, ...geometries) => {
  if (geometries.length === 0) {
    // Nothing to do.
    return geometry;
  } else {
    return map(geometry,
               (item) => {
                 for (const unionGeometry of geometries) {
                   eachItem(unionGeometry,
                            (unionItem) => {
                              if (item.solid && unionItem.solid) {
                                item = { solid: solidUnion(item.solid, unionItem.solid) };
                              } else if (item.z0Surface && unionItem.z0Surface) {
                                item = { z0Surface: z0SurfaceUnion(item.z0Surface, unionItem.z0Surface) };
                              } else if (item.paths && unionItem.paths) {
                                item = { paths: pathsUnion(item.paths, unionItem.paths) };
                              }
                            });
                 }
                 return item;
               });
  }
};
*/
