import { eachItem } from './eachItem';

export const getSolids = (geometry) => {
  const solids = [];
  eachItem(geometry, (item) => {
    if (item.type === 'solid') {
      solids.push(item);
    }
  });
  return solids;
};
