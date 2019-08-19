import { eachItem } from './eachItem';

export const getSurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry,
           item => {
             if (item.surface && item.surface.length > 0) {
               surfaces.push(item);
             }
           });
  return surfaces;
};
