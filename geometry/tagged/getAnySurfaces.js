import { eachItem } from './eachItem';

export const getAnySurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry,
           item => {
             if (item.surface && item.surface.length > 0) {
               surfaces.push(item);
             }
             if (item.z0Surface && item.z0Surface.length > 0) {
               surfaces.push(item);
             }
           });
  return surfaces;
};
