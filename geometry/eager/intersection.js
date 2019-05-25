import { eachItem } from './eachItem';
import { map } from './map';
import { intersection as pathsIntersection } from '@jsxcad/geometry-paths';
import { intersection as solidIntersection } from '@jsxcad/algorithm-bsp-surfaces';
import { intersection as z0SurfaceIntersection } from '@jsxcad/geometry-z0surface';

export const intersection = (geometry, ...geometries) => {
  if (geometries.length === 0) {
    // Nothing to do.
    return geometry;
  } else {
    return map(geometry,
               (item) => {
                 for (const intersectGeometry of geometries) {
                   eachItem(intersectGeometry,
                            (intersectItem) => {
                              if (item.solid && intersectItem.solid) {
                                item = { solid: solidIntersection(item.solid, intersectItem.solid) };
                              } else if (item.z0Surface && intersectItem.z0Surface) {
                                item = { z0Surface: z0SurfaceIntersection(item.z0Surface, intersectItem.z0Surface) };
                              } else if (item.paths && intersectItem.paths) {
                                item = { paths: pathsIntersection(item.paths, intersectItem.paths) };
                              }
                            });
                 }
                 return item;
               });
  }
};
