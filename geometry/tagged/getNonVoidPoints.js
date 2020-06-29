import { eachNonVoidItem } from './eachNonVoidItem';

export const getNonVoidPoints = (geometry) => {
  const pointsets = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.kind === 'points') {
      pointsets.push(item);
    }
  });
  return pointsets;
};
