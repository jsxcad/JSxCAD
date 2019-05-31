import { eachItem } from './eachItem';
import { map } from './map';
import { union as pathsUnion } from '@jsxcad/geometry-paths';
import { union as solidUnion } from '@jsxcad/algorithm-bsp-surfaces';
import { union as z0SurfaceUnion } from '@jsxcad/geometry-z0surface';

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
