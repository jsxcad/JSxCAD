import { eachNonVoidItem } from './eachNonVoidItem.js';

export const getNonVoidPolygonsWithHoles = (geometry) => {
  const polygons = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.type === 'polygonsWithHoles') {
      polygons.push(item);
    }
  });
  return polygons;
};
