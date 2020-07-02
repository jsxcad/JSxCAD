import { eachItem } from './eachItem.js';

export const getSolids = (geometry) => {
  const solids = [];
  eachItem(geometry, (item) => {
    if (item.type === 'solid') {
      solids.push(item);
    }
  });
  return solids;
};
