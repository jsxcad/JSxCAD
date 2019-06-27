import { eachItem } from './eachItem';
import { map } from './map';
import { difference as pathsDifference } from '@jsxcad/geometry-paths';
import { difference as solidDifference } from '@jsxcad/algorithm-bsp-surfaces';
import { difference as z0SurfaceDifference } from '@jsxcad/geometry-z0surface';

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
