import { eachItem } from './eachItem';

export const getPaths = (geometry) => {
  const pathsets = [];
  eachItem(geometry,
           item => {
             if (item.paths) {
               pathsets.push(item);
             }
           });
  return pathsets;
};
