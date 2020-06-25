import { eachNonVoidItem } from './eachNonVoidItem';

export const getNonVoidZ0Surfaces = (geometry) => {
  const z0Surfaces = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.z0Surface) {
      z0Surfaces.push(item);
    }
  });
  return z0Surfaces;
};
