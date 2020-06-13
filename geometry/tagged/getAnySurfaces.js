import { eachItem } from './eachItem';

export const getAnySurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry, (item) => {
    if (item.surface) {
      surfaces.push(item);
    }
    if (item.z0Surface) {
      surfaces.push(item);
    }
  });
  return surfaces;
};
