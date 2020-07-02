import { eachNonVoidItem } from './eachNonVoidItem.js';

export const getNonVoidZ0Surfaces = (geometry) => {
  const z0Surfaces = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.type === 'z0Surface') {
      z0Surfaces.push(item);
    }
  });
  return z0Surfaces;
};
