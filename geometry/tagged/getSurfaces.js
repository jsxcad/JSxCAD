import { eachItem } from './eachItem';

export const getSurfaces = (geometry) => {
  const surfaces = [];
  eachItem(geometry, (item) => {
    if (item.type === 'surface') {
      surfaces.push(item);
    }
  });
  return surfaces;
};
