import { eachNonVoidItem } from './eachNonVoidItem';

export const getAnyNonVoidSurfaces = (geometry) => {
  const surfaces = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.surface) {
      surfaces.push(item);
    }
    if (item.z0Surface) {
      surfaces.push(item);
    }
  });
  return surfaces;
};
