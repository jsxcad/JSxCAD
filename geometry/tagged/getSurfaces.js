import { eachItem } from './eachItem';

export const getSurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry,
           item => {
             if (item.surface) {
               surfaces.push(item);
             } else if (item.surface) {
               surfaces.push(item);
             }
           });
  return surfaces;
};
