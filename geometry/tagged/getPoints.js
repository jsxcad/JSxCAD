import { eachItem } from './eachItem';

export const getPoints = (geometry) => {
  const pointsets = [];
  eachItem(geometry, (item) => {
    if (item.points) {
      pointsets.push(item);
    }
  });
  return pointsets;
};
