import { eachItem } from './eachItem';

export const getSurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry,
           item => {
             console.log(`QQ/getSurfaces/item: ${JSON.stringify(item)}`);
             if (item.z0Surface) {
               surfaces.push(item.z0Surface);
             } else if (item.surface) {
               surfaces.push(item.surface);
             }
           });
  console.log(`QQ/getSurfaces/surfaces: ${JSON.stringify(surfaces)}`);
  return surfaces;
};
