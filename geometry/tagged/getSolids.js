import { eachItem } from './eachItem';

export const getSolids = (geometry) => {
  const solids = [];
  eachItem(geometry,
           item => {
             if (item.solid) {
               solids.push(item.solid);
             }
           });
  return solids;
};
