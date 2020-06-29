import { eachNonVoidItem } from './eachNonVoidItem';

export const getNonVoidSurfaces = (geometry) => {
  const surfaces = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.type === 'surface') {
      surfaces.push(item);
    }
  });
  return surfaces;
};
