import { eachItem } from './eachItem';

export const getSurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry,
           item => {
             if (item.z0Surface) {
               surfaces.push(item.z0Surface);
             } else if (item.surface) {
               surfaces.push(item.surface);
             }
           });
  return surfaces;
};
