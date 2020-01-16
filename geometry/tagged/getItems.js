import { eachItem } from './eachItem';

export const getItems = (geometry) => {
  const items = [];
  eachItem(geometry,
           item => {
             if (item.item) {
               items.push(item);
             }
           },
           false);
  return items;
};
