import { eachNonVoidItem } from './eachNonVoidItem';

export const getNonVoidSolids = (geometry) => {
  const solids = [];
  eachNonVoidItem(geometry, (item) => {
    if (item.solid) {
      solids.push(item);
    }
  });
  return solids;
};
